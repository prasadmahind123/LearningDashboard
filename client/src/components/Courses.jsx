import { Clock, Star, Users } from "lucide-react"
import { useAppContext } from '../context/AppContext';
import { Button } from './ui/button';
export default function Courses() {
  const { paths } = useAppContext();


  // useEffect(() => {
  //   if (!learner?.enrolledPaths?.length || !paths?.length) return (
  //     <p>Please Login</p>
  //   )

  //   // Map enrolledPaths to their actual path objects and include enrollment info
  //   const mapped = learner.enrolledPaths
  //     .map((enroll) => {
  //       const pathObj = paths.find((p) => p._id === enroll.pathId);
  //       if (!pathObj) return null;
  //       return {
  //         ...pathObj,
  //         enrollment: enroll, // attach enrollment info
  //       };
  //     })
  //     .filter(Boolean);

  //   setCourses(mapped);
  // }, [paths, learner]);



  return (
    <div>

            
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured paths</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular paths designed by industry experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-2 px-6">
            {paths.map((course) => (
              <div key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow p-6 border border-gray-200 rounded-lg">
                <div className="aspect-video relative">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />

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
                      <span>{course.learners?.length}</span>
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
                    </div>
                    <Button variant={"outline"} >
                      <p href={`/course/${course.id}`}>View path</p>
                    </Button>
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
