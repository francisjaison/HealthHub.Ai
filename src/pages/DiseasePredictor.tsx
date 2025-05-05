
import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, Activity, Heart, Stethoscope, CircuitBoard, Brain, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

// Disease categories and their corresponding diseases
const DISEASE_CATEGORIES = {
  cardiovascular: {
    name: "Cardiovascular",
    icon: <Heart className="h-6 w-6" />,
    diseases: [
      { id: "hypertension", name: "Hypertension", risk: "high", description: "High blood pressure that damages arteries over time." },
      { id: "coronary", name: "Coronary Artery Disease", risk: "medium", description: "Narrowing of coronary arteries that supply blood to the heart." },
      { id: "arrhythmia", name: "Arrhythmia", risk: "low", description: "Irregular heartbeat due to electrical impulse problems." },
      { id: "heartfailure", name: "Heart Failure", risk: "medium", description: "Heart's inability to pump sufficient blood to meet the body's needs." },
      { id: "valve", name: "Heart Valve Disease", risk: "low", description: "Damage or defect in one of the heart's four valves." },
    ]
  },
  neurological: {
    name: "Neurological",
    icon: <Brain className="h-6 w-6" />,
    diseases: [
      { id: "alzheimers", name: "Alzheimer's Disease", risk: "low", description: "Progressive disorder causing brain cells to degenerate and die." },
      { id: "parkinsons", name: "Parkinson's Disease", risk: "low", description: "Progressive nervous system disorder affecting movement." },
      { id: "epilepsy", name: "Epilepsy", risk: "medium", description: "Neurological disorder causing abnormal brain activity." },
      { id: "migraine", name: "Migraine", risk: "high", description: "Severe headache often accompanied by nausea and sensitivity." },
      { id: "ms", name: "Multiple Sclerosis", risk: "low", description: "Immune system attacks the protective sheath of nerve fibers." },
    ]
  },
  respiratory: {
    name: "Respiratory",
    icon: <Activity className="h-6 w-6" />,
    diseases: [
      { id: "asthma", name: "Asthma", risk: "high", description: "Chronic condition involving airways in the lungs." },
      { id: "copd", name: "COPD", risk: "medium", description: "Group of lung diseases that block airflow and make breathing difficult." },
      { id: "pneumonia", name: "Pneumonia", risk: "medium", description: "Infection that inflames air sacs in one or both lungs." },
      { id: "tb", name: "Tuberculosis", risk: "low", description: "Infectious disease primarily affecting the lungs." },
      { id: "bronchitis", name: "Bronchitis", risk: "high", description: "Inflammation of the lining of your bronchial tubes." },
    ]
  },
  metabolic: {
    name: "Metabolic",
    icon: <Activity className="h-6 w-6" />,
    diseases: [
      { id: "diabetes1", name: "Type 1 Diabetes", risk: "low", description: "Autoimmune condition where the pancreas produces little or no insulin." },
      { id: "diabetes2", name: "Type 2 Diabetes", risk: "high", description: "Affects how your body uses blood sugar (glucose)." },
      { id: "hypothyroid", name: "Hypothyroidism", risk: "medium", description: "Condition where thyroid doesn't produce enough hormones." },
      { id: "obesity", name: "Obesity", risk: "high", description: "Excessive body fat accumulation presenting health risks." },
      { id: "metabolism", name: "Metabolic Syndrome", risk: "medium", description: "Cluster of conditions that occur together, increasing risk of heart disease." },
    ]
  },
  infectious: {
    name: "Infectious",
    icon: <CircuitBoard className="h-6 w-6" />,
    diseases: [
      { id: "influenza", name: "Influenza", risk: "high", description: "Contagious respiratory illness caused by influenza viruses." },
      { id: "covid", name: "COVID-19", risk: "medium", description: "Infectious disease caused by the SARS-CoV-2 virus." },
      { id: "hepatitis", name: "Hepatitis", risk: "low", description: "Inflammation of the liver typically caused by viral infection." },
      { id: "hiv", name: "HIV/AIDS", risk: "low", description: "Virus that attacks the immune system, decreasing ability to fight infections." },
      { id: "malaria", name: "Malaria", risk: "low", description: "Mosquito-borne infectious disease affecting humans and animals." },
    ]
  },
  autoimmune: {
    name: "Autoimmune",
    icon: <Stethoscope className="h-6 w-6" />,
    diseases: [
      { id: "rheumatoid", name: "Rheumatoid Arthritis", risk: "medium", description: "Chronic inflammatory disorder affecting many joints." },
      { id: "lupus", name: "Lupus", risk: "low", description: "Autoimmune disease that can affect joints, skin, kidneys, brain, and other organs." },
      { id: "psoriasis", name: "Psoriasis", risk: "medium", description: "Skin disease that accelerates the life cycle of skin cells." },
      { id: "celiac", name: "Celiac Disease", risk: "low", description: "Immune reaction to eating gluten, a protein found in wheat." },
      { id: "crohns", name: "Crohn's Disease", risk: "low", description: "Inflammatory bowel disease causing inflammation of digestive tract." },
    ]
  }
};

