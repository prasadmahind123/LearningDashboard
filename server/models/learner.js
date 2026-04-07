// import mongoose from "mongoose";

// const learnerSchema = new mongoose.Schema({
//   fullName: {
//     type: String,
//     required: true,
//     trim: true,
//   },

//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//   },

//   bio: {
//     type: String,
//     default: "",
//   },
//   phone: {
//     type: String,
//     default: "",
//   },

//   password: {
//     type: String,
//     required: true,
//   },

//   role: {
//     type: String,
//     default: "learner",
//   },

//   // All learning paths enrolled by learner
// enrolledPaths: [
//   {
//     pathId: { type: mongoose.Schema.Types.ObjectId, ref: "LearningPath" },
//     completedModules: [{ type: mongoose.Schema.Types.ObjectId , ref:"content"}], // IDs of completed modules
//     totalModules: [{ type: mongoose.Schema.Types.ObjectId }], // IDs of all modules in that path
//     progressPercent: { type: Number, default: 0 }, // auto-calculated from completedModules.length / totalModules.length
//     lastAccessed: { type: Date, default: Date.now },

//     resourceUsage: [
//         {
//           resourceId: { type: String }, // Can be a File ID or "module_view"
//           moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "content" },
//           timeSpent: { type: Number, default: 0 }, // In seconds
//           lastAccessed: { type: Date, default: Date.now }
//         }
//       ]
//   },
// ],

// educationLevel: {
//   type: String,
//   default: "",
// },
// learningStyle: {
//   type: String,
//   default: "",
// },
// interests: [
//   { type: String }
// ],
// goals: [  
//   { type: String }
// ],
// university: {
//   type: String,
//   default: "",
// },
// socialLinks: {
//   linkedin: { type: String, default: "" },
//   github: { type: String, default: "" },
//   portfolio: { type: String, default: "" },
// },


//   lastAccessedWebsite: {
//     type: Date,
//     default: null,
//   },

//   // Total summary stats
//   totalLearningHours: {
//     type: Number,
//     default: 0,
//   },

//   totalCoursesEnrolled: {
//     type: Number,
//     default: 0,
//   },

//   currentStreak: {
//     type: Number,
//     default: 0,
//   },

//   // 🔹 Daily learning logs (for time-based charts)
//    learningActivity: [
//     {
//       date: { type: Date, default: Date.now },
//       hoursSpent: { type: Number, default: 0 },
//       coursesCompleted: { type: Number, default: 0 },
//       pathId: { type: mongoose.Schema.Types.ObjectId, ref: "LearningPath" }, // Optional: track which path
//       moduleId: { type: mongoose.Schema.Types.ObjectId }, // Optional: track which module
//     },
//   ],

//   // 🔹 Aggregated progress for dashboard (for quick display)
//   progressStats: {
//     yesterdayHours: { type: Number, default: 0 },
//     weekHours: { type: Number, default: 0 },
//     monthHours: { type: Number, default: 0 },
//   },

//   // 🔹 Per-course tracking
//   courseProgress: [
//     {
//       courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
//       progressPercent: { type: Number, default: 0 }, // 0–100%
//       timeSpent: { type: Number, default: 0 }, // in hours
//       lastAccessed: { type: Date, default: Date.now },
//       completed: { type: Boolean, default: false },
//     },
//   ],

//   // 🔹 Engagement analytics
//   analytics: {
//     loginCount: { type: Number, default: 0 },
//     quizAttempts: { type: Number, default: 0 },
//     certificatesEarned: { type: Number, default: 0 },
//     discussionsParticipated: { type: Number, default: 0 },
//   },

//   resetOtp: { type: String },
//   resetOtpExpires: { type: Date },

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Learner =
//   mongoose.models.Learner || mongoose.model("Learner", learnerSchema);
// export default Learner;


import mongoose from "mongoose";

const resourceUsageSchema = new mongoose.Schema(
  {
    resourceId: { type: String, default: "module_view" },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "content" },
    timeSpent: { type: Number, default: 0 }, // seconds
    lastAccessed: { type: Date, default: Date.now },
  },
  { _id: false }
);

const enrolledPathSchema = new mongoose.Schema(
  {
    pathId: { type: mongoose.Schema.Types.ObjectId, ref: "LearningPath", required: true },
    completedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: "content" }],
    totalModules: [{ type: mongoose.Schema.Types.ObjectId }],
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    lastAccessed: { type: Date, default: Date.now },
    resourceUsage: [resourceUsageSchema],
    enrolledAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const learningActivitySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    hoursSpent: { type: Number, default: 0, min: 0 },
    coursesCompleted: { type: Number, default: 0 },
    pathId: { type: mongoose.Schema.Types.ObjectId, ref: "LearningPath" },
    moduleId: { type: mongoose.Schema.Types.ObjectId },
  },
  { _id: false }
);

const learnerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "learner", enum: ["learner", "admin"] },

    // Profile
    bio: { type: String, default: "" },
    phone: { type: String, default: "" },
    educationLevel: { type: String, default: "" },
    learningStyle: { type: String, default: "" },
    university: { type: String, default: "" },
    interests: [{ type: String }],
    goals: [{ type: String }],
    socialLinks: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },

    // Enrollment
    enrolledPaths: [enrolledPathSchema],

    // Aggregated stats (denormalised for fast reads)
    totalLearningHours: { type: Number, default: 0, min: 0 },
    totalCoursesEnrolled: { type: Number, default: 0, min: 0 },
    currentStreak: { type: Number, default: 0, min: 0 },
    longestStreak: { type: Number, default: 0, min: 0 }, // NEW: track personal best

    // Daily activity log
    learningActivity: [learningActivitySchema],

    // Dashboard snapshot (recomputed by learnerStats service)
    progressStats: {
      yesterdayHours: { type: Number, default: 0 },
      weekHours: { type: Number, default: 0 },
      monthHours: { type: Number, default: 0 },
    },

    // Per-course tracking (legacy — kept for backwards compat)
    courseProgress: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        progressPercent: { type: Number, default: 0 },
        timeSpent: { type: Number, default: 0 },
        lastAccessed: { type: Date, default: Date.now },
        completed: { type: Boolean, default: false },
      },
    ],

    // Engagement analytics
    analytics: {
      loginCount: { type: Number, default: 0 },
      quizAttempts: { type: Number, default: 0 },
      certificatesEarned: { type: Number, default: 0 },
      discussionsParticipated: { type: Number, default: 0 },
    },

    lastAccessedWebsite: { type: Date, default: null },

    // Password reset
    resetOtp: { type: String, select: false }, // hide from default queries
    resetOtpExpires: { type: Date, select: false },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// ── Indexes ────────────────────────────────────────────────────────────────────
learnerSchema.index({ email: 1 });
learnerSchema.index({ "enrolledPaths.pathId": 1 });
// Sparse index so only docs with a reset OTP are indexed
learnerSchema.index({ resetOtpExpires: 1 }, { sparse: true });

// ── Virtual: id as string (mirrors _id) ───────────────────────────────────────
learnerSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// ── Pre-save: keep totalCoursesEnrolled in sync ────────────────────────────────
learnerSchema.pre("save", function (next) {
  if (this.isModified("enrolledPaths")) {
    this.totalCoursesEnrolled = this.enrolledPaths.length;
  }
  next();
});

const Learner = mongoose.models.Learner || mongoose.model("Learner", learnerSchema);
export default Learner;