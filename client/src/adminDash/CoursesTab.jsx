
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Eye, Trash2, CheckCircle, XCircle, Star, Download, RefreshCw } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import toast, { Toaster } from "react-hot-toast";



const courses = [
  {
    id: 1,
    title: "Advanced React Development",
    instructor: "Dr. Sarah Chen",
    category: "Programming",
    students: 234,
    rating: 4.8,
    price: 99.99,
    status: "Published",
    createdDate: "2023-12-15",
    lastUpdated: "2024-01-10",
    revenue: 23400,
    completionRate: 78,
  },
  {
    id: 2,
    title: "Machine Learning Basics",
    instructor: "Mike Rodriguez",
    category: "Data Science",
    students: 89,
    rating: 4.5,
    price: 79.99,
    status: "Under Review",
    createdDate: "2024-01-12",
    lastUpdated: "2024-01-15",
    revenue: 7120,
    completionRate: 65,
  },
  {
    id: 3,
    title: "Digital Marketing Strategy",
    instructor: "Emily Thompson",
    category: "Marketing",
    students: 156,
    rating: 4.9,
    price: 89.99,
    status: "Published",
    createdDate: "2023-11-20",
    lastUpdated: "2024-01-08",
    revenue: 14040,
    completionRate: 82,
  },
  {
    id: 4,
    title: "Blockchain Fundamentals",
    instructor: "John Martinez",
    category: "Technology",
    students: 12,
    rating: 0,
    price: 69.99,
    status: "Draft",
    createdDate: "2024-01-18",
    lastUpdated: "2024-01-19",
    revenue: 840,
    completionRate: 45,
  },
]

export default function CoursesTab({ searchQuery }) {
  const {paths , axios} = useAppContext();
  const [selectedcourse, setSelectedcourse] = useState(null)

  const filteredcourses = paths.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )




  const handleDeletePath = async(course) => {
    try {
      await axios.delete(`api/admin/paths/${course._id}` , {
        withCredentials: true,
      });
      toast.success("Path deleted successfully");

    } catch (error) {
      console.error("Error deleting path:", error);
      toast.error("Failed to delete path");
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Paths ({filteredcourses.length})</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="cursor-pointer">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="cursor-pointer">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardTitle>
          <CardDescription>Monitor course performance and manage content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>course</TableHead>
                  <TableHead className="hidden md:table-cell">Instructor</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead className="hidden lg:table-cell">Rating</TableHead>
                  <TableHead className="hidden lg:table-cell">Price</TableHead>
                  <TableHead className="hidden md:table-cell">Revenue</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredcourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-muted-foreground">{course.category}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{course.createdBy?.fullName}</TableCell>
                    <TableCell>{course.learners?.length}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {course.rating > 0 ? (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {course.rating}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No rating</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">Rs. {course.price}</TableCell>
                    {/* <TableCell>
                      <Badge
                        variant={
                          course.status === "Published"
                            ? "default"
                            : course.status === "Under Review"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {course.status}
                      </Badge>
                    </TableCell> */}
                    <TableCell className="hidden md:table-cell">Rs. {course.revenue || 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                       
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedcourse(course)} className={"cursor-pointer"}>
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>course Details</DialogTitle>
                                  <DialogDescription>
                                    Detailed statistics and information for {selectedcourse?.title}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedcourse && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>course Title</Label>
                                        <p className="font-medium">{selectedcourse.title}</p>
                                      </div>
                                      <div>
                                        <Label>Instructor</Label>
                                        <p className="font-medium">{selectedcourse.createdBy?.fullName}</p>
                                      </div>
                                      <div>
                                        <Label>Category</Label>
                                        <p className="font-medium">{selectedcourse.category}</p>
                                      </div>
                                      <div>
                                        <Label>Price</Label>
                                        <p className="font-medium">Rs. {selectedcourse.price}</p>
                                      </div>
                                      <div>
                                        <Label>Total Students</Label>
                                        <p className="font-medium">{selectedcourse.learners?.length || 0}</p>
                                      </div>
                                      <div>
                                        <Label>Total Revenue</Label>
                                        <p className="font-medium">Rs. {selectedcourse.revenue}</p>
                                      </div>
                                      <div>
                                        <Label>Rating</Label>
                                        <p className="font-medium">
                                          {selectedcourse.rating > 0 ? `Rs{selectedcourse.rating}/5` : "No rating"}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Created Date</Label>
                                      <p className="font-medium">{selectedcourse.createdAt?.split("T")[0]}</p>
                                    </div>
                                    <div>
                                      <Label>Last Updated</Label>
                                      <p className="font-medium">{selectedcourse.updatedAt?.split("T")[0]}</p>
                                    </div>
                                  </div>
        )}
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className= "cursor-pointer">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete course</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{course.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick = {()=>handleDeletePath(course)} className="cursor-pointer bg-destructive text-destructive-foreground">
                                    Delete course
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                      
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
