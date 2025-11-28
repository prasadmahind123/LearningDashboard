import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Clock, Eye, MessageSquare, Download, Search, Filter, UserCheck, AlertCircle, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAppContext } from "../context/AppContext.jsx"
import { motion, AnimatePresence } from "framer-motion"

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

export default function TStudents() {
  const { teacher, learners, paths } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [enrolledLearners, setEnrolledLearner] = useState(teacher.enrolledStudents || []);

  useEffect(() => {
    if (!teacher || !paths?.length || !learners?.length) return;

    //  Get all path IDs created by the current teacher
    const teacherPathIds = teacher.createdPaths || [];

    //  Find learners who are enrolled in those teacher-created paths only
    const filteredLearners = learners.filter((learner) =>
      learner.enrolledPaths?.some((enrolled) =>
        teacherPathIds.includes(
          typeof enrolled === "object" ? enrolled.pathId : enrolled
        )
      )
    );
    //  Update the state
    setEnrolledLearner(filteredLearners);
  }, [teacher, learners, paths]);

  const manageView = (student) => {
    setSelectedStudent(student);
  }

  const filteredStudents = enrolledLearners.filter((student) => {
    const matchesSearch =
      student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.email?.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterBy === "all") return matchesSearch
    if (filterBy === "active") return matchesSearch && student.lastActive?.includes("hour")
    if (filterBy === "completed") return matchesSearch && student.completedcourses > 0
    if (filterBy === "struggling") return matchesSearch && student.engagement?.completionRate < 50

    return matchesSearch
  })

  return (
    <div className="flex-1 h-screen overflow-y-auto no-scrollbar bg-slate-50/50 dark:bg-slate-950 p-6 md:p-8">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Student Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor student progress, engagement, and performance across your courses.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              />
            </div>

            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-[160px] bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-slate-500" />
                    <SelectValue placeholder="Filter" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="active">Recently Active</SelectItem>
                <SelectItem value="completed">Completed Paths</SelectItem>
                <SelectItem value="struggling">Needs Attention</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="bg-white dark:bg-slate-900">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </motion.div>
        </div>

        {/* Students Table Card */}
        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="px-6 py-4 border-b bg-slate-50/50 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <UserCheck className="h-5 w-5 text-blue-600" /> 
                        Enrolled Students 
                        <Badge variant="secondary" className="ml-2">{filteredStudents.length}</Badge>
                    </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-50">
                    <TableHead className="pl-6 w-[300px]">Student</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Learning Time</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredStudents.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                No students found matching your criteria.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredStudents.map((student) => (
                            <motion.tr
                            key={student._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                            <TableCell className="pl-6 py-4">
                                <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10 border border-slate-200">
                                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-medium">
                                        {student.fullName?.charAt(0).toUpperCase() || "S"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">{student.fullName}</p>
                                    <p className="text-xs text-muted-foreground">{student.email}</p>
                                </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        {student.enrolledPaths?.length} Paths
                                    </Badge>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                                <Clock className="h-4 w-4 text-slate-400" />
                                {student.totalLearningHours || 0}h
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">
                                    {student.lastAccessedWebsite ? new Date(student.lastAccessedWebsite).toLocaleDateString() : 'Never'}
                                </span>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                                <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline" className="h-8 hover:text-blue-600 hover:border-blue-200" onClick={() => manageView(student)}>
                                    <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Message
                                </Button>
                                <Dialog>
                                    <DialogTrigger asChild>
                                    <Button size="sm" className="h-8 bg-slate-900 text-white hover:bg-slate-800" onClick={() => manageView(student)}>
                                        <Eye className="h-3.5 w-3.5 mr-1.5" /> Profile
                                    </Button>
                                    </DialogTrigger>
                                    
                                    {/* Student Profile Dialog */}
                                    <DialogContent className="max-w-3xl overflow-hidden p-0">
                                        {selectedStudent && (
                                            <div className="flex flex-col h-[80vh] md:h-auto">
                                                {/* Dialog Header Banner */}
                                                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex flex-col justify-end">
                                                    <div className="flex items-end gap-4 ">
                                                        <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                                            <AvatarFallback className="text-2xl bg-white text-blue-600">
                                                                {selectedStudent.fullName?.[0]?.toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="mb-2 text-white">
                                                            <h2 className="text-2xl font-bold">{selectedStudent.fullName}</h2>
                                                            <p className="text-blue-100 text-sm">{selectedStudent.email}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-12 px-6 pb-6 overflow-y-auto">
                                                    {/* Stats Grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                                                            <div className="p-3 bg-blue-100 rounded-full text-blue-600"><BookOpen className="h-5 w-5" /></div>
                                                            <div>
                                                                <p className="text-2xl font-bold">{selectedStudent.enrolledPaths.length}</p>
                                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Enrolled</p>
                                                            </div>
                                                        </div>
                                                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                                                            <div className="p-3 bg-green-100 rounded-full text-green-600"><Clock className="h-5 w-5" /></div>
                                                            <div>
                                                                <p className="text-2xl font-bold">{selectedStudent.totalLearningHours || 0}h</p>
                                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Learned</p>
                                                            </div>
                                                        </div>
                                                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                                                            <div className="p-3 bg-purple-100 rounded-full text-purple-600"><AlertCircle className="h-5 w-5" /></div>
                                                            <div>
                                                                <p className="text-2xl font-bold">{selectedStudent.goals?.length || 0}</p>
                                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Goals Set</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                                        <BookOpen className="h-5 w-5 text-slate-500" /> Course Progress
                                                    </h3>
                                                    
                                                    <div className="space-y-3">
                                                        {selectedStudent.enrolledPaths.map((pathObj, index) => {
                                                            const pathId = typeof pathObj === "object" ? pathObj.pathId : pathObj;
                                                            const course = paths.find(p => p._id === pathId && teacher?.createdPaths?.includes(p._id));
                                                            if (!course) return null;

                                                            return (
                                                                <div key={index} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500">
                                                                            {index + 1}
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-semibold">{course.title}</h4>
                                                                            <p className="text-xs text-muted-foreground">{course.level} • {course.category}</p>
                                                                        </div>
                                                                    </div>
                                                                    <Badge variant="secondary">In Progress</Badge>
                                                                </div>
                                                            );
                                                        })}
                                                        {selectedStudent.enrolledPaths.length === 0 && <p className="text-muted-foreground text-sm">No active enrollments found.</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </DialogContent>
                                </Dialog>
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
        </motion.div>
      </motion.div>
    </div>
  )
}