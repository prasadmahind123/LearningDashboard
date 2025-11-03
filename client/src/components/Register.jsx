
import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, Eye, EyeOff } from "lucide-react"
import { useAppContext } from "../context/AppContext.jsx"


export default function Register() {
  const { navigate , axios , setUserRole } = useAppContext()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userType, setUserType] = useState("")
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
    try{
      e.preventDefault()
      const { fullName, email, password, confirmPassword, agreeToTerms } = formData

      if (password !== confirmPassword) {
        alert("Passwords do not match")
        return
      }

      if (!agreeToTerms) {
        alert("You must agree to the terms and conditions")
        return
      }
      const form = new FormData();
      form.append("fullName", formData.fullName);
      form.append("email", formData.email);
      form.append("password", formData.password);
      if (userType === "teacher") {
        form.append("qualification", formData.qualifications);
        form.append("institute", formData.institute);
        form.append("certificateFile", certificateFiles[0]); // Assuming single file upload
        form.append("expertise", formData.expertise);
      }
      


    const { data } = await axios.post(`/api/Rs{userType}/register`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (data.success) {
      console.log(userType)
      setUserRole(userType); // update role in context
      if (userType === "learner") navigate("/learner");
      else if (userType === "teacher") navigate("/login");
    } else {
      alert("Login failed.");
    }
    } catch (error) {
      console.error("Sign up error:", error);
      alert("An error occurred while signing up. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">EduPlatform</span>
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join thousands of learners on our platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userType">I want to join as</Label>
              <Select value={userType} onValueChange={setUserType} required>
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="w-full cursor-pointer" value="learner">Student</SelectItem>
                  <SelectItem className="w-full cursor-pointer" value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {userType === "teacher" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="qualifications">Qualifications</Label>
                    <Input
                      id="qualifications"
                      placeholder="e.g., B.Tech in CSE"
                      value={formData.qualifications || ""}
                      onChange={(e) => handleInputChange("qualifications", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certificates">Certificates</Label>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf"
                      name="certificateFile"
                      id="certificates"
                      onChange={(e) => setCertificateFiles(Array.from(e.target.files))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institute">Institute</Label>
                    <Input
                      id="institute"
                      placeholder="e.g., IIT Bombay"
                      value={formData.institute || ""}
                      onChange={(e) => handleInputChange("institute", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expertise">Expertise</Label>
                    <Input
                      id="expertise"
                      placeholder="e.g., AI, Web Development"
                      value={formData.expertise || ""}
                      onChange={(e) => handleInputChange("expertise", e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

            <div className="flex items-center space-x-2 ">
              <Checkbox
                id="terms"
                className="cursor-pointer"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                required
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <NavLink to="/terms" className="text-primary hover:underline cursor-pointer">
                  Terms of Service
                </NavLink>{" "}
                and{" "}
                <NavLink to="/privacy" className="text-primary hover:underline cursor-pointer">
                  Privacy Policy
                </NavLink>
              </Label>
            </div>

            <Button type="submit" className="w-full cursor-pointer">
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <NavLink to="/login" className="text-primary hover:underline">
              Sign in
            </NavLink>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
