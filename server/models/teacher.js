import mongoose from "mongoose";


const teacherSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Teacher email is required"],
    unique: true,
    lowercase: true,
  },
  bio: {
    type: String,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
    status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  certificates: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
  },
  university: {
    type: String,
  },
  expertise: [
    { type: String }
  ],  
  createdPaths: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningPath",
    },
  ],
    enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Learner'
    }
  ],
  revenue: {
    type: Number,
    default: 0, // Initial revenue is 0
  },
  socialLinks: {
    linkedin: { type: String },
    github: { type: String },
    twitter: { type: String },
  },
  averageRating: { type: Number, default: 0 },
  teachingStyle: { type: String },
  experienceLevel: { type: String },
  availability: { type: String },
  teachingStatus: { type: String},
  resetOtp: { type: String },
  resetOtpExpires: { type: Date },

    // Subscription fields
  isSubscribed: { type: Boolean, default: false },
  subscriptionDate: { type: Date },
}, {
  timestamps: true,
});

const Teacher = mongoose.models.teacher || mongoose.model("Teacher", teacherSchema);
export default Teacher;
