import mongoose from "mongoose";

const learnerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  bio: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    default: "learner",
  },

  // All learning paths enrolled by learner
enrolledPaths: [
  {
    pathId: { type: mongoose.Schema.Types.ObjectId, ref: "LearningPath" },
    completedModules: [{ type: mongoose.Schema.Types.ObjectId , ref:"content"}], // IDs of completed modules
    totalModules: [{ type: mongoose.Schema.Types.ObjectId }], // IDs of all modules in that path
    progressPercent: { type: Number, default: 0 }, // auto-calculated from completedModules.length / totalModules.length
    lastAccessed: { type: Date, default: Date.now },

    resourceUsage: [
        {
          resourceId: { type: String }, // Can be a File ID or "module_view"
          moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "content" },
          timeSpent: { type: Number, default: 0 }, // In seconds
          lastAccessed: { type: Date, default: Date.now }
        }
      ]
  },
],

educationLevel: {
  type: String,
  default: "",
},
learningStyle: {
  type: String,
  default: "",
},
interests: [
  { type: String }
],
goals: [  
  { type: String }
],
university: {
  type: String,
  default: "",
},
socialLinks: {
  linkedin: { type: String, default: "" },
  github: { type: String, default: "" },
  portfolio: { type: String, default: "" },
},


  lastAccessedWebsite: {
    type: Date,
    default: null,
  },

  // Total summary stats
  totalLearningHours: {
    type: Number,
    default: 0,
  },

  totalCoursesEnrolled: {
    type: Number,
    default: 0,
  },

  currentStreak: {
    type: Number,
    default: 0,
  },

  // 🔹 Daily learning logs (for time-based charts)
   learningActivity: [
    {
      date: { type: Date, default: Date.now },
      hoursSpent: { type: Number, default: 0 },
      coursesCompleted: { type: Number, default: 0 },
      pathId: { type: mongoose.Schema.Types.ObjectId, ref: "LearningPath" }, // Optional: track which path
      moduleId: { type: mongoose.Schema.Types.ObjectId }, // Optional: track which module
    },
  ],

  // 🔹 Aggregated progress for dashboard (for quick display)
  progressStats: {
    yesterdayHours: { type: Number, default: 0 },
    weekHours: { type: Number, default: 0 },
    monthHours: { type: Number, default: 0 },
  },

  // 🔹 Per-course tracking
  courseProgress: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      progressPercent: { type: Number, default: 0 }, // 0–100%
      timeSpent: { type: Number, default: 0 }, // in hours
      lastAccessed: { type: Date, default: Date.now },
      completed: { type: Boolean, default: false },
    },
  ],

  // 🔹 Engagement analytics
  analytics: {
    loginCount: { type: Number, default: 0 },
    quizAttempts: { type: Number, default: 0 },
    certificatesEarned: { type: Number, default: 0 },
    discussionsParticipated: { type: Number, default: 0 },
  },

  resetOtp: { type: String },
  resetOtpExpires: { type: Date },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Learner =
  mongoose.models.Learner || mongoose.model("Learner", learnerSchema);
export default Learner;
