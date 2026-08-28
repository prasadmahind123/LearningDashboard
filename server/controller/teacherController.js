
import Teacher from "../models/teacher.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadCertificate } from "../config/cloudinary.js";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Fields returned in every auth response — never expose password / OTP */
const PUBLIC_TEACHER_FIELDS = {
  fullName: 1, email: 1, role: 1, bio: 1, phone: 1, status: 1,
  qualification: 1, university: 1, expertise: 1, createdPaths: 1,
  enrolledStudents: 1, certificates: 1, revenue: 1, createdAt: 1,
  teachingStyle: 1, experienceLevel: 1, averageRating: 1, socialLinks: 1,
  teachingStatus: 1, isSubscribed: 1, subscriptionDate: 1, availability: 1,
};

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days — matches token expiry
};

/**
 * Sign and set the JWT cookie.
 * Fixed: original cookie maxAge was 1 day but token expiry was 7 days —
 * cookie would clear before the token expired, leaving dangling tokens.
 * Both are now aligned to 7 days.
 */
const sendTeacherToken = (teacher, res) => {
  const token = jwt.sign(
    { id: teacher._id, role: "teacher" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.cookie("teacherToken", token, COOKIE_OPTIONS);
  return token;
};

/** Serialise a teacher document into the safe public shape */
const toPublicTeacher = (t) => ({
  id:              t._id,
  fullName:        t.fullName,
  email:           t.email,
  role:            "teacher",
  bio:             t.bio,
  phone:           t.phone,
  status:          t.status,
  qualification:   t.qualification,
  university:      t.university,
  expertise:       t.expertise,
  createdPaths:    t.createdPaths,
  enrolledStudents: t.enrolledStudents,
  certificates:    t.certificates,
  revenue:         t.revenue,
  createdAt:       t.createdAt,
  teachingStyle:   t.teachingStyle,
  experienceLevel: t.experienceLevel,
  averageRating:   t.averageRating,
  socialLinks:     t.socialLinks,
  teachingStatus:  t.teachingStatus,
  isSubscribed:    t.isSubscribed,
  subscriptionDate: t.subscriptionDate,
  availability:    t.availability,
  resetOtpExpires: t.resetOtpExpires,
});

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────

export const registerTeacher = async (req, res) => {
  try {
    const { fullName, email, password, institution, qualification, expertise } = req.body;
    const certificatePath = req.files?.certificateFile?.[0]?.path;

    // Validate required fields before hitting the DB
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "Please fill all required fields." });
    }
    if (!certificatePath) {
      return res.status(400).json({ success: false, message: "Please upload at least one certificate." });
    }

    const existing = await Teacher.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }

    const [hashedPassword, uploadedCertificate] = await Promise.all([
      bcrypt.hash(password, 10),
      uploadCertificate(certificatePath),
    ]);

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

    // New teachers are "pending" — don't issue a session token yet.
    // They must be approved before they can log in and act.
    return res.status(201).json({
      success: true,
      message: "Registration successful. Your account is pending admin approval.",
      teacher: {
        id:       newTeacher._id,
        fullName: newTeacher.fullName,
        email:    newTeacher.email,
        status:   newTeacher.status,
      },
    });
  } catch (error) {
    console.error("[registerTeacher]", error);
    return res.status(500).json({ success: false, message: "Server error during registration." });
  }
};

