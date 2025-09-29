import express from 'express';
import Teacher from '../models/teacher.js';
import Learner from '../models/learner.js';

import { adminLogin , isAdminAuth  , adminLogout , deleteTeacher , getPendingTeachers , approveTeacher} from '../controller/adminController.js';

import authAdmin from '../middleware/authAdmin.js';

const adminRouter = express.Router();

// Admin login route
adminRouter.post('/login', adminLogin);
// Admin authentication route
adminRouter.get('/is-auth', authAdmin, isAdminAuth);
// Admin logout route
adminRouter.get('/logout', authAdmin, adminLogout);

adminRouter.get("/teachers", async (req, res) => {
  try {
    const teachers = await Teacher.find(); // Adjust according to your schema
    res.json({ success: true, teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch teachers" });
  }
});

// GET all pending teachers
adminRouter.get('/teachers/pending', getPendingTeachers);
// POST approve teacher
adminRouter.post('/teachers/:id/approve', authAdmin, approveTeacher);

// POST approve
adminRouter.post('/admin/teachers/:id/approve', authAdmin, async (req, res) => {
  await Teacher.findByIdAndUpdate(req.params.id, { status: 'approved' });
  res.json({ success: true, message: "Teacher approved" });
});

// POST reject
adminRouter.post('/admin/teachers/:id/reject', authAdmin, async (req, res) => {
  await Teacher.findByIdAndUpdate(req.params.id, { status: 'rejected' });
  res.json({ success: true, message: "Teacher rejected" });
});

// DELETE teacher
adminRouter.delete('/teachers/:id', authAdmin, deleteTeacher);

//Learners for admin

adminRouter.get('/learners' , async(req,res)=>{
  try {
    const learners = await Learner.find(); // Adjust according to your schema
    res.json({ success: true, learners });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch learners"
        });
    }
})


adminRouter.get('/test' , (req, res) => {
    res.send({message: "Admin route is working"});
}
);

export default adminRouter;