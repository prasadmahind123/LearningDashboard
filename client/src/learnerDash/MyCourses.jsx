// import React, { useState, useEffect } from "react";
// import { BookOpen, Search, Filter, Clock, ArrowRight, LayoutGrid, Layers, Award } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Progress } from "@/components/ui/progress";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useAppContext } from "../context/AppContext.jsx";
// import { Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { Loader } from "../components/Loader.jsx";

// const categories = [
//   "All", "Web Development", "Data Science", "Marketing", "Mobile Development",
//   "Programming", "Cloud Computing", "Design", "Cybersecurity", "Blockchain", "DevOps",
// ];

// const levels = ["All", "Beginner", "Intermediate", "Advanced"];
// const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Rating", "Most Popular"];

// // Animation Variants
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.1 }
//   }
// };

// const cardVariants = {
//   hidden: { opacity: 1, y: 30 },
//   visible: { 
//     opacity: 1, 
//     y: 10,
//     transition: { type: "spring", stiffness: 50, damping: 15 }
//   }
// };

// export default function MyCourses() {
//   const { paths, learner } = useAppContext();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [selectedLevel, setSelectedLevel] = useState("All");
//   const [sortBy, setSortBy] = useState("Featured");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [learnerPaths, setLearnerPaths] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const coursesPerPage = 8;

//   useEffect(() => {
//     setLoading(true);
//     if (!learner?.enrolledPaths?.length || !paths?.length) return;

//     const mapped = learner.enrolledPaths
//       .map((enroll) => {
//         const pathObj = paths.find((p) => p._id === enroll.pathId);
//         if (!pathObj) return null;
//         return {
//           ...pathObj,
//           enrollment: enroll, 
//         };
//       })
//       .filter(Boolean);

//     setLearnerPaths(mapped);
//     setLoading(false);
//   }, [paths, learner]);

//   // Filter Logic (Unchanged)
//   const filtered = learnerPaths.filter((p) => {
    
//     const matchesSearch =
//       p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p.description?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesCategory =
//       selectedCategory === "All" ||
//       p.category?.toLowerCase().replace(/\s|-/g, "") ===
//         selectedCategory.toLowerCase().replace(/\s|-/g, "");

//     const matchesLevel =
//       selectedLevel === "All" || p.level?.toLowerCase() === selectedLevel.toLowerCase();

//     return matchesSearch && matchesCategory && matchesLevel;
//   });

//   // Sort Logic (Unchanged)
//   const sortedPaths = [...filtered].sort((a, b) => {
//     switch (sortBy) {
//       case "Price: Low to High": return (a.price || 0) - (b.price || 0);
//       case "Price: High to Low": return (b.price || 0) - (a.price || 0);
//       case "Rating": return (b.rating || 0) - (a.rating || 0);
//       default: return 0;
//     }
//   });

//   // Pagination Logic (Unchanged)
//   const totalPages = Math.ceil(sortedPaths.length / coursesPerPage);
//   const startIndex = (currentPage - 1) * coursesPerPage;
//   const paginatedPaths = sortedPaths.slice(startIndex, startIndex + coursesPerPage);

//   if (loading) {
//     return (
//       <div className="flex-1 h-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-950 p-6 md:p-8">
//         <Loader />
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 h-full overflow-y-auto bg-slate-50/50 dark:bg-slate-950 p-6 md:p-8">
//       <div className="max-w-7xl mx-auto space-y-8">
        
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
//             <div>
//                 <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                     My Learning Paths
//                 </h1>
//                 <p className="text-muted-foreground mt-1">
//                     Manage your ongoing courses and track your progress.
//                 </p>
//             </div>
//         </div>

//         {/* Floating Glassmorphism Filters */}
//         <motion.section 
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="sticky top-2 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm"
//         >
//           <div className="flex flex-col xl:flex-row gap-4 justify-between">
//             {/* Search */}
//             <div className="relative flex-1 max-w-lg group">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4" />
//               <Input
//                 placeholder="Search your courses..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 bg-slate-50 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 transition-all rounded-xl"
//               />
//             </div>

//             {/* Filters */}
//             <div className="flex flex-wrap gap-3 items-center">
//               <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mr-2">
//                 <Filter className="h-4 w-4" />
//                 <span className="hidden sm:inline">Filters:</span>
//               </div>

