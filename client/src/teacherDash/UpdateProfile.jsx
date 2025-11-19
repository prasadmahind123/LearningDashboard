
import { useState } from "react"
import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Award, Users, BookOpen, Check, AlertCircle, Upload, Loader2 } from 'lucide-react'
import toast, { Toaster } from "react-hot-toast";
import { useAppContext } from "@/context/AppContext"

export default function UpdateProfile() {
const { teacher , axios , paths} = useAppContext()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: teacher.fullName,
    email: teacher.email,
    bio: teacher.bio || "",
    expertise: teacher.expertise || ["Web Development", "JavaScript", "React"],
    qualifications: teacher.qualification || "",
    experienceLevel: teacher.experienceLevel || "",
    university: teacher.university || "",
    teachingStyle: teacher.teachingStyle || "",
    socialLinks: {
      linkedin: teacher.socialLinks?.linkedin || "",
      github: teacher.socialLinks?.github || "",
      twitter: teacher.socialLinks?.twitter || "",
    },
    availability: teacher.availability || "",
    teachingStatus: teacher.teachingStatus || "",
  })

  const [changes, setChanges] = useState({})

  const stats = [
    { icon: <Users className="h-5 w-5" />, label: "Total Students", value: teacher.enrolledStudents.length },
    { icon: <BookOpen className="h-5 w-5" />, label: "Courses Created", value: teacher.createdPaths.length },
    { icon: <Award className="h-5 w-5" />, label: "Avg Rating", value: teacher.averageRating || "4.5" },
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setChanges(prev => ({ ...prev, [field]: true }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
        const response = await axios.put("/api/teacher/updateProfile" , formData)
        console.log("Profile updated:", response.data)
        setIsEditing(false)
        setChanges({})
    } catch (error) {
        toast.error("Error updating profile")
        console.log(error)
    }

    toast.success("Profile updated successfully")
    setIsSaving(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setChanges({})
  }

  return (
    <div className="no-scrollbar flex-1 h-[90vh] overflow-y-scroll 
        flex flex-col justify-between">

      <main className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Profile Header Card */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-4 w-4 sm:h-15 sm:w-15 border-4 border-primary/10">
                  <AvatarFallback>{`${formData.fullName[0]}`}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-1">
                    {formData.fullName}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {formData.expertise.map((skill, idx) => (
                        <Badge
                            key={idx}
                            variant="secondary"
                            className="flex items-center gap-2"
                        >
                            {skill}
                        </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full sm:w-auto">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="flex justify-center mb-2 text-primary">
                      {stat.icon}
                    </div>
                    <p className="text-lg sm:text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Button */}
        <div className="flex justify-end gap-2 mb-6">
          {!isEditing ? (
            <Button variant={"secondary"} onClick={() => setIsEditing(true)} size="lg">
              Edit Profile
            </Button>
          ) : (
            <>
              <Button variant="outline" size="lg" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                size="lg" 
                disabled={isSaving || Object.keys(changes).length === 0}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your basic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name</label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      disabled={!isEditing}
                      className="disabled:opacity-75"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="disabled:opacity-75"
                  />
                </div>


              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Professional Information
                </CardTitle>
                <CardDescription>Share your expertise and experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Bio</label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    className="disabled:opacity-75 min-h-24 resize-none"
                    placeholder="Tell students about yourself and your teaching approach..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">{formData.bio.length} / 500 characters</p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Qualifications</label>
                  <Input
                    value={formData.qualifications}
                    onChange={(e) => handleInputChange('qualifications', e.target.value)}
                    disabled={!isEditing}
                    className="disabled:opacity-75"
                    placeholder="e.g., B.S. in Computer Science, AWS Certified..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">University</label>
                  <Input
                    value={formData.university}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                    disabled={!isEditing}
                    className="disabled:opacity-75"
                    placeholder="Educational Institution"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Years of Experience</label>
                    <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)} disabled={!isEditing}>
                      <SelectTrigger className="disabled:opacity-75">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-2">0-2 years</SelectItem>
                        <SelectItem value="2-5">2-5 years</SelectItem>
                        <SelectItem value="5-8">5-8 years</SelectItem>
                        <SelectItem value="8+">8+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Teaching Style</label>
                    <Select value={formData.teachingStyle} onValueChange={(value) => handleInputChange('teachingStyle', value)} disabled={!isEditing}>
                      <SelectTrigger className="disabled:opacity-75">
                        <SelectValue placeholder="Select teaching style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interactive">Interactive & Hands-on</SelectItem>
                        <SelectItem value="project-based">Project-Based Learning</SelectItem>
                        <SelectItem value="lecture">Lecture-Based</SelectItem>
                        <SelectItem value="mixed">Mixed Approach</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expertise & Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Expertise & Skills
                </CardTitle>
                <CardDescription>Add skills you're proficient in</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    {formData.expertise.map((skill, idx) => (
                        <Badge
                            key={idx}
                            variant="secondary"
                            className="flex items-center gap-2"
                        >
                            {skill}
                            {isEditing && (
                                <button
                                    onClick={() => {
                                        const newExpertise = formData.expertise.filter((_, i) => i !== idx)
                                        handleInputChange('expertise', newExpertise)
                                    }}
                                    >
                                    &times;
                                </button>
                            )}
                        </Badge>
                    ))}
                </div>

                {isEditing && (
                  <Input
                    placeholder="Add a skill and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        const newExpertise = [...formData.expertise, e.currentTarget.value.trim()]
                        handleInputChange('expertise', newExpertise)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                )}
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Teaching Status
                </CardTitle>
                <CardDescription>Set your availability for teaching</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={formData.teachingStatus} onValueChange={(value) => handleInputChange('teachingStatus', value)} disabled={!isEditing}>
                  <SelectTrigger className="disabled:opacity-75">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time Instructor</SelectItem>
                    <SelectItem value="part-time">Part-time Instructor</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="unavailable">Currently Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Strength */}
           

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Social Links</CardTitle>
                <CardDescription>Connect your profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">LinkedIn</label>
                  <Input
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleInputChange('socialLinks', { ...formData.socialLinks, linkedin: e.target.value })}
                    disabled={!isEditing}
                    className="disabled:opacity-75 text-sm"
                    placeholder= {formData.socialLinks?.linkedin || "https://linkedin.com/in/yourprofile"}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">GitHub</label>
                  <Input
                    value={formData.socialLinks.github}
                    onChange={(e) => handleInputChange('socialLinks', { ...formData.socialLinks, github: e.target.value })}
                    disabled={!isEditing}
                    className="disabled:opacity-75 text-sm"
                    placeholder={formData.socialLinks?.github}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Twitter</label>
                  <Input
                    value={formData.socialLinks.twitter}
                    onChange={(e) => handleInputChange('socialLinks', { ...formData.socialLinks, twitter: e.target.value })}
                    disabled={!isEditing}
                    className="disabled:opacity-75 text-sm"
                    placeholder={formData.socialLinks?.twitter}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">Profile Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-800 space-y-2">
                <p>• Add a professional photo for better credibility</p>
                <p>• Write a compelling bio to attract students</p>
                <p>• List all relevant skills and expertise</p>
                <p>• Link your social profiles</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
        <Toaster />
    </div>
  )
}
