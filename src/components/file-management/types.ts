// Define the file record interface
export interface FileRecord {
  id: number;
  patientId: number;
  patientName?: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  category: string;
  uploadedAt: string;
  uploadedBy: {
    id: number;
    name: string;
    role: 'admin' | 'doctor' | 'patient';
  };
  notes?: string;
}

// File upload metadata
export interface FileUploadMetadata {
  fileName: string;
  fileType: string;
  fileSize: number;
  category: string;
  patientId: number;
  notes?: string;
}

// Supported file categories
export const fileCategories = [
  'Prescription',
  'Lab Report',
  'Radiology Report',
  'Vaccination Record',
  'Patient History',
  'Treatment Plan',
  'Discharge Summary',
  'Insurance',
  'Consent Form',
  'Other'
];

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
  else return (bytes / 1073741824).toFixed(1) + ' GB';
};

// Helper function to determine icon based on file type
export const getFileTypeIcon = (fileType: string): string => {
  if (fileType.includes('pdf')) return 'pdf';
  else if (fileType.includes('image')) return 'image';
  else if (fileType.includes('word') || fileType.includes('document')) return 'document';
  else if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'spreadsheet';
  else if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'presentation';
  else if (fileType.includes('text')) return 'text';
  else return 'generic';
};

// API endpoints for file management
export const FILE_API = {
  UPLOAD: '/api/files/upload',
  DELETE: (id: number) => `/api/files/${id}`,
  DOWNLOAD: (id: number) => `/api/files/${id}/download`,
  LIST_ALL: '/api/files',
  LIST_BY_PATIENT: (patientId: number) => `/api/files/patient/${patientId}`,
}; 