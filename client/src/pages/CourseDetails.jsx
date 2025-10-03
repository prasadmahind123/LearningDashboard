import React, { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { useParams } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom";
import {
  FileArchive,
  FileAudio,
  FileSpreadsheet,
  FileText,
  FileVideo,
  ImageIcon,
  Globe,
  Presentation,
  Star,
  CheckCircle,
  ArrowLeft,
  BookOpen
} from "lucide-react"


const fileTypeIcons = {
  pdf: FileText,
  video: FileVideo,
  audio: FileAudio,
  spreadsheet: FileSpreadsheet,
  doc: FileText,
  text: FileText,
  image: ImageIcon,
  link: Globe,
}

export default function CourseDetails() {
  const { paths } = useAppContext();
  const {courseId} = useParams();
  const course = paths.find((p) => p._id === courseId);

  

//   // UI state
  const [query, setQuery] = useState("");
  const [selectedPathId, setSelectedPathId] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(null);
  const isSelectedCompleted = selectedModuleIndex !== null && course?.content && course.content[selectedModuleIndex]?.completed;


//   // Choose first path by default (if available)
  useEffect(() => {
    if (paths && paths.length > 0 && !selectedPathId) {
      setSelectedPathId(paths[0]._id || paths[0].id);
    }
  }, [paths]);

  const contentModules = course?.content || [];

  const filtered = useMemo(() => {
    if (!query) return paths || [];
    return (paths || []).filter((p) =>
      (p.title || "").toLowerCase().includes(query.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(query.toLowerCase())
    );
  }, [paths, query]);

  const selectedPath = useMemo(() => {
    if (!selectedPathId) return null;
    return (paths || []).find((p) => p._id === selectedPathId || p.id === selectedPathId) || null;
  }, [paths, selectedPathId]);

  const modules = selectedPath?.content || selectedPath?.learningPath || [];

//   // When path changes, reset selected module
  useEffect(() => {
    setSelectedModuleIndex(modules.length > 0 ? 0 : null);
  }, [selectedPathId]);

  const handleSelectPath = (id) => {
    setSelectedPathId(id);
    setSelectedModuleIndex(null);
  };

  const handleSelectModule = (index) => {
    setSelectedModuleIndex(index);
  };

  const selectedModule = selectedModuleIndex !== null ? modules[selectedModuleIndex] : null;
  console.log("Selected module inside JSX:", selectedModule)

  const isSelectedLocked = selectedModule ? selectedModule.locked : false;

 const toggleComplete = (id) => {
  console.log(id)
  setCompletedModules((prev) => {
    if (completedModules.includes(id)) {
      // remove if already completed
      return completedModules.filter((moduleId) => moduleId !== id);
    } else {
      // add if not completed
      return [...prev, id];
    }
  });
};


  console.log(completedModules)

    const courseDerived = useMemo(() => {
    if (!course) return { totalModules: 0, completedModules: 0, percent: 0 };
    const totalModules = course.content ? course.content.length : 0;
    const completedModules = course.content ? course.content.filter(m => m.completed).length : 0;
    const percent = totalModules === 0 ? 0 : Math.round((completedModules / totalModules) * 100);
    return { totalModules, completedModules, percent };
  }, [course]);


    if (!course) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Course Not Found</CardTitle>
            <CardDescription>{"The course you are looking for doesn't exist or is unavailable."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to={'/learner'}>
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Library
            </Button></Link>
            
          </CardContent>
        </Card>
      </div>
    )
  }


  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-1">
            <div>
              <div className="text-lg font-semibold leading-none">
                {course?.title || "Course Title"}
              </div>
              <div className="text-xs text-muted-foreground">
                {course?.category || "Category"}
              </div>
            </div>
          </div>
          <div className="px-2">
            <Progress value={courseDerived.percent} className="h-2" />
            <div className="flex justify-between  text-muted-foreground mt-1">
              <span>
                {courseDerived.completedModules}/{courseDerived.totalModules} modules
              </span>
              <span>{courseDerived.percent}%</span>
            </div>
          </div>
            </SidebarHeader>
            <SidebarContent> 
                {
                    course?.content && course.content.length > 0 ? (
                      <SidebarGroup>
                        <SidebarGroupLabel className="">
                            <span className="text-lg">Course Modules</span>
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            {course.content.map((module, index) => {
                              // Pick first resource fileType if available
                              const fileType = module?.resources?.[0]?.fileType?.toLowerCase() || null
                              const Icon = fileType && fileTypeIcons[fileType] ? fileTypeIcons[fileType] : null

                              return (
                                <SidebarMenuItem
                                  key={module._id || index}
                                  active={selectedModuleIndex === index}
                                  onClick={() => handleSelectModule(index)}
                                  className="cursor-pointer"
                                >
                                  <div className="flex items-center justify-start mt-1 w-full">
                                    <div className="flex items-center gap-5">
                                      {/* Resource-based icon (pdf, video, etc.) */}
                                      {Icon && <Icon color="#e60505" className="h-4 w-4" />}

                                      {/* Fallback: module type icons */}
                                      {module?.type === "quiz" && (
                                        <Star className="h-4 w-4 text-muted-foreground" />
                                      )}
                                      {module?.type === "assignment" && (
                                        <Presentation className="h-4 w-4 text-muted-foreground" />
                                      )}

                                      <span className=" py-1 text-lg font-medium hover:text-emerald-500">
                                        {module.title || `Module ${index + 1}`}
                                      </span>
                                    </div>
                                    {module.completed && (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    )}
                                  </div>
                                </SidebarMenuItem>
                              )
                            })}
                          </SidebarGroupContent>

                      </SidebarGroup>
                    ):(
                        <div className="p-4 text-sm text-muted-foreground">No modules available for this course.</div>
                    )
                }
                <SidebarSeparator />
           
            </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex items-center gap-3">
                <Link to={'/learner'}>
                  <Button variant="ghost" size="sm" className='cursor-pointer'>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Library
                  </Button>
                  
                </Link>
                <div className="h-6 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={course?.instructor?.avatarUrl || "/placeholder.svg?height=40&width=40&query=instructor"} alt={course?.instructor?.name || "Instructor"} />
                    <AvatarFallback>{(course?.createdBy?.fullName || "I").charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium leading-none">{course.title}</div>
                    <div className="text-xs text-muted-foreground">{course.category}</div>
                  </div>
                </div>
              </div>
              <div className="ml-auto">
                <Badge variant="outline">{courseDerived.percent}% Complete</Badge>
              </div>
          </header>
          <main className="flex-1 p-4">
                {
                    !selectedModule ? (
                      <div className="grid place-items-center h-[70vh]">
                        <div className="text-center max-w-md">
                          <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                          <h2 className="text-xl font-semibold mb-1">Select content</h2>
                          <p className="text-sm text-muted-foreground">
                            Choose a lesson or resource from the sidebar to view its details here.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-4 lg:grid-cols-3">
                        <Card className="lg:col-span-2">
                          <CardHeader> 
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <CardTitle className="flex items-center gap-2">
                                  {selectedModule.resources.map((res, idx) => {
                                    const ResIcon = res.fileType && fileTypeIcons[res.fileType.toLowerCase()] ? fileTypeIcons[res.fileType.toLowerCase()] : FileArchive;
                                    return <ResIcon color = "#e60505" key={idx} className="h-5 w-5 text-muted-foreground" />
                                  })}
                                  <span className="text-2xl">{selectedModule?.title}</span>
                                </CardTitle>
                                <CardDescription className="text-sm">{selectedModule.description}</CardDescription>
                              </div>
                              {isSelectedCompleted && (
                                <Badge variant="secondary" className="gap-1">
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  Completed
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="rounded-lg border bg-muted/40 p-2">
                          {
                            selectedModule.resources && selectedModule.resources.length > 0 ? (
                                  selectedModule.resources.map((res, idx) => {
                                    const ResIcon = res.fileType && fileTypeIcons[res.fileType.toLowerCase()] ? fileTypeIcons[res.fileType.toLowerCase()] : FileArchive;
                                    return (
                                      <div key={idx} className="flex items-center gap-3 p-2 hover:bg-accent/50 rounded-md">
                                        <ResIcon color = "#e60505" className="h-5 w-5 text-muted-foreground" />
                                        {res.fileUrl ? (
                                          <a href={res.fileUrl} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                                            {res.fileName || res.fileUrl}
                                          </a>
                                        ) : (
                                          <span>{res.fileName || "Unnamed Resource"}</span>
                                        )}
                                      </div>
                                    )
                                  })
                                ) : (
                                  <div className="text-sm text-muted-foreground p-4">
                                    No resources available for this module.
                                  </div>
                                )
                          }
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div className="bg-muted/40 rounded-md p-3 text-center">
                                <div className="font-medium">Type</div>
                                <div className="mt-1 flex items-center justify-center gap-1">
                                  
                                  <span className="capitalize">{selectedModule.resources.fileType}</span>
                                </div>
                              </div>
                              {selectedModule.duration && (
                                <div className="bg-muted/40 rounded-md p-3 text-center">
                                  <div className="font-medium">Duration</div>
                                  <div className="mt-1">{selectedModule.duration}</div>
                                </div>
                              )}
                              {selectedModule.size && (
                                <div className="bg-muted/40 rounded-md p-3 text-center">
                                  <div className="font-medium">Size</div>
                                  <div className="mt-1">{selectedModule.size || 0}</div>
                                </div>
                              )}
                              {selectedModule.rating && (
                                <div className="bg-muted/40 rounded-md p-3 text-center">
                                  <div className="font-medium">Rating</div>
                                  <div className="mt-1 flex items-center justify-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span>{selectedModule.rating || 0}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                             {/* Mark as complete */}
                            <div className="flex flex-wrap gap-2">
                              <Button
                                onClick={() => toggleComplete(selectedModule._id)}
                                
                                disabled={isSelectedLocked}
                                variant={isSelectedCompleted ? "secondary" : "default"}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {isSelectedCompleted ? "Mark as Incomplete" : "Mark as Complete"}
                              </Button>
                              {isSelectedLocked && <Badge variant="outline">Locked</Badge>}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )
                }
          </main>
        </SidebarInset>

    </SidebarProvider>
  )};
        

