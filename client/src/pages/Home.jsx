import React from 'react'
import Courses from '../components/Courses'
import Footer from '../components/Footer'
export default function Home() {
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
            <button size="lg" className='bg-black text-white py-2.5 px-5  rounded-lg cursor-pointer  hover:bg-black/80'>
              <p href="/courses">Browse courses</p>
            </button>
            <button size="lg" className='bg-white text-black py-2.5 px-5  rounded-lg cursor-pointer hover:bg-white/70'>
              <p href="/auth/signup">Start Learning Today</p>
            </button>
          </div>
        </div>
      </section>
      <Courses></Courses>
            {/* Stats Section */}
      <section className="py-16 px-4  bg-blue-50 rounded-lg p-15">
        <div className=" mx-auto ">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1,200+</div>
              <div className="text-muted-foreground">courses</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
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
