// controllers/teacherController.js

import Teacher from "../models/teacher.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadCertificate } from "../config/cloudinary.js";

// Helper to create/send cookie
const sendTeacherToken = (teacher, res) => {
  const token = jwt.sign(
    { id: teacher._id, role: "teacher" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

    res.cookie("teacherToken", token, {
    httpOnly: true,
    sameSite: "Lax",   // ✅ allows cross-port cookies
    secure: false,     // ✅ true only in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000,
    });


  return token;
};

// =============================
// Register Teacher
// =============================
export const registerTeacher = async (req, res) => {
  try {
    const { fullName, email, password, institution, qualification, expertise } = req.body;
    const certificates = req.files?.certificateFile?.[0]?.path;

    if (!certificates) {
      return res.json({ success: false, message: "Please upload at least one certificate" });
    }
    if (!fullName || !email || !password) {
      return res.json({ success: false, message: "Please fill all the fields" });
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ success: false, message: "Teacher already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const uploadedCertificate = await uploadCertificate(certificates);

    const newTeacher = await Teacher.create({
      fullName,
      email,
      password: hashedPassword,
      status: "pending",
      institution,
      qualification,
      expertise,
      certificates: uploadedCertificate,
    });

    sendTeacherToken(newTeacher, res);

    return res.json({
      success: true,
      message: "Teacher registered successfully",
      teacher: {
        id: newTeacher._id,
        fullName: newTeacher.fullName,
        email: newTeacher.email,
        status: newTeacher.status,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// =============================
// Login Teacher
// =============================
export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ success: false, message: "Teacher does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, teacher.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    sendTeacherToken(teacher, res);

    return res.json({
      success: true,
      message: "Login successful",
      teacher: {
        id: teacher._id,
        fullName: teacher.fullName,   // ✅ correct field
        email: teacher.email,
        role: "teacher",
        status: teacher.status,
        qualification: teacher.qualification,
        institution: teacher.institution,
        expertise: teacher.expertise,
        createdPaths: teacher.createdPaths,
        enrolledStudents: teacher.enrolledStudents,
        certificates: teacher.certificates,
        revenue: teacher.revenue,
        createdAt: teacher.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// =============================
// Check Auth Teacher
// =============================
export const isAuthTeacher = async (req, res) => {
  try {
    const token = req.cookies.teacherToken;
    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ success: false, message: "No token provided" });
      
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const teacher = await Teacher.findById(decoded.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    return res.json({
      success: true,
      teacher: {
        id: teacher._id,
        fullName: teacher.fullName,
        email: teacher.email,
        role: "teacher",
        status: teacher.status,
        qualification: teacher.qualification,
        institution: teacher.institution,
        expertise: teacher.expertise,
        createdPaths: teacher.createdPaths,
        enrolledStudents: teacher.enrolledStudents,
        certificates: teacher.certificates,
        revenue: teacher.revenue,
        createdAt: teacher.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error checking authentication" });
  }
};

// =============================
// Logout Teacher
// =============================
export const logoutTeacher = async (req, res) => {
  try {
    res.clearCookie("teacherToken", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.json({ success: true, message: "Teacher logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Error logging out" });
  }
};
// =============================
// Get Enrolled Students
// =============================
export const getEnrolledStudents = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.userId).populate("enrolledStudents", "fullName email");

    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    res.status(200).json({
      success: true,
      students: teacher.enrolledStudents,
    });
  } catch (error) {
    console.error("Error fetching enrolled students:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json({ success: true, teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch teachers" });
  }
};