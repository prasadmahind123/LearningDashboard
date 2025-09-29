import React,{useState} from 'react'
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

const studentsData = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    avatar: "AJ",
    joinDate: "2024-01-15",
    totalcourses: 3,
    completedcourses: 1,
    totalLearningTime: "45h 30m",
    lastActive: "2 hours ago",
    courses: [
      {
        courseId: 1,
        courseName: "Complete Web Development Bootcamp",
        progress: 85,
        timeSpent: "32h 15m",
        lastAccessed: "2 hours ago",
        engagement: 92,
        completedLessons: 102,
        totalLessons: 120,
        averageScore: 88,
      },
      {
        courseId: 2,
        courseName: "Advanced JavaScript Concepts",
        progress: 45,
        timeSpent: "13h 15m",
        lastAccessed: "1 day ago",
        engagement: 78,
        completedLessons: 38,
        totalLessons: 85,
        averageScore: 82,
      },
    ],
    engagement: {
      weeklyActivity: [85, 92, 78, 88, 95, 82, 90],
      averageSessionTime: "2h 15m",
      completionRate: 87,
      forumPosts: 12,
      questionsAsked: 8,
    },
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@email.com",
    avatar: "BS",
    joinDate: "2024-01-10",
    totalcourses: 2,
    completedcourses: 2,
    totalLearningTime: "38h 45m",
    lastActive: "5 hours ago",
    courses: [
      {
        courseId: 1,
        courseName: "Complete Web Development Bootcamp",
        progress: 100,
        timeSpent: "40h 00m",
        lastAccessed: "3 days ago",
        engagement: 95,
        completedLessons: 120,
        totalLessons: 120,
        averageScore: 94,
      },
    ],
    engagement: {
      weeklyActivity: [88, 85, 92, 90, 87, 89, 91],
      averageSessionTime: "3h 00m",
      completionRate: 100,
      forumPosts: 18,
      questionsAsked: 5,
    },
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol.davis@email.com",
    avatar: "CD",
    joinDate: "2024-01-20",
    totalcourses: 1,
    completedcourses: 0,
    totalLearningTime: "12h 30m",
    lastActive: "1 day ago",
    courses: [
      {
        courseId: 2,
        courseName: "Advanced JavaScript Concepts",
        progress: 25,
        timeSpent: "12h 30m",
        lastAccessed: "1 day ago",
        engagement: 65,
        completedLessons: 21,
        totalLessons: 85,
        averageScore: 76,
      },
    ],
    engagement: {
      weeklyActivity: [45, 52, 48, 65, 58, 62, 55],
      averageSessionTime: "1h 45m",
      completionRate: 25,
      forumPosts: 3,
      questionsAsked: 15,
    },
  },
]

export default function TStudents() {
    const {teacher} = useAppContext();
    const students = teacher?.learningPaths || [];
    const [searchQuery, setSearchQuery] = useState("")
    const [filterBy, setFilterBy] = useState("all")
    const [selectedStudent, setSelectedStudent] = useState(null)

      const filteredStudents = students.filter((student) => {
      const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterBy === "all") return matchesSearch
    if (filterBy === "active") return matchesSearch && student.lastActive.includes("hour")
    if (filterBy === "completed") return matchesSearch && student.completedcourses > 0
    if (filterBy === "struggling") return matchesSearch && student.engagement.completionRate < 50

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
                          <TableHead>Engagement</TableHead>
                          <TableHead>Last Active</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarFallback>{student.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{student.name}</p>
                                  <p className="text-sm text-muted-foreground">{student.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p className="font-medium">{student.totalcourses} enrolled</p>
                                <p className="text-muted-foreground">{student.completedcourses} completed</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{student.totalLearningTime}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress value={student.engagement.completionRate} className="w-16 h-2" />
                                <span className="text-sm font-medium">{student.engagement.completionRate}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">{student.lastActive}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" onClick={() => setSelectedStudent(student)}>
                                      <Eye className="h-3 w-3 mr-1" />
                                      View
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Student Profile: {student.name}</DialogTitle>
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
                                                  <p className="text-2xl font-bold">{selectedStudent.totalcourses}</p>
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
                                                    {selectedStudent.totalLearningTime}
                                                  </p>
                                                  <p className="text-xs text-muted-foreground">Learning Time</p>
                                                </div>
                                              </div>
                                            </CardContent>
                                          </Card>
                                          <Card>
                                            <CardContent className="p-4">
                                              <div className="flex items-center space-x-2">
                                                <Award className="h-4 w-4 text-yellow-500" />
                                                <div>
                                                  <p className="text-2xl font-bold">
                                                    {selectedStudent.completedcourses}
                                                  </p>
                                                  <p className="text-xs text-muted-foreground">Completed</p>
                                                </div>
                                              </div>
                                            </CardContent>
                                          </Card>
                                          <Card>
                                            <CardContent className="p-4">
                                              <div className="flex items-center space-x-2">
                                                <MessageSquare className="h-4 w-4 text-purple-500" />
                                                <div>
                                                  <p className="text-2xl font-bold">
                                                    {selectedStudent.engagement.forumPosts}
                                                  </p>
                                                  <p className="text-xs text-muted-foreground">Forum Posts</p>
                                                </div>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        </div>

                                        {/* course Progress */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle>learning path Progress</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="space-y-4">
                                              {selectedStudent.courses.map((course, index) => (
                                                <div key={index} className="p-4 border rounded-lg">
                                                  <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                      <h4 className="font-semibold">{course.courseName}</h4>
                                                      <p className="text-sm text-muted-foreground">
                                                        {course.completedLessons}/{course.totalLessons} lessons
                                                        completed
                                                      </p>
                                                    </div>
                                                    <Badge
                                                      variant={
                                                        course.progress > 80
                                                          ? "default"
                                                          : course.progress > 50
                                                            ? "secondary"
                                                            : "outline"
                                                      }
                                                    >
                                                      {course.progress}% Complete
                                                    </Badge>
                                                  </div>

                                                  <Progress value={course.progress} className="mb-3" />

                                                  <div className="grid grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                      <p className="text-muted-foreground">Time Spent</p>
                                                      <p className="font-medium">{course.timeSpent}</p>
                                                    </div>
                                                    <div>
                                                      <p className="text-muted-foreground">Engagement</p>
                                                      <p className="font-medium">{course.engagement}%</p>
                                                    </div>
                                                    <div>
                                                      <p className="text-muted-foreground">Avg. Score</p>
                                                      <p className="font-medium">{course.averageScore}%</p>
                                                    </div>
                                                    <div>
                                                      <p className="text-muted-foreground">Last Access</p>
                                                      <p className="font-medium">{course.lastAccessed}</p>
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </CardContent>
                                        </Card>

                                        {/* Weekly Activity Chart */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle>Weekly Activity</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="flex items-end space-x-2 h-32">
                                              {selectedStudent.engagement.weeklyActivity.map((activity, index) => (
                                                <div key={index} className="flex flex-col items-center flex-1">
                                                  <div
                                                    className="bg-primary rounded-t w-full"
                                                    style={{ height: `${activity}%` }}
                                                  ></div>
                                                  <span className="text-xs mt-1">
                                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                                                  </span>
                                                </div>
                                              ))}
                                            </div>
                                          </CardContent>
                                        </Card>
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
