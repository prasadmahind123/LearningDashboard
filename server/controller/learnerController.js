// import Learner from "../models/learner.js";
// import LearningPath from "../models/learningPath.js";
// import Teacher from "../models/teacher.js";
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { updateLearnerStats , getAggregatedActivity } from "../services/learnerStats.js";
// import { calculateBadges } from "../utils/badges.js";
// import dayjs from "dayjs";
// // Register a new learner

// export const registerLearner = async (req, res) => {
//     try {
//         const { fullName, email, password } = req.body;

//         if (!fullName || !email || !password) {
//             return res.json({ success: false, message: "Please fill all the fields" });
//         }

//         const existingLearner = await Learner.findOne({ email });
//         if (existingLearner) {
//             return res.status(400).json({ message: 'Learner already exists' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         if (!hashedPassword) {
//             return res.json({ success: false, message: "Error hashing password" });
//         }

//         const newLearner = await Learner.create({
//             fullName,
//             email,
//             password: hashedPassword,
//         });

//         const token = jwt.sign(
//             { id: newLearner._id, role: "learner" }, 
//             process.env.JWT_SECRET,
//             { expiresIn: "7d" }
//         );

//             res.cookie("learnerToken", token, {
//             httpOnly: true,
//             secure: true,
//             sameSite:  'none' ,
//             path : '/'
            
//           });

//         return res.json({
//             success: true,
//             message: "Learner registered successfully",
//             learner: {
//                 email: newLearner.email,
//                 name: newLearner.fullName,
//                 createdAt: newLearner.createdAt ? newLearner.createdAt.toISOString().split("T")[0] : undefined
//             }
//         });

//     } catch (error) {
//         console.error("Registration error:", error);
//         return res.status(500).json({ success: false, message: "Server error" });
//     }
// }

// // Login learner
// export const loginLearner = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.json({ success: false, message: "Please fill all the fields" });
//         }

//         const learner = await Learner.findOne({ email });
//         if (!learner) {
//             return res.status(400).json({ message: 'Learner not found' });
//         }

//         const isPasswordValid = await bcrypt.compare(password, learner.password);
//         if (!isPasswordValid) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         const token = jwt.sign(
//           { id: learner._id }, 
//           process.env.JWT_SECRET, 
//           { expiresIn: '30d'
//         });

//         res.cookie("learnerToken", token, {
//         httpOnly: true,
//         sameSite: "none",   // ✅ or 'none' + secure:true if using HTTPS
//         secure: true,     // ✅ false for localhost
//         path: "/",         // ✅ ensure wide path
//         maxAge: 7 * 24 * 60 * 60 * 1000
//         });


//         return res.json({
//             success: true,
//             message: "Learner logged in successfully",
//             learner: {
//                 email: learner.email,
//                 name: learner.fullName,
//                 createdAt:  learner.createdAt,
//                 learningHours : learner.totalLearningHours,
//                 totalCoursesEnrolled : learner.totalCoursesEnrolled,
//                 lastAccessedWebsite : learner.lastAccessedWebsite,
//                 phone: learner.phone,
//                 bio: learner.bio,
//                 educationLevel: learner.educationLevel,
//                 interests: learner.interests,
//                 university: learner.university,
//                 learningStyle: learner.learningStyle,
//                 goals: learner.goals,
//                 socialLinks: learner.socialLinks
//             }
//         });

//     } catch (error) {
//         console.error("Login error:", error);
//         return res.status(500).json({ success: false, message: "Server error" });
//     }
// }


