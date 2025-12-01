import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Star, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from '../context/AppContext.jsx';
import { Link, useSearchParams } from 'react-router-dom'; // Added useSearchParams
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Web Development",
  "Data Science",
  "Marketing",
  "Mobile Development",
  "Programming",
  "Cloud Computing",
  "Design",
  "Cybersecurity",
  "Blockchain",
  "DevOps",
]

const levels = ["All", "Beginner", "Intermediate", "Advanced"]
const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Rating", "Most Popular"]

// Helper to map URL slugs to Category Names
const getCategoryFromSlug = (slug) => {
  if (!slug) return "All";
  const map = {
    "web-dev": "Web Development",
    "data-science": "Data Science",
    "marketing": "Marketing",
    "mobile": "Mobile Development",
    "design": "Design",
    "programming": "Programming",
    "cloud": "Cloud Computing",
    "security": "Cybersecurity",
    "blockchain": "Blockchain",
    "devops": "DevOps"
  };
  return map[slug] || "All";
};

// --- Animated Course Card Component ---
const AnimatedCourseCard = ({ path }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ease: "easeOut" }} 
      whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
      className="overflow-hidden flex flex-col h-full rounded-xl border-2 bg-card transition-all duration-300 p-4">
      <Link to={`/courses/learning-path/${path._id}`}>
        <div className="aspect-video relative overflow-hidden">
          <img
            src={path.image || "/placeholder.svg"}
            alt={path.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          {path.discount && (
            <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600 animate-pulse">
              {path.discount}% OFF
            </Badge>
          )}
          <Badge 
            variant="secondary"
            className="absolute bottom-3 left-3 text-xs bg-white text-black/80 shadow-md">
            {path.category}
          </Badge>
        </div>
      </Link>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-1">
           <CardTitle className="text-xl line-clamp-2 hover:text-primary transition-colors cursor-pointer">
              <Link to={`/courses/learning-path/${path._id}`}>{path.title}</Link>
           </CardTitle>
          <Badge variant="outline" className="text-xs shrink-0">
            {path.level}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 min-h-10">{path.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">{path.rating || 4.5}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{path.learners?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{path.duration || "N/A"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">${path.price || "Free"}</span>
            {path.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">${path.originalPrice}</span>
            )}
          </div>
          <Button size="sm" asChild>
            <Link to={`/courses/learning-path/${path._id}`}>View Path</Link>
          </Button>
        </div>
      </CardFooter>
    </motion.div>
  );
};

export default function CoursesPage() {
  const { paths } = useAppContext();
  const [searchParams] = useSearchParams(); // Hook to read URL params
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [sortBy, setSortBy] = useState("Featured")
  const [currentPage, setCurrentPage] = useState(1)
  const coursesPerPage = 8

  // --- Effect: Read Category from URL ---
  useEffect(() => {
    const categorySlug = searchParams.get("category");
    if (categorySlug) {
      const categoryName = getCategoryFromSlug(categorySlug);
      setSelectedCategory(categoryName);
    } else {
      setSelectedCategory("All");
    }
    // Reset to page 1 when category changes via URL
    setCurrentPage(1);
  }, [searchParams]);

  // --- Filtering Logic ---
  const filtered = paths.filter(path => {
    const matchesSearch = path.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          path.description?.toLowerCase().includes(searchTerm.toLowerCase());

    // Enhanced Category Matching: Remove spaces and dashes for loose comparison
    const normalizedPathCat = path.category?.toLowerCase().replace(/\s|-/g, "") || "";
    const normalizedSelectedCat = selectedCategory.toLowerCase().replace(/\s|-/g, "");

    const matchesCategory = selectedCategory === "All" || normalizedPathCat.includes(normalizedSelectedCat);

    const matchesLevel = selectedLevel === "All" ||
      path.level?.toLowerCase() === selectedLevel.toLowerCase();

    return matchesSearch && matchesCategory && matchesLevel;
  });

  // --- Sorting Logic ---
  const sortedPaths = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "Price: Low to High":
        return (a.price || 0) - (b.price || 0)
      case "Price: High to Low":
        return (b.price || 0) - (a.price || 0)
      case "Rating":
        return (b.rating || 0) - (a.rating || 0)
      default:
        return 0
    }
  })

  // --- Pagination Logic ---
  const totalPages = Math.ceil(sortedPaths.length / coursesPerPage)
  const startIndex = (currentPage - 1) * coursesPerPage
  const paginatedPaths = sortedPaths.slice(startIndex, startIndex + coursesPerPage)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-20 px-4 min-h-[30vh] flex items-center relative overflow-hidden text-white" 
        style={{
          backgroundImage: 'linear-gradient(rgba(227, 229, 232, 0.8), rgba(227, 229, 232, 0.95)), url(/dashboards.png)', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container mx-auto max-w-7xl text-left relative z-10"> 
          <h1 className="text-4xl text-slate-800 md:text-6xl font-extrabold mb-4 animate-in fade-in slide-in-from-top-4 duration-1000">
            {selectedCategory === "All" ? "Explore All Learning Paths" : `${selectedCategory} Paths`}
          </h1>
          <p className="text-xl text-slate-800 max-w-3xl animate-in fade-in slide-in-from-top-6 duration-1000 delay-200">
            Find the perfect path to master new skills with our expertly curated courses.
          </p>
          <div className="text-md text-blue-600 mt-6 font-semibold animate-in fade-in slide-in-from-top-8 duration-1000 delay-300">
            {filtered.length} Learning Paths Available
          </div>
        </div>
      </motion.section>

      {/* Filters and Search */}
      <section className="py-8 px-4 border-b bg-white dark:bg-card sticky top-[64px] z-20 shadow-sm">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between rounded-lg">
            {/* Search */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search learning paths..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full h-10 transition-shadow focus-within:shadow-md"
              />
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 items-center justify-center lg:justify-end">
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] h-10 cursor-pointer bg-background">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="cursor-pointer">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[140px] h-10 cursor-pointer bg-background">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level} className="cursor-pointer">
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] h-10 cursor-pointer bg-background">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option} value={option} className="cursor-pointer">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Learning Paths Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {paginatedPaths.length === 0 ? (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No learning paths found</h3>
              <p className="text-muted-foreground">
                We couldn't find any paths matching "{selectedCategory}" in the "{selectedLevel}" level.
              </p>
              <Button variant="link" onClick={() => {setSelectedCategory("All"); setSelectedLevel("All")}} className="mt-2">
                Clear all filters
              </Button>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedPaths.map((path, index) => (
                  <AnimatedCourseCard key={path._id} path={path} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10 cursor-pointer"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    className="cursor-pointer"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
} 