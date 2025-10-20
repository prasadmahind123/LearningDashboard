import { useState , useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Clock, Star, Users, Globe, Award, ShoppingCart } from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";

export default function CourseID() {
  const { paths , learner , axios } = useAppContext();
  const { id } = useParams();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");


  const path = paths.find((p) => p._id === id);

const [enrollment, setEnrollment] = useState(null);

useEffect(() => {
  if (!learner || !path) return;

  const enrolled = learner.enrolledPaths?.find(
    (e) => e.pathId === path._id
  );

  if (enrolled) {
    setEnrollment(enrolled);
    setIsEnrolled(true);
  } else {
    setEnrollment(null);
    setIsEnrolled(false);
  }
}, [learner, path]);

  if (!path) {
    return <div className="p-6 text-red-500">Course not found</div>;
  }

  const handleEnroll = async () => {
  if (learner == null) {
    setErrorMsg("You must be logged in to enroll.");
    return;
  }

  try {
    // If the course is private or paid, check access code first
    if ((path.isPrivate || (path.price && path.price > 0)) && accessCode) {
      if (accessCode.trim() !== path.code) {
        setErrorMsg("Invalid access code");
        return;
      }
    }

    // If course is paid and no access code, redirect for payment
    if (path.price && path.price > 0 && !accessCode) {
      alert(`This course costs $${path.price}. Redirecting to payment...`);
      // 👉 integrate Stripe/PayPal/Razorpay here
      return;
    }

    // Send enrollment request to backend
    const response = await axios.post(
      "http://localhost:3000/api/learner/enroll-path",
      { pathId: path._id },
      { withCredentials: true }
    );

    if(response.data.success){
      setIsEnrolled(true);
    }else{
      setErrorMsg(response.data.message || "Enrollment failed");
    }


    setIsEnrolled(true);
    setErrorMsg("");
    alert(
      `You have been enrolled in ${path.title}${
        accessCode ? " using access code!" : "!"
      }`
    );
  } catch (error) {
    console.error("Enrollment error:", error);
    setErrorMsg(
      error.response?.data?.message || "Failed to enroll. Please try again."
    );
  }
};


  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Details */}
            <div className="lg:col-span-2 space-y-6">
              <Badge className="bg-blue-400">Bestseller</Badge>
              <h1 className="text-3xl md:text-4xl font-bold">{path.title}</h1>
              <p className="text-lg md:text-xl text-slate-300">{path.description}</p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{path.rating || "4.5"}</span>
                  <span className="text-slate-300">
                    ({path.learners?.length || 0} students)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{path.duration || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{path.level || "All levels"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>{path.language || "English"}</span>
                </div>
              </div>

              {/* Instructor quick info */}
              <div className="mt-4 flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{path.createdBy?.fullName?.[0] || "I"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{path.createdBy?.fullName || "Unknown Instructor"}</p>
                  <p className="text-sm text-slate-300">{path.createdBy?.expertise || "Expert"}</p>
                </div>
              </div>
            </div>

            {/* Right: Preview Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 h-full flex flex-col">
                <div className="aspect-video w-full">
                  <img
                    src={path.image || "/placeholder.svg"}
                    alt={path.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <CardContent className="flex-1 flex flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-3xl font-bold">${path.price || "Free"}</span>
                      {path.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          ${path.originalPrice}
                        </span>
                      )}
                    </div>
               {isEnrolled  ? (
                  <Button className="w-full mb-4" asChild>
                    <Link to={`/mycourses/${path._id}`}>Go to Course</Link>
                  </Button>
                ) : (
                  <>
                    {/* Always show code box if private OR paid */}
                    {(path.isPrivate || (path.price && path.price > 0)) && (
                      <input
                        type="text"
                        placeholder="Enter access code (if you have one)"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        className="w-full mb-3 border rounded p-2"
                      />
                    )}
                    {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}

                    <Button className="w-full mb-4" onClick={handleEnroll}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {path.price && path.price > 0 ? "Buy Now / Use Code" : "Enroll Now"}
                    </Button>
                  </>
                )}


                    <p className="text-center text-sm text-muted-foreground mb-4">
                      30-Day Money-Back Guarantee
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum + Instructor */}
      {path.content && (
        <section className="py-12">
          <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Curriculum */}
            <div className="lg:col-span-2 ">
              <Card className="h-full py-4">
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                  <CardDescription>
                    {path.content.length} sections •{" "}
                    {path.content.reduce((acc, s) => acc + (s.resources?.length || 0), 0)} lessons
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {path.content.map((section, index) => (
                    <div key={index} className="border rounded-lg p-4 flex justify-between items-center">
                      <h4 className="font-semibold">{section.title}</h4>
                      <div className="text-sm text-muted-foreground">
                        {section.resources?.length || 0} lessons • {section.duration || "N/A"}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Instructor */}
            <div>
              <Card className="h-full py-4">
                <CardHeader>
                  <CardTitle>Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback>
                        {path?.createdBy?.fullName ? path.createdBy.fullName[0].toUpperCase() : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="text-lg md:text-xl font-semibold mb-1">
                        {path?.createdBy?.fullName || "Unknown Instructor"}
                      </h4>
                      <p className="text-muted-foreground mb-3">
                        {path?.createdBy?.email || "No email provided"}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">4.8</span>
                          </div>
                          <p className="text-muted-foreground">Instructor Rating</p>
                        </div>
                        <div>
                          <div className="font-semibold mb-1">{path.learners?.length || 0}</div>
                          <p className="text-muted-foreground">Students</p>
                        </div>
                        <div>
                          <div className="font-semibold mb-1">
                            {path.createdBy?.createdPaths?.length || 0}
                          </div>
                          <p className="text-muted-foreground">Courses</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <Award className="h-4 w-4" />
                            <span className="font-semibold">Expert</span>
                          </div>
                          <p className="text-muted-foreground">Level</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
