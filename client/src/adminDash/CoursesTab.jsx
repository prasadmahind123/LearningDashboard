"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, Trash2, Star, Download, RefreshCw, BookOpen, DollarSign, Users, Clock, Calendar } from "lucide-react"
import { useAppContext } from "../context/AppContext"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10, transition: { duration: 0.2 } }
};

export default function CoursesTab({ searchQuery }) {
  const { paths = [], axios } = useAppContext();
  const [localPaths, setLocalPaths] = useState(paths);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Sync local state with context paths
  useEffect(() => {
    setLocalPaths(paths);
  }, [paths]);

  const handleDeletePath = async (courseId) => {
    try {
      await axios.delete(`/api/admin/paths/${courseId}`, {
        withCredentials: true,
      });
      
      // Optimistically remove from UI
      setLocalPaths(prev => prev.filter(p => p._id !== courseId));
      toast.success("Path deleted successfully");
    } catch (error) {
      console.error("Error deleting path:", error);
      toast.error("Failed to delete path");
    }
  }

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setIsViewOpen(true);
  };

  // Filter logic
  const filteredCourses = localPaths.filter((course) =>
    course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.createdBy?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <Card className="border-none shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Learning Paths
                </CardTitle>
                <CardDescription className="mt-1">
                    Monitor performance and manage content for {localPaths.length} active courses.
                </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 bg-white dark:bg-slate-950">
                <Download className="h-4 w-4 mr-2 text-slate-500" />
                Export
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <RefreshCw className="h-4 w-4 text-slate-500" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-950">
              <TableRow>
                <TableHead className="pl-6">Course Details</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Financials</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredCourses.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                            No courses found matching your search.
                        </TableCell>
                    </TableRow>
                ) : (
                    filteredCourses.map((course) => (
                        <motion.tr 
                            key={course._id}
                            variants={rowVariants}
                            exit="exit"
                            className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
                        >
                            <TableCell className="pl-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-16 rounded-md bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                                        <img 
                                            src={course.image || "/placeholder.svg"} 
                                            alt={course.title} 
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate max-w-[200px]" title={course.title}>
                                            {course.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-normal">
                                                {course.category || "General"}
                                            </Badge>
                                            <span className="text-xs text-slate-400 px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                                                {course.level || "All Levels"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-[10px] bg-blue-100 text-blue-600">
                                            {course.createdBy?.fullName?.[0] || "I"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        {course.createdBy?.fullName || "Unknown"}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                                        <Users className="h-3.5 w-3.5 text-blue-500" />
                                        {course.learners?.length || 0} Students
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                                        <Star className="h-3.5 w-3.5 text-amber-500 fill-current" />
                                        {course.rating || "0.0"} Rating
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="space-y-1">
                                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                                        ${course.price || "Free"}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                        <DollarSign className="h-3 w-3" />
                                        {course.revenue?.toLocaleString() || 0} Rev
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell className="text-right pr-6">
                                <div className="flex justify-end items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-slate-400 hover:text-blue-600"
                                        onClick={() => handleViewCourse(course)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="text-red-600">Delete Learning Path</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete <strong>{course.title}</strong>? This will remove the course and all associated materials permanently.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeletePath(course._id)} className="bg-red-600 hover:bg-red-700">
                                                    Delete Path
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </TableCell>
                        </motion.tr>
                    ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Course Details Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="w-4xl overflow-hidden p-2">
            {selectedCourse && (
                <>
                    <div className="relative h-40 w-full bg-slate-100 dark:bg-slate-800">
                        <img 
                            src={selectedCourse.image || "/placeholder.svg"} 
                            alt={selectedCourse.title}
                            className="h-full w-full object-cover opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                            <h2 className="text-2xl font-bold text-white shadow-sm">{selectedCourse.title}</h2>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Students</p>
                                <p className="text-lg font-bold text-blue-600">{selectedCourse.learners?.length || 0}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Revenue</p>
                                <p className="text-lg font-bold text-green-600">${selectedCourse.revenue || 0}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Price</p>
                                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">${selectedCourse.price || 0}</p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-slate-500">Category</h4>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm font-medium">{selectedCourse.category}</span>
                                </div>
                            </div>
                             <div className="space-y-1">
                                <h4 className="text-sm font-medium text-slate-500">Instructor</h4>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback>{selectedCourse.createdBy?.fullName?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">{selectedCourse.createdBy?.fullName}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-slate-500">Created Date</h4>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm font-medium">{selectedCourse.createdAt?.split('T')[0]}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-slate-500">Duration</h4>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm font-medium">{selectedCourse.duration || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-slate-500">Description</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                {selectedCourse.description || "No description available."}
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="p-4 border-t bg-slate-50 dark:bg-slate-900">
                        <Button onClick={() => setIsViewOpen(false)} className="w-full">Close Details</Button>
                    </DialogFooter>
                </>
            )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}