import React, { useEffect, useMemo, useState , useRef} from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { useParams, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  FileArchive,
  FileAudio,
  FileSpreadsheet,
  FileText,
  FileVideo,
  ImageIcon,
  Globe,
  CheckCircle,
  ArrowLeft,
  BookOpen,
  Download,
} from "lucide-react";
import { Loader } from "@/components/Loader.jsx";
import toast , {Toaster} from "react-hot-toast";
const fileTypeIcons = {
  pdf: FileText,
  video: FileVideo,
  audio: FileAudio,
  spreadsheet: FileSpreadsheet,
  doc: FileText,
  text: FileText,
  image: ImageIcon,
  link: Globe,
};

export default function CourseDetails() {
  const { paths, learner, axios } = useAppContext();
  const { courseId } = useParams();

  // Find the course
  const course = useMemo(
    () => paths.find((p) => p._id === courseId),
    [paths, courseId]
  );

  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [isLoading , setIsLoading] = useState(false);
  const moduleStartTime = useRef(null);
  const heartbeatTimer = useRef(null);

  useEffect(() => {
    if (learner && course) {
      const enrollment = learner?.enrolledPaths?.find(
        (p) => p.pathId === course._id
      );
      if (enrollment?.completedModules) {
        setCompletedModules(enrollment.completedModules);
      }
    }
  }, [learner, course]);

   // Start timer when module changes
  useEffect(() => {
    moduleStartTime.current = new Date();

    // send time spent when user leaves page
    const handleBeforeUnload = async () => {
      await sendTimeSpent();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // start heartbeat
    startHeartbeat();

    return () => {
      stopHeartbeat();
      sendTimeSpent(); // send time when switching modules
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [selectedModuleIndex]);

    const startHeartbeat = () => {
    stopHeartbeat(); // clear existing if any
    heartbeatTimer.current = setInterval(() => {
      sendTimeSpent();
    }, 5 * 60 * 1000); // every 5 minutes
  };

   const stopHeartbeat = () => {
    if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
  };
  const handleSelectModule = (index) => setSelectedModuleIndex(index);

  const selectedModule = useMemo(() => {
    if (
      course &&
      course.content &&
      selectedModuleIndex < course.content.length
    ) {
      return course.content[selectedModuleIndex];
    }
    return null;
  }, [course, selectedModuleIndex]);

    const sendTimeSpent = async () => {
    if (!selectedModule || !moduleStartTime.current) return;

    const now = new Date();
    const timeSpentHours = (now - moduleStartTime.current) / (1000 * 60 * 60); // hours
    if (timeSpentHours <= 0) return;

    moduleStartTime.current = new Date(); // reset start time

    try {
      await axios.put("/api/learner/complete-module", {
        studentId: learner._id,
        pathId: course._id,
        moduleId: selectedModule._id,
        action: completedModules.includes(selectedModule._id) ? "remove" : "add",
        hoursSpent: timeSpentHours,
      });
    } catch (error) {
      console.error("Failed to send time spent:", error);
    }
  };

  const toggleComplete = async (moduleId) => {
  try {
    setIsLoading(true);
    const isCompleted = completedModules.includes(moduleId);
    // Toggle locally for UI response
    const updatedModules = isCompleted
      ? completedModules.filter((id) => id !== moduleId)
      : [...completedModules, moduleId];

    setCompletedModules(updatedModules);
    

    // ✅ Call backend to update learner progress
    const res = await axios.post("/api/learner/complete-module", {
      studentId : learner.id,
      pathId: course._id,
      moduleId,
      action: isCompleted ? "remove" : "add", // optional to handle unmarking
    }, { withCredentials: true }
  );
  
    if(res.data.message === 'Module marked as incomplete'){
      toast.error("Unmarked")
    }else{
      toast.success("Marked")
    }
  
    
  } catch (error) {
    console.log("❌ Failed to update progress:", error);
  } finally{
    setIsLoading(false);
  }
};

useEffect(() => {
  const fetchLearnerProgress = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/learner/progress/${learner._id}/${courseId}`);
      const enrollment = res.data.enrolledPath;

      if (enrollment?.completedModules) {
        setCompletedModules(enrollment.completedModules);
      }
    } catch (error) {
       console.log("❌ Failed to fetch progress:", error);
    } finally{
      setIsLoading(false);
    }
  };

  if (learner && courseId) fetchLearnerProgress();
}, [learner, courseId , axios]);


const courseDerived = useMemo(() => {
  if (!course?.content)
    return { totalModules: 0, completedCount: 0, percent: 0 };

  const totalModules = course.content.length;
  const completedCount = completedModules.length;
  const percent =
    totalModules === 0 ? 0 : Math.round((completedCount / totalModules) * 100);

  return { totalModules, completedCount, percent };
}, [course, completedModules]);


  const isSelectedModuleCompleted =
    selectedModule && completedModules.includes(selectedModule._id);

  if (!course) {
    return (
      <div className="min-h-screen grid place-items-center p-6">

        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Course Not Found</CardTitle>
            <CardDescription>
              The course you are looking for doesn’t exist or is unavailable.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/learner">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Library
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if(isLoading){
    return(
      <Loader/>
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
            <div className="flex justify-between text-muted-foreground mt-1">
              <span>
                {courseDerived.completedCount}/{courseDerived.totalModules} modules
              </span>
              <span>{courseDerived.percent}%</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {course?.content?.length > 0 ? (
            <SidebarGroup>
              <SidebarGroupLabel>
                <span className="text-lg">Course Modules</span>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {course.content.map((module, index) => {
                  const fileType =
                    module?.resources?.[0]?.fileType?.toLowerCase() || null;
                  const Icon =
                    fileType && fileTypeIcons[fileType]
                      ? fileTypeIcons[fileType]
                      : BookOpen;
                  const isCompleted = completedModules.includes(module._id);

                  return (
                    <SidebarMenuItem
                      key={module._id || index}
                      active={selectedModuleIndex === index}
                      onClick={() => handleSelectModule(index)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-start mt-1 w-full">
                        <div className="flex items-center gap-5 w-full">
                          <Icon color="#e60505" className="h-4 w-4" />
                          <span className="py-1 text-lg font-medium hover:text-emerald-500">
                            {module.title || `Module ${index + 1}`}
                          </span>
                        </div>
                        {isCompleted && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarGroupContent>
            </SidebarGroup>
          ) : (
            <div className="p-4 text-sm text-muted-foreground">
              No modules available for this course.
            </div>
          )}
          <SidebarSeparator />
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-3">
            <Link to="/learner">
              <Button variant="ghost" size="sm" className="cursor-pointer">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src={
                    course?.instructor?.avatarUrl ||
                    "/placeholder.svg?height=40&width=40&query=instructor"
                  }
                  alt={course?.instructor?.name || "Instructor"}
                />
                <AvatarFallback>
                  {course?.createdBy?.fullName?.charAt(0) || "I"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium leading-none">
                  {course.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {course.category}
                </div>
              </div>
            </div>
          </div>
          <div className="ml-auto">
            <Badge variant="outline">{courseDerived.percent}% Complete</Badge>
          </div>
        </header>

        <main className="flex-1 p-4">
          {!selectedModule ? (
            <div className="grid place-items-center h-[70vh]">
              <div className="text-center max-w-md">
                <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-1">Select a Module</h2>
                <p className="text-sm text-muted-foreground">
                  Choose a lesson or resource from the sidebar to view its
                  details here.
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
                        {selectedModule.resources?.map((res, idx) => {
                          const ResIcon =
                            res.fileType &&
                            fileTypeIcons[res.fileType.toLowerCase()]
                              ? fileTypeIcons[res.fileType.toLowerCase()]
                              : FileArchive;
                          return (
                            <ResIcon
                              color="#e60505"
                              key={idx}
                              className="h-5 w-5 text-muted-foreground"
                            />
                          );
                        })}
                        <span className="text-2xl">
                          {selectedModule?.title}
                        </span>
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {selectedModule.description}
                      </CardDescription>
                    </div>
                    {isSelectedModuleCompleted && (
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="rounded-lg border bg-muted/40 p-2">
                    {selectedModule.resources?.length > 0 ? (
                      selectedModule.resources.map((res, idx) => {
                        const ResIcon =
                          res.fileType &&
                          fileTypeIcons[res.fileType.toLowerCase()]
                            ? fileTypeIcons[res.fileType.toLowerCase()]
                            : FileArchive;
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2 hover:bg-accent/50 rounded-md"
                          >
                            <ResIcon
                              color="#e60505"
                              className="h-5 w-5 text-muted-foreground"
                            />
                            {res.fileUrl ? (
                              <a
                                href={res.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium hover:underline"
                              >
                                {res.fileName || res.fileUrl}
                              </a>
                            ) : (
                              <span>{res.fileName || "Unnamed Resource"}</span>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-sm text-muted-foreground p-4">
                        No resources available for this module.
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => toggleComplete(selectedModule._id)}
                      className="cursor-pointer"
                      disabled={selectedModule.locked}
                      variant={
                        isSelectedModuleCompleted ? "secondary" : "default"
                      }
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {isSelectedModuleCompleted
                        ? "Mark as Incomplete"
                        : "Mark as Complete"}
                    </Button>

                    {selectedModule.locked && (
                      <Badge variant="outline">Locked</Badge>
                    )}
                    {isSelectedModuleCompleted && (
                      <Badge variant="secondary" className="gap-2">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Path Details</CardTitle>
                  <CardDescription>
                    Uploaded {course.createdAt.split("T")[0]}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Description</div>
                    <p className="text-sm text-muted-foreground">
                      {selectedModule.description}
                    </p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="primary"
                      onClick={() => window.history.back()}
                      className="cursor-pointer"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const fileUrl = selectedModule.resources?.[0]?.fileUrl;
                        if (!fileUrl) return;
                        const downloadUrl = fileUrl.replace(
                          "/upload/",
                          "/upload/fl_attachment/"
                        );
                        window.open(downloadUrl, "_blank");
                      }}
                      className="cursor-pointer"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
