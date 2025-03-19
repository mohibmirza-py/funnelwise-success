
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/Button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="text-center max-w-md">
        <div className="inline-block bg-success-100 text-success-700 py-1 px-3 rounded-full text-sm font-medium mb-4">
          404 Error
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Page Not Found
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <Button
          variant="primary"
          onClick={() => window.location.href = "/"}
          className="inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
