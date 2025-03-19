
import React, { useState, useEffect } from "react";
import Button from "./Button";
import { cn } from "@/lib/utils";

const StickyFooter = () => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Show the footer after scrolling past the hero section (adjust threshold as needed)
      const threshold = window.innerHeight * 0.5;
      setVisible(window.scrollY > threshold);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleBookCall = () => {
    // This is a placeholder. Replace with your actual booking URL
    window.open("https://meetings.hubspot.com/adrienne-deli", "_blank");
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 transform glass-effect",
      visible ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="max-w-7xl mx-auto py-4 px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-800 font-medium text-center sm:text-left mb-2 sm:mb-0">
          Take the first step towards business success. Book a free consultation today.
        </p>
        <Button
          variant="primary"
          onClick={handleBookCall}
          className="whitespace-nowrap animate-pulse-subtle"
        >
          Book a Free Call with Adrienne
        </Button>
      </div>
    </div>
  );
};

export default StickyFooter;
