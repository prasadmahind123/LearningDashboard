import express from 'express';
import { upload } from '../config/multer.js';
import { createLearningPath , getTeacherLearningPaths , updateLearningPath  ,
     learningPathById ,getAllLearningPaths , deleteLearningPath , deleteModule} from '../controller/learningPathController.js';
import authTeacher from '../middleware/authTeacher.js';

const learningPathRouter = express.Router();

// Create a new learning path with content upload support
learningPathRouter.route('/addpath')
  .post(
    upload.any(), // Accept all files, no need to hardcode indices
    authTeacher,
    createLearningPath
  );


learningPathRouter.get("/my-paths", authTeacher, getTeacherLearningPaths);

learningPathRouter.get("/id" , learningPathById);

learningPathRouter.put("/update/:id", authTeacher, upload.any(), updateLearningPath);

learningPathRouter.delete("/delete/:id", authTeacher, deleteLearningPath);

learningPathRouter.get("/allpaths" , getAllLearningPaths);

learningPathRouter.delete("/module/:pathId/:index", authTeacher, deleteModule);




export default learningPathRouter;

