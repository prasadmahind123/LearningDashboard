
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Upload,
  FileSpreadsheet,
  FileText,
  Download,
  BookOpen,
  Info
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Ensure you have Tabs component or use standard buttons

export default function CreatePath() {
  const { register, handleSubmit, setValue, watch } = useForm();
  const { backendUrl, isTeacher, user } = useAppContext();
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState([]); // For manual modules
  const [importFile, setImportFile] = useState(null); // For bulk import
  const [activeTab, setActiveTab] = useState("manual"); // 'manual' | 'import'

  // --- 1. Manual Module Management ---
  const addModule = () => {
    setModules([
      ...modules,
      { title: "", description: "", duration: "", urls: [], files: [] },
    ]);
  };

  const removeModule = (index) => {
    const updated = [...modules];
    updated.splice(index, 1);
    setModules(updated);
  };

  const updateModule = (index, field, value) => {
    const updated = [...modules];
    updated[index][field] = value;
    setModules(updated);
  };

  const handleModuleFileChange = (index, e) => {
    const files = Array.from(e.target.files);
    const updated = [...modules];
    updated[index].files = files;
    setModules(updated);
  };

  // --- 2. Excel Template Generator (Pure Frontend) ---
  const downloadTemplate = () => {
    // Simple CSV structure for the template
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Module Title,Resource Title,Link,Description\n"
      + "Introduction to React,Official Docs,https://react.dev,Best place to start\n"
      + "Introduction to React,Setup Video,,Video setup guide\n"
      + "State Management,Redux Toolkit,https://redux-toolkit.js.org,For complex state";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "course_import_template.csv"); // Excel can open CSVs
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- 3. Form Submission ---
  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();

    // Basic Info
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("level", data.level);
    formData.append("price", data.price);
    formData.append("duration", data.duration);
    formData.append("code", data.code);
    formData.append("isPrivate", data.isPrivate === "true");

    // Course Image
    if (data.pathImage && data.pathImage[0]) {
      formData.append("pathImage", data.pathImage[0]);
    }

    // --- SMART IMPORT LOGIC ---
    if (activeTab === "import" && importFile) {
      formData.append("importFile", importFile);
    }

    // --- MANUAL MODULE LOGIC ---
    // Even if 'import' is active, we can allow mixing content if you want.
    // Here we append manual content if existing.
    if (modules.length > 0) {
      // 1. Append the JSON structure for modules
      // We strip out the actual 'File' objects from the JSON string 
      // because files must be appended separately to FormData
      const contentMeta = modules.map(m => ({
        title: m.title,
        description: m.description,
        duration: m.duration,
        urls: m.urls,
        // We pass file descriptions to match them on backend
        fileDescriptions: m.files.map(f => ({
            fileName: f.name,
            description: `Resource for ${m.title}`
        }))
      }));

      formData.append("content", JSON.stringify(contentMeta));

      // 2. Append actual files mapped by index
      modules.forEach((module, index) => {
        if (module.files) {
          module.files.forEach((file) => {
            // Fieldname matches: content[0][files]
            formData.append(`content[${index}][files]`, file);
          });
        }
      });
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/learningpaths/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store token
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Learning Path Created Successfully!");
        navigate("/teacher/dashboard");
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to create path";
      
      // Handle the subscription limit error specifically
      if (error.response?.data?.requiresSubscription) {
        toast.error("Limit Reached", {
            description: msg,
            action: {
                label: "Upgrade",
                onClick: () => navigate("/subscription")
            }
        });
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Create Learning Path
          </h1>
          <p className="text-muted-foreground">
            Design a new course or import one from your existing resources.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* 1. Basic Course Details */}
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input {...register("title", { required: true })} placeholder="e.g., Advanced React Patterns" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select onValueChange={(val) => setValue("category", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...register("description")} placeholder="What will students learn?" className="h-24" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input type="number" {...register("price", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label>Level</Label>
                <Select onValueChange={(val) => setValue("level", val)}>
                  <SelectTrigger>
                     <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                  <Label>Duration (Hrs)</Label>
                  <Input {...register("duration")} placeholder="e.g. 10" />
              </div>
              <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <Input type="file" {...register("pathImage")} className="cursor-pointer" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Content Creation Section */}
        <Tabs defaultValue="manual" className="w-full" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Course Content</h2>
              <TabsList>
                <TabsTrigger value="manual" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Manual
                </TabsTrigger>
                <TabsTrigger value="import" className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4" /> Bulk Import
                </TabsTrigger>
              </TabsList>
          </div>

          {/* Tab 1: Manual Creation */}
          <TabsContent value="manual" className="space-y-4">
            {modules.map((module, index) => (
              <Card key={index} className="relative border-dashed border-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => removeModule(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder={`Module ${index + 1} Title`}
                      value={module.title}
                      onChange={(e) => updateModule(index, "title", e.target.value)}
                    />
                    <Input
                      placeholder="Duration (e.g. 2 hours)"
                      value={module.duration}
                      onChange={(e) => updateModule(index, "duration", e.target.value)}
                    />
                  </div>
                  <Textarea
                    placeholder="Module Description"
                    value={module.description}
                    onChange={(e) => updateModule(index, "description", e.target.value)}
                  />
                  <div>
                    <Label className="text-xs mb-1 block">Resources (Video, PDF)</Label>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => handleModuleFileChange(index, e)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button type="button" variant="outline" onClick={addModule} className="w-full border-dashed">
              <Plus className="h-4 w-4 mr-2" /> Add Module
            </Button>
          </TabsContent>

          {/* Tab 2: Smart Import */}
          <TabsContent value="import">
            <Card className="bg-slate-50 dark:bg-slate-900 border-blue-200 dark:border-blue-900">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Upload className="w-5 h-5 text-blue-600" /> 
                        Bulk Import Content
                    </CardTitle>
                    <CardDescription>
                        Upload an Excel (.xlsx) or BibTeX (.bib) file to automatically create modules and resources.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 bg-white dark:bg-slate-950 rounded-lg border">
                        <div className="flex-1">
                            <Label htmlFor="importFile" className="text-base font-medium mb-1 block">Upload File</Label>
                            <Input 
                                id="importFile" 
                                type="file" 
                                accept=".xlsx, .xls, .bib"
                                onChange={(e) => setImportFile(e.target.files[0])}
                                className="max-w-md"
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                Supported formats: Excel, BibTeX
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm text-blue-700 dark:text-blue-300">
                            <Info className="w-4 h-4" />
                            <span>Don't know the format?</span>
                            <Button 
                                type="button" 
                                variant="link" 
                                className="p-0 h-auto font-semibold text-blue-700 underline"
                                onClick={downloadTemplate}
                            >
                                Download Template
                            </Button>
                        </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        <p className="font-semibold mb-2">How it works:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Excel:</strong> Rows are grouped by "Module Title". Resources are added automatically.</li>
                            <li><strong>BibTeX:</strong> All citations are imported as a "References" module.</li>
                            <li>You can mix manual modules with imported content by switching tabs.</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-6">
          <Button type="submit" disabled={loading} size="lg" className="w-full md:w-auto">
            {loading ? "Creating Path..." : "Create Learning Path"}
          </Button>
        </div>
      </form>
      <Toaster/>
    </div>
  );
}