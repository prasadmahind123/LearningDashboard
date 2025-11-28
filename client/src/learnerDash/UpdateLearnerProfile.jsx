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
    Mail, Phone, Target, BookOpen, Award, Zap, 
    Check, Loader2, Edit2, X, GraduationCap, Github, Linkedin, Globe 
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

export default function UpdateLearnerProfile() {
  const { learner, axios } = useAppContext()
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
    { icon: <BookOpen className="h-5 w-5 text-blue-600" />, label: "Courses", value: learner.enrolledPaths?.length || 0, color: "bg-blue-100" },
    { icon: <Award className="h-5 w-5 text-purple-600" />, label: "Hours", value: learner.totalLearningHours || 0, color: "bg-purple-100" },
    { icon: <Zap className="h-5 w-5 text-yellow-600" />, label: "Streak", value: "25 Days", color: "bg-yellow-100" },
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setChanges(prev => ({ ...prev, [field]: true }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await axios.put("api/learner/update-profile" , formData)
      console.log("Profile updated:", response.data)
      toast.success("Profile updated successfully!")
      setIsEditing(false)
      setChanges({})
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile.")
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
            className={`pl-10 transition-all ${isEditing ? "bg-white border-slate-300 focus:ring-2 ring-blue-500/20" : "bg-slate-50 border-transparent"}`}
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
        
        {/* --- Header Section with Banner --- */}
        <motion.div variants={itemVariants} className="relative">
            {/* Decorative Banner */}
            <div className="h-48 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute -bottom-10 -right-10 h-64 w-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            {/* Profile Card Overlay */}
            <Card className="mx-6 -mt-16 border-0 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        <motion.div 
                            whileHover={{ scale: 1.05 }} 
                            className="relative -mt-12 md:-mt-20"
                        >
                            <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-900 shadow-md">
                                <AvatarFallback className="text-4xl bg-gradient-to-br from-slate-100 to-slate-300 text-slate-600">
                                    {formData.fullName[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-2 right-2 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </motion.div>

                        <div className="flex-1 text-center md:text-left space-y-2 mb-2">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                                {formData.fullName}
                            </h2>
                            <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                                <GraduationCap className="h-4 w-4" />
                                {formData.educationLevel ? formData.educationLevel.charAt(0).toUpperCase() + formData.educationLevel.slice(1) : "Learner"}
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
                                {formData.interests.slice(0, 3).map((interest, idx) => (
                                    <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">
                                        {interest}
                                    </Badge>
                                ))}
                                {formData.interests.length > 3 && (
                                    <span className="text-xs text-muted-foreground self-center">+{formData.interests.length - 3} more</span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 w-full md:w-auto justify-center md:justify-end">
                            <AnimatePresence mode="wait">
                                {!isEditing ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <Button onClick={() => setIsEditing(true)} className="bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all">
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
                                            disabled={isSaving}
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
                            <motion.div 
                                key={idx} 
                                whileHover={{ y: -2 }}
                                className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <div className={`p-2 rounded-full ${stat.color} mb-2`}>
                                    {stat.icon}
                                </div>
                                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stat.value}</span>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{stat.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Left Column: Forms --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personal Info */}
            <motion.div variants={itemVariants}>
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="h-1 bg-blue-500 w-full"></div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <div className="p-2 bg-blue-100 rounded-lg"><Mail className="h-5 w-5 text-blue-600" /></div>
                            Personal Information
                        </CardTitle>
                        <CardDescription>Keep your contact details up to date.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600">Full Name</label>
                            <Input 
                                value={formData.fullName} 
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                disabled={!isEditing}
                                className={`transition-all ${isEditing ? "bg-white border-slate-300 focus:ring-2 ring-blue-500/20" : "bg-slate-50 border-transparent"}`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600">Email Address</label>
                            <Input 
                                value={formData.email} 
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                disabled={!isEditing}
                                className={`transition-all ${isEditing ? "bg-white border-slate-300 focus:ring-2 ring-blue-500/20" : "bg-slate-50 border-transparent"}`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600">Phone Number</label>
                            <Input 
                                value={formData.phone} 
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                disabled={!isEditing}
                                className={`transition-all ${isEditing ? "bg-white border-slate-300 focus:ring-2 ring-blue-500/20" : "bg-slate-50 border-transparent"}`}
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600">University / Institution</label>
                            <Input 
                                value={formData.university} 
                                onChange={(e) => handleInputChange('university', e.target.value)}
                                disabled={!isEditing}
                                className={`transition-all ${isEditing ? "bg-white border-slate-300 focus:ring-2 ring-blue-500/20" : "bg-slate-50 border-transparent"}`}
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Learning Profile */}
            <motion.div variants={itemVariants}>
                 <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="h-1 bg-purple-500 w-full"></div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <div className="p-2 bg-purple-100 rounded-lg"><BookOpen className="h-5 w-5 text-purple-600" /></div>
                            Learning Profile
                        </CardTitle>
                        <CardDescription>Customize your educational experience.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600">Bio & Goals</label>
                            <Textarea 
                                value={formData.bio} 
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                disabled={!isEditing}
                                className={`min-h-[120px] resize-none transition-all ${isEditing ? "bg-white border-slate-300 focus:ring-2 ring-purple-500/20" : "bg-slate-50 border-transparent"}`}
                                placeholder="Share a bit about yourself..."
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600">Education Level</label>
                                <Select value={formData.educationLevel} onValueChange={(v) => handleInputChange('educationLevel', v)} disabled={!isEditing}>
                                    <SelectTrigger className={!isEditing ? "bg-slate-50 border-transparent" : "bg-white"}>
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="highschool">High School</SelectItem>
                                        <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                                        <SelectItem value="masters">Master's Degree</SelectItem>
                                        <SelectItem value="phd">Ph.D.</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600">Learning Style</label>
                                <Select value={formData.learningStyle} onValueChange={(v) => handleInputChange('learningStyle', v)} disabled={!isEditing}>
                                    <SelectTrigger className={!isEditing ? "bg-slate-50 border-transparent" : "bg-white"}>
                                        <SelectValue placeholder="Select style" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="project-based">Project-Based</SelectItem>
                                        <SelectItem value="visual">Visual</SelectItem>
                                        <SelectItem value="auditory">Auditory</SelectItem>
                                        <SelectItem value="mixed">Mixed</SelectItem>
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
            
            {/* Interests Widget */}
            <motion.div variants={itemVariants}>
                 <Card className="border-slate-200 dark:border-slate-800 shadow-sm h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Zap className="h-5 w-5 text-yellow-500" /> Interests
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <AnimatePresence>
                                {formData.interests.map((interest, idx) => (
                                    <motion.div key={`${interest}-${idx}`} variants={scaleIn} initial="hidden" animate="visible" exit="hidden" layout>
                                        <Badge className="pl-3 pr-1 py-1.5 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 flex items-center gap-1">
                                            {interest}
                                            {isEditing && (
                                                <button 
                                                    onClick={() => handleInputChange('interests', formData.interests.filter((_, i) => i !== idx))}
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
                                    placeholder="Add interest + Enter" 
                                    className="bg-white border-slate-300 focus:ring-2 ring-yellow-500/20"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                            handleInputChange('interests', [...formData.interests, e.currentTarget.value.trim()])
                                            e.currentTarget.value = ''
                                        }
                                    }}
                                />
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Goals Widget */}
             <motion.div variants={itemVariants}>
                 <Card className="border-slate-200 dark:border-slate-800 shadow-sm h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Target className="h-5 w-5 text-red-500" /> Top Goals
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                         <div className="space-y-2">
                             <AnimatePresence>
                                {formData.goals.map((goal, idx) => (
                                    <motion.div 
                                        key={idx} 
                                        initial={{ opacity: 0, height: 0 }} 
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center justify-between p-3 bg-red-50/50 rounded-lg border border-red-100"
                                    >
                                        <span className="text-sm font-medium text-slate-700">{goal}</span>
                                        {isEditing && (
                                            <button 
                                                onClick={() => handleInputChange('goals', formData.goals.filter((_, i) => i !== idx))}
                                                className="text-red-400 hover:text-red-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                         </div>
                         {isEditing && (
                            <Input 
                                placeholder="Add a new goal..." 
                                className="bg-white border-slate-300 focus:ring-2 ring-red-500/20"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                        handleInputChange('goals', [...formData.goals, e.currentTarget.value.trim()])
                                        e.currentTarget.value = ''
                                    }
                                }}
                            />
                        )}
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
                            icon={Globe} 
                            placeholder="Portfolio URL" 
                            value={formData.socialLinks.portfolio} 
                            field="portfolio" 
                            colorClass="text-emerald-600"
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