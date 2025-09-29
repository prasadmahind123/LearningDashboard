import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import Teacher from "../models/teacher.js";
import Learner from "../models/learner.js";     // Your user model
import OTP from "../models/otp.js";        // The OTP model

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use App Password if 2FA is enabled
  },
});


// ✅ Setup Nodemailer
const sendOtpEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};


// ✅ Step 1: Send OTP
export const sendOTP = async (req, res) => {
  const { email, role } = req.body;

  const Model = role === "teacher" ? Teacher : Learner;
  const user = await Model.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = await bcrypt.hash(otp, 10);
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

  await sendOtpEmail(email, otp);
  res.json({ success: true, message: "OTP sent to email" });
};

// ✅ Step 2: Verify OTP
export const verifyOTP = async (req, res) => {
  try {
   

    const { email, otp, role } = req.body;
    const Model = role === "teacher" ? Teacher : Learner;

    const user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.resetOtp || user.resetOtpExpires < Date.now())
      return res.status(400).json({ success: false, message: "OTP expired or not found" });

    const isMatch = await bcrypt.compare(otp, user.resetOtp);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid OTP" });

    res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    console.error(error); // log the actual error
    res.status(500).json({ success: false, message: "Server error verifying OTP" });
  }
};


// ✅ Step 3: Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, role } = req.body;
    const Model = role === "teacher" ? Teacher : Learner;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Model.findOneAndUpdate({ email }, { password: hashedPassword });

    // Clear OTP fields in user document
    await Model.findOneAndUpdate({ email }, { resetOtp: null, resetOtpExpires: null });

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error resetting password" });
  }
};

