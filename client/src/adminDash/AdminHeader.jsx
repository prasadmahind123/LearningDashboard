"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Search, Bell, Settings, LogOut, ArrowLeft } from "lucide-react"
import { useAppContext } from "@/context/AppContext"

export default function AdminHeader({ searchQuery, setSearchQuery }) {
    const { navigate, setUserRole } = useAppContext();
    const logout = async () => {
        setUserRole(null); // Clear user role in context
        navigate("/"); // Redirect to home page
    }
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild className="md:hidden">
            <Button onClick={() => navigate(-1)} className="flex items-center">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Button>
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-lg md:text-xl font-bold">Admin Panel</span>
        </div>

        <div className="ml-4 md:ml-8 flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users, courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center space-x-2 md:space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32&text=AD" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" asChild className="hidden md:flex">
            <Button onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </Button>
        </div>
      </div>
    </header>
  )
}