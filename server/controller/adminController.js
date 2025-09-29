import jwt from 'jsonwebtoken';
import Teacher from '../models/teacher.js';


//admin login : /api/admin/login
export const adminLogin = async (req, res) => {
   try{
     const { email, password } = req.body; // Destructure email and password from request body
    

     if(password === process.env.ADMIN_PASSWORD && email === process.env.ADMIN_EMAIL){
        const token = jwt.sign({email},process.env.JWT_SECRET, {
            expiresIn:'7d'
        });
        res.cookie('adminToken', token, {
        httpOnly: true, // Cookie is not accessible via JavaScript
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production  
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // SameSite policy
        maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie will expire in 30 days
    });
        return res.json({ success: true, message: "Admin logged in successfully" }); // Respond with success message

    }else{
            return res.json({ success: false, message: "Invalid details enter correct" }); // Respond with success message

    }
    


   }catch (error) {
    console.error("Error logging in admin:", error); // Log error to console
    return res.json({ success: false, message: "Error logging in admin" }); // Respond with error message
   }
}

// Admin auth : /api/admin/is-auth
export const isAdminAuth = async (req, res) => {
    try {
        const token = req.cookies.adminToken; // Get the token from cookies
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized, no token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.email) {
            req.adminEmail = decoded.email; // Store email in request object
            return res.json({ success: true, message: "Admin is authenticated" }); // Respond with success message
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }
    } catch (error) {
        console.error('Authentication error:', error); // Log error to console
        return res.status(401).json({ success: false, message: 'Unauthorized, invalid token' }); // Respond with error message
    }
}

// Admin logout : /api/admin/logout
export const adminLogout = async (req, res) => {
    try {
        res.clearCookie('adminToken'); // Clear the admin token cookie
        return res.json({ success: true, message: "Admin logged out successfully" }); // Respond with success message
    } catch (error) {
        console.error("Error logging out admin:", error); // Log error to console
        return res.status(500).json({ success: false, message: "Error logging out admin" }); // Respond with error message
    }
}



export const getPendingTeachers = async (req, res) => {
  try {
    const pendingTeachers = await Teacher.find({ status: 'pending' }); // adjust as per your schema
    res.json({ success: true, teachers: pendingTeachers });
  } catch (error) {
    console.error("Error fetching pending teachers:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const approveTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    teacher.status = 'approved';
    await teacher.save();

    res.status(200).json({ success: true, message: 'Teacher approved successfully' });
  } catch (err) {
    console.error('Error approving teacher:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const rejectTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    teacher.status = 'rejected';
    await teacher.save();

    res.status(200).json({ success: true, message: 'Teacher rejected successfully' });
  } catch (err) {
    console.error('Error rejecting teacher:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }
    res.status(200).json({ success: true, message: 'Teacher deleted successfully' });
    } catch (err) {
        console.error('Error deleting teacher:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}
