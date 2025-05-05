
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Heart, Calendar, User, ArrowRight, Info, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RiskPlanner = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("planner");
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const dates = [
    "Mon, Apr 28",
    "Tue, Apr 29",
    "Wed, Apr 30",
    "Thu, May 1",
    "Fri, May 2"
  ];
  
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleSchedule = () => {
    if (!selectedDate) {
      toast({
        title: "Please select a date",
        description: "You must select a date before scheduling",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Assessment Scheduled",
      description: `Your risk assessment has been scheduled for ${selectedDate}`,
    });
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-forest mb-6">Risk Assessment Hub</h1>

        <Tabs defaultValue="planner" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="planner">Scheduler</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="py-4">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-forest">Risk Assessment Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6 sm:py-12 text-center">
                  <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Welcome to the Risk Assessment Portal</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    This simplified risk assessment will help you understand your potential health risks and provide personalized recommendations.
                  </p>
                  <Button onClick={() => setActiveTab("planner")}>
                    Go to Risk Planner
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Cardiac Risk Assessment",
                  description: "Evaluate your heart health and identify risk factors for cardiovascular disease.",
                  color: "bg-red-50 text-red-700"
                },
                {
                  title: "Diabetes Risk Assessment",
                  description: "Understand your risk factors for developing type 2 diabetes.",
                  color: "bg-blue-50 text-blue-700"
                },
                {
                  title: "Stroke Risk Assessment",
                  description: "Identify potential risk factors for stroke and cerebrovascular events.",
                  color: "bg-purple-50 text-purple-700"
                }
              ].map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                    <Button variant="outline" className="w-full">
                      Start Assessment
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="planner" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-forest">Schedule Your Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      A comprehensive health risk assessment helps identify potential health concerns before they become serious. 
                      Select a date and time below to schedule your assessment with a healthcare professional.
                    </p>
                    
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Select a Date</h3>
                      <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'sm:grid-cols-5 gap-2'}`}>
                        {dates.map((date, index) => (
                          <Button 
                            key={index}
                            variant={selectedDate === date ? "default" : "outline"}
                            className={selectedDate === date ? "bg-forest text-white" : ""}
                            onClick={() => handleDateSelect(date)}
                          >
                            {date}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    {selectedDate && (
                      <div className="mb-6">
                        <h3 className="font-medium mb-3">Available Time Slots for {selectedDate}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"].map((time, index) => (
                            <Button key={index} variant="outline">
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Button className="mt-4 w-full sm:w-auto" onClick={handleSchedule}>
                      Schedule Assessment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-forest">Assessment Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="font-medium mb-2">What to Expect</h3>
                      <p className="text-muted-foreground">
                        Our comprehensive health risk assessment takes approximately 60 minutes and includes the following:
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                        <li>Detailed health history review</li>
                        <li>Blood pressure and heart rate measurement</li>
                        <li>Body composition analysis</li>
                        <li>Blood glucose and cholesterol screening</li>
                        <li>Personalized risk evaluation</li>
                      </ul>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium mb-2">Preparation Instructions</h3>
                      <p className="text-muted-foreground">
                        For the most accurate results, please follow these instructions:
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                        <li>Fast for 8-12 hours before your appointment</li>
                        <li>Stay hydrated (water only)</li>
                        <li>Avoid caffeine and alcohol for 24 hours before</li>
                        <li>Wear comfortable clothing</li>
                        <li>Bring a list of current medications</li>
                      </ul>
                    </div>
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Important Note</AlertTitle>
                      <AlertDescription>
                        This assessment is not a substitute for regular medical check-ups. 
                        Please consult with your doctor about any health concerns.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-forest">Risk Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="h-5 w-5 text-red-500" />
                          <h3 className="font-medium">Cardiovascular Risk</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Heart disease, stroke, and hypertension risks</p>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="h-5 w-5 text-blue-500" />
                          <h3 className="font-medium">Metabolic Risk</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Diabetes, obesity, and metabolic syndrome risks</p>
                      </div>
                      
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-5 w-5 text-purple-500" />
                          <h3 className="font-medium">Cancer Risk</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Various cancer risks based on genetics and lifestyle</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-forest">Previous Assessments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-sage-light/10 rounded-lg">
                        <div>
                          <p className="font-medium">Complete Assessment</p>
                          <p className="text-sm text-muted-foreground">Jan 15, 2025</p>
                        </div>
                        <Badge variant="outline">Low Risk</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-sage-light/10 rounded-lg">
                        <div>
                          <p className="font-medium">Cardiac Screening</p>
                          <p className="text-sm text-muted-foreground">Oct 10, 2024</p>
                        </div>
                        <Badge variant="outline">Medium Risk</Badge>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        View Assessment History
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default RiskPlanner;
