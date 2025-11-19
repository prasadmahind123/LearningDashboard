import React , { useState } from 'react';
import { NavLink , Outlet} from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  BookOpen,
  Bell,
  Settings,
  LogOut,
  Menu
} from "lucide-react"
import { useAppContext } from "../context/AppContext.jsx";
export default function Teacher() {
     const sidebarLinks = [
        { name: "Dashboard", path: "/teacher"},
        { name: "My learning paths", path: "/teacher/courses"},
        { name: "My Students", path: "/teacher/students"},
        { name: "Revenue", path: "/teacher/revenue"},
        { name: "Update Profile", path: "/teacher/update-profile"},
    ];
     const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
      const { navigate, setUserRole , teacher } = useAppContext();

    const handleLogout = async () => {
        setUserRole(null); // Clear user role in context
        navigate("/"); // Redirect to home page
    }


     
function SidebarContent() {
  return (
    <div className="flex flex-col space-y-2 p-4">
      {sidebarLinks.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          end={link.path === "/teacher"}
          className={({ isActive }) =>
            `flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${isActive ? 'bg-gray-200 font-semibold' : ''}`
          }
        >
          <span className="flex-1">{link.name}</span>
        </NavLink>
        
      ))}
    </div>
  )
}
  return (
    <div>
      <header className="border-b bg-white">
        <div className="flex h-16 items-center px-6">
          <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex items-center space-x-2 p-4 border-b">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold hidden sm:block">EduPlatform</span>
                <span className="text-lg font-bold sm:hidden">Edu</span>
              </div>
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold hidden sm:block">EduPlatform</span>
            <span className="text-lg font-bold sm:hidden">Edu</span>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32&text=JS" />
              <AvatarFallback>
                {teacher?.fullName ? teacher.fullName.charAt(0).toUpperCase() : 'T'}
              </AvatarFallback>
            </Avatar>
            <Button onClick = {handleLogout} variant="ghost" size="icon">
              <p>
                <LogOut  className="h-5 w-5" />
              </p>
            </Button>
          </div>
        </div>
      </header>

      <div>
        <div className="flex h-screen overflow-y-auto ">
          <div className='hidden md:block md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 '>
            {
              sidebarLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === "/teacher"}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${isActive ? 'bg-gray-200 font-semibold' : ''}`
                  }
                >
                  <span className="flex-1">{link.name}</span>
                </NavLink>
              ))
            }
          </div>
              <div className="flex-1 p-6">
                <Outlet />
              </div>
        </div>
      </div>
        
    </div>
  )
}
