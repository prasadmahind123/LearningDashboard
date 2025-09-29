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
  institution: {
    type: String,
  },
  expertise: {
    type: String,
  }, // e.g. ["Math", "AI", "Web Development"]
  createdPaths: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningPath",
    },
  ],
  learningPaths: [
    {
      pathId: { type: mongoose.Schema.Types.ObjectId, ref: "LearningPath" },
      title: String,
      enrolledStudents: [
        {
          studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Learner" },
          enrolledAt: { type: Date, default: Date.now }
        }
      ]
    }
  ],
  revenue: {
    type: Number,
    default: 0, // Initial revenue is 0
  },
  resetOtp: { type: String },
  resetOtpExpires: { type: Date },
}, {
  timestamps: true,
});

const Teacher = mongoose.models.teacher || mongoose.model("Teacher", teacherSchema);
export default Teacher;
