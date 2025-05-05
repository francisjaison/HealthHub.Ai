import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Lock, 
  Bell, 
  CreditCard, 
  Shield, 
  HelpCircle,
  LogOut,
  Key,
  ChevronsRight,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";

// Define Zod schema for the General tab form
const generalFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(), // Assuming phone is optional
  timezone: z.string().min(1, "Timezone is required"),
  language: z.string().min(1, "Language is required"),
});
type GeneralFormValues = z.infer<typeof generalFormSchema>;

const AccountManager = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  
  // Initialize react-hook-form for the General tab
  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    // TODO: Fetch actual user data for defaultValues
    defaultValues: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 123-4567",
      timezone: "America/New_York",
      language: "en",
    },
    mode: "onChange", // Optional: Add validation mode if needed
  });

  // Handle General form submission
  const onGeneralSubmit = (data: GeneralFormValues) => {
    console.log("General settings submitted:", data);
    // TODO: Add API call to update general user info
    toast({
      title: "Settings saved",
      description: "Your general settings have been updated successfully."
    });
  };

  // Keep the basic saveChanges for other potential forms for now
  const saveChanges = () => {
    toast({
      title: "Settings saved",
      description: "Your account settings have been updated successfully."
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-forest mb-6">Account Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-1">
                  <Button
                    variant={activeTab === "general" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("general")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    General
                  </Button>
                  <Button
                    variant={activeTab === "security" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("security")}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Security
                  </Button>
                  <Button
                    variant={activeTab === "notifications" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Button>
                  <Button
                    variant={activeTab === "billing" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("billing")}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </Button>
                  <Button
                    variant={activeTab === "privacy" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("privacy")}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Privacy
                  </Button>
                  <Button
                    variant={activeTab === "help" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("help")}
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help & Support
                  </Button>
                </div>

                <div className="pt-6 mt-6 border-t">
                  <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-forest">Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Email Verified</p>
                      <p className="text-xs text-muted-foreground">Your email has been verified</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Account Active</p>
                      <p className="text-xs text-muted-foreground">Your account is in good standing</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">2FA Not Enabled</p>
                      <p className="text-xs text-muted-foreground">Enable for enhanced security</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === "general" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-forest">General Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onGeneralSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Jane" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Smith" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="timezone"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Timezone</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger id="timezone">
                                  <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                <SelectItem value="Pacific/Honolulu">Hawaii Time (HT)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Language</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger id="language">
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="de">German</SelectItem>
                                <SelectItem value="zh">Chinese</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    
                    <div className="flex justify-end">
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                  </Form>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "security" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-forest">Change Password</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); saveChanges(); }}>
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input 
                            id="currentPassword" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter current password" 
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" placeholder="Enter new password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit">Update Password</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-forest">Two-Factor Authentication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">Add an extra layer of security to your account by enabling two-factor authentication.</p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Authenticator App</p>
                        <p className="text-sm text-muted-foreground">Use an authenticator app to generate verification codes</p>
                      </div>
                      <Button variant="outline">
                        <Key className="mr-2 h-4 w-4" />
                        Enable
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Authentication</p>
                        <p className="text-sm text-muted-foreground">Receive verification codes via text message</p>
                      </div>
                      <Button variant="outline">
                        <Key className="mr-2 h-4 w-4" />
                        Enable
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-forest">Active Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-muted-foreground">
                            Windows • Chrome • New York, USA
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">Active now</p>
                        </div>
                        <div>
                          <Button variant="outline" size="sm" disabled>
                            Current
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-sage-light/10 rounded-lg">
                        <div>
                          <p className="font-medium">Mobile Session</p>
                          <p className="text-sm text-muted-foreground">
                            iOS • Safari • New York, USA
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">Last active 3 hours ago</p>
                        </div>
                        <div>
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-forest">Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Appointment Reminders</p>
                            <p className="text-sm text-muted-foreground">Receive email reminders about upcoming appointments</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Health Updates</p>
                            <p className="text-sm text-muted-foreground">Weekly summaries of your health data</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">New Features</p>
                            <p className="text-sm text-muted-foreground">Updates about new features and improvements</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Mobile Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Push Notifications</p>
                            <p className="text-sm text-muted-foreground">Enable push notifications on your mobile device</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Medication Reminders</p>
                            <p className="text-sm text-muted-foreground">Reminders to take your medications</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Health Alerts</p>
                            <p className="text-sm text-muted-foreground">Alerts about important changes in your health</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={saveChanges}>Save Preferences</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "billing" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-forest">Subscription</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-green-50 rounded-lg mb-6">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <p className="font-medium text-green-800">Your subscription is active</p>
                      </div>
                      <p className="text-sm text-green-700 mt-1 ml-7">Your Premium plan will renew on May 12, 2025</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Premium Plan</p>
                          <p className="text-sm text-muted-foreground">$12.99 per month</p>
                        </div>
                        <Button variant="outline">Manage Plan</Button>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">Mastercard ending in 4587</p>
                              <p className="text-sm text-muted-foreground">Expires 09/2026</p>
                            </div>
                            <Button variant="ghost" size="sm">Change</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-forest">Billing History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { date: "Apr 12, 2025", amount: "$12.99", status: "Successful", invoice: "INV-001234" },
                        { date: "Mar 12, 2025", amount: "$12.99", status: "Successful", invoice: "INV-001233" },
                        { date: "Feb 12, 2025", amount: "$12.99", status: "Successful", invoice: "INV-001232" },
                      ].map((payment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-sage-light/10 rounded-lg">
                          <div>
                            <p className="font-medium">{payment.date}</p>
                            <p className="text-sm text-muted-foreground">Premium Plan • {payment.invoice}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{payment.amount}</p>
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 text-center">
                      <Button variant="outline">
                        View All Transactions
                        <ChevronsRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeTab === "privacy" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-forest">Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Data Sharing</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Share Health Data with Doctors</p>
                            <p className="text-sm text-muted-foreground">Allow your doctors to access your health records</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Research Participation</p>
                            <p className="text-sm text-muted-foreground">Share anonymized data for medical research</p>
                          </div>
                          <Switch />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Third-Party App Access</p>
                            <p className="text-sm text-muted-foreground">Allow connected apps to access your health data</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Data Management</h3>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <p className="font-medium">Download Your Data</p>
                          <p className="text-sm text-muted-foreground mb-4">Get a copy of all your health records and account data</p>
                          <Button variant="outline">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Request Data Export
                          </Button>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <p className="font-medium">Delete Account</p>
                          <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all associated data</p>
                          <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            Delete My Account
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={saveChanges}>Save Privacy Settings</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "help" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-forest">Help & Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Frequently Asked Questions</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-sage-light/10 rounded-lg">
                          <h4 className="font-medium">How do I update my medical records?</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            You can update your medical records by navigating to the Health Records section and selecting "Upload Documents" or "Add Information" in the appropriate category.
                          </p>
                        </div>
                        
                        <div className="p-4 bg-sage-light/10 rounded-lg">
                          <h4 className="font-medium">Can I share my health data with my doctor?</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Yes, you can securely share your health data with healthcare providers through the "Share" function in the Health Records section.
                          </p>
                        </div>
                        
                        <div className="p-4 bg-sage-light/10 rounded-lg">
                          <h4 className="font-medium">How accurate are the health risk predictions?</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Our health risk assessments are based on clinically validated algorithms and your personal health data. While they provide valuable insights, they are not a substitute for professional medical advice.
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-center">
                        <Button variant="outline">
                          View All FAQs
                          <ChevronsRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Contact Support</h3>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-4">
                          Our support team is available Monday-Friday, 9AM-6PM EST to assist you with any questions or issues.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <Button variant="outline">
                            Live Chat
                          </Button>
                          <Button variant="outline">
                            Email Support
                          </Button>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          For urgent medical concerns, please contact your healthcare provider directly.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountManager;
