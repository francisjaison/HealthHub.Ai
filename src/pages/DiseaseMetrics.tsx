
import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, BarChart4, CheckCircle2, ChevronRight, Loader2, Save, Thermometer, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Disease risk factors
const RISK_FACTORS = [
  { id: "smoking", label: "Smoking" },
  { id: "alcohol", label: "Regular Alcohol Consumption" },
  { id: "family_history", label: "Family History of Heart Disease" },
  { id: "high_bp_history", label: "History of High Blood Pressure" },
  { id: "diabetes", label: "Diabetes" },
  { id: "high_cholesterol", label: "High Cholesterol" },
  { id: "obesity", label: "Obesity" },
  { id: "physical_inactivity", label: "Physical Inactivity" },
  { id: "stress", label: "High Stress Levels" },
  { id: "poor_diet", label: "Poor Diet" }
];

// Sample disease risk data
const SAMPLE_DISEASE_DATA = {
  cardiovascular: {
    name: "Cardiovascular Disease",
    icon: "heart",
    risk: 38,
    description: "Risk is calculated based on your health metrics, lifestyle, and family history.",
    recommendations: [
      "Consider regular cardiovascular exercise (30 minutes, 5 times weekly)",
      "Follow a heart-healthy diet low in saturated fats and sodium",
      "Monitor blood pressure and cholesterol levels regularly",
      "Reduce stress through mindfulness practices"
    ]
  },
  diabetes: {
    name: "Type 2 Diabetes",
    icon: "droplet",
    risk: 24,
    description: "Your risk assessment is based on your BMI, activity level, and family history.",
    recommendations: [
      "Maintain a healthy weight through balanced diet and exercise",
      "Monitor carbohydrate intake and balance with protein and healthy fats",
      "Consider regular blood glucose monitoring",
      "Stay physically active with at least 150 minutes of moderate activity weekly"
    ]
  },
  stroke: {
    name: "Stroke",
    icon: "brain",
    risk: 17,
    description: "Risk factors include blood pressure, heart conditions, and lifestyle choices.",
    recommendations: [
      "Keep blood pressure within healthy ranges (below 120/80 mmHg)",
      "Limit sodium and alcohol consumption",
      "Quit smoking if applicable",
      "Maintain healthy cholesterol levels"
    ]
  }
};

