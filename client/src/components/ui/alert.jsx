import React from "react";
import clsx from "clsx";

export function Alert({ variant = "default", className = "", children }) {
  return (
    <div
      className={clsx(
        "w-full rounded-md border px-4 py-3 text-sm flex items-start",
        variant === "destructive"
          ? "bg-red-50 border-red-200 text-red-700"
          : "bg-blue-50 border-blue-200 text-blue-700",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AlertDescription({ className = "", children }) {
  return <div className={clsx("flex-1", className)}>{children}</div>;
}
