import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming these are styled components from shadcn/ui
import { Users, UserCheck, BookOpen } from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx"; // Adjust the import path if needed
import { cn } from "@/lib/utils"; // Assuming you have this utility

// Reusable Counter component (same as before)
function AnimatedCounter({ endValue, duration = 1500, className }) {
  const [count, setCount] = useState(0);
  const startValue = 0;
  const startTimeRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const animateCount = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      const elapsedTime = timestamp - startTimeRef.current;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out
      const currentCount = Math.floor(easedProgress * (endValue - startValue) + startValue);
      setCount(currentCount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animateCount);
      } else {
        setCount(endValue); // Ensure final count is exact
      }
    };
    frameRef.current = requestAnimationFrame(animateCount);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      startTimeRef.current = null;
    };
  }, [endValue, duration, startValue]);

  return <div className={cn("text-4xl lg:text-5xl font-bold tracking-tight", className)}>{count.toLocaleString()}</div>;
}


// Main Stats Card Component with Advanced Styling
export default function AnimatedStatsCardsAdvanced() {
  const { learners, teachers, paths } = useAppContext();

  // Define base styles and variant styles
  const cardBaseStyle = "relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out group";
  const iconContainerBaseStyle = "absolute -top-3 -right-3 p-4 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 scale-110 group-hover:scale-125";
  const titleStyle = "text-sm font-medium uppercase tracking-wider text-muted-foreground";
  const countStyle = "mt-1"; // Applied via AnimatedCounter className

  const stats = [
    {
      title: "Total Learners",
      count: learners?.length || 0,
      icon: <Users className="h-10 w-10" />, // Slightly larger icon
      gradient: "white",
      textColor: "text-blue-900 dark:text-blue-100",
      iconBgColor: "bg-neural-700",
    },
    {
      title: "Active Instructors",
      count: teachers?.filter(t => t.status === 'approved').length || 0,
      icon: <UserCheck className="h-10 w-10" />,
      gradient: "white",
      textColor: "text-green-900 dark:text-green-100",
      iconBgColor: "bg-neural-700",
    },
    {
      title: "Available Paths",
      count: paths?.length || 0,
      icon: <BookOpen className="h-10 w-10" />,
      gradient: "white",
      textColor: "text-purple-900 dark:text-purple-100",
      iconBgColor: "bg-neural-700",
    },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              // Apply gradient background and base styles
              className={cn(
                cardBaseStyle,
                `bg-gradient-to-br ${stat.gradient} dark:opacity-90`,
                "text-white" // Make default text white for contrast on gradient
              )}
              style={{ animationDelay: `${index * 100}ms` }} // Staggered fade-in (requires fade-in animation in index.css)
            >
              {/* Decorative Icon Background */}
              <div className={cn(iconContainerBaseStyle, stat.iconBgColor)}>
                {React.cloneElement(stat.icon, { className: "h-16 w-16 text-white opacity-80" })}
              </div>

              {/* Content */}
              <CardHeader className="relative z-10 pb-2">
                <CardTitle className={cn(titleStyle, "text-black opacity-90")}>
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pt-0">
                 {/* Use the AnimatedCounter component */}
                <AnimatedCounter
                  endValue={stat.count}
                  className={cn(countStyle, "text-neutral-700")} // White text for count
                 />
                 {/* Optional description */}
                 {/* <p className="text-xs text-white opacity-70 mt-1">+X% since last month</p> */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}