import React, { useEffect, useState } from 'react';
import { useAppContext } from "../context/AppContext.jsx";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast, { Toaster } from 'react-hot-toast';
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  BookOpen, Users, DollarSign, TrendingUp, Plus, Eye, Edit, X,
  Minus, MoreHorizontal, Calendar, Star, Crown, CreditCard, CheckCircle2
} from "lucide-react"
import { Separator } from "@/components/ui/separator.jsx";
import { motion, AnimatePresence } from "framer-motion";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

const initialcourseFormState = {
  title: "",
  description: "",
  category: "",
  level: "",
  price: "",
  duration: "",
  code: "",
  isPrivate: false,
  image: null,
  learningPath: [
    {
      title: "",
      description: "",
      duration: "",
      type: "video",
      urls: [""],
      files: {
        documents: [],
        video: null,
        pdf: null,
        bibtex: null,
        excel: null,
        additionalFiles: [],
      },
    },
  ],
}

export default function TDashboard() {
  const { teacher, paths, axios, navigate, setTeacher } = useAppContext();
  const [isCreatecourseOpen, setIsCreatecourseOpen] = useState(false)
  const [courseForm, setcourseForm] = useState(initialcourseFormState)
  const [isEditcourseOpen, setIsEditcourseOpen] = useState(false)
  const [editingcourse, setEditingcourse] = useState(null)
  const [editcourseForm, setEditcourseForm] = useState(initialcourseFormState)
  const [learningPaths, setLearningPaths] = useState([]);

  const [isViewcourseOpen, setIsViewcourseOpen] = useState(false);
  const [viewingcourse, setViewingcourse] = useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [moduleTitleToDelete, setModuleTitleToDelete] = useState("");

  // Subscription States
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Sync teacher paths
  useEffect(() => {
    if (!teacher?.createdPaths?.length || !paths?.length) return;
    const teacherPaths = paths.filter((p) =>
      teacher.createdPaths.includes(p._id)
    );
    setLearningPaths(teacherPaths);
  }, [teacher, paths]);

  // Calculate subscription usage
  const pathsCreatedCount = learningPaths.length;
  const freePlanLimit = 5;
  const isSubscribed = teacher?.isSubscribed;
  const usagePercent = Math.min((pathsCreatedCount / freePlanLimit) * 100, 100);


  // View course
  const handleViewcourse = (course) => {
    const foundCourse = paths.find((p) => p._id === course);
    if (!foundCourse) {
      alert("Course details not found.");
      return;
    }
    setViewingcourse(foundCourse);
    setIsViewcourseOpen(true);
  };

  const copyLink = async () => {
    try {
      const url = `${window.location.origin}/courses/learning-path/${viewingcourse?._id}`;
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard");
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const sections = viewingcourse?.content || viewingcourse?.learningPath || [];
  const createdBy = viewingcourse?.createdBy || viewingcourse?.createdBy || { fullName: "", email: "" };

  const navigateToEdit = (course) => {
    setIsViewcourseOpen(false);
    navigate(`/teacher/courses/edit/${course._id}`);
  };

  const addLearningPathItem = () => {
    setcourseForm((prev) => ({
      ...prev,
      learningPath: [
        ...prev.learningPath,
        {
          title: "",
          description: "",
          image: "",
          duration: "",
          type: "video",
          urls: [""],
          files: {
            documents: [],
            video: null,
            pdf: null,
            bibtex: null,
            excel: null,
            additionalFiles: [],
          },
        },
      ],
    }))
  }

  const updateLearningPathItem = (index, field, value) => {
    setcourseForm((prev) => ({
      ...prev,
      learningPath: prev.learningPath.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const removeLearningPathItem = (index) => {
    setcourseForm((prev) => ({
      ...prev,
      learningPath: prev.learningPath.filter((_, i) => i !== index),
    }))
  }

  const handleEditcourse = (course) => {
    const editPath = paths.find((p) => p._id === course);
    if (!editPath) {
      alert("Course details not found.");
      return;
    }
    setEditingcourse(editPath)

    const normalizedLearningPath = (editPath.content || []).map((c) => ({
      _id: c._id,
      title: c.title || "",
      description: c.description || "",
      duration: c.duration || "",
      type: c.type || "video",
      urls: Array.isArray(c.urls) ? c.urls : (c.urls ? [c.urls] : [""]),
      files: {
        documents: [],
        video: null,
        pdf: null,
        bibtex: null,
        excel: null,
        additionalFiles: [],
        existingResources: c.resources || [],
      },
    }));

    setEditcourseForm({
      title: editPath.title,
      description: editPath.description || "",
      category: editPath.category,
      level: editPath.level,
      price: editPath.price,
      duration: editPath.duration,
      code: editPath.code || "",
      learningPath: normalizedLearningPath.length ? normalizedLearningPath : [
        {
          title: "",
          description: "",
          duration: "",
          type: "video",
          urls: [""],
          files: {
            documents: [],
            video: null,
            pdf: null,
            bibtex: null,
            excel: null,
            additionalFiles: [],
            existingResources: [],
          },
        },
      ],
    })
    setIsEditcourseOpen(true)
  }

  const handleCreateLearningPath = async () => {
    try {
      const formData = new FormData();
      formData.append('title', courseForm.title || "");
      formData.append('description', courseForm.description || "");
      formData.append('category', courseForm.category || "");
      formData.append('level', courseForm.level || "");
      formData.append('price', courseForm.price || 0);
      formData.append('duration', courseForm.duration || "");
      formData.append('isPrivate', courseForm.isPrivate ? "true" : "false");
      formData.append('code', courseForm.code || "");

      const imageInput = document.getElementById('image');
      if (imageInput && imageInput.files && imageInput.files[0]) {
        formData.append('pathImage', imageInput.files[0]);
      }

      const processedContent = courseForm.learningPath.map((item) => {
        return {
          title: item.title,
          description: item.description,
          duration: item.duration,
          type: item.type,
          urls: Array.isArray(item.urls) ? item.urls.filter(Boolean) : (item.urls ? [item.urls] : []),
          fileDescriptions: (item.files.documents || []).map(doc => ({
            fileName: doc.file.name,
            description: doc.description
          })),
        };
      });

      formData.append('content', JSON.stringify(processedContent));

      courseForm.learningPath.forEach((item, index) => {
        if (!item.files) return;
        Object.keys(item.files).forEach((key) => {
          const value = item.files[key];
          if (!value) return;

          if (key === 'documents' && Array.isArray(value)) {
            value.forEach((doc) => {
              if (doc.file instanceof File) {
                formData.append(`content[${index}][files][${key}]`, doc.file);
              }
            });
          } else if (Array.isArray(value)) {
            value.forEach((file) => {
              if (file instanceof File) {
                formData.append(`content[${index}][files][${key}]`, file);
              }
            });
          } else {
            if (value instanceof File) {
              formData.append(`content[${index}][files][${key}]`, value);
            }
          }
        });
      });

      const response = await axios.post('/api/learningpaths/addpath', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      if (response.data.success) {
        setIsCreatecourseOpen(false);
        setcourseForm(initialcourseFormState);
        window.location.reload();
      } else {
        alert('Error creating learning path: ' + response.data.message);
      }
    } catch (error) {
      // Catch the specific 403 for subscription limit
      if (error.response && error.response.status === 403) {
        setIsCreatecourseOpen(false); // Close the create modal
        setIsSubscriptionModalOpen(true); // Open subscription modal
        toast.error(error.response.data.message || "Limit reached. Please subscribe.");
      } else {
        console.error('Error creating learning path:', error);
        alert('Error creating learning path: ' + (error.message || error));
      }
    }
  };

  // New Function: Handle Subscription Payment
  const handleSubscribe = async () => {
    setIsProcessingPayment(true);
    try {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        const response = await axios.post("/api/teacher/subscribe", {}, { withCredentials: true });
        
        if (response.data.success) {
            toast.success("Subscription Successful! You are now a Premium Instructor.");
            setTeacher(response.data.teacher); // Update context
            setIsSubscriptionModalOpen(false);
        }
    } catch (error) {
        console.error("Subscription error:", error);
        toast.error("Payment failed. Please try again.");
    } finally {
        setIsProcessingPayment(false);
    }
  };

  const handleUpdatecourse = async () => {
    try {
      if (!editingcourse) {
        alert("No course selected to update.");
        return;
      }
      const { _id } = editingcourse;
      const formData = new FormData();

      formData.append("title", editcourseForm.title || "");
      formData.append("description", editcourseForm.description || "");
      formData.append("category", editcourseForm.category || "");
      formData.append("level", editcourseForm.level || "");
      formData.append("price", editcourseForm.price || 0);
      formData.append("duration", editcourseForm.duration || "");
      if (editcourseForm.code && editcourseForm.code.trim() !== editingcourse.code) {
        formData.append("code", editcourseForm.code.trim());
      }

      const processedContent = editcourseForm.learningPath.map((item) => {
        return {
          _id: item._id,
          title: item.title,
          description: item.description,
          duration: item.duration,
          type: item.type,
          urls: Array.isArray(item.urls) ? item.urls.filter(Boolean) : (item.urls ? [item.urls] : []),
          fileDescriptions: (item.files.documents || []).map(doc => ({
            fileName: doc.file.name,
            description: doc.description
          })),
        };
      });

      formData.append("content", JSON.stringify(processedContent));

      editcourseForm.learningPath.forEach((item, index) => {
        if (!item.files) return;
        Object.keys(item.files).forEach((key) => {
          const value = item.files[key];
          if (!value) return;

          if (key === 'documents' && Array.isArray(value)) {
            value.forEach((doc) => {
              if (doc.file instanceof File) {
                formData.append(`content[${index}][files][${key}]`, doc.file);
              }
            });
          } else if (key !== 'existingResources' && Array.isArray(value)) {
            value.forEach((file) => {
              if (file instanceof File) {
                formData.append(`content[${index}][files][${key}]`, file);
              }
            });
          } else if (key !== 'existingResources' && value instanceof File) {
            formData.append(`content[${index}][files][${key}]`, value);
          }
        });
      });

      const { data } = await axios.put(
        `/api/learningpaths/update/${_id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      );

      if (data.success || data.updatedPath || data.message?.includes("updated")) {
        toast.success("Learning path updated successfully!");
        setIsEditcourseOpen(false);
        window.location.reload();
      } else {
        toast.error("Failed to update path");
      }
    } catch (error) {
      console.error("Error updating path:", error);
      toast.error("Error updating path: " + (error.message || error));
    }
  };

  const handleDeleteResource = async (pathId, moduleId, resourceId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      const { data } = await axios.delete(
        `/api/learningpaths/${pathId}/modules/${moduleId}/resources/${resourceId}`,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Document deleted successfully!");
        setEditcourseForm((prev) => ({
          ...prev,
          learningPath: prev.learningPath.map((mod) =>
            mod._id === moduleId
              ? {
                  ...mod,
                  files: {
                    ...mod.files,
                    existingResources: mod.files.existingResources.filter(
                      (r) => r._id !== resourceId
                    ),
                  },
                }
              : mod
          ),
        }));
      } else {
        toast.error("Error deleting file: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document.");
    }
  };

  const handleDeleteModule = async () => {
    if (!editingcourse || !moduleTitleToDelete) {
      alert("Please select a course and enter a module title to delete.");
      return;
    }

    try {
      const { data } = await axios.delete(`/api/learningpaths/${editingcourse._id}/modules`, {
        data: { title: moduleTitleToDelete }
      });

      if (data.success) {
        toast.success("Module deleted successfully!");
        setEditcourseForm(prev => ({
          ...prev,
          learningPath: prev.learningPath.filter(m => m.title !== moduleTitleToDelete)
        }));
        setIsDeleteDialogOpen(false);
        setModuleTitleToDelete("");
        window.location.reload();
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting module:", error);
      toast.success(error.response?.data?.message || "An error occurred while deleting the module.");
    }
  };

  const addEditLearningPathItem = () => {
    setEditcourseForm((prev) => ({
      ...prev,
      learningPath: [
        ...prev.learningPath,
        {
          title: "",
          description: "",
          duration: "",
          type: "video",
          urls: [""],
          files: {
            documents: [],
            video: null,
            pdf: null,
            bibtex: null,
            excel: null,
            additionalFiles: [],
            existingResources: [],
          },
        },
      ],
    }));
  };

  const updateEditLearningPathItem = (index, field, value) => {
    setEditcourseForm((prev) => ({
      ...prev,
      learningPath: prev.learningPath.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const removeEditLearningPathItem = (index) => {
    setEditcourseForm((prev) => ({
      ...prev,
      learningPath: prev.learningPath.filter((_, i) => i !== index),
    }));
  };

  // --- UI Components ---
  const StatsCard = ({ title, value, icon: Icon, colorClass }) => (
    <Card className="border-l-4 shadow-sm hover:shadow-lg transition-all" style={{ borderLeftColor: colorClass }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
            <Icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex-1 h-screen overflow-y-auto no-scrollbar bg-slate-50/50 dark:bg-slate-950 p-6 md:p-8">
        
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome back, {teacher?.fullName || 'Instructor'}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
                Manage your content and track student performance.
                {isSubscribed && (
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200">
                        <Crown className="h-3 w-3 mr-1 fill-amber-500" /> Premium
                    </Badge>
                )}
            </p>
          </motion.div>

          <div className="flex items-center gap-4">
            {!isSubscribed && (
                <div className="hidden md:block w-48">
                    <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
                        <span>Free Plan</span>
                        <span>{pathsCreatedCount} / {freePlanLimit} Paths</span>
                    </div>
                    <Progress value={usagePercent} className="h-2" />
                </div>
            )}

            <Dialog open={isCreatecourseOpen} onOpenChange={setIsCreatecourseOpen}>
                <DialogTrigger asChild>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-md">
                    <Plus className="mr-2 h-5 w-5" />
                    Create New Path
                </Button>
                </DialogTrigger>
                
                {/* ORIGINAL CREATE DIALOG CONTENT */}
                <DialogContent className="max-w-full max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New learning path</DialogTitle>
                    <DialogDescription>Create a comprehensive learning path</DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">learning path Title</Label>
                        <Input
                          id="title"
                          value={courseForm.title}
                          onChange={(e) => setcourseForm((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter course title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={courseForm.category}
                          onValueChange={(value) => setcourseForm((prev) => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="web-development">Web Development</SelectItem>
                            <SelectItem value="data-science">Data Science</SelectItem>
                            <SelectItem value="machine-learning">Machine Learning</SelectItem>
                            <SelectItem value="mobile-development">Mobile Development</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="cyber-security">Cyber Security</SelectItem>
                            <SelectItem value="database">Database</SelectItem>
                            <SelectItem value="devops">DevOps</SelectItem>
                            <SelectItem value="programming">Programming</SelectItem>
                            <SelectItem value="cloud-computing">Cloud Computing</SelectItem>
                            <SelectItem value="Blockchain">Blockchain</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="image">Image</Label>
                        <Input
                        type="file"
                        id="image"
                        onChange={(e) => setcourseForm((prev) => ({ ...prev, image: e.target.value }))}
                        />
                      </div>
                          <div className="space-y-2">
                          <Label htmlFor="isPrivate">isPrivate</Label>
                          <Select
                            value={courseForm.isPrivate ? "true" : "false"}
                            onValueChange={(value) => setcourseForm((prev) => ({ ...prev, isPrivate: value === "true" })) }
                          >
                            <SelectTrigger  className="w-full cursor-pointer">
                              <SelectValue placeholder="Select privacy" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Yes</SelectItem>
                              <SelectItem value="false">No </SelectItem>
                            </SelectContent>
                          </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">learning path Description</Label>
                      <Textarea
                        id="description"
                        value={courseForm.description}
                        onChange={(e) => setcourseForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what students will learn in this course"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="level">Level</Label>
                        <Select
                          value={courseForm.level}
                          onValueChange={(value) => setcourseForm((prev) => ({ ...prev, level: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={courseForm.price}
                          onChange={(e) => setcourseForm((prev) => ({ ...prev, price: e.target.value }))}
                          placeholder="99.99"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Total Duration</Label>
                        <Input
                          id="duration"
                          value={courseForm.duration}
                          onChange={(e) => setcourseForm((prev) => ({ ...prev, duration: e.target.value }))}
                          placeholder="40 hours"
                        />
                      </div>
                    </div>

                      <div className="space-y-3 w-fit">
                        <Label htmlFor="code">learning path Code to free access</Label>
                        <Input
                          id="code"
                          value={courseForm.code}
                          onChange={(e) => setcourseForm((prev) => ({ ...prev, code: e.target.value }))}
                          placeholder="Enter course code"
                        />
                      </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">path</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addLearningPathItem}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Section
                        </Button>
                      </div>

                      <div className="space-y-4 max-h-60 overflow-y-auto">
                        {courseForm.learningPath.map((item, index) => (
                          <Card key={index} className="p-4">
                            <div className="grid gap-4">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">Section {index + 1}</h4>
                                {courseForm.learningPath.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeLearningPathItem(index)}
                                  >
                                    Remove
                                  </Button>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Section Title</Label>
                                  <Input
                                    value={item.title}
                                    onChange={(e) => updateLearningPathItem(index, "title", e.target.value)}
                                    placeholder="Introduction to React"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Content Type</Label>
                                  <Select
                                    value={item.type}
                                    onValueChange={(value) => updateLearningPathItem(index, "type", value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="video">Video Lesson</SelectItem>
                                      <SelectItem value="reading">Reading Material</SelectItem>
                                      <SelectItem value="quiz">Quiz</SelectItem>
                                      <SelectItem value="assignment">Assignment</SelectItem>
                                      <SelectItem value="project">Project</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Description</Label>
                                  <Textarea
                                    value={item.description}
                                    onChange={(e) => updateLearningPathItem(index, "description", e.target.value)}
                                    placeholder="What will students learn in this section?"
                                    rows={2}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Duration</Label>
                                  <Input
                                    value={item.duration}
                                    onChange={(e) => updateLearningPathItem(index, "duration", e.target.value)}
                                    placeholder="2h 30m"
                                  />
                                </div>

                              <div className="space-y-2">
                                  <Label>External Resource URLs</Label>
                                  {item.urls.map((url, urlIndex) => (
                                    <div key={urlIndex} className="flex gap-2 mb-2">
                                      <Input
                                        type="url"
                                        value={url}
                                        onChange={(e) => {
                                          const newUrls = [...item.urls];
                                          newUrls[urlIndex] = e.target.value;
                                          updateLearningPathItem(index, "urls", newUrls);
                                        }}
                                        placeholder="https://youtube.com/... or https://docs.google.com/..."
                                      />
                                      <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => {
                                          const newUrls = item.urls.filter((_, i) => i !== urlIndex);
                                          updateLearningPathItem(index, "urls", newUrls);
                                        }}
                                      >
                                        ✕
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateLearningPathItem(index, "urls", [...item.urls, ""])}
                                  >
                                    + Add Another URL
                                  </Button>
                                </div>
                              </div>

                              <div className="space-y-2 mt-4">
                                  <Label>Upload Documents / Files (PDF, Word, Excel, PPT, BibTex, etc.)</Label>
                                  <Input
                                    type="file"
                                    multiple
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.bib,.bibtex,.mp4,.mov"
                                    onChange={(e) => {
                                      const newFiles = Array.from(e.target.files || []).map(file => ({ file: file, description: "" }));
                                      updateLearningPathItem(index, "files", {
                                        ...item.files,
                                        documents: [...(item.files.documents || []), ...newFiles],
                                      });
                                    }}
                                  />
                                  <div className="mt-2 space-y-2">
                                    {item.files.documents?.map((file, fileIndex) => (
                                      <div
                                        key={file.file.name + fileIndex}
                                        className="flex items-center justify-between border p-2 rounded text-sm"
                                      >
                                        <div className="flex-1">
                                          <span>{file.file.name}</span>
                                          <Input
                                            placeholder="File description..."
                                            className="text-xs h-8 mt-1"
                                            value={file.description}
                                            onChange={(e) => {
                                              const newDescription = e.target.value;
                                              const updatedDocs = item.files.documents.map((doc, i) =>
                                                i === fileIndex ? { ...doc, description: newDescription } : doc
                                              );
                                              updateLearningPathItem(index, "files", {
                                                ...item.files,
                                                documents: updatedDocs,
                                              });
                                            }}
                                          />
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            const updatedDocs = item.files.documents.filter((_, i) => i !== fileIndex);
                                            updateLearningPathItem(index, "files", {
                                              ...item.files,
                                              documents: updatedDocs,
                                            });
                                          }}
                                        >
                                          Remove
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreatecourseOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateLearningPath}>
                      Create learning path
                    </Button>
                  </DialogFooter>
                </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard title="Total Paths" value={teacher?.createdPaths.length || 0} icon={BookOpen} colorClass="#3b82f6" />
            <StatsCard title="Total Revenue" value={`$${teacher?.revenue || 0}`} icon={DollarSign} colorClass="#22c55e" />
            <StatsCard title="Active Courses" value={teacher?.createdPaths.length || 0} icon={TrendingUp} colorClass="#a855f7" />
            <StatsCard title="Students" value={teacher?.enrolledStudents.length || 0} icon={Users} colorClass="#f59e0b" />
        </motion.div>

        {/* Course List */}
        <motion.div variants={itemVariants}>
            <Card className="border-none shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-600" /> My Learning Paths
                    </CardTitle>
                    <CardDescription>Manage and track your learning path performance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence>
                            {learningPaths.map((course) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={course._id} 
                                    className="group flex flex-col md:flex-row items-start md:items-center gap-5 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all bg-white dark:bg-slate-950"
                                >
                                    <div className="relative h-24 w-full md:w-40 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                                        <img src={course.image || "/placeholder.svg"} alt={course.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0 space-y-1.5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant={course.isPrivate ? "secondary" : "default"} className="text-[10px] uppercase tracking-wider px-2 py-0.5">
                                                {course.isPrivate ? "Private" : "Public"}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Calendar className="h-3 w-3" /> {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 truncate pr-4">{course.title}</h3>
                                        
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-2">
                                            <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                                                <Users className="h-3.5 w-3.5 text-blue-500" /> 
                                                <span className="font-semibold text-slate-700 dark:text-slate-300">{course.learners?.length || 0}</span> students
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                                                <DollarSign className="h-3.5 w-3.5 text-green-500" /> 
                                                <span className="font-semibold text-slate-700 dark:text-slate-300">${course.revenue || 0}</span>
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                                                <Star className="h-3.5 w-3.5 text-yellow-500" /> 
                                                <span className="font-semibold text-slate-700 dark:text-slate-300">{course.rating || 0}</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 border-t md:border-t-0 pt-3 md:pt-0">
                                        <Button variant="outline" size="sm" onClick={() => handleViewcourse(course._id)} className="flex-1 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                            <Eye className="mr-2 h-3.5 w-3.5" /> View
                                        </Button>
                                        <Button variant="secondary" size="sm" onClick={() => handleEditcourse(course._id)} className="flex-1 hover:bg-slate-200 transition-colors">
                                            <Edit className="mr-2 h-3.5 w-3.5" /> Edit
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {learningPaths.length === 0 && (
                            <div className="text-center py-16 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                    <BookOpen className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900">No paths created yet</h3>
                                <p className="text-slate-500 max-w-sm mx-auto mt-1 mb-4">Start by creating your first learning path to share your knowledge.</p>
                                <Button onClick={() => setIsCreatecourseOpen(true)}>Create Path</Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
      </motion.main>

      {/* --- SUBSCRIPTION MODAL --- */}
      <Dialog open={isSubscriptionModalOpen} onOpenChange={setIsSubscriptionModalOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden border-0 shadow-2xl">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-center text-white">
                <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                    <Crown className="h-8 w-8 text-amber-300 fill-amber-300" />
                </div>
                <DialogTitle className="text-2xl font-bold text-white mb-2">Upgrade to Premium</DialogTitle>
                <DialogDescription className="text-indigo-100 text-base">
                    Unlock unlimited path creation and advanced analytics.
                </DialogDescription>
            </div>
            
            <div className="p-6 space-y-6">
                <div className="flex justify-center items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">$19.99</span>
                    <span className="text-slate-500">/month</span>
                </div>

                <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                        <span>Create <strong>unlimited</strong> learning paths</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                        <span>Advanced student analytics dashboard</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                        <span>Priority support & verified badge</span>
                    </li>
                </ul>

                <Button 
                    className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg transition-all"
                    onClick={handleSubscribe}
                    disabled={isProcessingPayment}
                >
                    {isProcessingPayment ? (
                        <span className="flex items-center gap-2">Processing...</span>
                    ) : (
                        <span className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Subscribe Now</span>
                    )}
                </Button>
                
                <p className="text-xs text-center text-slate-400">
                    Secure payment via Stripe. Cancel anytime.
                </p>
            </div>
        </DialogContent>
      </Dialog>

      {/* --- ALL OTHER DIALOGS (EXACTLY AS PROVIDED IN ORIGINAL) --- */}
      
      {/* 1. Edit Dialog */}
      <Dialog open={isEditcourseOpen} onOpenChange={setIsEditcourseOpen}>
        <DialogContent className="max-w-full max-h-[100vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit learning path: {editingcourse?.title}</DialogTitle>
            <DialogDescription>Update your learning path content and course</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4"> 
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">learning path Title</Label>
                <Input
                  id="edit-title"
                  value={editcourseForm.title}
                  onChange={(e) => setEditcourseForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter course title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editcourseForm.category}
                  onValueChange={(value) => setEditcourseForm((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-development">Web Development</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="machine-learning">Machine Learning</SelectItem>
                    <SelectItem value="mobile-development">Mobile Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="cyber-security">Cyber Security</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="cloud-computing">Cloud Computing</SelectItem>
                    <SelectItem value="Blockchain">Blockchain</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">learning path Description</Label>
              <Textarea
                id="edit-description"
                value={editcourseForm.description}
                onChange={(e) => setEditcourseForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what students will learn in this course"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editcourseForm.price}
                  onChange={(e) => setEditcourseForm((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="99.99"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Total Duration</Label>
                <Input
                  id="edit-duration"
                  value={editcourseForm.duration}
                  onChange={(e) => setEditcourseForm((prev) => ({ ...prev, duration: e.target.value }))}
                  placeholder="40 hours"
                />
              </div>
              <div className="space-y-3 w-fit">
                <Label htmlFor="edit-code">Free Access Code</Label>
                <Input
                  id="edit-code"
                  value={editcourseForm.code || ""}
                  onChange={(e) => setEditcourseForm((prev) => ({ ...prev, code: e.target.value }))}
                  placeholder="Enter new code or leave blank to keep existing"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">learning path Modules</Label>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={addEditLearningPathItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Module
                  </Button>
                  <Button type="button" variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
                    <X className="mr-2 h-4 w-4" />
                    Delete Section
                </Button>
                </div>
              </div>

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogContent className="max-w-md">
                      <DialogHeader>
                          <DialogTitle>Delete a Module</DialogTitle>
                          <DialogDescription>
                              Enter the exact title of the module you wish to delete. This action cannot be undone.
                          </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                          <Label htmlFor="module-title-to-delete">Module Title</Label>
                          <Input
                              id="module-title-to-delete"
                              value={moduleTitleToDelete}
                              onChange={(e) => setModuleTitleToDelete(e.target.value)}
                              placeholder="e.g., Introduction to React"
                          />
                      </div>
                      <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                          <Button variant="destructive" onClick={handleDeleteModule} disabled={!moduleTitleToDelete.trim()} >Delete Module</Button>
                      </DialogFooter>
                  </DialogContent>
                </Dialog>
                

              <div className="space-y-4 max-h-60 overflow-y-auto">
                {editcourseForm.learningPath.map((item, index) => (
                  <Card key={index} className="p-4 border-2">
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Module {index + 1}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{item.type}</Badge>
                          {editcourseForm.learningPath.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEditLearningPathItem(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Module Title</Label>
                          <Input
                            value={item.title}
                            onChange={(e) => updateEditLearningPathItem(index, "title", e.target.value)}
                            placeholder="Introduction to React"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Content Type</Label>
                          <Select
                            value={item.type}
                            onValueChange={(value) => updateEditLearningPathItem(index, "type", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="video">Video Lesson</SelectItem>
                              <SelectItem value="reading">Reading Material</SelectItem>
                              <SelectItem value="quiz">Quiz</SelectItem>
                              <SelectItem value="assignment">Assignment</SelectItem>
                              <SelectItem value="project">Project</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={item.description}
                            onChange={(e) => updateEditLearningPathItem(index, "description", e.target.value)}
                            placeholder="What will students learn in this module?"
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Duration</Label>
                          <Input
                            value={item.duration}
                            onChange={(e) => updateEditLearningPathItem(index, "duration", e.target.value)}
                            placeholder="2h 30m"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>External Resource URLs</Label>

                          
                          { (item.urls || [""]).map((u, urlIndex) => (
                            <div key={urlIndex} className="flex gap-2 mb-2">
                              <Input
                                type="url"
                                value={u}
                                onChange={(e) => {
                                  const newUrls = Array.isArray(item.urls) ? [...item.urls] : [];
                                  newUrls[urlIndex] = e.target.value;
                                  updateEditLearningPathItem(index, "urls", newUrls);
                                }}
                                placeholder="https://youtube.com/..., https://docs.google.com/... etc."
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => {
                                  const newUrls = (item.urls || []).filter((_, i) => i !== urlIndex);
                                  updateEditLearningPathItem(index, "urls", newUrls);
                                }}
                              >
                                ✕
                              </Button>
                            </div>
                          ))}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateEditLearningPathItem(index, "urls", [...(item.urls || []), ""])}
                          >
                            + Add Another URL
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3 border-t pt-3 bg-muted/20 rounded p-3">
                        <Label className="text-sm font-medium">Module Materials</Label>

                        {/* Show existing resources */}
                        <Label className="text-xs font-medium">Existing Materials</Label>
                        <ul className="space-y-2">
                          {item.files.existingResources?.map((res, ix) => (
                            <li key={res._id || ix} className="flex justify-between items-center border p-2 rounded bg-white dark:bg-slate-800">
                              <div className="flex-1 min-w-0">
                                <a
                                  href={res.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="underline text-sm truncate font-medium"
                                >
                                  {res.fileName || `Resource ${ix + 1}`}
                                </a>
                                <p className="text-xs text-muted-foreground truncate">{res.description || "No description"}</p>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteResource(editingcourse._id, item._id, res._id)}
                              >
                                Delete
                              </Button>
                            </li>
                          ))}
                          {(!item.files.existingResources || item.files.existingResources.length === 0) && (
                            <p className="text-xs text-muted-foreground">No existing materials.</p>
                          )}
                        </ul>
                        <Separator className="my-2" />

                        <div className="space-y-2">
                          <Label className="text-xs">Add New Resources</Label>
                          <Input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.bib,.bibtex,.mp4,.mov"
                            onChange={(e) => {
                              const newFiles = Array.from(e.target.files || []).map(file => ({ file: file, description: "" }));
                              updateEditLearningPathItem(index, "files", {
                                ...item.files,
                                documents: [...(item.files.documents || []), ...newFiles],
                              });
                            }}
                          />
                          <p className="text-xs text-muted-foreground">
                            Supported: Images, Documents, Presentations, Archives
                          </p>
                        </div>

                        {/* List of newly selected files */}
                        <ul className="space-y-2">
                          {item.files.documents?.map((doc, fileIndex) => (
                            <li key={doc.file.name + fileIndex} className="border p-2 rounded bg-white dark:bg-slate-800">
                              <div className="flex items-center justify-between text-sm">
                                <span>{doc.file.name}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const updatedDocs = item.files.documents.filter((_, i) => i !== fileIndex);
                                    updateEditLearningPathItem(index, "files", {
                                      ...item.files,
                                      documents: updatedDocs,
                                    });
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                              <Input
                                placeholder="File description..."
                                className="text-xs h-8 mt-1"
                                value={doc.description}
                                onChange={(e) => {
                                  const newDescription = e.target.value;
                                  const updatedDocs = item.files.documents.map((d, i) =>
                                    i === fileIndex ? { ...d, description: newDescription } : d
                                  );
                                  updateEditLearningPathItem(index, "files", {
                                    ...item.files,
                                    documents: updatedDocs,
                                  });
                                }}
                              />
                            </li>
                          ))}
                        </ul>
                        
                      </div>
                    </div>
                  </Card>
                ))} 
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditcourseOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatecourse}>Update learning path</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. View Dialog */}
      <Dialog open={isViewcourseOpen} onOpenChange={setIsViewcourseOpen}>
        <DialogContent className="max-w-full mx-4 md:mx-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar className="w-14 h-14 ring-2 ring-offset-2 ring-slate-200 dark:ring-slate-700">
                <AvatarFallback className="text-lg">
                  {createdBy.fullName ? createdBy.fullName[0].toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>

              <div>
                <DialogTitle className="text-2xl font-semibold leading-tight">
                  {viewingcourse?.title}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  {viewingcourse?.description}
                </DialogDescription>
                <div className="mt-2 text-xs text-slate-400">
                  {viewingcourse?.category} • {viewingcourse?.level} • {viewingcourse?.totalHours || 0} hrs
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="rounded-lg border bg-white dark:bg-slate-900 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Modules</h3>
                  <div className="text-sm text-muted-foreground">{sections.length} sections</div>
                </div>

                <div className="space-y-3 max-h-[420px] overflow-y-auto modal-scrollbar pr-2">
                  {sections.map((section, idx) => (
                    <details
                      key={idx}
                      className="group bg-slate-50 dark:bg-slate-800 border border-transparent hover:shadow-md rounded-lg p-3 transition"
                    >
                      <summary className="flex justify-between items-start cursor-pointer">
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{section.title}</div>
                          {section.description && (
                            <div className="text-sm text-muted-foreground truncate mt-1">{section.description}</div>
                          )}
                        </div>

                        <div className="ml-4 text-xs text-muted-foreground">
                          {section.resources?.length || 0} resources • {section.duration || "N/A"}
                        </div>
                      </summary>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(section.resources || []).map((res, rIdx) => (
                          <a
                            key={rIdx}
                            href={res.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            <div className="w-10 h-10 flex-none rounded bg-muted grid place-items-center text-xs font-semibold">
                              {res.fileType ? String(res.fileType).slice(0, 3).toUpperCase() : "DOC"}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">{res.fileName}</div>
                              <div className="text-xs text-muted-foreground truncate">{res.description || res.fileType}</div>
                            </div>
                            <div className="text-xs text-muted-foreground">{res.fileType}</div>
                          </a>
                        ))}

                        { (section.urls || []).map((link, li) => (
                          <a key={`url-${li}`} href={link} target="_blank" rel="noreferrer" className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                            <div className="text-sm underline text-blue-600 truncate">{link}</div>
                          </a>
                        )) }
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            <aside>
              <Card className="p-4 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="text-base">{createdBy.fullName?.[0]?.toUpperCase() || "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{createdBy.fullName || "Unknown"}</div>
                      <div className="text-sm text-muted-foreground">{createdBy.email || "No email"}</div>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground space-y-2">
                    <div><strong>Category:</strong> {viewingcourse?.category || "—"}</div>
                    <div><strong>Level:</strong> {viewingcourse?.level || "—"}</div>
                    <div><strong>Total Hours:</strong> {viewingcourse?.duration || 0}</div>
                    <div><strong>Price:</strong> {viewingcourse?.price ? `$${viewingcourse.price}` : "Free"}</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2">
                  <Button onClick={() => navigateToEdit(viewingcourse)} className="w-full">Edit Learning Path</Button>
                  <Button variant="outline" className="w-full" onClick={copyLink}>Share / Copy Link</Button>
                </div>
              </Card>
            </aside>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsViewcourseOpen(false)}>Close</Button>
            <Button onClick={() => navigateToEdit(viewingcourse)}>Edit</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}