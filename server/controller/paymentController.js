// controllers/paymentController.js
import Razorpay from "razorpay";
import crypto from "crypto";
import Teacher from "../models/teacher.js";

// ─────────────────────────────────────────────────────────────────────────────
// Razorpay SDK instance — initialised once, reused across requests
// ─────────────────────────────────────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Subscription price in paise (₹499 × 100 = 49900 paise)
const SUBSCRIPTION_AMOUNT_PAISE = 49900;
const SUBSCRIPTION_CURRENCY     = "INR";

// ─────────────────────────────────────────────────────────────────────────────
// 1. CREATE ORDER
//    Called first: backend creates a Razorpay order and returns the order_id
//    to the frontend. The frontend then opens the Razorpay checkout popup.
//
//    POST /api/payment/create-order
//    Auth: teacher must be logged in (req.userId set by middleware)
// ─────────────────────────────────────────────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const teacherId = req.userId;

    const teacher = await Teacher.findById(teacherId).select("isSubscribed fullName email");
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found." });
    }

    if (teacher.isSubscribed) {
      return res.status(400).json({
        success: false,
        message: "You are already subscribed.",
      });
    }

    const order = await razorpay.orders.create({
      amount:   SUBSCRIPTION_AMOUNT_PAISE,
      currency: SUBSCRIPTION_CURRENCY,
      // Unique receipt ties this order to the teacher — stored for reconciliation
      receipt:  "rcpt_" + Date.now(),
      notes: {
        teacherId:   teacherId.toString(),
        teacherName: teacher.fullName,
        purpose:     "premium_subscription",
      },
    });

    return res.status(200).json({
      success:  true,
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      // Send the public key to frontend — never the secret
      keyId:    process.env.RAZORPAY_KEY_ID,
      // Prefill data for the checkout popup
      prefill: {
        name:  teacher.fullName,
        email: teacher.email,
      },
    });
  } catch (error) {
    console.error("[createOrder]", error);
    return res.status(500).json({ success: false, message: "Could not create payment order." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. VERIFY PAYMENT  (frontend-triggered, after Razorpay popup closes)
//    The frontend sends razorpay_order_id, razorpay_payment_id, and
//    razorpay_signature. We verify the HMAC-SHA256 signature to confirm
//    the payment is genuine, then activate the subscription.
//
//    POST /api/payment/verify
//    Auth: teacher must be logged in
// ─────────────────────────────────────────────────────────────────────────────

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    console.log("VERIFY DATA:", req.body);

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    console.log("Generated:", generatedSignature);
    console.log("Received:", razorpay_signature);

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Signature mismatch",
      });
    }

    // Signature is valid — activate subscription for the teacher
    const teacherId = req.userId;
    await Teacher.findByIdAndUpdate(
      teacherId,
      {
        $set: {
          isSubscribed:     true,
          subscriptionDate: new Date(),
          lastPaymentId:    razorpay_payment_id,
          lastOrderId:      razorpay_order_id,
        },
      },
      { new: false }
    );

    return res.json({
      success: true,
      message: "Payment verified successfully",
    });

    

  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false });
  }
};
// ─────────────────────────────────────────────────────────────────────────────
// 3. WEBHOOK  (Razorpay → your server, async, source of truth)
//    Register this URL in your Razorpay dashboard under:
//    Settings → Webhooks → https://yourdomain.com/api/payment/webhook
//    Events to enable: payment.captured
//
//    IMPORTANT: This route must receive the raw body, NOT parsed JSON.
//    In your Express app, register this route BEFORE app.use(express.json()):
//
//      app.post(
//        "/api/payment/webhook",
//        express.raw({ type: "application/json" }),
//        webhookHandler
//      );
//
//    POST /api/payment/webhook
//    No auth middleware — Razorpay calls this directly
// ─────────────────────────────────────────────────────────────────────────────
export const webhookHandler = async (req, res) => {
  try {
    const webhookSecret   = process.env.RAZORPAY_WEBHOOK_SECRET;
    const receivedSig     = req.headers["x-razorpay-signature"];

    if (!webhookSecret || !receivedSig) {
      return res.status(400).json({ success: false, message: "Missing webhook credentials." });
    }

    // Verify webhook signature using the raw body
    const expectedSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body)           // req.body is a Buffer (raw body)
      .digest("hex");

    if (expectedSig !== receivedSig) {
      console.warn("[webhook] Invalid signature received");
      return res.status(400).json({ success: false, message: "Invalid webhook signature." });
    }

    // Parse the raw buffer now that we've verified authenticity
    const event = JSON.parse(req.body.toString());

    if (event.event === "payment.captured") {
      const payment  = event.payload.payment.entity;
      const notes    = payment.notes ?? {};
      const teacherId = notes.teacherId;

      if (!teacherId) {
        // Payment not associated with a teacher subscription — ignore gracefully
        console.warn("[webhook] payment.captured with no teacherId in notes:", payment.id);
        return res.status(200).json({ success: true });
      }

      // Idempotent update — safe to run multiple times
      await Teacher.findByIdAndUpdate(
        teacherId,
        {
          $set: {
            isSubscribed:     true,
            subscriptionDate: new Date(payment.created_at * 1000),
            lastPaymentId:    payment.id,
            lastOrderId:      payment.order_id,
          },
        },
        { new: false } // Don't need the result; webhook should be fast
      );

      console.info(
        `[webhook] Subscription confirmed for teacher ${teacherId} | payment ${payment.id}`
      );
    }

    // Always respond 200 to Razorpay quickly — retry logic kicks in on non-200
    return res.status(200).json({ success: true, received: true });
  } catch (error) {
    console.error("[webhook]", error);
    // Return 200 anyway — Razorpay will retry on 5xx which can cause duplicates
    return res.status(200).json({ success: true, received: false });
  }
};