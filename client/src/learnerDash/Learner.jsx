// import React, { useState } from 'react';
// import { NavLink, Outlet, useLocation } from 'react-router-dom';
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   LayoutDashboard,
//   BookOpen,
//   BarChart3,
//   Search,
//   User,
//   LogOut,
//   Menu,
//   Bell,
//   Settings,
//   Sparkles,
//   ChevronDown
// } from "lucide-react"
// import { useAppContext } from "../context/AppContext.jsx";
// import { motion, AnimatePresence } from "framer-motion";

// export default function LearnerLayout() {
//   const {axios , learner, navigate, setUserRole } = useAppContext();
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
//   const location = useLocation();

//   const logout = async () => {
//     setUserRole(null);
//     await axios.get('/api/learner/logout');
//     navigate("/");
//   }

//   const sidebarLinks = [
//     { name: "Dashboard", path: "/learner", icon: LayoutDashboard },
//     { name: "My Learning Paths", path: "/learner/my-courses", icon: BookOpen },
//     { name: "Progress Analytics", path: "/learner/progress", icon: BarChart3 },
//     { name: "Browse New Paths", path: "/join", icon: Search },
//     { name: "Profile Settings", path: "/learner/update-profile", icon: User },
//   ];

//   // Animation variants for page transitions
//   const pageVariants = {
//     initial: { opacity: 0, y: 20 },
//     in: { opacity: 1, y: 0 },
//     out: { opacity: 0, y: -20 }
//   };

//   const pageTransition = {
//     type: "tween",
//     ease: "anticipate",
//     duration: 0.4
//   };

//   // Reusable Sidebar Link Component with Active Animation
//   const SidebarLink = ({ link, onClick }) => (
//     <NavLink
//       to={link.path}
//       end={link.path === "/learner"}
//       onClick={onClick}
//       className={({ isActive }) =>
//         `relative flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
//           isActive 
//             ? 'text-blue-600 font-semibold' 
//             : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
//         }`
//       }
//     >
//       {({ isActive }) => (
//         <>
//           {isActive && (
//             <motion.div
//               layoutId="activeSidebar"
//               className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             />
//           )}
//           <span className="relative z-10 flex items-center w-full">
//             <link.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'}`} />
//             {link.name}
//           </span>
//           {isActive && (
//             <motion.div 
//                 initial={{ scale: 0 }} 
//                 animate={{ scale: 1 }} 
//                 className="absolute right-3 w-1.5 h-1.5 bg-blue-600 rounded-full" 
//             />
//           )}
//         </>
//       )}
//     </NavLink>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
//       {/* --- Header --- */}
//       <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
//         <div className="flex h-16 items-center px-6 max-w-[1600px] mx-auto w-full">
          
//           {/* Mobile Menu Trigger */}
//           <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
//             <SheetTrigger asChild>
//               <Button variant="ghost" size="icon" className="md:hidden mr-2 hover:bg-slate-100">
//                 <Menu className="h-5 w-5" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="left" className="w-72 p-0">
//               <div className="p-6 border-b border-slate-100 dark:border-slate-800">
//                 <div className="flex items-center space-x-2">
//                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg">
//                       <Sparkles className="h-5 w-5 text-white" />
//                    </div>
//                    <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
//                       EduPlatform
//                    </span>
//                 </div>
//               </div>
//               <div className="flex flex-col space-y-1 p-4">
//                 {sidebarLinks.map((link) => (
//                   <SidebarLink key={link.name} link={link} onClick={() => setIsMobileSidebarOpen(false)} />
//                 ))}
//               </div>
//             </SheetContent>
//           </Sheet>

//           {/* Logo (Desktop) */}
//           <div className="flex items-center space-x-2 mr-8">
//             <div className="hidden md:flex bg-gradient-to-tr from-blue-600 to-indigo-600 p-1.5 rounded-lg shadow-sm">
//                 <Sparkles className="h-5 w-5 text-white" />
//             </div>
//             <span className="text-xl font-bold hidden md:block bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
//               EduPlatform
//             </span>
//           </div>

//           {/* Right Side Actions */}
//           <div className="ml-auto flex items-center space-x-2 md:space-x-4">
//             <Button variant="ghost" size="icon" className="rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50">
//               <Bell className="h-5 w-5" />
//             </Button>
            
//             <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block"></div>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="flex items-center space-x-2 p-1 md:p-2 rounded-full md:rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
//                   <Avatar className="h-8 w-8 border border-slate-200">
//                     <AvatarImage src={learner?.avatar || "/placeholder.svg?height=32&width=32"} />
//                     <AvatarFallback className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700">
//                       {learner?.name ? learner.name.split(" ").map(n => n[0]).join("") : "L"}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="hidden md:flex flex-col items-start text-sm">
//                      <span className="font-medium text-slate-700 dark:text-slate-200">{learner?.name || "Learner"}</span>
//                   </div>
//                   <ChevronDown className="h-4 w-4 text-slate-400 hidden md:block" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56">
//                 <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={() => navigate("/learner/update-profile")} className="cursor-pointer">
//                   <User className="mr-2 h-4 w-4" />
//                   <span>Profile</span>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem className="cursor-pointer">
//                   <Settings className="mr-2 h-4 w-4" />
//                   <span>Settings</span>
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
//                   <LogOut className="mr-2 h-4 w-4" />
//                   <span>Log out</span>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </header>

