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
      modulesCompleted: { type: Number, default: 0 },
      totalModules: { type: Number, default: 0 },
      progressPercent: { type: Number, default: 0 }, // 0-100%
      lastAccessed: { type: Date, default: Date.now }
    },
  ],

  // Total summary stats
  totalLearningHours: {
    type: Number,
    default: 0,
  },

  totalCoursesEnrolled: {
    type: Number,
    default: 0,
  },

  // 🔹 Daily learning logs (for time-based charts)
  learningActivity: [
    {
      date: { type: Date, default: Date.now },
      hoursSpent: { type: Number, default: 0 },
      coursesCompleted: { type: Number, default: 0 },
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
