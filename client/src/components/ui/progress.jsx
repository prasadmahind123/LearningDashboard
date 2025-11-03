import * as React from "react";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef(({ className, value = 0, color = "rgb(34 197 94)" }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full h-2 overflow-hidden rounded-full bg-gray-200",
        className
      )}
    >
      <div
        className="h-full transition-all duration-500 ease-out"
        style={{
          width: `${value}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
});
Progress.displayName = "Progress";

export { Progress };
