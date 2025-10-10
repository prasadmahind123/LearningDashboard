import React, { useEffect, useState } from 'react';
import { useAppContext } from "../context/AppContext.jsx";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  BookOpen,Users,DollarSign,TrendingUp,Plus,Eye,Edit,X,
  Minus,
} from "lucide-react"

// Use teacher.courses from context
const initialcourseFormState = {
  title: "",
  description: "",
  category: "",
  level: "",
  price: "",
  duration: "",
  learningPath: [
    {
      title: "",
      description: "",
      duration: "",
      type: "video",
      files: {
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
  const { teacher ,paths , axios , navigate } = useAppContext();
  // const learningPaths = teacher.createdPaths;
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





  // const learningPaths = teacher?.createdPaths || [];
  useEffect(() => {
    if (!teacher?.createdPaths?.length || !paths?.length) return;

    // Filter and map all paths that teacher has created
    const teacherPaths = paths.filter((p) =>
      teacher.createdPaths.includes(p._id)
    );

    setLearningPaths(teacherPaths);
  }, [teacher, paths]);

// Handler
const handleViewcourse = (course) => {
  const foundCourse = paths.find((p) => p._id === course);

  if (!foundCourse) {
    alert("Course details not found.");
    return;
  }
  setViewingcourse(foundCourse);
  console.log("Viewing course:", foundCourse);
  setIsViewcourseOpen(true);
};

const copyLink = async () => {
  try {
    const url = `${window.location.origin}/courses/learning-path/${viewingcourse?._id}`;
    await navigator.clipboard.writeText(url);
    // show toast or small feedback in your app
    alert("Link copied to clipboard");
  } catch (err) {
    console.error("Failed to copy link", err);
  }
};

  const sections = viewingcourse?.content || viewingcourse?.learningPath || [];
  const createdBy = viewingcourse?.createdBy || viewingcourse?.createdBy || { fullName: "", email: "" };

  const navigateToEdit = (course) => {
    setIsViewcourseOpen(false);
    // adjust the route to your edit page - example:
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
          image : "",
          duration: "",
          type: "video",
          files: {
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
    setEditcourseForm({
      title: editPath.title,
      description: editPath.description || "",
      category: editPath.category,
      level: editPath.level,
      price: editPath.price,
      duration: editPath.duration,
      learningPath: editPath.learningPath || [
        {
          title: "",
          description: "",
          duration: "",
          type: "video",
          files: {
            video: null,
            pdf: null,
            bibtex: null,
            excel: null,
            additionalFiles: [],
          },
        },
      ],
    })
    setIsEditcourseOpen(true)
  }

  const handleCreateLearningPath = async () => {
    try {
      const formData = new FormData();
      
      // Add basic fields
      formData.append('title', courseForm.title);
      formData.append('description', courseForm.description);
      formData.append('category', courseForm.category);
      formData.append('level', courseForm.level);
      formData.append('price', courseForm.price);
      formData.append('duration', courseForm.duration);
      formData.append('isPrivate', courseForm.isPrivate);
      formData.append('code', courseForm.code);
      
      // Handle image file
      const imageInput = document.getElementById('image');
      if (imageInput && imageInput.files && imageInput.files[0]) {
        formData.append('pathImage', imageInput.files[0]);
      }
      
      // Process content and files
      const processedContent = courseForm.learningPath.map((item, index) => {
        const contentItem = {
          title: item.title,
          description: item.description,
          duration: item.duration
        };
        
        // Handle file uploads for each content item
        if (item.files) {
          if (item.files.video) {
            formData.append(`content[${index}][files][video]`, item.files.video);
          }
          if (item.files.pdf) {
            formData.append(`content[${index}][files][pdf]`, item.files.pdf);
          }
          if (item.files.bibtex) {
            formData.append(`content[${index}][files][bibtex]`, item.files.bibtex);
          }
          if (item.files.excel) {
            formData.append(`content[${index}][files][excel]`, item.files.excel);
          }
          if (item.files.additionalFiles && item.files.additionalFiles.length > 0) {
            item.files.additionalFiles.forEach((file) => {
              formData.append(`content[${index}][files][additionalFiles]`, file);
            });
          }
        }
        
        return contentItem;
      });
      
      // Add processed content as JSON
      formData.append('content', JSON.stringify(processedContent));

      const response = await axios.post('/api/learningpaths/addpath', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      if (response.data.success) {
        console.log('Learning path created successfully:', response.data.learningPath);
        setIsCreatecourseOpen(false);
        setcourseForm(initialcourseFormState);
        // Refresh the learning paths
        window.location.reload();
      } else {
        console.error('Error creating learning path:', response.data.message);
        alert('Error creating learning path: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error creating learning path:', error);
      alert('Error creating learning path: ' + error.message);
    }
  };

// Update path in database
const handleUpdatecourse = async () => {
  try {
    const { _id } = editingcourse;
    const formData = new FormData();

    // Basic fields
    formData.append("title", editcourseForm.title);
    formData.append("description", editcourseForm.description);
    formData.append("category", editcourseForm.category);
    formData.append("level", editcourseForm.level);
    formData.append("price", editcourseForm.price);
    formData.append("duration", editcourseForm.duration);
    if (editcourseForm.code && editcourseForm.code.trim() !== editingcourse.code) {
      formData.append("code", editcourseForm.code.trim());
    }

    // Process modules
    const processedContent = editcourseForm.learningPath.map((item, index) => {
      const moduleData = {
        _id: item._id, // keep existing id if present
        title: item.title,
        description: item.description,
        duration: item.duration,
        type: item.type
      };

      // Attach files to FormData
      if (item.files) {
        if (item.files.video) {
          formData.append(`content[${index}][files][video]`, item.files.video);
        }
        if (item.files.pdf) {
          formData.append(`content[${index}][files][pdf]`, item.files.pdf);
        }
        if (item.files.bibtex) {
          formData.append(`content[${index}][files][bibtex]`, item.files.bibtex);
        }
        if (item.files.excel) {
          formData.append(`content[${index}][files][excel]`, item.files.excel);
        }
        if (item.files.additionalFiles?.length) {
          item.files.additionalFiles.forEach((file) => {
            formData.append(`content[${index}][files][additionalFiles]`, file);
          });
        }
      }

      return moduleData;
    });

    // Add the content JSON (metadata only)
    formData.append("content", JSON.stringify(processedContent));

    // Make PUT request as multipart/form-data
    const { data } = await axios.put(
      `/api/learningpaths/update/${_id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      }
    );

    if (data.success) {
      alert("Learning path updated!");
      setIsEditcourseOpen(false);
      window.location.reload(); // Refresh list
    } else {
      alert("Failed to update path");
    }
  } catch (error) {
    console.error("Error updating path:", error);
    alert("Error updating path: " + error.message);
  }
};


const handleDeleteModule = async () => {
    if (!editingcourse || !moduleTitleToDelete) {
      alert("Please select a course and enter a module title to delete.");
      return;
    }

    try {
      const { data } = await axios.delete(`/api/learningpaths/${editingcourse._id}/modules`, {
        data: { title: moduleTitleToDelete } // Send title in the request body
      });

      if (data.success) {
        alert("Module deleted successfully!");
        // Update the form state to reflect the deletion
        setEditcourseForm(prev => ({
            ...prev,
            learningPath: prev.learningPath.filter(m => m.title !== moduleTitleToDelete)
        }));
        setIsDeleteDialogOpen(false);
        setModuleTitleToDelete("");
        window.location.reload(); // Or update state more granularly
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting module:", error);
      alert(error.response?.data?.message || "An error occurred while deleting the module.");
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
        files: {
          video: null,
          pdf: null,
          bibtex: null,
          excel: null,
          additionalFiles: [],
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
// Remove a module
const removeEditLearningPathItem = (index) => {
  setEditcourseForm((prev) => ({
    ...prev,
    learningPath: prev.learningPath.filter((_, i) => i !== index),
  }));
};
  return (
    <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome , {teacher?.fullName || ''}</h1>
            <p className="text-muted-foreground">Manage your paths and track your success</p>
          </div>
          <Dialog open={isCreatecourseOpen} onOpenChange={setIsCreatecourseOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4 cursor-pointer" />
                Create New learning path
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                        <SelectItem value="mobile-development">Mobile Development</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
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
                    value={courseForm.image}
                    onChange={(e) => setcourseForm((prev) => ({ ...prev, image: e.target.value }))}
                    />
                  </div>
                     <div className="space-y-2">
                      <Label htmlFor="isPrivate">isPrivate</Label>
                      <Select
                        value={courseForm.isPrivate}
                        onValueChange={(value) => setcourseForm((prev) => ({ ...prev, isPrivate: value }))}
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
                    <Label className="text-lg font-semibold">course</Label>
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
                          </div>

                          <div className="space-y-3 border-t pt-3">
                            <Label className="text-sm font-medium">learning path Materials</Label>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-xs">Video File (.mp4, .mov, .avi)</Label>
                                <Input
                                  type="file"
                                  accept=".mp4,.mov,.avi,.mkv,.webm"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    updateLearningPathItem(index, "files", {
                                      ...item.files,
                                      video: file,
                                    })
                                  }}
                                  className="text-xs"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs">PDF Document</Label>
                                <Input
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    updateLearningPathItem(index, "files", {
                                      ...item.files,
                                      pdf: file,
                                    })
                                  }}
                                  className="text-xs"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs">BibTeX References (.bib)</Label>
                                <Input
                                  type="file"
                                  accept=".bib,.bibtex"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    updateLearningPathItem(index, "files", {
                                      ...item.files,
                                      bibtex: file,
                                    })
                                  }}
                                  className="text-xs"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs">Excel Spreadsheet (.xlsx, .xls)</Label>
                                <Input
                                  type="file"
                                  accept=".xlsx,.xls,.csv"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    updateLearningPathItem(index, "files", {
                                      ...item.files,
                                      excel: file,
                                    })
                                  }}
                                  className="text-xs"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs">Additional Resources (Images, Documents, etc.)</Label>
                              <Input
                                type="file"
                                multiple
                                accept=".jpg,.jpeg,.png,.gif,.doc,.docx,.ppt,.pptx,.txt,.zip,.rar"
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || [])
                                  updateLearningPathItem(index, "files", {
                                    ...item.files,
                                    additionalFiles: files,
                                  })
                                }}
                                className="text-xs"
                              />
                              <p className="text-xs text-muted-foreground">
                                Supported: Images, Documents, Presentations, Archives
                              </p>
                            </div>

                            {(item.files?.video ||
                              item.files?.pdf ||
                              item.files?.bibtex ||
                              item.files?.excel ||
                              item.files?.additionalFiles?.length > 0) && (
                              <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                                <p className="font-medium mb-1">Uploaded Files:</p>
                                <ul className="space-y-1">
                                  {item.files?.video && <li>📹 Video: {item.files.video.name}</li>}
                                  {item.files?.pdf && <li>📄 PDF: {item.files.pdf.name}</li>}
                                  {item.files?.bibtex && <li>📚 BibTeX: {item.files.bibtex.name}</li>}
                                  {item.files?.excel && <li>📊 Excel: {item.files.excel.name}</li>}
                                  {item.files?.additionalFiles?.map((file, fileIndex) => (
                                    <li key={fileIndex}>📎 {file.name}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
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

          <Dialog open={isEditcourseOpen} onOpenChange={setIsEditcourseOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit learning path: {editingcourse?.title}</DialogTitle>
                <DialogDescription>Update your learning path content and course</DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">                      <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="mobile-development">Mobile Development</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
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
                  {/* <div className="space-y-2">
                    <Label htmlFor="edit-level">Level</Label>
                    <Select
                      value={editcourseForm.level}
                      onValueChange={(value) => setEditcourseForm((prev) => ({ ...prev, level: value }))}
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
                  </div> */}
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
                          </div>

                          <div className="space-y-3 border-t pt-3 bg-muted/20 rounded p-3">
                            <Label className="text-sm font-medium">Module Materials</Label>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-xs">Video File (.mp4, .mov, .avi)</Label>
                                <Input
                                  type="file"
                                  accept=".mp4,.mov,.avi,.mkv,.webm"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    updateEditLearningPathItem(index, "files", {
                                      ...item.files,
                                      video: file,
                                    })
                                  }}
                                  className="text-xs"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs">PDF Document</Label>
                                <Input
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    updateEditLearningPathItem(index, "files", {
                                      ...item.files,
                                      pdf: file,
                                    })
                                  }}
                                  className="text-xs"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs">BibTeX References (.bib)</Label>
                                <Input
                                  type="file"
                                  accept=".bib,.bibtex"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    updateEditLearningPathItem(index, "files", {
                                      ...item.files,
                                      bibtex: file,
                                    })
                                  }}
                                  className="text-xs"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs">Excel Spreadsheet (.xlsx, .xls)</Label>
                                <Input
                                  type="file"
                                  accept=".xlsx,.xls,.csv"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    updateEditLearningPathItem(index, "files", {
                                      ...item.files,
                                      excel: file,
                                    })
                                  }}
                                  className="text-xs"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs">Additional Resources (Images, Documents, etc.)</Label>
                              <Input
                                type="file"
                                multiple
                                accept=".jpg,.jpeg,.png,.gif,.doc,.docx,.ppt,.pptx,.txt,.zip,.rar"
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || [])
                                  updateEditLearningPathItem(index, "files", {
                                    ...item.files,
                                    additionalFiles: files,
                                  })
                                }}
                                className="text-xs"
                              />
                              <p className="text-xs text-muted-foreground">
                                Supported: Images, Documents, Presentations, Archives
                              </p>
                            </div>

                            {(item.files?.video ||
                              item.files?.pdf ||
                              item.files?.bibtex ||
                              item.files?.excel ||
                              item.files?.additionalFiles?.length > 0) && (
                              <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                                <p className="font-medium mb-1">Uploaded Files:</p>
                                <ul className="space-y-1">
                                  {item.files?.video && <li>📹 Video: {item.files.video.name}</li>}
                                  {item.files?.pdf && <li>📄 PDF: {item.files.pdf.name}</li>}
                                  {item.files?.bibtex && <li>📚 BibTeX: {item.files.bibtex.name}</li>}
                                  {item.files?.excel && <li>📊 Excel: {item.files.excel.name}</li>}
                                  {item.files?.additionalFiles?.map((file, fileIndex) => (
                                    <li key={fileIndex}>📎 {file.name}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paths</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teacher?.createdPaths.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${teacher?.revenue || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teacher?.createdPaths.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.85</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My learning path</CardTitle>
            <CardDescription>Manage and track your learning path performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {learningPaths.map((course ) => (
              <div key={course.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-20 h-14 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold truncate">{course.title}</h3>
                    <Badge variant="default">Published</Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">{course.students || 0}</span> students
                    </div>
                    <div>
                      <span className="font-medium">${course.revenue || 0}</span> revenue
                    </div>
                    <div>
                      <span className="font-medium">{course.rating || 0}</span> rating
                    </div>
                    <div>
                      {/* <span className="font-medium">{course.content}</span> lessons */}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Updated {course.lastUpdated}</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleViewcourse(course._id)}>
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEditcourse(course._id)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        {/* View Dialog (replace your old Dialog with this) */}
      <Dialog open={isViewcourseOpen} onOpenChange={setIsViewcourseOpen}>
        <DialogContent className="max-w-5xl w-full mx-4 md:mx-0">
          <div className="flex items-start justify-between gap-4">
            {/* Left header: avatar + title */}
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

            {/* Right header actions */}
            {/* <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={copyLink}>Copy Link</Button>
              <Button size="sm" onClick={() => navigateToEdit(viewingcourse)}>Edit</Button>
              <Button variant="ghost" size="sm" onClick={() => setIsViewcourseOpen(false)}>Close</Button>
            </div> */}
          </div>

          {/* Body */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Modules / Curriculum (main column) */}
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
                              <div className="text-xs text-muted-foreground truncate">{res.fileUrl}</div>
                            </div>
                            <div className="text-xs text-muted-foreground">{res.fileType}</div>
                          </a>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: Instructor / meta card */}
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

          {/* Footer actions */}
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsViewcourseOpen(false)}>Close</Button>
            <Button onClick={() => navigateToEdit(viewingcourse)}>Edit</Button>
          </div>
        </DialogContent>
      </Dialog>
                 

    </div>
    
  )
}
