
import { useEffect, useState  } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Clock,
  Trophy,
  TrendingUp,
  Play,
  Calendar,
  Send,
  Bot,
  X,
  Eye,
  Star,
  CheckCircle,
  AlertCircle,
  Target,
  Award,
  BarChart3,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppContext } from "../context/AppContext.jsx"
import { Link } from "react-router-dom"


const recentActivity = [
  { action: "Completed lesson", course: "Web Development", time: "2 hours ago", type: "lesson" },
  { action: "Started new course", course: "Data Science", time: "1 day ago", type: "enrollment" },
  { action: "Earned certificate", course: "Digital Marketing", time: "3 days ago", type: "certificate" },
  { action: "Joined discussion", course: "Web Development", time: "5 days ago", type: "discussion" },
  { action: "Submitted assignment", course: "Data Science", time: "1 week ago", type: "assignment" },
  { action: "Passed quiz", course: "Web Development", time: "1 week ago", type: "quiz" },
]
  
export default function Dashboard() {
  const { learner , paths } = useAppContext();
  const [isChatOpen, setIsChatOpen] = useState(false)
  const enrolledcourses = learner?.enrolledPaths || [];
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "bot",
      message:
        "Hi! I'm EduBot, your learning assistant. I can help you with questions about courses, platform features, and your learning journey. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedcourse, setSelectedcourse] = useState(null)
  const [learnerPaths, setLearnerPaths] = useState(learner?.enrolledPaths || []); // paths enrolled by logged-in learner

  useEffect(() => {
    if (!learner?.enrolledPaths?.length || !paths?.length) return;

    // Map enrolledPaths to their actual path objects and include enrollment info
    const mapped = learner.enrolledPaths
      .map((enroll) => {
        const pathObj = paths.find((p) => p._id === enroll.pathId);
        if (!pathObj) return null;
        return {
          ...pathObj,
          enrollment: enroll, // attach enrollment info
        };
      })
      .filter(Boolean);

    setLearnerPaths(mapped);
  }, [paths, learner]);


  


  const handleChatSubmit = async (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage = {
      id: Date.now(),
      type: "user",
      message: chatInput,
      timestamp: new Date().toLocaleTimeString(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsTyping(true)

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const botResponse = generateBotResponse(chatInput)
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        message: botResponse,
        timestamp: new Date().toLocaleTimeString(),
      }
      setChatMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = (input) => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("course") && lowerInput.includes("progress")) {
      return "You can track your course progress in the 'My courses' section. Each course shows your completion percentage, time spent, and next lessons. Would you like me to explain any specific progress metrics?"
    }

    if (lowerInput.includes("certificate")) {
      return "You'll receive a certificate of completion once you finish all lessons in a course with a passing grade. Certificates can be downloaded from your dashboard and are recognized by many employers."
    }

    if (lowerInput.includes("assignment") || lowerInput.includes("homework")) {
      return "Assignments are available within each course module. You can submit them through the course interface, and you'll receive feedback from your instructor. Check the 'Assignments' tab in your enrolled courses."
    }

    if (lowerInput.includes("schedule") || lowerInput.includes("time")) {
      return "You can create a study schedule using our 'Schedule Study Time' feature. I recommend setting aside consistent daily time for learning. Would you like tips on effective study scheduling?"
    }

    if (lowerInput.includes("help") || lowerInput.includes("support")) {
      return "I'm here to help! You can ask me about course navigation, progress tracking, certificates, assignments, study tips, or any other platform features. What specific area would you like assistance with?"
    }

    if (lowerInput.includes("instructor") || lowerInput.includes("teacher")) {
      return "You can contact your instructors through the messaging system in each course. They typically respond within 24 hours. You can also participate in course discussions and Q&A sessions."
    }

    if (lowerInput.includes("quiz") || lowerInput.includes("test")) {
      return "Quizzes are available throughout your courses to test your understanding. You can retake most quizzes, and your highest score counts toward your final grade. Practice quizzes don't affect your grade."
    }

    if (lowerInput.includes("download") || lowerInput.includes("offline")) {
      return "Some course materials can be downloaded for offline viewing, including PDFs and certain videos. Look for the download icon next to eligible content in your courses."
    }

    return "I understand you're asking about our learning platform. I can help with course navigation, progress tracking, certificates, study tips, and platform features. Could you be more specific about what you'd like to know?"
  }




  const hoursLearned = learner?.learningHours || 0;
  const certificatesEarned = learner?.certificates?.length || 0;
  const averageProgress = enrolledcourses && enrolledcourses.length > 0
    ? Math.round(enrolledcourses.reduce((total, course) => total + (course.progress || 0), 0) / enrolledcourses.length)
    : 0;
  const eligibleCertificates = enrolledcourses ? enrolledcourses.filter((c) => c.progress >= 90).length : 0;

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <main className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {learner?.name || "Learner"}</h1>
          <p className="text-muted-foreground">{learner?.email && (<span>{learner.email} • </span>)}Continue your learning journey</p>
          {learner?.createdAt && (
            <p className="text-xs text-muted-foreground">Joined: {learner.createdAt.split("T")[0]}</p>
          )}
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total learning paths</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{learner?.enrolledPaths?.length || 0}</div>
              <p className="text-xs text-muted-foreground">{learner?.enrolledPaths?.length || 0} completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hoursLearned}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{certificatesEarned}</div>
              <p className="text-xs text-muted-foreground">{eligibleCertificates} eligible</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageProgress}%</div>
              <p className="text-xs text-muted-foreground">+5% from last week</p>
            </CardContent>
          </Card>
        </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enhanced Enrolled courses */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>My learning paths</CardTitle>
                  <CardDescription>Continue where you left off</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {learnerPaths.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        className="w-20 h-14 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold truncate">{course.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {course.level}
                          </Badge>
                          {course.certificateEligible && (
                            <Badge className="text-xs bg-green-500">
                              <Award className="h-3 w-3 mr-1" />
                              Certificate Ready
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 mb-2">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>
                                {course.content?.length} lessons
                              </span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex space-x-2">
                          <Link to={`/courses/learning-path/${course._id}`}>
                            <Button size="sm"  className = "bg-blue-500 hover:bg-blue-400 cursor-pointer" onClick={() => setSelectedcourse(course)}>
                              <Eye className="h-3 w-3 mr-1 cursor-pointer" />
                              Details
                            </Button>
                          </Link>
                          
                          <Button size="sm" variant="outline" className = "cursor-pointer">
                            <Play className="h-3 w-3 mr-1 cursor-pointer" />
                            Continue
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              {/* Study Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Weekly Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {enrolledcourses.slice(0, 2).map((course) => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="truncate">{course.title}</span>
                        <span>
                          {/* {course.studyPlan.currentWeekHours}h / {course.studyPlan.weeklyGoal}h */}
                        </span>
                      </div>
                      {/* <Progress
                        value={(course.studyPlan.currentWeekHours / course.studyPlan.weeklyGoal) * 100}
                        className="h-2"
                      /> */}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            activity.type === "certificate"
                              ? "bg-green-500"
                              : activity.type === "assignment"
                                ? "bg-blue-500"
                                : activity.type === "quiz"
                                  ? "bg-purple-500"
                                  : "bg-primary"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.course}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer" asChild>
                    <p>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Browse New learning paths
                    </p>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Study Time
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer">
                    <Trophy className="mr-2 h-4 w-4" />
                    View Certificates
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent cursor-pointer">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Progress Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Detailed course View Dialog */}
          {selectedcourse && (
            <Dialog open={!!selectedcourse} onOpenChange={() => setSelectedcourse(null)}>
              <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto ">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-3">
                    <img
                      src={selectedcourse.image || "/placeholder.svg"}
                      alt={selectedcourse.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-xl font-bold">{selectedcourse.title}</h3>
                      <p className="text-sm text-muted-foreground">by {selectedcourse.instructor}</p>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger className="cursor-pointer" value="overview">Overview</TabsTrigger>
                    <TabsTrigger className="cursor-pointer" value="modules">Modules</TabsTrigger>
                    <TabsTrigger className="cursor-pointer" value="assignments">Assignments</TabsTrigger>
                    <TabsTrigger className="cursor-pointer" value="quizzes">Quizzes</TabsTrigger>
                    <TabsTrigger className="cursor-pointer" value="progress">Progress</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    {/* course Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{selectedcourse.progress}%</div>
                            <p className="text-sm text-muted-foreground">Progress</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold">{selectedcourse.timeSpent}</div>
                            <p className="text-sm text-muted-foreground">Time Spent</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold">{selectedcourse.overallGrade}</div>
                            <p className="text-sm text-muted-foreground">Overall Grade</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold">{selectedcourse.studyStreak}</div>
                            <p className="text-sm text-muted-foreground">Study Streak</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* course Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>learning paths Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Category:</span>
                            <Badge variant="outline">{selectedcourse.category}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Level:</span>
                            <span className="font-medium">{selectedcourse.level}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Enrolled:</span>
                            <span className="font-medium">{selectedcourse.enrolledDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Accessed:</span>
                            <span className="font-medium">{selectedcourse.lastAccessed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Rating:</span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{selectedcourse.courseRating}</span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Students:</span>
                            <span className="font-medium">{selectedcourse.totalStudents}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Study Plan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Weekly Goal:</span>
                            <span className="font-medium">{selectedcourse.studyPlan.weeklyGoal}h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">This Week:</span>
                            <span className="font-medium">{selectedcourse.studyPlan.currentWeekHours}h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Daily Recommended:</span>
                            <span className="font-medium">{selectedcourse.studyPlan.recommendedDailyTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Next Milestone:</span>
                            <span className="font-medium text-sm">{selectedcourse.studyPlan.nextMilestone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Est. Completion:</span>
                            <span className="font-medium">{selectedcourse.studyPlan.estimatedCompletion}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Skills & Description */}
                    <Card>
                      <CardHeader>
                        <CardTitle>What You'll Learn</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{selectedcourse.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedcourse.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="modules" className="space-y-4 w-screen">
                    <Card>
                      <CardHeader>
                        <CardTitle>learning paths Modules</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedcourse.modules.map((module, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    module.status === "completed"
                                      ? "bg-green-100 text-green-600"
                                      : module.status === "in-progress"
                                        ? "bg-blue-100 text-blue-600"
                                        : module.status === "locked"
                                          ? "bg-gray-100 text-gray-400"
                                          : "bg-yellow-100 text-yellow-600"
                                  }`}
                                >
                                  {module.status === "completed" ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : module.status === "locked" ? (
                                    <AlertCircle className="h-4 w-4" />
                                  ) : (
                                    <span className="text-sm font-bold">{index + 1}</span>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">{module.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {module.lessons} lessons • {module.duration}
                                  </p>
                                  {module.lastAccessed && (
                                    <p className="text-xs text-muted-foreground">
                                      Last accessed: {module.lastAccessed}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                {module.grade && (
                                  <Badge variant="outline" className="bg-green-50">
                                    {module.grade}
                                  </Badge>
                                )}
                                <div className="flex items-center space-x-2">
                                  <Progress value={(module.completed / module.lessons) * 100} className="w-20 h-2" />
                                  <span className="text-sm font-medium">
                                    {module.completed}/{module.lessons}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="assignments" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Assignments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedcourse.assignments.map((assignment, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <p className="font-medium">{assignment.name}</p>
                                  <p className="text-sm text-muted-foreground">Due: {assignment.dueDate}</p>
                                  {assignment.submittedDate && (
                                    <p className="text-sm text-muted-foreground">
                                      Submitted: {assignment.submittedDate}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  {assignment.grade && (
                                    <Badge variant="outline" className="bg-green-50">
                                      {assignment.grade}
                                    </Badge>
                                  )}
                                  <Badge
                                    variant={
                                      assignment.status === "completed"
                                        ? "default"
                                        : assignment.status === "in-progress"
                                          ? "secondary"
                                          : "outline"
                                    }
                                  >
                                    {assignment.status.replace("-", " ")}
                                  </Badge>
                                </div>
                              </div>
                              {assignment.feedback && (
                                <div className="mt-3 p-3 bg-muted/50 rounded-md">
                                  <p className="text-sm font-medium mb-1">Instructor Feedback:</p>
                                  <p className="text-sm text-muted-foreground">{assignment.feedback}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="quizzes" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Quizzes & Tests</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedcourse.quizzes.map((quiz, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <p className="font-medium">{quiz.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {quiz.attempts > 0 ? `${quiz.attempts} attempt(s)` : "Not attempted"}
                                </p>
                              </div>
                              <div className="flex items-center space-x-3">
                                {quiz.score > 0 && (
                                  <div className="text-right">
                                    <p className="font-medium">
                                      {quiz.score}/{quiz.maxScore}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {Math.round((quiz.score / quiz.maxScore) * 100)}%
                                    </p>
                                  </div>
                                )}
                                <Badge
                                  variant={
                                    quiz.status === "passed"
                                      ? "default"
                                      : quiz.status === "pending"
                                        ? "secondary"
                                        : "destructive"
                                  }
                                  className={quiz.status === "passed" ? "bg-green-500" : ""}
                                >
                                  {quiz.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="progress" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Learning Analytics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>course Completion</span>
                              <span>{selectedcourse.progress}%</span>
                            </div>
                            <Progress value={selectedcourse.progress} className="h-3" />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Weekly Goal Progress</span>
                              <span>
                                {selectedcourse.studyPlan.currentWeekHours}h / {selectedcourse.studyPlan.weeklyGoal}h
                              </span>
                            </div>
                            <Progress
                              value={
                                (selectedcourse.studyPlan.currentWeekHours / selectedcourse.studyPlan.weeklyGoal) * 100
                              }
                              className="h-3"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">{selectedcourse.completedLessons}</div>
                              <p className="text-sm text-muted-foreground">Lessons Completed</p>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {selectedcourse.assignments.filter((a) => a.status === "completed").length}
                              </div>
                              <p className="text-sm text-muted-foreground">Assignments Done</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Performance Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Overall Grade</span>
                            <Badge variant="outline" className="text-lg font-bold">
                              {selectedcourse.overallGrade}
                            </Badge>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm">Study Streak</span>
                            <div className="flex items-center space-x-1">
                              <span className="text-lg font-bold">{selectedcourse.studyStreak}</span>
                              <span className="text-sm text-muted-foreground">days</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm">Quiz Average</span>
                            <span className="text-lg font-bold">
                              {Math.round(
                                selectedcourse.quizzes
                                  .filter((q) => q.score > 0)
                                  .reduce((acc, q) => acc + (q.score / q.maxScore) * 100, 0) /
                                  selectedcourse.quizzes.filter((q) => q.score > 0).length,
                              )}
                              %
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm">Time Investment</span>
                            <span className="text-lg font-bold">{selectedcourse.timeSpent}</span>
                          </div>

                          {selectedcourse.certificateEligible && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Award className="h-5 w-5 text-green-600" />
                                <span className="text-sm font-medium text-green-800">Certificate Ready!</span>
                              </div>
                              <p className="text-sm text-green-600 mt-1">
                                You're eligible to receive your completion certificate.
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          )}

          {/* AI Chatbot */}
          <div className="fixed bottom-4 right-4 z-50">
            {!isChatOpen && (
              <Button
                onClick={() => setIsChatOpen(true)}
                className="bg-blue-500 hover:bg-blue-400 cursor-pointer rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Bot className="h-6 w-6" />
              </Button>
            )}

            {isChatOpen && (
              <Card className="w-80 h-96 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2  text-primary-foreground rounded-t-lg bg-blue-500 hover:bg-blue-400">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5" />
                    <CardTitle className="text-sm ">EduBot - Learning Assistant</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsChatOpen(false)}
                    className="text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0 flex flex-col h-80">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 ">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg text-sm ${
                            message.type === "user" ? " text-primary-foreground bg-blue-500 hover:bg-blue-400" : "bg-muted"
                          }`}
                        >
                          <p>{message.message}</p>
                          <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-muted p-3 rounded-lg text-sm">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border-t p-3">
                    <form onSubmit={handleChatSubmit} className="flex space-x-2">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask me about courses, progress, or platform features..."
                        className="flex-1 text-sm mb-6"
                      />
                      <Button  type="submit" size="sm" disabled={!chatInput.trim()} className={`bg-blue-500 hover:bg-blue-400 cursor-pointer ${!chatInput.trim() ? "opacity-50 cursor-not-allowed" : ""}`}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
    </div>
  )
}
