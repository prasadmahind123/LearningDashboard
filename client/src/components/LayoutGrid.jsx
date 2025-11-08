"use client";
import React from "react";
import { LayoutGrid } from "./ui/layout-grid"; // Make sure this path is correct
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
export default function LayoutGridDemo () {
  return (
    <div className="h-screen  w-full mb-20">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center "
      >
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-2">
          Interactive Dashboard Modules
        </h1>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
          Explore the interactive learning paths, analytics, and management tools that empower your experience.
        </p>
      </motion.div>
      <LayoutGrid cards={cards} />
    </div>
  );
}

// Content for Personalized Dashboards
const SkeletonDashboard = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Learner Dashboard
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Dedicated, data-rich dashboards for Learners. Track progress, view upcoming courses, and get personalized recommendations all in one place.
      </p>
    </div>
  );
};

// Content for Progress Tracking
const SkeletonProgress = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Path Creation & Management
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Intuitive tools for creating and managing learning paths. Easily organize courses, set milestones, and monitor learner progress with our user-friendly interface.
      </p>
    </div>
  );
};

// Content for Browsing Courses
const SkeletonBrowse = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Admin Panel
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Comprehensive admin panel for managing users, courses, and site settings. Gain insights with analytics and ensure smooth operation of the learning platform.
      </p>
    </div>
  );
};

// Content for Path Creation
const SkeletonCreate = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Teacher Dashboard
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Comprehensive tools for teachers to create, manage, and analyze their learning paths. From content creation to student performance tracking, everything you need is at your fingertips.
      </p>
    </div>
  );
};

// Data structure for your project
const cards = [
  {
    id: 1,
    content: <SkeletonDashboard />,
    className: "md:col-span-2",
    thumbnail: "/learnerDash.png", // Using your project's image
  },
  {
    id: 2,
    content: <SkeletonProgress />,
    className: "col-span-1",
    thumbnail: "/pathCreation.png", // Using your project's image
  },
  {
    id: 3,
    content: <SkeletonBrowse />,
    className: "col-span-1",
    thumbnail: "/adminPanel.png", // Using your project's image
  },
  {
    id: 4,
    content: <SkeletonCreate />,
    className: "md:col-span-2",
    thumbnail: "/teacherDash.png", // Using your project's image
  },
];