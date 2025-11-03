import React from 'react'
import { BookOpen } from "lucide-react"
export default function Footer() {
  return (
    <div>
      <footer className=" py-12 px-4">
        <div className=" mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">EduPlatform</span>
              </div>
              <p className="text-muted-foreground  hover:text-black">
                Empowering learners worldwide with quality education and expert instruction.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">courses</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <p href="#" className="hover:text-foreground text-gray-500  cursor-pointer">
                    Web Development
                  </p>
                </li>
                <li>
                  <p href="#" className="hover:text-foreground text-gray-500  cursor-pointer">
                    Data Science
                  </p>
                </li>
                <li>
                  <p href="#" className="hover:text-foreground text-gray-500  cursor-pointer">
                    Digital Marketing
                  </p>
                </li>
                <li>
                  <p href="#" className="hover:text-foreground text-gray-500  cursor-pointer">
                    Mobile Development
                  </p>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <p href="#" className="hover:text-foreground text-gray-500  cursor-pointer">
                    Help Center
                  </p>
                </li>
                <li>
                  <p href="#" className="hover:text-foreground text-gray-500  cursor-pointer">
                    Contact Us
                  </p>
                </li>
                <li>
                  <p href="#" className="hover:text-foreground text-gray-500  cursor-pointer">
                    Privacy Policy
                  </p>
                </li>
                <li>
                  <p href="#" className="hover:text-foreground text-gray-500  cursor-pointer">
                    Terms of Service
                  </p>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <p href="#" className="hover:text-foreground text-gray-500  cursor-pointer">
                    About Us
                  </p>
                </li>
                <li>
                  <p href="#" className="hover:text-foreground text-gray-500 k cursor-pointer">
                    Careers
                  </p>
                </li>
                <li>
                  <p href="#" className="hover:text-foreground text-gray-500  cursor-pointer">
                    Blog
                  </p>
                </li>
                <li>
                  <p href="#" className="hover:text-foreground text-gray-500  cursor-pointer">
                    Press
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center  text-gray-500 hover:text-black cursor-pointer">
            <p>&copy; 2024 EduPlatform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
