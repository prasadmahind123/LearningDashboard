import mongoose from "mongoose";

// ✅ Schema for each uploaded resource (any document, video, etc.)
const resourceSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileType: { type: String }, // e.g., 'application/pdf', 'video/mp4', 'text/bibtex'
  fileUrl: { type: String, required: true }, // Cloudinary or external file URL
  format: { type: String }, // Optional: file extension or Cloudinary format
  size: { type: Number }, // Optional: size in bytes
  publicId: { type: String }, // Cloudinary public ID (for management/deletion)
  description: { type: String, default: "" },
});

// ✅ Schema for each module/content section
const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: String },

  // ✅ Multiple external URLs (YouTube, Google Docs, etc.)
  urls: {
    type: [String],
    default: [],
  },

  // ✅ For single preview video (optional)
  videoUrl: { type: String },

  // ✅ Multiple uploaded resources (PDF, Word, Excel, BibTex, PPT, etc.)
  resources: {
    type: [resourceSchema],
    default: [],
  },
});

// ✅ Main Learning Path Schema
const learningPathSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    category: { type: String },
    level: { type: String }, // beginner, intermediate, advanced
    price: { type: Number },
    duration: { type: String },

    // ✅ References
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    learners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Learner",
      },
    ],

    // ✅ Other meta fields
    isPrivate: { type: Boolean, default: false },
    code: { type: String, unique: true },
    totalHours: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },

    // ✅ Modules/Content
    content: {
      type: [contentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite in development
const LearningPath =
  mongoose.models.LearningPath || mongoose.model("LearningPath", learningPathSchema);

export default LearningPath;
