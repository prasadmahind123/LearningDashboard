import express from "express";
import { createOrder, verifyPayment, webhookHandler } from "../controller/paymentController.js";
import authTeacher from "../middleware/authTeacher.js";
 
const paymentRoute = express.Router();

paymentRoute.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookHandler
);
 
// Create Razorpay order — teacher must be authenticated
paymentRoute.post("/create-order", authTeacher, createOrder);
 
// Verify payment after Razorpay popup closes — teacher must be authenticated
paymentRoute.post("/verify-payment",authTeacher ,  verifyPayment);
 
export default paymentRoute;