
import Learner from "../models/learner.js";
import LearningPath from "../models/learningPath.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import {
  updateLearnerStats,
  getAggregatedActivity,
  getRecentActivity,
} from "../services/learnerStats.js";
import { calculateBadges } from "../utils/badges.js";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Fields returned in every auth response — never expose password / OTP */
const PUBLIC_PROFILE_FIELDS = {
  email: 1,
  fullName: 1,
  bio: 1,
  phone: 1,
  educationLevel: 1,
  learningStyle: 1,
  interests: 1,
  goals: 1,
  university: 1,
  socialLinks: 1,
  role: 1,
  totalLearningHours: 1,
  totalCoursesEnrolled: 1,
  currentStreak: 1,
  longestStreak: 1,
  enrolledPaths: 1,
  progressStats: 1,
  analytics: 1,
  lastAccessedWebsite: 1,
  createdAt: 1,
};

const signToken = (id) =>
  jwt.sign({ id, role: "learner" }, process.env.JWT_SECRET, { expiresIn: "7d" });

const setCookieOptions = () => ({
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
});

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────

export const registerLearner = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const existing = await Learner.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const learner = await Learner.create({ fullName, email, password: hashedPassword });

    // Increment login count
    learner.analytics.loginCount = 1;
    await learner.save();

    res.cookie("learnerToken", signToken(learner._id), setCookieOptions());

    return res.status(201).json({
      success: true,
      message: "Registered successfully.",
      learner: { email: learner.email, name: learner.fullName, createdAt: learner.createdAt },
    });
  } catch (error) {
    console.error("[registerLearner]", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const loginLearner = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const learner = await Learner.findOne({ email }).select("+password");
    if (!learner) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const passwordMatch = await bcrypt.compare(password, learner.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    // Update last access + login count atomically (no need to re-fetch)
    await Learner.updateOne(
      { _id: learner._id },
      { $set: { lastAccessedWebsite: new Date() }, $inc: { "analytics.loginCount": 1 } }
    );

    res.cookie("learnerToken", signToken(learner._id), setCookieOptions());

    return res.json({
      success: true,
      message: "Logged in successfully.",
      learner: {
        email: learner.email,
        fullName: learner.fullName,
        createdAt: learner.createdAt,
        learningHours: learner.totalLearningHours,
        totalCoursesEnrolled: learner.totalCoursesEnrolled,
        lastAccessedWebsite: learner.lastAccessedWebsite,
        phone: learner.phone,
        bio: learner.bio,
        educationLevel: learner.educationLevel,
        interests: learner.interests,
        university: learner.university,
        learningStyle: learner.learningStyle,
        goals: learner.goals,
        socialLinks: learner.socialLinks,
      },
    });
  } catch (error) {
    console.error("[loginLearner]", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const isAuthLearner = async (req, res) => {
  try {
    const token = req.cookies?.learnerToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }

    const learner = await Learner.findById(decoded.id).select(PUBLIC_PROFILE_FIELDS);
    if (!learner) {
      return res.status(404).json({ success: false, message: "Learner not found." });
    }

    return res.json({ success: true, learner });
  } catch (error) {
    console.error("[isAuthLearner]", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const logoutLearner = async (_req, res) => {
  try {
    res.clearCookie("learnerToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });
    return res.json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("[logoutLearner]", error);
    return res.status(500).json({ success: false, message: "Error logging out." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────────────────────────────────────

export const updateProfile = async (req, res) => {
  try {
    const learnerId = req.userId;

    // Whitelist updatable fields — never let the client touch password/role/analytics
    const ALLOWED = [
      "fullName", "bio", "phone", "educationLevel", "learningStyle",
      "interests", "goals", "university", "socialLinks",
    ];

    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => ALLOWED.includes(key))
    );

    if (!Object.keys(updates).length) {
      return res.status(400).json({ success: false, message: "No valid fields to update." });
    }

    const updated = await Learner.findByIdAndUpdate(learnerId, updates, {
      new: true,
      runValidators: true,
      select: PUBLIC_PROFILE_FIELDS,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Learner not found." });
    }

    return res.json({ success: true, message: "Profile updated.", learner: updated });
  } catch (error) {
    console.error("[updateProfile]", error);
    return res.status(500).json({ success: false, message: "Error updating profile." });
  }
};

export const updateLastAccess = async (req, res) => {
  try {
    await Learner.findByIdAndUpdate(req.userId, { lastAccessedWebsite: new Date() });
    return res.json({ success: true });
  } catch (error) {
    console.error("[updateLastAccess]", error);
    return res.status(500).json({ success: false, message: "Failed to update last access." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ENROLLMENT
// ─────────────────────────────────────────────────────────────────────────────

export const enrollInPath = async (req, res) => {
  try {
    const { pathId } = req.body;
    const studentId = req.userId;

    if (!pathId) {
      return res.status(400).json({ success: false, message: "pathId is required." });
    }

    const path = await LearningPath.findById(pathId).lean();
    if (!path) return res.status(404).json({ message: "Learning path not found." });

    const moduleIds = path.content?.map((m) => m._id) ?? [];

    const result = await Learner.updateOne(
      { _id: studentId, "enrolledPaths.pathId": { $ne: pathId } },
      {
        $push: {
          enrolledPaths: {
            pathId,
            totalModules: moduleIds,
            completedModules: [],
            progressPercent: 0,
            resourceUsage: [],
            lastAccessed: new Date(),
          },
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(409).json({ success: false, message: "Already enrolled." });
    }

    await LearningPath.updateOne({ _id: pathId }, { $addToSet: { learners: studentId } });

    return res.json({ success: true, message: "Enrolled successfully." });
  } catch (error) {
    console.error("[enrollInPath]", error);
    return res.status(500).json({ success: false, message: "Error enrolling learner." });
  }
};

export const enrollByCode = async (req, res) => {
  try {
    const { code } = req.body;
    const studentId = req.userId;

    if (!code) return res.status(400).json({ message: "Class code is required." });

    const path = await LearningPath.findOne({ code });
    if (!path) {
      return res.status(404).json({ message: "Invalid class code. Please check and try again." });
    }

    const learner = await Learner.findById(studentId);
    if (!learner) return res.status(404).json({ message: "Learner not found." });

    const alreadyEnrolled = learner.enrolledPaths.some(
      (p) => p.pathId.toString() === path._id.toString()
    );

    if (alreadyEnrolled) {
      return res.status(409).json({ message: "You are already enrolled in this class." });
    }

    const moduleIds = path.content?.map((m) => m._id) ?? [];

    learner.enrolledPaths.push({
      pathId: path._id,
      totalModules: moduleIds,
      completedModules: [],
      progressPercent: 0,
      resourceUsage: [],
      lastAccessed: new Date(),
    });

    path.learners.push(studentId);

    await Promise.all([learner.save(), path.save()]);

    return res.status(200).json({
      success: true,
      message: `Successfully joined "${path.title}"`,
      pathId: path._id,
    });
  } catch (error) {
    console.error("[enrollByCode]", error);
    return res.status(500).json({ message: "Server error while joining class." });
  }
};

export const getEnrolledPaths = async (req, res) => {
  try {
    const learnerId = req.userId;
    const { pathId } = req.params;

    const learner = await Learner.findById(learnerId).select("enrolledPaths");
    if (!learner) return res.status(404).json({ message: "Learner not found." });

    const enrolled = learner.enrolledPaths.some(
      (p) => p.pathId.toString() === pathId
    );

    return res.json({ enrolled });
  } catch (err) {
    console.error("[getEnrolledPaths]", err);
    return res.status(500).json({ message: "Error checking enrollment." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS TRACKING
// ─────────────────────────────────────────────────────────────────────────────

export const markModuleCompleted = async (req, res) => {
  try {
    const { studentId, pathId, moduleId, action = "add", hoursSpent = 0 } = req.body;
    console.log("markModuleCompleted called with:", { studentId, pathId, moduleId, action, hoursSpent });

    if (!studentId || !pathId || !moduleId) {
      return res.status(400).json({ message: "studentId, pathId, and moduleId are required." });
    }

    const learner = await Learner.findById(studentId);
    if (!learner) return res.status(404).json({ message: "Learner not found." });

    const enrolledPath = learner.enrolledPaths.find(
      (p) => p.pathId.toString() === pathId
    );
    if (!enrolledPath) {
      return res.status(404).json({ message: "Not enrolled in this path." });
    }

    // ── Update completedModules ──────────────────────────────────────────────
    if (action === "remove") {
      enrolledPath.completedModules = enrolledPath.completedModules.filter(
        (id) => id.toString() !== moduleId
      );
    } else {
      const alreadyDone = enrolledPath.completedModules.some(
        (id) => id.toString() === moduleId
      );
      if (!alreadyDone) {
        enrolledPath.completedModules.push(moduleId);
      }
    }

    // ── Recalculate progress ─────────────────────────────────────────────────
    // If totalModules is empty, try to fetch from the LearningPath document
    if (!enrolledPath.totalModules?.length) {
      const path = await LearningPath.findById(pathId).select("content").lean();
      if (path?.content?.length) {
        enrolledPath.totalModules = path.content.map((m) => m._id);
      }
    }

    const completed = enrolledPath.completedModules.length;
    const total     = enrolledPath.totalModules.length;
    enrolledPath.progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
    enrolledPath.lastAccessed    = new Date();

    // ── Log learning activity ────────────────────────────────────────────────
    if (hoursSpent > 0) {
      const todayStr = new Date().toDateString();
      const todayLog = learner.learningActivity.find(
        (e) => new Date(e.date).toDateString() === todayStr
      );

      if (todayLog) {
        todayLog.hoursSpent += hoursSpent;
        learner.markModified("learningActivity");
      } else {
        learner.learningActivity.push({ pathId, moduleId, hoursSpent, date: new Date() });
      }
    }

    // ── CRITICAL FIX: tell Mongoose the nested array changed ────────────────
    learner.markModified("enrolledPaths");

    await learner.save();
    await updateLearnerStats(learner._id);

    return res.json({
      success:          true,
      message:          action === "remove" ? "Module marked incomplete." : "Module marked complete.",
      progressPercent:  enrolledPath.progressPercent,
      completedModules: completed,
      totalModules:     total,
    });
  } catch (error) {
    console.error("[markModuleCompleted]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Heartbeat endpoint — called every N seconds while the learner has a module open.
 * Accumulates time-on-task without double-counting within the same day.
 */
export const trackHeartbeat = async (req, res) => {
  try {
    const { pathId, moduleId, resourceId, duration } = req.body;
    const learnerId = req.userId;

    if (!pathId || !moduleId || !duration || duration <= 0) {
      return res.status(400).json({ message: "pathId, moduleId, and a positive duration are required." });
    }

    const learner = await Learner.findById(learnerId);
    if (!learner) return res.status(404).json({ message: "Learner not found." });

    const enrolledPath = learner.enrolledPaths.find(
      (p) => p.pathId.toString() === pathId
    );
    if (!enrolledPath) {
      return res.status(403).json({ message: "Not enrolled in this path." });
    }

    // Aggregate per-resource usage (avoid duplicate entries)
    const targetResource = resourceId || "module_view";
    let usage = enrolledPath.resourceUsage.find(
      (r) => r.resourceId === targetResource && r.moduleId?.toString() === moduleId
    );

    if (usage) {
      usage.timeSpent += duration;
      usage.lastAccessed = new Date();
    } else {
      enrolledPath.resourceUsage.push({
        resourceId: targetResource,
        moduleId,
        timeSpent: duration,
        lastAccessed: new Date(),
      });
    }

    // Convert seconds → hours and add to today's activity log
    const hoursAdded = duration / 3600;
    const todayStr = new Date().toDateString();
    const todayLog = learner.learningActivity.find(
      (e) => new Date(e.date).toDateString() === todayStr
    );

    if (todayLog) {
      todayLog.hoursSpent += hoursAdded;
    } else {
      learner.learningActivity.push({ date: new Date(), hoursSpent: hoursAdded, pathId, moduleId });
    }

    // Keep totalLearningHours in sync without calling the full updateLearnerStats
    learner.totalLearningHours += hoursAdded;

    await learner.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("[trackHeartbeat]", error);
    return res.status(500).json({ message: "Tracking failed." });
  }
};

export const addLearningHours = async (req, res) => {
  try {
    const { learnerId, hours } = req.body;
    if (!learnerId || !hours || hours <= 0) {
      return res.status(400).json({ message: "learnerId and positive hours are required." });
    }

    const learner = await Learner.findById(learnerId);
    if (!learner) return res.status(404).json({ message: "Learner not found." });

    const todayStr = new Date().toDateString();
    const existing = learner.learningActivity.find(
      (e) => new Date(e.date).toDateString() === todayStr
    );

    if (existing) existing.hoursSpent += hours;
    else learner.learningActivity.push({ date: new Date(), hoursSpent: hours });

    await learner.save();
    await updateLearnerStats(learner._id);

    return res.json({ success: true, message: "Learning hours added." });
  } catch (error) {
    console.error("[addLearningHours]", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// STATS & ANALYTICS
// ─────────────────────────────────────────────────────────────────────────────

export const getLearnerStats = async (req, res) => {
  try {
    const { learnerId } = req.params;

    const updatedLearner = await updateLearnerStats(learnerId);
    if (!updatedLearner) return res.status(404).json({ message: "Learner not found." });

    // Populate enrolled paths to calculate skill profile
    const learnerWithSkills = await Learner.findById(learnerId).populate({
      path: "enrolledPaths.pathId",
      select: "title skills",
    });

    // Build skill map weighted by course progress
    const skillMap = {};

    learnerWithSkills.enrolledPaths.forEach(({ pathId: course, progressPercent }) => {
      if (!course || !Array.isArray(course.skills) || !course.skills.length) return;

      const factor = (progressPercent ?? 0) / 100;

      course.skills.forEach(({ name, points }) => {
        if (!skillMap[name]) skillMap[name] = { earned: 0, total: 0 };
        skillMap[name].total  += points;
        skillMap[name].earned += points * factor;
      });
    });

    const skillValues = Object.values(skillMap);
    const maxPoints   = skillValues.length ? Math.max(...skillValues.map((s) => s.total)) : 1;

    const skillProfile =
      skillValues.length > 0
        ? Object.entries(skillMap).map(([name, { earned, total }]) => ({
            subject: name,
            A: Math.round((earned / (maxPoints || total || 1)) * 100),
            fullMark: 100,
          }))
        : [
            { subject: "Coding",        A: 0, fullMark: 100 },
            { subject: "Design",        A: 0, fullMark: 100 },
            { subject: "Communication", A: 0, fullMark: 100 },
            { subject: "Logic",         A: 0, fullMark: 100 },
            { subject: "Management",    A: 0, fullMark: 100 },
          ];

    const recentActivity = getRecentActivity(updatedLearner.learningActivity, 7);
    const badges         = calculateBadges(updatedLearner);

    return res.json({
      totalLearningHours:   updatedLearner.totalLearningHours,
      progressStats:        updatedLearner.progressStats,
      currentStreak:        updatedLearner.currentStreak,
      longestStreak:        updatedLearner.longestStreak,
      totalCoursesEnrolled: updatedLearner.totalCoursesEnrolled,
      learningActivity:     recentActivity,   // last 7 days, chart-ready
      skillProfile,
      badges,
    });
  } catch (error) {
    console.error("[getLearnerStats]", error);
    return res.status(500).json({ message: "Server error fetching stats." });
  }
};

export const getLearningProgress = async (req, res) => {
  try {
    const { studentId, period } = req.query;
    if (!studentId) return res.status(400).json({ message: "studentId is required." });

    const learner = await Learner.findById(studentId).select("enrolledPaths");
    if (!learner) return res.status(404).json({ message: "Learner not found." });

    const daysBack = period === "weekly" ? 7 : 1;
    const cutoff   = dayjs().subtract(daysBack, "day").toDate();

    const recentPaths = learner.enrolledPaths.filter(
      (p) => new Date(p.lastAccessed) >= cutoff
    );

    const avgProgress =
      recentPaths.length > 0
        ? recentPaths.reduce((sum, p) => sum + p.progressPercent, 0) / recentPaths.length
        : 0;

    return res.json({
      totalPaths:  recentPaths.length,
      avgProgress: parseFloat(avgProgress.toFixed(2)),
      period,
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error("[getLearningProgress]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllLearners = async (req, res) => {
  try {
    // Only expose safe fields to admin-level consumers
    const learners = await Learner.find().select("-password -resetOtp -resetOtpExpires");
    return res.json({ success: true, learners });
  } catch (error) {
    console.error("[getAllLearners]", error);
    return res.status(500).json({ success: false, message: "Failed to fetch learners." });
  }
};
