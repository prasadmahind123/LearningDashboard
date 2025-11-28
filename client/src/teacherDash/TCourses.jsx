import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, BarChart3, Star, Trash, BookOpen, Clock, MoreVertical, Search, Filter, AlertCircle, Copy, Check } from "lucide-react"
import { useAppContext } from "../context/AppContext.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function Tcourses() {
  const { teachersPath, teacher, paths, axios, setTeachersPath } = useAppContext();
  const [isViewcourseOpen, setIsViewcourseOpen] = useState(false);
  const [viewingcourse, setViewingcourse] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!teacher) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        <div className="animate-pulse flex flex-col items-center">
          <BookOpen className="h-10 w-10 mb-2 opacity-50" />
          Loading courses...
        </div>
      </div>
    );
  }

  // Filter Logic
  const filteredPaths = (teachersPath || []).filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    // Assuming 'status' field exists or deriving it based on isPrivate
    // If no status field, we can filter by isPrivate for "Published" vs "Draft/Private" simulation
    const matchesFilter = filterStatus === "all" 
      ? true 
      : filterStatus === "private" 
        ? course.isPrivate 
        : !course.isPrivate; // "public"

    return matchesSearch && matchesFilter;
  });

  const deleteCourse = (course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;
    try {
      await axios.delete(`/api/learningpaths/delete/${courseToDelete._id}`, {
        withCredentials: true,
      });

      // remove from UI
      setTeachersPath((prev) => prev.filter((c) => c._id !== courseToDelete._id));

      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting course");
    }
  };

  const handleViewcourse = (courseId) => {
    const foundCourse = paths.find((p) => p._id === courseId);
    if (!foundCourse) {
      alert("Course details not found.");
      return;
    }
    setViewingcourse(foundCourse);
    setIsViewcourseOpen(true);
  };

  const copyLink = async () => {
    try {
      const url = `${window.location.origin}/courses/learning-path/${viewingcourse?._id}`;
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard");
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const sections = viewingcourse?.content || viewingcourse?.learningPath || [];
  const createdBy = viewingcourse?.createdBy || { fullName: "", email: "" };

  return (
    <div className="flex-1 h-screen overflow-y-auto no-scrollbar bg-slate-50/50 dark:bg-slate-950 p-6 md:p-8">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              My Learning Paths
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your published content and draft learning paths.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                    placeholder="Search paths..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-white dark:bg-slate-900 border-slate-200"
                />
            </div>

            {/* Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px] bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-slate-500" />
                    <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Paths</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </div>

        {/* Courses Grid */}
        <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            <AnimatePresence>
                {filteredPaths.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="col-span-full text-center py-20 bg-slate-50 rounded-2xl border border-dashed"
                    >
                        <BookOpen className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                        <p className="text-muted-foreground">No learning paths found.</p>
                    </motion.div>
                ) : (
                    filteredPaths.map((course) => (
                        <motion.div key={course._id} variants={itemVariants} layout>
                            <Card className="group overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900 flex flex-col h-full">
                                {/* Image Cover */}
                                <div className="aspect-video relative overflow-hidden bg-slate-100">
                                    <img
                                        src={course.image || "/placeholder.svg"}
                                        alt={course.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <Badge variant={course.isPrivate ? "secondary" : "default"} className="shadow-sm backdrop-blur-md bg-opacity-90">
                                            {course.isPrivate ? "Private" : "Public"}
                                        </Badge>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <div className="flex gap-2 w-full">
                                            <Button size="sm" variant="secondary" className="flex-1 bg-white/90 hover:bg-white text-slate-900" onClick={() => handleViewcourse(course._id)}>
                                                <Eye className="h-3.5 w-3.5 mr-2" /> Preview
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-slate-500 border-slate-200">
                                            {course.category || "General"}
                                        </Badge>
                                        <div className="flex items-center text-xs text-amber-500 font-medium">
                                            <Star className="h-3 w-3 fill-current mr-1" />
                                            {course.rating || "0.0"}
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                                        {course.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2 text-xs mt-1">
                                        {course.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pb-3 flex-grow">
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            {course.duration || "0h"}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <BookOpen className="h-3.5 w-3.5" />
                                            {course.content?.length || 0} Modules
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <BarChart3 className="h-3.5 w-3.5" />
                                            {course.learners?.length || 0} Enrolled
                                        </div>
                                        <div className="flex items-center gap-1.5 font-semibold text-green-600 dark:text-green-400">
                                            ${course.revenue || 0} Earned
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-0 flex gap-2">
                                    <Button variant="outline" className="flex-1 border-slate-200 hover:bg-slate-50 hover:text-blue-600" onClick={() => alert("Analytics coming soon!")}>
                                        <BarChart3 className="h-4 w-4 mr-2" /> Analytics
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => deleteCourse(course)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* --- View Course Dialog --- */}
      <Dialog open={isViewcourseOpen} onOpenChange={setIsViewcourseOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden flex flex-col h-[85vh]">
            {/* Dialog Banner */}
            <div className="relative h-48 bg-slate-900 shrink-0">
                {viewingcourse?.image && (
                    <img 
                        src={viewingcourse.image} 
                        alt="Course Cover" 
                        className="w-full h-full object-cover opacity-60"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent flex flex-col justify-end p-6">
                    <div className="flex gap-2 mb-2">
                        <Badge className="bg-blue-600 hover:bg-blue-700 border-0">{viewingcourse?.category}</Badge>
                        <Badge variant="outline" className="text-white border-white/20 bg-white/10 backdrop-blur-sm">{viewingcourse?.level}</Badge>
                    </div>
                    <h2 className="text-3xl font-bold text-white shadow-sm">{viewingcourse?.title}</h2>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content: Curriculum */}
                <ScrollArea className="flex-1 p-6 bg-slate-50 dark:bg-slate-950">
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border shadow-sm">
                            <h3 className="font-semibold text-sm text-slate-500 mb-2 uppercase tracking-wide">About this path</h3>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {viewingcourse?.description || "No description provided."}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-blue-600" /> Curriculum
                            </h3>
                            <div className="space-y-3">
                                {sections.length === 0 ? (
                                    <p className="text-slate-500 text-sm italic">No modules added yet.</p>
                                ) : (
                                    sections.map((section, idx) => (
                                        <div key={idx} className="bg-white dark:bg-slate-900 border rounded-lg p-4 shadow-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {idx + 1}. {section.title}
                                                </h4>
                                                <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                    {section.duration || "--:--"}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 mb-3 line-clamp-2">{section.description}</p>
                                            
                                            {/* Resources Pill List */}
                                            <div className="flex flex-wrap gap-2">
                                                {section.resources?.map((res, rIdx) => (
                                                    <Badge key={rIdx} variant="secondary" className="font-normal text-xs px-2 py-0.5 h-6">
                                                        {res.fileType ? res.fileType.toUpperCase().slice(0,3) : "FILE"}
                                                    </Badge>
                                                ))}
                                                {section.urls?.length > 0 && (
                                                    <Badge variant="secondary" className="font-normal text-xs px-2 py-0.5 h-6">
                                                        {section.urls.length} Links
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                {/* Sidebar: Details */}
                <div className="w-80 border-l bg-white dark:bg-slate-900 p-6 shrink-0 flex flex-col gap-6 overflow-y-auto">
                    <div>
                        <h3 className="font-semibold text-sm text-slate-500 mb-3 uppercase tracking-wide">Instructor</h3>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border">
                                <AvatarFallback>{createdBy.fullName?.[0] || "T"}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-sm">{createdBy.fullName || "Teacher"}</p>
                                <p className="text-xs text-slate-500">{createdBy.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-sm text-slate-500">Price</span>
                            <span className="font-bold text-lg">${viewingcourse?.price || 0}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-sm text-slate-500">Total Duration</span>
                            <span className="font-medium text-sm">{viewingcourse?.duration || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-sm text-slate-500">Total Revenue</span>
                            <span className="font-medium text-sm text-green-600">${viewingcourse?.revenue || 0}</span>
                        </div>
                    </div>

                    <div className="mt-auto space-y-3">
                        <Button className="w-full bg-slate-900 text-white hover:bg-slate-800" onClick={copyLink}>
                            <Copy className="h-4 w-4 mr-2" /> Share Link
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => setIsViewcourseOpen(false)}>
                            Close Preview
                        </Button>
                    </div>
                </div>
            </div>
        </DialogContent>
      </Dialog>

      {/* --- Delete Confirmation Dialog --- */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md w-[90%] rounded-2xl shadow-2xl border-0 p-0 overflow-hidden">
            <div className="bg-red-50 p-6 flex flex-col items-center justify-center text-center border-b border-red-100">
                <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="h-6 w-6" />
                </div>
                <DialogTitle className="text-xl font-bold text-red-900">Delete Learning Path?</DialogTitle>
                <DialogDescription className="text-red-700 mt-1">
                    This action cannot be undone.
                </DialogDescription>
            </div>
            
            <div className="p-6">
                <p className="text-sm text-slate-600 text-center mb-6">
                    You are about to permanently delete <strong>"{courseToDelete?.title}"</strong>. All student progress and data associated with this path will be lost.
                </p>
                <DialogFooter className="flex gap-3 sm:justify-center">
                    <Button variant="outline" className="flex-1" onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" className="flex-1 bg-red-600 hover:bg-red-700" onClick={confirmDeleteCourse}>
                        Yes, Delete It
                    </Button>
                </DialogFooter>
            </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}