//               <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//                 <SelectTrigger className="w-[160px] rounded-xl border-slate-200 bg-white dark:bg-slate-800">
//                   <SelectValue placeholder="Category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {categories.map((category) => (
//                     <SelectItem key={category} value={category}>{category}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <Select value={selectedLevel} onValueChange={setSelectedLevel}>
//                 <SelectTrigger className="w-[130px] rounded-xl border-slate-200 bg-white dark:bg-slate-800">
//                   <SelectValue placeholder="Level" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {levels.map((level) => (
//                     <SelectItem key={level} value={level}>{level}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

//               <Select value={sortBy} onValueChange={setSortBy}>
//                 <SelectTrigger className="w-[160px] rounded-xl border-slate-200 bg-white dark:bg-slate-800">
//                   <SelectValue placeholder="Sort by" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {sortOptions.map((option) => (
//                     <SelectItem key={option} value={option}>{option}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </motion.section>

//         {/* Courses Grid */}
//         <AnimatePresence mode="wait">
//             {paginatedPaths.length === 0 ? (
//               <motion.div 
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className="flex flex-col items-center justify-center py-24 text-center"
//               >
//                 <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-4">
//                     <BookOpen className="h-12 w-12 text-slate-400" />
//                 </div>
//                 <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">No learning paths found</h3>
//                 <p className="text-muted-foreground max-w-md mx-auto">
//                     We couldn't find any courses matching your current filters. Try adjusting your search criteria or browse our catalog for new content.
//                 </p>
//                 <Button variant="outline" className="mt-6" onClick={() => {setSearchTerm(""); setSelectedCategory("All"); setSelectedLevel("All")}}>
//                     Clear Filters
//                 </Button>
//               </motion.div>
//             ) : (
//               <motion.div 
//                 variants={containerVariants}
//                 initial="hidden"
//                 animate="visible"
//                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//               >
//                 {paginatedPaths.map((course) => (
//                   <motion.div key={course._id} variants={cardVariants} whileHover={{ y: -8 }} className="h-full">
//                     <Card className="h-full flex flex-col overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white dark:bg-slate-900 rounded-2xl">
//                       <div className="aspect-[16/9] relative overflow-hidden">
//                         <img
//                           src={course.image || "/placeholder.svg"}
//                           alt={course.title}
//                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                         />
                        
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                        
//                         <div className="absolute bottom-3 left-3 flex gap-2">
//                             <Badge className="bg-white/90 text-slate-800 hover:bg-white backdrop-blur-sm border-0 shadow-sm text-xs font-semibold">
//                                 {course.level}
//                             </Badge>
//                         </div>
//                       </div>

//                       <CardHeader className="pb-2 flex-grow">
//                         <div className="flex justify-between items-start mb-2">
//                              <Badge variant="outline" className="text-[10px] text-muted-foreground border-slate-200">
//                                 {course.category}
//                              </Badge>
//                              {course.enrollment?.progressPercent >= 90 && (
//                                 <Award className="h-4 w-4 text-green-500" />
//                              )}
//                         </div>
//                         <h3 className="font-bold text-lg leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
//                             {course.title}
//                         </h3>
//                       </CardHeader>

//                       <CardContent className="pb-3 space-y-4">
//                         {/* Progress Section */}
//                         <div className="space-y-2">
//                             <div className="flex justify-between text-xs font-medium text-slate-500">
//                                 <span>Progress</span>
//                                 <span className={course.enrollment?.progressPercent === 100 ? "text-green-600" : "text-blue-600"}>
//                                     {Math.round(course.enrollment?.progressPercent || 0)}%
//                                 </span>
//                             </div>
//                             <Progress 
//                                 value={course.enrollment?.progressPercent || 0} 
//                                 className="h-2 bg-slate-100 dark:bg-slate-800" 
//                                 indicatorClassName={course.enrollment?.progressPercent === 100 ? "bg-green-500" : "bg-blue-600"}
//                             />
//                         </div>