// //is-auth
// export const isAuthLearner = async (req, res) => {
//     try {
//         const token = req.cookies.learnerToken;
//         if (!token) {
//             return res.json({ success: false, message: "No token provided" });
//         }
//         let decoded;
//         try {
//             decoded = jwt.verify(token, process.env.JWT_SECRET);
//         } catch (error) {
//             return res.json({ success: false, message: "Invalid token" });
//         }
//         const learner = await Learner.findById(decoded.id);
//         if (!learner) {
//             return res.json({ success: false, message: "learner not found" });
//         }
//         return res.json({
//           success: true,
//           learner: {
//             email: learner.email,
//             name: learner.fullName,
//             id: learner._id,
//             totalcoursesEnrolled: learner.totalcoursesEnrolled,
//             totalLearningHours: learner.totalLearningHours,
//             enrolledPaths: learner.enrolledPaths, // not enrollPaths
//             progress: learner.progressStats, // or progress if you have it
//             createdAt: learner.createdAt,
//             lastAccessedWebsite : learner.lastAccessedWebsite,
//             phone: learner.phone,
//             bio: learner.bio,
//             educationLevel: learner.educationLevel,
//             interests: learner.interests,
//             university: learner.university,
//             learningStyle: learner.learningStyle,
//             goals: learner.goals,
//             socialLinks: learner.socialLinks

//           }
//         });

        
//     } catch (error) {
//         console.error("Error checking authentication:", error);
//         return res.json({ success: false, message: "Error checking authentication" });
//     }
// }

// // Logout learner
// export const logoutLearner = async (req, res) => {
//   try {
//     res.clearCookie("learnerToken", {
//       httpOnly: true,
//       sameSite: "none",
//       secure: true,
//       path: "/",         // ✅ Must match the path used when setting
//     });
//     return res.json({ success: true, message: "Learner logged out successfully" });
//   } catch (error) {
//     console.error("Logout error:", error);
//     res.status(500).json({ success: false, message: "Error logging out" });
//   }
// };


// export const enrollInPath = async (req, res) => {
//   try {
//     const {pathId } = req.body;
//     const studentId = req.userId;

    

//     // ✅ Fetch path to get module IDs
//     const path = await LearningPath.findById(pathId).lean();
//     if (!path) return res.status(404).json({ message: "Learning path not found" });

//     const moduleIds = path.content?.map((m) => m._id);

//     // ✅ Add enrollment entry with all modules listed
//     await Learner.updateOne(
//       { _id: studentId, "enrolledPaths.pathId": { $ne: pathId } }, // prevent duplicate enrollment
//       {
//         $push: {
//           enrolledPaths: {
//             pathId,
//             totalModules: moduleIds,
//             completedModules: [],
//             progressPercent: 0,
//             lastAccessed: new Date(),
//           },
//         },
//       }
//     );

//     await LearningPath.updateOne(
//       { _id: pathId },
//       { $addToSet: { learners: studentId } }
//     );

//     res.json({ message: "Enrolled successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error enrolling learner" });
//   }
// };



// export const enrollingInPath = async (req, res) => {
//   try {
//     const { pathId } = req.body; // path user is enrolling in
//     const studentId = req.user.id; // from auth middleware
//     console.log("Enrolling student ID:", studentId, "in path ID:", pathId);

//     // Find the path
//     const path = await LearningPath.findById(pathId);
//     if (!path) {
//       return res.status(404).json({ message: "Learning path not found" });
//     }
//     // Update the learner's enrolledPaths array
//     await Learner.updateOne(
//       { _id: studentId },
//       {
//         $addToSet: { enrolledPaths: pathId }, // Use $addToSet to avoid duplicates
//         $inc: { totalcoursesEnrolled: 1, totalLearningHours: path.totalHours || 0 } // Increment counters
//       }
//     );
//     console.log("Learner updated with new path:", pathId);

//     res.status(200).json({ message: "Enrolled in path successfully!" });
//   } catch (error) {
//     console.error("Error enrolling in path:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const getEnrolledPaths = async (req, res) => {
//     try {
//     const learnerId = req.user._id; // from JWT/cookie middleware
//     const { pathId } = req.params;

//     const learner = await Learner.findById(learnerId);
//     const enrolled = learner.enrolledPaths?.includes(pathId);

//     res.json({ enrolled: Boolean(enrolled) });
//   } catch (err) {
//     res.status(500).json({ message: "Error checking enrollment" });
//   }
// };

// export const getAllLearners = async (req, res) => {
//   try {
//     const learners = await Learner.find();
//     res.json({ success: true, learners });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to fetch learners" });
//   }
// };

