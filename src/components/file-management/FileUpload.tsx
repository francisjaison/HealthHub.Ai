import React, { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileUploadMetadata, 
  fileCategories 
} from './types';
import { Loader2, File, Upload, X, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  open: boolean;
  onClose: () => void;
  onUploadComplete: (fileData: any) => void;
  patientId: number;
  patientName?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  open, 
  onClose, 
  onUploadComplete,
  patientId,
  patientName
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  // Function to validate and process the selected file
  const validateAndProcessFile = (file: File) => {
    // Reset previous errors
    setError(null);

    // Check file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setError("File size exceeds 10MB limit");
      return;
    }

    // Check file type (you can add more accepted types)
    const acceptedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ];

    if (!acceptedTypes.includes(file.type)) {
      setError("File type not supported. Please upload PDF, image, Word, Excel, or text documents.");
      return;
    }

    // Set the selected file
    setSelectedFile(file);

    // Create file preview for images
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

  // Function to handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    if (!category) {
      setError("Please select a file category");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Create metadata for the document
      const metadata: FileUploadMetadata = {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        category,
        patientId,
        notes: notes || undefined
      };
      
      formData.append('metadata', JSON.stringify(metadata));

      // Get auth token (assuming it's stored in localStorage)
      const token = localStorage.getItem('authToken');
      
      // Mock successful upload for this example
      // In a real implementation, you would send the formData to your server
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResponse = {
        id: Math.floor(Math.random() * 1000),
        patientId,
        patientName,
        fileName: selectedFile.name,
        filePath: `/uploads/${selectedFile.name}`,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        category,
        uploadedAt: new Date().toISOString(),
        uploadedBy: {
          id: 1,
          name: 'Dr. User',
          role: 'doctor'
        },
        notes
      };
      
      onUploadComplete(mockResponse);
      handleClose();
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  // Function to close the dialog and reset state
  const handleClose = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setCategory('');
    setNotes('');
    setError(null);
    onClose();
  };

  // Function to handle drag and drop
  React.useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;

    const preventDefaults = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const highlight = () => {
      dropArea.classList.add('bg-sage/10', 'border-forest');
    };

    const unhighlight = () => {
      dropArea.classList.remove('bg-sage/10', 'border-forest');
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
        dropArea?.removeEventListener(eventName, preventDefaults, false);
      });

      ['dragenter', 'dragover'].forEach(eventName => {
        dropArea?.removeEventListener(eventName, highlight, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropArea?.removeEventListener(eventName, unhighlight, false);
      });

      dropArea?.removeEventListener('drop', handleDrop, false);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Medical File</DialogTitle>
          <DialogDescription>
            {patientName ? 
              `Upload a medical document for patient ${patientName}` : 
              'Upload a medical document to the patient record'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div 
            ref={dropAreaRef}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center cursor-pointer transition-colors hover:bg-sage/5"
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <File className="h-10 w-10 text-forest" />
                </div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setFilePreview(null);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <Upload className="h-10 w-10 text-forest" />
                </div>
                <p className="font-medium">Drag & drop a file here, or click to browse</p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, images, Word, Excel, and text documents (Max: 10MB)
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.txt"
            />
          </div>

          {filePreview && (
            <div className="mt-2">
              <img 
                src={filePreview} 
                alt="File preview" 
                className="max-h-40 mx-auto rounded-md" 
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="category">Document Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {fileCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional information about this document"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile || !category || isUploading}>
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileUpload; 