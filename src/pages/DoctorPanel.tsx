import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  Calendar, 
  Clock, 
  Search, 
  FileText, 
  ClipboardList,
  Activity,
  MessageSquare,
  Bell,
  Plus,
  MoreHorizontal,
  Check,
  X,
  BarChart,
  Filter,
  Stethoscope,
  Heart
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

// Mock data
const mockPatients = [
  { id: 1, name: "John Smith", age: 45, gender: "Male", condition: "Hypertension", lastVisit: "2023-04-10", nextAppointment: "2023-05-15", status: "stable" },
  { id: 2, name: "Emma Johnson", age: 32, gender: "Female", condition: "Diabetes", lastVisit: "2023-04-18", nextAppointment: "2023-05-20", status: "improving" },
  { id: 3, name: "Michael Brown", age: 58, gender: "Male", condition: "Arthritis", lastVisit: "2023-04-05", nextAppointment: "2023-05-10", status: "stable" },
  { id: 4, name: "Sophia Davis", age: 28, gender: "Female", condition: "Asthma", lastVisit: "2023-04-22", nextAppointment: "2023-05-22", status: "worsening" },
  { id: 5, name: "Robert Wilson", age: 63, gender: "Male", condition: "Coronary Artery Disease", lastVisit: "2023-04-15", nextAppointment: "2023-05-05", status: "stable" },
];

const mockAppointments = [
  { id: 1, patientName: "John Smith", date: "2023-05-15", time: "09:00 AM", reason: "Follow-up", status: "confirmed" },
  { id: 2, patientName: "Emma Johnson", date: "2023-05-20", time: "10:30 AM", reason: "Check-up", status: "confirmed" },
  { id: 3, patientName: "Robert Wilson", date: "2023-05-05", time: "02:15 PM", reason: "Consultation", status: "pending" },
  { id: 4, patientName: "Sophia Davis", date: "2023-05-22", time: "11:45 AM", reason: "Follow-up", status: "confirmed" },
  { id: 5, patientName: "New Patient", date: "2023-05-18", time: "03:30 PM", reason: "Initial Consultation", status: "pending" },
];

const mockStats = {
  totalPatients: 127,
  appointmentsToday: 8,
  pendingReports: 3,
  averageRating: 4.8
};

const DoctorPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [patientFilter, setPatientFilter] = useState("all");
  const [appointmentFilter, setAppointmentFilter] = useState("all");
  
  // Check if user is doctor, otherwise redirect
  React.useEffect(() => {
    if (user?.role !== "doctor") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (patientFilter === "all") return matchesSearch;
    return matchesSearch && patient.status === patientFilter;
  });

  const filteredAppointments = mockAppointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (appointmentFilter === "all") return matchesSearch;
    return matchesSearch && appointment.status === appointmentFilter;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-forest">Doctor Dashboard</h1>
            <p className="text-muted-foreground">Manage your patients, appointments, and medical records</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">{mockStats.pendingReports}</span>
            </Button>
            <Avatar>
              <AvatarFallback className="bg-forest text-white">{user?.name?.[0] || 'D'}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span className="hidden md:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Patients</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Records</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-forest">Total Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold">{mockStats.totalPatients}</div>
                    <Users className="h-8 w-8 text-forest opacity-80" />
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    +12 new patients this month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-forest">Today's Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold">{mockStats.appointmentsToday}</div>
                    <Clock className="h-8 w-8 text-blue-500 opacity-80" />
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Next: 10:30 AM - Emma Johnson
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-forest">Pending Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold">{mockStats.pendingReports}</div>
                    <ClipboardList className="h-8 w-8 text-amber-500 opacity-80" />
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Due within 48 hours
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-forest">Patient Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold">{mockStats.averageRating}/5</div>
                    <Heart className="h-8 w-8 text-red-500 opacity-80" />
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Based on 45 patient reviews
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your schedule for the next few days</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAppointments.slice(0, 3).map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium">{appointment.patientName}</TableCell>
                          <TableCell>{formatDate(appointment.date)}</TableCell>
                          <TableCell>{appointment.time}</TableCell>
                          <TableCell>{appointment.reason}</TableCell>
                          <TableCell>
                            <Badge variant={appointment.status === "confirmed" ? "secondary" : "outline"}>
                              {appointment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab("appointments")}>
                    View all appointments
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Patient Activity</CardTitle>
                  <CardDescription>Recent patient interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <Activity className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Emma Johnson - Vital Update</p>
                        <p className="text-xs text-muted-foreground">Heart rate improved to normal range</p>
                        <p className="text-xs text-muted-foreground">30 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <MessageSquare className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">John Smith - Message</p>
                        <p className="text-xs text-muted-foreground">Requested prescription refill</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <Stethoscope className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Michael Brown - Test Results</p>
                        <p className="text-xs text-muted-foreground">Blood work results available</p>
                        <p className="text-xs text-muted-foreground">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Patient Management</CardTitle>
                    <CardDescription>View and manage your patient information</CardDescription>
                  </div>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
                      <Input 
                        placeholder="Search patients..." 
                        className="pl-9 w-full sm:w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="all" onValueChange={setPatientFilter}>
                        <SelectTrigger className="w-[130px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Filter by status</SelectLabel>
                            <SelectItem value="all">All Patients</SelectItem>
                            <SelectItem value="stable">Stable</SelectItem>
                            <SelectItem value="improving">Improving</SelectItem>
                            <SelectItem value="worsening">Worsening</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Button className="bg-forest hover:bg-forest-dark text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Patient
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Next Appointment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.condition}</TableCell>
                        <TableCell>{formatDate(patient.lastVisit)}</TableCell>
                        <TableCell>{formatDate(patient.nextAppointment)}</TableCell>
                        <TableCell>
                          <Badge variant={
                            patient.status === "stable" ? "outline" : 
                            patient.status === "improving" ? "secondary" : 
                            "destructive"
                          }>
                            {patient.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredPatients.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No patients matching your search criteria
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredPatients.length} of {mockPatients.length} patients
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm" disabled>Next</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Appointment Schedule</CardTitle>
                    <CardDescription>Manage your upcoming appointments</CardDescription>
                  </div>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
                      <Input 
                        placeholder="Search appointments..." 
                        className="pl-9 w-full sm:w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="all" onValueChange={setAppointmentFilter}>
                        <SelectTrigger className="w-[130px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Filter by status</SelectLabel>
                            <SelectItem value="all">All Appointments</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Button className="bg-forest hover:bg-forest-dark text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        New Appointment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{appointment.patientName}</TableCell>
                        <TableCell>{formatDate(appointment.date)}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{appointment.reason}</TableCell>
                        <TableCell>
                          <Badge variant={appointment.status === "confirmed" ? "secondary" : "outline"}>
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {appointment.status === "pending" && (
                              <>
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                  <Check className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                  <X className="h-4 w-4 text-red-500" />
                                </Button>
                              </>
                            )}
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredAppointments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No appointments matching your search criteria
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredAppointments.length} of {mockAppointments.length} appointments
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm" disabled>Next</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Medical Records Tab */}
          <TabsContent value="records" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Records</CardTitle>
                <CardDescription>Access and manage medical records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Medical Records System</h3>
                  <p className="text-muted-foreground mb-4">
                    Access patient medical history, test results, and clinical notes
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button>
                      Search Records
                    </Button>
                    <Button variant="outline">
                      Recent Files
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pending Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">John Smith</p>
                        <p className="text-xs text-muted-foreground">Test results review</p>
                      </div>
                      <Badge>Due Today</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Emma Johnson</p>
                        <p className="text-xs text-muted-foreground">Treatment plan update</p>
                      </div>
                      <Badge variant="outline">Due in 2 days</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Sophia Davis</p>
                        <p className="text-xs text-muted-foreground">Follow-up notes</p>
                      </div>
                      <Badge variant="destructive">Overdue</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Reports
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Uploads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-500" />
                      <div>
                        <p className="font-medium">Blood Work Results</p>
                        <p className="text-xs text-muted-foreground">Michael Brown • 2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-green-500" />
                      <div>
                        <p className="font-medium">ECG Report</p>
                        <p className="text-xs text-muted-foreground">John Smith • 3 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-purple-500" />
                      <div>
                        <p className="font-medium">Radiology Images</p>
                        <p className="text-xs text-muted-foreground">Robert Wilson • 5 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Files
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Record
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Write Prescription
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Activity className="h-4 w-4 mr-2" />
                      Record Vitals
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Follow-up
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DoctorPanel;
