
import { useEffect } from "react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, UserCheck, BookOpen, Eye, MessageSquare, ShieldAlert, BarChart3 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import AdminHeader from "./AdminHeader.jsx"
import LearnersTab from "./LearnerTab.jsx"
import TeachersTab from "./TeachersTab.jsx"
import CoursesTab from "./CoursesTab.jsx"
import ContentModerationTab from "./ContentModerationTab.jsx"
import ReportsTab from "./ReportsTab.jsx"

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1, duration: 0.5 } 
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

const tabContentVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 10, transition: { duration: 0.2 } }
};

export default function Admin() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("learners")

  useEffect(() => {
    document.title = "Dashboard - Admin Portal";
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col">
      
      {/* Top Navbar Component */}
      <AdminHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
              Admin Portal
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
              Manage users, moderate content, and oversee platform health.
            </p>
          </div>
        </motion.div>

        {/* Main Tabs Area */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
          
          {/* Sticky Tab List */}
          <motion.div variants={itemVariants} className="sticky top-20 z-30">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-1 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto bg-transparent gap-2">
                    <TabsTrigger 
                        value="learners" 
                        className="flex items-center gap-2 py-3 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
                    >
                        <Users className="h-4 w-4" />
                        <span className="hidden sm:inline font-medium">Learners</span>
                    </TabsTrigger>
                    <TabsTrigger 
                        value="teachers" 
                        className="flex items-center gap-2 py-3 rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all duration-300"
                    >
                        <UserCheck className="h-4 w-4" />
                        <span className="hidden sm:inline font-medium">Teachers</span>
                    </TabsTrigger>
                    <TabsTrigger 
                        value="courses" 
                        className="flex items-center gap-2 py-3 rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all duration-300"
                    >
                        <BookOpen className="h-4 w-4" />
                        <span className="hidden sm:inline font-medium">Paths</span>
                    </TabsTrigger>
                    <TabsTrigger 
                        value="content" 
                        className="flex items-center gap-2 py-3 rounded-xl data-[state=active]:bg-rose-600 data-[state=active]:text-white transition-all duration-300"
                    >
                        <ShieldAlert className="h-4 w-4" />
                        <span className="hidden sm:inline font-medium">Moderation</span>
                    </TabsTrigger>
                    <TabsTrigger 
                        value="reports" 
                        className="flex items-center gap-2 py-3 rounded-xl data-[state=active]:bg-amber-600 data-[state=active]:text-white transition-all duration-300"
                    >
                        <BarChart3 className="h-4 w-4" />
                        <span className="hidden sm:inline font-medium">Reports</span>
                    </TabsTrigger>
                </TabsList>
            </div>
          </motion.div>

          {/* Tab Content Wrapper */}
          <div className="relative min-h-[500px]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedTab}
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full"
                >
                    <TabsContent value="learners" className="mt-0 space-y-4">
                        <LearnersTab searchQuery={searchQuery} />
                    </TabsContent>

                    <TabsContent value="teachers" className="mt-0 space-y-4">
                        <TeachersTab searchQuery={searchQuery} />
                    </TabsContent>

                    <TabsContent value="courses" className="mt-0 space-y-4">
                        <CoursesTab searchQuery={searchQuery} />
                    </TabsContent>

                    <TabsContent value="content" className="mt-0 space-y-4">
                        <ContentModerationTab />
                    </TabsContent>

                    <TabsContent value="reports" className="mt-0 space-y-4">
                        <ReportsTab />
                    </TabsContent>
                </motion.div>
            </AnimatePresence>
          </div>

        </Tabs>
      </motion.main>
    </div>
  )
}