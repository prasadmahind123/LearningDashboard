import React,{useEffect, useState} from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent,  CardDescription } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Clock, Eye, MessageSquare, Download } from "lucide-react"
import { Award } from "lucide-react"
import { BookOpen , Badge } from "lucide-react"
import { useAppContext } from "../context/AppContext.jsx";

export default function TStudents() {
    const { teacher , learners , paths } = useAppContext();
    const [searchQuery, setSearchQuery] = useState("")
    const [filterBy, setFilterBy] = useState("all")
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [enrolledLearners , setEnrolledLearner] = useState(teacher.enrolledStudents || []);


      useEffect(() => {
        if (!teacher || !paths?.length || !learners?.length) return;

        // ✅ Get all path IDs created by the current teacher
        const teacherPathIds = teacher.createdPaths || [];

        // ✅ Find learners who are enrolled in those teacher-created paths only
        const filteredLearners = learners.filter((learner) =>
          learner.enrolledPaths?.some((enrolled) =>
            teacherPathIds.includes(
              typeof enrolled === "object" ? enrolled.pathId : enrolled
            )
          )
        );

        // ✅ Update the state
        setEnrolledLearner(filteredLearners);
      }, [teacher, learners, paths]);


    
    

    
    const manageView = (student) =>{
      setSelectedStudent(student);

    }

    
    




      const filteredStudents = enrolledLearners.filter((student) => {
      const matchesSearch =
      student?.name?.includes(searchQuery) ||
      student?.email?.includes(searchQuery)

    if (filterBy === "all") return matchesSearch
    if (filterBy === "active") return matchesSearch && student.lastActive?.includes("hour")
    if (filterBy === "completed") return matchesSearch && student.completedcourses > 0
    if (filterBy === "struggling") return matchesSearch && student.engagement?.completionRate < 50

    return matchesSearch
  })
 
  
  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll 
        flex flex-col justify-between">
         <div value="students">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Student Management</h2>
                    <p className="text-muted-foreground">Monitor student progress and engagement</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select value={filterBy} onValueChange={setFilterBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter students..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Students</SelectItem>
                        <SelectItem value="active">Recently Active</SelectItem>
                        <SelectItem value="completed">Completed courses</SelectItem>
                        <SelectItem value="struggling">Need Help</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Student Details</CardTitle>
                    <CardDescription>Comprehensive view of student progress and engagement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>learning path</TableHead>
                          <TableHead>Learning Time</TableHead>
                          <TableHead>Last Active</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student) => (
                          <TableRow key={student._id}>
                            {
                              
                            }
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarFallback>{ student.fullName?.charAt(0).toUpperCase() || "L"}</AvatarFallback>
                                  
                                </Avatar>
                                <div>
                                  <p className="font-medium">{student.fullName}</p>
                                  <p className="text-sm text-muted-foreground">{student.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p className="font-medium">{student.enrolledPaths?.length} enrolled</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{student.totalLearningHours}h</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">{student.lastActive || 'N/A'}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" onClick={() => manageView(student)}>
                                      <Eye className="h-3 w-3 mr-1" />
                                      View
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Student Profile: {student.fullName}</DialogTitle>
                                      <DialogDescription>Detailed analytics and progress tracking</DialogDescription>
                                    </DialogHeader>

                                    {selectedStudent && (
                                      <div className="space-y-6">
                                        {/* Student Overview */}
                                        <div className="grid grid-cols-4 gap-4">
                                          <Card>
                                            <CardContent className="p-4">
                                              <div className="flex items-center space-x-2">
                                                <BookOpen className="h-4 w-4 text-blue-500" />
                                                <div>
                                                  <p className="text-2xl font-bold">{selectedStudent.enrolledPaths.length}</p>
                                                  <p className="text-xs text-muted-foreground">Total learning path</p>
                                                </div>
                                              </div>
                                            </CardContent>
                                          </Card>
                                          <Card>
                                            <CardContent className="p-4">
                                              <div className="flex items-center space-x-2">
                                                <Clock className="h-4 w-4 text-green-500" />
                                                <div>
                                                  <p className="text-2xl font-bold">
                                                    {selectedStudent.totalLearningHours}h
                                                  </p>
                                                  <p className="text-xs text-muted-foreground">Learning Time</p>
                                                </div>
                                              </div>
                                            </CardContent>
                                          </Card>
                                          <Card>
                                              <CardContent>
                                                  <div className="space-y-4 w-full">
                                                     {selectedStudent.enrolledPaths
                                                        .map((pathObj, index) => {
                                                          // Handle both object { pathId } or direct string ID cases
                                                          const pathId = typeof pathObj === "object" ? pathObj.pathId : pathObj;

                                                          const course = paths.find(
                                                            (p) =>
                                                              p._id === pathId &&
                                                              teacher?.createdPaths?.includes(p._id) // ✅ show only teacher's created paths
                                                          );

                                                          if (!course) return null; // skip if not this teacher’s course

                                                          return (
                                                            <div key={index}>
                                                              <h4 className="font-semibold">
                                                                {index + 1}. {course.title}
                                                              </h4>
                                                            </div>
                                                          );
                                                        })
                                                      }

                                                      <p className="text-xs text-muted-foreground">Paths Enrolled</p>
                                                  </div>
                                              </CardContent>
                                          </Card>
                                        </div>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <Button size="sm" variant="outline">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Message
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
    </div>
  )
}