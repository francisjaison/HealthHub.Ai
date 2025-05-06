import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Activity, Heart, Dumbbell, Apple, Brain, AlertCircle, ArrowRight, FileText, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Health risk factors data
const HEALTH_FACTORS = {
  cardiovascular: {
    score: 72,
    riskLevel: "Moderate",
    factors: [
      { name: "Blood Pressure", value: "Normal", risk: "Low" },
      { name: "Cholesterol", value: "Elevated", risk: "Moderate" },
      { name: "Family History", value: "Present", risk: "High" },
      { name: "Exercise Habits", value: "Moderate", risk: "Low" }
    ],
    recommendations: [
      "Consider increasing aerobic exercise to 30 minutes, 5 days per week",
      "Schedule a cholesterol screening in the next 3 months",
      "Reduce sodium intake to less than 2,300mg daily",
      "Add more omega-3 fatty acids to your diet through fish or supplements"
    ]
  },
  metabolic: {
    score: 84,
    riskLevel: "Low",
    factors: [
      { name: "BMI", value: "24.1", risk: "Low" },
      { name: "Blood Sugar", value: "Normal", risk: "Low" },
      { name: "Waist Circumference", value: "Normal", risk: "Low" },
      { name: "Triglycerides", value: "Slightly Elevated", risk: "Moderate" }
    ],
    recommendations: [
      "Maintain current healthy weight through balanced diet",
      "Consider reducing intake of simple carbohydrates",
      "Include more fiber in your diet (aim for 25-30g daily)",
      "Monitor blood sugar annually as preventative measure"
    ]
  },
  musculoskeletal: {
    score: 78,
    riskLevel: "Moderate",
    factors: [
      { name: "Bone Density", value: "Normal", risk: "Low" },
      { name: "Joint Flexibility", value: "Limited", risk: "Moderate" },
      { name: "Muscle Strength", value: "Moderate", risk: "Moderate" },
      { name: "Posture Assessment", value: "Forward Head", risk: "Moderate" }
    ],
    recommendations: [
      "Include strength training 2-3 times per week focusing on major muscle groups",
      "Add stretching or yoga to improve flexibility, especially in shoulders and hips",
      "Consider ergonomic assessment of your workspace",
      "Incorporate posture-strengthening exercises into daily routine"
    ]
  },
  cognitive: {
    score: 90,
    riskLevel: "Low",
    factors: [
      { name: "Memory Assessment", value: "Strong", risk: "Low" },
      { name: "Processing Speed", value: "High", risk: "Low" },
      { name: "Sleep Quality", value: "Moderate", risk: "Moderate" },
      { name: "Stress Levels", value: "Moderate", risk: "Moderate" }
    ],
    recommendations: [
      "Maintain cognitive health through puzzles, reading, and learning new skills",
      "Improve sleep hygiene - aim for 7-8 hours of uninterrupted sleep",
      "Consider mindfulness or meditation to manage stress",
      "Ensure adequate intake of omega-3 fatty acids and antioxidants"
    ]
  }
};

// Overall health score calculation based on individual component scores
const calculateOverallScore = () => {
  const scores = Object.values(HEALTH_FACTORS).map(factor => factor.score);
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
};

// Mock health trends data (would be from real data in production)
const healthTrendsData = [
  { month: 'Jan', weight: 76, bloodPressure: 120, cholesterol: 190 },
  { month: 'Feb', weight: 75, bloodPressure: 118, cholesterol: 185 },
  { month: 'Mar', weight: 75, bloodPressure: 122, cholesterol: 188 },
  { month: 'Apr', weight: 74, bloodPressure: 119, cholesterol: 183 },
  { month: 'May', weight: 73, bloodPressure: 117, cholesterol: 180 },
  { month: 'Jun', weight: 74, bloodPressure: 116, cholesterol: 178 },
];

// Risk assessment data for visualization
const riskPieData = [
  { name: 'Cardiovascular', value: 28 },
  { name: 'Metabolic', value: 16 },
  { name: 'Musculoskeletal', value: 22 },
  { name: 'Cognitive', value: 10 },
];

// Colors for the visualizations
const COLORS = ['#ef4444', '#f97316', '#a3e635', '#14b8a6'];
const DARK_COLORS = ['#f87171', '#fb923c', '#bef264', '#2dd4bf'];

