import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, BookOpen } from "lucide-react";
import { useAppContext } from "../context/AppContext"; // Fixed import path to relative
import { cn } from "@/lib/utils";

// Reusable Counter component
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
export default function AnimatedStatsCards() {
  const { learners = [], teachers = [], paths = [] } = useAppContext();

  // Define base styles and variant styles
  const cardBaseStyle = "relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out group border-0";
  const iconContainerBaseStyle = "absolute -top-3 -right-3 p-4 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 scale-110 group-hover:scale-125";
  const titleStyle = "text-sm font-medium uppercase tracking-wider opacity-90";
  const countStyle = "mt-1";

  const stats = [
    {
      title: "Total Learners",
      count: learners?.length || 0,
      icon: <Users className="h-10 w-10" />,
      gradient: "from-blue-600 to-indigo-600",
      iconBgColor: "bg-white",
    },
    {
      title: "Active Instructors",
      count: teachers?.filter(t => t.status === 'approved').length || 0,
      icon: <UserCheck className="h-10 w-10" />,
      gradient: "from-emerald-600 to-teal-600",
      iconBgColor: "bg-white",
    },
    {
      title: "Available Paths",
      count: paths?.length || 0,
      icon: <BookOpen className="h-10 w-10" />,
      gradient: "from-purple-600 to-pink-600",
      iconBgColor: "bg-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={cn(
            cardBaseStyle,
            `bg-gradient-to-br ${stat.gradient}`,
            "text-white"
          )}
        >
          {/* Decorative Icon Background */}
          <div className={cn(iconContainerBaseStyle, stat.iconBgColor)}>
            {React.cloneElement(stat.icon, { className: "h-16 w-16 text-black opacity-50" })}
          </div>

          {/* Content */}
          <CardHeader className="relative z-10 pb-2">
            <CardTitle className={cn(titleStyle, "text-white")}>
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 pt-0">
            <AnimatedCounter
              endValue={stat.count}
              className={cn(countStyle, "text-white")}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}