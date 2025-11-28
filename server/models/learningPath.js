import mongoose from "mongoose";


const resourceSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileType: { type: String }, 
  fileUrl: { type: String, required: true }, 
  format: { type: String }, 
  size: { type: Number }, 
  publicId: { type: String },
  description: { type: String, default: "" },
});


const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: String },


  urls: {
    type: [String],
    default: [],
  },


  videoUrl: { type: String },

  resources: {
    type: [resourceSchema],
    default: [],
  },
});


const learningPathSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    category: { type: String },
    level: { type: String }, 
    price: { type: Number },
    duration: { type: String },

    
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


    isPrivate: { type: Boolean, default: false },
    code: { type: String, unique: true },
    totalHours: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },

 
    content: {
      type: [contentSchema],
      default: [],
    },
  },
  { timestamps: true }
);


const LearningPath =
  mongoose.models.LearningPath || mongoose.model("LearningPath", learningPathSchema);

export default LearningPath;
