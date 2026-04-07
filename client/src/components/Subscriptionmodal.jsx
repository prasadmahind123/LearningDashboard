// components/SubscriptionModal.jsx
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown, CheckCircle2, X, CreditCard, Shield,
  Zap, BookOpen, Users, BarChart3, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dynamically loads the Razorpay checkout.js script exactly once.
 * Returns a promise that resolves when the script is ready.
 */
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// Premium plan features list
const FEATURES = [
  { icon: BookOpen, text: "Unlimited learning paths"         },
  { icon: Users,    text: "Unlimited student enrollments"    },
  { icon: BarChart3, text: "Advanced analytics & reports"   },
  { icon: Zap,      text: "Priority support"                 },
  { icon: Shield,   text: "Certificate management tools"     },
  { icon: Crown,    text: "Premium instructor badge"         },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function SubscriptionModal({ open, onOpenChange }) {
  const { axios, teacher, setTeacher } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // 1. Load Razorpay checkout script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Payment gateway failed to load. Please check your connection.");
        return;
      }

      // 2. Create order on your backend
      const { data } = await axios.post("/api/payment/create-order");
      if (!data.success) {
        toast.error(data.message ?? "Could not initiate payment. Try again.");
        return;
      }

      // 3. Open Razorpay checkout popup
      const options = {
        key:         data.keyId,           // rzp_test_... from backend
        amount:      data.amount,          // in paise
        currency:    data.currency,
        name:        "EduInstructor",
        description: "Premium Instructor Subscription",
        image:       "/logo.png",          // optional: your logo URL
        order_id:    data.orderId,

        // 4. Handler called by Razorpay on successful payment
        handler: async (response) => {
          try {
            // 5. Verify signature on your backend — this is the source of truth
            const verifyRes = await axios.post("/api/payment/verify-payment", {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              // 6. Update teacher in context so UI reflects subscription instantly
              setTeacher((prev) => ({
                ...prev,
                isSubscribed:     true,
                subscriptionDate: new Date().toISOString(),
              }));

              toast.success("🎉 Welcome to Premium! You can now create unlimited paths.");
              onOpenChange(false);
            } else {
              toast.error("Payment verification failed. Contact support with your payment ID.");
            }
          } catch (err) {
            console.error("[SubscriptionModal] verify error:", err);
            toast.error("Verification error. If payment was deducted, contact support.");
          }
        },

        prefill: {
          name:  data.prefill?.name  ?? teacher?.fullName ?? "",
          email: data.prefill?.email ?? teacher?.email    ?? "",
        },

        theme: { color: "#6366f1" }, // indigo — matches teacher portal accent

        // Called when user dismisses the popup without paying
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast("Payment cancelled.", { icon: "ℹ️" });
          },
        },
      };

      const rzp = new window.Razorpay(options);

      // Handle payment errors (e.g. card declined)
      rzp.on("payment.failed", (response) => {
        console.error("[Razorpay] payment.failed:", response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });

      rzp.open();
    } catch (err) {
      console.error("[SubscriptionModal] handlePayment error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      // Note: we leave isProcessing=true while popup is open so the button
      // stays disabled. It resets in modal.ondismiss or after handler resolves.
      // If an error occurred before opening the popup, reset here.
      if (!window.Razorpay) setIsProcessing(false);
    }
  }, [isProcessing, axios, teacher, setTeacher, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">

        {/* ── Header gradient ── */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-8 text-center text-white relative overflow-hidden">
          {/* Decorative rings */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white/5 rounded-full" />

          <motion.div
            animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            className="relative mx-auto w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20"
          >
            <Crown className="h-8 w-8 text-amber-300 fill-amber-300" />
          </motion.div>

          <DialogTitle className="text-2xl font-bold text-white mb-1">
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription className="text-indigo-100 text-sm">
            Unlock unlimited paths and powerful tools for your students.
          </DialogDescription>

          {/* Price */}
          <div className="mt-5 flex items-baseline justify-center gap-1">
            <span className="text-5xl font-extrabold">₹499</span>
            <span className="text-indigo-200 text-base">/month</span>
          </div>
          <p className="text-indigo-200 text-xs mt-1">No setup fee · Cancel anytime</p>
        </div>

        {/* ── Features list ── */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 gap-2.5">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                  <Icon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">{text}</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto shrink-0" />
              </div>
            ))}
          </div>

          {/* Security note */}
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
            <Shield className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>Secured by Razorpay · UPI, Cards, NetBanking & Wallets accepted</span>
          </div>

          {/* CTA */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Opening Payment…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Pay ₹499 · Activate Premium
              </span>
            )}
          </Button>

          <button
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className="w-full text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors py-1 disabled:opacity-50"
          >
            Maybe later
          </button>
        </div>
      </DialogContent>
            
    </Dialog>
  );
}