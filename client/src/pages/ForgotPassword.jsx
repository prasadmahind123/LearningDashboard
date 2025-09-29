import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, CheckCircle, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";

export default function ResetPasswordPage() {
  const [step, setStep] = useState(0); // 0: Email  1: OTP  2: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(""); // <-- Selected role
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* ---------- Step 0: Send OTP ---------- */
  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError("");

    if (!role) return setError("Please select your role");
    if (!email) return setError("Please enter your registered email");

    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/forgot-password/send-otp", { email, role });
      if (res.data.success) setStep(1);
      else setError(res.data.message || "Failed to send OTP");
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- Step 1: Verify OTP ---------- */
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) return setError("Enter a valid 6-digit OTP");

    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/forgot-password/verify-otp", { email, otp, role });
      if (res.data.success) setStep(2);
      else setError(res.data.message || "Invalid OTP");
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- Step 2: Reset Password ---------- */
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) return setError("Password must be at least 8 characters");
    if (newPassword !== confirmPassword) return setError("Passwords do not match");

    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/forgot-password/reset", {
        email,
        role,
        newPassword,
      });
      if (res.data.success) setIsSuccess(true);
      else setError(res.data.message || "Failed to reset password");
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setIsLoading(true);
    try {
      await axios.post("/api/auth/forgot-password/send-otp", { email, role });
      alert("New OTP sent to your email");
    } catch {
      setError("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- Success Screen ---------- */
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Password Reset Successful!</CardTitle>
            <CardDescription>Your password has been successfully updated.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/auth/login")} className="w-full">
              Continue to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ---------- UI Steps ---------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {step === 0
              ? "Forgot Password"
              : step === 1
              ? "Enter Verification Code"
              : "Set New Password"}
          </CardTitle>
          <CardDescription>
            {step === 0 && "Enter your registered email to receive a verification code"}
            {step === 1 && `We've sent a 6-digit code to ${email}`}
            {step === 2 && "Create a strong password for your account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* -------- Step 0 -------- */}
          {step === 0 && (
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <div className="relative">
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={isLoading}
                    className="w-full border rounded-md p-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>Select your role</option>
                    <option value="learner">Learner</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Registered Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || !email || !role}>
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          )}

          {/* -------- Step 1 -------- */}
          {step === 1 && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  disabled={isLoading}
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                />
                <p className="text-xs text-gray-500 text-center">
                  Enter the code sent to your email
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </form>
          )}

          {/* -------- Step 2 -------- */}
          {step === 2 && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="text-xs text-gray-600 space-y-1">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li className={newPassword.length >= 8 ? "text-green-600" : ""}>
                    At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>
                    One uppercase letter
                  </li>
                  <li className={/[a-z]/.test(newPassword) ? "text-green-600" : ""}>
                    One lowercase letter
                  </li>
                  <li className={/\d/.test(newPassword) ? "text-green-600" : ""}>
                    One number
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !newPassword || !confirmPassword}
              >
                {isLoading ? "Updating..." : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Update Password
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/auth/login"
              className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
