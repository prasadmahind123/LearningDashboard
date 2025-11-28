import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Users, BookOpen, Star, ArrowUpRight, ArrowDownRight, CreditCard, Wallet } from "lucide-react"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { useAppContext } from "../context/AppContext.jsx";
import { Button } from '@/components/ui/button'
import { motion } from "framer-motion"

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

// --- Mock Data (Preserved) ---
const teachercourses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    students: 1542,
    revenue: 152420,
    monthlyRevenue: [12500, 15200, 18300, 22100, 19800, 24600],
    rating: 4.8,
    reviews: 1234,
    status: "Published",
    lastUpdated: "2 days ago",
    createdDate: "2023-06-15",
    image: "/placeholder.svg?height=100&width=150&text=Web+Dev",
    totalLessons: 120,
    duration: "40 hours",
    level: "Beginner",
    category: "Web Development",
    price: 99.99,
    enrollmentTrend: [45, 52, 48, 65, 58, 72, 68],
    completionRate: 78,
    avgWatchTime: "85%",
    totalSales: 1542,
  },
  {
    id: 2,
    title: "Advanced JavaScript Concepts",
    students: 892,
    revenue: 89200,
    monthlyRevenue: [8500, 9200, 11300, 14100, 16800, 18600],
    rating: 4.9,
    reviews: 756,
    status: "Published",
    lastUpdated: "1 week ago",
    createdDate: "2023-08-20",
    image: "/placeholder.svg?height=100&width=150&text=JavaScript",
    totalLessons: 85,
    duration: "35 hours",
    level: "Intermediate",
    category: "Programming",
    price: 129.99,
    enrollmentTrend: [32, 38, 42, 48, 45, 52, 58],
    completionRate: 82,
    avgWatchTime: "92%",
    totalSales: 892,
  },
  {
    id: 3,
    title: "React for Beginners",
    students: 234,
    revenue: 18720,
    monthlyRevenue: [2100, 2800, 3200, 3600, 3800, 3200],
    rating: 4.6,
    reviews: 189,
    status: "Published",
    lastUpdated: "3 days ago",
    createdDate: "2023-11-10",
    image: "/placeholder.svg?height=100&width=150&text=React",
    totalLessons: 65,
    duration: "28 hours",
    level: "Beginner",
    category: "Frontend",
    price: 79.99,
    enrollmentTrend: [15, 18, 22, 28, 32, 35, 38],
    completionRate: 71,
    avgWatchTime: "78%",
    totalSales: 234,
  },
  {
    id: 4,
    title: "Node.js Backend Development",
    students: 0,
    revenue: 0,
    monthlyRevenue: [0, 0, 0, 0, 0, 0],
    rating: 0,
    reviews: 0,
    status: "Draft",
    lastUpdated: "5 days ago",
    createdDate: "2024-01-15",
    image: "/placeholder.svg?height=100&width=150&text=Node.js",
    totalLessons: 0,
    duration: "0 hours",
    level: "Intermediate",
    category: "Backend",
    price: 149.99,
    enrollmentTrend: [0, 0, 0, 0, 0, 0, 0],
    completionRate: 0,
    avgWatchTime: "0%",
    totalSales: 0,
  },
]

const revenueData = {
  totalRevenue: 260340,
  monthlyRevenue: 24600,
  yearlyGrowth: 45.2,
  totalSales: 2668,
  avgRevenuePercourse: 65085,
  topPerformingcourse: "Complete Web Development Bootcamp",
  monthlyBreakdown: [
    { month: "Jan", revenue: 18500, sales: 185 },
    { month: "Feb", revenue: 22100, sales: 221 },
    { month: "Mar", revenue: 19800, sales: 198 },
    { month: "Apr", revenue: 24600, sales: 246 },
    { month: "May", revenue: 21300, sales: 213 },
    { month: "Jun", revenue: 26800, sales: 268 },
  ],
}