// export const addLearningHours = async (req, res) => {
//   try {
//     const { learnerId, hours } = req.body;
//     const learner = await Learner.findById(learnerId);
//     if (!learner) return res.status(404).json({ message: "Learner not found" });

//     const today = new Date();
//     const existingEntry = learner.learningActivity.find(entry =>
//       entry.date.toDateString() === today.toDateString()
//     );

//     if (existingEntry) existingEntry.hoursSpent += hours;
//     else learner.learningActivity.push({ date: today, hoursSpent: hours });

//     await learner.save();

//     // ✅ Update stats after adding hours
//     await updateLearnerStats(learner._id);

//     res.json({ message: "Learning hours added and stats updated" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };



// export const getLearnerStats = async (req, res) => {
//   try {
//     const { learnerId } = req.params;
//     // 1. Update basic stats (hours, streaks)
//     const updatedLearner = await updateLearnerStats(learnerId); 

//     // 2. Fetch Enrolled Paths with their Skill Definitions
//     // We need to populate 'pathId' to access the 'skills' array we just added
//     const learnerWithSkills = await Learner.findById(learnerId).populate({
//       path: 'enrolledPaths.pathId',
//       select: 'title skills' // Only fetch title and skills
//     });

//     // 3. 🧠 CALCULATE SKILL POINTS
//     const skillMap = {};

//     learnerWithSkills.enrolledPaths.forEach((enrollment) => {
//       const course = enrollment.pathId;

//       if (!course || !Array.isArray(course.skills) || course.skills.length === 0) return;

//       const progressFactor = (enrollment.progressPercent || 0) / 100;

//       course.skills.forEach((skill) => {
//         if (!skillMap[skill.name]) {
//           skillMap[skill.name] = { name: skill.name, earned: 0, total: 0 };
//         }

//         skillMap[skill.name].total += skill.points;
//         skillMap[skill.name].earned += skill.points * progressFactor;
//       });
//     });

//     const maxSkillPoints = Math.max(
//       ...Object.values(skillMap).map(s => s.total)
//     );

//     const skillProfile = Object.values(skillMap).map(s => ({
//       subject: s.name,
//       A: Math.round((s.earned / maxSkillPoints) * 100),
//       fullMark: 100
//     }));


//     // If no skills yet, provide default data so the chart doesn't crash
//     const finalSkillProfile = skillProfile.length > 0 ? skillProfile : [
//       { subject: 'Coding', A: 0, fullMark: 100 },
//       { subject: 'Design', A: 0, fullMark: 100 },
//       { subject: 'Communication', A: 0, fullMark: 100 },
//       { subject: 'Logic', A: 0, fullMark: 100 },
//       { subject: 'Management', A: 0, fullMark: 100 },
//     ];

//     const aggregatedActivity = getAggregatedActivity(updatedLearner.learningActivity);

//     const badges = calculateBadges(updatedLearner);

//     res.json({
//       totalLearningHours: updatedLearner.totalLearningHours,
//       progressStats: updatedLearner.progressStats,
//       learningActivity: aggregatedActivity,
//       currentStreak: updatedLearner.currentStreak,
//       totalCoursesEnrolled: updatedLearner.totalCoursesEnrolled,
//       skillProfile: finalSkillProfile , // ✅ Sending the calculated skills
//       badges : badges
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error fetching stats" });
//   }
// };

// export const markModuleCompleted = async (req, res) => {
//   try {
//     const { studentId, pathId, moduleId, action, hoursSpent = 0 } = req.body;

//     if (!studentId || !pathId || !moduleId) {
//       return res.status(400).json({ message: "studentId, pathId and moduleId required" });
//     }

//     const learner = await Learner.findById(studentId);
//     if (!learner) return res.status(404).json({ message: "Learner not found" });

//     const enrolledPath = learner.enrolledPaths.find(
//       (p) => p.pathId.toString() === pathId
//     );
//     if (!enrolledPath) return res.status(404).json({ message: "Not enrolled in this path" });