//       {/* --- Main Layout --- */}
//       <div className="flex flex-1 overflow-hidden max-w-[1600px] mx-auto w-full">
        
//         {/* Desktop Sidebar */}
//         <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm h-[calc(100vh-64px)] sticky ">
//           <div className="flex-1 py-6 px-4 space-y-1">
//              <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Menu</p>
//             {sidebarLinks.map((link) => (
//               <SidebarLink key={link.name} link={link} />
//             ))}
//           </div>
          
//           <div className="p-4 border-t border-slate-200 dark:border-slate-800">
//             <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-4 rounded-xl border border-blue-100 dark:border-slate-700">
//                 <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Weekly Goal</p>
//                 <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Keep learning to unlock new badges!</p>
//                 <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
//                     <div className="h-full bg-blue-500 w-[70%] rounded-full"></div>
//                 </div>
//             </div>
//           </div>
//         </aside>

//         {/* Page Content with Transitions */}
//         <main className="flex-1 overflow-y-auto overflow-x-hidden p-0 bg-slate-50/50 dark:bg-slate-950">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={location.pathname}
//               initial="initial"
//               animate="in"
//               exit="out"
//               variants={pageVariants}
//               transition={pageTransition}
//               className="h-full"
//             >
//               <Outlet />
//             </motion.div>
//           </AnimatePresence>
//         </main>
//       </div>
//     </div>
//   )
// }

import React, { useState, useCallback, useMemo } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard, BookOpen, BarChart3, Search,
  User, LogOut, Menu, Bell, Settings, Sparkles, ChevronDown,
  GraduationCap, X,
} from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { name: "Dashboard",          path: "/learner",                 icon: LayoutDashboard, end: true },
  { name: "My Learning Paths",  path: "/learner/my-courses",      icon: BookOpen },
  { name: "Progress Analytics", path: "/learner/progress",        icon: BarChart3 },
  { name: "Browse New Paths",   path: "/join",                    icon: Search },
  { name: "Profile Settings",   path: "/learner/update-profile",  icon: User },
];

// Page-transition variants — subtle upward fade, consistent across all routes
const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 12 },
  in:      { opacity: 1, y: 0,  transition: { type: "tween", ease: "easeOut",  duration: 0.25 } },
  out:     { opacity: 0, y: -8, transition: { type: "tween", ease: "easeIn",   duration: 0.15 } },
};

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR LINK — extracted so it's never re-created inside the render body
// (The original defined SidebarLink inside LearnerLayout, which causes React
//  to treat it as a new component type on every render — breaking layoutId
//  animations and triggering needless unmount/remount cycles.)
// ─────────────────────────────────────────────────────────────────────────────

const SidebarLink = React.memo(({ link, onClick }) => (
  <NavLink
    to={link.path}
    end={link.end ?? false}
    onClick={onClick}
    className={({ isActive }) =>
      `relative flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm
       ${isActive
         ? "text-blue-600 dark:text-blue-400 font-semibold"
         : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60"
       }`
    }
  >
    {({ isActive }) => (
      <>
        {/* Shared animated background pill */}
        {isActive && (
          <motion.div
            layoutId="activeSidebarBg"
            className="absolute inset-0 bg-blue-50 dark:bg-blue-900/25 rounded-xl border border-blue-100 dark:border-blue-800/40"
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          />
        )}

        <span className="relative z-10 flex items-center w-full gap-3">
          <link.icon
            className={`w-4.5 h-4.5 shrink-0 transition-colors ${
              isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
            }`}
            style={{ width: "1.125rem", height: "1.125rem" }}
          />
          <span className="truncate">{link.name}</span>
        </span>

        {/* Active dot */}
        {isActive && (
          <motion.span
            layoutId="activeDot"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0"
          />
        )}
      </>
    )}
  </NavLink>
));

SidebarLink.displayName = "SidebarLink";

// ─────────────────────────────────────────────────────────────────────────────
// WEEKLY GOAL WIDGET — sidebar bottom
// (Kept separate so it can later accept real `weekHours` / `goalHours` props)
// ─────────────────────────────────────────────────────────────────────────────

