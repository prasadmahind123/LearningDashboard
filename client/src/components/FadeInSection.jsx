// src/components/FadeInSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils"; // Assuming you have this utility from shadcn/ui

export default function FadeInSection(props) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      // In your case we're observing only one element at a time:
      // entries[0] is the element that is being observed
      if (entries[0].isIntersecting) {
        setVisible(true);
        // No need to keep observing:
        observer.unobserve(domRef.current);
      }
    });

    const { current } = domRef; // Capture current ref value
    observer.observe(current);

    return () => {
      if (current) { // Check if current exists before unobserving
        observer.unobserve(current);
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div
      // Use cn to combine base class, conditional class, and props.className
      className={cn(
        'fade-in-section', // Base class for initial state and transition
        { 'is-visible': isVisible }, // Conditional class when visible
        props.className // Allow passing additional classes
      )}
      ref={domRef}
    >
      {props.children}
    </div>
  );
}