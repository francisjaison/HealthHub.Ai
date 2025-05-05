
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Camera, Clock, FileText, UploadCloud, Pill, AlertTriangle, Calendar, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Ocr = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [scannedPrescriptions, setScannedPrescriptions] = useState<Array<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    doctor: string;
    date: string;
    status: "active" | "expired" | "upcoming";
  }>>([
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

  const handleUpload = () => {
    setIsUploading(true);
    
    // Simulate upload and processing
    setTimeout(() => {
      setIsUploading(false);
      setHasUploaded(true);
      
      // Add a new scanned prescription to the list
      setScannedPrescriptions(prev => [
        ...prev,
        {
          id: "rx-789012",
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "30 days",
          doctor: "Dr. Robert Johnson",
          date: "2025-05-02",
          status: "active"
        }
      ]);
      
      toast({
        title: "Prescription scanned successfully",
        description: "Your prescription has been processed and added to your medications."
      });
    }, 2000);
  };

  const handleCapture = () => {
    toast({
      title: "Camera access",
      description: "Please allow camera access to scan your prescription."
    });
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
                    <div className="border-2 border-dashed border-sage/40 rounded-lg p-12 flex flex-col items-center justify-center">
                      <div className="mb-4 bg-sage-light/20 p-4 rounded-full">
                        <FileText className="h-8 w-8 text-forest" />
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
                            className="hidden" 
                            accept="image/*"
                            onChange={() => handleUpload()}
                          />
                          <Label
                            htmlFor="prescription"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
                          >
                            {isUploading ? (
                              <>
                                <span className="animate-pulse">Uploading...</span>
                              </>
                            ) : (
                              <>
                                <UploadCloud className="mr-2 h-4 w-4" />
                                Upload Image
                              </>
                            )}
                          </Label>
                        </div>
                        <Button variant="outline" onClick={handleCapture}>
                          <Camera className="mr-2 h-4 w-4" />
                          Take Photo
                        </Button>
                      </div>
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
                        <li>Supported formats: JPG, PNG, or PDF</li>
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
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-4">Extracted Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div>
                            <Label className="text-muted-foreground text-sm">Medication Name</Label>
                            <p className="font-medium">Lisinopril</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground text-sm">Dosage</Label>
                            <p className="font-medium">10mg</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground text-sm">Frequency</Label>
                            <p className="font-medium">Once daily</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <Label className="text-muted-foreground text-sm">Doctor</Label>
                            <p className="font-medium">Dr. Robert Johnson</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground text-sm">Prescription Date</Label>
                            <p className="font-medium">May 2, 2025</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground text-sm">Duration</Label>
                            <p className="font-medium">30 days</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button>
                        <Pill className="mr-2 h-4 w-4" />
                        Add to Medications
                      </Button>
                      <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        Set Reminders
                      </Button>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button variant="ghost" className="p-0 h-auto text-forest hover:text-forest-dark hover:bg-transparent">
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
                <div className="flex items-center p-3 bg-sage-light/10 rounded-lg">
                  <div className="mr-4">
                    <div className="h-10 w-10 bg-forest text-white rounded-full flex items-center justify-center">
                      <Pill className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Amoxicillin</p>
                    <p className="text-sm text-muted-foreground">500mg - 3 times daily</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">8:00 AM</Badge>
                </div>
                
                <div className="flex items-center p-3 bg-sage-light/10 rounded-lg">
                  <div className="mr-4">
                    <div className="h-10 w-10 bg-forest text-white rounded-full flex items-center justify-center">
                      <Pill className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Amoxicillin</p>
                    <p className="text-sm text-muted-foreground">500mg - 3 times daily</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">2:00 PM</Badge>
                </div>
                
                <div className="flex items-center p-3 bg-sage-light/10 rounded-lg">
                  <div className="mr-4">
                    <div className="h-10 w-10 bg-forest text-white rounded-full flex items-center justify-center">
                      <Pill className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Amoxicillin</p>
                    <p className="text-sm text-muted-foreground">500mg - 3 times daily</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">8:00 PM</Badge>
                </div>
              </div>
              
              <div className="pt-4 mt-4 border-t">
                <Button variant="outline" className="w-full">
                  <Clock className="mr-2 h-4 w-4" />
                  View All Reminders
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-forest">Scanned Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Doctor</TableHead>
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
                      <TableCell>{prescription.doctor}</TableCell>
                      <TableCell>
                        {new Date(prescription.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(prescription.status)}>
                          {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 shrink-0" />
              <p className="text-sm text-amber-800">
                Always consult with your healthcare provider before starting, stopping, or changing any medication.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Ocr;
