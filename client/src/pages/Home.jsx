import React , {useState} from 'react'
import Courses from '../components/Courses'
import { useAppContext } from '@/context/AppContext'
import { BookOpen, Clock, Star, Users, ArrowRight, CheckCircle, Zap, Award, TrendingUp, Menu, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
const features = [
  {
    icon: <BookOpen className="h-8 w-8" />,
    title: "Expert-Led Courses",
    description: "Learn from industry professionals with years of real-world experience.",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Self-Paced Learning",
    description: "Study at your own pace with lifetime access to course materials.",
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: "Recognized Certificates",
    description: "Earn industry-recognized certificates upon course completion.",
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Career Growth",
    description: "Get job-ready skills that lead to career advancement and higher salaries.",
  },
]

export default function Home() {
  const {learners , paths , teachers , learner} = useAppContext();

  
  return (
    <div>
       <section className="py-20 px-4 text-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Learn Without Limits</h1>
          <p className="text-xl  mb-8 max-w-2xl mx-auto text-gray-500 ">
            Access thousands of courses from expert instructors. Build skills that matter for your career and personal
            growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      </section>
        <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose EduPlatform?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide everything you need to succeed in your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                className="border border-border hover:border-primary/50 hover:shadow-lg transition-all group"
              >
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Courses/>
    
            {/* Stats Section */}
      <section className="py-16 px-4  bg-blue-50 rounded-lg p-15">
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
      </section>
    </div>
  )
}
