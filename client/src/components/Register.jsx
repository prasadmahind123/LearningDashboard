import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, Eye, EyeOff, Upload, GraduationCap, Briefcase, User } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import toast, { Toaster } from "react-hot-toast"
import { motion } from "framer-motion"

export default function Register() {
  const { axios, setUserRole } = useAppContext()
  const navigate = useNavigate()
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userType, setUserType] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    qualifications: "",
    institute: "",
    expertise: ""
  })
  const [certificateFiles, setCertificateFiles] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSignUp = async(e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { password, confirmPassword, agreeToTerms } = formData

      if (!userType) {
        toast.error("Please select a role (Student or Teacher)")
        setIsLoading(false)
        return
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match")
        setIsLoading(false)
        return
      }

      if (!agreeToTerms) {
        toast.error("You must agree to the terms and conditions")
        setIsLoading(false)
        return
      }

      const form = new FormData();
      form.append("fullName", formData.fullName);
      form.append("email", formData.email);
      form.append("password", formData.password);
      
      if (userType === "teacher") {
        if (!formData.qualifications || !formData.institute || !formData.expertise) {
            toast.error("Please fill in all teacher details");
            setIsLoading(false);
            return;
        }
        form.append("qualification", formData.qualifications);
        form.append("institute", formData.institute);
        form.append("expertise", formData.expertise);
        
        if (certificateFiles.length > 0) {
            form.append("certificateFile", certificateFiles[0]);
        }
      }

      const { data } = await axios.post(`/api/${userType}/register`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success(`Welcome! Registered as ${userType}`);
        setUserRole(userType); 
        
        // Small delay for toast to show before redirect
        setTimeout(() => {
            if (userType === "learner") navigate("/learner");
            else if (userType === "teacher") navigate("/teacher");
        }, 1000);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error(error.response?.data?.message || "An error occurred during sign up");
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
          <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">EduPlatform</span>
              </div>
              <CardTitle className="text-2xl">Create an Account</CardTitle>
              <CardDescription>Start your learning journey today</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                
                {/* Role Selection */}
                <div className="space-y-2">
                  <Label htmlFor="userType">I want to join as</Label>
                  <Select value={userType} onValueChange={setUserType}>
                    <SelectTrigger className="w-full cursor-pointer h-11">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="learner" className="cursor-pointer">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" /> Student
                        </div>
                      </SelectItem>
                      <SelectItem value="teacher" className="cursor-pointer">
                        <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" /> Teacher
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Basic Info */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="h-10"
                  />
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="******"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            required
                            className="pr-10 h-10"
                            />
                            <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                            onClick={() => setShowPassword(!showPassword)}
                            >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm</Label>
                        <div className="relative">
                            <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="******"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            required
                            className="pr-10 h-10"
                            />
                            <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Conditional Teacher Fields with Animation */}
                {userType === "teacher" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                        <GraduationCap className="h-4 w-4" /> Instructor Details
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="institute">Institute</Label>
                            <Input
                                id="institute"
                                placeholder="University / Organization"
                                value={formData.institute}
                                onChange={(e) => handleInputChange("institute", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="qualifications">Qualifications</Label>
                            <Input
                                id="qualifications"
                                placeholder="Degree / Cert"
                                value={formData.qualifications}
                                onChange={(e) => handleInputChange("qualifications", e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="expertise">Area of Expertise</Label>
                        <Input
                            id="expertise"
                            placeholder="e.g., Web Development, Data Science"
                            value={formData.expertise}
                            onChange={(e) => handleInputChange("expertise", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="certificates">Upload Certificate (PDF)</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="file"
                                accept=".pdf"
                                id="certificates"
                                onChange={(e) => setCertificateFiles(Array.from(e.target.files))}
                                className="cursor-pointer text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>
                  </motion.div>
                )}

                {/* Terms Checkbox */}
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                    required
                  />
                  <Label htmlFor="terms" className="text-sm font-normal text-slate-600 dark:text-slate-400">
                    I agree to the{" "}
                    <NavLink to="/terms" className="text-blue-600 hover:underline">Terms of Service</NavLink>
                    {" "}and{" "}
                    <NavLink to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</NavLink>
                  </Label>
                </div>

                <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11"
                    disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="text-center justify-center pb-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <NavLink to="/login" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </NavLink>
              </p>
            </CardFooter>
          </Card>
      </motion.div>
      <Toaster position="top-center" />
    </div>
  )
}