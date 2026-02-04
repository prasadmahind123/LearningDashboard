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
  BarChart3,
  Search,
  User,
  LogOut,
  Menu,
  Bell,
  Settings,
  Sparkles,
  ChevronDown
} from "lucide-react"
import { useAppContext } from "../context/AppContext.jsx";
import { motion, AnimatePresence } from "framer-motion";

export default function LearnerLayout() {
  const {axios , learner, navigate, setUserRole } = useAppContext();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const logout = async () => {
    setUserRole(null);
    await axios.get('/api/learner/logout');
    navigate("/");
  }

  const sidebarLinks = [
    { name: "Dashboard", path: "/learner", icon: LayoutDashboard },
    { name: "My Learning Paths", path: "/learner/my-courses", icon: BookOpen },
    { name: "Progress Analytics", path: "/learner/progress", icon: BarChart3 },
    { name: "Browse New Paths", path: "/join", icon: Search },
    { name: "Profile Settings", path: "/learner/update-profile", icon: User },
  ];

  // Animation variants for page transitions
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

  // Reusable Sidebar Link Component with Active Animation
  const SidebarLink = ({ link, onClick }) => (
    <NavLink
      to={link.path}
      end={link.path === "/learner"}
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive 
            ? 'text-blue-600 font-semibold' 
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="activeSidebar"
              className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center w-full">
            <link.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'}`} />
            {link.name}
          </span>
          {isActive && (
            <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="absolute right-3 w-1.5 h-1.5 bg-blue-600 rounded-full" 
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
                   <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg">
                      <Sparkles className="h-5 w-5 text-white" />
                   </div>
                   <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                      EduPlatform
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
            <div className="hidden md:flex bg-gradient-to-tr from-blue-600 to-indigo-600 p-1.5 rounded-lg shadow-sm">
                <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold hidden md:block bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              EduPlatform
            </span>
          </div>

          {/* Right Side Actions */}
          <div className="ml-auto flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" size="icon" className="rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50">
              <Bell className="h-5 w-5" />
            </Button>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block"></div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-1 md:p-2 rounded-full md:rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Avatar className="h-8 w-8 border border-slate-200">
                    <AvatarImage src={learner?.avatar || "/placeholder.svg?height=32&width=32"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700">
                      {learner?.name ? learner.name.split(" ").map(n => n[0]).join("") : "L"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start text-sm">
                     <span className="font-medium text-slate-700 dark:text-slate-200">{learner?.name || "Learner"}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400 hidden md:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/learner/update-profile")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
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
             <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Menu</p>
            {sidebarLinks.map((link) => (
              <SidebarLink key={link.name} link={link} />
            ))}
          </div>
          
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-4 rounded-xl border border-blue-100 dark:border-slate-700">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Weekly Goal</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Keep learning to unlock new badges!</p>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[70%] rounded-full"></div>
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