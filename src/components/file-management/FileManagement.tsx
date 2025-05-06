import React, { useState, useEffect } from 'react';
import { FileRecord } from './types';
import FileList from './FileList';
import FileUpload from './FileUpload';
import FilePreview from './FilePreview';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface FileManagementProps {
  userRole: 'doctor' | 'admin';
  patientId?: number;
  patientName?: string;
  showAllPatients?: boolean;
}

const FileManagement: React.FC<FileManagementProps> = ({
  userRole,
  patientId,
  patientName,
  showAllPatients = false
}) => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const { toast } = useToast();

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, [patientId, showAllPatients]);

  // Filter files when search query or active category changes
  useEffect(() => {
    filterFiles();
  }, [searchQuery, activeCategory, files]);

  // Function to fetch files from server
  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch from API
      // For demo purposes, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockFiles: FileRecord[] = [
        {
          id: 1,
          patientId: patientId || 1,
          patientName: patientName || 'John Doe',
          fileName: 'Blood_Test_Results.pdf',
          filePath: '/uploads/Blood_Test_Results.pdf',
          fileType: 'application/pdf',
          fileSize: 2456123,
          category: 'Lab Report',
          uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          uploadedBy: {
            id: 101,
            name: 'Dr. Smith',
            role: 'doctor'
          },
          notes: 'Annual physical examination results'
        },
        {
          id: 2,
          patientId: patientId || 1,
          patientName: patientName || 'John Doe',
          fileName: 'Prescription_Jan_2025.jpg',
          filePath: '/uploads/Prescription_Jan_2025.jpg',
          fileType: 'image/jpeg',
          fileSize: 1287543,
          category: 'Prescription',
          uploadedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          uploadedBy: {
            id: 102,
            name: 'Dr. Johnson',
            role: 'doctor'
          }
        },
        {
          id: 3,
          patientId: patientId || 1,
          patientName: patientName || 'John Doe',
          fileName: 'Treatment_Plan.docx',
          filePath: '/uploads/Treatment_Plan.docx',
          fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          fileSize: 5482103,
          category: 'Treatment Plan',
          uploadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          uploadedBy: {
            id: 103,
            name: 'Admin User',
            role: 'admin'
          },
          notes: 'Long-term treatment plan for chronic condition'
        }
      ];
      
      // If showing all patients in admin view, add more patients
      if (showAllPatients && userRole === 'admin') {
        mockFiles.push(
          {
            id: 4,
            patientId: 2,
            patientName: 'Jane Smith',
            fileName: 'X-Ray_Results.jpg',
            filePath: '/uploads/X-Ray_Results.jpg',
            fileType: 'image/jpeg',
            fileSize: 3547892,
            category: 'Radiology Report',
            uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            uploadedBy: {
              id: 104,
              name: 'Dr. Wilson',
              role: 'doctor'
            }
          },
          {
            id: 5,
            patientId: 3,
            patientName: 'Robert Johnson',
            fileName: 'Insurance_Coverage.pdf',
            filePath: '/uploads/Insurance_Coverage.pdf',
            fileType: 'application/pdf',
            fileSize: 1896452,
            category: 'Insurance',
            uploadedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            uploadedBy: {
              id: 105,
              name: 'Admin Staff',
              role: 'admin'
            }
          }
        );
      }
      
      setFiles(mockFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: 'Error',
        description: 'Failed to load files. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to filter files based on search query and category
  const filterFiles = () => {
    let filtered = [...files];
    
    // Filter by category if not 'all'
    if (activeCategory !== 'all') {
      filtered = filtered.filter(file => file.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(file => 
        file.fileName.toLowerCase().includes(query) ||
        file.category.toLowerCase().includes(query) ||
        (file.notes && file.notes.toLowerCase().includes(query)) ||
        (file.patientName && file.patientName.toLowerCase().includes(query))
      );
    }
    
    setFilteredFiles(filtered);
  };

  // Function to handle file deletion
  const handleDelete = async (id: number) => {
    try {
      // In a real app, you would call API to delete file
      // For demo purposes, we'll just update state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setFiles(files.filter(file => file.id !== id));
      
      toast({
        title: 'File Deleted',
        description: 'The file has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete file. Please try again later.',
        variant: 'destructive'
      });
    }
  };

  // Function to handle file download
  const handleDownload = async (id: number, fileName: string) => {
    try {
      // In a real app, you would call API to download file
      // For demo purposes, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: 'File Downloaded',
        description: `${fileName} has been downloaded successfully.`,
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to download file. Please try again later.',
        variant: 'destructive'
      });
    }
  };

  // Function to handle file preview
  const handlePreview = (file: FileRecord) => {
    setSelectedFile(file);
    setShowPreviewDialog(true);
  };

  // Function to handle file replacement
  const handleReplace = (file: FileRecord) => {
    setSelectedFile(file);
    setShowUploadDialog(true);
  };

  // Function to handle file upload completion
  const handleUploadComplete = (fileData: FileRecord) => {
    if (selectedFile) {
      // If replacing a file
      setFiles(files.map(file => 
        file.id === selectedFile.id ? { ...fileData, id: file.id } : file
      ));
      setSelectedFile(null);
    } else {
      // If adding a new file
      setFiles([...files, { ...fileData, id: Math.max(0, ...files.map(f => f.id)) + 1 }]);
    }
    
    toast({
      title: selectedFile ? 'File Replaced' : 'File Uploaded',
      description: selectedFile 
        ? `The file has been successfully replaced.`
        : `The file has been successfully uploaded.`,
    });
  };

  // Get unique categories for filtering
  const categories = ['all', ...new Set(files.map(file => file.category))];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-forest">
                {showAllPatients ? 'All Patient Files' : `${patientName || 'Patient'} Files`}
              </CardTitle>
              <CardDescription>
                {userRole === 'doctor' 
                  ? 'Manage medical files for your patients' 
                  : 'Administrative file management for all patients'
                }
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search files..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-[250px]"
                />
              </div>
              <Button onClick={() => setShowUploadDialog(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="mb-4">
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeCategory}>
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 text-forest animate-spin" />
                </div>
              ) : (
                <FileList 
                  files={filteredFiles}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                  onPreview={handlePreview}
                  onReplace={userRole === 'admin' || userRole === 'doctor' ? handleReplace : undefined}
                  showPatientInfo={showAllPatients}
                  groupByPatient={showAllPatients}
                  emptyMessage={
                    searchQuery 
                      ? "No files match your search criteria." 
                      : activeCategory !== 'all'
                        ? `No ${activeCategory} files have been uploaded.`
                        : "No files have been uploaded yet."
                  }
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* File Upload Dialog */}
      <FileUpload 
        open={showUploadDialog}
        onClose={() => {
          setShowUploadDialog(false);
          setSelectedFile(null);
        }}
        onUploadComplete={handleUploadComplete}
        patientId={selectedFile?.patientId || patientId || 0}
        patientName={selectedFile?.patientName || patientName}
      />
      
      {/* File Preview Dialog */}
      <FilePreview 
        file={selectedFile}
        open={showPreviewDialog}
        onClose={() => {
          setShowPreviewDialog(false);
          setSelectedFile(null);
        }}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default FileManagement; 