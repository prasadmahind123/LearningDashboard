import React from 'react'
import { useAppContext } from '@/context/AppContext'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { BackgroundLines } from '@/components/ui/background-lines'
import { motion } from "motion/react"
import AnimatedStatsCards from '@/components/AnimatedCaed'
import { MovingCards } from '@/components/MovingCards'
import { ArrowRight, CheckCircle2, Layout, BookOpen, BarChart3, ShieldCheck, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FadeInSection from '@/components/FadeInSection'

const features = [
  {
    title: "Personalized Dashboards",
    description: "Tailored interfaces for learners, teachers, and admins to track progress and manage content effectively.",
    icon: Layout,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/20"
  },
  {
    title: "Path Creation",
    description: "Intuitive tools for teachers to build comprehensive learning paths with video, documents, and quizzes.",
    icon: BookOpen,
    color: "text-orange-500",
    bg: "bg-orange-100 dark:bg-orange-900/20"
  },
  {
    title: "Smart Tracking",
    description: "Real-time analytics on student engagement, completion rates, and revenue generation.",
    icon: BarChart3,
    color: "text-green-500",
    bg: "bg-green-100 dark:bg-green-900/20"
  },
  {
    title: "Secure Admin",
    description: "Robust moderation and management tools to ensure platform quality and safety.",
    icon: ShieldCheck,
    color: "text-purple-500",
    bg: "bg-purple-100 dark:bg-purple-900/20"
  },
];

export default function Home() {
  const { learner } = useAppContext();

  return (
    <div className="bg-background min-h-screen font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
      
      {/* Hero Section with BackgroundLines */}
      <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 py-20 md:h-[90vh]">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="z-20 flex flex-col items-center text-center max-w-4xl"
        >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              Learn, Teach, and <br />
              <span className="text-blue-600 dark:text-blue-400">Grow Together.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl leading-relaxed">
              The all-in-one platform for structured learning paths. Whether you are a student aiming for mastery or an expert sharing knowledge, EduPlatform bridges the gap.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Button size="lg" className="rounded-full h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all cursor-pointer">
                <NavLink to={learner ? "/learner" : "/register"}>
                  {learner ? "Go to Dashboard" : "Get Started Now"}
                </NavLink>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-black/50 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                <NavLink to="/courses" className="flex items-center gap-2">
                  Browse Paths <Search className="w-4 h-4" />
                </NavLink>
              </Button>
            </div>
        </motion.div>
      </BackgroundLines>

      {/* Stats Section */}
      <div className="relative z-10 -mt-20 pb-20 px-4">
        <div className="container mx-auto">
          <AnimatedStatsCards />
        </div>
      </div>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950/50 border-y border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Platform Features</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Everything you need to build, manage, and track educational experiences.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FadeInSection key={index}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-900 h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.bg}`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Content Section (Alternating Layout) */}
      <section className="py-24 overflow-hidden">
         <div className="container mx-auto px-4 space-y-24">
            {/* Item 1 */}
            <FadeInSection>
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                   <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 group">
                      <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors z-10"></div>
                      <img src="/learnerDash.png" alt="Learner Dashboard" className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700" />
                   </div>
                </div>
                <div className="flex-1 space-y-6">
                   <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">For Students</div>
                   <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Track Your Progress</h3>
                   <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                      Visualize your learning journey with intuitive progress bars, completion certificates, and time tracking. Stay motivated and reach your goals faster.
                   </p>
                   <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-green-500" /> Resume where you left off
                      </li>
                      <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-green-500" /> Earn verifiable certificates
                      </li>
                   </ul>
                </div>
              </div>
            </FadeInSection>

            {/* Item 2 */}
            <FadeInSection>
              <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                <div className="flex-1">
                   <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 group">
                      <div className="absolute inset-0 bg-purple-600/10 group-hover:bg-transparent transition-colors z-10"></div>
                      <img src="/teacherDash.png" alt="Teacher Dashboard" className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700" />
                   </div>
                </div>
                <div className="flex-1 space-y-6">
                   <div className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium">For Instructors</div>
                   <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Manage & Monetize</h3>
                   <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                      Create rich learning paths with our drag-and-drop builder. Monitor student enrollments, track revenue, and grow your educational business.
                   </p>
                   <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-green-500" /> Detailed revenue analytics
                      </li>
                      <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-green-500" /> Student engagement metrics
                      </li>
                   </ul>
                </div>
              </div>
            </FadeInSection>
         </div>
      </section>

      {/* Infinite Scroll Section */}
      <section className="py-10 bg-slate-900 text-white overflow-hidden w-full h-fit">
        <div className="container mx-auto px-4 mb-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Explore Popular Paths</h2>
          <p className="text-slate-400">Join thousands of learners mastering these skills.</p>
        </div>
        <MovingCards />
      </section>

      {/* CTA Section */}
      {
        learner ? null : (
          <section className="py-24 bg-white dark:bg-black relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
            <div className="container mx-auto px-4 text-center relative z-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
                      Start your learning journey today.
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-10">
                      Join a community of lifelong learners and expert instructors.
                    </p>
                    <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-2xl transition-transform hover:scale-105 cursor-pointer" asChild>
                        <NavLink to="/register">Create Free Account</NavLink>
                    </Button>
                </motion.div>
            </div>
            {/* Decorative Gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          </section>
        )
      }
      

    </div>
  )
}