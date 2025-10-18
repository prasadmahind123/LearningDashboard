import mongoose from 'mongoose';
import { type } from 'os';
import { ref } from 'process';

const resourceSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileType: { type: String, required: true }, // e.g., 'pdf', 'xlsx', 'bibtex'
  fileUrl: { type: String, required: true },
});

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String },
  resources: [resourceSchema], // Multiple resources per content
  duration: { type: String }, // Duration
});

const learningPathSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image : { type: String },
  description: { type: String },
  category: { type: String },
  level: { type: String }, // beginner, intermediate, advanced
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  isPrivate: { type: Boolean, default: false },
  code: { type: String, unique: true }, // Unique code for free access
  content: [contentSchema], // Multiple content modules
  totalHours: { type: Number, default: 0 },
  learners : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Learner' }],
  price : {type : Number},
  duration : {type : String},
  revenue: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});



const LearningPath =  mongoose.models.learningPath || mongoose.model("LearningPath" , learningPathSchema)
export default LearningPath;