export default function Revenue() {
  const { teacher, paths } = useAppContext();
  
  return (
    <div className='flex-1 h-screen overflow-y-auto no-scrollbar bg-slate-50/50 dark:bg-slate-950 p-6 md:p-8'>
      <motion.div 
        className="max-w-7xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* Header */}
        <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Revenue Analytics
            </h1>
            <p className="text-muted-foreground mt-1">Track your financial performance and growth.</p>
        </motion.div>

        {/* Revenue Overview Cards */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={itemVariants}>
                <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Revenue</CardTitle>
                        <div className="p-2 bg-emerald-100 rounded-full">
                            <Wallet className="h-4 w-4 text-emerald-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">Rs{teacher?.revenue || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Lifetime earnings</p>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">This Month</CardTitle>
                        <div className="p-2 bg-blue-100 rounded-full">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">Rs{revenueData.monthlyRevenue.toLocaleString()}</div>
                        <p className="text-xs font-medium text-green-600 mt-1 flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +{revenueData.yearlyGrowth}% growth
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Sales</CardTitle>
                        <div className="p-2 bg-purple-100 rounded-full">
                            <CreditCard className="h-4 w-4 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{paths?.length || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Course enrollments</p>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Avg / Course</CardTitle>
                        <div className="p-2 bg-amber-100 rounded-full">
                            <BookOpen className="h-4 w-4 text-amber-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">Rs{revenueData.avgRevenuePercourse.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Per active course</p>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Revenue Chart */}
            <motion.div variants={itemVariants}>
                <Card className="h-full border-none shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Monthly Trends</CardTitle>
                        <CardDescription>Revenue performance over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5 pt-4">
                        {revenueData.monthlyBreakdown.map((month, index) => {
                            const maxRevenue = Math.max(...revenueData.monthlyBreakdown.map((m) => m.revenue));
                            const widthPercent = (month.revenue / maxRevenue) * 100;
                            
                            return (
                                <div key={index} className="flex items-center gap-4 group">
                                    <div className="w-10 text-sm font-semibold text-slate-500">{month.month}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                Rs{month.revenue.toLocaleString()}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                                {month.sales} sales
                                            </span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${widthPercent}%` }}
                                                transition={{ duration: 1, delay: index * 0.1 }}
                                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Top Performing Courses */}
            <motion.div variants={itemVariants}>
                <Card className="h-full border-none shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Top Performers</CardTitle>
                        <CardDescription>Highest revenue generating courses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                        {teachercourses
                            .filter((course) => course.status === "Published")
                            .sort((a, b) => b.revenue - a.revenue)
                            .slice(0, 5) // Show top 5
                            .map((course, index) => (
                            <div key={course.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-100">
                                <div className="flex items-center space-x-3 overflow-hidden">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm shrink-0 ${
                                        index === 0 ? "bg-yellow-100 text-yellow-700" : 
                                        index === 1 ? "bg-slate-100 text-slate-700" : 
                                        index === 2 ? "bg-orange-100 text-orange-700" : 
                                        "bg-slate-50 text-slate-500"
                                    }`}>
                                        #{index + 1}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">{course.title}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Users className="h-3 w-3" /> {course.students} students
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 ml-4">
                                    <p className="font-bold text-sm text-emerald-600">Rs{course.revenue.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">Rs{course.price}</p>
                                </div>
                            </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>

        {/* Detailed Revenue Table */}
        <motion.div variants={itemVariants}>
            <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-900 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Course Breakdown</CardTitle>
                            <CardDescription>Detailed metrics for all your courses</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="hidden sm:flex">
                            <DollarSign className="h-4 w-4 mr-2" /> Download Report
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-50">
                                <TableHead className="pl-6">Course Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Students</TableHead>
                                <TableHead>Revenue</TableHead>
                                <TableHead>Completion</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead className="pr-6 text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teachercourses.map((course) => (
                                <TableRow key={course.id} className="group hover:bg-slate-50/80 transition-colors">
                                    <TableCell className="pl-6 font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-slate-100 overflow-hidden shrink-0">
                                                <img src={course.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="truncate max-w-[180px] sm:max-w-xs" title={course.title}>{course.title}</span>
                                                <span className="text-[10px] text-muted-foreground">{course.category}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>Rs{course.price}</TableCell>
                                    <TableCell>{course.students.toLocaleString()}</TableCell>
                                    <TableCell className="font-bold text-emerald-600">
                                        Rs{course.revenue.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={course.completionRate} className="w-16 h-1.5 bg-slate-100" />
                                            <span className="text-xs text-muted-foreground">{course.completionRate}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-amber-500 font-medium">
                                            <Star className="h-3.5 w-3.5 fill-current" />
                                            {course.rating || "N/A"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="pr-6 text-right">
                                        <Badge 
                                            variant={course.status === "Published" ? "default" : "secondary"}
                                            className={course.status === "Published" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200" : ""}
                                        >
                                            {course.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}