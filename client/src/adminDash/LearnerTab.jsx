
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
} from "@/components/ui/alert-dialog"
import { Eye, Trash2, Download, RefreshCw } from "lucide-react"
import { useAppContext } from "../context/AppContext.jsx"


export default function LearnersTab({ searchQuery }) {
   const {axios , learners , setLearners} = useAppContext()



  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Learners ({learners.length})</span>
            <div className="flex items-center gap-2 ">
              <Button variant="outline" size="sm" className="cursor-pointer">
                <Download className="h-4 w-4 mr-2 " />
                Export
              </Button>
              <Button variant="outline" size="sm" className="cursor-pointer">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardTitle>
          <CardDescription>Manage and monitor all registered learners</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Learner</TableHead>
                  <TableHead className="hidden md:table-cell">Join Date</TableHead>
                  <TableHead>Learning Hours</TableHead>
                  <TableHead className="hidden lg:table-cell">Total Learning Paths</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {learners.map((learner) => (
                  <TableRow key={learner.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{learner.fullName?.split("")[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{learner.fullName}</p>
                          <p className="text-sm text-muted-foreground">{learner.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{learner.createdAt.split("T")[0]}</TableCell>
                    <TableCell>{learner.totalLearningHours}</TableCell>
                    <TableCell className="hidden lg:table-cell">{learner.enrolledPaths?.length}</TableCell>
                    <TableCell>
                      <Badge variant={learner.status === "Active" ? "default" : "secondary"}>{learner.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{learner.lastActive}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">

                        <AlertDialog>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Learner Account</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {learner.name}'s account? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-destructive text-destructive-foreground cursor-pointer">
                                Delete Account
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
    </div>
  )
}
