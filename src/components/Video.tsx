
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface VideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

const Video: React.FC<VideoProps> = ({
  src,
  poster,
  className,
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoaded = () => {
      setIsLoading(false);
    };

    videoElement.addEventListener("loadeddata", handleLoaded);
    
    return () => {
      videoElement.removeEventListener("loadeddata", handleLoaded);
    };
  }, []);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg animate-pulse">
          <svg className="w-12 h-12 text-success-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      <video
        ref={videoRef}
        className={cn(
          "w-full rounded-lg shadow-lg transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Video;
