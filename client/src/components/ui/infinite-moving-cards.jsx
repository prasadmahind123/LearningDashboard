import React from "react";
// --- THIS IS THE CRITICAL FIX ---
import { motion, useAnimation } from "framer-motion"; 
// ---------------------------------
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Users, Clock } from "lucide-react";

export default function InfiniteMovingCards({
  items,
  direction = "right", // Default set to right
  speed = "normal",
  className,
}) {
  const controls = useAnimation();
  const duration = speed === "fast" ? 15 : speed === "slow" ? 40 : 25;

  // This function defines and starts the seamless animation
  const startAnimation = () => {
    // We use keyframes to define a loop.
    // [A, B, C] + [A, B, C]
    // For "right", we animate from -50% (the start of the 2nd list) to 0% (the start of the 1st list).
    // When it repeats, it jumps from 0% back to -50%, which looks identical.
    const animationProps =
      direction === "left"
        ? { x: ["0%", "-50%"] } // Animate from 1st list start to 2nd list start
        : { x: ["-50%", "0%"] }; // Animate from 2nd list start to 1st list start

    controls.start(animationProps, {
      duration,
      repeat: Infinity,
      repeatType: "loop",
      ease: "linear",
    });
  };

  // Set the correct initial position for the animation to start from
  const initialX = direction === "left" ? "0%" : "-50%";

  React.useEffect(() => {
    startAnimation();
    // Stop animation on component unmount
    return () => controls.stop();
  }, [controls, direction, duration]); // Re-run if props change

  return (
    <div
      className={cn(
        "w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className
      )}
    >
      <motion.div
        className="flex w-max min-w-full flex-nowrap gap-6 will-change-transform"
        initial={{ x: initialX }} // Apply the correct starting position
        animate={controls}
        onMouseEnter={() => controls.stop()} // Pause on hover
        onMouseLeave={startAnimation} // Resume on leave
      >
        {/* We render the list twice for the seamless loop */}
        {[...items, ...items].map((item, idx) => (
          <Card item={item} key={idx} />
        ))}
      </motion.div>
    </div>
  );
}

// --- CARD COMPONENT (UNCHANGED) ---
// This component is fine and does not need changes.
const Card = ({ item }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ease: "easeOut" }} 
      whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
      className="overflow-hidde h-full w-96 rounded-xl border-2 bg-card transition-all duration-300 p-4">
      <Link to={`/courses/learning-path/${item._id}`} className="block group">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            className="w-full h-full object-cover transition-transform  group-hover:scale-105"
          />
          <Badge 
            variant="secondary"
            className="absolute bottom-3 left-3 text-xs bg-white text-black/80 shadow-md">
            {item.category}
          </Badge>
        </div>
      </Link>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-1">
            <CardTitle className="text-xl line-clamp-2 hover:text-primary transition-colors cursor-pointer">
              <Link to={`/courses/learning-path/${item._id}`}>{item.title}</Link>
            </CardTitle>
          <Badge variant="outline" className="text-xs shrink-0">
            {item.level}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 min-h-10">{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">{item.rating || 4.5}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{item.learners?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{item.duration || "N/A"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">${item.price || "Free"}</span>
            {item.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">${item.originalPrice}</span>
            )}
          </div>
          <Button size="sm" asChild>
            <Link to={`/courses/learning-path/${item._id}`}>View Path</Link>
          </Button>
        </div>
      </CardFooter>
    </motion.div>
  );
};