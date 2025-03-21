
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Button from "./Button";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  description: string;
}

// Configuration constants
const PDF_FILENAME = "40 Reasons to Start a Franchise.pdf";
const ADMIN_EMAIL = "damil.alantoai@gmail.com";
const WEBHOOK_URL = "https://hook.eu2.make.com/f1jihzggkcmynqjngsnmckswbi7ixg7m";

const LeadForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendToWebhook = async (data: FormData) => {
    try {
      // Send form data to the Make.com webhook
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Handle CORS issues
        body: JSON.stringify({
          ...data,
          adminEmail: ADMIN_EMAIL,
          timestamp: new Date().toLocaleString(),
          source: window.location.href
        }),
      });
      
      console.log("Data sent to webhook successfully");
      return true;
    } catch (error) {
      console.error("Error sending data to webhook:", error);
      return false;
    }
  };

  const downloadPDF = () => {
    try {
      // Create a temporary anchor element
      const link = document.createElement("a");
      
      // Set the PDF URL - using a public file in your app
      link.href = "/FINAL 40 Reasons to Start a Franchise (6).pdf";
      
      // Set download attribute and filename
      link.download = PDF_FILENAME;
      
      // Append to the document (necessary for Firefox)
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Remove the element
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error("Error downloading PDF:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Send data to webhook
      await sendToWebhook(formData);
      
      // Download the PDF immediately
      const downloadSuccess = downloadPDF();
      
      // Success handling
      toast({
        title: "Success!",
        description: downloadSuccess 
          ? "Your free franchise guide is downloading now!" 
          : "Thank you for your submission! There was an issue with the automatic download. Please check your email for the guide.",
      });
      
      // Reset form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        description: "",
      });
      
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Something went wrong",
        description: "Unable to process your request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden" id="lead-form">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Ebook Cover */}
        <div className="bg-success-50 p-8 flex items-center justify-center">
          <div className="relative max-w-xs w-full mx-auto">
            <div className="absolute inset-0 bg-success-500/10 rounded-lg transform rotate-3"></div>
            <div className="relative bg-white rounded-lg shadow-lg p-6 transform -rotate-2 transition-transform hover:rotate-0 duration-300">
              <div className="text-center">
                <div className="text-success-600 uppercase tracking-wider text-sm font-semibold mb-2">Free Guide</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Franchise Success Blueprint</h3>
                <div className="w-24 h-1 bg-success-500 mx-auto mb-4"></div>
                <p className="text-gray-600 mb-6">40 Reasons to Start a Franchise, 8 Reasons Not To & 8 Steps to Find the Right One for Success</p>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-success-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Download Your Free Franchise Guide</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="input-franchise"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="input-franchise"
                    placeholder="Your last name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="input-franchise"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-franchise"
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Tell us about yourself (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-franchise resize-none"
                  placeholder="I'm interested in franchising because..."
                ></textarea>
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Download PDF
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                By submitting this form, you agree to receive the free guide and occasional emails about franchising opportunities. 
                We respect your privacy and will never share your information.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadForm;
