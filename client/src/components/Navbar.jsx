import React , {useState} from 'react'
import { BookOpen, Clock, Star, Users } from "lucide-react"
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../context/AppContext.jsx'
export default function Navbar() {
    const { userRole} = useAppContext();

    
    return(
        <header className="inset-1.5">
            <div className="container mx-auto px-4 py-4 flex items-center justify-around">
                <div className="flex items-center space-x-2">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold hidden sm:block">EduPlatform</span>
                    <span className="text-lg font-bold sm:hidden">Edu</span>
                </div>
                <nav className="hidden md:flex items-center space-x-6 text-gray-500 text-lg ">
                    <NavLink to="/" className="  text-gray-500 hover:text-black cursor-pointer">
                    Home
                    </NavLink>
                    <NavLink to="/courses" className="  text-gray-500 hover:text-black cursor-pointer">
                    learning paths
                    </NavLink>
                    <p href="/about" className=" cursor-pointer text-gray-500 hover:text-black">
                    About
                    </p>
                    <p href="/contact" className=" cursor-pointer text-gray-500 hover:text-black">
                    Contact
                    </p>
                </nav>
                <div className="flex items-center space-x-2 gap-2">
                    {
                        userRole ? (
                            <>
                                <NavLink to={userRole === "learner" ? "/learner" : "/teacher"} className="  text-gray-500 hover:text-black cursor-pointer">
                                    <Users className="h-6 w-6" />
                                </NavLink>
                            </>
                        ) : (
                            <>
                                <button variant="ghost"  className='cursor-pointer bg-black rounded py-1 px-4 text-white'>
                                    <NavLink to="login">Login</NavLink>
                                </button>
                                <button variant="ghost"  className='cursor-pointer bg-black rounded py-1 px-4 text-white'>
                                    <NavLink to="register">Register</NavLink>
                                </button>
                            </>
                        )
                    }
                </div>
            </div>
        </header>
    )
}
