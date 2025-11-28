"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAppContext } from "@/context/AppContext"

export default function LearnersTab({ searchQuery }) {
  const { learners = [] } = useAppContext();

  const filteredLearners = learners.filter(l => 
    l.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="border-none shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Learner Management</CardTitle>
        <CardDescription>View and manage registered students.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Enrolled Paths</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLearners.length > 0 ? (
                filteredLearners.map((learner) => (
                <TableRow key={learner._id}>
                    <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{learner.fullName?.split("")[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-bold">{learner.name}</div>
                            <div className="text-xs text-muted-foreground">{learner.email}</div>
                        </div>
                    </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                    </TableCell>
                    <TableCell>{learner.enrolledPaths?.length || 0}</TableCell>
                    <TableCell>{new Date(learner.createdAt || Date.now()).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No learners found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}