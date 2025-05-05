
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const healthFormSchema = z.object({
  height: z.string().min(1, "Height is required"),
  weight: z.string().min(1, "Weight is required"),
  bloodType: z.string().min(1, "Blood type is required"),
  smokingStatus: z.string(),
  alcoholConsumption: z.string(),
  exerciseFrequency: z.string(),
  chronicConditions: z.array(z.string()).optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
});

type HealthFormValues = z.infer<typeof healthFormSchema>;

const HealthForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { user, updateUser } = useAuth();
  
  const form = useForm<HealthFormValues>({
    resolver: zodResolver(healthFormSchema),
    defaultValues: {
      height: "",
      weight: "",
      bloodType: "",
      smokingStatus: "non-smoker",
      alcoholConsumption: "none",
      exerciseFrequency: "moderate",
      chronicConditions: [],
      allergies: "",
      medications: "",
    },
  });

  const onSubmit = (data: HealthFormValues) => {
    // Update the user profile completed status
    if (updateUser) {
      updateUser({ profileCompleted: true });
    }
    
    toast({
      title: "Health information saved",
      description: "Your health information has been saved successfully."
    });
    
    // Save health data to localStorage as well (in a real app, this would go to a database)
    localStorage.setItem(`health_data_${user?.uid}`, JSON.stringify(data));
    
    navigate("/dashboard");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-forest mb-6">Health Information</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-forest">Personal Health Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 && (
                  <div className="animate-fade-in">
                    <h2 className="text-lg font-medium text-forest mb-4">Basic Measurements</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (cm)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="bloodType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blood Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select blood type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="A+">A+</SelectItem>
                                <SelectItem value="A-">A-</SelectItem>
                                <SelectItem value="B+">B+</SelectItem>
                                <SelectItem value="B-">B-</SelectItem>
                                <SelectItem value="AB+">AB+</SelectItem>
                                <SelectItem value="AB-">AB-</SelectItem>
                                <SelectItem value="O+">O+</SelectItem>
                                <SelectItem value="O-">O-</SelectItem>
                                <SelectItem value="Unknown">Unknown</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button type="button" onClick={() => setStep(2)}>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {step === 2 && (
                  <div className="animate-fade-in">
                    <h2 className="text-lg font-medium text-forest mb-4">Lifestyle Information</h2>
                    
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="smokingStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Smoking Status</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="non-smoker" id="non-smoker" />
                                  <FormLabel htmlFor="non-smoker" className="font-normal">Non-smoker</FormLabel>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="former-smoker" id="former-smoker" />
                                  <FormLabel htmlFor="former-smoker" className="font-normal">Former smoker</FormLabel>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="current-smoker" id="current-smoker" />
                                  <FormLabel htmlFor="current-smoker" className="font-normal">Current smoker</FormLabel>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="alcoholConsumption"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alcohol Consumption</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="occasional">Occasional (1-2 drinks/month)</SelectItem>
                                <SelectItem value="moderate">Moderate (1-2 drinks/week)</SelectItem>
                                <SelectItem value="regular">Regular (3-6 drinks/week)</SelectItem>
                                <SelectItem value="heavy">Heavy (daily)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="exerciseFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Exercise Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="sedentary">Sedentary (No exercise)</SelectItem>
                                <SelectItem value="light">Light (1-2 days/week)</SelectItem>
                                <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                                <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                                <SelectItem value="very-active">Very Active (Twice daily)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button type="button" onClick={() => setStep(3)}>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {step === 3 && (
                  <div className="animate-fade-in">
                    <h2 className="text-lg font-medium text-forest mb-4">Medical History</h2>
                    
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="allergies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Allergies (if any)</FormLabel>
                            <FormControl>
                              <Input placeholder="List allergies separated by commas" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="medications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Medications (if any)</FormLabel>
                            <FormControl>
                              <Input placeholder="List medications separated by commas" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-3">
                        <FormLabel>Chronic Conditions (select all that apply)</FormLabel>
                        {["Diabetes", "Hypertension", "Heart Disease", "Asthma", "Arthritis", "None"].map((condition) => (
                          <div key={condition} className="flex items-center space-x-2">
                            <Checkbox id={condition} value={condition} />
                            <label
                              htmlFor={condition}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {condition}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" /> Save Information
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="bg-sage-light/10 rounded-lg p-4 text-sm text-muted-foreground">
          <p>Your health information is protected and secure. We use this information to provide personalized health recommendations and risk assessments. You can update this information at any time.</p>
        </div>
      </div>
    </Layout>
  );
};

export default HealthForm;
