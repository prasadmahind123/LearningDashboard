import React from 'react'
import { Clock, Star, Users } from "lucide-react"
export default function Courses() {
    const courses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive course.",
    price: 99.99,
    originalPrice: 199.99,
    rating: 4.8,
    students: 15420,
    duration: "40 hours",
    level: "Beginner",
    image: "./course-bootcamp.png",
  },
  {
    id: 2,
    title: "Data Science with Python",
    description: "Master data analysis, machine learning, and visualization with Python.",
    price: 129.99,
    originalPrice: 249.99,
    rating: 4.9,
    students: 8930,
    duration: "35 hours",
    level: "Intermediate",
    image: "./course-dataScience.jpg",
  },
  {
    id: 3,
    title: "Digital Marketing Masterclass",
    description: "Learn SEO, social media marketing, email marketing, and paid advertising.",
    price: 79.99,
    originalPrice: 159.99,
    rating: 4.7,
    students: 12340,
    duration: "25 hours",
    level: "Beginner",
    image: "./course-digitalMarket.jpg",
  },
  {
    id: 4,
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile apps for iOS and Android using React Native.",
    price: 149.99,
    originalPrice: 299.99,
    rating: 4.6,
    students: 6780,
    duration: "50 hours",
    level: "Advanced",
    image: "./course-mobileApp.webp",
  },
]
  return (
    <div>
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Continue Learning...</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start from where you left
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-2 px-6">
            {courses.map((course) => (
              <div key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow p-6 border border-gray-200 rounded-lg">
                <div className="aspect-video relative">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <p className="absolute top-2 right-2 bg-green-500 rounded px-1 py-0 text-sm">
                    {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                  </p>
                </div>
                <h3 className="pb-2">
                  <p className="text-lg line-clamp-2">{course.title}</p>
                  <p className="line-clamp-2 text-gray-500">{course.description}</p>
                </h3>
                <div className="pb-2">
                  <div className="flex items-center gap-4 text-sm  mb-2 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  <p variant="secondary" className='bg-gray-300 w-fit px-1.5 py-0.5 rounded-2xl text-sm text-gray-500'>{course.level}</p>
                </div>
                <div className="pt-2">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">${course.price}</span>
                      <span className="text-sm text-muted-foreground line-through">${course.originalPrice}</span>
                    </div>
                    <button size="sm"  className='cursor-pointer w-30 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all group active:w-11 active:h-11 active:rounded-full active:duration-300 ease-in-out'>
                      <p href={`/course/${course.id}`}>View course</p>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>      
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured courses</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular courses designed by industry experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-2 px-6">
            {courses.map((course) => (
              <div key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow p-6 border border-gray-200 rounded-lg">
                <div className="aspect-video relative">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <p className="absolute top-2 right-2 bg-green-500 rounded px-1 py-0 text-sm">
                    {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                  </p>
                </div>
                <h3 className="pb-2">
                  <p className="text-lg line-clamp-2">{course.title}</p>
                  <p className="line-clamp-2 text-gray-500">{course.description}</p>
                </h3>
                <div className="pb-2">
                  <div className="flex items-center gap-4 text-sm  mb-2 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  <p variant="secondary" className='bg-gray-300 w-fit px-1.5 py-0.5 rounded-2xl text-sm text-gray-500'>{course.level}</p>
                </div>
                <div className="pt-2">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">${course.price}</span>
                      <span className="text-sm text-muted-foreground line-through">${course.originalPrice}</span>
                    </div>
                    <button size="sm"  className='cursor-pointer w-30 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all group active:w-11 active:h-11 active:rounded-full active:duration-300 ease-in-out'>
                      <p href={`/course/${course.id}`}>View course</p>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
