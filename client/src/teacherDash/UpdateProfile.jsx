import { useState } from "react"
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
import { 
    Mail, Phone, Briefcase, Award, Users, BookOpen, Check, 
    Loader2, Edit2, X, GraduationCap, Github, Linkedin, Twitter, Sparkles 
} from 'lucide-react'
import toast, { Toaster } from "react-hot-toast";
import { useAppContext } from "@/context/AppContext"
import { motion, AnimatePresence } from "framer-motion";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 100 } 
  }
};

const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
};

export default function UpdateProfile() {
  const { teacher, axios } = useAppContext()
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
    { icon: <Users className="h-5 w-5 text-indigo-600" />, label: "Students", value: teacher.enrolledStudents.length, color: "bg-indigo-100" },
    { icon: <BookOpen className="h-5 w-5 text-purple-600" />, label: "Courses", value: teacher.createdPaths.length, color: "bg-purple-100" },
    { icon: <Award className="h-5 w-5 text-amber-600" />, label: "Rating", value: teacher.averageRating || "4.5", color: "bg-amber-100" },
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
        toast.success("Profile updated successfully")
    } catch (error) {
        console.error(error)
        toast.error("Error updating profile")
    } finally {
        setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setChanges({})
  }

  // --- Helper Component for Social Inputs ---
  const SocialInput = ({ icon: Icon, placeholder, value, field, colorClass }) => (
    <div className="relative">
        <div className={`absolute left-3 top-2.5 ${colorClass}`}>
            <Icon className="h-4 w-4" />
        </div>
        <Input
            value={value}
            onChange={(e) => handleInputChange('socialLinks', { ...formData.socialLinks, [field]: e.target.value })}
            disabled={!isEditing}
            className={`pl-10 transition-all ${isEditing ? "bg-white border-slate-300 focus:ring-2 ring-indigo-500/20" : "bg-slate-50 border-transparent"}`}
            placeholder={placeholder}
        />
    </div>
  );

  return (
    <div className="flex-1 h-[90vh] overflow-y-auto bg-slate-50/50 dark:bg-slate-950 no-scrollbar">
      <motion.main 
        className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* --- Header Banner --- */}
        <motion.div variants={itemVariants} className="relative">
            <div className="h-48 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute top-0 right-0 p-6 opacity-20">
                    <Sparkles className="h-24 w-24 text-white" />
                </div>
            </div>

            <Card className="mx-6 -mt-16 border-0 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        <motion.div 
                            whileHover={{ scale: 1.05 }} 
                            className="relative -mt-12 md:-mt-20"
                        >
                            <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-900 shadow-md">
                                <AvatarFallback className="text-4xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700">
                                    {formData.fullName[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-2 right-2 h-4 w-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                        </motion.div>

                        <div className="flex-1 text-center md:text-left space-y-2 mb-2">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                                {formData.fullName}
                            </h2>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 items-center text-slate-500 font-medium">
                                <span className="flex items-center gap-1">
                                    <Briefcase className="h-4 w-4" /> Instructor
                                </span>
                                <span className="hidden md:inline">•</span>
                                <span className="flex items-center gap-1">
                                    <GraduationCap className="h-4 w-4" /> {formData.university || "University"}
                                </span>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
                                {formData.expertise.slice(0, 3).map((skill, idx) => (
                                    <Badge key={idx} variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 w-full md:w-auto justify-center md:justify-end">
                            <AnimatePresence mode="wait">
                                {!isEditing ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <Button onClick={() => setIsEditing(true)} className="bg-slate-900 text-white hover:bg-slate-800 shadow-md">
                                            <Edit2 className="h-4 w-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div className="flex gap-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                        <Button variant="ghost" onClick={handleCancel} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                            Cancel
                                        </Button>
                                        <Button 
                                            onClick={handleSave} 
                                            disabled={isSaving || Object.keys(changes).length === 0}
                                            className="bg-green-600 hover:bg-green-500 text-white min-w-[140px]"
                                        >
                                            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                                            Save Changes
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center justify-center p-2">
                                <div className={`p-2 rounded-full ${stat.color} mb-2`}>
                                    {stat.icon}
                                </div>
                                <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{stat.value}</span>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Left Column: Main Forms --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personal Info */}
            <motion.div variants={itemVariants}>
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="h-1 bg-indigo-500 w-full"></div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Mail className="h-5 w-5 text-indigo-600" />
                            Personal Details
                        </CardTitle>
                        <CardDescription>Your basic contact information.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600">Full Name</label>
                            <Input 
                                value={formData.fullName} 
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                disabled={!isEditing}
                                className={`transition-all ${isEditing ? "bg-white border-slate-300 focus:ring-2 ring-indigo-500/20" : "bg-slate-50 border-transparent"}`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600">Email Address</label>
                            <Input 
                                value={formData.email} 
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                disabled={!isEditing}
                                className={`transition-all ${isEditing ? "bg-white border-slate-300 focus:ring-2 ring-indigo-500/20" : "bg-slate-50 border-transparent"}`}
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Professional Info */}
            <motion.div variants={itemVariants}>
                 <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="h-1 bg-purple-500 w-full"></div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Briefcase className="h-5 w-5 text-purple-600" />
                            Professional Profile
                        </CardTitle>
                        <CardDescription>Highlight your experience and teaching style.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600">Instructor Bio</label>
                            <Textarea 
                                value={formData.bio} 
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                disabled={!isEditing}
                                className={`min-h-[120px] resize-none transition-all ${isEditing ? "bg-white border-slate-300 focus:ring-2 ring-purple-500/20" : "bg-slate-50 border-transparent"}`}
                                placeholder="Share your teaching philosophy..."
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600">University</label>
                                <Input 
                                    value={formData.university} 
                                    onChange={(e) => handleInputChange('university', e.target.value)}
                                    disabled={!isEditing}
                                    placeholder="Institution Name"
                                    className={`transition-all ${isEditing ? "bg-white border-slate-300 focus:ring-2 ring-purple-500/20" : "bg-slate-50 border-transparent"}`}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600">Qualifications</label>
                                <Input 
                                    value={formData.qualifications} 
                                    onChange={(e) => handleInputChange('qualifications', e.target.value)}
                                    disabled={!isEditing}
                                    placeholder="PhD, Masters, etc."
                                    className={`transition-all ${isEditing ? "bg-white border-slate-300 focus:ring-2 ring-purple-500/20" : "bg-slate-50 border-transparent"}`}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600">Teaching Style</label>
                                <Select value={formData.teachingStyle} onValueChange={(v) => handleInputChange('teachingStyle', v)} disabled={!isEditing}>
                                    <SelectTrigger className={!isEditing ? "bg-slate-50 border-transparent" : "bg-white"}>
                                        <SelectValue placeholder="Select Style" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="interactive">Interactive</SelectItem>
                                        <SelectItem value="project-based">Project Based</SelectItem>
                                        <SelectItem value="lecture">Lecture</SelectItem>
                                        <SelectItem value="mixed">Mixed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600">Experience</label>
                                <Select value={formData.experienceLevel} onValueChange={(v) => handleInputChange('experienceLevel', v)} disabled={!isEditing}>
                                    <SelectTrigger className={!isEditing ? "bg-slate-50 border-transparent" : "bg-white"}>
                                        <SelectValue placeholder="Years of Experience" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0-2">0-2 Years</SelectItem>
                                        <SelectItem value="2-5">2-5 Years</SelectItem>
                                        <SelectItem value="5-8">5-8 Years</SelectItem>
                                        <SelectItem value="8+">8+ Years</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
          </div>

          {/* --- Right Column: Sidebar --- */}
          <div className="space-y-8">
            
            {/* Skills Widget */}
            <motion.div variants={itemVariants}>
                 <Card className="border-slate-200 dark:border-slate-800 shadow-sm h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Award className="h-5 w-5 text-amber-500" /> Expertise
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <AnimatePresence>
                                {formData.expertise.map((skill, idx) => (
                                    <motion.div key={`${skill}-${idx}`} variants={scaleIn} initial="hidden" animate="visible" exit="hidden" layout>
                                        <Badge className="pl-3 pr-1 py-1.5 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 flex items-center gap-1">
                                            {skill}
                                            {isEditing && (
                                                <button 
                                                    onClick={() => handleInputChange('expertise', formData.expertise.filter((_, i) => i !== idx))}
                                                    className="hover:bg-red-100 text-slate-400 hover:text-red-500 rounded-full p-0.5 transition-colors"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            )}
                                        </Badge>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        {isEditing && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <Input 
                                    placeholder="Add skill + Enter" 
                                    className="bg-white border-slate-300 focus:ring-2 ring-amber-500/20"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                            handleInputChange('expertise', [...formData.expertise, e.currentTarget.value.trim()])
                                            e.currentTarget.value = ''
                                        }
                                    }}
                                />
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Availability Widget */}
             <motion.div variants={itemVariants}>
                 <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Teaching Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select value={formData.teachingStatus} onValueChange={(v) => handleInputChange('teachingStatus', v)} disabled={!isEditing}>
                            <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Set Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="full-time">Full-time Instructor</SelectItem>
                                <SelectItem value="part-time">Part-time Instructor</SelectItem>
                                <SelectItem value="freelance">Freelance</SelectItem>
                                <SelectItem value="unavailable">Unavailable</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
            </motion.div>

             {/* Social Links */}
             <motion.div variants={itemVariants}>
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Connect</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <SocialInput 
                            icon={Linkedin} 
                            placeholder="LinkedIn URL" 
                            value={formData.socialLinks.linkedin} 
                            field="linkedin" 
                            colorClass="text-blue-600"
                        />
                         <SocialInput 
                            icon={Github} 
                            placeholder="GitHub Username" 
                            value={formData.socialLinks.github} 
                            field="github" 
                            colorClass="text-slate-800"
                        />
                         <SocialInput 
                            icon={Twitter} 
                            placeholder="Twitter Profile" 
                            value={formData.socialLinks.twitter} 
                            field="twitter" 
                            colorClass="text-sky-500"
                        />
                    </CardContent>
                </Card>
             </motion.div>

          </div>
        </div>
      </motion.main>
      <Toaster />
    </div>
  )
}