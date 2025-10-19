import express from 'express';
import { registerLearner, loginLearner, isAuthLearner, logoutLearner , enrollInPath , getEnrolledPaths , getAllLearners , addLearningHours , getLearnerStats} from '../controller/learnerController.js';
import authLearner from '../middleware/authLearner.js';
import { upload } from '../config/multer.js';

const learnerRouter = express.Router();

// Route to register a new learner
learnerRouter.post('/register', upload.none(), registerLearner);
// Route to login a learner
learnerRouter.post('/login', loginLearner);
// Route to authenticate a learner
learnerRouter.get('/is-auth', authLearner, isAuthLearner);
// Route to logout a learner
learnerRouter.get('/logout', logoutLearner);
// Route to add learning path to learner's enrolled paths
learnerRouter.post('/enroll-path', authLearner, enrollInPath);
// Rote to get enrolled paths of learner
learnerRouter.get('/enrolled-paths/:pathId', authLearner, getEnrolledPaths);

learnerRouter.get('/getAllLearners' , getAllLearners)

learnerRouter.get("/stats/:learnerId", getLearnerStats)

learnerRouter.post("/addLearningHours", addLearningHours)


export default learnerRouter;