// Chart data for risk factors
const riskFactorsData = [
  { name: 'Genetic', value: 35 },
  { name: 'Lifestyle', value: 40 },
  { name: 'Environmental', value: 25 },
];

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Age-related disease data
const ageRiskData = [
  { age: '20-30', risk: 15 },
  { age: '30-40', risk: 25 },
  { age: '40-50', risk: 40 },
  { age: '50-60', risk: 55 },
  { age: '60-70', risk: 70 },
  { age: '70+', risk: 85 },
];

const DiseasePredictor = () => {
  const [activeCategory, setActiveCategory] = useState("cardiovascular");
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleAnalyze = (diseaseId: string) => {
    setSelectedDisease(diseaseId);
    toast({
      title: "Analysis Started",
      description: "We're analyzing your health data for this condition.",
    });
  };

  const filteredDiseases = selectedDisease 
    ? Object.values(DISEASE_CATEGORIES).flatMap(cat => cat.diseases).filter(d => d.id === selectedDisease)
    : DISEASE_CATEGORIES[activeCategory as keyof typeof DISEASE_CATEGORIES].diseases.filter(
        disease => disease.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-forest mb-2">Disease Predictor</h1>
          <p className="text-muted-foreground mb-6">
            Analyze your health data to identify potential disease risks and prevention strategies
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 gap-6">
          {isMobile && (
            <Card className="mb-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex overflow-x-auto pb-2 gap-2">
                  {Object.entries(DISEASE_CATEGORIES).map(([key, category]) => (
                    <Button
                      key={key}
                      variant={activeCategory === key ? "default" : "outline"}
                      className="flex-shrink-0"
                      onClick={() => {
                        setActiveCategory(key);
                        setSelectedDisease(null);
                      }}
                    >
                      <span className="mr-2">{category.icon}</span>
                      <span className="whitespace-nowrap">{category.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            {!isMobile && (
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold mb-3 text-forest">Disease Categories</h2>
                    <div className="space-y-2">
                      {Object.entries(DISEASE_CATEGORIES).map(([key, category]) => (
                        <Button
                          key={key}
                          variant={activeCategory === key ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => {
                            setActiveCategory(key);
                            setSelectedDisease(null);
                          }}
                        >
                          <span className="mr-2">{category.icon}</span>
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Risk factor charts for desktop */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Your Risk Factors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={riskFactorsData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={70}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {riskFactorsData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="text-xs text-center text-muted-foreground mt-2">
                        Based on your health profile and genetic factors
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Age-Related Risk</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={ageRiskData}
                            margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="age" scale="point" fontSize={10} />
                            <YAxis fontSize={10} />
                            <Tooltip />
                            <Bar dataKey="risk" fill="#4D5D53" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="text-xs text-center text-muted-foreground mt-2">
                        Disease risk probability by age group
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Preventative Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="action1" />
                        <Label htmlFor="action1" className="text-sm">Regular health check-ups</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="action2" />
                        <Label htmlFor="action2" className="text-sm">Daily physical activity</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="action3" />
                        <Label htmlFor="action3" className="text-sm">Balanced nutrition</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="action4" />
                        <Label htmlFor="action4" className="text-sm">Stress management</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="action5" />
                        <Label htmlFor="action5" className="text-sm">Adequate sleep</Label>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Mobile-friendly risk charts */}
              {isMobile && (
                <Tabs defaultValue="riskFactors" className="mb-6">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="riskFactors">Risk Factors</TabsTrigger>
                    <TabsTrigger value="ageRisk">Age-Related Risk</TabsTrigger>
                  </TabsList>
                  <TabsContent value="riskFactors">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Your Risk Factors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-52">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={riskFactorsData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={70}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {riskFactorsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="ageRisk">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Age-Related Risk</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-52">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={ageRiskData}
                              margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="age" scale="point" fontSize={10} />
                              <YAxis fontSize={10} />
                              <Tooltip />
                              <Bar dataKey="risk" fill="#4D5D53" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            
              <Card className="mb-6">
                <CardHeader className="pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div>
                    <CardTitle>
                      {selectedDisease 
                        ? "Disease Analysis" 
                        : `${DISEASE_CATEGORIES[activeCategory as keyof typeof DISEASE_CATEGORIES].name} Diseases`}
                    </CardTitle>
                    <CardDescription>
                      {selectedDisease 
                        ? "Detailed risk assessment and recommendations" 
                        : "Browse diseases by category or search"}
                    </CardDescription>
                  </div>
                  {!selectedDisease && (
                    <Input 
                      className="w-full sm:w-1/3 mt-2 sm:mt-0" 
                      placeholder="Search diseases..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  )}
                </CardHeader>
                
                <CardContent>
                  {selectedDisease ? (
                    <div className="space-y-6">
                      {filteredDiseases.map(disease => (
                        <div key={disease.id} className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <h3 className="text-xl font-semibold">{disease.name}</h3>
                              <p className="text-muted-foreground">{disease.description}</p>
                            </div>
                            <Badge variant={disease.risk === "high" ? "destructive" : disease.risk === "medium" ? "outline" : "secondary"}>
                              {disease.risk === "high" ? "High Risk" : disease.risk === "medium" ? "Medium Risk" : "Low Risk"}
                            </Badge>
                          </div>
                          
                          <Tabs defaultValue="overview">
                            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                              <TabsTrigger value="overview">Overview</TabsTrigger>
                              <TabsTrigger value="risk-factors">Risk Factors</TabsTrigger>
                              <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                              <TabsTrigger value="prevention">Prevention</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="p-4 border rounded-md mt-2">
                              <h4 className="font-medium mb-2">About {disease.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {disease.name} is a condition that affects many people worldwide. Based on your health profile,
                                you have a {disease.risk} risk for developing this condition. This assessment takes into account
                                your genetic factors, lifestyle choices, and environmental exposures.
                              </p>
                              
                              <div className="mt-4 flex items-center">
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      disease.risk === "high" ? "bg-red-500" : 
                                      disease.risk === "medium" ? "bg-yellow-500" : 
                                      "bg-green-500"
                                    }`} 
                                    style={{ width: disease.risk === "high" ? "75%" : disease.risk === "medium" ? "50%" : "25%" }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-sm">
                                  {disease.risk === "high" ? "75%" : disease.risk === "medium" ? "50%" : "25%"}
                                </span>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="risk-factors" className="p-4 border rounded-md mt-2">
                              <h4 className="font-medium mb-2">Key Risk Factors</h4>
                              <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                                  <span>Age - Risk increases with age</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                                  <span>Family history of similar conditions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                                  <span>Lifestyle factors including diet and exercise</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                                  <span>Environmental exposures</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                                  <span>Existing medical conditions</span>
                                </li>
                              </ul>
                            </TabsContent>
                            
                            <TabsContent value="symptoms" className="p-4 border rounded-md mt-2">
                              <h4 className="font-medium mb-2">Common Symptoms</h4>
                              <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                                  <span>Fatigue and general weakness</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                                  <span>Changes in weight (gain or loss)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                                  <span>Pain or discomfort in affected areas</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                                  <span>Changes in normal bodily functions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                                  <span>Specific symptoms related to the disease system</span>
                                </li>
                              </ul>
                            </TabsContent>
                            
                            <TabsContent value="prevention" className="p-4 border rounded-md mt-2">
                              <h4 className="font-medium mb-2">Prevention Strategies</h4>
                              <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                  <span>Regular health screenings and check-ups</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                  <span>Maintain a healthy diet rich in fruits and vegetables</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                  <span>Regular physical activity (at least 150 minutes per week)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                  <span>Avoid or limit alcohol consumption and smoking</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                  <span>Manage stress through relaxation techniques</span>
                                </li>
                              </ul>
                            </TabsContent>
                          </Tabs>
                          
                          <div className="flex flex-col sm:flex-row justify-between gap-2 pt-4">
                            <Button variant="outline" onClick={() => setSelectedDisease(null)}>
                              Back to List
                            </Button>
                            <Button>
                              Generate Detailed Report
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {filteredDiseases.map(disease => (
                        <Card key={disease.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex justify-between items-center">
                              {disease.name}
                              <Badge variant={disease.risk === "high" ? "destructive" : disease.risk === "medium" ? "outline" : "secondary"} className="text-xs">
                                {disease.risk === "high" ? "High Risk" : disease.risk === "medium" ? "Medium Risk" : "Low Risk"}
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              {disease.description}
                            </p>
                          </CardContent>
                          <CardFooter className="flex justify-between pt-0">
                            <Button size="sm" variant="outline">Details</Button>
                            <Button size="sm" onClick={() => handleAnalyze(disease.id)}>
                              Analyze
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Disease Prediction</CardTitle>
                    <CardDescription>
                      Get AI-powered disease risk assessment based on your health data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select health condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cardiovascular">Cardiovascular Diseases</SelectItem>
                        <SelectItem value="diabetes">Diabetes</SelectItem>
                        <SelectItem value="cancer">Cancer</SelectItem>
                        <SelectItem value="respiratory">Respiratory Diseases</SelectItem>
                        <SelectItem value="neurological">Neurological Disorders</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Age" type="number" />
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      Run Prediction
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resources & Education</CardTitle>
                    <CardDescription>
                      Learn more about disease prevention and management
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Recommended Articles</h4>
                      <ul className="space-y-1">
                        <li className="text-sm text-blue-600 hover:underline cursor-pointer">Understanding Disease Risk Factors</li>
                        <li className="text-sm text-blue-600 hover:underline cursor-pointer">Preventative Healthcare Guide</li>
                        <li className="text-sm text-blue-600 hover:underline cursor-pointer">How Lifestyle Affects Disease Risk</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Educational Videos</h4>
                      <ul className="space-y-1">
                        <li className="text-sm text-blue-600 hover:underline cursor-pointer">Risk Assessment Explained</li>
                        <li className="text-sm text-blue-600 hover:underline cursor-pointer">Interpreting Your Health Metrics</li>
                        <li className="text-sm text-blue-600 hover:underline cursor-pointer">Taking Control of Your Health</li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Browse All Resources</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DiseasePredictor;
