import React, { useEffect, useMemo, useState, useRef } from "react";
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
import toast, { Toaster } from "react-hot-toast";

// dialog from your UI (used for AI modal)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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

// helpers to detect video URLs and extract youtube id / thumbnail
const isYouTubeUrl = (url) => {
  return /(youtube\.com\/watch\?v=|youtu\.be\/)/i.test(url);
};
const getYouTubeId = (url) => {
  if (!url) return null;
  const ytMatch =
    url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
    ) || [];
  return ytMatch[1] || null;
};
const getYouTubeEmbed = (url) => {
  const id = getYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}`;
};
const getYouTubeThumbnail = (url) => {
  const id = getYouTubeId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
};

const isVimeoUrl = (url) => /vimeo\.com/i.test(url);
const getVimeoEmbed = (url) => {
  // simple embed conversion for vimeo: https://player.vimeo.com/video/{id}
  const m = url.match(/vimeo\.com\/(\d+)/);
  if (m && m[1]) return `https://player.vimeo.com/video/${m[1]}`;
  return null;
};

const isDirectVideo = (url) =>
  /\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i.test(String(url || ""));

export default function CourseDetails() {
  const { paths, learner, axios } = useAppContext();
  const { courseId } = useParams();

  // Find the course
  const course = useMemo(() => paths.find((p) => p._id === courseId), [
    paths,
    courseId,
  ]);

  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const moduleStartTime = useRef(null);
  const heartbeatTimer = useRef(null);

  // AI modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [aiTargetDocId, setAiTargetDocId] = useState(null);

  // Video player selection per module (index -> selected video url)
  const [selectedVideoByModule, setSelectedVideoByModule] = useState({});

  useEffect(() => {
    if (learner && course) {
      const enrollment = learner?.enrolledPaths?.find((p) => p.pathId === course._id);
      if (enrollment?.completedModules) {
        setCompletedModules(enrollment.completedModules);
      }
    }
  }, [learner, course]);

  // Start timer when module changes
  useEffect(() => {
    moduleStartTime.current = new Date();

    const handleBeforeUnload = async () => {
      await sendTimeSpent();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    startHeartbeat();

    return () => {
      stopHeartbeat();
      sendTimeSpent();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModuleIndex]);

  const startHeartbeat = () => {
    stopHeartbeat();
    heartbeatTimer.current = setInterval(() => {
      sendTimeSpent();
    }, 5 * 60 * 1000);
  };

  const stopHeartbeat = () => {
    if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
  };

  const handleSelectModule = (index) => setSelectedModuleIndex(index);

  const selectedModule = useMemo(() => {
    if (course && course.content && selectedModuleIndex < course.content.length) {
      return course.content[selectedModuleIndex];
    }
    return null;
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
      setIsLoading(true);
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
        toast.error("Unmarked");
      } else {
        toast.success("Marked");
      }
    } catch (error) {
      console.log("❌ Failed to update progress:", error);
    } finally {
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
      } finally {
        setIsLoading(false);
      }
    };

    if (learner && courseId) fetchLearnerProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [learner, courseId]);

  const courseDerived = useMemo(() => {
    if (!course?.content) return { totalModules: 0, completedCount: 0, percent: 0 };

    const totalModules = course.content.length;
    const completedCount = completedModules.length;
    const percent = totalModules === 0 ? 0 : Math.round((completedCount / totalModules) * 100);

    return { totalModules, completedCount, percent };
  }, [course, completedModules]);

  const isSelectedModuleCompleted = selectedModule && completedModules.includes(selectedModule._id);

  // video helpers
  const getModuleVideoUrls = (module) => {
    if (!module) return [];
    const urls = module.urls || [];
    // normalize into absolute strings
    return urls.filter(Boolean);
  };

  const openAiForDocument = async (docId) => {
    if (!docId) return;
    setAiTargetDocId(docId);
    setAiSummary("");
    setAiLoading(true);
    setAiModalOpen(true);

    try {
      // call the GET endpoint you specified
      const { data } = await axios.get(`/api/ai/describe-document/${docId}`, { withCredentials: true });
      setAiSummary(data?.summary || data?.explanation || "No summary returned.");
    } catch (err) {
      console.error("AI describe error: ", err);
      setAiSummary("AI failed to generate a summary. Try again later.");
    } finally {
      setAiLoading(false);
    }
  };

  const closeAiModal = () => {
    setAiModalOpen(false);
    setAiLoading(false);
    setAiSummary("");
    setAiTargetDocId(null);
  };

  // video thumbnail click (set selected video for this module index)
  const selectModuleVideo = (moduleIndex, videoUrl) => {
    setSelectedVideoByModule((prev) => ({ ...prev, [moduleIndex]: videoUrl }));
  };

  if (!course) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Course Not Found</CardTitle>
            <CardDescription>The course you are looking for doesn’t exist or is unavailable.</CardDescription>
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <div>
              <div className="text-lg font-semibold leading-none">{course?.title || "Course Title"}</div>
              <div className="text-xs text-muted-foreground">{course?.category || "Category"}</div>
            </div>
          </div>
          <div className="px-2">
            <Progress value={courseDerived.percent} className="h-2" />
            <div className="flex justify-between text-muted-foreground mt-1">
              <span>{courseDerived.completedCount}/{courseDerived.totalModules} modules</span>
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
                  const fileType = module?.resources?.[0]?.fileType?.toLowerCase() || null;
                  const Icon = fileType && fileTypeIcons[fileType] ? fileTypeIcons[fileType] : BookOpen;
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
                          <span className="py-1 text-lg font-medium hover:text-emerald-500">{module.title || `Module ${index + 1}`}</span>
                        </div>
                        {isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarGroupContent>
            </SidebarGroup>
          ) : (
            <div className="p-4 text-sm text-muted-foreground">No modules available for this course.</div>
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
                  src={course?.instructor?.avatarUrl || "/placeholder.svg?height=40&width=40&query=instructor"}
                  alt={course?.instructor?.name || "Instructor"}
                />
                <AvatarFallback>{course?.createdBy?.fullName?.charAt(0) || "I"}</AvatarFallback>
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
          {!selectedModule ? (
            <div className="grid place-items-center h-[70vh]">
              <div className="text-center max-w-md">
                <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-1">Select a Module</h2>
                <p className="text-sm text-muted-foreground">Choose a lesson or resource from the sidebar to view its details here.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {/* resource icons
                        {selectedModule.resources?.map((res, idx) => {
                          const ResIcon =
                            res.fileType && fileTypeIcons[res.fileType.toLowerCase()]
                              ? fileTypeIcons[res.fileType.toLowerCase()]
                              : FileArchive;
                          return <ResIcon color="#e60505" key={idx} className="h-5 w-5 text-muted-foreground" />;
                        })} */}
                        <span className="text-2xl">{selectedModule?.title}</span>
                      </CardTitle>
                      <CardDescription className="text-sm">{selectedModule.description}</CardDescription>
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
                  {/* --- Video area: embed if any video URL present --- */}
                  {(() => {
                    const videoUrls = getModuleVideoUrls(selectedModule).filter((u) => isYouTubeUrl(u) || isVimeoUrl(u) || isDirectVideo(u));
                    if (videoUrls.length === 0) return null;

                    // choose selected video (fallback to first)
                    const selectedVideo = selectedVideoByModule[selectedModuleIndex] || videoUrls[0];

                    // render embed for youtube or vimeo, or <video> for direct links
                    return (
                      <div className="space-y-3">
                        <div className="w-full rounded overflow-hidden bg-black/5">
                          {isYouTubeUrl(selectedVideo) ? (
                            <div className="relative" style={{ paddingTop: "56.25%" }}>
                              <iframe
                                title="video-player"
                                src={getYouTubeEmbed(selectedVideo)}
                                className="absolute top-0 left-0 w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          ) : isVimeoUrl(selectedVideo) ? (
                            <div className="relative" style={{ paddingTop: "56.25%" }}>
                              <iframe
                                title="vimeo-player"
                                src={getVimeoEmbed(selectedVideo)}
                                className="absolute top-0 left-0 w-full h-full"
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          ) : isDirectVideo(selectedVideo) ? (
                            <video controls className="w-full max-h-[480px] object-contain bg-black">
                              <source src={selectedVideo} />
                              Your browser does not support the video tag.
                            </video>
                          ) : null}
                        </div>

                        {/* thumbnails / small selection list */}
                        <div className="flex gap-2 overflow-x-auto py-2">
                          {videoUrls.map((vUrl, vi) => {
                            const thumb = isYouTubeUrl(vUrl) ? getYouTubeThumbnail(vUrl) : null;
                            return (
                              <button
                                key={`vid-${vi}`}
                                onClick={() => selectModuleVideo(selectedModuleIndex, vUrl)}
                                className={`flex-shrink-0 rounded overflow-hidden border ${selectedVideoByModule[selectedModuleIndex] === vUrl || (!selectedVideoByModule[selectedModuleIndex] && vi === 0) ? "ring-2 ring-blue-400" : "border-transparent"}`}
                                style={{ width: 160 }}
                              >
                                {thumb ? (
                                  <img src={thumb} alt="thumb" className="w-full h-24 object-cover" />
                                ) : (
                                  <div className="w-full h-24 bg-muted grid place-items-center text-sm">Play</div>
                                )}
                                <div className="text-xs p-1 truncate">{vUrl}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* --- Documents / Resources list --- */}
                  <div className="rounded-lg border bg-muted/40 p-2">
                    {selectedModule.resources?.length > 0 ? (
                      selectedModule.resources.map((res, idx) => {
                        const ResIcon =
                          res.fileType && fileTypeIcons[res.fileType.toLowerCase()]
                            ? fileTypeIcons[res.fileType.toLowerCase()]
                            : FileArchive;

                        return (
                          <div key={res._id || idx} className="flex items-center gap-3 p-2 hover:bg-accent/50 rounded-md">
                            <ResIcon color="#e60505" className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{res.fileName || res.fileUrl}</div>
                              <div className="text-xs text-muted-foreground truncate">{res.fileType} • {res.format || ""}</div>
                            </div>

                            <div className="flex items-center gap-2">
                              <a href={res.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline">Open</a>

                              <Button size="sm" variant="outline" onClick={() => openAiForDocument(res._id)}>
                                🧠 Ask AI
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-sm text-muted-foreground p-4">No resources available for this module.</div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => toggleComplete(selectedModule._id)}
                      className="cursor-pointer"
                      disabled={selectedModule.locked}
                      variant={isSelectedModuleCompleted ? "secondary" : "default"}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {isSelectedModuleCompleted ? "Mark as Incomplete" : "Mark as Complete"}
                    </Button>

                    {selectedModule.locked && <Badge variant="outline">Locked</Badge>}
                    {isSelectedModuleCompleted && (
                      <Badge variant="secondary" className="gap-2">
                        <CheckCircle className="h-3.5 w-3.5" /> Completed
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Path Details</CardTitle>
                  <CardDescription>Uploaded {course.createdAt?.split?.("T")?.[0]}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Description</div>
                    <p className="text-sm text-muted-foreground">{selectedModule.description}</p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="primary" onClick={() => window.history.back()} className="cursor-pointer">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    {/* <Button
                      variant="outline"
                      onClick={() => {
                        const fileUrl = selectedModule.resources?.[0]?.fileUrl;
                        if (!fileUrl) return;
                        const downloadUrl = fileUrl.replace("/upload/", "/upload/fl_attachment/");
                        window.open(downloadUrl, "_blank");
                      }}
                      className="cursor-pointer"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        {/* --- AI Modal (single global modal) --- */}
        <Dialog open={aiModalOpen} onOpenChange={(open) => { if (!open) closeAiModal(); }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>AI Explanation</DialogTitle>
              <DialogDescription>
                The AI will read the selected document and provide a simplified explanation.
              </DialogDescription>
            </DialogHeader>

            <div className="min-h-[120px]">
              {aiLoading ? (
                <div className="flex items-center justify-center py-10"><Loader /></div>
              ) : (
                <div className="prose max-w-none whitespace-pre-wrap p-2">
                  {aiSummary || "No summary available yet. Click Ask AI on any document to generate a summary."}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeAiModal}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
