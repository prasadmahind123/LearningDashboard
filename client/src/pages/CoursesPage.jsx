import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, ArrowRight, BookOpen, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppContext } from '../context/AppContext.jsx';
import { motion } from "motion/react";
import toast, { Toaster } from 'react-hot-toast';

export default function CoursesPage() {
  const { backendUrl, axios } = useAppContext();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!code.trim()) return toast.error("Please enter a valid class code");

    setLoading(true);
    try {
      const { data } = await axios.post(
        `/api/learner/join-by-code`,
        { code: code.trim() },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message || "Successfully joined class!");
        setCode("");
        // Redirect to dashboard after short delay to show success
        setTimeout(() => navigate("/learner"), 1500);
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to join class. Check the code.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center relative overflow-hidden">
      <Toaster position="top-center" />
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-blue-600 dark:bg-blue-900 rounded-b-[30%] scale-x-150 z-0 opacity-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md mt-20 px-4"
      >
        <div className="text-center mb-8">
          <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-lg">
             <Key className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Join a Class</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Enter the unique code provided by your instructor to enroll in a new learning path.
          </p>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <form onSubmit={handleJoin}>
            <CardHeader>
              <CardTitle className="text-lg">Class Code</CardTitle>
              <CardDescription>
                Ask your teacher for the code (e.g., <span className="font-mono bg-slate-100 px-1 rounded">MATH101</span>)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative mt-3">
                <Input
                  placeholder="Enter code here..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="pl-10 h-12 text-lg tracking-wide  placeholder:normal-case placeholder:tracking-normal border-slate-300 focus:border-blue-500 transition-all"
                  autoFocus
                />
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-3 items-start text-sm text-blue-700 dark:text-blue-300">
                <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
                <p>
                  Joining a class gives you instant access to all modules, resources, and quizzes assigned by your instructor.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg" 
                disabled={loading || !code.trim()}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4 animate-spin" /> Verifying...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Join Class <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Helper Link */}
        <div className="text-center mt-6">
          <Button variant="link" onClick={() => navigate("/learner")} className="text-slate-500 hover:text-slate-800">
            Back to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
}