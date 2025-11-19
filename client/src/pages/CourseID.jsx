"use client";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BookOpen,
  Clock,
  Star,
  Users,
  Globe,
  Award,
  ShoppingCart,
} from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";
import toast, { Toaster } from "react-hot-toast";

export default function CourseID() {
  const { paths, learner, axios } = useAppContext();
  const { id } = useParams();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [enrollment, setEnrollment] = useState(null);

  const path = paths.find((p) => p._id === id);

  useEffect(() => {
    if (!learner || !path) return;
    const enrolled = learner.enrolledPaths?.find((e) => e.pathId === path._id);
    if (enrolled) {
      setEnrollment(enrolled);
      setIsEnrolled(true);
    } else {
      setEnrollment(null);
      setIsEnrolled(false);
    }
  }, [learner, path]);

  if (!path) return <div className="p-6 text-red-500">Course not found</div>;

  const handleEnroll = async () => {
    if (learner == null) {
      setErrorMsg("You must be logged in to enroll.");
      return;
    }
    try {
      if ((path.isPrivate || (path.price && path.price > 0)) && accessCode) {
        if (accessCode.trim() !== path.code) {
          setErrorMsg("Invalid access code");
          return;
        }
      }

      if (path.price && path.price > 0 && !accessCode) {
        toast.loading(`This course costs $${path.price}. Redirecting to payment...`);
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/learner/enroll-path",
        { pathId: path._id },
        { withCredentials: true }
      );

      if (response.data.success) setIsEnrolled(true);
      else setErrorMsg(response.data.message || "Enrollment failed");

      toast.success(`You have been enrolled in ${path.title}!`);
    } catch (error) {
      console.error("Enrollment error:", error);
      setErrorMsg(error.response?.data?.message || "Failed to enroll.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-white via-[#f8fafc] to-[#eef2ff] text-black min-h-screen overflow-x-hidden transition-all duration-700">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="py-16 px-6 md:px-12 relative"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#dbeafe,_transparent_60%)] opacity-60"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-10 container mx-auto">
          {/* Course Info */}
          <div className="lg:col-span-2 space-y-6">
            <Badge className="bg-blue-500/20 text-blue-700 border border-blue-200 font-semibold">
              Bestseller
            </Badge>
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500"
            >
              {path.title}
            </motion.h1>
            <p className="text-gray-700 leading-relaxed text-lg md:text-xl">
              {path.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-6 text-gray-600 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{path.rating || "4.5"}</span>
                <span>({path.learners?.length || 0} students)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>{path.duration || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span>{path.level || "All levels"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                <span>{path.language || "English"}</span>
              </div>
            </div>

            {/* Instructor */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mt-6 flex items-center gap-4 bg-white/70 p-4 rounded-xl backdrop-blur-md border border-gray-200 shadow-sm"
            >
              <Avatar className="border border-gray-300">
                <AvatarFallback>
                  {path.createdBy?.fullName?.[0] || "I"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">
                  {path.createdBy?.fullName || "Unknown Instructor"}
                </p>
                <p className="text-gray-500 text-sm">
                  Expert in {path.createdBy?.expertise || "Expert Instructor"}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Enroll Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/90 backdrop-blur-lg border border-gray-200 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="aspect-video w-full relative overflow-hidden"
              >
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  src={path.image || "/placeholder.svg"}
                  alt={path.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl font-bold text-blue-600">
                    ${path.price || "Free"}
                  </span>
                  {path.originalPrice && (
                    <span className="text-gray-400 line-through">
                      ${path.originalPrice}
                    </span>
                  )}
                </div>

                {isEnrolled ? (
                  <Button asChild className="w-full text-lg bg-blue-600 hover:bg-blue-700 text-white">
                    <Link to={`/mycourses/${path._id}`}>Go to Course</Link>
                  </Button>
                ) : (
                  <>
                    {(path.isPrivate || (path.price && path.price > 0)) && (
                      <input
                        type="text"
                        placeholder="Enter access code (if you have one)"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        className="w-full mb-3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    )}
                    {errorMsg && (
                      <p className="text-red-500 text-sm mb-2">{errorMsg}</p>
                    )}

                    <Button
                      onClick={handleEnroll}
                      className="w-full text-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-[1.02]"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {path.price && path.price > 0
                        ? "Buy Now / Use Code"
                        : "Enroll Now"}
                    </Button>
                  </>
                )}

                <p className="text-center text-sm text-gray-500 mt-4">
                  30-Day Money-Back Guarantee
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Curriculum Section */}
      {path.content && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="py-16 container mx-auto px-6"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
            Course Curriculum
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {path.content.map((section, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-all cursor-pointer"
                >
                  <h4 className="font-semibold text-lg">{section.title}</h4>
                  <div className="text-sm text-gray-500">
                    {section.resources?.length || 0} lessons •{" "}
                    {section.duration || "N/A"} hours
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Instructor Card */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                Instructor
              </h3>
              <div className="flex gap-4">
                <Avatar className="w-16 h-16 border border-gray-300">
                  <AvatarFallback>
                    {path.createdBy?.fullName?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {path.createdBy?.fullName || "Unknown Instructor"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {path.createdBy?.email || "No email provided"}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                    <div>
                      <Star className="inline h-4 w-4 text-yellow-400" /> 4.8 Rating
                    </div>
                    <div>{path.learners?.length || 0} Students</div>
                    <div>{path.createdBy?.createdPaths?.length || 0} Courses</div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-blue-500" /> Expert
                    </div>
                  </div>
                  <div className="flex items-center">
                    <p className="font-mono mt-4 text-gray-500 text-sm">
                      {path.createdBy?.bio}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

      <Toaster />
    </div>
  );
}
