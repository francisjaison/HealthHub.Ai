
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  UserPlus, 
  Calendar, 
  FileText, 
  Activity, 
  Clock,
  ChevronDown,
  Download,
  Share,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const patients = [
  {
    id: "P001",
    name: "Sarah Johnson",
    age: 42,
    gender: "Female",
    status: "Active",
    lastVisit: "2025-04-28",
    condition: "Hypertension",
    risk: "Medium",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "P002",
    name: "Michael Chen",
    age: 35,
    gender: "Male",
    status: "Active",
    lastVisit: "2025-04-22",
    condition: "Diabetes Type 2",
    risk: "High",
    avatar: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "P003",
    name: "Emily Rodriguez",
    age: 29,
    gender: "Female",
    status: "Active",
    lastVisit: "2025-04-15",
    condition: "Asthma",
    risk: "Low",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: "P004",
    name: "David Patel",
    age: 56,
    gender: "Male",
    status: "Inactive",
    lastVisit: "2025-03-10",
    condition: "Arthritis",
    risk: "Medium",
    avatar: "https://i.pravatar.cc/150?img=8"
  },
  {
    id: "P005",
    name: "Lisa Wilson",
    age: 48,
    gender: "Female",
    status: "Active",
    lastVisit: "2025-04-30",
    condition: "Migraine",
    risk: "Low",
    avatar: "https://i.pravatar.cc/150?img=9"
  }
];

const medicalHistory = [
  {
    date: "2025-04-30",
    type: "Consultation",
    provider: "Dr. Emily Chen",
    description: "Routine checkup, blood pressure slightly elevated at 140/90",
    department: "General Medicine"
  },
  {
    date: "2025-04-02",
    type: "Lab Test",
    provider: "Central Lab",
    description: "Complete blood count and metabolic panel, results normal",
    department: "Laboratory"
  },
  {
    date: "2025-03-15",
    type: "Procedure",
    provider: "Dr. Robert Johnson",
    description: "ECG performed, normal sinus rhythm",
    department: "Cardiology"
  },
  {
    date: "2025-02-22",
    type: "Medication",
    provider: "Dr. Emily Chen",
    description: "Prescribed Lisinopril 10mg daily for hypertension",
    department: "General Medicine"
  },
  {
    date: "2025-01-10",
    type: "Consultation",
    provider: "Dr. Michael Brown",
    description: "Complaint of occasional headaches, recommended lifestyle changes",
    department: "Neurology"
  }
];

interface PatientDetailsProps {
  patient: typeof patients[0];
}

const PatientDetails = ({ patient }: PatientDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <Avatar className="h-16 w-16 mr-4">
            <AvatarImage src={patient.avatar} alt={patient.name} />
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold text-forest">{patient.name}</h2>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{patient.age} years</span>
              <span>{patient.gender}</span>
              <Badge variant={patient.status === "Active" ? "default" : "outline"}>{patient.status}</Badge>
            </div>
          </div>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Reports
          </Button>
          <Button size="sm">
            <Activity className="mr-2 h-4 w-4" />
            View Health Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                patient.risk === "High" 
                  ? "bg-red-100 text-red-700" 
                  : patient.risk === "Medium"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {patient.risk === "High" ? "H" : patient.risk === "Medium" ? "M" : "L"}
              </div>
              <div>
                <p className="font-medium">{patient.risk} Risk</p>
                <p className="text-sm text-muted-foreground">Based on health metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Primary Condition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-sage-light/30 flex items-center justify-center mr-3">
                <Activity className="h-5 w-5 text-forest" />
              </div>
              <div>
                <p className="font-medium">{patient.condition}</p>
                <p className="text-sm text-muted-foreground">Under treatment since 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-sage-light/30 flex items-center justify-center mr-3">
                <Clock className="h-5 w-5 text-forest" />
              </div>
              <div>
                <p className="font-medium">{new Date(patient.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                <p className="text-sm text-muted-foreground">Dr. Emily Chen</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const MedicalHistoryTimeline = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h3 className="text-lg font-semibold text-forest">Medical History</h3>
        <div className="flex space-x-2 mt-2 md:mt-0">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {medicalHistory.map((event, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="border-l-4 border-forest">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <h4 className="font-semibold">{event.type}</h4>
                    <p className="text-sm">{event.description}</p>
                  </div>
                  <div className="mt-2 md:mt-0 md:text-right">
                    <Badge variant="outline" className="mb-1">{event.department}</Badge>
                    <p className="text-sm">{event.provider}</p>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const PatientRecords = () => {
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchText.toLowerCase()) || 
                         patient.id.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === "all" || patient.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });
  
  const handlePatientSelect = (patient: typeof patients[0]) => {
    setSelectedPatient(patient);
  };
  
  const handleAddPatient = () => {
    toast({
      title: "Add Patient",
      description: "Feature to add new patient will be implemented soon."
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-forest">Patient Records</h1>
          <Button onClick={handleAddPatient}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Patient
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Patient List */}
          <Card className="lg:col-span-4">
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <CardTitle className="text-xl font-semibold text-forest">Patients</CardTitle>
                <div className="flex items-center space-x-2 mt-2 md:mt-0">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="h-8 w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search patients..." 
                  className="pl-9"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                {filteredPatients.map((patient) => (
                  <div 
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient)}
                    className={`p-3 rounded-lg cursor-pointer flex items-center ${
                      selectedPatient?.id === patient.id 
                        ? 'bg-sage-light/20 border border-forest' 
                        : 'hover:bg-sage-light/10'
                    }`}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={patient.avatar} alt={patient.name} />
                      <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{patient.name}</p>
                        <Badge variant={patient.status === "Active" ? "default" : "outline"} className="ml-2">
                          {patient.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <p>{patient.id}</p>
                        <p>{patient.age} years</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredPatients.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No patients found</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Patient Details */}
          <div className="lg:col-span-8">
            {selectedPatient ? (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <PatientDetails patient={selectedPatient} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <Tabs defaultValue="history">
                      <TabsList className="mb-4">
                        <TabsTrigger value="history">Medical History</TabsTrigger>
                        <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
                        <TabsTrigger value="labs">Lab Results</TabsTrigger>
                        <TabsTrigger value="medications">Medications</TabsTrigger>
                      </TabsList>
                      <TabsContent value="history">
                        <MedicalHistoryTimeline />
                      </TabsContent>
                      <TabsContent value="vitals">
                        <div className="text-center py-12 text-muted-foreground">
                          <p>Vital signs data will be implemented soon</p>
                        </div>
                      </TabsContent>
                      <TabsContent value="labs">
                        <div className="text-center py-12 text-muted-foreground">
                          <p>Laboratory results will be implemented soon</p>
                        </div>
                      </TabsContent>
                      <TabsContent value="medications">
                        <div className="text-center py-12 text-muted-foreground">
                          <p>Medications data will be implemented soon</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-sage-light/20 p-4 rounded-full mb-4">
                    <FileText className="h-8 w-8 text-forest" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Select a Patient</h3>
                  <p className="text-muted-foreground max-w-md">
                    Select a patient from the list to view their detailed medical records and history.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientRecords;