const HealthAssessment = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const overallScore = calculateOverallScore();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Simulate loading of health data
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    // Check if dark mode is enabled
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    
    return () => clearTimeout(timer);
  }, []);

  const handlePrintReport = () => {
    toast({
      title: "Preparing report",
      description: "Your health assessment report is being prepared for printing."
    });
    // In a real app, this would trigger a PDF generation
    window.print();
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-500 dark:text-emerald-400";
    if (score >= 70) return "text-amber-500 dark:text-amber-400";
    return "text-red-500 dark:text-red-400";
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "Moderate": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "High": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-forest dark:text-sage-light">Health Assessment</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrintReport} className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
              <Printer className="mr-2 h-4 w-4" />
              Print Report
            </Button>
            <Button onClick={() => navigate("/health-form")} className="dark:bg-forest/80 dark:hover:bg-forest/70">
              <FileText className="mr-2 h-4 w-4" />
              Update Health Info
            </Button>
          </div>
        </div>

        {!isLoaded ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-sage border-t-forest rounded-full animate-spin mb-4 dark:border-slate-700 dark:border-t-sage"></div>
            <p className="text-muted-foreground dark:text-slate-400">Loading your health assessment...</p>
          </div>
        ) : (
          <>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-5 md:w-[600px] dark:bg-slate-800">
                <TabsTrigger value="overview" className="dark:data-[state=active]:bg-forest dark:data-[state=active]:text-white">Overview</TabsTrigger>
                <TabsTrigger value="cardiovascular" className="dark:data-[state=active]:bg-forest dark:data-[state=active]:text-white">Heart</TabsTrigger>
                <TabsTrigger value="metabolic" className="dark:data-[state=active]:bg-forest dark:data-[state=active]:text-white">Metabolic</TabsTrigger>
                <TabsTrigger value="musculoskeletal" className="dark:data-[state=active]:bg-forest dark:data-[state=active]:text-white">Fitness</TabsTrigger>
                <TabsTrigger value="cognitive" className="dark:data-[state=active]:bg-forest dark:data-[state=active]:text-white">Cognitive</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="dark:text-white">Overall Health Score</CardTitle>
                      <CardDescription className="dark:text-slate-300">Based on your health information and assessments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-4">
                        <div className="relative w-48 h-48 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
                          <div className={`text-6xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}</div>
                          <svg className="absolute inset-0" viewBox="0 0 100 100">
                            <circle 
                              cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" 
                              className="dark:stroke-slate-600"
                            />
                            <circle 
                              cx="50" cy="50" r="45" fill="none" stroke="#22c55e" strokeWidth="10" 
                              strokeDasharray="283" 
                              strokeDashoffset={283 - (283 * overallScore / 100)}
                              transform="rotate(-90 50 50)"
                              className="dark:stroke-emerald-500"
                            />
                          </svg>
                        </div>
                        <p className="mt-4 text-muted-foreground dark:text-slate-400">{overallScore >= 85 ? "Excellent health status" : overallScore >= 70 ? "Good health with areas for improvement" : "Attention needed on key health areas"}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="dark:text-white">Health Risk Profile</CardTitle>
                      <CardDescription className="dark:text-slate-300">Distribution of health risk factors</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={riskPieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={2}
                              dataKey="value"
                              label={({ name }) => name}
                            >
                              {riskPieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={isDarkMode ? DARK_COLORS[index % DARK_COLORS.length] : COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: isDarkMode ? '#334155' : '#e2e8f0', color: isDarkMode ? '#f8fafc' : '#1e293b' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="dark:bg-slate-800 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="dark:text-white">Health Trends</CardTitle>
                    <CardDescription className="dark:text-slate-300">Track your progress over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={healthTrendsData}>
                          <CartesianGrid strokeDasharray="3 3" className="dark:stroke-slate-700" />
                          <XAxis dataKey="month" className="dark:text-slate-300" />
                          <YAxis yAxisId="left" className="dark:text-slate-300" />
                          <YAxis yAxisId="right" orientation="right" className="dark:text-slate-300" />
                          <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: isDarkMode ? '#334155' : '#e2e8f0', color: isDarkMode ? '#f8fafc' : '#1e293b' }} />
                          <Legend className="dark:text-slate-300" />
                          <Line yAxisId="left" type="monotone" dataKey="weight" stroke={isDarkMode ? "#a78bfa" : "#8884d8"} activeDot={{ r: 8 }} />
                          <Line yAxisId="left" type="monotone" dataKey="bloodPressure" stroke={isDarkMode ? "#4ade80" : "#82ca9d"} />
                          <Line yAxisId="right" type="monotone" dataKey="cholesterol" stroke={isDarkMode ? "#fcd34d" : "#ffc658"} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Alert variant="default" className="bg-sage/10 dark:bg-forest/20 dark:border-forest/30">
                  <AlertCircle className="h-4 w-4 dark:text-sage-light" />
                  <AlertTitle className="dark:text-white">Important Health Insight</AlertTitle>
                  <AlertDescription className="dark:text-slate-300">
                    Based on your health profile, we recommend focusing on cholesterol management and increasing daily physical activity.
                    Schedule a follow-up with your healthcare provider in the next 3 months.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              {Object.entries(HEALTH_FACTORS).map(([key, data]) => (
                <TabsContent key={key} value={key} className="space-y-4">
                  <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle className="text-2xl dark:text-white">{key.charAt(0).toUpperCase() + key.slice(1)} Health</CardTitle>
                        <CardDescription className="dark:text-slate-300">Assessment score and risk factors</CardDescription>
                      </div>
                      <div className={`text-4xl font-bold ${getScoreColor(data.score)}`}>
                        {data.score}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium dark:text-slate-300">Score</span>
                            <span className={`text-sm ${getScoreColor(data.score)}`}>{data.riskLevel} Risk</span>
                          </div>
                          <Progress value={data.score} className="h-2 dark:bg-slate-700" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <h3 className="font-medium mb-2 dark:text-white">Key Risk Factors</h3>
                            <ScrollArea className="h-[200px] rounded-md border p-4 dark:border-slate-700 dark:bg-slate-900/50">
                              <div className="space-y-2">
                                {data.factors.map((factor, idx) => (
                                  <div key={idx} className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground dark:text-slate-400">{factor.name}</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium dark:text-white">{factor.value}</span>
                                      <span className={`text-xs px-2 py-1 rounded-full ${getRiskBadgeColor(factor.risk)}`}>
                                        {factor.risk}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-2 dark:text-white">Health Recommendations</h3>
                            <ScrollArea className="h-[200px] rounded-md border p-4 dark:border-slate-700 dark:bg-slate-900/50">
                              <ul className="space-y-2 list-disc pl-5">
                                {data.recommendations.map((rec, idx) => (
                                  <li key={idx} className="text-sm text-muted-foreground dark:text-slate-400">{rec}</li>
                                ))}
                              </ul>
                            </ScrollArea>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700" onClick={() => setActiveTab("overview")}>
                        Return to Overview
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  );
};

export default HealthAssessment; 