import React , {useState} from 'react'
import Courses from '../components/Courses'
import { useAppContext } from '@/context/AppContext'
import { BookOpen, Clock, Star, Users, ArrowRight, CheckCircle, Zap, Award, TrendingUp, Menu, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { BackgroundLines } from '@/components/ui/background-lines'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { StickyScroll } from '@/components/ui/sticky-scroll-reveal'
import { motion } from "motion/react";
import AnimatedStatsCards from '@/components/AnimatedCaed'
import FadeInSection from '@/components/FadeInSection'


const content = [
  {
    title: "Personalized Dashboards",
    description:
      "Access dedicated dashboards tailored for learners, teachers, and administrators. Learners track progress and manage enrolled paths, while teachers monitor student engagement, revenue, and manage their created paths.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src="/dashboards.png"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Learning Path Creation",
    description:
      "Teachers can easily create and manage comprehensive learning paths. Upload various content types including videos, PDFs, documents, and structure them into engaging modules with descriptions and duration estimates.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src="/create.png"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
   {
    title: "Progress Tracking",
    description:
      "Learners can monitor their progress through learning paths, see completed modules, track hours learned, and view earned certificates. Teachers get insights into student completion rates and overall engagement.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src="/progress.png"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
   {
    title: "Admin Management Panel",
    description:
      "A powerful backend for administrators to manage users (learners and teachers), approve teacher applications, moderate content, view reports, and oversee the entire platform's health and activity.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src="/dashboards.png"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Browse & Enroll",
    description:
      "Discover a wide range of learning paths across various categories and levels. Filter by topic, difficulty, or price, view detailed course information, and enroll easily with optional access codes for private or paid content.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src="/Browse.png"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
   },
];

export default function Home() {
  const {learners , paths , teachers , learner} = useAppContext();

  
  return (
    <div>
      <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      ></motion.div>
      
        <div className="container mx-auto max-w-4xl text-center flex flex-col justify-center items-center min-h-screen relative">
          <h1 className="text-3xl md:text-7xl font-bold dark:text-white text-center">Learn Without Limits</h1>
          <p className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4 ">
            Access thousands of paths from expert instructors. Build skills that matter for your career and personal
            growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Button variant={"outline"}>
              
              <NavLink to="/courses" >
                Browse paths
              </NavLink>
            </Button>
            <Button variant={"outline"}>
              {
                learner ? (
                  <NavLink to="/learner" >
                    Start Learning Today
                  </NavLink>
                ):(
                  <NavLink to="/login" >
                    Start Learning Today
                  </NavLink>    
                )
              }
              
              
            </Button>

          </div>
        </div>
      </AuroraBackground>

      <FadeInSection>
        <section className="h-screen flex items-center justify-center w-full flex-col p-4"  >
          <div className="w-full py-4">
            <StickyScroll content={content} />
          </div>
        </section>
      </FadeInSection>
      <FadeInSection>
        <Courses/>
      </FadeInSection>
      <FadeInSection>
        <AnimatedStatsCards/>
      </FadeInSection>
      
      
    
            {/* Stats Section */}
      {/* <section className="flex items-center justify-center w-full flex-col px-4" >
        <div className=" mx-auto ">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">{learners?.length}</div>
              <div className="text-muted-foreground">Learners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">{paths?.length}</div>
              <div className="text-muted-foreground">paths</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">{teachers.length}</div>
              <div className="text-muted-foreground">Instructors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section> */}

      
    </div>
  )
}