const WeeklyGoalWidget = ({ weekHours = 7, goalHours = 10 }) => {
  const pct = Math.min(Math.round((weekHours / goalHours) * 100), 100);
  return (
    <div className="mx-3 mb-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border border-blue-100 dark:border-slate-700">
      <div className="flex justify-between items-center mb-1">
        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">Weekly Goal</p>
        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{pct}%</span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5">
        {weekHours}h of {goalHours}h target
      </p>
      <div className="h-1.5 w-full bg-blue-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
        />
      </div>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
        {pct >= 100 ? "🎉 Goal reached! Keep going." : "Keep learning to unlock badges!"}
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGO MARK
// ─────────────────────────────────────────────────────────────────────────────

const LogoMark = ({ size = "md" }) => {
  const s = size === "sm" ? "p-1.5 rounded-md" : "p-2 rounded-lg";
  const ic = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <div className={`bg-gradient-to-tr from-blue-600 to-indigo-500 ${s} shadow-sm shrink-0`}>
      <GraduationCap className={`${ic} text-white`} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// INITIALS HELPER
// ─────────────────────────────────────────────────────────────────────────────

const getInitials = (name) => {
  if (!name) return "L";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN LAYOUT
// ─────────────────────────────────────────────────────────────────────────────

export default function LearnerLayout() {
  const { axios, learner, navigate, setUserRole } = useAppContext();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const logout = useCallback(async () => {
    if (isLoggingOut) return;           // prevent double-click
    setIsLoggingOut(true);
    try {
      setUserRole(null);
      await axios.get("/api/learner/logout");
    } catch {
      // Even if the API call fails, clear the session client-side
    } finally {
      navigate("/");
    }
  }, [axios, navigate, setUserRole, isLoggingOut]);

  const initials = useMemo(() => getInitials(learner?.name), [learner?.name]);

  // ── Sidebar contents — shared between desktop and mobile sheet ─────────────
  const SidebarContents = ({ onLinkClick }) => (
    <>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3">
          Navigation
        </p>
        {NAV_LINKS.map((link) => (
          <SidebarLink key={link.path} link={link} onClick={onLinkClick} />
        ))}
      </nav>

      {/* Divider + Weekly Goal widget */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
        <WeeklyGoalWidget
          weekHours={learner?.progressStats?.weekHours ?? 0}
          goalHours={10}
        />
      </div>
    </>
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="flex h-15 items-center px-4 md:px-6 gap-3 max-w-[1600px] mx-auto w-full" style={{ height: "3.75rem" }}>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72 p-0 flex flex-col">
              {/* Mobile sheet header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <LogoMark size="sm" />
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                    EduPlatform
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8" onClick={closeMobile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile learner identity */}
              <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0 flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700 shrink-0">
                  <AvatarImage src={learner?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 text-sm font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{learner?.name ?? "Learner"}</p>
                  <p className="text-xs text-muted-foreground truncate">{learner?.email ?? ""}</p>
                </div>
              </div>

              <div className="flex flex-col flex-1 overflow-y-auto">
                <SidebarContents onLinkClick={closeMobile} />
              </div>

              {/* Mobile logout */}
              <div className="px-3 pb-4 border-t border-slate-100 dark:border-slate-800 pt-3 shrink-0">
                <button
                  onClick={logout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  {isLoggingOut ? "Signing out…" : "Sign out"}
                </button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop logo */}
          <div className="hidden md:flex items-center gap-2.5 mr-6 shrink-0">
            <LogoMark />
            <span className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              EduPlatform
            </span>
          </div>

          {/* Right-side actions */}
          <div className="ml-auto flex items-center gap-1 md:gap-2">

            {/* Notification bell — badge dot for "has notifications" */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
              </Button>
              {/* Uncomment when you wire up real notifications:
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950" /> */}
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block" />

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-1.5 md:px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 h-auto"
                >
                  <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700 shrink-0">
                    <AvatarImage src={learner?.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start leading-none">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                      {learner?.name ?? "Learner"}
                    </span>
                    <span className="text-[10px] text-muted-foreground max-w-[120px] truncate">
                      {learner?.email ?? ""}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden md:block shrink-0" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
                {/* Identity header inside dropdown */}
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {learner?.name ?? "Learner"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{learner?.email ?? ""}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => navigate("/learner/update-profile")}
                  className="cursor-pointer gap-2"
                >
                  <User className="h-4 w-4" /> Profile
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer gap-2">
                  <Settings className="h-4 w-4" /> Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={logout}
                  disabled={isLoggingOut}
                  className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 gap-2 disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                  {isLoggingOut ? "Signing out…" : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden max-w-[1600px] mx-auto w-full">

        {/* Desktop sidebar */}
        <aside
          className="hidden md:flex flex-col w-60 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm sticky top-[3.75rem] h-[calc(100vh-3.75rem)] overflow-y-auto"
          aria-label="Primary navigation"
        >
          <SidebarContents onLinkClick={undefined} />
        </aside>

        {/* Page content */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-slate-50/50 dark:bg-slate-950">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={PAGE_VARIANTS}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}