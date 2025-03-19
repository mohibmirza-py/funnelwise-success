
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-10",
      scrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img 
            src="/lovable-uploads/ea74c930-6d85-45ed-9bf6-e77dd589877c.png" 
            alt="Success Franchising" 
            className="h-12 md:h-14 w-auto object-contain"
          />
        </div>
        
        {/* Header Text */}
        <div className={cn(
          "hidden md:block text-gray-700 font-medium transition-all duration-300",
          scrolled ? "text-sm" : "text-base"
        )}>
          Want to build a successful business through franchising?
        </div>
      </div>
    </header>
  );
};

export default Header;
