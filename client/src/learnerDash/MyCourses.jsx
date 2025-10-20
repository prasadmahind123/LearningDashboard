import React, { useState, useEffect } from "react";
import { BookOpen, Search, Filter, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "../context/AppContext.jsx";
import { Link } from "react-router-dom";

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
];

const levels = ["All", "Beginner", "Intermediate", "Advanced"];
const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Rating", "Most Popular"];

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

    // Map enrolledPaths to their actual path objects and include enrollment info
    const mapped = learner.enrolledPaths
      .map((enroll) => {
        const pathObj = paths.find((p) => p._id === enroll.pathId);
        if (!pathObj) return null;
        return {
          ...pathObj,
          enrollment: enroll, // attach enrollment info
        };
      })
      .filter(Boolean);

    setLearnerPaths(mapped);
  }, [paths, learner]);

  // Filter
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

  // Sort
  const sortedPaths = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "Price: Low to High":
        return (a.price || 0) - (b.price || 0);
      case "Price: High to Low":
        return (b.price || 0) - (a.price || 0);
      case "Rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedPaths.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const paginatedPaths = sortedPaths.slice(startIndex, startIndex + coursesPerPage);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col">
      {/* Filters and Search */}
      <section className="py-8 px-4 border-b">
        <div className="container mx-auto flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by:</span>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] cursor-pointer">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[140px] cursor-pointer">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] cursor-pointer">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 px-14">
        <div className="container mx-auto">
          {paginatedPaths.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No learning paths found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedPaths.map((course) => (
                  <Card key={course._id} className="w-fit overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative">
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-full object-cover cursor-pointer"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">{course.category}</Badge>
                        <Badge variant="outline" className="text-xs">{course.level}</Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className=" text-neutral-500 flex items-center gap-2 text-xs">
                        <span >{course.enrollment?.learningHours || 0} hrs spent</span>
                        <span>|</span>
                        <span>{course.enrollment?.completedModules.length || 0}/{course.enrollment?.totalModules.length || 0} modules completed</span>
                        <span>|</span>
                        <span>{Math.round(course.enrollment?.progressPercent || 0)}% complete</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="flex items-center justify-between w-full">
                        <Button size="sm" asChild>
                          <Link to={`/courses/learning-path/${course._id}`}>
                            View learning path
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
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
  );
}
