import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Clock,
  Target,
  Play,
  Send,
  Bot,
  X,
  Eye,
  Award,
  Sparkles,
  Zap
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "../context/AppContext.jsx"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

const chatVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
  exit: { opacity: 0, scale: 0.8, y: 20 }
};

export default function Dashboard() {
  const {axios ,  learner, paths } = useAppContext();
  const [isChatOpen, setIsChatOpen] = useState(false)
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
  const [learnerPaths, setLearnerPaths] = useState(learner?.enrolledPaths || []);

  // Auto-scroll for chat
  const chatEndRef = useRef(null);
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  useEffect(() => {
    if (!learner?.enrolledPaths?.length || !paths?.length) {
       if (learner && !learner.enrolledPaths?.length) setLearnerPaths([]);
       return;
    }

    const mapped = learner.enrolledPaths
      .map((enroll) => {
        const pathObj = paths.find((p) => p._id === enroll.pathId);
        if (!pathObj) return null;
        return {
          ...pathObj,
          enrollment: enroll,
        };
      })
      .filter(Boolean);

    setLearnerPaths(mapped);
  }, [paths, learner]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // 1. Add User Message to UI immediately
    const userMessage = {
      id: Date.now(),
      type: "user",
      message: chatInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    const currentInput = chatInput; // Store input for the API call
    setChatInput("");
    setIsTyping(true);

    try {
      // 2. Call the real Backend API
      // Note: Use the axios instance from your context which likely handles the baseURL
      const { data } = await axios.post("/api/ai/chat", { 
        message: currentInput 
      });

      // 3. Add Bot Response to UI
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        message: data.reply || "I'm sorry, I couldn't process that.",
        timestamp: new Date().toLocaleTimeString(),
      };
      
      setChatMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        message: "Sorry, I'm having trouble connecting to the server right now.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // const generateBotResponse = (input) => {
  //   const lowerInput = input.toLowerCase()

  //   if (lowerInput.includes("course") && lowerInput.includes("progress")) {
  //     return "You can track your course progress in the 'My courses' section. Each course shows your completion percentage, time spent, and next lessons. Would you like me to explain any specific progress metrics?"
  //   }

  //   if (lowerInput.includes("certificate")) {
  //     return "You'll receive a certificate of completion once you finish all lessons in a course with a passing grade. Certificates can be downloaded from your dashboard and are recognized by many employers."
  //   }

  //   if (lowerInput.includes("assignment") || lowerInput.includes("homework")) {
  //     return "Assignments are available within each course module. You can submit them through the course interface, and you'll receive feedback from your instructor. Check the 'Assignments' tab in your enrolled courses."
  //   }

  //   if (lowerInput.includes("schedule") || lowerInput.includes("time")) {
  //     return "You can create a study schedule using our 'Schedule Study Time' feature. I recommend setting aside consistent daily time for learning. Would you like tips on effective study scheduling?"
  //   }

  //   if (lowerInput.includes("help") || lowerInput.includes("support")) {
  //     return "I'm here to help! You can ask me about course navigation, progress tracking, certificates, assignments, study tips, or any other platform features. What specific area would you like assistance with?"
  //   }

  //   if (lowerInput.includes("instructor") || lowerInput.includes("teacher")) {
  //     return "You can contact your instructors through the messaging system in each course. They typically respond within 24 hours. You can also participate in course discussions and Q&A sessions."
  //   }

  //   if (lowerInput.includes("quiz") || lowerInput.includes("test")) {
  //     return "Quizzes are available throughout your courses to test your understanding. You can retake most quizzes, and your highest score counts toward your final grade. Practice quizzes don't affect your grade."
  //   }

  //   if (lowerInput.includes("download") || lowerInput.includes("offline")) {
  //     return "Some course materials can be downloaded for offline viewing, including PDFs and certain videos. Look for the download icon next to eligible content in your courses."
  //   }

  //   return "I understand you're asking about our learning platform. I can help with course navigation, progress tracking, certificates, study tips, and platform features. Could you be more specific about what you'd like to know?"
  // }

  const hoursLearned = learner?.totalLearningHours || 0; 
  const eligibleCertificates = learnerPaths.filter(
    (c) => (c.enrollment?.progressPercent || 0) >= 90
  ).length;

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col bg-slate-50/50 dark:bg-slate-950">
      <motion.main 
        className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section with Gradient Text */}
        <motion.div className="mb-10" variants={itemVariants}>
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, {learner?.name || "Learner"} <motion.span animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }} className="inline-block origin-bottom-right">👋</motion.span>
          </h1>
          <p className="text-muted-foreground text-lg">
            {learner?.email && (<span>{learner.email} • </span>)}
            Let's reach your goals today.
          </p>
          {learner?.createdAt && (
            <p className="text-xs text-muted-foreground mt-1">
              Member since: {learner.createdAt.split("T")[0]}
            </p>
          )}
        </motion.div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
          <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <BookOpen className="h-24 w-24 text-blue-500 transform rotate-12 translate-x-4 -translate-y-4" />
              </div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-600">Total Learning Paths</CardTitle>
                <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900/30">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{learnerPaths.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1 font-medium flex items-center">
                    {eligibleCertificates > 0 && <Sparkles className="h-3 w-3 mr-1 text-yellow-500" />}
                    {eligibleCertificates} near completion
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Clock className="h-24 w-24 text-purple-500 transform -rotate-12 translate-x-4 -translate-y-4" />
              </div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-600">Hours Invested</CardTitle>
                <div className="p-2 bg-purple-100 rounded-full dark:bg-purple-900/30">
                    <Clock className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{hoursLearned.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground mt-1">Keep the streak alive!</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content: Learning Paths */}
          <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
            <Card className="shadow-md border-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" /> 
                    My Learning Paths
                </CardTitle>
                <CardDescription>Continue where you left off</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {learnerPaths.length === 0 ? (
                    <div className="text-center py-10 opacity-50">
                        <BookOpen className="h-12 w-12 mx-auto mb-3" />
                        <p>No enrolled paths yet.</p>
                    </div>
                ) : (
                    learnerPaths.map((course, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={course._id} 
                        className="group flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 p-4 border rounded-xl hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/20 bg-white dark:bg-slate-800 transition-all duration-300"
                    >
                        <div className="relative overflow-hidden rounded-lg w-full md:w-28 h-20 shrink-0">
                             <img
                                src={course.image || "/placeholder.svg"}
                                alt={course.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                        </div>

                        <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg truncate text-slate-800 dark:text-slate-100">{course.title}</h3>
                            <Badge variant="secondary" className="text-xs font-normal">
                            {course.level}
                            </Badge>
                            {course.enrollment?.progressPercent >= 90 && ( 
                            <Badge className="text-xs bg-green-500 hover:bg-green-600 animate-pulse">
                                <Award className="h-3 w-3 mr-1" />
                                Certificate Ready
                            </Badge>
                            )}
                        </div>

                        <div className="flex items-center space-x-4 mb-2">
                            <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1.5 font-medium text-muted-foreground">
                                <span>
                                {course.content?.length || 0} modules
                                </span>
                                <span>{course.enrollment?.progressPercent.toFixed(0) || 0}% Complete</span> 
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${course.enrollment?.progressPercent || 0}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            </div>
                            </div>
                        </div>
                        </div>

                        <div className="flex md:flex-col gap-2 w-full md:w-auto mt-2 md:mt-0">
                        <Link to={`/courses/learning-path/${course._id}`} className="flex-1">
                            <Button size="sm" variant="ghost" className="w-full justify-start md:justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => setSelectedcourse(course)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                            </Button>
                        </Link>
                        
                        <Link to={`/mycourses/${course._id}`} className="flex-1">
                            <Button size="sm" className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 shadow-md transition-transform active:scale-95">
                                <Play className="h-3 w-3 mr-2 fill-current" />
                                Continue
                            </Button>
                        </Link>
                        </div>
                    </motion.div>
                    ))
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar: Weekly Goals */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <Card className="shadow-md border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-700 dark:text-slate-200">
                  <Target className="h-5 w-5 mr-2 text-red-500" />
                  Weekly Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 {/* Mock Goal Chart */}
                 <div className="relative pt-2">
                    <p className="text-sm text-muted-foreground mb-4">You are making great progress this week!</p>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>4/5 Days</span>
                    </div>
                    <Progress value={80} className="h-3 bg-slate-200 dark:bg-slate-800 [&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-orange-500" />
                 </div>
                 
                 <div className="space-y-4 pt-4 border-t">
                    <h4 className="text-sm font-semibold mb-2">Top Priorities</h4>
                    {learnerPaths.slice(0, 3).map((course) => (
                    <div key={course._id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                        <span className="truncate w-2/3">{course.title}</span>
                        <span className="text-xs text-muted-foreground">{course.enrollment?.progressPercent?.toFixed(0)}%</span>
                        </div>
                        <Progress
                            value={course.enrollment?.progressPercent || 0}
                            className="h-1.5"
                        />
                    </div>
                    ))}
                 </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Floating AI Chatbot */}
        <div className="fixed bottom-6 right-6 z-50">
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                variants={chatVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute bottom-16 right-0 w-80 md:w-96 shadow-2xl rounded-2xl overflow-hidden border border-white/20"
              >
                <Card className="h-[500px] flex flex-col border-0 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90">
                  <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <div className="flex items-center space-x-2">
                      <div className="bg-white/20 p-1.5 rounded-full">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold">EduBot AI</CardTitle>
                        <p className="text-[10px] text-blue-100 font-medium opacity-90 flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                            Online
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsChatOpen(false)}
                      className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
                    {chatMessages.map((message) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        key={message.id}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${
                            message.type === "user" 
                              ? "text-white bg-blue-600 rounded-br-none" 
                              : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-700"
                          }`}
                        >
                          <p className="leading-relaxed">{message.message}</p>
                          <p className={`text-[10px] mt-1.5 text-right ${message.type === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>{message.timestamp}</p>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-100 dark:border-slate-700 shadow-sm">
                          <div className="flex space-x-1.5 items-center h-4">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={chatEndRef} />
                  </CardContent>

                  <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    <form onSubmit={handleChatSubmit} className="flex gap-2 relative">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type your question..."
                        className="flex-1 pr-10 rounded-full border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500 bg-slate-50 dark:bg-slate-800"
                      />
                      <Button 
                        type="submit" 
                        size="icon" 
                        disabled={!chatInput.trim()} 
                        className={`rounded-full absolute right-1 top-1 h-8 w-8 transition-all ${!chatInput.trim() ? "opacity-0 scale-75" : "bg-blue-600 hover:bg-blue-500 opacity-100 scale-100"}`}
                      >
                        <Send className="h-3.5 w-3.5" />
                      </Button>
                    </form>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {!isChatOpen && (
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Button
                    onClick={() => setIsChatOpen(true)}
                    className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center justify-center relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
                    <Bot className="h-8 w-8 relative z-10" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                    </span>
                </Button>
            </motion.div>
          )}
        </div>
      </motion.main>
    </div>
  )
}