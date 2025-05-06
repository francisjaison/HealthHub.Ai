import { useState, useRef, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Camera, Clock, FileText, UploadCloud, Pill, AlertTriangle, Calendar, Info, Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import createWorker dynamically to avoid build errors
// We'll use a safer approach with conditional imports
let TesseractImport: any = null;

// Interface for prescription data
interface Prescription {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  doctor: string;
  date: string;
  status: "active" | "expired" | "upcoming";
}

const Ocr = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPrescription, setCurrentPrescription] = useState<Prescription | null>(null);
  const [tesseractLoaded, setTesseractLoaded] = useState(false);
  const [tesseractError, setTesseractError] = useState<string | null>(null);
  
  const [scannedPrescriptions, setScannedPrescriptions] = useState<Prescription[]>([
    {
      id: "rx-123456",
      name: "Amoxicillin",
      dosage: "500mg",
      frequency: "3 times per day",
      duration: "7 days",
      doctor: "Dr. Emily Chen",
      date: "2025-04-28",
      status: "active"
    }
  ]);

  // Load Tesseract.js dynamically
  useEffect(() => {
    const loadTesseract = async () => {
      try {
        // Dynamic import for Tesseract
        const tesseractModule = await import('tesseract.js');
        TesseractImport = tesseractModule;
        setTesseractLoaded(true);
      } catch (error) {
        console.error("Failed to load Tesseract.js:", error);
        setTesseractError("Failed to load OCR engine. Using mockup mode instead.");
      }
    };
    
    loadTesseract();
  }, []);

  // Function to process image using Tesseract OCR
  const processImageWithTesseract = async (imageFile: File) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    try {
      // Check if Tesseract is loaded
      if (!tesseractLoaded || !TesseractImport) {
        console.log("Tesseract not loaded, falling back to mock data");
        simulateOcrProcessing(imageFile);
        return;
      }
      
      // Set up manual progress updates
      const progressUpdate = (progress: number) => {
        setProcessingProgress(Math.floor(progress * 100));
      };
      
      progressUpdate(10); // Starting
      
      try {
        // Create worker with English language in the v5+ way - no logger callback to avoid DataCloneError
        console.log("Creating Tesseract worker with language: eng");
        
        // Use Tesseract.js v5+ API with proper options
        const worker = await TesseractImport.createWorker('eng', {
          // Enable all output formats for maximum data extraction
          blocks: true,
          hocr: true,
          tsv: true,
        });
        
        console.log("Worker created successfully");
        progressUpdate(50); // Worker created and language loaded
        
        // Recognize text from image with improved settings
        progressUpdate(70); // Starting recognition
        console.log("Starting OCR recognition process");
        
        // Add preprocessing options to improve recognition quality
        const result = await worker.recognize(imageFile, {
          rotateAuto: true, // Auto-rotate if needed
          rotateAngle: 0,    // Initial angle if no auto-rotation
          contrast: 1.5,     // Increase contrast slightly
          classify_bln_numeric_mode: 1, // Better for text with numbers
        });
        
        console.log("Recognition completed successfully");
        console.log("Result data:", JSON.stringify(result.data.text.substring(0, 100) + "..."));
        progressUpdate(90); // Recognition complete
        
        // Extract text from result
        const { data: { text } } = result;
        console.log("Extracted text length:", text.length);
        console.log("Extracted text sample:", text.substring(0, 100) + (text.length > 100 ? "..." : ""));
        setExtractedText(text);
        
        // Terminate worker after processing
        console.log("Terminating worker");
        await worker.terminate();
        console.log("Worker terminated");
        progressUpdate(100); // All done
        
        // Parse the extracted text to identify prescription details
        const prescriptionData = parsePrescriptionText(text);
        setCurrentPrescription(prescriptionData);
        
        // UI updates
        setIsProcessing(false);
        setHasUploaded(true);
        
        toast({
          title: "Image processed successfully",
          description: text.length > 10 
            ? "Text extracted from your image." 
            : "Very little text detected. Try a clearer image."
        });
      } catch (workerError) {
        console.error("Error in Tesseract worker process:", workerError);
        throw workerError; // Re-throw to be caught by the outer try/catch
      }
    } catch (error) {
      console.error("OCR processing error:", error);
      // Show a more informative error message
      toast({
        title: "OCR Processing Failed",
        description: "Unable to process the image. Try a clearer image with good lighting.",
        variant: "destructive"
      });
      
      // Only use simulation if there's an error with the actual OCR
      simulateOcrProcessing(imageFile);
    }
  };

  // Fallback function to simulate OCR processing
  const simulateOcrProcessing = (imageFile: File) => {
    console.log("Using simulated OCR processing");
    
    // Create a simulated progress
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Generate a more realistic prescription based on the image filename
    // This helps provide a feeling of different results for different images
    const generatePrescriptionForFile = () => {
      const fileName = imageFile.name.toLowerCase();
      
      // Generate different prescriptions based on filename patterns
      if (fileName.includes("lisinopril") || fileName.includes("heart") || fileName.includes("bp")) {
        return {
          text: `PRESCRIPTION
Dr. Robert Johnson
123 Medical Center Avenue
Patient: John Doe
Date: 05/15/2023

Rx: Lisinopril 10mg
Take once daily with or without food
Refills: 3
Duration: 30 days

Dispense: 30 tablets
Prescriber Signature: [signature]
DEA#: AB1234567
`,
          medication: "Lisinopril",
          dosage: "10mg",
          frequency: "once daily"
        };
      } else if (fileName.includes("amoxicillin") || fileName.includes("antibiotic")) {
        return {
          text: `PRESCRIPTION
Dr. Emily Chen
City Medical Clinic
123 Healthcare Ave
Patient: Jane Smith
Date: 06/10/2023

Rx: Amoxicillin 500mg
Take three times daily with food
Refills: 0
Duration: 10 days

Dispense: 30 capsules
Prescriber Signature: [signature]
`,
          medication: "Amoxicillin",
          dosage: "500mg",
          frequency: "three times daily"
        };
      } else if (fileName.includes("atorvastatin") || fileName.includes("cholesterol")) {
        return {
          text: `PRESCRIPTION
Dr. Michael Williams
Heart & Vascular Center
Patient: Robert Brown
Date: 04/22/2023

Rx: Atorvastatin 20mg
Take once daily in the evening
Refills: 5
Duration: 90 days

Dispense: 90 tablets
Prescriber Signature: [signature]
`,
          medication: "Atorvastatin",
          dosage: "20mg",
          frequency: "once daily"
        };
      } else {
        // Default prescription
        return {
          text: `PRESCRIPTION
Dr. Robert Johnson
123 Medical Center Avenue
Patient: John Doe
Date: 05/15/2023

Rx: Metformin 500mg
Take twice daily with meals
Refills: 3
Duration: 30 days

Dispense: 60 tablets
Prescriber Signature: [signature]
DEA#: AB1234567
`,
          medication: "Metformin",
          dosage: "500mg",
          frequency: "twice daily"
        };
      }
    };

    // Simulate completion after 2 seconds
    setTimeout(() => {
      clearInterval(interval);
      setProcessingProgress(100);
      
      // Get prescription based on image name
      const prescription = generatePrescriptionForFile();
      
      // Set the extracted text
      setExtractedText(prescription.text);
      
      // Generate a prescription from the mock text
      const prescriptionData = parsePrescriptionText(prescription.text);
      setCurrentPrescription(prescriptionData);
      
      // UI updates
      setIsProcessing(false);
      setHasUploaded(true);
      
      toast({
        title: "Simulated OCR Result",
        description: tesseractError 
          ? "Using demo mode: " + tesseractError 
          : "This is a simulated result to demonstrate the OCR workflow."
      });
      
      console.log("Simulated OCR processing complete");
    }, 2000);
  };

  // Function to parse text from OCR to identify details
  const parsePrescriptionText = (text: string): Prescription => {
    console.log("Extracted text to parse:", text);
    
    // Generate a unique ID
    const id = `rx-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Default prescription with empty values
    let prescription: Prescription = {
      id,
      name: "Unknown",
      dosage: "Not specified",
      frequency: "As directed",
      duration: "As prescribed",
      doctor: "Unknown",
      date: new Date().toISOString().split('T')[0],
      status: "active"
    };
    
    try {
      // Only proceed if we have actual text to parse
      if (!text || text.trim().length < 10) {
        console.log("Insufficient text to parse");
        return prescription;
      }
      
      // Clean up the text - remove extra spaces, normalize line breaks
      const cleanedText = text.replace(/\s+/g, ' ').trim();
      console.log("Cleaned text:", cleanedText.substring(0, 100) + "...");
      
      // Use regex to extract information from the OCR text
      
      // Extract medication name (expand common medications list)
      const medicationRegex = /\b(amoxicillin|lisinopril|metformin|atorvastatin|amlodipine|sertraline|omeprazole|levothyroxine|simvastatin|losartan|aspirin|acetaminophen|paracetamol|ibuprofen|albuterol|hydrochlorothiazide|gabapentin|fluoxetine|citalopram|escitalopram)\b/i;
      const medicationMatch = text.match(medicationRegex);
      
      // Try to find Rx: or Prescription: followed by words
      const rxLineRegex = /(?:Rx|Prescription|Med)(?:\s*:|\s+)([A-Za-z\s]+(?:\d+\s*mg)?)/i;
      const rxLineMatch = text.match(rxLineRegex);
      
      // Extract dosage (number followed by mg, mcg, ml, etc.)
      const dosageRegex = /\b(\d+)\s?(mg|mcg|ml|g|mg\/ml)\b/i;
      const dosageMatch = text.match(dosageRegex);
      
      // Extract frequency
      const frequencyRegex = /\b(once|twice|three times|four times|daily|every day|weekly|twice daily|every (\d+) hours|(\d+) times per day)\b/i;
      const frequencyMatch = text.match(frequencyRegex);
      
      // Extract duration
      const durationRegex = /\b(for\s)?(\d+)\s?(days|weeks|months|year|years)\b/i;
      const durationMatch = text.match(durationRegex);
      
      // Extract doctor name (Dr. followed by name)
      const doctorRegex = /\bdr\.?\s+([a-z]+\s+[a-z]+)\b/i;
      const doctorMatch = text.match(doctorRegex);
      
      // Extract a date (multiple date formats)
      const dateRegex = /\b(\d{1,2}[-/\.]\d{1,2}[-/\.]\d{2,4})\b|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}\b/i;
      const dateMatch = text.match(dateRegex);
      
      // Determine medication name from various matches
      let medicationName = "Unknown";
      if (medicationMatch) {
        medicationName = medicationMatch[0].charAt(0).toUpperCase() + medicationMatch[0].slice(1);
        console.log("Medication found:", medicationName);
      } else if (rxLineMatch && rxLineMatch[1]) {
        // Extract just the medication name from the Rx line (clean it up)
        medicationName = rxLineMatch[1].trim().replace(/\s+/g, ' ').split(' ')[0];
        medicationName = medicationName.charAt(0).toUpperCase() + medicationName.slice(1);
        console.log("Medication from Rx line:", medicationName);
      } else {
        // If no medication found, try to use the first capitalized word or phrase as a title
        const titleMatch = text.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})/);
        if (titleMatch) {
          medicationName = titleMatch[0];
          console.log("Using title as name:", medicationName);
        }
      }
      
      // Create the parsed data with extracted or default values
      prescription = {
        id,
        name: medicationName || "Unknown",
        dosage: dosageMatch ? dosageMatch[0] : "Not specified",
        frequency: frequencyMatch ? frequencyMatch[0] : "As directed",
        duration: durationMatch ? durationMatch[0] : "As prescribed",
        doctor: doctorMatch ? doctorMatch[1] : "Unknown",
        date: dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0],
        status: "active"
      };
      
    } catch (parseError) {
      console.error("Error parsing text:", parseError);
      // Return the default prescription if parsing fails
    }
    
    console.log("Parsed data:", prescription);
    return prescription;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setSelectedFile(file);
      setHasUploaded(false);
      setExtractedText("");
      setCurrentPrescription(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select an image of your prescription first.",
        variant: "destructive"
      });
      return;
    }

    await processImageWithTesseract(selectedFile);
  };

  const addToMedications = () => {
    if (currentPrescription) {
      setScannedPrescriptions(prev => [
        ...prev,
        currentPrescription
      ]);
      
      toast({
        title: "Added to medications",
        description: `${currentPrescription.name} has been added to your medications.`
      });
      
      // Reset for new scan
      resetScanState();
    }
  };

  const resetScanState = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setHasUploaded(false);
    setExtractedText("");
    setCurrentPrescription(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCapture = () => {
    toast({
      title: "Camera access",
      description: "Please allow camera access to scan your prescription."
    });
    // Ideally this would open the device camera for capturing prescription images
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Clean up URL objects when component unmounts or when preview changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-forest mb-6">OCR Prescription Scanner</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-forest">Scan Your Prescription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {!hasUploaded ? (
                  <>
                    <div className="border-2 border-dashed border-sage/40 rounded-lg p-6 flex flex-col items-center justify-center">
                      {imagePreview ? (
                        <div className="w-full mb-4 flex flex-col items-center">
                          <div className="relative w-full max-w-md mb-4">
                            <img 
                              src={imagePreview} 
                              alt="Prescription preview" 
                              className="w-full h-auto max-h-64 object-contain rounded-lg"
                            />
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="absolute top-2 right-2" 
                              onClick={resetScanState}
                            >
                              Remove
                            </Button>
                          </div>
                          <Button 
                            onClick={handleUpload} 
                            disabled={isProcessing} 
                            className="mb-2"
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing {processingProgress > 0 ? `(${processingProgress}%)` : ''}
                              </>
                            ) : (
                              <>
                                <FileText className="mr-2 h-4 w-4" />
                                Extract Text
                              </>
                            )}
                          </Button>
                          {isProcessing && (
                            <div className="w-full max-w-xs">
                              <div className="h-2 w-full bg-sage-light/20 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-sage transition-all duration-300 rounded-full" 
                                  style={{ width: `${processingProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className="mb-4 bg-sage-light/20 p-4 rounded-full">
                            <ImageIcon className="h-8 w-8 text-forest" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">Upload Prescription</h3>
                          <p className="text-muted-foreground text-center mb-4 max-w-md">
                            Upload a clear image of your prescription to digitize and manage your medications.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <div>
                              <Input 
                                type="file" 
                                id="prescription" 
                                ref={fileInputRef}
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                              />
                              <Label
                                htmlFor="prescription"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
                              >
                                <UploadCloud className="mr-2 h-4 w-4" />
                                Upload Image
                              </Label>
                            </div>
                            <Button variant="outline" onClick={handleCapture}>
                              <Camera className="mr-2 h-4 w-4" />
                              Take Photo
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="bg-sage-light/10 rounded-lg p-4">
                      <h3 className="flex items-center text-sm font-medium mb-2">
                        <Info className="h-4 w-4 mr-1" />
                        Tips for best results:
                      </h3>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>Ensure the prescription is on a flat, well-lit surface</li>
                        <li>Make sure all text is clearly visible and not blurry</li>
                        <li>Include the entire prescription in the frame</li>
                        <li>Supported formats: JPG, PNG</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-center">
                      <div className="bg-green-100 text-green-700 p-3 rounded-full">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium">Prescription Processed</h3>
                        <p className="text-muted-foreground">Your prescription has been successfully digitized</p>
                      </div>
                    </div>
                    
                    {currentPrescription && (
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-4">Extracted Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div>
                              <Label className="text-muted-foreground text-sm">Medication Name</Label>
                              <p className="font-medium">{currentPrescription.name}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground text-sm">Dosage</Label>
                              <p className="font-medium">{currentPrescription.dosage}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground text-sm">Frequency</Label>
                              <p className="font-medium">{currentPrescription.frequency}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <Label className="text-muted-foreground text-sm">Doctor</Label>
                              <p className="font-medium">{currentPrescription.doctor}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground text-sm">Prescription Date</Label>
                              <p className="font-medium">{currentPrescription.date}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground text-sm">Duration</Label>
                              <p className="font-medium">{currentPrescription.duration}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Display raw extracted text in an expandable section */}
                        <div className="mt-4">
                          <details className="text-sm">
                            <summary className="text-forest cursor-pointer">View Raw Extracted Text</summary>
                            <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-md max-h-40 overflow-y-auto whitespace-pre-wrap">
                              {extractedText || "No text extracted"}
                            </div>
                          </details>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      <Button onClick={addToMedications}>
                        <Pill className="mr-2 h-4 w-4" />
                        Add to Medications
                      </Button>
                      <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        Set Reminders
                      </Button>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button 
                        variant="ghost" 
                        className="p-0 h-auto text-forest hover:text-forest-dark hover:bg-transparent"
                        onClick={resetScanState}
                      >
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Scan Another Prescription
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-forest">Medication Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scannedPrescriptions.map((prescription, index) => (
                  <div key={index} className="flex items-center p-3 bg-sage-light/10 rounded-lg">
                    <div className="mr-4">
                      <div className="h-10 w-10 bg-forest text-white rounded-full flex items-center justify-center">
                        <Pill className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{prescription.name}</p>
                      <p className="text-sm text-muted-foreground">{prescription.dosage} - {prescription.frequency}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">8:00 AM</Badge>
                  </div>
                ))}
                
                {scannedPrescriptions.length === 0 && (
                  <p className="text-muted-foreground text-center py-6">No medications added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-forest">My Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            {scannedPrescriptions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Prescribed By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scannedPrescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell className="font-medium">{prescription.name}</TableCell>
                      <TableCell>{prescription.dosage}</TableCell>
                      <TableCell>{prescription.frequency}</TableCell>
                      <TableCell>{prescription.duration}</TableCell>
                      <TableCell>{prescription.doctor}</TableCell>
                      <TableCell>{prescription.date}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(prescription.status)}>
                          {prescription.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No prescriptions found. Scan a prescription to add it to your records.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Ocr;
