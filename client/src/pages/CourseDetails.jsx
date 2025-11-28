import React, { useEffect, useMemo, useState, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
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
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileText,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  ImageIcon,
  Globe,
  CheckCircle,
  Circle,
  PlayCircle,
  Lock,
  ArrowLeft,
  MessageSquare,
  Maximize2,
  Loader2 // Imported Loader2 icon
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Internal Loader Component ---
const Loader = () => (
  <div className="flex h-full w-full items-center justify-center p-10">
    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
  </div>
);

// --- Icons Map ---
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

// --- Video Helpers ---
const isYouTubeUrl = (url) => /(youtube\.com\/watch\?v=|youtu\.be\/)/i.test(url);
const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return match?.[1] || null;
};
const getYouTubeEmbed = (url) => {
  const id = getYouTubeId(url);
  // Added rel=0 to prevent related videos from other channels
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&modestbranding=1&rel=0` : null;
};
const getYouTubeThumbnail = (url) => {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
};

const isVimeoUrl = (url) => /vimeo\.com/i.test(url);
const getVimeoEmbed = (url) => {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m?.[1] ? `https://player.vimeo.com/video/${m[1]}` : null;
};

const isDirectVideo = (url) => /\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i.test(String(url || ""));

export default function CourseDetails() {
  const { paths, learner, axios } = useAppContext();
  const { courseId } = useParams();

  const course = useMemo(() => paths.find((p) => p._id === courseId), [paths, courseId]);

  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [learnerPathDetails, setLearnerPathDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // AI Modal
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [aiTargetDocId, setAiTargetDocId] = useState(null);

  // Video Selection
  const [selectedVideoByModule, setSelectedVideoByModule] = useState({});

  // Timers
  const moduleStartTime = useRef(null);
  const heartbeatTimer = useRef(null);

  // --- Effects ---
  useEffect(() => {
    if (learner && course) {
      const enrollment = learner?.enrolledPaths?.find((p) => p.pathId === course._id);
      setLearnerPathDetails(enrollment || null);
      if (enrollment?.completedModules) {
        setCompletedModules(enrollment.completedModules);
      }
    }
  }, [learner, course]);

  useEffect(() => {
    moduleStartTime.current = new Date();
    const handleBeforeUnload = async () => await sendTimeSpent();
    window.addEventListener("beforeunload", handleBeforeUnload);
    startHeartbeat();
    return () => {
      stopHeartbeat();
      sendTimeSpent();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [selectedModuleIndex]);

  const startHeartbeat = () => {
    stopHeartbeat();
    heartbeatTimer.current = setInterval(() => sendTimeSpent(), 5 * 60 * 1000);
  };

  const stopHeartbeat = () => {
    if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
  };

  const selectedModule = useMemo(() => {
    return course?.content?.[selectedModuleIndex] || null;
  }, [course, selectedModuleIndex]);

  const sendTimeSpent = async () => {
    if (!selectedModule || !moduleStartTime.current) return;
    const now = new Date();
    const timeSpentHours = (now - moduleStartTime.current) / (1000 * 60 * 60);
    if (timeSpentHours <= 0) return;
    moduleStartTime.current = new Date();

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
      const isCompleted = completedModules.includes(moduleId);
      const updatedModules = isCompleted
        ? completedModules.filter((id) => id !== moduleId)
        : [...completedModules, moduleId];

      setCompletedModules(updatedModules);

      const res = await axios.post(
        "/api/learner/complete-module",
        {
          studentId: learner.id,
          pathId: course._id,
          moduleId,
          action: isCompleted ? "remove" : "add",
        },
        { withCredentials: true }
      );

      if (res.data.message === "Module marked as incomplete") {
        toast("Progress Updated", { icon: "↩️" });
      } else {
        toast.success("Module Completed!");
      }
    } catch (error) {
      console.log("❌ Failed to update progress:", error);
    }
  };

  const courseDerived = useMemo(() => {
    if (!course?.content) return { totalModules: 0, completedCount: 0, percent: 0 };
    const totalModules = course.content.length;
    const completedCount = completedModules.length;
    const percent = totalModules === 0 ? 0 : Math.round((completedCount / totalModules) * 100);
    return { totalModules, completedCount, percent };
  }, [course, completedModules]);

  const isSelectedModuleCompleted = selectedModule && completedModules.includes(selectedModule._id);

  const getModuleVideoUrls = (module) => {
    if (!module) return [];
    return (module.urls || []).filter(Boolean);
  };

  const openAiForDocument = async (docId) => {
    if (!docId) return;
    setAiTargetDocId(docId);
    setAiSummary("");
    setAiLoading(true);
    setAiModalOpen(true);
    try {
      const { data } = await axios.get(`/api/ai/describe-document/${docId}`, { withCredentials: true });
      setAiSummary(data?.summary || data?.explanation || "No summary returned.");
    } catch (err) {
      setAiSummary("AI failed to generate a summary. Try again later.");
    } finally {
      setAiLoading(false);
    }
  };

  // --- Handlers for Video Switching ---
  const handleVideoSelect = (moduleIndex, url) => {
    setSelectedVideoByModule(prev => ({
      ...prev,
      [moduleIndex]: url
    }));
  };

  if (!course) return <div className="h-screen grid place-items-center"><Loader /></div>;
  if (isLoading) return <Loader />;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
        
        {/* --- Sidebar Navigation --- */}
        <Sidebar className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <SidebarHeader className="p-4 border-b border-slate-100 dark:border-slate-800">
            <Link to="/learner" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-3 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <h2 className="font-bold text-lg leading-tight line-clamp-2">{course.title}</h2>
            <div className="mt-3">
                <div className="flex justify-between text-xs mb-1.5 font-medium text-slate-500">
                    <span>{courseDerived.percent}% Complete</span>
                    <span>{courseDerived.completedCount}/{courseDerived.totalModules}</span>
                </div>
                <Progress value={courseDerived.percent} className="h-2 bg-slate-100 dark:bg-slate-800" indicatorClassName="bg-emerald-500" />
            </div>
          </SidebarHeader>

          <SidebarContent className="p-2">
            <SidebarGroup>
                <SidebarGroupLabel>Course Modules</SidebarGroupLabel>
                <SidebarGroupContent className="space-y-1">
                    {course.content.map((module, index) => {
                        const isCompleted = completedModules.includes(module._id);
                        const isActive = selectedModuleIndex === index;
                        
                        return (
                            <SidebarMenuButton
                                key={module._id}
                                isActive={isActive}
                                onClick={() => setSelectedModuleIndex(index)}
                                className={cn(
                                    "w-full justify-start h-auto py-3 px-3 transition-all duration-200 rounded-lg border border-transparent",
                                    isActive 
                                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 shadow-sm" 
                                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                                )}
                            >
                                <div className="flex items-start gap-3 w-full">
                                    <div className="mt-0.5 shrink-0">
                                        {isCompleted ? (
                                            <CheckCircle className="h-5 w-5 text-emerald-500 fill-emerald-50" />
                                        ) : isActive ? (
                                            <PlayCircle className="h-5 w-5 text-blue-500 fill-blue-50" />
                                        ) : (
                                            <Circle className="h-5 w-5 text-slate-300" />
                                        )}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <span className={cn("text-sm font-medium block leading-snug", isActive && "font-semibold")}>
                                            {module.title}
                                        </span>
                                        <span className="text-xs text-slate-400 block mt-1 line-clamp-1">
                                            {module.duration || "10m"} {"Hours"}
                                        </span>
                                    </div>
                                </div>
                            </SidebarMenuButton>
                        );
                    })}
                </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>

        {/* --- Main Content Area --- */}
        <SidebarInset className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-950">
            {/* Top Navigation Bar */}
            <header className="h-14 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 bg-white dark:bg-slate-900 z-10">
                <div className="flex items-center gap-3">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="h-5" />
                    <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate max-w-md">
                        {selectedModule?.title}
                    </h3>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        size="sm" 
                        variant={isSelectedModuleCompleted ? "outline" : "default"}
                        className={cn(
                            "gap-2 transition-all",
                            !isSelectedModuleCompleted ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        )}
                        onClick={() => toggleComplete(selectedModule._id)}
                    >
                        {isSelectedModuleCompleted ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                        {isSelectedModuleCompleted ? "Completed" : "Mark Complete"}
                    </Button>
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="max-w-5xl mx-auto p-6 space-y-8">
                    
                    {/* Video Player Section */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedModule?._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            {(() => {
                                const videoUrls = getModuleVideoUrls(selectedModule).filter((u) => isYouTubeUrl(u) || isVimeoUrl(u) || isDirectVideo(u));
                                const selectedVideo = selectedVideoByModule[selectedModuleIndex] || videoUrls[0];

                                if (!selectedVideo) {
                                    return (
                                        <div className="aspect-video w-full rounded-2xl bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400">
                                            <FileVideo className="h-16 w-16 mb-4 opacity-50" />
                                            <p>No video content available for this module.</p>
                                        </div>
                                    );
                                }

                                return (
                                    <div className="space-y-4">
                                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-slate-900/10">
                                            {/* KEY ADDED HERE: Forces React to re-mount the iframe when selectedVideo changes */}
                                            {isYouTubeUrl(selectedVideo) ? (
                                                <iframe 
                                                    key={selectedVideo}
                                                    title="yt" 
                                                    src={getYouTubeEmbed(selectedVideo)} 
                                                    className="absolute inset-0 w-full h-full" 
                                                    allowFullScreen 
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                />
                                            ) : isVimeoUrl(selectedVideo) ? (
                                                <iframe 
                                                    key={selectedVideo}
                                                    title="vimeo" 
                                                    src={getVimeoEmbed(selectedVideo)} 
                                                    className="absolute inset-0 w-full h-full" 
                                                    allowFullScreen 
                                                />
                                            ) : (
                                                <video 
                                                    key={selectedVideo}
                                                    controls 
                                                    className="w-full h-full" 
                                                    src={selectedVideo} 
                                                />
                                            )}
                                        </div>

                                        {videoUrls.length > 1 && (
                                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                                                {videoUrls.map((url, idx) => {
                                                    const isActive = selectedVideo === url;
                                                    return (
                                                        <button 
                                                            key={idx}
                                                            onClick={() => handleVideoSelect(selectedModuleIndex, url)}
                                                            className={cn(
                                                                "shrink-0 w-40 aspect-video rounded-lg overflow-hidden border-2 transition-all relative group cursor-pointer",
                                                                isActive ? "border-blue-500 ring-2 ring-blue-200" : "border-transparent opacity-70 hover:opacity-100"
                                                            )}
                                                        >
                                                            {isYouTubeUrl(url) ? (
                                                                <img src={getYouTubeThumbnail(url)} className="w-full h-full object-cover" alt="Thumbnail" />
                                                            ) : (
                                                                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                                                    <PlayCircle className="text-white h-8 w-8" />
                                                                </div>
                                                            )}
                                                            {isActive && <div className="absolute inset-0 bg-blue-500/20" />}
                                                            {!isActive && <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </motion.div>
                    </AnimatePresence>

                    {/* Content Tabs */}
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                            <TabsTrigger value="overview" className="rounded-lg px-4 py-2">Overview</TabsTrigger>
                            <TabsTrigger value="resources" className="rounded-lg px-4 py-2">Resources ({selectedModule?.resources?.length || 0})</TabsTrigger>
                            <TabsTrigger value="notes" className="rounded-lg px-4 py-2">AI Summary</TabsTrigger>
                        </TabsList>

                        <div className="mt-6 min-h-[200px]">
                            <TabsContent value="overview" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="prose dark:prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{selectedModule?.title}</h2>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                                        {selectedModule?.description || "No description provided for this lesson."}
                                    </p>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-full border">
                                        <PlayCircle className="h-4 w-4" />
                                        {selectedModule?.duration || "N/A"} {"Hours"}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-full border">
                                        <Globe className="h-4 w-4" />
                                        {selectedModule?.type || "Lesson"}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="resources" className="animate-in fade-in slide-in-from-bottom-2">
                                {selectedModule?.resources?.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedModule.resources.map((res, idx) => {
                                            const Icon = res.fileType && fileTypeIcons[res.fileType.toLowerCase()] ? fileTypeIcons[res.fileType.toLowerCase()] : FileText;
                                            return (
                                                <Card key={idx} className="group hover:border-blue-200 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-slate-900">
                                                    <CardContent className="p-4 flex items-center gap-4">
                                                        <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                                            <Icon className="h-6 w-6" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate">{res.fileName || "Untitled Resource"}</h4>
                                                            <p className="text-xs text-slate-500 truncate">{res.description || "Downloadable content"}</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={() => window.open(res.fileUrl, "_blank")}>
                                                                <Maximize2 className="h-4 w-4" />
                                                            </Button>
                                                            <Button 
                                                                size="sm" 
                                                                variant="secondary" 
                                                                className="h-8 text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200 border"
                                                                onClick={() => openAiForDocument(res._id)}
                                                            >
                                                                <MessageSquare className="h-3 w-3 mr-1.5" /> Ask AI
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 border-2 border-dashed rounded-xl bg-slate-50/50">
                                        <FileText className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                                        <p className="text-slate-500">No resources attached to this lesson.</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="notes" className="animate-in fade-in slide-in-from-bottom-2">
                                <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <MessageSquare className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-purple-900 mb-2">AI Study Assistant</h3>
                                        <p className="text-purple-700/80 mb-6 max-w-md mx-auto">
                                            Select a document from the <strong>Resources</strong> tab and click "Ask AI" to generate summaries, quizzes, and explanations.
                                        </p>
                                        <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50" onClick={() => document.querySelector('[value="resources"]').click()}>
                                            Go to Resources
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </SidebarInset>
      </div>

      {/* --- AI Modal --- */}
      <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <span className="text-2xl">✨</span> AI Insight
            </DialogTitle>
            <DialogDescription>
              Analysis generated from your selected document.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] mt-2">
            {aiLoading ? (
                <div className="py-12 flex flex-col items-center gap-3 text-slate-500">
                    <Loader className="h-8 w-8 animate-spin text-purple-600" />
                    <p className="text-sm animate-pulse">Analyzing document content...</p>
                </div>
            ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    {aiSummary}
                </div>
            )}
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAiModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </SidebarProvider>
  );
}