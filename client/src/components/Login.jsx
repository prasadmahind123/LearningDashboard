

import { useEffect, useState } from "react"
import { NavLink} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Eye, EyeOff } from "lucide-react"
import { useAppContext } from "../context/AppContext.jsx"

export default function Login() {

  const { navigate , axios , setUserRole , userRole} = useAppContext()
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.post(`/api/Rs{userType}/login`, { email, password });

    if (data.success) {
      if (userType === "teacher") {
        if (data.teacher.status === "approved") {
          setUserRole(userType);
          navigate("/teacher");
        } else {
          alert("Your account is not approved yet. Please wait for admin approval.");
        }
      } else {
        // learners and admins don't have approval status
        setUserRole(userType);
        if (userType === "learner") navigate("/learner");
        else if (userType === "admin") navigate("/admin");
      }
    } else {
      alert("Login failed.");
    }
  } catch (error) {
  console.error("Login error:", error);
  if (error.response) {
    if (error.response.status === 403) {
      alert("Your account is not approved yet. Please wait for admin approval.");
    } else if (error.response.status === 401) {
      alert("Invalid email or password.");
    } else {
      alert("An error occurred: " + error.response.data.message);
    }
  } else {
    alert("Server is not responding. Please try again later.");
  }
}
};


  useEffect(() => {
    if (userRole) {
      if (userRole === "learner") navigate("/learner");
      else if (userRole === "teacher") navigate("/teacher");
      else if (userRole === "admin") navigate("/admin");
    }
  }, [userRole, navigate]);


  return !userRole &&(
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">EduPlatform</span>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue learning</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userType">I am a</Label>
              <Select value={userType} onValueChange={setUserType} required>
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="w-full cursor-pointer" value="learner">Student</SelectItem>
                  <SelectItem className="w-full cursor-pointer" value="teacher">Teacher</SelectItem>
                  <SelectItem className="w-full cursor-pointer" value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <NavLink to="/forgot-password" className="text-sm text-primary hover:underline cursor-pointer">
                Forgot password?
              </NavLink>
            </div>

            <Button type="submit" className="w-full cursor-pointer">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <NavLink to="/register" className="text-primary hover:underline cursor-pointer">
              Sign up
            </NavLink>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
