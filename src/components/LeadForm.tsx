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
// Webhook URL for form submissions - verified correct URL
const WEBHOOK_URL = "https://hook.eu2.make.com/ubp6paow7pbkq1kibybtaz1ncbfx7cf9";

// Sample test data for webhook debugging
const TEST_DATA = {
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  phone: "5551234567",
  description: "This is a test submission to verify webhook connectivity."
};

// Debug mode flag - set to false in production
const DEBUG_MODE = true;

interface LeadFormProps {
  type?: "download" | "contact"; // "download" includes PDF download, "contact" is just a form submission
  title?: string;
  showEbookCover?: boolean;
}

const LeadForm = ({ 
  type = "download", 
  title = "Download Your Free Franchise Guide",
  showEbookCover = true 
}: LeadFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [webhookSuccess, setWebhookSuccess] = useState<boolean | null>(null);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    description: "",
  });

  // Debug logger
  const debugLog = (message: string, data?: any) => {
    if (DEBUG_MODE) {
      console.log(`[LeadForm] ${message}`, data || '');
    }
  };

  // Test webhook with sample data
  const testWebhook = async () => {
    setIsTestingWebhook(true);
    debugLog("Testing webhook with sample data", TEST_DATA);
    
    try {
      // Directly call curl from browser console for additional verification
      console.log('%c[TEST] Run this curl command in terminal to test webhook:', 'background: #333; color: #fff; padding: 4px 8px; border-radius: 4px;');
      console.log(`curl -X POST "${WEBHOOK_URL}" \\
-H "Content-Type: application/json" \\
-d '${JSON.stringify(TEST_DATA)}'`);
      
      // Use our sendToWebhook function with test data
      const result = await sendToWebhook(TEST_DATA);
      
      if (result) {
        toast({
          title: "Webhook Test Successful",
          description: "The webhook connection was tested successfully.",
        });
      } else {
        toast({
          title: "Webhook Test Failed",
          description: "The webhook test failed. Check console for details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Webhook test error:", error);
      toast({
        title: "Webhook Test Error",
        description: "An error occurred during the webhook test. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendToWebhook = async (data: FormData): Promise<boolean> => {
    debugLog("Sending data to webhook", data);
    try {
      // Prepare the payload with additional metadata
      const payload = {
        ...data,
        // Format phone number - remove non-numeric characters
        phone: data.phone ? data.phone.replace(/\D/g, '') : '',
        adminEmail: ADMIN_EMAIL,
        timestamp: new Date().toISOString(),
        formType: type,
        source: window.location.href,
        userAgent: navigator.userAgent
      };
      
      debugLog("Webhook payload", payload);
      console.log('%c[WEBHOOK] Sending to: ' + WEBHOOK_URL, 'background: #f5f5f5; color: #0077cc; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
      console.log('%c[WEBHOOK] Payload: ', 'background: #f5f5f5; color: #0077cc; font-weight: bold; padding: 4px 8px; border-radius: 4px;', payload);
      
      // Send form data to the Make.com webhook
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        // Don't use no-cors mode as it prevents us from seeing proper responses
        body: JSON.stringify(payload),
      });
      
      // Log response details for debugging
      console.log('%c[WEBHOOK] Response Status: ' + response.status, 'background: #f5f5f5; color: #0077cc; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
      
      // Check if request was successful
      if (!response.ok) {
        console.error('[WEBHOOK] Error Response:', response.status, response.statusText);
        try {
          const errorText = await response.text();
          console.error('[WEBHOOK] Error Response Body:', errorText);
        } catch (e) {
          console.error('[WEBHOOK] Could not read error response body');
        }
        setWebhookSuccess(false);
        return false;
      }
      
      // Try to get the response body
      try {
        const responseData = await response.text();
        console.log('%c[WEBHOOK] Response Data:', 'background: #f5f5f5; color: #22cc66; font-weight: bold; padding: 4px 8px; border-radius: 4px;', responseData);
      } catch (e) {
        console.log('[WEBHOOK] Could not parse response data:', e);
      }
      
      debugLog("Webhook response successful", { status: response.status });
      setWebhookSuccess(true);
      return true;
    } catch (error) {
      console.error('%c[WEBHOOK] Error:', 'background: #f5f5f5; color: #cc2222; font-weight: bold; padding: 4px 8px; border-radius: 4px;', error);
      debugLog("Error sending data to webhook", error);
      setWebhookSuccess(false);
      return false;
    }
  };

  const downloadPDF = (): boolean => {
    if (type !== "download") return false;
    
    debugLog("Attempting to download PDF");
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
      
      debugLog("PDF download successful");
      return true;
    } catch (error) {
      debugLog("Error downloading PDF", error);
      console.error("Error downloading PDF:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    debugLog("Form submission started", formData);
    
    // Reset status flags
    setWebhookSuccess(null);
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      debugLog("Form validation failed: Missing required fields");
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
      debugLog("Form validation failed: Invalid email format", formData.email);
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
      const webhookResult = await sendToWebhook(formData);
      
      if (!webhookResult) {
        throw new Error("Failed to submit form to webhook");
      }
      
      // Success handling
      toast({
        title: "Success!",
        description: type === "download" 
          ? "Thank you for your submission! You'll receive the franchise guide shortly."
          : "Your form has been submitted successfully!",
      });
      
      // If this is a download form, show a success message with download option
      if (type === "download") {
        // Add a delay before showing the manual download option
        setTimeout(() => {
          toast({
            title: "Want to download the guide now?",
            description: (
              <div className="mt-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="w-full"
                  onClick={downloadPDF}
                >
                  Download PDF
                </Button>
              </div>
            ),
            duration: 10000, // Extended duration to allow user to click
          });
        }, 2000);
      }
      
      // Reset form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        description: "",
      });
      
      debugLog("Form submission completed successfully", { webhookResult });
      
    } catch (error) {
      debugLog("Form submission error", error);
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
      <div className={`grid ${showEbookCover ? 'md:grid-cols-2' : ''} gap-0`}>
        {/* Ebook Cover - Only shown for download type and when showEbookCover is true */}
        {type === "download" && showEbookCover && (
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
        )}
        
        {/* Form */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
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
                    className="input-franchise w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-success-500 focus:border-transparent"
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
                    className="input-franchise w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-success-500 focus:border-transparent"
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
                  className="input-franchise w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-success-500 focus:border-transparent"
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
                  className="input-franchise w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-success-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  {type === "download" ? "Tell us about yourself (Optional)" : "About You (Optional)"}
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-franchise w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-success-500 focus:border-transparent resize-none"
                  placeholder={type === "download" ? "Tell us about your interest in franchising..." : "Tell us about your interest in franchising..."}
                ></textarea>
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                >
                  {type === "download" ? "Get Free Guide" : "Submit Request"}
                </Button>
              </div>
              
              {/* Debug information - only shown in debug mode */}
              {DEBUG_MODE && (
                <div className="mt-4 p-3 bg-gray-100 rounded-md text-xs">
                  <p className="font-semibold">Debug Info:</p>
                  <p>Form Type: {type}</p>
                  <p>Webhook Status: {webhookSuccess === null ? 'Not attempted' : webhookSuccess ? 'Success' : 'Failed'}</p>
                  <p>Request Time: {new Date().toLocaleTimeString()}</p>
                  
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="font-semibold mb-2">Webhook Testing:</p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="w-full text-xs"
                      isLoading={isTestingWebhook}
                      onClick={testWebhook}
                    >
                      Test Webhook with Sample Data
                    </Button>
                    <p className="mt-2 text-xs text-gray-500">
                      Check browser console for curl command and detailed logs.
                    </p>
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-4">
                By submitting this form, you agree to receive franchise information and occasional emails about franchising opportunities. 
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
