"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, UserCheck, BookOpen, Eye, MessageSquare } from "lucide-react"
import AdminHeader from "./AdminHeader.jsx"
import LearnersTab from "./LearnerTab.jsx"
import TeachersTab from "./TeachersTab.jsx"
import CoursesTab from "./CoursesTab.jsx"   
import ContentModerationTab from "./ContentModerationTab.jsx"
import ReportsTab from "./ReportsTab.jsx"


export default function Admin() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("learners")

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="p-4 md:p-6">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Admin Management Panel</h1>
          <p className="text-muted-foreground">Comprehensive platform management and moderation</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
            <TabsTrigger value="learners" className="flex items-center gap-2 text-xs md:text-sm">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Learners</span>
            </TabsTrigger>
            <TabsTrigger value="teachers" className="flex items-center gap-2 text-xs md:text-sm">
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Teachers</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2 text-xs md:text-sm">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Learning Paths</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2 text-xs md:text-sm">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2 text-xs md:text-sm">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learners">
            <LearnersTab searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="teachers">
            <TeachersTab searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="courses">
            <CoursesTab searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="content">
            <ContentModerationTab />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