//                         <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
//                             <div className="flex items-center text-xs text-muted-foreground">
//                                 <Clock className="h-3 w-3 mr-1.5 text-slate-400" />
//                                 {course.enrollment?.learningHours || 0}h spent
//                             </div>
//                             <div className="flex items-center text-xs text-muted-foreground">
//                                 <Layers className="h-3 w-3 mr-1.5 text-slate-400" />
//                                 {course.enrollment?.completedModules.length || 0}/{course.enrollment?.totalModules.length || 0} mods
//                             </div>
//                         </div>
//                       </CardContent>

//                       <CardFooter className="pt-0 pb-4">
//                         <Button className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 group/btn transition-all" asChild>
//                           <Link to={`/mycourses/${course._id}`}>
//                             <span className="mr-2">Continue Path</span>
//                             <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
//                           </Link>
//                         </Button>
//                       </CardFooter>
//                     </Card>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             )}
//         </AnimatePresence>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center items-center gap-2 pt-8 pb-12">
//             <Button
//               variant="outline"
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="rounded-xl border-slate-200 hover:bg-slate-100 hover:text-slate-900"
//             >
//               Previous
//             </Button>
            
//             <div className="flex gap-1">
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                 <Button
//                     key={page}
//                     variant={currentPage === page ? "default" : "ghost"}
//                     size="sm"
//                     onClick={() => setCurrentPage(page)}
//                     className={`w-9 h-9 rounded-lg ${currentPage === page ? 'bg-blue-600 hover:bg-blue-700' : 'text-slate-500'}`}
//                 >
//                     {page}
//                 </Button>
//                 ))}
//             </div>

//             <Button
//               variant="outline"
//               onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//               disabled={currentPage === totalPages}
//               className="rounded-xl border-slate-200 hover:bg-slate-100 hover:text-slate-900"
//             >
//               Next
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  BookOpen, Search, Filter, Clock, ArrowRight,
  Layers, Award, X, SlidersHorizontal, CheckCircle2,
  TrendingUp, LayoutGrid, List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "../context/AppContext.jsx";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "../components/Loader.jsx";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "All", "Web Development", "Data Science", "Marketing", "Mobile Development",
  "Programming", "Cloud Computing", "Design", "Cybersecurity", "Blockchain", "DevOps",
];

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

const SORT_OPTIONS = [
  { label: "Featured",            value: "featured" },
  { label: "Progress: High",      value: "progress_desc" },
  { label: "Progress: Low",       value: "progress_asc" },
  { label: "Recently Accessed",   value: "recent" },
  { label: "Name: A → Z",         value: "name_asc" },
];

