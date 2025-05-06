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
  Settings, 
  BarChart, 
  AlertTriangle, 
  Shield, 
  Database, 
  UserPlus, 
  FileText,
  Activity,
  CreditCard,
  CheckCircle,
  Clock,
  Search,
  Filter,
  MoreHorizontal,
  Bell
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// Mock data for admin dashboard
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "patient", status: "active", lastLogin: "2 hours ago" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "doctor", status: "active", lastLogin: "1 day ago" },
  { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "admin", status: "active", lastLogin: "5 minutes ago" },
  { id: 4, name: "Emma Wilson", email: "emma@example.com", role: "patient", status: "inactive", lastLogin: "1 month ago" },
  { id: 5, name: "Michael Brown", email: "michael@example.com", role: "doctor", status: "active", lastLogin: "3 days ago" },
];

const mockStats = {
  totalUsers: 1245,
  activeUsers: 896,
  doctors: 32,
  patients: 1208,
  growth: 18.5,
  systemHealth: 99.8,
  dataStorage: 68,
  alerts: 3
};

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");

  // Check if user is admin, otherwise redirect
  React.useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && user.role === filter;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-forest">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, monitor system health, and access administrative features</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">{mockStats.alerts}</span>
            </Button>
            <Avatar>
              <AvatarFallback className="bg-forest text-white">{user?.name?.[0] || 'A'}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span className="hidden md:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden md:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-forest">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold">{mockStats.totalUsers}</div>
                    <Users className="h-8 w-8 text-forest opacity-80" />
                  </div>
                  <div className="text-sm text-muted-foreground mt-2 flex items-center">
                    <span className="text-green-600 mr-1">+{mockStats.growth}%</span> from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-forest">System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold">{mockStats.systemHealth}%</div>
                    <Activity className="h-8 w-8 text-green-500 opacity-80" />
                  </div>
                  <Progress className="mt-3" value={mockStats.systemHealth} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-forest">Storage Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold">{mockStats.dataStorage}%</div>
                    <Database className="h-8 w-8 text-blue-500 opacity-80" />
                  </div>
                  <Progress className="mt-3" value={mockStats.dataStorage} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-forest">Active Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold">{mockStats.alerts}</div>
                    <AlertTriangle className="h-8 w-8 text-amber-500 opacity-80" />
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {mockStats.alerts > 0 ? "Requires attention" : "All systems normal"}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                  <CardDescription>Breakdown of users by role and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-md">
                    <p className="text-muted-foreground">[Chart visualization would go here]</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <UserPlus className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-muted-foreground">10 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Storage alert triggered</p>
                        <p className="text-xs text-muted-foreground">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <FileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">System backup completed</p>
                        <p className="text-xs text-muted-foreground">3 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <Settings className="h-5 w-5 text-forest" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">System update deployed</p>
                        <p className="text-xs text-muted-foreground">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full">View all activity</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
                  </div>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
                      <Input 
                        placeholder="Search users..." 
                        className="pl-9 w-full sm:w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="all" onValueChange={setFilter}>
                        <SelectTrigger className="w-[130px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Filter by role</SelectLabel>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="admin">Admins</SelectItem>
                            <SelectItem value="doctor">Doctors</SelectItem>
                            <SelectItem value="patient">Patients</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Button className="bg-forest hover:bg-forest-dark text-white">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
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
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={
                            user.role === "admin" ? "default" : 
                            user.role === "doctor" ? "outline" :
                            "secondary"
                          }>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "secondary" : "destructive"}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No users matching your search criteria
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredUsers.length} of {mockUsers.length} users
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm" disabled>Next</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage system security preferences and access control</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Authentication Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="py-4 px-5">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                      </CardHeader>
                      <CardContent className="px-5 py-4 pt-0">
                        <p className="text-sm text-muted-foreground">Require two-factor authentication for admin accounts</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="py-4 px-5">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Password Policy</CardTitle>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </CardHeader>
                      <CardContent className="px-5 py-4 pt-0">
                        <p className="text-sm text-muted-foreground">Manage minimum requirements for user passwords</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">System Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="py-4 px-5">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">API Access Control</CardTitle>
                          <Button variant="outline" size="sm">Manage</Button>
                        </div>
                      </CardHeader>
                      <CardContent className="px-5 py-4 pt-0">
                        <p className="text-sm text-muted-foreground">Configure API keys and access permissions</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="py-4 px-5">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Activity Logging</CardTitle>
                          <Button variant="outline" size="sm">View Logs</Button>
                        </div>
                      </CardHeader>
                      <CardContent className="px-5 py-4 pt-0">
                        <p className="text-sm text-muted-foreground">Audit trail for system events and user activities</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure application settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">General Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Application Name</label>
                      <Input defaultValue="HealthHub AI" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Support Email</label>
                      <Input defaultValue="support@healthhub.ai" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Default Language</label>
                      <Select defaultValue="en">
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Timezone</label>
                      <Select defaultValue="utc">
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc">UTC</SelectItem>
                          <SelectItem value="est">Eastern Time (EST)</SelectItem>
                          <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                          <SelectItem value="gmt">GMT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-forest hover:bg-forest-dark text-white">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPanel;
