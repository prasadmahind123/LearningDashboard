"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Eye, Trash2, CheckCircle2, XCircle, Download, RefreshCw, ExternalLink, GraduationCap } from "lucide-react"
import { useAppContext } from "../context/AppContext"
import { motion, AnimatePresence } from "framer-motion"

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

export default function TeachersTab({ searchQuery }) {
  const { axios, teachers, setTeachers } = useAppContext();

  const handleApproval = async (id, action) => {
    try {
      await axios.post(`/api/admin/teachers/${id}/${action}`, {}, {
        withCredentials: true,
      });
      setTeachers((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, status: action === 'approve' ? "Approved" : "Rejected" } : t
        )
      );
    } catch (err) {
      console.error(`Error during ${action}:`, err);
    }
  };

  const deleteTeacher = async (id) => {
    try {
      await axios.delete(`/api/admin/teachers/${id}`, {
        withCredentials: true,
      });
      setTeachers(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      console.log(error)
    }
  }

  // Filter logic
  const filteredTeachers = teachers.filter(t => 
    t.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <Card className="border-none shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Instructor Management
                </CardTitle>
                <CardDescription className="mt-1">
                    Review applications and manage {teachers.length} registered instructors.
                </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 bg-white dark:bg-slate-950">
                <Download className="h-4 w-4 mr-2 text-slate-500" />
                Export
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <RefreshCw className="h-4 w-4 text-slate-500" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-950">
              <TableRow>
                <TableHead className="pl-6">Instructor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expertise</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredTeachers.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                            No instructors found matching your search.
                        </TableCell>
                    </TableRow>
                ) : (
                    filteredTeachers.map((teacher) => (
                        <motion.tr 
                            key={teacher._id}
                            variants={rowVariants}
                            className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
                        >
                            <TableCell className="pl-6 py-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-700 shadow-sm">
                                        <AvatarImage src={teacher.avatar} />
                                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                                            {teacher.fullName?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                                            {teacher.fullName}
                                        </p>
                                        <p className="text-xs text-slate-500 font-medium">
                                            {teacher.email}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>
                            
                            <TableCell>
                                <Badge 
                                    variant="outline" 
                                    className={`
                                        px-2.5 py-0.5 rounded-full border font-medium
                                        ${teacher.status === "Approved" 
                                            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" 
                                            : teacher.status === "Pending"
                                                ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800 animate-pulse"
                                                : "bg-slate-100 text-slate-600 border-slate-200"
                                        }
                                    `}
                                >
                                    {teacher.status || "Pending"}
                                </Badge>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <GraduationCap className="h-4 w-4 text-indigo-500" />
                                    <span className="truncate max-w-[150px]" title={teacher.qualification}>
                                        {teacher.qualification || "N/A"}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell>
                                {teacher.certificates ? (
                                    <a 
                                        href={teacher.certificates} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                    >
                                        View Cert <ExternalLink className="h-3 w-3" />
                                    </a>
                                ) : (
                                    <span className="text-xs text-slate-400 italic">No docs</span>
                                )}
                            </TableCell>

                            <TableCell className="text-right pr-6">
                                <div className="flex justify-end items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                                    {teacher.status === "Pending" || teacher.status === "pending" ? (
                                        <>
                                            <Button 
                                                size="sm" 
                                                onClick={() => handleApproval(teacher._id, 'approve')}
                                                className="h-8 bg-green-600 hover:bg-green-700 text-white shadow-sm"
                                            >
                                                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Approve
                                            </Button>
                                            
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="outline" className="h-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                                                        <XCircle className="h-3.5 w-3.5 mr-1.5" /> Reject
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Reject Application?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will reject <strong>{teacher.fullName}</strong>'s application. They will need to re-apply.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleApproval(teacher._id, 'reject')} className="bg-red-600 hover:bg-red-700">
                                                            Confirm Reject
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </>
                                    ) : (
                                        <>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="text-red-600">Delete Account</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to permanently delete <strong>{teacher.fullName}</strong>? This action cannot be undone and will remove all their courses.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => deleteTeacher(teacher._id)} className="bg-red-600 hover:bg-red-700">
                                                            Delete Forever
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </>
                                    )}
                                </div>
                            </TableCell>
                        </motion.tr>
                    ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}