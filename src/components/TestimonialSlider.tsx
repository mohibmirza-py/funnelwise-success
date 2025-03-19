
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  videoUrl: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Clint Tabon",
    role: "Focal Point Business Coaching",
    quote: "Adrienne is the reason behind my success. Her expertise helped me scale my franchise business beyond what I imagined!",
    videoUrl: "https://drive.google.com/file/d/1xYDMkLrAJZeJqREbchF8UOq0IzSrGhHW/preview"
  },
  {
    id: 2,
    name: "Michael Harding",
    role: "Owner, Five Star Painting",
    quote: "I wasn't sure if franchising was right for me, but Adrienne's guidance made all the difference. Best decision I ever made.",
    videoUrl: "https://drive.google.com/file/d/1-cawDbamZHUfS_hclZVfvlv7HllrD-ZL/preview"
  }
];

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Required distance in pixels for swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  return (
    <div className="relative overflow-hidden rounded-lg bg-white shadow-xl">
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10">
        <button
          onClick={prevSlide}
          className="rounded-full bg-white/80 p-2 shadow-md hover:bg-white transition-colors duration-200"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-6 w-6 text-success-600" />
        </button>
      </div>
      
      <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10">
        <button
          onClick={nextSlide}
          className="rounded-full bg-white/80 p-2 shadow-md hover:bg-white transition-colors duration-200"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-6 w-6 text-success-600" />
        </button>
      </div>
      
      <div 
        className="testimonial-container" 
        ref={sliderRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-item p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                <iframe
                  src={testimonial.videoUrl}
                  className="w-full h-full"
                  title={`Testimonial from ${testimonial.name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              
              <div>
                <div className="mb-4">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-success-200">
                    <path d="M14.4 24H8V16.8C8 13.4392 10.7168 10.7232 14.08 10.72H14.4C15.7256 10.72 16.8 9.6456 16.8 8.32V3.2C16.8 1.8744 15.7256 0.8 14.4 0.8H14.08C5.5376 0.8 0 6.352 0 14.8V38.4C0 42.4168 3.264 45.68 7.28 45.6H14.4C18.416 45.68 21.68 42.4168 21.68 38.4V31.28C21.68 27.264 18.416 24 14.4 24ZM40.72 24H34.32V16.8C34.32 13.4392 37.0368 10.7232 40.4 10.72H40.72C42.0456 10.72 43.12 9.6456 43.12 8.32V3.2C43.12 1.8744 42.0456 0.8 40.72 0.8H40.4C31.8576 0.8 26.32 6.352 26.32 14.8V38.4C26.32 42.4168 29.584 45.68 33.6 45.6H40.72C44.736 45.68 48 42.4168 48 38.4V31.28C48 27.264 44.736 24 40.72 24Z" fill="currentColor"/>
                  </svg>
                </div>
                
                <blockquote className="text-lg md:text-xl text-gray-700 italic mb-6">
                  {testimonial.quote}
                </blockquote>
                
                <div>
                  <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                  <div className="text-success-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Dots */}
      <div className="flex justify-center gap-2 pb-4">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to testimonial ${index + 1}`}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              currentIndex === index ? "bg-success-600 w-6" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;