const STATUS_FILTERS = [
  { label: "All",         value: "all" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed",   value: "completed" },
  { label: "Not Started", value: "not_started" },
];

const COURSES_PER_PAGE = 8;

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  exit:   { opacity: 0, transition: { duration: 0.15 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 14 } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const getProgressStatus = (pct) => {
  if (pct >= 100) return "completed";
  if (pct > 0)    return "in_progress";
  return "not_started";
};

const getProgressColor = (pct) => {
  if (pct >= 100) return "bg-emerald-500";
  if (pct >= 50)  return "bg-blue-500";
  return "bg-amber-500";
};

const getStatusBadge = (pct) => {
  if (pct >= 100) return { label: "Completed",   className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400" };
  if (pct > 0)    return { label: "In Progress",  className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400" };
  return           { label: "Not Started",         className: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400" };
};

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY STAT CARD
// ─────────────────────────────────────────────────────────────────────────────

const SummaryCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 flex items-center gap-4">
    <div className={`p-2.5 rounded-xl ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight">{value}</p>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// COURSE CARD (Grid View)
// ─────────────────────────────────────────────────────────────────────────────

const CourseCard = ({ course }) => {
  const pct       = Math.round(course.enrollment?.progressPercent ?? 0);
  const completed = course.enrollment?.completedModules?.length ?? 0;
  const total     = course.enrollment?.totalModules?.length ?? 0;
  const hours     = course.enrollment?.timeSpent
    ? (course.enrollment.timeSpent / 3600).toFixed(1)
    : (course.enrollment?.learningHours ?? 0);

  const status     = getStatusBadge(pct);
  const barColor   = getProgressColor(pct);
  const isComplete = pct >= 100;

  return (
    <motion.div variants={cardVariants} whileHover={{ y: -6 }} className="h-full">
      <Card className="h-full flex flex-col overflow-hidden border-0 shadow-sm hover:shadow-xl transition-shadow duration-300 group bg-white dark:bg-slate-900 rounded-2xl">

        {/* Thumbnail */}
        <div className="aspect-[16/9] relative overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={course.image || "/placeholder.svg"}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Top-right: completed checkmark */}
          {isComplete && (
            <div className="absolute top-2.5 right-2.5 bg-emerald-500 rounded-full p-1 shadow">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
          )}

          {/* Bottom-left: level badge */}
          <div className="absolute bottom-2.5 left-2.5 flex gap-1.5">
            <Badge className="bg-white/90 text-slate-800 border-0 text-[10px] font-semibold shadow-sm backdrop-blur-sm">
              {course.level ?? "—"}
            </Badge>
          </div>
        </div>

        {/* Header */}
        <CardHeader className="pb-2 pt-3 px-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              {course.category ?? "General"}
            </span>
            <Badge variant="outline" className={`text-[10px] px-2 py-0 border ${status.className}`}>
              {status.label}
            </Badge>
          </div>
          <h3 className="font-semibold text-base leading-snug line-clamp-2 text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {course.title}
          </h3>
        </CardHeader>

        {/* Content */}
        <CardContent className="px-4 pb-3 flex-1 flex flex-col justify-end space-y-3">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Progress</span>
              <span className={pct >= 100 ? "text-emerald-600" : pct >= 50 ? "text-blue-600" : "text-amber-600"}>
                {pct}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${barColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              />
            </div>
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1.5 shrink-0 text-slate-400" />
              {hours}h spent
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Layers className="h-3 w-3 mr-1.5 shrink-0 text-slate-400" />
              {completed}/{total} modules
            </div>
          </div>
        </CardContent>

        {/* Footer CTA */}
        <CardFooter className="px-4 pb-4 pt-0">
          <Button
            className="w-full rounded-xl bg-slate-900 hover:bg-blue-600 dark:bg-slate-100 dark:hover:bg-blue-500 dark:text-slate-900 dark:hover:text-white group/btn transition-all duration-200"
            asChild
          >
            <Link to={`/mycourses/${course._id}`}>
              <span className="mr-2">{isComplete ? "Review Path" : "Continue Path"}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COURSE ROW (List View)
// ─────────────────────────────────────────────────────────────────────────────

const CourseRow = ({ course }) => {
  const pct       = Math.round(course.enrollment?.progressPercent ?? 0);
  const completed = course.enrollment?.completedModules?.length ?? 0;
  const total     = course.enrollment?.totalModules?.length ?? 0;
  const hours     = course.enrollment?.timeSpent
    ? (course.enrollment.timeSpent / 3600).toFixed(1)
    : (course.enrollment?.learningHours ?? 0);
  const status    = getStatusBadge(pct);
  const barColor  = getProgressColor(pct);

  return (
    <motion.div variants={cardVariants} layout>
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4 flex items-center gap-4 hover:shadow-md transition-shadow group">
        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
          <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{course.category}</span>
            <Badge variant="outline" className={`text-[10px] px-2 py-0 border ${status.className}`}>{status.label}</Badge>
          </div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div className={`h-full rounded-full ${barColor}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, ease: "easeOut" }} />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 shrink-0">{pct}%</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{hours}h</span>
            <span className="flex items-center gap-1"><Layers className="h-3 w-3" />{completed}/{total} modules</span>
          </div>
        </div>
        <Button size="sm" className="rounded-lg shrink-0" asChild>
          <Link to={`/mycourses/${course._id}`}>
            {pct >= 100 ? "Review" : "Continue"}
            <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function MyCourses() {
  const { paths, learner } = useAppContext();

  const [searchTerm,       setSearchTerm]       = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel,    setSelectedLevel]     = useState("All");
  const [statusFilter,     setStatusFilter]      = useState("all");
  const [sortBy,           setSortBy]            = useState("featured");
  const [currentPage,      setCurrentPage]       = useState(1);
  const [viewMode,         setViewMode]          = useState("grid"); // "grid" | "list"
  const [loading,          setLoading]           = useState(true);

  // ── Build the merged learner+path list ──────────────────────────────────────
  // Fixed: was missing setLoading(false) when enrolledPaths or paths is empty,
  // causing a perpetual spinner. Also uses useMemo instead of useEffect+useState
  // to avoid a redundant render cycle.
  const learnerPaths = useMemo(() => {
    if (!paths?.length) return [];

    const enrollments = learner?.enrolledPaths ?? [];

    return enrollments.reduce((acc, enroll) => {
      const rawId  = enroll.pathId;
      const pathId = typeof rawId === "object" ? rawId?._id?.toString() ?? rawId?.toString() : rawId?.toString();
      const pathObj = paths.find((p) => p._id?.toString() === pathId);
      if (pathObj) acc.push({ ...pathObj, enrollment: enroll });
      return acc;
    }, []);
  }, [paths, learner?.enrolledPaths]);

  // Clear the loading state once paths are available
  useEffect(() => {
    if (paths?.length !== undefined) setLoading(false);
  }, [paths]);

  // Reset to page 1 whenever filters change
  const resetPage = useCallback(() => setCurrentPage(1), []);

  // ── Summary stats ───────────────────────────────────────────────────────────
  const summaryStats = useMemo(() => {
    const total     = learnerPaths.length;
    const completed = learnerPaths.filter(c => (c.enrollment?.progressPercent ?? 0) >= 100).length;
    const avgPct    = total
      ? Math.round(learnerPaths.reduce((s, c) => s + (c.enrollment?.progressPercent ?? 0), 0) / total)
      : 0;
    const totalHours = learnerPaths.reduce((s, c) => {
      const h = c.enrollment?.timeSpent
        ? c.enrollment.timeSpent / 3600
        : (c.enrollment?.learningHours ?? 0);
      return s + h;
    }, 0);
    return { total, completed, avgPct, totalHours: totalHours.toFixed(1) };
  }, [learnerPaths]);

  // ── Filter + sort ───────────────────────────────────────────────────────────
  const processedPaths = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    const filtered = learnerPaths.filter((p) => {
      if (q && !p.title?.toLowerCase().includes(q) && !p.description?.toLowerCase().includes(q)) return false;

      if (selectedCategory !== "All") {
        const norm = (s) => s?.toLowerCase().replace(/[\s-]/g, "");
        if (norm(p.category) !== norm(selectedCategory)) return false;
      }

      if (selectedLevel !== "All" && p.level?.toLowerCase() !== selectedLevel.toLowerCase()) return false;

      if (statusFilter !== "all") {
        const s = getProgressStatus(p.enrollment?.progressPercent ?? 0);
        if (s !== statusFilter) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "progress_desc": return (b.enrollment?.progressPercent ?? 0) - (a.enrollment?.progressPercent ?? 0);
        case "progress_asc":  return (a.enrollment?.progressPercent ?? 0) - (b.enrollment?.progressPercent ?? 0);
        case "recent": {
          const da = new Date(a.enrollment?.lastAccessed ?? 0);
          const db = new Date(b.enrollment?.lastAccessed ?? 0);
          return db - da;
        }
        case "name_asc": return (a.title ?? "").localeCompare(b.title ?? "");
        default: return 0;
      }
    });
  }, [learnerPaths, searchTerm, selectedCategory, selectedLevel, statusFilter, sortBy]);

  // ── Pagination ──────────────────────────────────────────────────────────────
  const totalPages    = Math.ceil(processedPaths.length / COURSES_PER_PAGE);
  const paginatedPaths = processedPaths.slice(
    (currentPage - 1) * COURSES_PER_PAGE,
    currentPage * COURSES_PER_PAGE
  );

  const hasActiveFilters =
    searchTerm || selectedCategory !== "All" || selectedLevel !== "All" || statusFilter !== "all";

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedLevel("All");
    setStatusFilter("all");
    setSortBy("featured");
    setCurrentPage(1);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-950">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex-1 h-[90vh] overflow-y-auto bg-slate-50/50 dark:bg-slate-950 no-scrollbar p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              My Learning Paths
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {summaryStats.total} enrolled · {summaryStats.completed} completed · {summaryStats.totalHours}h total
            </p>
          </div>
        </div>

        {/* ── Summary Stats ── */}
        {learnerPaths.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <SummaryCard icon={BookOpen}    label="Enrolled"   value={summaryStats.total}      color="bg-blue-50 dark:bg-blue-900/20 text-blue-600" />
            <SummaryCard icon={CheckCircle2} label="Completed" value={summaryStats.completed}   color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" />
            <SummaryCard icon={TrendingUp}  label="Avg. Progress" value={`${summaryStats.avgPct}%`} color="bg-amber-50 dark:bg-amber-900/20 text-amber-600" />
            <SummaryCard icon={Clock}       label="Hours Spent" value={`${learner?.totalLearningHours.toFixed(1)}h`} color="bg-purple-50 dark:bg-purple-900/20 text-purple-600" />
          </div>
        )}

        {/* ── Filters Bar ── */}
        <motion.section
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-2 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-sm"
        >
          <div className="flex flex-col xl:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-sm group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4" />
              <Input
                placeholder="Search your courses..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); resetPage(); }}
                className="pl-9 pr-8 bg-slate-50 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-blue-400 rounded-xl text-sm transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => { setSearchTerm(""); resetPage(); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Right side controls */}
            <div className="flex flex-wrap gap-2 items-center">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />

              {/* Status */}
              <div className="flex gap-1 flex-wrap">
                {STATUS_FILTERS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => { setStatusFilter(value); resetPage(); }}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                      statusFilter === value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden sm:block" />

              <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); resetPage(); }}>
                <SelectTrigger className="w-[150px] rounded-xl border-slate-200 bg-white dark:bg-slate-800 text-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={(v) => { setSelectedLevel(v); resetPage(); }}>
                <SelectTrigger className="w-[120px] rounded-xl border-slate-200 bg-white dark:bg-slate-800 text-sm">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v) => { setSortBy(v); resetPage(); }}>
                <SelectTrigger className="w-[160px] rounded-xl border-slate-200 bg-white dark:bg-slate-800 text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>

              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden sm:block" />

              {/* View toggle */}
              <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800"}`}
                  title="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800"}`}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <span className="text-xs text-muted-foreground">Active:</span>
              {searchTerm && (
                <Chip label={`"${searchTerm}"`} onRemove={() => { setSearchTerm(""); resetPage(); }} />
              )}
              {selectedCategory !== "All" && (
                <Chip label={selectedCategory} onRemove={() => { setSelectedCategory("All"); resetPage(); }} />
              )}
              {selectedLevel !== "All" && (
                <Chip label={selectedLevel} onRemove={() => { setSelectedLevel("All"); resetPage(); }} />
              )}
              {statusFilter !== "all" && (
                <Chip label={STATUS_FILTERS.find(s => s.value === statusFilter)?.label} onRemove={() => { setStatusFilter("all"); resetPage(); }} />
              )}
              <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline ml-1">
                Clear all
              </button>
            </div>
          )}
        </motion.section>

        {/* ── Results count ── */}
        {learnerPaths.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-slate-800 dark:text-slate-200">{processedPaths.length}</span> of{" "}
              <span className="font-medium text-slate-800 dark:text-slate-200">{learnerPaths.length}</span> courses
            </p>
          </div>
        )}

        {/* ── Course Grid / List ── */}
        <AnimatePresence mode="wait">
          {paginatedPaths.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-4">
                <BookOpen className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">
                {learnerPaths.length === 0 ? "No courses yet" : "No results found"}
              </h3>
              <p className="text-muted-foreground max-w-sm text-sm">
                {learnerPaths.length === 0
                  ? "You haven't enrolled in any learning paths yet. Browse the catalog to get started."
                  : "Try adjusting your filters or search query to find what you're looking for."}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" className="mt-5 rounded-xl" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" /> Clear Filters
                </Button>
              )}
            </motion.div>
          ) : viewMode === "grid" ? (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {paginatedPaths.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-3"
            >
              {paginatedPaths.map((course) => (
                <CourseRow key={course._id} course={course} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-6 pb-10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-xl"
            >
              Previous
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg ${currentPage === page ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-slate-500"}`}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-xl"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHIP (filter tag)
// ─────────────────────────────────────────────────────────────────────────────

const Chip = ({ label, onRemove }) => (
  <span className="flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-full">
    {label}
    <button onClick={onRemove} className="hover:text-blue-900 dark:hover:text-blue-100 transition-colors">
      <X className="h-3 w-3" />
    </button>
  </span>
);