import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Users, BookOpen , Star} from "lucide-react"  
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"  
import { Progress } from "@/components/ui/progress"
import { useAppContext } from "../context/AppContext.jsx";

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
  const {teacher , paths} = useAppContext();
  
  return (
    <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll 
        flex flex-col justify-between'>
      <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Revenue Dashboard</h2>
                  <p className="text-muted-foreground">Track your earnings and course performance</p>
                </div>

                {/* Revenue Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">Rs{teacher?.revenue || 0}</div>
                      <p className="text-xs text-muted-foreground">All time earnings</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">This Month</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">Rs{revenueData.monthlyRevenue.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+{revenueData.yearlyGrowth}% from last month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{paths?.length || 0}</div>
                      <p className="text-xs text-muted-foreground">course enrollments</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg per course</CardTitle>
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">Rs{revenueData.avgRevenuePercourse.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">Average revenue</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Monthly Revenue Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Revenue Trend</CardTitle>
                      <CardDescription>Revenue performance over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {revenueData.monthlyBreakdown.map((month, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 text-sm font-medium">{month.month}</div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <div className="w-32 bg-muted rounded-full h-2">
                                    <div
                                      className="bg-primary h-2 rounded-full"
                                      style={{
                                        width: `Rs{(month.revenue / Math.max(...revenueData.monthlyBreakdown.map((m) => m.revenue))) * 100}%`,
                                      }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium">Rs{month.revenue.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline">{month.sales} sales</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Performing courses */}
                  <Card>
                    <CardHeader>
                      <CardTitle>course Revenue Breakdown</CardTitle>
                      <CardDescription>Revenue by individual courses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {teachercourses
                          .filter((course) => course.status === "Published")
                          .sort((a, b) => b.revenue - a.revenue)
                          .map((course, index) => (
                            <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-bold">#{index + 1}</span>
                                </div>
                                <div>
                                  <p className="font-medium line-clamp-1">{course.title}</p>
                                  <p className="text-sm text-muted-foreground">{course.students} students</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-green-600">Rs{course.revenue.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Rs{course.price}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Revenue Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed course Performance</CardTitle>
                    <CardDescription>Comprehensive revenue and performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>course</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Students</TableHead>
                          <TableHead>Revenue</TableHead>
                          <TableHead>Completion Rate</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teachercourses.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <img
                                  src={course.image || "/placeholder.svg"}
                                  alt={course.title}
                                  className="w-10 h-10 object-cover rounded"
                                />
                                <div>
                                  <p className="font-medium">{course.title}</p>
                                  <p className="text-sm text-muted-foreground">{course.category}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>Rs{course.price}</TableCell>
                            <TableCell>{course.students.toLocaleString()}</TableCell>
                            <TableCell className="font-semibold text-green-600">
                              Rs{course.revenue.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress value={course.completionRate} className="w-16 h-2" />
                                <span className="text-sm">{course.completionRate}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{course.rating || "N/A"}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={course.status === "Published" ? "default" : "secondary"}>
                                {course.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
    </div>
  )
}
