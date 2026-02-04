import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Eye, EyeOff, LogIn, User, Briefcase, Shield } from "lucide-react"
import { useAppContext } from "../context/AppContext"
import toast, { Toaster } from "react-hot-toast"
import { motion } from "framer-motion"

export default function Login() {

  const { 
    navigate, 
    axios, 
    setUserRole, 
    userRole, 
    setTeacher, 
    setLearner, 
    setIsAuthenticated 
  } = useAppContext()
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

 const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!userType) {
        toast.error("Please select a role to continue.");
        return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post(`/api/${userType}/login`, { email, password });

      if (data.success) {
        // ✅ 2. Update Context State IMMEDIATELY
        setIsAuthenticated(true);
        setUserRole(userType);

        if (userType === "teacher") {
          if (data.teacher.status === "approved") {
            setTeacher(data.teacher); // <--- Update Teacher Data
            navigate("/teacher");
            toast.success("Welcome back, Instructor!");
          } else {
            toast.error("Your account is pending admin approval.");
            setIsAuthenticated(false); // Reset if not approved
          }
        } else {
          // Handle Learner/Admin
          if (userType === "learner") {
            setLearner(data.learner); // <--- Update Learner Data
            navigate("/learner");
            toast.success("Welcome back!");
          }
          else if (userType === "admin") {
            
            navigate("/admin");
            toast.success("Welcome back, Admin.");
          }
        }
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      // ... error handling ...
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userRole) {
      if (userRole === "learner") navigate("/learner");
      else if (userRole === "teacher") navigate("/teacher");
      else if (userRole === "admin") navigate("/admin");
    }
  }, [userRole, navigate]);

  return !userRole && (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg shadow-md">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">EduPlatform</span>
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to continue your journey</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Role Selector */}
              <div className="space-y-2">
                <Label htmlFor="userType" className="text-slate-600 dark:text-slate-400">I am a...</Label>
                <Select value={userType} onValueChange={setUserType} required>
                  <SelectTrigger className="w-full cursor-pointer h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="cursor-pointer" value="learner">
                        <div className="flex items-center gap-2"><User className="h-4 w-4 text-blue-500" /> Student</div>
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="teacher">
                        <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-purple-500" /> Teacher</div>
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="admin">
                        <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-red-500" /> Admin</div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <NavLink to="/forgot-password" className="text-xs text-blue-600 hover:underline font-medium">
                        Forgot password?
                    </NavLink>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 mt-2 transition-all hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"} <LogIn className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-center justify-center pb-6 border-t border-slate-100 dark:border-slate-800 pt-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <NavLink to="/register" className="text-blue-600 hover:underline font-medium">
                Sign up
              </NavLink>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
      <Toaster position="top-center" />
    </div>
  )
}