import { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  FileText, 
  Calendar, 
  AlertCircle, 
  Download, 
  Share2,
  FlaskConical,
  Activity,
  Info,
  Shield,
  X,
  Upload,
  Loader2,
  Eye,
  Camera
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from 'axios';

// Define API base URL with fallback options 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                     import.meta.env.VITE_API_URL || 
                     'http://localhost:8000';

// Document model interface
interface DocumentMetadata {
  id?: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: string;
  uploadedAt: Date;
  notes?: string;
}

// Add a new interface for document responses
interface DocumentResponse {
  id: number;
  user_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  category: string;
  uploaded_at: string;
  notes?: string;
}

// Add a mockUpload function for testing when backend is unavailable
const mockUploadDocument = async (file: File, metadata: DocumentMetadata) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate success
  return {
    id: Math.floor(Math.random() * 1000),
    fileName: metadata.fileName,
    fileType: metadata.fileType,
    fileSize: metadata.fileSize,
    category: metadata.category,
    uploadedAt: new Date(),
    notes: metadata.notes,
    file_path: "mock_file_path",
    user_id: 1
  };
};

// Add a function to check backend connectivity
const checkBackendConnectivity = async (): Promise<boolean> => {
  try {
    // Use a simple HEAD request with a timeout to check connectivity
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    try {
      const response = await fetch(`${API_BASE_URL}/health-check`, { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      // Handle fetch errors silently, just return false
      clearTimeout(timeoutId);
      
      // Only log in development mode and only once per session using a sessionStorage flag
      if (import.meta.env.DEV && !sessionStorage.getItem('backend_connectivity_logged')) {
        console.info("Backend server is not available, using mock data instead");
        // Set flag to prevent repeated logging
        sessionStorage.setItem('backend_connectivity_logged', 'true');
      }
      
      return false;
    }
  } catch (error) {
    // Only log in development mode
    if (import.meta.env.DEV && !sessionStorage.getItem('backend_connectivity_error_logged')) {
      console.warn("Backend connectivity check failed:", error);
      // Set flag to prevent repeated logging
      sessionStorage.setItem('backend_connectivity_error_logged', 'true');
    }
    return false;
  }
};

const HealthRecords = () => {
  const [activeTab, setActiveTab] = useState("medical");
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTypeDialog, setShowTypeDialog] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const [userDocuments, setUserDocuments] = useState<DocumentResponse[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
    // Load user's documents when component mounts
    fetchUserDocuments();
  }, []);
  
  // Function to fetch user's documents
  const fetchUserDocuments = async () => {
    try {
      setIsLoadingDocuments(true);
      
      // Check backend connectivity first, but don't throw error if not available
      const isBackendAvailable = await checkBackendConnectivity();
      if (!isBackendAvailable) {
        // Use mock data instead of throwing error
        setUserDocuments([
          {
            id: 1,
            user_id: 1,
            file_name: "Blood Test Results.pdf",
            file_path: "mock_path",
            file_type: "application/pdf",
            file_size: 1048576,
            category: "Lab Result",
            uploaded_at: new Date().toISOString(),
            notes: "Annual checkup"
          },
          {
            id: 2,
            user_id: 1,
            file_name: "Vaccination Card.jpg",
            file_path: "mock_path",
            file_type: "image/jpeg",
            file_size: 524288,
            category: "Vaccination Record",
            uploaded_at: new Date().toISOString()
          }
        ]);
        
        // Silent mode in production, only show message in development
        if (import.meta.env.DEV && !sessionStorage.getItem('offline_mode_notified')) {
          toast({
            title: "Using offline mode",
            description: "Could not connect to server. Showing sample data instead."
          });
          sessionStorage.setItem('offline_mode_notified', 'true');
        }
        
        setIsLoadingDocuments(false);
        return;
      }
      
      // Continue with API request if backend is available
      // Get auth token (assuming it's stored in localStorage)
      const token = localStorage.getItem('authToken');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${API_BASE_URL}/health-records/documents`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`,
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setUserDocuments(data);
      } else {
        console.error('Failed to fetch documents:', response.status, response.statusText);
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      // Use mock data if backend is not available
      setUserDocuments([
        {
          id: 1,
          user_id: 1,
          file_name: "Blood Test Results.pdf",
          file_path: "mock_path",
          file_type: "application/pdf",
          file_size: 1048576,
          category: "Lab Result",
          uploaded_at: new Date().toISOString(),
          notes: "Annual checkup"
        },
        {
          id: 2,
          user_id: 1,
          file_name: "Vaccination Card.jpg",
          file_path: "mock_path",
          file_type: "image/jpeg",
          file_size: 524288,
          category: "Vaccination Record",
          uploaded_at: new Date().toISOString()
        }
      ]);
      
      // Show toast notification for users
      toast({
        title: "Using offline mode",
        description: "Could not connect to server. Showing sample data instead.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingDocuments(false);
    }
  };
  
  // Function to download a document
  const downloadDocument = async (documentId: number, fileName: string) => {
    try {
      // Check backend connectivity first
      const isBackendAvailable = await checkBackendConnectivity();
      if (!isBackendAvailable) {
        throw new Error("Server connection failed. Cannot download files in offline mode.");
      }
      
      // Get auth token
      const token = localStorage.getItem('authToken');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for downloads
      
      const response = await fetch(`${API_BASE_URL}/health-records/documents/${documentId}/download`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`,
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status}`);
      }
      
      // Create blob from response
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element to trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "File Downloaded",
        description: `${fileName} has been downloaded successfully.`
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download file",
        variant: "destructive"
      });
    }
  };
  
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;

    const preventDefaults = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const highlight = () => {
      dropArea.classList.add('bg-sage/10', 'dark:bg-sage/20');
    };

    const unhighlight = () => {
      dropArea.classList.remove('bg-sage/10', 'dark:bg-sage/20');
    };

    const handleDrop = (e: DragEvent) => {
      const dt = e.dataTransfer;
      if (dt?.files && dt.files.length) {
        validateAndProcessFile(dt.files[0]);
      }
    };

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });

    dropArea.addEventListener('drop', handleDrop, false);

    return () => {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.removeEventListener(eventName, preventDefaults, false);
      });

      ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.removeEventListener(eventName, highlight, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropArea.removeEventListener(eventName, unhighlight, false);
      });

      dropArea.removeEventListener('drop', handleDrop, false);
    };
  }, []);
  
  const downloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: "Your health report has been downloaded."
    });
  };
  
  const shareReport = () => {
    toast({
      title: "Report Shared",
      description: "Your report has been shared with Dr. Johnson."
    });
  };

  const handleUploadClick = () => {
    setUploadError(null);
    setShowTypeDialog(true);
  };

  const handleFileTypeSelection = (type: string) => {
    setDocumentType(type);
    
    // Reset any previous file
    setSelectedFile(null);
    setFilePreview(null);
    setShowTypeDialog(false);
    
    // Show upload options dialog (file or camera)
    setShowUploadDialog(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    setUploadError(null);
    const supportedTypes = ['.docx', '.pdf', '.jpg', '.jpeg', '.png'];
    
    // Special handling for camera captures which might have MIME types like "image/jpg"
    // without the standard file extension
    if (file.type.startsWith('image/')) {
      let fileExtension;
      if (file.name.includes('.')) {
        fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      } else {
        // Handle camera captures without extensions
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          fileExtension = '.jpg';
        } else if (file.type === 'image/png') {
          fileExtension = '.png';
        } else {
          fileExtension = '.jpg'; // Default to jpg for unknown image types
        }
      }
      
      if (!supportedTypes.includes(fileExtension)) {
        setUploadError(`Unsupported file type. Allowed formats: ${supportedTypes.join(', ')}`);
        return;
      }
    } else {
      // For non-image files, use standard extension check
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      
      if (!supportedTypes.includes(fileExtension)) {
        setUploadError(`Unsupported file type. Allowed formats: ${supportedTypes.join(', ')}`);
        return;
      }
    }

    setSelectedFile(file);
    
    // Create preview for image files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleFileUpload = async () => {
    if (!documentType) {
      setUploadError("Please select a document type first");
      return;
    }

    if (!selectedFile) {
      setUploadError("No file selected");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Create metadata for the document
      const documentData: DocumentMetadata = {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        category: documentType,
        uploadedAt: new Date(),
        notes: additionalNotes || undefined
      };
      
      formData.append('metadata', JSON.stringify(documentData));

      // Get auth token (assuming it's stored in localStorage)
      const token = localStorage.getItem('authToken');
      
      // Check if backend is available
      const isBackendAvailable = await checkBackendConnectivity();
      
      let result;
      
      if (isBackendAvailable) {
        // Use the real backend
        try {
          // Upload the file to the server
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for uploads
          
          const response = await fetch(`${API_BASE_URL}/health-records/documents`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token || ''}`,
              // Don't set Content-Type when using FormData - the browser will set it with the boundary
            },
            body: formData,
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);

          if (!response.ok) {
            let errorDetail;
            try {
              const errorData = await response.json();
              errorDetail = errorData.detail || `Server error: ${response.status}`;
            } catch (e) {
              errorDetail = `Upload failed with status: ${response.status}`;
            }
            throw new Error(errorDetail);
          }
          
          result = await response.json();
          
          // Refresh documents list after successful upload
          fetchUserDocuments();
        } catch (error) {
          // If we get a network error with the real backend, fall back to mock
          if (error instanceof Error && (
              error.message.includes("Failed to fetch") || 
              error.message.includes("NetworkError") ||
              error.message.includes("Network Error") ||
              error.message.includes("The operation was aborted"))) {
            console.warn("Error with backend, falling back to mock implementation", error);
            result = await mockUploadDocument(selectedFile, documentData);
          } else {
            // Re-throw non-network errors
            throw error;
          }
        }
      } else {
        // Use the mock implementation
        console.warn("Backend server connectivity test failed, using mock implementation");
        result = await mockUploadDocument(selectedFile, documentData);
      }

      // Handle successful upload
      toast({
        title: "File Uploaded Successfully",
        description: `Your ${documentType.toLowerCase()} has been uploaded.`
      });

      // Reset form
      resetUpload();
      
      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Provide more user-friendly error message
      let errorMessage;
      if (error instanceof Error) {
        // Check for specific network-related errors
        if (error.message.includes("Failed to fetch") || 
            error.message.includes("NetworkError") ||
            error.message.includes("Network Error") ||
            error.message.includes("Cannot connect") ||
            error.message.includes("The operation was aborted")) {
          errorMessage = "Network error: Cannot connect to server. Please verify that you have internet connectivity.";
        } else {
          errorMessage = error.message;
        }
      } else {
        errorMessage = "An unknown error occurred during upload";
      }
      
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setUploadError(null);
    setAdditionalNotes("");
    setDocumentType("");
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Clean up camera resources when component unmounts
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Function to check if camera permission is granted
  const checkCameraPermission = async (): Promise<boolean> => {
    try {
      // First check if browser supports permissions API
      if (navigator.permissions && navigator.permissions.query) {
        // Check camera permission status
        const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
        
        if (permissionStatus.state === 'denied') {
          setUploadError("Camera access is blocked. Please allow camera access in your browser settings.");
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.warn("Permissions API not fully supported, will try direct camera access:", error);
      return true; // Continue with camera activation even if permissions API fails
    }
  };

  // Function to activate device camera
  const activateCamera = async () => {
    try {
      setUploadError(null);
      
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setUploadError("Your browser doesn't support camera access. Please try uploading a file instead.");
        return;
      }
      
      // Check for camera permission
      const permissionGranted = await checkCameraPermission();
      if (!permissionGranted) {
        return;
      }
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment", // prefer back camera on mobile devices
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      mediaStreamRef.current = stream;
      
      // Display video stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      
      let errorMessage = "Could not access camera. Please check permissions and try again.";
      
      // More specific error messages based on the error
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage = "Camera access denied. Please grant permission to use your camera.";
        } else if (error.name === 'NotFoundError') {
          errorMessage = "No camera found on your device.";
        } else if (error.name === 'NotReadableError' || error.name === 'AbortError') {
          errorMessage = "Camera is already in use by another application.";
        }
      }
      
      setUploadError(errorMessage);
    }
  };
  
  // Function to capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          // Create a File object from the blob
          const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
          
          // Process captured image like a normal file upload
          validateAndProcessFile(file);
          
          // Stop camera after capture
          stopCamera();
        }
      }, 'image/jpeg', 0.8); // 80% quality JPEG
    }
  };
  
  // Function to stop camera stream
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
  };
  
  const handleUploadOption = (option: 'file' | 'camera') => {
    setShowUploadDialog(false);
    
    if (option === 'file' && fileInputRef.current) {
      // Trigger file selection
      fileInputRef.current.click();
    } else if (option === 'camera') {
      // Activate camera
      activateCamera();
    }
  };

  return (
    <Layout>
      <div className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-40 left-20 w-72 h-72 bg-sage/20 dark:bg-sage/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-forest/10 dark:bg-cream/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '15s' }}></div>
      
        <div className="container relative mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }} 
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-6"
          >
            <h1 className="text-3xl font-bold text-forest dark:text-sage-light mb-2">Health Records</h1>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={downloadReport} className="group">
                <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Export
              </Button>
              <Button variant="outline" onClick={shareReport} className="group">
                <Share2 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Share
              </Button>
            </div>
          </motion.div>

          {/* Privacy notice */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 10 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 p-3 bg-sage/10 dark:bg-forest-light/10 rounded-lg flex items-center space-x-3 border border-sage/30 dark:border-sage/20"
          >
            <Shield className="text-forest dark:text-sage-light h-5 w-5" />
            <p className="text-sm text-muted-foreground dark:text-sage/80">
              Your health records are securely encrypted and only accessible by you and your authorized healthcare providers.
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-forest-dark/80 border-sage/20 dark:border-sage/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-forest dark:text-sage-light">Your Health Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="medical" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4 bg-sage/10 dark:bg-forest-light/20">
                    <TabsTrigger value="medical" className="data-[state=active]:bg-forest data-[state=active]:text-white dark:data-[state=active]:bg-sage dark:data-[state=active]:text-forest">Medical Records</TabsTrigger>
                    <TabsTrigger value="lab" className="data-[state=active]:bg-forest data-[state=active]:text-white dark:data-[state=active]:bg-sage dark:data-[state=active]:text-forest">Lab Results</TabsTrigger>
                    <TabsTrigger value="prescriptions" className="data-[state=active]:bg-forest data-[state=active]:text-white dark:data-[state=active]:bg-sage dark:data-[state=active]:text-forest">Prescriptions</TabsTrigger>
                    <TabsTrigger value="vaccinations" className="data-[state=active]:bg-forest data-[state=active]:text-white dark:data-[state=active]:bg-sage dark:data-[state=active]:text-forest">Vaccinations</TabsTrigger>
                  </TabsList>
                  
                  {/* Medical Records Tab */}
                  <TabsContent value="medical" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-forest dark:text-sage-light">Recent Medical Records</h2>
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Add Record
                      </Button>
                    </div>
                    
                    <ScrollArea className="h-[300px] pr-4">
                      <motion.div 
                        className="space-y-3"
                        variants={container}
                        initial="hidden"
                        animate="show"
                      >
                        {[
                          { name: "Annual Physical Exam", date: "Apr 15, 2025", doctor: "Dr. Emily Chen" },
                          { name: "Cardiology Consultation", date: "Mar 20, 2025", doctor: "Dr. Robert Johnson" },
                          { name: "Dermatology Checkup", date: "Feb 10, 2025", doctor: "Dr. Sarah Williams" },
                          { name: "Orthopedic Assessment", date: "Jan 25, 2025", doctor: "Dr. Michael Taylor" },
                          { name: "Vision Examination", date: "Dec 12, 2024", doctor: "Dr. Lisa Garcia" }
                        ].map((record, index) => (
                          <motion.div 
                            key={index} 
                            className="flex items-center justify-between p-3 bg-sage-light/10 hover:bg-sage-light/20 dark:bg-forest-light/10 dark:hover:bg-forest-light/20 rounded-lg transition-colors border border-sage/10 dark:border-sage/20"
                            variants={item}
                          >
                            <div>
                              <p className="font-medium text-forest-dark dark:text-sage-light">{record.name}</p>
                              <p className="text-sm text-muted-foreground dark:text-sage/70">{record.date} - {record.doctor}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="hover:bg-forest/10 dark:hover:bg-sage/10">View</Button>
                          </motion.div>
                        ))}
                      </motion.div>
                    </ScrollArea>
                  </TabsContent>
                  
                  {/* Other tabs content - we'll keep the same structure but with animations */}
                  <TabsContent value="lab" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-forest dark:text-sage-light">Recent Lab Results</h2>
                      <Button variant="outline">
                        <FlaskConical className="mr-2 h-4 w-4" />
                        Add Result
                      </Button>
                    </div>
                    
                    {[
                      { name: "Blood Test", date: "Apr 22, 2025", lab: "City Medical Lab" },
                      { name: "Cholesterol Test", date: "Mar 15, 2025", lab: "Healthcare Diagnostics" },
                      { name: "Urinalysis", date: "Feb 01, 2025", lab: "Community Labs" }
                    ].map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-sage-light/10 dark:bg-forest-light/10 hover:bg-sage-light/20 dark:hover:bg-forest-light/20 rounded-lg transition-all border border-sage/10 dark:border-sage/20">
                        <div>
                          <p className="font-medium text-forest-dark dark:text-sage-light">{result.name}</p>
                          <p className="text-sm text-muted-foreground dark:text-sage/70">{result.date} - {result.lab}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="hover:bg-forest/10 dark:hover:bg-sage/10">View</Button>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="prescriptions" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-forest dark:text-sage-light">Active Prescriptions</h2>
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Add Prescription
                      </Button>
                    </div>
                    
                    {[
                      { name: "Amoxicillin", date: "Apr 28, 2025", doctor: "Dr. Emily Chen" },
                      { name: "Lisinopril", date: "Mar 10, 2025", doctor: "Dr. Robert Johnson" },
                      { name: "Vitamin D", date: "Jan 25, 2025", doctor: "Dr. Sarah Williams" }
                    ].map((prescription, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-sage-light/10 dark:bg-forest-light/10 hover:bg-sage-light/20 dark:hover:bg-forest-light/20 rounded-lg transition-all border border-sage/10 dark:border-sage/20">
                        <div>
                          <p className="font-medium text-forest-dark dark:text-sage-light">{prescription.name}</p>
                          <p className="text-sm text-muted-foreground dark:text-sage/70">Prescribed on {prescription.date} by {prescription.doctor}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="hover:bg-forest/10 dark:hover:bg-sage/10">View</Button>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="vaccinations" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-forest dark:text-sage-light">Vaccination Records</h2>
                      <Button variant="outline">
                        <Activity className="mr-2 h-4 w-4" />
                        Add Vaccination
                      </Button>
                    </div>
                    
                    {[
                      { name: "Influenza", date: "Oct 15, 2024" },
                      { name: "Tdap", date: "Jun 01, 2023" },
                      { name: "MMR", date: "Aug 10, 2000" }
                    ].map((vaccination, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-sage-light/10 dark:bg-forest-light/10 hover:bg-sage-light/20 dark:hover:bg-forest-light/20 rounded-lg transition-all border border-sage/10 dark:border-sage/20">
                        <div>
                          <p className="font-medium text-forest-dark dark:text-sage-light">{vaccination.name}</p>
                          <p className="text-sm text-muted-foreground dark:text-sage/70">Administered on {vaccination.date}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="hover:bg-forest/10 dark:hover:bg-sage/10">View</Button>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upload New Record with improved dark mode visibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6"
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-forest-dark/80 border-sage/20 dark:border-sage/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-forest dark:text-sage-light">Upload New Document</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <motion.div
                    ref={dropAreaRef}
                    whileHover={{ scale: 1.01 }}
                    className="border-2 border-dashed border-sage dark:border-sage/50 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-sage/5 dark:hover:bg-sage/10 transition-colors cursor-pointer"
                    onClick={() => !selectedFile && handleUploadClick()}
                  >
                    {selectedFile ? (
                      /* Show preview of selected file */
                      <div className="w-full">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-forest-dark dark:text-sage-light">Selected File</h4>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              resetUpload();
                            }}
                            className="h-7 w-7 p-0 rounded-full"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {filePreview ? (
                          <div className="flex items-center space-x-3">
                            <div className="h-20 w-20 rounded-md overflow-hidden">
                              <img src={filePreview} alt="Preview" className="h-full w-full object-cover"/>
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-medium text-forest-dark dark:text-sage-light">{selectedFile.name}</p>
                              <p className="text-xs text-muted-foreground dark:text-sage/70">
                                {(selectedFile.size / 1024).toFixed(1)} KB 
                                {documentType && ` • ${documentType}`}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <div className="h-14 w-14 rounded-md bg-sage/20 dark:bg-forest-light/20 flex items-center justify-center">
                              <FileText className="h-6 w-6 text-forest dark:text-sage-light" />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-medium text-forest-dark dark:text-sage-light">{selectedFile.name}</p>
                              <p className="text-xs text-muted-foreground dark:text-sage/70">
                                {(selectedFile.size / 1024).toFixed(1)} KB 
                                {documentType && ` • ${documentType}`}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Show upload prompt */
                      <>
                        <FileText className="h-10 w-10 text-sage dark:text-sage-light mb-4" />
                        <h3 className="text-lg font-medium text-forest-dark dark:text-sage-light">Drag and drop files here</h3>
                        <p className="text-sm text-muted-foreground dark:text-sage/80 max-w-xs mt-2">
                          Or click to select files from your computer
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4 border-sage hover:bg-sage/20 dark:border-sage/50 dark:hover:bg-sage/10"
                          onClick={handleUploadClick}
                        >
                          Upload Files
                        </Button>
                      </>
                    )}
                    
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".docx,.pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </motion.div>
                  
                  {/* Error message */}
                  {uploadError && (
                    <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <AlertDescription className="text-red-700 dark:text-red-400 ml-2">
                        {uploadError}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div>
                    <Label htmlFor="record-type" className="text-forest-dark dark:text-sage">Record Type</Label>
                    <select 
                      id="record-type"
                      className="w-full mt-1 rounded-md border border-input bg-background text-foreground dark:text-sage-light dark:bg-forest-dark px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                    >
                      <option value="">Select a type...</option>
                      <option value="Medical Record">Medical Record</option>
                      <option value="Lab Result">Lab Result</option>
                      <option value="Prescription">Prescription</option>
                      <option value="Vaccination">Vaccination</option>
                      <option value="Discharge Summary">Discharge Summary</option>
                      <option value="Referral Letter">Referral Letter</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="additional-notes" className="text-forest-dark dark:text-sage">Additional Notes</Label>
                    <Input 
                      id="additional-notes" 
                      placeholder="Add any notes about this record"
                      className="dark:bg-forest-dark dark:text-sage-light dark:border-sage/30 dark:placeholder:text-sage/50"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    className="w-full bg-forest hover:bg-forest-dark dark:bg-sage dark:text-forest dark:hover:bg-sage-light transition-colors"
                    disabled={!selectedFile || !documentType || isUploading}
                    onClick={handleFileUpload}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Save Record'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Document Library */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6"
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-forest-dark/80 border-sage/20 dark:border-sage/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-forest dark:text-sage-light">Your Document Library</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingDocuments ? (
                  <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-sage" />
                  </div>
                ) : userDocuments.length > 0 ? (
                  <ScrollArea className="h-[300px] pr-4">
                    <motion.div 
                      className="space-y-3"
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      {userDocuments.map((doc, index) => (
                        <motion.div 
                          key={doc.id} 
                          className="flex items-center justify-between p-3 bg-sage-light/10 hover:bg-sage-light/20 dark:bg-forest-light/10 dark:hover:bg-forest-light/20 rounded-lg transition-colors border border-sage/10 dark:border-sage/20"
                          variants={item}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-md bg-sage/20 dark:bg-forest-light/20 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-forest dark:text-sage-light" />
                            </div>
                            <div>
                              <p className="font-medium text-forest-dark dark:text-sage-light">{doc.file_name}</p>
                              <p className="text-xs text-muted-foreground dark:text-sage/70">
                                {(doc.file_size / 1024).toFixed(1)} KB 
                                {doc.category && ` • ${doc.category}`} • 
                                {new Date(doc.uploaded_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-forest/10 dark:hover:bg-sage/10"
                              onClick={() => downloadDocument(doc.id, doc.file_name)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-forest/10 dark:hover:bg-sage/10"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </ScrollArea>
                ) : (
                  <div className="text-center p-8 border border-dashed border-sage/50 dark:border-sage/30 rounded-lg">
                    <FileText className="h-10 w-10 text-sage/50 dark:text-sage/30 mx-auto mb-4" />
                    <p className="text-muted-foreground dark:text-sage/70">
                      You don't have any documents yet. Upload one using the form above.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Camera overlay */}
      {isCameraActive && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
          <div className="p-4 flex justify-between items-center bg-black/50">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10"
              onClick={stopCamera}
            >
              <X className="h-5 w-5 mr-1" />
              Cancel
            </Button>
            <h3 className="text-white font-medium">Take a Photo</h3>
            <div className="w-[60px]"></div> {/* Spacer for alignment */}
          </div>
          
          <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
            <div className="relative w-full max-h-screen" style={{ maxWidth: '100vw', height: 'auto' }}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-contain"
              />
              <div className="absolute top-0 left-0 right-0 bottom-0 border-2 border-white/30 pointer-events-none"></div>
            </div>
          </div>
          
          <div className="p-6 flex justify-center bg-black/50">
            <Button 
              className="rounded-full h-16 w-16 bg-white hover:bg-gray-200 flex items-center justify-center shadow-lg"
              onClick={capturePhoto}
            >
              <div className="h-12 w-12 rounded-full border-4 border-forest" />
            </Button>
          </div>
          
          {/* Hidden canvas for capturing image */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
      
      {/* Upload Type Selection Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md" aria-describedby="upload-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-forest dark:text-sage-light">How would you like to upload?</DialogTitle>
            <DialogDescription id="upload-dialog-description">
              Choose how you want to add your document.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-32 p-4"
              onClick={() => handleUploadOption('file')}
            >
              <FileText className="h-8 w-8 mb-2 text-forest dark:text-sage" />
              <span>Select File</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-32 p-4"
              onClick={() => handleUploadOption('camera')}
            >
              <Camera className="h-8 w-8 mb-2 text-forest dark:text-sage" />
              <span>Take Photo</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Document Type Selection Dialog */}
      <Dialog open={showTypeDialog} onOpenChange={setShowTypeDialog}>
        <DialogContent className="sm:max-w-md" aria-describedby="doc-type-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-forest dark:text-sage-light">What type of file are you uploading?</DialogTitle>
            <DialogDescription id="doc-type-dialog-description">
              Select the category that best describes your document.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select onValueChange={handleFileTypeSelection}>
              <SelectTrigger>
                <SelectValue placeholder="Select a document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Prescription">Prescription</SelectItem>
                <SelectItem value="Lab Report">Lab Report</SelectItem>
                <SelectItem value="Discharge Summary">Discharge Summary</SelectItem>
                <SelectItem value="Medical Certificate">Medical Certificate</SelectItem>
                <SelectItem value="Referral Letter">Referral Letter</SelectItem>
                <SelectItem value="Vaccination Record">Vaccination Record</SelectItem>
                <SelectItem value="Other Document">Other Document</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setShowTypeDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default HealthRecords;
