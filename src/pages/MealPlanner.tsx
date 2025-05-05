
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Clock, Loader2, RotateCcw, Utensils, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Sample meal data
const SAMPLE_MEALS = {
  breakfast: [
    { name: "Greek Yogurt with Berries and Granola", calories: 320, prepTime: 5, protein: 18, carbs: 42, fat: 10 },
    { name: "Avocado Toast with Poached Eggs", calories: 420, prepTime: 15, protein: 20, carbs: 35, fat: 22 },
    { name: "Overnight Oats with Chia Seeds", calories: 380, prepTime: 10, protein: 15, carbs: 52, fat: 12 },
  ],
  lunch: [
    { name: "Quinoa Buddha Bowl", calories: 480, prepTime: 20, protein: 22, carbs: 62, fat: 15 },
    { name: "Mediterranean Chickpea Salad", calories: 410, prepTime: 15, protein: 18, carbs: 45, fat: 18 },
    { name: "Turkey and Avocado Wrap", calories: 450, prepTime: 10, protein: 28, carbs: 40, fat: 20 },
  ],
  dinner: [
    { name: "Salmon with Roasted Vegetables", calories: 520, prepTime: 30, protein: 35, carbs: 25, fat: 28 },
    { name: "Chicken Stir-Fry with Brown Rice", calories: 490, prepTime: 25, protein: 32, carbs: 55, fat: 12 },
    { name: "Lentil Soup with Whole Grain Bread", calories: 440, prepTime: 35, protein: 22, carbs: 65, fat: 10 },
  ],
  snacks: [
    { name: "Apple with Almond Butter", calories: 190, prepTime: 2, protein: 5, carbs: 25, fat: 10 },
    { name: "Hummus with Carrot Sticks", calories: 150, prepTime: 5, protein: 6, carbs: 15, fat: 8 },
    { name: "Trail Mix", calories: 210, prepTime: 1, protein: 8, carbs: 18, fat: 12 },
  ]
};

interface MealPlan {
  [day: string]: {
    breakfast: typeof SAMPLE_MEALS.breakfast[0] | null;
    lunch: typeof SAMPLE_MEALS.lunch[0] | null;
    dinner: typeof SAMPLE_MEALS.dinner[0] | null;
    snacks: typeof SAMPLE_MEALS.snacks[0][] | [];
  }
}

