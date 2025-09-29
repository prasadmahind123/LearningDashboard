import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";

const initialFormState = {
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
};

export default function LearningPathForm({ mode = "create", courseData, onClose }) {
  const { axios } = useAppContext();
  const [form, setForm] = useState(initialFormState);
  const [editcourseForm, setEditcourseForm] = useState(initialFormState)

  // Load data in edit mode
  useEffect(() => {
    if (mode === "edit" && courseData) {
      setForm({
        title: courseData.title,
        description: courseData.description || "",
        category: courseData.category,
        level: courseData.level,
        price: courseData.price,
        duration: courseData.duration,
        learningPath: courseData.content || courseData.learningPath || [],
      });
    }
  }, [mode, courseData]);

  // Add new module
  const addModule = () => {
    setForm((prev) => ({
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

  // Update module field
  const updateModule = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      learningPath: prev.learningPath.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Update file
  const updateFile = (index, fileType, file) => {
    setForm((prev) => ({
      ...prev,
      learningPath: prev.learningPath.map((item, i) =>
        i === index
          ? { ...item, files: { ...item.files, [fileType]: file } }
          : item
      ),
    }));
  };

  // Update multiple additional files
  const updateAdditionalFiles = (index, files) => {
    setForm((prev) => ({
      ...prev,
      learningPath: prev.learningPath.map((item, i) =>
        i === index ? { ...item, files: { ...item.files, additionalFiles: files } } : item
      ),
    }));
  };

  // Remove module
  const removeModule = (index) => {
    setForm((prev) => ({
      ...prev,
      learningPath: prev.learningPath.filter((_, i) => i !== index),
    }));
  };

  // Submit create/update
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      
      // Add basic fields
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('level', form.level);
      formData.append('price', form.price);
      formData.append('duration', form.duration);
      
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b">
        <h2 className="text-2xl font-bold">
          {mode === "create" ? "🚀 Create New Learning Path" : "✏️ Edit Learning Path"}
        </h2>
        <p className="text-muted-foreground">
          {mode === "create"
            ? "Fill in the details below to publish a new learning path."
            : "Update your course details and save changes."}
        </p>
      </div>

      {/* Title & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Course Title</Label>
          <Input
            className="mt-1"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
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
        <div>
          <Label>Category</Label>
          <Select
            value={form.category}
            onValueChange={(value) => setForm({ ...form, category: value })}
          >
            <SelectTrigger className="mt-1">
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

      {/* Modules */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h4 className="text-lg font-semibold">📚 Modules</h4>
          <Button variant="outline" size="sm" onClick={addModule}>
            <Plus className="h-4 w-4 mr-1" /> Add Module
          </Button>
        </div>

        {form.learningPath.map((module, index) => (
          <Card key={index} className="p-5 shadow-sm border hover:shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h5 className="font-medium text-slate-800">Module {index + 1}</h5>
              {form.learningPath.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => removeModule(index)}
                >
                  <X className="h-4 w-4" /> Remove
                </Button>
              )}
            </div>

            {/* Title & Type */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <Input
                placeholder="Module Title"
                value={module.title}
                onChange={(e) => updateModule(index, "title", e.target.value)}
              />
              <Select
                value={module.type}
                onValueChange={(value) => updateModule(index, "type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder="Module Description"
              className="mb-2"
              value={module.description}
              onChange={(e) => updateModule(index, "description", e.target.value)}
            />
            <Input
              placeholder="Duration (e.g. 2h)"
              className="mb-3"
              value={module.duration}
              onChange={(e) => updateModule(index, "duration", e.target.value)}
            />

            {/* File Uploads */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => updateFile(index, "video", e.target.files[0])}
              />
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => updateFile(index, "pdf", e.target.files[0])}
              />
              <Input
                type="file"
                accept=".bib,.bibtex"
                onChange={(e) => updateFile(index, "bibtex", e.target.files[0])}
              />
              <Input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => updateFile(index, "excel", e.target.files[0])}
              />
              <Input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.gif,.doc,.docx,.ppt,.pptx,.txt,.zip,.rar"
                onChange={(e) =>
                  updateAdditionalFiles(index, Array.from(e.target.files || []))
                }
              />
            </div>

            {/* Uploaded Files Preview */}
            {(module.files.video ||
              module.files.pdf ||
              module.files.bibtex ||
              module.files.excel ||
              module.files.additionalFiles.length > 0) && (
              <div className="mt-3 p-3 bg-muted/50 rounded text-xs">
                <p className="font-medium mb-2">Uploaded Files:</p>
                <ul className="space-y-1">
                  {module.files.video && <li>📹 {module.files.video.name}</li>}
                  {module.files.pdf && <li>📄 {module.files.pdf.name}</li>}
                  {module.files.bibtex && <li>📚 {module.files.bibtex.name}</li>}
                  {module.files.excel && <li>📊 {module.files.excel.name}</li>}
                  {module.files.additionalFiles.map((file, i) => (
                    <li key={i}>📎 {file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {mode === "create" ? "Create Path" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
