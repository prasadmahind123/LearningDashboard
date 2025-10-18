import React, {  useState } from 'react'
import { BookOpen, Clock, Star, Users, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppContext } from '../context/AppContext.jsx'
import { Link } from 'react-router-dom'

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

export default function CoursesPage() {
  const { paths , navigate } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [sortBy, setSortBy] = useState("Featured")
  const [currentPage, setCurrentPage] = useState(1)
  const coursesPerPage = 8

  // Filter learning paths based on search term and category
 const filtered = paths.filter(path => {
  const matchesSearch = path.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        path.description?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesCategory = selectedCategory === "All" ||
    path.category?.toLowerCase().replace(/\s|-/g, "") === selectedCategory.toLowerCase().replace(/\s|-/g, "");

  const matchesLevel = selectedLevel === "All" ||
    path.level?.toLowerCase() === selectedLevel.toLowerCase();

  return matchesSearch && matchesCategory && matchesLevel;
});


  // Sort learning paths
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

  // Pagination
  const totalPages = Math.ceil(sortedPaths.length / coursesPerPage)
  const startIndex = (currentPage - 1) * coursesPerPage
  const paginatedPaths = sortedPaths.slice(startIndex, startIndex + coursesPerPage)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Learning Paths</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover our complete collection of learning paths designed by industry experts
          </p>
          <div className="text-sm text-muted-foreground">{filtered.length} learning paths available</div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search learning paths..."
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
                    <SelectItem key={category} value={category} className="cursor-pointer">
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
                    <SelectItem key={level} value={level} className="cursor-pointer">
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
                    <SelectItem key={option} value={option} className="cursor-pointer">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths Grid */}
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
                {paginatedPaths.map((path) => (
                  <Card key={path._id} className="overflow-hidden hover:shadow-lg transition-shadow mt-0 pt-0">
                    <div className="aspect-video relative">
                      <img
                        src={path.image || "/placeholder.svg"}
                        alt={path.title}
                        className="w-full h-50  cursor-pointer"
                      />
                      {path.discount && (
                        <Badge className="absolute top-2 right-2 bg-green-500">
                          {path.discount}% OFF
                        </Badge>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {path.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {path.level}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{path.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{path.rating || 4.5}</span>
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
                    <CardFooter className="pt-2">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold">${path.price || "Free"}</span>
                          {path.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">${path.originalPrice}</span>
                          )}
                        </div>
                        <Button size="sm" >
                          <Link to={`/courses/learning-path/${path._id}`}>View Path</Link>
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