export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // `select("+password")` is needed because password has `select: false` on the schema
    const teacher = await Teacher.findOne({ email }).select("+password");
    if (!teacher) {
      // Use a generic message to avoid user enumeration
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const passwordMatch = await bcrypt.compare(password, teacher.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    // Fixed: original code sent a full JSON response even when status was
    // "pending" or "rejected" — the teacher could read their data but had no
    // cookie, leaving the client in an inconsistent state.
    if (teacher.status === "pending") {
      return res.status(403).json({
        success: false,
        message: "Your account is pending admin approval. You will be notified once approved.",
        status: "pending",
      });
    }

    if (teacher.status === "rejected") {
      return res.status(403).json({
        success: false,
        message: "Your account application was not approved. Please contact support.",
        status: "rejected",
      });
    }

    // Only approved teachers reach here
    sendTeacherToken(teacher, res);

    return res.json({
      success: true,
      message: "Login successful.",
      teacher: toPublicTeacher(teacher),
    });
  } catch (error) {
    console.error("[loginTeacher]", error);
    return res.status(500).json({ success: false, message: "Server error during login." });
  }
};

export const isAuthTeacher = async (req, res) => {
  try {
    const token = req.cookies?.teacherToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ success: false, message: "Invalid or expired session." });
    }

    const teacher = await Teacher.findById(decoded.id).select(PUBLIC_TEACHER_FIELDS);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher account not found." });
    }

    return res.json({ success: true, teacher: toPublicTeacher(teacher) });
  } catch (error) {
    console.error("[isAuthTeacher]", error);
    return res.status(500).json({ success: false, message: "Error checking authentication." });
  }
};

export const logoutTeacher = async (_req, res) => {
  try {
    res.clearCookie("teacherToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });
    return res.json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("[logoutTeacher]", error);
    return res.status(500).json({ success: false, message: "Error logging out." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────────────────────────────────────

export const updateProfile = async (req, res) => {
  try {
    const teacherId = req.userId;

    // Whitelist — never let the client overwrite password / status / revenue
    const ALLOWED = [
      "fullName", "bio", "phone", "qualification", "university",
      "expertise", "teachingStyle", "experienceLevel", "availability",
      "teachingStatus", "socialLinks",
    ];

    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => ALLOWED.includes(k))
    );

    if (!Object.keys(updates).length) {
      return res.status(400).json({ success: false, message: "No valid fields to update." });
    }

    const updated = await Teacher.findByIdAndUpdate(teacherId, updates, {
      new: true,
      runValidators: true,
      select: PUBLIC_TEACHER_FIELDS,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Teacher not found." });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      teacher: toPublicTeacher(updated),
    });
  } catch (error) {
    console.error("[updateProfile]", error);
    return res.status(500).json({ success: false, message: "Server error updating profile." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// STUDENTS
// ─────────────────────────────────────────────────────────────────────────────

export const getEnrolledStudents = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.userId).populate(
      "enrolledStudents",
      "fullName email createdAt"   // only expose safe fields
    );

    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found." });
    }

    return res.status(200).json({
      success: true,
      students: teacher.enrolledStudents,
      total: teacher.enrolledStudents.length,
    });
  } catch (error) {
    console.error("[getEnrolledStudents]", error);
    return res.status(500).json({ success: false, message: "Server error fetching students." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────────────────────────────────────

export const getAllTeachers = async (_req, res) => {
  try {
    // Strip sensitive fields from admin list view
    const teachers = await Teacher.find().select("-password -resetOtp -resetOtpExpires");
    return res.json({ success: true, teachers, total: teachers.length });
  } catch (error) {
    console.error("[getAllTeachers]", error);
    return res.status(500).json({ success: false, message: "Failed to fetch teachers." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SUBSCRIPTION
// ─────────────────────────────────────────────────────────────────────────────

export const subscribeTeacher = async (req, res) => {
  try {
    const teacherId = req.userId;

    const updated = await Teacher.findByIdAndUpdate(
      teacherId,
      { isSubscribed: true, subscriptionDate: new Date() },
      { new: true, select: PUBLIC_TEACHER_FIELDS }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Teacher not found." });
    }

    return res.json({
      success: true,
      message: "Subscription successful! You can now create unlimited paths.",
      teacher: toPublicTeacher(updated),
    });
  } catch (error) {
    console.error("[subscribeTeacher]", error);
    return res.status(500).json({ success: false, message: "Subscription failed." });
  }
};
