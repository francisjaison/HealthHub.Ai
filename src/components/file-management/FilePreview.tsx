import React from 'react';
import { FileRecord, formatFileSize } from './types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { 
  Download, 
  File, 
  FileText, 
  FileImage, 
  FileSpreadsheet,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FilePreviewProps {
  file: FileRecord | null;
  open: boolean;
  onClose: () => void;
  onDownload: (id: number, fileName: string) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  open,
  onClose,
  onDownload
}) => {
  if (!file) return null;
  
  // Function to get the file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <File className="h-6 w-6 text-red-500" />;
    if (fileType.includes('image')) return <FileImage className="h-6 w-6 text-blue-500" />;
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) 
      return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
    if (fileType.includes('word') || fileType.includes('document') || fileType.includes('text')) 
      return <FileText className="h-6 w-6 text-blue-400" />;
    return <File className="h-6 w-6 text-gray-500" />;
  };
  
  // Function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Function to render content based on file type
  const renderFileContent = () => {
    // For images, render the image
    if (file.fileType.startsWith('image/')) {
      return (
        <div className="flex justify-center p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
          <img 
            src={file.filePath} 
            alt={file.fileName} 
            className="max-w-full max-h-[400px] object-contain" 
          />
        </div>
      );
    }
    
    // For PDFs, render an iframe if possible
    if (file.fileType === 'application/pdf') {
      return (
        <div className="h-[400px] w-full">
          <iframe 
            src={`${file.filePath}#view=FitH`} 
            title={file.fileName}
            className="w-full h-full border rounded-md"
          />
        </div>
      );
    }
    
    // For other file types, show a placeholder with download option
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 rounded-md text-center">
        <div className="mb-4">
          {getFileIcon(file.fileType)}
        </div>
        <h3 className="text-xl font-medium mb-2">{file.fileName}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This file type cannot be previewed directly.
        </p>
        <Button 
          variant="default"
          onClick={() => onDownload(file.id, file.fileName)}
        >
          <Download className="mr-2 h-4 w-4" />
          Download File
        </Button>
      </div>
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {getFileIcon(file.fileType)}
            <span className="ml-2">{file.fileName}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* File metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-b pb-4">
            <div>
              <p className="text-muted-foreground">Size</p>
              <p className="font-medium">{formatFileSize(file.fileSize)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Category</p>
              <Badge variant="outline">{file.category}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Uploaded By</p>
              <p className="font-medium flex items-center">
                {file.uploadedBy.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {file.uploadedBy.role}
                </Badge>
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Upload Date</p>
              <p className="font-medium">{formatDate(file.uploadedAt)}</p>
            </div>
          </div>
          
          {/* Notes if available */}
          {file.notes && (
            <div>
              <p className="text-muted-foreground text-sm mb-1">Notes</p>
              <p className="text-sm bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                {file.notes}
              </p>
            </div>
          )}
          
          {/* File preview */}
          <div className="py-2">
            {renderFileContent()}
          </div>
          
          {/* External link warning */}
          {file.filePath.startsWith('http') && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This file is stored on an external server and may be subject to different privacy policies.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Patient: {file.patientName || `Patient #${file.patientId}`}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              variant="default"
              onClick={() => onDownload(file.id, file.fileName)}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            {file.filePath.startsWith('http') && (
              <Button variant="outline" asChild>
                <a href={file.filePath} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Original
                </a>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreview; 