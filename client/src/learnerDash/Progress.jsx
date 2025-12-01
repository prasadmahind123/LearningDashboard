import React, { useEffect, useState, useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from "recharts";
import { useAppContext } from "../context/AppContext.jsx";
import { motion } from "framer-motion";
import { 
  Clock, Target, TrendingUp, BookOpen, CheckCircle2, Zap, Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/Loader";

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

export default function Progress() {
  const { learner, axios, paths } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!learner?._id) return; // Ensure we have an ID
      try {
        // Use _id (MongoDB ID) instead of .id
        setLoading(true);
        const res = await axios.get(`/api/learner/progress/${learner._id}`);
        const data = res.data;
        
        setStats(data);

        // Process learningActivity for charts (Last 7 days)
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const chartData = last7Days.map(date => {
            const entry = data.learningActivity?.find(a => a.date && a.date.split('T')[0] === date);
            return {
                name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                hours: entry ? entry.hoursSpent : 0,
                date: date
            };
        });

        setActivityData(chartData);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [learner, axios]);

  // --- Deduplicated Course Data ---
  const enrolledCoursesData = useMemo(() => {
    if (!learner?.enrolledPaths || !paths.length) return [];

    const uniqueCourses = new Map();

    learner.enrolledPaths.forEach(enrollment => {
        // Handle both populated object or string ID
        const pathId = typeof enrollment.pathId === 'object' ? enrollment.pathId._id : enrollment.pathId;
        
        if (pathId && !uniqueCourses.has(pathId)) {
            const course = paths.find(p => p._id === pathId);
            if (course) {
                uniqueCourses.set(pathId, { ...course, ...enrollment });
            }
        }
    });

    return Array.from(uniqueCourses.values());
  }, [learner, paths]);

  // Calculate totals
  const totalCompletedModules = enrolledCoursesData.reduce((acc, curr) => acc + (curr.completedModules?.length || 0), 0);
  const overallProgress = enrolledCoursesData.length > 0 
    ? enrolledCoursesData.reduce((acc, curr) => acc + (curr.progressPercent || 0), 0) / enrolledCoursesData.length
    : 0;

  if (loading) {
      return (
          <div className="flex h-[80vh] items-center justify-center bg-slate-50/50 dark:bg-slate-950">
              <Loader />
          </div>
      );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar bg-slate-50/50 dark:bg-slate-950 p-6 md:p-8">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Progress Analytics
                </h1>
                <p className="text-muted-foreground mt-1">
                    Track your learning journey, milestones, and daily activity.
                </p>
            </div>
            <div className="flex gap-2">
                <Badge variant="outline" className="px-3 py-1 bg-white dark:bg-slate-900">
                    <Calendar className="w-3 h-3 mr-2" />
                    {new Date().toLocaleDateString()}
                </Badge>
            </div>
        </motion.div>

        {/* Key Stats Grid */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
                title="Total Hours" 
                value={stats?.totalLearningHours?.toFixed(1) || 0} 
                subtitle="Lifetime learning"
                icon={Clock} 
                color="text-blue-600" 
                bg="bg-blue-100 dark:bg-blue-900/30"
            />
            <StatsCard 
                title="Courses Active" 
                value={stats?.totalCoursesEnrolled || enrolledCoursesData.length || 0} 
                subtitle="Currently enrolled"
                icon={BookOpen} 
                color="text-purple-600" 
                bg="bg-purple-100 dark:bg-purple-900/30"
            />
            <StatsCard 
                title="Modules Done" 
                value={totalCompletedModules} 
                subtitle="Lessons completed"
                icon={CheckCircle2} 
                color="text-green-600" 
                bg="bg-green-100 dark:bg-green-900/30"
            />
            <StatsCard 
                title="Avg. Score" 
                value={`${Math.round(overallProgress)}%`} 
                subtitle="Overall completion"
                icon={TrendingUp} 
                color="text-amber-600" 
                bg="bg-amber-100 dark:bg-amber-900/30"
            />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Chart: Learning Activity */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="h-full border-none shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Weekly Activity</CardTitle>
                        <CardDescription>Hours spent learning over the last 7 days</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activityData}>
                                <defs>
                                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 12, fill: '#64748b'}} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 12, fill: '#64748b'}} 
                                />
                                <RechartsTooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="hours" 
                                    stroke="#3b82f6" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorHours)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Streak & Motivation */}
            <motion.div variants={itemVariants} className="space-y-6">
                <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-300 fill-yellow-300" /> Daily Streak
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-5xl font-bold">{stats?.currentStreak || 0}</span>
                            <span className="text-lg opacity-80">Days</span>
                        </div>
                        <p className="text-sm text-indigo-100 mb-4">
                           Consistency is key! Log in and learn daily to increase your streak.
                        </p>
                        <div className="flex justify-between gap-1">
                            {['S','M','T','W','T','F','S'].map((d, i) => {
                                // Simple visual logic: highlight current day (simplified)
                                const dayIndex = new Date().getDay(); 
                                const isActive = i === dayIndex && (stats?.currentStreak > 0);
                                return (
                                    <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-white text-indigo-600' : 'bg-white/20 text-white'}`}>
                                        {d}
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white/80 dark:bg-slate-900/80">
                    <CardHeader>
                        <CardTitle className="text-lg">Completion Status</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[180px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Completed', value: overallProgress },
                                        { name: 'Remaining', value: Math.max(0, 100 - overallProgress) }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    <Cell fill="#3b82f6" />
                                    <Cell fill="#e2e8f0" />
                                </Pie>
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute text-center">
                            <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">{Math.round(overallProgress)}%</span>
                            <p className="text-xs text-muted-foreground">Avg.</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>

        {/* Detailed Course Progress List */}
        <motion.div variants={itemVariants}>
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Target className="h-5 w-5 text-slate-500" /> 
                Course Progress Breakdown
            </h2>
            
            {enrolledCoursesData.length === 0 ? (
                 <div className="text-center py-10 border-2 border-dashed rounded-xl">
                    <p className="text-slate-500">No active courses found. Enroll in a path to see progress here.</p>
                 </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enrolledCoursesData.map((course) => (
                        <motion.div 
                            key={course._id} // Ensure this ID is unique
                            whileHover={{ scale: 1.01 }}
                            className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4 items-center"
                        >
                            <div className="h-16 w-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                <img src={course.image || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate pr-2">{course.title}</h3>
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                                        {course.progressPercent?.toFixed(0)}%
                                    </span>
                                </div>
                                <ProgressBar 
                                    value={course.progressPercent} 
                                    className="h-2 mb-2" 
                                    indicatorClassName={course.progressPercent >= 100 ? "bg-green-500" : "bg-blue-500"}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{course.completedModules?.length || 0} / {course.totalModules?.length || 0} Modules</span>
                                    <span className="flex items-center gap-1">
                                        Last active: {course.lastAccessed ? new Date(course.lastAccessed).toLocaleDateString() : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>

      </motion.div>
    </div>
  );
}

// --- Helper Component: Stats Card ---
const StatsCard = ({ title, value, subtitle, icon: Icon, color, bg }) => (
  <motion.div whileHover={{ y: -5 }}>
    <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardContent className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-3xl font-bold mt-2 text-slate-900 dark:text-slate-100">{value}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                </div>
                <div className={`p-3 rounded-xl ${bg}`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                </div>
            </div>
        </CardContent>
    </Card>
  </motion.div>
);