const MealPlanner = () => {
  const [dietary, setDietary] = useState<string[]>([]);
  // Fix the calories state by explicitly typing it as number[] with a proper initial value
  const [calories, setCalories] = useState<number[]>([2000]);
  const [preferences, setPreferences] = useState("");
  const [mealPlanType, setMealPlanType] = useState("balanced");
  const [generatedPlan, setGeneratedPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Handle generating AI meal plan
  const generateMealPlan = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // This would be an actual API call to your backend AI service
      const samplePlan: MealPlan = {};
      
      daysOfWeek.forEach(day => {
        samplePlan[day] = {
          breakfast: SAMPLE_MEALS.breakfast[Math.floor(Math.random() * SAMPLE_MEALS.breakfast.length)],
          lunch: SAMPLE_MEALS.lunch[Math.floor(Math.random() * SAMPLE_MEALS.lunch.length)],
          dinner: SAMPLE_MEALS.dinner[Math.floor(Math.random() * SAMPLE_MEALS.dinner.length)],
          snacks: [SAMPLE_MEALS.snacks[Math.floor(Math.random() * SAMPLE_MEALS.snacks.length)]]
        };
      });
      
      setGeneratedPlan(samplePlan);
      setIsLoading(false);
      
      toast({
        title: "Meal Plan Generated",
        description: "Your weekly meal plan is ready!"
      });
    }, 2500);
  };
  
  // Reset generated meal plan
  const resetMealPlan = () => {
    setDietary([]);
    setCalories([2000]);
    setPreferences("");
    setMealPlanType("balanced");
    setGeneratedPlan(null);
  };
  
  // Toggle dietary restriction
  const toggleDietary = (value: string) => {
    if (dietary.includes(value)) {
      setDietary(prev => prev.filter(item => item !== value));
    } else {
      setDietary(prev => [...prev, value]);
    }
  };

  // Calculate total daily calories
  const calculateTotalCalories = (day: string) => {
    if (!generatedPlan || !generatedPlan[day]) return 0;
    
    const dayPlan = generatedPlan[day];
    let total = 0;
    
    if (dayPlan.breakfast) total += dayPlan.breakfast.calories;
    if (dayPlan.lunch) total += dayPlan.lunch.calories;
    if (dayPlan.dinner) total += dayPlan.dinner.calories;
    dayPlan.snacks.forEach(snack => {
      total += snack.calories;
    });
    
    return total;
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
          <h1 className="text-4xl font-bold mb-3 text-forest dark:text-sage-light">Meal Planner</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate a personalized weekly meal plan based on your dietary preferences, restrictions, and caloric needs
          </p>
        </motion.div>

        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-2">
            <TabsTrigger value="generator">Generate Plan</TabsTrigger>
            <TabsTrigger value="weekly-view">Weekly Schedule</TabsTrigger>
          </TabsList>
          
          {/* Meal Plan Generator Tab */}
          <TabsContent value="generator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customize Your Meal Plan</CardTitle>
                  <CardDescription>
                    Tell us about your preferences and dietary needs to generate your personalized weekly meal plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Meal Plan Type */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Meal Plan Type</h3>
                    <RadioGroup value={mealPlanType} onValueChange={setMealPlanType} className="grid grid-cols-2 gap-2">
                      <div>
                        <RadioGroupItem value="balanced" id="balanced" className="peer sr-only" />
                        <Label
                          htmlFor="balanced"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Utensils className="mb-3 h-6 w-6" />
                          Balanced
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="weight-loss" id="weight-loss" className="peer sr-only" />
                        <Label
                          htmlFor="weight-loss"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Activity className="mb-3 h-6 w-6" />
                          Weight Loss
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Daily Calories */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium">Target Daily Calories</h3>
                      <span className="text-sm text-muted-foreground">{calories[0]} kcal</span>
                    </div>
                    <Slider 
                      value={calories} 
                      onValueChange={setCalories} 
                      min={1200} 
                      max={3000} 
                      step={50} 
                      className="w-full" 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1200 kcal</span>
                      <span>3000 kcal</span>
                    </div>
                  </div>
                  
                  {/* Dietary Restrictions */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Dietary Restrictions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'].map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                          <Switch 
                            id={item.toLowerCase()}
                            checked={dietary.includes(item.toLowerCase())} 
                            onCheckedChange={() => toggleDietary(item.toLowerCase())}
                          />
                          <Label htmlFor={item.toLowerCase()}>{item}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Additional Preferences */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Additional Preferences</h3>
                    <Textarea 
                      placeholder="Example: I prefer high protein meals, I don't like spicy food, I need quick breakfast options..."
                      value={preferences}
                      onChange={(e) => setPreferences(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={generateMealPlan} 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Plan...
                      </>
                    ) : (
                      <>
                        Generate Meal Plan
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="flex flex-col gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Your Meal Plan</CardTitle>
                      {generatedPlan && (
                        <Button variant="ghost" size="sm" onClick={resetMealPlan} className="h-8">
                          <RotateCcw className="h-4 w-4 mr-1" /> Reset
                        </Button>
                      )}
                    </div>
                    <CardDescription>
                      {generatedPlan 
                        ? "Here's your personalized weekly meal plan" 
                        : "Your meal plan will appear here after generation"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!generatedPlan ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>Fill out your preferences and click "Generate Meal Plan"</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(generatedPlan).slice(0, 2).map(([day, meals]) => (
                          <div key={day} className="space-y-2">
                            <h3 className="text-lg font-medium flex items-center justify-between">
                              {day}
                              <Badge variant="outline" className="ml-2">
                                {calculateTotalCalories(day)} kcal
                              </Badge>
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                              {meals.breakfast && (
                                <div className="p-3 rounded-md border border-border">
                                  <div className="flex justify-between">
                                    <div className="text-sm font-medium">Breakfast</div>
                                    <div className="text-xs text-muted-foreground">{meals.breakfast.calories} kcal</div>
                                  </div>
                                  <div className="text-sm mt-1">{meals.breakfast.name}</div>
                                </div>
                              )}
                              {meals.lunch && (
                                <div className="p-3 rounded-md border border-border">
                                  <div className="flex justify-between">
                                    <div className="text-sm font-medium">Lunch</div>
                                    <div className="text-xs text-muted-foreground">{meals.lunch.calories} kcal</div>
                                  </div>
                                  <div className="text-sm mt-1">{meals.lunch.name}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {generatedPlan && (
                          <div className="text-center mt-2">
                            <Button 
                              variant="link" 
                              size="sm"
                              onClick={() => document.querySelector('[value="weekly-view"]')?.dispatchEvent(new Event('click'))}
                            >
                              View Full Week Plan
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {generatedPlan && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Shopping List</CardTitle>
                      <CardDescription>
                        Based on your weekly meal plan
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                            ✓
                          </span>
                          <span>2 cups Greek yogurt</span>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                            ✓
                          </span>
                          <span>1 lb salmon fillets</span>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                            ✓
                          </span>
                          <span>1 dozen eggs</span>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                            ✓
                          </span>
                          <span>2 avocados</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <span className="bg-muted rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                            +
                          </span>
                          <span>12 more items</span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-border text-center">
                          <Button variant="outline" size="sm" className="w-full">
                            View Complete List
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Weekly Schedule Tab */}
          <TabsContent value="weekly-view">
            {!generatedPlan ? (
              <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>No Meal Plan Available</CardTitle>
                  <CardDescription>
                    You haven't generated a meal plan yet. Go to the "Generate Plan" tab to create one.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <Button onClick={() => document.querySelector('[value="generator"]')?.dispatchEvent(new Event('click'))}>
                    Generate a Meal Plan
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Weekly Meal Schedule</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous Week
                    </Button>
                    <Button variant="outline" size="sm">
                      Next Week
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.print()}>
                      Print Plan
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Object.entries(generatedPlan).map(([day, meals]) => (
                    <Card key={day} className="overflow-hidden">
                      <CardHeader className="pb-2 bg-muted/40">
                        <CardTitle className="text-lg flex justify-between items-center">
                          {day}
                          <Badge variant="outline">
                            {calculateTotalCalories(day)} kcal
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y divide-border">
                          {meals.breakfast && (
                            <div className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                                  Breakfast
                                </h4>
                                <span className="text-xs text-muted-foreground flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {meals.breakfast.prepTime} min
                                </span>
                              </div>
                              <p className="text-sm mb-1">{meals.breakfast.name}</p>
                              <div className="flex gap-2 mt-2 text-xs">
                                <Badge variant="secondary" className="font-normal">
                                  {meals.breakfast.protein}g protein
                                </Badge>
                                <Badge variant="secondary" className="font-normal">
                                  {meals.breakfast.calories} kcal
                                </Badge>
                              </div>
                            </div>
                          )}
                          
                          {meals.lunch && (
                            <div className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                  Lunch
                                </h4>
                                <span className="text-xs text-muted-foreground flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {meals.lunch.prepTime} min
                                </span>
                              </div>
                              <p className="text-sm mb-1">{meals.lunch.name}</p>
                              <div className="flex gap-2 mt-2 text-xs">
                                <Badge variant="secondary" className="font-normal">
                                  {meals.lunch.protein}g protein
                                </Badge>
                                <Badge variant="secondary" className="font-normal">
                                  {meals.lunch.calories} kcal
                                </Badge>
                              </div>
                            </div>
                          )}
                          
                          {meals.dinner && (
                            <div className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                                  Dinner
                                </h4>
                                <span className="text-xs text-muted-foreground flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {meals.dinner.prepTime} min
                                </span>
                              </div>
                              <p className="text-sm mb-1">{meals.dinner.name}</p>
                              <div className="flex gap-2 mt-2 text-xs">
                                <Badge variant="secondary" className="font-normal">
                                  {meals.dinner.protein}g protein
                                </Badge>
                                <Badge variant="secondary" className="font-normal">
                                  {meals.dinner.calories} kcal
                                </Badge>
                              </div>
                            </div>
                          )}
                          
                          {meals.snacks.length > 0 && (
                            <div className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                                  Snacks
                                </h4>
                              </div>
                              {meals.snacks.map((snack, index) => (
                                <div key={index} className="text-sm mb-2">
                                  {snack.name}
                                  <div className="text-xs text-muted-foreground">
                                    {snack.calories} kcal
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MealPlanner;
