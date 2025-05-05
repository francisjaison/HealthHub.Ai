
import Layout from "@/components/layout/Layout";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Calendar, 
  Clock, 
  FileText, 
  MessageSquare, 
  Phone, 
  User, 
  Users, 
  Video,
  ArrowRight,
  Check
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const DoctorPanel = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const { toast } = useToast();
  
  const markComplete = (appointmentId: string) => {
    toast({
      title: "Appointment completed",
      description: `Appointment #${appointmentId} marked as completed.`
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300" />
                    <AvatarFallback>DR</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">Dr. Robert Johnson</h2>
                  <p className="text-sm text-muted-foreground">Cardiologist</p>
                  <div className="flex items-center mt-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-sm font-medium">Available</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <Button
                    variant={activeTab === "appointments" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("appointments")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Appointments
                  </Button>
                  <Button
                    variant={activeTab === "patients" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("patients")}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Patients
                  </Button>
                  <Button
                    variant={activeTab === "consultations" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("consultations")}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Consultations
                  </Button>
                  <Button
                    variant={activeTab === "records" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("records")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Medical Records
                  </Button>
                  <Button
                    variant={activeTab === "messages" ? "default" : "ghost"}
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("messages")}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Today's Schedule Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-forest">Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-sage/20 text-forest rounded-md p-2 flex-shrink-0">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">9:00 AM</p>
                      <p className="text-sm text-muted-foreground">Patient: Jane Smith</p>
                      <p className="text-sm text-forest">Consultation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-sage/20 text-forest rounded-md p-2 flex-shrink-0">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">11:30 AM</p>
                      <p className="text-sm text-muted-foreground">Patient: Michael Brown</p>
                      <p className="text-sm text-forest">Follow-up</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-sage/20 text-forest rounded-md p-2 flex-shrink-0">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">2:00 PM</p>
                      <p className="text-sm text-muted-foreground">Patient: Sarah Williams</p>
                      <p className="text-sm text-forest">Initial Assessment</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            {activeTab === "appointments" && (
              <div>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-forest">Upcoming Appointments</CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search appointments..." 
                          className="pl-9 w-[250px]" 
                        />
                      </div>
                      <Button>
                        <Calendar className="mr-2 h-4 w-4" />
                        New Appointment
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="upcoming">
                      <TabsList className="mb-4">
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="upcoming">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Patient</TableHead>
                              <TableHead>Date & Time</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" />
                                    <AvatarFallback>JS</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">Jane Smith</p>
                                    <p className="text-xs text-muted-foreground">#PT12345</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <p>Apr 28, 2025</p>
                                <p className="text-sm text-muted-foreground">10:00 AM</p>
                              </TableCell>
                              <TableCell>Consultation</TableCell>
                              <TableCell>
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                  Confirmed
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Video className="h-4 w-4 mr-1" />
                                    Start
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => markComplete("PT12345")}>
                                    <Check className="h-4 w-4 mr-1" />
                                    Complete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                            
                            <TableRow>
                              <TableCell>
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150" />
                                    <AvatarFallback>MB</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">Michael Brown</p>
                                    <p className="text-xs text-muted-foreground">#PT12346</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <p>Apr 28, 2025</p>
                                <p className="text-sm text-muted-foreground">11:30 AM</p>
                              </TableCell>
                              <TableCell>Follow-up</TableCell>
                              <TableCell>
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                  Confirmed
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Phone className="h-4 w-4 mr-1" />
                                    Call
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => markComplete("PT12346")}>
                                    <Check className="h-4 w-4 mr-1" />
                                    Complete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                            
                            <TableRow>
                              <TableCell>
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150" />
                                    <AvatarFallback>SW</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">Sarah Williams</p>
                                    <p className="text-xs text-muted-foreground">#PT12347</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <p>Apr 28, 2025</p>
                                <p className="text-sm text-muted-foreground">2:00 PM</p>
                              </TableCell>
                              <TableCell>Initial Assessment</TableCell>
                              <TableCell>
                                <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                                  Pending
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    <User className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    Message
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TabsContent>
                      
                      <TabsContent value="completed">
                        <div className="flex flex-col items-center justify-center py-12">
                          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">No completed appointments today</h3>
                          <p className="text-sm text-muted-foreground">Completed appointments will appear here</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="cancelled">
                        <div className="flex flex-col items-center justify-center py-12">
                          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">No cancelled appointments</h3>
                          <p className="text-sm text-muted-foreground">Cancelled appointments will appear here</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-forest">Recent Patient Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" />
                            <AvatarFallback>JS</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Jane Smith updated her medication list</p>
                            <p className="text-sm text-muted-foreground">20 minutes ago</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150" />
                            <AvatarFallback>MB</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Michael Brown submitted blood pressure readings</p>
                            <p className="text-sm text-muted-foreground">1 hour ago</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" />
                            <AvatarFallback>AJ</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Alex Johnson requested a prescription refill</p>
                            <p className="text-sm text-muted-foreground">3 hours ago</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeTab === "patients" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-forest">Patient List</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search patients..." 
                        className="pl-9 w-[250px]" 
                      />
                    </div>
                    <Button>
                      <User className="mr-2 h-4 w-4" />
                      Add Patient
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Last Visit</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" />
                              <AvatarFallback>JS</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">Jane Smith</p>
                              <p className="text-xs text-muted-foreground">jane.smith@example.com</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>42</TableCell>
                        <TableCell>Apr 20, 2025</TableCell>
                        <TableCell>Hypertension</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                            Active
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View Records</Button>
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150" />
                              <AvatarFallback>MB</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">Michael Brown</p>
                              <p className="text-xs text-muted-foreground">m.brown@example.com</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>58</TableCell>
                        <TableCell>Apr 15, 2025</TableCell>
                        <TableCell>Diabetes Type 2</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                            Active
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View Records</Button>
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150" />
                              <AvatarFallback>SW</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">Sarah Williams</p>
                              <p className="text-xs text-muted-foreground">s.williams@example.com</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>35</TableCell>
                        <TableCell>Apr 10, 2025</TableCell>
                        <TableCell>Anxiety</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            New
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View Records</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorPanel;
