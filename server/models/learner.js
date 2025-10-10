import mongoose from 'mongoose';

const learnerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    default: "learner"
  },

   enrolledPaths: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningPath'
    }
  ],

  totalLearningHours: {
    type: Number,
    default: 0
  },

  totalcoursesEnrolled: {
    type: Number,
    default: 0
  },
  resetOtp: { type: String },
  resetOtpExpires: { type: Date },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Learner = mongoose.models.learner || mongoose.model("Learner", learnerSchema);
export default Learner;
