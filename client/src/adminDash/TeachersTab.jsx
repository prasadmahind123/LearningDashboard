import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { useAppContext } from "../context/AppContext.jsx"



export default function TeachersTab({ searchQuery }) {

  const { axios , teachers , setTeachers } = useAppContext();


  

  const handleApproval = async (id, action) => {
    try {
      await axios.post(`/api/admin/teachers/Rs{id}/Rs{action}`, {}, {
        withCredentials: true,
      });
      setTeachers((prev) =>
      prev.map((t) =>
        t._id === id ? { ...t, status: "Approved" } : t
      )
    );
    } catch (err) {
      console.error(`Error during Rs{action}:`, err);
    }
  };

  const deleteTeacher = async (id) => {
      try {
        await axios.delete(`/api/admin/teachers/Rs{id}`,{
          withCredentials: true,
        });
        setTeachers(prev => prev.filter(t => t._id !== id));
        alert("Teacher deleted successfully")
      } catch (error) {
        console.log(error)
      }
  }
  
  


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Teachers ({teachers.length})</span>
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
          <CardDescription>Approve, manage, and monitor all teachers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Qualification</TableHead>
                  <TableHead>Certificate</TableHead>
                  <TableHead>Actions</TableHead>

                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs"></AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{teacher.fullName}</p>
                          <p className="text-sm text-muted-foreground">{teacher.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          teacher.status === "Approved"
                            ? "default"
                            : teacher.status === "Pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {teacher.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p>{teacher.qualification}</p>
                    </TableCell>
                    <TableCell>
                      <a href={teacher.certificates} target="_blank" rel="noopener noreferrer"> View Certificate</a>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {teacher.status === "pending" ? (
                          <>
                            <Button variant="outline" className="cursor-pointer" size="sm" onClick={() => handleApproval(teacher._id, 'approve')}>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" className="cursor-pointer" size="sm" onClick={() => handleApproval(teacher._id, 'reject')}>
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reject Teacher Application</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to reject {teacher.fullName}'s teacher application?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className=" cursor-pointer bg-destructive text-destructive-foreground"
                                    onClick={() => deleteTeacher(teacher._id)}
                                  >
                                    Reject Application
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" className="cursor-pointer">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="cursor-pointer">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Teacher Account</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {teacher.fullName}'s account? This will also remove all
                                    their courses.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground cursor-pointer"
                                    onClick={() => deleteTeacher(teacher._id)}
                                  >
                                    Delete Account
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
