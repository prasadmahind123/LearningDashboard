import express from 'express';
import { upload } from '../config/multer.js';
import { createLearningPath , getTeacherLearningPaths , updateLearningPath  ,
     learningPathById ,getAllLearningPaths , deleteLearningPath , deleteModule} from '../controller/learningPathController.js';
import authTeacher from '../middleware/authTeacher.js';

const learningPathRouter = express.Router();

// Create a new learning path with content upload support
learningPathRouter.route('/addpath')
.post(
    upload.fields([
        { name: 'pathImage', maxCount: 1 },
        { name: 'content[0][files][video]', maxCount: 1 },
        { name: 'content[0][files][pdf]', maxCount: 1 },
        { name: 'content[0][files][bibtex]', maxCount: 1 },
        { name: 'content[0][files][excel]', maxCount: 1 },
        { name: 'content[0][files][additionalFiles]', maxCount: 10 },
        { name: 'content[1][files][video]', maxCount: 1 },
        { name: 'content[1][files][pdf]', maxCount: 1 },
        { name: 'content[1][files][bibtex]', maxCount: 1 },
        { name: 'content[1][files][excel]', maxCount: 1 },
        { name: 'content[1][files][additionalFiles]', maxCount: 10 },
        { name: 'content[2][files][video]', maxCount: 1 },
        { name: 'content[2][files][pdf]', maxCount: 1 },
        { name: 'content[2][files][bibtex]', maxCount: 1 },
        { name: 'content[2][files][excel]', maxCount: 1 },
        { name: 'content[2][files][additionalFiles]', maxCount: 10 }
    ]),
    authTeacher ,createLearningPath
)

learningPathRouter.get("/my-paths", authTeacher, getTeacherLearningPaths);

learningPathRouter.get("/id" , learningPathById);

learningPathRouter.put("/update/:id", authTeacher, upload.any(), updateLearningPath);

learningPathRouter.delete("/delete/:id", authTeacher, deleteLearningPath);

learningPathRouter.get("/allpaths" , getAllLearningPaths);

learningPathRouter.delete("/module/:pathId/:index", authTeacher, deleteModule);




export default learningPathRouter;

