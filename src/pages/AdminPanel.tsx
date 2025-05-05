
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Users, 
  User, 
  Settings, 
  Bell, 
  Shield, 
  FileText, 
  BarChart4,
  Plus,
  Check,
  X
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  
  const approveUser = (id: string) => {
    toast({
      title: "User approved",
      description: `User #${id} has been approved successfully.`
    });
  };
  
  const rejectUser = (id: string) => {
    toast({
      title: "User rejected",
      description: `User #${id} has been rejected.`
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-forest">Admin Panel</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-1">
                  <Button
                    variant={activeTab === "dashboard" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("dashboard")}
                  >
                    <BarChart4 className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button
                    variant={activeTab === "users" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("users")}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    User Management
                  </Button>
                  <Button
                    variant={activeTab === "doctors" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("doctors")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Doctor Management
                  </Button>
                  <Button
                    variant={activeTab === "permissions" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("permissions")}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Permissions
                  </Button>
                  <Button
                    variant={activeTab === "reports" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("reports")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Reports
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-forest">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-semibold">5,324</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Doctors</p>
                    <p className="text-2xl font-semibold">128</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Approvals</p>
                    <p className="text-2xl font-semibold">15</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Consultations</p>
                    <p className="text-2xl font-semibold">87</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <Users className="h-8 w-8 text-forest mb-2" />
                        <h3 className="text-lg font-semibold">User Growth</h3>
                        <p className="text-3xl font-bold mt-2">+12%</p>
                        <p className="text-sm text-muted-foreground">vs. last month</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <Bell className="h-8 w-8 text-forest mb-2" />
                        <h3 className="text-lg font-semibold">Active Sessions</h3>
                        <p className="text-3xl font-bold mt-2">245</p>
                        <p className="text-sm text-muted-foreground">current users</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <Shield className="h-8 w-8 text-forest mb-2" />
                        <h3 className="text-lg font-semibold">System Health</h3>
                        <p className="text-3xl font-bold mt-2">99.8%</p>
                        <p className="text-sm text-muted-foreground">uptime</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-forest">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-sage-light/10 rounded-lg">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 10}`} />
                              <AvatarFallback>U{i}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {["User registration", "Doctor approval", "Permission updated", "Report generated", "System update"][i - 1]}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {`${i * 10} minutes ago`}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeTab === "users" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-forest">User Management</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search users..." 
                        className="pl-9 w-[250px]" 
                      />
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All Users</TabsTrigger>
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="blocked">Blocked</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <TableRow key={i}>
                              <TableCell>
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 20}`} />
                                    <AvatarFallback>U{i}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{["John Doe", "Jane Smith", "Robert Johnson", "Emily Chen", "Michael Brown"][i - 1]}</p>
                                    <p className="text-xs text-muted-foreground">{`#USR10${i}`}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{["john@example.com", "jane@example.com", "robert@example.com", "emily@example.com", "michael@example.com"][i - 1]}</TableCell>
                              <TableCell>{["Patient", "Patient", "Doctor", "Admin", "Patient"][i - 1]}</TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                  ["bg-green-50 text-green-700", "bg-green-50 text-green-700", "bg-green-50 text-green-700", "bg-yellow-50 text-yellow-700", "bg-red-50 text-red-700"][i - 1]
                                }`}>
                                  {["Active", "Active", "Active", "Pending", "Blocked"][i - 1]}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">View</Button>
                                  <Button variant="outline" size="sm">Edit</Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                    
                    <TabsContent value="pending">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Requested On</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[1, 2, 3].map((i) => (
                            <TableRow key={i}>
                              <TableCell>
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 30}`} />
                                    <AvatarFallback>P{i}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{["Alex Thompson", "Sarah Davis", "James Wilson"][i - 1]}</p>
                                    <p className="text-xs text-muted-foreground">{`#USR20${i}`}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{["alex@example.com", "sarah@example.com", "james@example.com"][i - 1]}</TableCell>
                              <TableCell>{["Doctor", "Patient", "Doctor"][i - 1]}</TableCell>
                              <TableCell>{["Apr 25, 2025", "Apr 26, 2025", "Apr 26, 2025"][i - 1]}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" className="text-green-600" onClick={() => approveUser(`20${i}`)}>
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-red-600" onClick={() => rejectUser(`20${i}`)}>
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "doctors" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-forest">Doctor Management</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search doctors..." 
                        className="pl-9 w-[250px]" 
                      />
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Doctor
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Specialty</TableHead>
                        <TableHead>Patients</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 40}`} />
                                <AvatarFallback>D{i}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{["Dr. Robert Johnson", "Dr. Emily Chen", "Dr. William Lee", "Dr. Sarah Green", "Dr. David Kim"][i - 1]}</p>
                                <p className="text-xs text-muted-foreground">{`#DR30${i}`}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{["Cardiologist", "General Practitioner", "Neurologist", "Pediatrician", "Oncologist"][i - 1]}</TableCell>
                          <TableCell>{[125, 87, 105, 92, 118][i - 1]}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              i === 4 ? "bg-yellow-50 text-yellow-700" : "bg-green-50 text-green-700"
                            }`}>
                              {i === 4 ? "On Leave" : "Active"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">View</Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
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

export default AdminPanel;