const DiseaseMetrics = () => {
  const [activeTab, setActiveTab] = useState("input");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const { toast } = useToast();

  // Form states
  const [age, setAge] = useState(35);
  const [bloodPressure, setBloodPressure] = useState({ systolic: 120, diastolic: 80 });
  const [cholesterol, setCholesterol] = useState(180);
  const [bloodSugar, setBloodSugar] = useState(90);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [gender, setGender] = useState("male");
  const [medicalNotes, setMedicalNotes] = useState("");

  // Calculate BMI
  const calculateBMI = () => {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  // Toggle risk factor checkboxes
  const toggleRiskFactor = (id: string) => {
    if (riskFactors.includes(id)) {
      setRiskFactors(riskFactors.filter(factor => factor !== id));
    } else {
      setRiskFactors([...riskFactors, id]);
    }
  };

  // Submit health data
  const handleSubmit = () => {
    setSubmitting(true);
    
    // Simulate API call to backend for risk assessment
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setActiveTab("results");
      
      toast({
        title: "Health data submitted successfully",
        description: "Your disease risk assessment has been generated.",
        variant: "default",
      });
    }, 2000);
  };

  // Handle lab results upload
  const handleLabUpload = () => {
    toast({
      title: "Feature in development",
      description: "Lab results upload will be available soon.",
      variant: "default",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold mb-3 text-forest dark:text-sage-light">Disease Risk Assessment</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter your health metrics to assess your risk for common diseases and receive personalized prevention recommendations
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto mb-8 grid-cols-3">
            <TabsTrigger value="input">Health Metrics</TabsTrigger>
            <TabsTrigger value="results" disabled={!submitted}>Risk Assessment</TabsTrigger>
            <TabsTrigger value="history" disabled={!submitted}>History</TabsTrigger>
          </TabsList>
          
          {/* Health Metrics Input Tab */}
          <TabsContent value="input">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Enter your basic health information for accurate risk assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Age Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="age">Age (years)</Label>
                        <span>{age}</span>
                      </div>
                      <Slider
                        id="age"
                        min={18}
                        max={100}
                        step={1}
                        value={[age]}
                        onValueChange={(values) => setAge(values[0])}
                      />
                    </div>
                    
                    {/* Gender Selection */}
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <RadioGroup
                        value={gender}
                        onValueChange={setGender}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="gender-male" />
                          <Label htmlFor="gender-male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="gender-female" />
                          <Label htmlFor="gender-female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="gender-other" />
                          <Label htmlFor="gender-other">Other</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {/* Height and Weight */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          value={weight}
                          onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    
                    {/* BMI Calculation */}
                    <div className="bg-muted/50 p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Body Mass Index (BMI)</h3>
                        <p className="text-sm text-muted-foreground">
                          Based on your height and weight
                        </p>
                      </div>
                      <div className="text-center">
                        <span className="text-xl font-bold">{calculateBMI()}</span>
                        <p className="text-xs text-muted-foreground">kg/m²</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Factors</CardTitle>
                    <CardDescription>
                      Select all risk factors that apply to you
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3">
                      {RISK_FACTORS.map((factor) => (
                        <div key={factor.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={factor.id} 
                            checked={riskFactors.includes(factor.id)}
                            onCheckedChange={() => toggleRiskFactor(factor.id)}
                          />
                          <Label htmlFor={factor.id} className="text-sm">
                            {factor.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Clinical Measurements</CardTitle>
                    <CardDescription>
                      Enter your latest clinical measurements for more accurate assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Blood Pressure */}
                    <div className="space-y-2">
                      <Label>Blood Pressure (mmHg)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Systolic"
                          value={bloodPressure.systolic}
                          onChange={(e) => setBloodPressure({...bloodPressure, systolic: parseInt(e.target.value) || 0})}
                          className="w-24"
                        />
                        <span>/</span>
                        <Input
                          type="number"
                          placeholder="Diastolic"
                          value={bloodPressure.diastolic}
                          onChange={(e) => setBloodPressure({...bloodPressure, diastolic: parseInt(e.target.value) || 0})}
                          className="w-24"
                        />
                      </div>
                    </div>
                    
                    {/* Cholesterol */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="cholesterol">Total Cholesterol (mg/dL)</Label>
                        <span className="text-sm">
                          {cholesterol < 200 ? (
                            <span className="text-green-500 dark:text-green-400">Normal</span>
                          ) : cholesterol < 240 ? (
                            <span className="text-yellow-500 dark:text-yellow-400">Borderline</span>
                          ) : (
                            <span className="text-red-500 dark:text-red-400">High</span>
                          )}
                        </span>
                      </div>
                      <Input
                        id="cholesterol"
                        type="number"
                        value={cholesterol}
                        onChange={(e) => setCholesterol(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    
                    {/* Blood Sugar */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="blood-sugar">Fasting Blood Sugar (mg/dL)</Label>
                        <span className="text-sm">
                          {bloodSugar < 100 ? (
                            <span className="text-green-500 dark:text-green-400">Normal</span>
                          ) : bloodSugar < 126 ? (
                            <span className="text-yellow-500 dark:text-yellow-400">Pre-diabetic</span>
                          ) : (
                            <span className="text-red-500 dark:text-red-400">Diabetic</span>
                          )}
                        </span>
                      </div>
                      <Input
                        id="blood-sugar"
                        type="number"
                        value={bloodSugar}
                        onChange={(e) => setBloodSugar(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div className="pt-2 border-t border-border">
                      <Button onClick={handleLabUpload} variant="outline" className="w-full">
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Upload Lab Results
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Upload your lab results PDF to automatically fill your clinical measurements
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                    <CardDescription>
                      Add any relevant medical history or conditions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Enter any additional medical history, medications, or symptoms..."
                      value={medicalNotes}
                      onChange={(e) => setMedicalNotes(e.target.value)}
                      rows={4}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSubmit} className="w-full" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {submitted ? "Update Assessment" : "Generate Risk Assessment"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Risk Assessment Results Tab */}
          <TabsContent value="results">
            {submitted ? (
              <div className="space-y-6">
                <Alert className="bg-accent/50 border-accent-foreground/20">
                  <Thermometer className="h-4 w-4" />
                  <AlertTitle>Assessment Complete</AlertTitle>
                  <AlertDescription>
                    This risk assessment is based on the metrics you provided and should be reviewed with a healthcare professional.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Cardiovascular Disease Card */}
                  <Card>
                    <CardHeader className="pb-2">
                      <Badge className="w-fit mb-2" variant={SAMPLE_DISEASE_DATA.cardiovascular.risk > 30 ? "destructive" : "outline"}>
                        {SAMPLE_DISEASE_DATA.cardiovascular.risk}% Risk
                      </Badge>
                      <CardTitle>{SAMPLE_DISEASE_DATA.cardiovascular.name}</CardTitle>
                      <CardDescription>
                        {SAMPLE_DISEASE_DATA.cardiovascular.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div 
                            className="bg-red-500 h-2.5 rounded-full" 
                            style={{ width: `${SAMPLE_DISEASE_DATA.cardiovascular.risk}%` }}
                          ></div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Primary Risk Factors:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {riskFactors.includes("smoking") && <li className="flex items-center gap-2"><AlertCircle className="h-3.5 w-3.5 text-red-500" /> Smoking</li>}
                            {riskFactors.includes("high_bp_history") && <li className="flex items-center gap-2"><AlertCircle className="h-3.5 w-3.5 text-red-500" /> High blood pressure</li>}
                            {riskFactors.includes("high_cholesterol") && <li className="flex items-center gap-2"><AlertCircle className="h-3.5 w-3.5 text-red-500" /> High cholesterol</li>}
                            {bloodPressure.systolic > 130 && <li className="flex items-center gap-2"><AlertCircle className="h-3.5 w-3.5 text-red-500" /> Elevated blood pressure ({bloodPressure.systolic}/{bloodPressure.diastolic} mmHg)</li>}
                          </ul>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Prevention Tips:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {SAMPLE_DISEASE_DATA.cardiovascular.recommendations.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" size="sm">
                        View Detailed Analysis
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Diabetes Card */}
                  <Card>
                    <CardHeader className="pb-2">
                      <Badge className="w-fit mb-2" variant={SAMPLE_DISEASE_DATA.diabetes.risk > 30 ? "destructive" : "outline"}>
                        {SAMPLE_DISEASE_DATA.diabetes.risk}% Risk
                      </Badge>
                      <CardTitle>{SAMPLE_DISEASE_DATA.diabetes.name}</CardTitle>
                      <CardDescription>
                        {SAMPLE_DISEASE_DATA.diabetes.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div 
                            className="bg-yellow-500 h-2.5 rounded-full" 
                            style={{ width: `${SAMPLE_DISEASE_DATA.diabetes.risk}%` }}
                          ></div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Primary Risk Factors:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {parseInt(calculateBMI()) > 25 && <li className="flex items-center gap-2"><AlertCircle className="h-3.5 w-3.5 text-yellow-500" /> BMI above normal range ({calculateBMI()})</li>}
                            {bloodSugar > 100 && <li className="flex items-center gap-2"><AlertCircle className="h-3.5 w-3.5 text-yellow-500" /> Elevated blood sugar ({bloodSugar} mg/dL)</li>}
                            {riskFactors.includes("physical_inactivity") && <li className="flex items-center gap-2"><AlertCircle className="h-3.5 w-3.5 text-yellow-500" /> Physical inactivity</li>}
                            {riskFactors.includes("poor_diet") && <li className="flex items-center gap-2"><AlertCircle className="h-3.5 w-3.5 text-yellow-500" /> Diet high in sugars and processed foods</li>}
                          </ul>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Prevention Tips:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {SAMPLE_DISEASE_DATA.diabetes.recommendations.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" size="sm">
                        View Detailed Analysis
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Stroke Card */}
                  <Card>
                    <CardHeader className="pb-2">
                      <Badge className="w-fit mb-2" variant="outline">
                        {SAMPLE_DISEASE_DATA.stroke.risk}% Risk
                      </Badge>
                      <CardTitle>{SAMPLE_DISEASE_DATA.stroke.name}</CardTitle>
                      <CardDescription>
                        {SAMPLE_DISEASE_DATA.stroke.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div 
                            className="bg-blue-500 h-2.5 rounded-full" 
                            style={{ width: `${SAMPLE_DISEASE_DATA.stroke.risk}%` }}
                          ></div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Primary Risk Factors:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {riskFactors.includes("high_bp_history") && <li className="flex items-center gap-2"><AlertCircle className="h-3.5 w-3.5 text-blue-500" /> History of high blood pressure</li>}
                            {bloodPressure.systolic > 130 && <li className="flex items-center gap-2"><AlertCircle className="h-3.5 w-3.5 text-blue-500" /> Elevated blood pressure ({bloodPressure.systolic}/{bloodPressure.diastolic} mmHg)</li>}
                            {age > 55 && <li className="flex items-center gap-2"><AlertCircle className="h-3.5 w-3.5 text-blue-500" /> Age factor ({age} years)</li>}
                            {riskFactors.includes("smoking") && <li className="flex items-center gap-2"><AlertCircle className="h-3.5 w-3.5 text-blue-500" /> Smoking</li>}
                          </ul>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Prevention Tips:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {SAMPLE_DISEASE_DATA.stroke.recommendations.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" size="sm">
                        View Detailed Analysis
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <div className="flex flex-col gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Health Overview</CardTitle>
                      <CardDescription>Summary of your metrics and health status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium">Vitals</h3>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 bg-muted/40 rounded-lg text-center">
                              <div className="text-xs text-muted-foreground">Blood Pressure</div>
                              <div className="text-sm font-medium">{bloodPressure.systolic}/{bloodPressure.diastolic}</div>
                              <div className="text-xs text-muted-foreground">mmHg</div>
                            </div>
                            <div className="p-3 bg-muted/40 rounded-lg text-center">
                              <div className="text-xs text-muted-foreground">BMI</div>
                              <div className="text-sm font-medium">{calculateBMI()}</div>
                              <div className="text-xs text-muted-foreground">kg/m²</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium">Blood Work</h3>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 bg-muted/40 rounded-lg text-center">
                              <div className="text-xs text-muted-foreground">Cholesterol</div>
                              <div className="text-sm font-medium">{cholesterol}</div>
                              <div className="text-xs text-muted-foreground">mg/dL</div>
                            </div>
                            <div className="p-3 bg-muted/40 rounded-lg text-center">
                              <div className="text-xs text-muted-foreground">Blood Sugar</div>
                              <div className="text-sm font-medium">{bloodSugar}</div>
                              <div className="text-xs text-muted-foreground">mg/dL</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium">Risk Level</h3>
                          <div className="p-3 bg-muted/40 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground">Overall Risk</div>
                              <div className="text-sm font-medium">
                                {Math.max(SAMPLE_DISEASE_DATA.cardiovascular.risk, SAMPLE_DISEASE_DATA.diabetes.risk, SAMPLE_DISEASE_DATA.stroke.risk) > 30 ? (
                                  <span className="text-red-500">Elevated</span>
                                ) : (
                                  <span className="text-green-500">Moderate</span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">Based on assessments</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex gap-4">
                    <Button variant="default" className="w-full" onClick={() => setActiveTab("input")}>
                      Update Health Data
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Save Assessment Report
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-4">
                    <BarChart4 className="h-16 w-16 text-muted-foreground/50 mx-auto" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No risk assessment available</h3>
                  <p className="text-muted-foreground mb-4">
                    Please enter your health metrics to generate a disease risk assessment
                  </p>
                  <Button onClick={() => setActiveTab("input")}>Enter Health Data</Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assessment History</CardTitle>
                <CardDescription>Track changes in your health metrics and disease risk over time</CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="space-y-6">
                    <div className="border border-border rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="text-left p-3 font-medium">Date</th>
                            <th className="text-left p-3 font-medium">BP (mmHg)</th>
                            <th className="text-left p-3 font-medium">BMI</th>
                            <th className="text-left p-3 font-medium">Cholesterol</th>
                            <th className="text-left p-3 font-medium">CVD Risk</th>
                            <th className="text-left p-3 font-medium">Diabetes Risk</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr>
                            <td className="p-3">{new Date().toLocaleDateString()}</td>
                            <td className="p-3">{bloodPressure.systolic}/{bloodPressure.diastolic}</td>
                            <td className="p-3">{calculateBMI()}</td>
                            <td className="p-3">{cholesterol} mg/dL</td>
                            <td className="p-3">{SAMPLE_DISEASE_DATA.cardiovascular.risk}%</td>
                            <td className="p-3">{SAMPLE_DISEASE_DATA.diabetes.risk}%</td>
                          </tr>
                          <tr>
                            <td className="p-3">{new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}</td>
                            <td className="p-3">128/84</td>
                            <td className="p-3">25.1</td>
                            <td className="p-3">192 mg/dL</td>
                            <td className="p-3">42%</td>
                            <td className="p-3">28%</td>
                          </tr>
                          <tr>
                            <td className="p-3">{new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toLocaleDateString()}</td>
                            <td className="p-3">135/88</td>
                            <td className="p-3">26.2</td>
                            <td className="p-3">210 mg/dL</td>
                            <td className="p-3">47%</td>
                            <td className="p-3">32%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6">
                      <Card className="flex-1">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Cardiovascular Risk Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-52 flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                              <BarChart4 className="h-12 w-12 mx-auto mb-2 opacity-30" />
                              <p>Risk trend visualization will appear here</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="flex-1">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Health Metrics Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-52 flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                              <BarChart4 className="h-12 w-12 mx-auto mb-2 opacity-30" />
                              <p>Metrics trend visualization will appear here</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Regular assessments help track your health progress and disease risk over time
                      </p>
                      <Button variant="outline">
                        Download History Report
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mb-4">
                      <BarChart4 className="h-16 w-16 text-muted-foreground/50 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No assessment history available</h3>
                    <p className="text-muted-foreground mb-4">
                      Complete your first health assessment to start tracking your health metrics over time
                    </p>
                    <Button onClick={() => setActiveTab("input")}>Enter Health Data</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DiseaseMetrics;
