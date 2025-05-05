
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, Lock, Bell, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");

  const handleSave = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully."
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Sidebar */}
          <div className="md:w-1/4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">Jane Smith</h2>
                  <p className="text-muted-foreground">jane.smith@example.com</p>
                </div>
                
                <div className="space-y-1">
                  <Button 
                    variant={activeTab === "personal" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("personal")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Personal Information
                  </Button>
                  <Button 
                    variant={activeTab === "settings" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
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
                    variant={activeTab === "history" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("history")}
                  >
                    <History className="mr-2 h-4 w-4" />
                    Health History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Content */}
          <div className="md:w-3/4">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-forest">
                  {activeTab === "personal" && "Personal Information"}
                  {activeTab === "settings" && "Account Settings"}
                  {activeTab === "security" && "Security Settings"}
                  {activeTab === "notifications" && "Notification Preferences"}
                  {activeTab === "history" && "Health History"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeTab === "personal" && (
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="Jane" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Smith" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="jane.smith@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue="+1 (555) 123-4567" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" type="date" defaultValue="1990-01-15" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" defaultValue="123 Healthcare Ave, Medical City, MC 12345" />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                  </form>
                )}
                
                {activeTab === "security" && (
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSave}>Update Password</Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
