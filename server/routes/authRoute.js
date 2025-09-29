import express from "express";
import { sendOTP, verifyOTP, resetPassword } from "../controller/authController.js";

const router = express.Router();

router.post("/send-otp", sendOTP);

router.post("/verify-otp", verifyOTP);
router.post("/reset", resetPassword);

export default router;
