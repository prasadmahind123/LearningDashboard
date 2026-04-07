// import mongoose from "mongoose";


// const teacherSchema = new mongoose.Schema({
//   fullName: {
//     type: String,
//   },
//   email: {
//     type: String,
//     required: [true, "Teacher email is required"],
//     unique: true,
//     lowercase: true,
//   },
//   bio: {
//     type: String,
//   },
//   phone: {
//     type: String,
//   },
//   password: {
//     type: String,
//     required: [true, "Password is required"],
//     minlength: 6,
//   },
//     status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected'],
//     default: 'pending'
//   },
//   certificates: {
//     type: String,
//     required: true,
//   },
//   qualification: {
//     type: String,
//   },
//   university: {
//     type: String,
//   },
//   expertise: [
//     { type: String }
//   ],  
//   createdPaths: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "LearningPath",
//     },
//   ],
//     enrolledStudents: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Learner'
//     }
//   ],
//   revenue: {
//     type: Number,
//     default: 0, // Initial revenue is 0
//   },
//   socialLinks: {
//     linkedin: { type: String },
//     github: { type: String },
//     twitter: { type: String },
//   },
//   averageRating: { type: Number, default: 0 },
//   teachingStyle: { type: String },
//   experienceLevel: { type: String },
//   availability: { type: String },
//   teachingStatus: { type: String},
//   resetOtp: { type: String },
//   resetOtpExpires: { type: Date },

//     // Subscription fields
//   isSubscribed: { type: Boolean, default: false },
//   subscriptionDate: { type: Date },
// }, {
//   timestamps: true,
// });

// const Teacher = mongoose.models.teacher || mongoose.model("Teacher", teacherSchema);
// export default Teacher;
import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: [true, "Teacher email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // never leak the hash in default queries
    },

    // Status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Profile
    bio:           { type: String, default: "" },
    phone:         { type: String, default: "" },
    qualification: { type: String, default: "" },
    university:    { type: String, default: "" },
    teachingStyle:   { type: String, default: "" },
    experienceLevel: { type: String, default: "" },
    availability:    { type: String, default: "" },
    teachingStatus:  { type: String, default: "" },

    expertise: [{ type: String }],

    certificates: {
      type: String,
      required: [true, "Certificate is required"],
    },

    socialLinks: {
      linkedin: { type: String, default: "" },
      github:   { type: String, default: "" },
      twitter:  { type: String, default: "" },
    },

    // Teaching data
    createdPaths: [{ type: mongoose.Schema.Types.ObjectId, ref: "LearningPath" }],
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Learner" }],

    // Analytics
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    revenue:       { type: Number, default: 0, min: 0 },

    // Subscription
    isSubscribed:     { type: Boolean, default: false },
    subscriptionDate: { type: Date },

    // Password reset — hidden from default queries
    resetOtp:        { type: String, select: false },
    resetOtpExpires: { type: Date,   select: false },

    lastPaymentId: { type: String, default: null },
    lastOrderId:   { type: String, default: null },
  },
  {
    timestamps: true, // auto createdAt + updatedAt — removes manual duplication
  }
);

// ── Indexes ────────────────────────────────────────────────────────────────────
teacherSchema.index({ email: 1 });
teacherSchema.index({ status: 1 });
teacherSchema.index({ resetOtpExpires: 1 }, { sparse: true });

// ── Model name fixed: was "teacher" (lowercase) → now "Teacher" ───────────────
// mongoose.models lookup is case-sensitive so "teacher" and "Teacher" are
// treated as different models, which can cause duplicate-model errors in dev.
const Teacher = mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);
export default Teacher;