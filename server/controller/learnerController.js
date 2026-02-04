import Learner from "../models/learner.js";
import LearningPath from "../models/learningPath.js";
import Teacher from "../models/teacher.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { updateLearnerStats , getAggregatedActivity } from "../services/learnerStats.js";
import { calculateBadges } from "../utils/badges.js";
import dayjs from "dayjs";
// Register a new learner

export const registerLearner = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.json({ success: false, message: "Please fill all the fields" });
        }

        const existingLearner = await Learner.findOne({ email });
        if (existingLearner) {
            return res.status(400).json({ message: 'Learner already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        if (!hashedPassword) {
            return res.json({ success: false, message: "Error hashing password" });
        }

        const newLearner = await Learner.create({
            fullName,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { id: newLearner._id, role: "learner" }, 
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

            res.cookie("learnerToken", token, {
            httpOnly: true,
            secure: true,
            sameSite:  'none' ,
            path : '/'
            
          });

        return res.json({
            success: true,
            message: "Learner registered successfully",
            learner: {
                email: newLearner.email,
                name: newLearner.fullName,
                createdAt: newLearner.createdAt ? newLearner.createdAt.toISOString().split("T")[0] : undefined
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

// Login learner
export const loginLearner = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "Please fill all the fields" });
        }

        const learner = await Learner.findOne({ email });
        if (!learner) {
            return res.status(400).json({ message: 'Learner not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, learner.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
          { id: learner._id }, 
          process.env.JWT_SECRET, 
          { expiresIn: '30d'
        });

        res.cookie("learnerToken", token, {
        httpOnly: true,
        sameSite: "none",   // ✅ or 'none' + secure:true if using HTTPS
        secure: true,     // ✅ false for localhost
        path: "/",         // ✅ ensure wide path
        maxAge: 7 * 24 * 60 * 60 * 1000
        });


        return res.json({
            success: true,
            message: "Learner logged in successfully",
            learner: {
                email: learner.email,
                name: learner.fullName,
                createdAt:  learner.createdAt,
                learningHours : learner.totalLearningHours,
                totalCoursesEnrolled : learner.totalCoursesEnrolled,
                lastAccessedWebsite : learner.lastAccessedWebsite,
                phone: learner.phone,
                bio: learner.bio,
                educationLevel: learner.educationLevel,
                interests: learner.interests,
                university: learner.university,
                learningStyle: learner.learningStyle,
                goals: learner.goals,
                socialLinks: learner.socialLinks
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}


//is-auth
export const isAuthLearner = async (req, res) => {
    try {
        const token = req.cookies.learnerToken;
        if (!token) {
            return res.json({ success: false, message: "No token provided" });
        }
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.json({ success: false, message: "Invalid token" });
        }
        const learner = await Learner.findById(decoded.id);
        if (!learner) {
            return res.json({ success: false, message: "learner not found" });
        }
        return res.json({
          success: true,
          learner: {
            email: learner.email,
            name: learner.fullName,
            id: learner._id,
            totalcoursesEnrolled: learner.totalcoursesEnrolled,
            totalLearningHours: learner.totalLearningHours,
            enrolledPaths: learner.enrolledPaths, // not enrollPaths
            progress: learner.progressStats, // or progress if you have it
            createdAt: learner.createdAt,
            lastAccessedWebsite : learner.lastAccessedWebsite,
            phone: learner.phone,
            bio: learner.bio,
            educationLevel: learner.educationLevel,
            interests: learner.interests,
            university: learner.university,
            learningStyle: learner.learningStyle,
            goals: learner.goals,
            socialLinks: learner.socialLinks

          }
        });

        
    } catch (error) {
        console.error("Error checking authentication:", error);
        return res.json({ success: false, message: "Error checking authentication" });
    }
}

// Logout learner
export const logoutLearner = async (req, res) => {
  try {
    res.clearCookie("learnerToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",         // ✅ Must match the path used when setting
    });
    return res.json({ success: true, message: "Learner logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Error logging out" });
  }
};


export const enrollInPath = async (req, res) => {
  try {
    const {pathId } = req.body;
    const studentId = req.userId;

    

    // ✅ Fetch path to get module IDs
    const path = await LearningPath.findById(pathId).lean();
    if (!path) return res.status(404).json({ message: "Learning path not found" });

    const moduleIds = path.content?.map((m) => m._id);

    // ✅ Add enrollment entry with all modules listed
    await Learner.updateOne(
      { _id: studentId, "enrolledPaths.pathId": { $ne: pathId } }, // prevent duplicate enrollment
      {
        $push: {
          enrolledPaths: {
            pathId,
            totalModules: moduleIds,
            completedModules: [],
            progressPercent: 0,
            lastAccessed: new Date(),
          },
        },
      }
    );

    await LearningPath.updateOne(
      { _id: pathId },
      { $addToSet: { learners: studentId } }
    );

    res.json({ message: "Enrolled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error enrolling learner" });
  }
};



export const enrollingInPath = async (req, res) => {
  try {
    const { pathId } = req.body; // path user is enrolling in
    const studentId = req.user.id; // from auth middleware
    console.log("Enrolling student ID:", studentId, "in path ID:", pathId);

    // Find the path
    const path = await LearningPath.findById(pathId);
    if (!path) {
      return res.status(404).json({ message: "Learning path not found" });
    }
    // Update the learner's enrolledPaths array
    await Learner.updateOne(
      { _id: studentId },
      {
        $addToSet: { enrolledPaths: pathId }, // Use $addToSet to avoid duplicates
        $inc: { totalcoursesEnrolled: 1, totalLearningHours: path.totalHours || 0 } // Increment counters
      }
    );
    console.log("Learner updated with new path:", pathId);

    res.status(200).json({ message: "Enrolled in path successfully!" });
  } catch (error) {
    console.error("Error enrolling in path:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEnrolledPaths = async (req, res) => {
    try {
    const learnerId = req.user._id; // from JWT/cookie middleware
    const { pathId } = req.params;

    const learner = await Learner.findById(learnerId);
    const enrolled = learner.enrolledPaths?.includes(pathId);

    res.json({ enrolled: Boolean(enrolled) });
  } catch (err) {
    res.status(500).json({ message: "Error checking enrollment" });
  }
};

export const getAllLearners = async (req, res) => {
  try {
    const learners = await Learner.find();
    res.json({ success: true, learners });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch learners" });
  }
};

export const addLearningHours = async (req, res) => {
  try {
    const { learnerId, hours } = req.body;
    const learner = await Learner.findById(learnerId);
    if (!learner) return res.status(404).json({ message: "Learner not found" });

    const today = new Date();
    const existingEntry = learner.learningActivity.find(entry =>
      entry.date.toDateString() === today.toDateString()
    );

    if (existingEntry) existingEntry.hoursSpent += hours;
    else learner.learningActivity.push({ date: today, hoursSpent: hours });

    await learner.save();

    // ✅ Update stats after adding hours
    await updateLearnerStats(learner._id);

    res.json({ message: "Learning hours added and stats updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getLearnerStats = async (req, res) => {
  try {
    const { learnerId } = req.params;
    // 1. Update basic stats (hours, streaks)
    const updatedLearner = await updateLearnerStats(learnerId); 

    // 2. Fetch Enrolled Paths with their Skill Definitions
    // We need to populate 'pathId' to access the 'skills' array we just added
    const learnerWithSkills = await Learner.findById(learnerId).populate({
      path: 'enrolledPaths.pathId',
      select: 'title skills' // Only fetch title and skills
    });

    // 3. 🧠 CALCULATE SKILL POINTS
    const skillMap = {};

    learnerWithSkills.enrolledPaths.forEach((enrollment) => {
      const course = enrollment.pathId;

      if (!course || !Array.isArray(course.skills) || course.skills.length === 0) return;

      const progressFactor = (enrollment.progressPercent || 0) / 100;

      course.skills.forEach((skill) => {
        if (!skillMap[skill.name]) {
          skillMap[skill.name] = { name: skill.name, earned: 0, total: 0 };
        }

        skillMap[skill.name].total += skill.points;
        skillMap[skill.name].earned += skill.points * progressFactor;
      });
    });

    const maxSkillPoints = Math.max(
      ...Object.values(skillMap).map(s => s.total)
    );

    const skillProfile = Object.values(skillMap).map(s => ({
      subject: s.name,
      A: Math.round((s.earned / maxSkillPoints) * 100),
      fullMark: 100
    }));


    // If no skills yet, provide default data so the chart doesn't crash
    const finalSkillProfile = skillProfile.length > 0 ? skillProfile : [
      { subject: 'Coding', A: 0, fullMark: 100 },
      { subject: 'Design', A: 0, fullMark: 100 },
      { subject: 'Communication', A: 0, fullMark: 100 },
      { subject: 'Logic', A: 0, fullMark: 100 },
      { subject: 'Management', A: 0, fullMark: 100 },
    ];

    const aggregatedActivity = getAggregatedActivity(updatedLearner.learningActivity);

    const badges = calculateBadges(updatedLearner);

    res.json({
      totalLearningHours: updatedLearner.totalLearningHours,
      progressStats: updatedLearner.progressStats,
      learningActivity: aggregatedActivity,
      currentStreak: updatedLearner.currentStreak,
      totalCoursesEnrolled: updatedLearner.totalCoursesEnrolled,
      skillProfile: finalSkillProfile , // ✅ Sending the calculated skills
      badges : badges
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching stats" });
  }
};

export const markModuleCompleted = async (req, res) => {
  try {
    const { studentId, pathId, moduleId, action, hoursSpent = 0 } = req.body;

    if (!studentId || !pathId || !moduleId) {
      return res.status(400).json({ message: "studentId, pathId and moduleId required" });
    }

    const learner = await Learner.findById(studentId);
    if (!learner) return res.status(404).json({ message: "Learner not found" });

    const enrolledPath = learner.enrolledPaths.find(
      (p) => p.pathId.toString() === pathId
    );
    if (!enrolledPath) return res.status(404).json({ message: "Not enrolled in this path" });

    if (action === "remove") {
      enrolledPath.completedModules = enrolledPath.completedModules.filter(
        (id) => id.toString() !== moduleId
      );
    } else {
      if (!enrolledPath.completedModules.includes(moduleId)) {
        enrolledPath.completedModules.push(moduleId);
      }
    }

    const completed = enrolledPath.completedModules.length;
    const total = enrolledPath.totalModules.length;
    enrolledPath.progressPercent = total > 0 ? (completed / total) * 100 : 0;
    enrolledPath.lastAccessed = new Date();

    // Log activity
    if (hoursSpent > 0) {
      // Check if an entry exists for TODAY first to keep array cleaner (Optional optimization)
      // For now, we push a new entry and rely on getLearnerStats aggregation
      learner.learningActivity.push({
        pathId,
        moduleId,
        hoursSpent,
        date: new Date(),
      });
    }

    await learner.save();
    await updateLearnerStats(learner._id); // Recalculate total hours/streak

    return res.json({
      message: action === "remove" ? "Module marked as incomplete" : "Module marked as completed",
      progress: enrolledPath.progressPercent.toFixed(2) + "%",
      totalLearningHours: learner.totalLearningHours.toFixed(2),
    });
  } catch (error) {
    console.error("❌ markModuleCompleted error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getLearningProgress = async (req, res) => {
  try {
    const { studentId, period } = req.query;
    const learner = await Learner.findById(studentId);
    if (!learner) return res.status(404).json({ message: "Learner not found" });

    const now = new Date();
    const cutoff = new Date();

    if (period === "weekly") cutoff.setDate(now.getDate() - 7);
    else cutoff.setDate(now.getDate() - 1);

    const recentPaths = learner.enrolledPaths.filter(
      (p) => new Date(p.lastAccessed) >= cutoff
    );

    const totalProgress = recentPaths.reduce(
      (sum, p) => sum + p.progressPercent,
      0
    );

    res.json({
      totalPaths: recentPaths.length,
      avgProgress: recentPaths.length > 0 ? (totalProgress / recentPaths.length).toFixed(2) : 0,
      lastUpdated: now,
    });
  } catch (error) {
    console.error("❌ getLearningProgress error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  /api/learner/update-last-access
export const updateLastAccess = async (req, res) => {
  try {
    const learnerId = req.userId;

    const updated = await Learner.findByIdAndUpdate(
      learnerId,
      {
        lastAccessedWebsite: new Date(),
      },
      { new: true }
    );

    res.json({ success: true, learner: updated });
  } catch (error) {
    console.error("Error updating last access:", error);
    res.status(500).json({ success: false, message: "Failed to update last access" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const learnerId = req.userId;
    const updates = req.body;
    const updatedLearner = await Learner.findByIdAndUpdate(learnerId, updates, { new: true });

    if (!updatedLearner) {
      return res.status(404).json({ success: false, message: "Learner not found" });
    }
    res.json({ success: true, message: "Profile updated successfully", learner: updatedLearner });
  } catch (error) { 
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
};




export const trackHeartbeat = async (req, res) => {
  try {
    const { pathId, moduleId, resourceId, duration } = req.body;
    const learnerId = req.userId;

    if (!pathId || !moduleId || !duration) {
      return res.status(400).json({ message: "pathId, moduleId, duration required" });
    }

    // 1. Find learner
    const learner = await Learner.findById(learnerId);
    if (!learner) return res.status(404).json({ message: "Learner not found" });

    // 2. Find enrolled path
    const enrolledPath = learner.enrolledPaths.find(
      (p) => p.pathId.toString() === pathId
    );

    if (!enrolledPath) {
      return res.status(403).json({ message: "Not enrolled in this path" });
    }

    // 3. Update resource usage (aggregate, not duplicate)
    const targetResource = resourceId || "module_view";

    let usageEntry = enrolledPath.resourceUsage.find(
      (r) =>
        r.resourceId === targetResource &&
        r.moduleId?.toString() === moduleId
    );

    if (usageEntry) {
      usageEntry.timeSpent += duration;
      usageEntry.lastAccessed = new Date();
    } else {
      enrolledPath.resourceUsage.push({
        resourceId: targetResource,
        moduleId: moduleId,
        timeSpent: duration,
        lastAccessed: new Date(),
      });
    }

    // 4. Update total learning hours (seconds → hours)
    const hoursAdded = duration / 3600;
    learner.totalLearningHours += hoursAdded;

    // 5. Update daily activity log
    const today = new Date();
    const todayLog = learner.learningActivity.find(
      (e) => e.date.toDateString() === today.toDateString()
    );

    if (todayLog) {
      todayLog.hoursSpent += hoursAdded;
      todayLog.pathId = pathId;
      todayLog.moduleId = moduleId;
    } else {
      learner.learningActivity.push({
        date: today,
        hoursSpent: hoursAdded,
        pathId,
        moduleId,
      });
    }

    await learner.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Heartbeat Error:", error);
    return res.status(500).json({ message: "Tracking failed" });
  }
};

export const enrollByCode = async (req, res) => {
  try {
    const { code } = req.body;
    const studentId = req.userId;

    if (!code) return res.status(400).json({ message: "Class code is required" });

    // 1. Find Path by Code
    const path = await LearningPath.findOne({ code });
    if (!path) {
      return res.status(404).json({ message: "Invalid class code. Please check and try again." });
    }

    // 2. Check if already enrolled
    const learner = await Learner.findById(studentId);
    const isEnrolled = learner.enrolledPaths.some(p => p.pathId.toString() === path._id.toString());

    if (isEnrolled) {
      return res.status(400).json({ message: "You are already enrolled in this class." });
    }

    // 3. Enroll Learner
    const moduleIds = path.content?.map((m) => m._id) || [];
    
    learner.enrolledPaths.push({
      pathId: path._id,
      totalModules: moduleIds,
      completedModules: [],
      progressPercent: 0,
      resourceUsage: [], // Initialize for our tracking
      lastAccessed: new Date(),
    });

    // Update Learner Stats
    learner.totalcoursesEnrolled += 1;
    
    // Add learner to the path's student list
    path.learners.push(studentId);

    await learner.save();
    await path.save();

    res.status(200).json({ 
      success: true, 
      message: `Successfully joined "${path.title}"`,
      pathId: path._id 
    });

  } catch (error) {
    console.error("Enroll by code error:", error);
    res.status(500).json({ message: "Server error while joining class" });
  }
};