//     if (action === "remove") {
//       enrolledPath.completedModules = enrolledPath.completedModules.filter(
//         (id) => id.toString() !== moduleId
//       );
//     } else {
//       if (!enrolledPath.completedModules.includes(moduleId)) {
//         enrolledPath.completedModules.push(moduleId);
//       }
//     }

//     const completed = enrolledPath.completedModules.length;
//     const total = enrolledPath.totalModules.length;
//     enrolledPath.progressPercent = total > 0 ? (completed / total) * 100 : 0;
//     enrolledPath.lastAccessed = new Date();

//     // Log activity
//     if (hoursSpent > 0) {
//       // Check if an entry exists for TODAY first to keep array cleaner (Optional optimization)
//       // For now, we push a new entry and rely on getLearnerStats aggregation
//       learner.learningActivity.push({
//         pathId,
//         moduleId,
//         hoursSpent,
//         date: new Date(),
//       });
//     }

//     await learner.save();
//     await updateLearnerStats(learner._id); // Recalculate total hours/streak

//     return res.json({
//       message: action === "remove" ? "Module marked as incomplete" : "Module marked as completed",
//       progress: enrolledPath.progressPercent.toFixed(2) + "%",
//       totalLearningHours: learner.totalLearningHours.toFixed(2),
//     });
//   } catch (error) {
//     console.error("❌ markModuleCompleted error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


// export const getLearningProgress = async (req, res) => {
//   try {
//     const { studentId, period } = req.query;
//     const learner = await Learner.findById(studentId);
//     if (!learner) return res.status(404).json({ message: "Learner not found" });

//     const now = new Date();
//     const cutoff = new Date();

//     if (period === "weekly") cutoff.setDate(now.getDate() - 7);
//     else cutoff.setDate(now.getDate() - 1);

//     const recentPaths = learner.enrolledPaths.filter(
//       (p) => new Date(p.lastAccessed) >= cutoff
//     );

//     const totalProgress = recentPaths.reduce(
//       (sum, p) => sum + p.progressPercent,
//       0
//     );

//     res.json({
//       totalPaths: recentPaths.length,
//       avgProgress: recentPaths.length > 0 ? (totalProgress / recentPaths.length).toFixed(2) : 0,
//       lastUpdated: now,
//     });
//   } catch (error) {
//     console.error("❌ getLearningProgress error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// //  /api/learner/update-last-access
// export const updateLastAccess = async (req, res) => {
//   try {
//     const learnerId = req.userId;

//     const updated = await Learner.findByIdAndUpdate(
//       learnerId,
//       {
//         lastAccessedWebsite: new Date(),
//       },
//       { new: true }
//     );

//     res.json({ success: true, learner: updated });
//   } catch (error) {
//     console.error("Error updating last access:", error);
//     res.status(500).json({ success: false, message: "Failed to update last access" });
//   }
// };

// export const updateProfile = async (req, res) => {
//   try {
//     const learnerId = req.userId;
//     const updates = req.body;
//     const updatedLearner = await Learner.findByIdAndUpdate(learnerId, updates, { new: true });

//     if (!updatedLearner) {
//       return res.status(404).json({ success: false, message: "Learner not found" });
//     }
//     res.json({ success: true, message: "Profile updated successfully", learner: updatedLearner });
//   } catch (error) { 
//     console.error("Error updating profile:", error);
//     res.status(500).json({ success: false, message: "Error updating profile" });
//   }
// };




// export const trackHeartbeat = async (req, res) => {
//   try {
//     const { pathId, moduleId, resourceId, duration } = req.body;
//     const learnerId = req.userId;

//     if (!pathId || !moduleId || !duration) {
//       return res.status(400).json({ message: "pathId, moduleId, duration required" });
//     }

//     // 1. Find learner
//     const learner = await Learner.findById(learnerId);
//     if (!learner) return res.status(404).json({ message: "Learner not found" });

//     // 2. Find enrolled path
//     const enrolledPath = learner.enrolledPaths.find(
//       (p) => p.pathId.toString() === pathId
//     );

