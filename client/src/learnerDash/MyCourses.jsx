import React, { useState, useEffect } from "react";
import { BookOpen, Search, Filter, Clock, ArrowRight, LayoutGrid, Layers, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "../context/AppContext.jsx";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  "All", "Web Development", "Data Science", "Marketing", "Mobile Development",
  "Programming", "Cloud Computing", "Design", "Cybersecurity", "Blockchain", "DevOps",
];

const levels = ["All", "Beginner", "Intermediate", "Advanced"];
const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Rating", "Most Popular"];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 1, y: 30 },
  visible: { 
    opacity: 1, 
    y: 10,
    transition: { type: "spring", stiffness: 50, damping: 15 }
  }
};

export default function MyCourses() {
  const { paths, learner } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [learnerPaths, setLearnerPaths] = useState([]);
  const coursesPerPage = 8;

  useEffect(() => {
    if (!learner?.enrolledPaths?.length || !paths?.length) return;

    const mapped = learner.enrolledPaths
      .map((enroll) => {
        const pathObj = paths.find((p) => p._id === enroll.pathId);
        if (!pathObj) return null;
        return {
          ...pathObj,
          enrollment: enroll, 
        };
      })
      .filter(Boolean);

    setLearnerPaths(mapped);
  }, [paths, learner]);

  // Filter Logic (Unchanged)
  const filtered = learnerPaths.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      p.category?.toLowerCase().replace(/\s|-/g, "") ===
        selectedCategory.toLowerCase().replace(/\s|-/g, "");

    const matchesLevel =
      selectedLevel === "All" || p.level?.toLowerCase() === selectedLevel.toLowerCase();

    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Sort Logic (Unchanged)
  const sortedPaths = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "Price: Low to High": return (a.price || 0) - (b.price || 0);
      case "Price: High to Low": return (b.price || 0) - (a.price || 0);
      case "Rating": return (b.rating || 0) - (a.rating || 0);
      default: return 0;
    }
  });

  // Pagination Logic (Unchanged)
  const totalPages = Math.ceil(sortedPaths.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const paginatedPaths = sortedPaths.slice(startIndex, startIndex + coursesPerPage);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50/50 dark:bg-slate-950 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    My Learning Paths
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage your ongoing courses and track your progress.
                </p>
            </div>
        </div>

        {/* Floating Glassmorphism Filters */}
        <motion.section 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-2 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm"
        >
          <div className="flex flex-col xl:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-lg group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4" />
              <Input
                placeholder="Search your courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-50 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 transition-all rounded-xl"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mr-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters:</span>
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[160px] rounded-xl border-slate-200 bg-white dark:bg-slate-800">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[130px] rounded-xl border-slate-200 bg-white dark:bg-slate-800">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] rounded-xl border-slate-200 bg-white dark:bg-slate-800">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.section>

        {/* Courses Grid */}
        <AnimatePresence mode="wait">
            {paginatedPaths.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-4">
                    <BookOpen className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">No learning paths found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    We couldn't find any courses matching your current filters. Try adjusting your search criteria or browse our catalog for new content.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => {setSearchTerm(""); setSelectedCategory("All"); setSelectedLevel("All")}}>
                    Clear Filters
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {paginatedPaths.map((course) => (
                  <motion.div key={course._id} variants={cardVariants} whileHover={{ y: -8 }} className="h-full">
                    <Card className="h-full flex flex-col overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white dark:bg-slate-900 rounded-2xl">
                      <div className="aspect-[16/9] relative overflow-hidden">
                        <img
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                        
                        <div className="absolute bottom-3 left-3 flex gap-2">
                            <Badge className="bg-white/90 text-slate-800 hover:bg-white backdrop-blur-sm border-0 shadow-sm text-xs font-semibold">
                                {course.level}
                            </Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-2 flex-grow">
                        <div className="flex justify-between items-start mb-2">
                             <Badge variant="outline" className="text-[10px] text-muted-foreground border-slate-200">
                                {course.category}
                             </Badge>
                             {course.enrollment?.progressPercent >= 90 && (
                                <Award className="h-4 w-4 text-green-500" />
                             )}
                        </div>
                        <h3 className="font-bold text-lg leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {course.title}
                        </h3>
                      </CardHeader>

                      <CardContent className="pb-3 space-y-4">
                        {/* Progress Section */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium text-slate-500">
                                <span>Progress</span>
                                <span className={course.enrollment?.progressPercent === 100 ? "text-green-600" : "text-blue-600"}>
                                    {Math.round(course.enrollment?.progressPercent || 0)}%
                                </span>
                            </div>
                            <Progress 
                                value={course.enrollment?.progressPercent || 0} 
                                className="h-2 bg-slate-100 dark:bg-slate-800" 
                                indicatorClassName={course.enrollment?.progressPercent === 100 ? "bg-green-500" : "bg-blue-600"}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1.5 text-slate-400" />
                                {course.enrollment?.learningHours || 0}h spent
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <Layers className="h-3 w-3 mr-1.5 text-slate-400" />
                                {course.enrollment?.completedModules.length || 0}/{course.enrollment?.totalModules.length || 0} mods
                            </div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0 pb-4">
                        <Button className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 group/btn transition-all" asChild>
                          <Link to={`/courses/learning-path/${course._id}`}>
                            <span className="mr-2">Continue Path</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-8 pb-12">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-xl border-slate-200 hover:bg-slate-100 hover:text-slate-900"
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
                    className={`w-9 h-9 rounded-lg ${currentPage === page ? 'bg-blue-600 hover:bg-blue-700' : 'text-slate-500'}`}
                >
                    {page}
                </Button>
                ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-xl border-slate-200 hover:bg-slate-100 hover:text-slate-900"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}