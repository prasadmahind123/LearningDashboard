import React , {useState}  from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {  Eye,  BarChart3, Star , Trash } from "lucide-react"
import { useAppContext } from "../context/AppContext.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export default function Tcourses() {
  const {teachersPath , teacher , paths , axios , setTeachersPath} = useAppContext();
  const [isViewcourseOpen, setIsViewcourseOpen] = useState(false);
  const [viewingcourse, setViewingcourse] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  if (!teacher) {
  return <div>Loading teacher data...</div>;
}
  const learningPaths = teachersPath;
  

  const deleteCourse = (course) => {
  setCourseToDelete(course);
  setDeleteDialogOpen(true);
};

const confirmDeleteCourse = async () => {
  if (!courseToDelete) return;
  console.log("Deleting course:", courseToDelete);
  try {
   await axios.delete(`/api/learningpaths/delete/${courseToDelete._id}`, {
   withCredentials: true,
});


    // remove from UI
    setTeachersPath((prev) => prev.filter((c) => c._id !== courseToDelete._id));

    setDeleteDialogOpen(false);
    setCourseToDelete(null);
    alert("Course deleted successfully!");
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Error deleting course");
  }
};
  
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




  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll 
        flex flex-col justify-between">
      <div defaultValue="courses" className="w-full h-full">
        <div value="courses">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">My Learning Paths</h2>
                    <p className="text-muted-foreground">Manage your published and draft learning path</p>
                  </div>
                  <div className="flex items-center space-x-2 ">
                    <div>
                      <span className="w-40">
                        <p className='cursor-pointer' placeholder="Filter by status" />
                      </span>
                       <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent >
                        <SelectItem value="all">All learning paths</SelectItem>
                        <SelectItem value="published">Newly Added</SelectItem>
                        <SelectItem value="draft">Old</SelectItem>
                      </SelectContent>
                    </Select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {learningPaths.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        {/* <Badge
                          className={`absolute top-2 right-2 ${
                            course.status === "Published" ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        >
                          {course.status}
                        </Badge> */}
                      </div>

                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{course.level}</span>
                          <span>{course.duration}</span>
                          <span>{course.content.length || 0}  lessons</span>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Students</p>
                            <p className="font-semibold text-lg">{course.learners?.length}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Revenue</p>
                            <p className="font-semibold text-lg text-green-600">${course.revenue}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Rating</p>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{course.rating || "N/A"} </span>
                              {/* <span className="text-muted-foreground">({course.reviews})</span> */}
                            </div>
                          </div>
                          {/* <div>
                            <p className="text-muted-foreground">Completion</p>
                            <p className="font-semibold">{course.completionRate || 0}%</p>
                          </div> */}
                        </div>

                        <div>
                          {/* <p className="text-sm text-muted-foreground mb-2">7-day enrollment trend</p> */}
                          <div className="flex items-end space-x-1 h-8">
                            {/* {course.enrollmentTrend.map((value, index) => (
                              <div
                                key={index}
                                className="bg-primary rounded-t flex-1"
                                style={{ height: `${(value / Math.max(...course.enrollmentTrend)) * 100}%` }}
                              />
                            ))} */}
                          </div>
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent cursor-pointer" onClick={() => handleViewcourse(course._id)}>
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent cursor-pointer">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            Analytics
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent cursor-pointer" onClick={() => deleteCourse(course)}>
                            <Trash className="h-3 w-3 mr-1" />
                            Delete
                          </Button>

                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
      </div>
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
                  <Button variant="outline" className="w-full" onClick={copyLink}>Share / Copy Link</Button>
                </div>
              </Card>
            </aside>
          </div>
      
          {/* Footer actions */}
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsViewcourseOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
     <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md w-[90%] rounded-2xl shadow-xl bg-white dark:bg-gray-900 transition-all duration-300">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-red-600">
              Delete Learning Path
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {courseToDelete?.title}
            </span>
            ? <br />
            This action{" "}
            <span className="text-red-500 font-bold">cannot be undone</span>.
          </p>

          <DialogFooter className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              className="rounded-xl px-4 py-2"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl px-4 py-2 bg-red-600 hover:bg-red-700"
              onClick={confirmDeleteCourse}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  )
}
