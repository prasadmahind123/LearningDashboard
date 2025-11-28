import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  BookOpen,
  Users,
  DollarSign,
  User,
  LogOut,
  Menu,
  Bell,
  Settings,
  Sparkles,
  ChevronDown,
  GraduationCap
} from "lucide-react"
import { useAppContext } from "../context/AppContext.jsx";
import { motion, AnimatePresence } from "framer-motion";

export default function TeacherLayout() {
  const {axios, teacher, navigate, setUserRole } = useAppContext();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    setUserRole(null);
    await axios.get('/api/teacher/logout');
    navigate("/");
  }

  // Defined links with Icons
  const sidebarLinks = [
    { name: "Dashboard", path: "/teacher", icon: LayoutDashboard },
    { name: "My Learning Paths", path: "/teacher/courses", icon: BookOpen },
    { name: "My Students", path: "/teacher/students", icon: Users },
    { name: "Revenue Analytics", path: "/teacher/revenue", icon: DollarSign },
    { name: "Instructor Profile", path: "/teacher/update-profile", icon: User },
  ];

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  // Reusable Sidebar Link Component
  const SidebarLink = ({ link, onClick }) => (
    <NavLink
      to={link.path}
      end={link.path === "/teacher"}
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive 
            ? 'text-indigo-600 font-semibold' 
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="activeTeacherSidebar"
              className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center w-full">
            <link.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-700'}`} />
            {link.name}
          </span>
          {isActive && (
            <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="absolute right-3 w-1.5 h-1.5 bg-indigo-600 rounded-full" 
            />
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      {/* --- Header --- */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="flex h-16 items-center px-6 max-w-[1600px] mx-auto w-full">
          
          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden mr-2 hover:bg-slate-100">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                   <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-white" />
                   </div>
                   <span className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                      EduInstructor
                   </span>
                </div>
              </div>
              <div className="flex flex-col space-y-1 p-4">
                {sidebarLinks.map((link) => (
                  <SidebarLink key={link.name} link={link} onClick={() => setIsMobileSidebarOpen(false)} />
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo (Desktop) */}
          <div className="flex items-center space-x-2 mr-8">
            <div className="hidden md:flex bg-gradient-to-tr from-indigo-600 to-purple-600 p-1.5 rounded-lg shadow-sm">
                <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold hidden md:block bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              EduInstructor
            </span>
          </div>

          {/* Right Side Actions */}
          <div className="ml-auto flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" size="icon" className="rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50">
              <Bell className="h-5 w-5" />
            </Button>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block"></div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-1 md:p-2 rounded-full md:rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Avatar className="h-8 w-8 border border-slate-200 ring-2 ring-transparent group-hover:ring-indigo-100 transition-all">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700">
                      {teacher?.fullName ? teacher.fullName.charAt(0).toUpperCase() : 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start text-sm">
                     <span className="font-medium text-slate-700 dark:text-slate-200">{teacher?.fullName || "Instructor"}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400 hidden md:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Instructor Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/teacher/update-profile")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* --- Main Layout --- */}
      <div className="flex flex-1 overflow-hidden max-w-[1600px] mx-auto w-full">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm h-[calc(100vh-64px)] sticky ">
          <div className="flex-1 py-6 px-4 space-y-1">
             <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Management</p>
            {sidebarLinks.map((link) => (
              <SidebarLink key={link.name} link={link} />
            ))}
          </div>
          
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 p-4 rounded-xl border border-indigo-100 dark:border-slate-700">
                <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1">Monthly Revenue</p>
                <div className="flex items-end gap-1">
                    <span className="text-xl font-bold text-slate-800 dark:text-slate-100">${teacher?.revenue || 0}</span>
                    <span className="text-[10px] text-green-600 mb-1 flex items-center">
                        <p className="h-3 w-3 mr-0.5" /> +12%
                    </span>
                </div>
            </div>
          </div>
        </aside>

        {/* Page Content with Transitions */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-0 bg-slate-50/50 dark:bg-slate-950">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}