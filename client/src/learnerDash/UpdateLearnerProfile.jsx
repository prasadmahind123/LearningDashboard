
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
import { ArrowLeft, Mail, Phone, MapPin, Target, BookOpen, Award, Users, Check, AlertCircle, Loader2, Zap } from 'lucide-react'
import toast, { Toaster } from "react-hot-toast";
import { useAppContext } from "@/context/AppContext"

export default function UpdateLearnerProfile() {
  const { learner , axios } = useAppContext()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: learner.name,
    email: learner.email,
    phone: learner.phone || "",
    bio: learner.bio || "",
    educationLevel: learner.educationLevel || "",
    learningStyle: learner.learningStyle || "",
    interests: learner.interests || [],
    goals: learner.goals || [],
    university: learner.university || "",
    socialLinks: {
      linkedin: learner.socialLinks?.linkedin || "",
      github: learner.socialLinks?.github || "",
      portfolio: learner.socialLinks?.portfolio || "",
    },
  })

  const [changes, setChanges] = useState({})

  const stats = [
    { icon: <BookOpen className="h-5 w-5" />, label: "Courses Enrolled", value: learner.enrolledPaths?.length },
    { icon: <Award className="h-5 w-5" />, label: "Learning Hours", value: learner.totalLearningHours },
    { icon: <Zap className="h-5 w-5" />, label: "Learning Streak", value: "25 days" },
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setChanges(prev => ({ ...prev, [field]: true }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response =  await axios.put("api/learner/update-profile" , formData)
      console.log("Profile updated:", response.data)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile. Please try again.")
      setIsSaving(false)
      return
    }
    setIsSaving(false)
    setIsEditing(false)
    setChanges({})
    toast.success("Profile updated successfully!")
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
                <Avatar className="h-24 w-24 sm:h-15 sm:w-15 border-4 border-primary/10">
                  <AvatarFallback>{`${formData.fullName[0]}`}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-1">
                    {formData.fullName}
                  </h2>
                  <p className="text-muted-foreground mb-3">Active Learner</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.slice(0, 3).map((interest, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {interest}
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
            <Button onClick={() => setIsEditing(true)} size="lg">
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
                    <label className="text-sm font-medium mb-2 block"> Name</label>
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

                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="disabled:opacity-75"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Learning Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Learning Information
                </CardTitle>
                <CardDescription>Tell us about your learning journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">About You</label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    className="disabled:opacity-75 min-h-24 resize-none"
                    placeholder="Tell us about your learning goals and interests..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">{formData.bio.length} / 500 characters</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Education Level</label>
                    <Select value={formData.educationLevel} onValueChange={(value) => handleInputChange('educationLevel', value)} disabled={!isEditing}>
                      <SelectTrigger className="disabled:opacity-75">
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="highschool">High School</SelectItem>
                        <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                        <SelectItem value="masters">Master's Degree</SelectItem>
                        <SelectItem value="phd">Ph.D.</SelectItem>
                        <SelectItem value="none">No formal education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Learning Style</label>
                    <Select value={formData.learningStyle} onValueChange={(value) => handleInputChange('learningStyle', value)} disabled={!isEditing}>
                      <SelectTrigger className="disabled:opacity-75">
                        <SelectValue placeholder="Select learning style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="project-based">Project-Based Learning</SelectItem>
                        <SelectItem value="interactive">Interactive & Hands-on</SelectItem>
                        <SelectItem value="lecture">Lecture-Based</SelectItem>
                        <SelectItem value="self-paced">Self-Paced</SelectItem>
                        <SelectItem value="mixed">Mixed Approach</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">University/Institution</label>
                  <Input
                    value={formData.university}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                    disabled={!isEditing}
                    className="disabled:opacity-75"
                    placeholder="Current or previous school"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Interests & Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Interests & Skills
                </CardTitle>
                <CardDescription>What are you interested in learning?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-3 block">Areas of Interest</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.interests.map((interest, idx) => (
                      <Badge key={idx} className="px-3 py-1.5 text-sm font-medium">
                        {interest}
                        {isEditing && (
                          <button
                            onClick={() => {
                              const newInterests = formData.interests.filter((_, i) => i !== idx)
                              handleInputChange('interests', newInterests)
                            }}
                            className="ml-2 hover:opacity-70"
                          >
                            ✕
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>

                  {isEditing && (
                    <Input
                      placeholder="Add an interest and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          const newInterests = [...formData.interests, e.currentTarget.value.trim()]
                          handleInputChange('interests', newInterests)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Learning Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Learning Goals
                </CardTitle>
                <CardDescription>What do you want to achieve?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-3 block">Your Goals</label>
                  <div className="space-y-2 mb-3">
                    {formData.goals.map((goal, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium">{goal}</span>
                        {isEditing && (
                          <button
                            onClick={() => {
                              const newGoals = formData.goals.filter((_, i) => i !== idx)
                              handleInputChange('goals', newGoals)
                            }}
                            className="text-red-500 hover:opacity-70 text-xl"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {isEditing && (
                    <Input
                      placeholder="Add a goal and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          const newGoals = [...formData.goals, e.currentTarget.value.trim()]
                          handleInputChange('goals', newGoals)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">


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
                    placeholder="linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">GitHub</label>
                  <Input
                    value={formData.socialLinks.github}
                    onChange={(e) => handleInputChange('socialLinks', { ...formData.socialLinks, github: e.target.value })}
                    disabled={!isEditing}
                    className="disabled:opacity-75 text-sm"
                    placeholder="github.com/username"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Portfolio</label>
                  <Input
                    value={formData.socialLinks.portfolio}
                    onChange={(e) => handleInputChange('socialLinks', { ...formData.socialLinks, portfolio: e.target.value })}
                    disabled={!isEditing}
                    className="disabled:opacity-75 text-sm"
                    placeholder="yourportfolio.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Learning Tips */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">Learner Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-800 space-y-2">
                <p>• Complete your profile for better course recommendations</p>
                <p>• Link your GitHub to showcase projects</p>
                <p>• Set clear learning goals for motivation</p>
                <p>• Join study groups for peer support</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  )
}
