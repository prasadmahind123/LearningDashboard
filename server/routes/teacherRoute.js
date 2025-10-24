import express from 'express';
import { registerTeacher , loginTeacher , isAuthTeacher , logoutTeacher , getEnrolledStudents , getAllTeachers} from '../controller/teacherController.js';
import authTeacher from '../middleware/authTeacher.js';
import {upload} from '../config/multer.js';
import {
  createLearningPath,
  getTeacherLearningPaths,
  updateLearningPath,
  deleteLearningPath
} from '../controller/learningPathController.js';



const teacherRouter = express.Router();

// Route to register a new teacher
teacherRouter.route('/register')
.post(
    upload.fields([
        { name: 'certificateFile', maxCount: 1 }, // Allow multiple certificate uploads
    ]),
    registerTeacher
);
// Route to login a teacher
teacherRouter.post('/login', loginTeacher);


// Route to authenticate a teacher
teacherRouter.get('/is-Auth', authTeacher, isAuthTeacher);
// Route to logout a teacher
teacherRouter.get('/logout', logoutTeacher);

teacherRouter.get("/enrolled-students" , getEnrolledStudents)

// Route to create a new learning path
teacherRouter.post('/create-learning-path', authTeacher, createLearningPath);

// Route to get all learning paths for a teacher
teacherRouter.get('/learning-paths', authTeacher, getTeacherLearningPaths);

// Route to update a learning path
teacherRouter.put('/learning-path/:id', authTeacher, updateLearningPath);

// Route to delete a learning path
teacherRouter.delete('/learning-path/:id', authTeacher, deleteLearningPath);
 teacherRouter.get("/getAllTeachers" , getAllTeachers)

export default teacherRouter;
