import React, { useState } from 'react';
import { FileRecord, formatFileSize } from './types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import {
  Eye,
  Download,
  MoreVertical,
  File,
  FileText,
  FileImage,
  FileSpreadsheet,
  Trash2,
  RefreshCw
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FileListProps {
  files: FileRecord[];
  isLoading?: boolean;
  onDelete: (id: number) => void;
  onDownload: (id: number, fileName: string) => void;
  onPreview: (file: FileRecord) => void;
  onReplace?: (file: FileRecord) => void;
  showPatientInfo?: boolean;
  emptyMessage?: string;
  groupByPatient?: boolean;
}

const FileList: React.FC<FileListProps> = ({
  files,
  isLoading = false,
  onDelete,
  onDownload,
  onPreview,
  onReplace,
  showPatientInfo = false,
  emptyMessage = "No files have been uploaded yet.",
  groupByPatient = false
}) => {
  const [fileToDelete, setFileToDelete] = useState<FileRecord | null>(null);
  
  // Function to get the correct icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <File className="h-4 w-4 text-red-500" />;
    if (fileType.includes('image')) return <FileImage className="h-4 w-4 text-blue-500" />;
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) 
      return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
    if (fileType.includes('word') || fileType.includes('document') || fileType.includes('text')) 
      return <FileText className="h-4 w-4 text-blue-400" />;
    return <File className="h-4 w-4 text-gray-500" />;
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
  
  // Function to group files by patient
  const groupFilesByPatient = (files: FileRecord[]) => {
    const grouped: Record<number, FileRecord[]> = {};
    
    files.forEach(file => {
      if (!grouped[file.patientId]) {
        grouped[file.patientId] = [];
      }
      grouped[file.patientId].push(file);
    });
    
    return grouped;
  };
  
  // Render grouped by patient view
  if (groupByPatient && showPatientInfo) {
    const groupedFiles = groupFilesByPatient(files);
    
    return (
      <div className="space-y-6">
        {Object.keys(groupedFiles).length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">{emptyMessage}</div>
        ) : (
          Object.entries(groupedFiles).map(([patientId, patientFiles]) => {
            const patient = patientFiles[0]; // Use first file to get patient info
            
            return (
              <Card key={patientId} className="overflow-hidden">
                <CardHeader className="bg-sage-light/10 py-3">
                  <CardTitle className="text-md font-medium flex items-center">
                    {patient.patientName || `Patient #${patient.patientId}`}
                    <Badge className="ml-2 bg-forest">{patientFiles.length} files</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="max-h-[300px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40%]">Filename</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Uploaded By</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patientFiles.map(file => (
                          <TableRow key={file.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                {getFileIcon(file.fileType)}
                                <span className="ml-2 truncate max-w-[200px]">{file.fileName}</span>
                              </div>
                              <span className="text-xs text-muted-foreground block mt-1">
                                {formatFileSize(file.fileSize)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{file.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span className="capitalize">{file.uploadedBy.name}</span>
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  {file.uploadedBy.role}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(file.uploadedAt)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => onPreview(file)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Preview
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onDownload(file.id, file.fileName)}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                  </DropdownMenuItem>
                                  {onReplace && (
                                    <DropdownMenuItem onClick={() => onReplace(file)}>
                                      <RefreshCw className="mr-2 h-4 w-4" />
                                      Replace
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => setFileToDelete(file)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    );
  }
  
  // Render regular table view
  return (
    <>
      {files.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">{emptyMessage}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Filename</TableHead>
              {showPatientInfo && <TableHead>Patient</TableHead>}
              <TableHead>Category</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map(file => (
              <TableRow key={file.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {getFileIcon(file.fileType)}
                    <span className="ml-2 truncate max-w-[200px]">{file.fileName}</span>
                  </div>
                  <span className="text-xs text-muted-foreground block mt-1">
                    {formatFileSize(file.fileSize)}
                  </span>
                </TableCell>
                {showPatientInfo && (
                  <TableCell>
                    {file.patientName || `Patient #${file.patientId}`}
                  </TableCell>
                )}
                <TableCell>
                  <Badge variant="outline">{file.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="capitalize">{file.uploadedBy.name}</span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {file.uploadedBy.role}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>{formatDate(file.uploadedAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onPreview(file)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDownload(file.id, file.fileName)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      {onReplace && (
                        <DropdownMenuItem onClick={() => onReplace(file)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Replace
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => setFileToDelete(file)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={!!fileToDelete} onOpenChange={() => setFileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this file?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the file 
              {fileToDelete && <strong> "{fileToDelete.fileName}"</strong>} from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (fileToDelete) {
                  onDelete(fileToDelete.id);
                  setFileToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FileList; 