//     if (!enrolledPath) {
//       return res.status(403).json({ message: "Not enrolled in this path" });
//     }

//     // 3. Update resource usage (aggregate, not duplicate)
//     const targetResource = resourceId || "module_view";

//     let usageEntry = enrolledPath.resourceUsage.find(
//       (r) =>
//         r.resourceId === targetResource &&
//         r.moduleId?.toString() === moduleId
//     );

//     if (usageEntry) {
//       usageEntry.timeSpent += duration;
//       usageEntry.lastAccessed = new Date();
//     } else {
//       enrolledPath.resourceUsage.push({
//         resourceId: targetResource,
//         moduleId: moduleId,
//         timeSpent: duration,
//         lastAccessed: new Date(),
//       });
//     }

//     // 4. Update total learning hours (seconds → hours)
//     const hoursAdded = duration / 3600;
//     learner.totalLearningHours += hoursAdded;

//     // 5. Update daily activity log
//     const today = new Date();
//     const todayLog = learner.learningActivity.find(
//       (e) => e.date.toDateString() === today.toDateString()
//     );

//     if (todayLog) {
//       todayLog.hoursSpent += hoursAdded;
//       todayLog.pathId = pathId;
//       todayLog.moduleId = moduleId;
//     } else {
//       learner.learningActivity.push({
//         date: today,
//         hoursSpent: hoursAdded,
//         pathId,
//         moduleId,
//       });
//     }

//     await learner.save();
//     return res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("Heartbeat Error:", error);
//     return res.status(500).json({ message: "Tracking failed" });
//   }
// };

// export const enrollByCode = async (req, res) => {
//   try {
//     const { code } = req.body;
//     const studentId = req.userId;

//     if (!code) return res.status(400).json({ message: "Class code is required" });

//     // 1. Find Path by Code
//     const path = await LearningPath.findOne({ code });
//     if (!path) {
//       return res.status(404).json({ message: "Invalid class code. Please check and try again." });
//     }

//     // 2. Check if already enrolled
//     const learner = await Learner.findById(studentId);
//     const isEnrolled = learner.enrolledPaths.some(p => p.pathId.toString() === path._id.toString());

//     if (isEnrolled) {
//       return res.status(400).json({ message: "You are already enrolled in this class." });
//     }

//     // 3. Enroll Learner
//     const moduleIds = path.content?.map((m) => m._id) || [];
    
//     learner.enrolledPaths.push({
//       pathId: path._id,
//       totalModules: moduleIds,
//       completedModules: [],
//       progressPercent: 0,
//       resourceUsage: [], // Initialize for our tracking
//       lastAccessed: new Date(),
//     });

//     // Update Learner Stats
//     learner.totalcoursesEnrolled += 1;
    
//     // Add learner to the path's student list
//     path.learners.push(studentId);

//     await learner.save();
//     await path.save();

//     res.status(200).json({ 
//       success: true, 
//       message: `Successfully joined "${path.title}"`,
//       pathId: path._id 
//     });

//   } catch (error) {
//     console.error("Enroll by code error:", error);
//     res.status(500).json({ message: "Server error while joining class" });
//   }
// };


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

    const completed = enrolledPath.completedModules.length;
    const total = enrolledPath.totalModules.length;
    enrolledPath.progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
    enrolledPath.lastAccessed = new Date();

    // Log learning activity for today
    if (hoursSpent > 0) {
      const todayStr = new Date().toDateString();
      const todayLog = learner.learningActivity.find(
        (e) => new Date(e.date).toDateString() === todayStr
      );

      if (todayLog) {
        todayLog.hoursSpent += hoursSpent;
      } else {
        learner.learningActivity.push({ pathId, moduleId, hoursSpent, date: new Date() });
      }
    }

    await learner.save();
    await updateLearnerStats(learner._id);

    return res.json({
      success: true,
      message: action === "remove" ? "Module marked incomplete." : "Module marked complete.",
      progressPercent: enrolledPath.progressPercent,
      completedModules: completed,
      totalModules: total,
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