
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Apple, Carrot, Egg, Fish, Flame, Heart, Info, Salad, Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Diet = () => {
  const { toast } = useToast();
  const [calorieTarget, setCalorieTarget] = useState([2000]);
  const [selectedDiet, setSelectedDiet] = useState("balanced");
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  
  const handleGenerateMealPlan = () => {
    toast({
      title: "Meal plan generated",
      description: `Your ${selectedDiet} meal plan with ${calorieTarget[0]} calories has been created.`
    });
  };
  
  const dietTypes = [
    {
      id: "balanced",
      name: "Balanced",
      description: "Distribution of macronutrients in line with health guidelines",
      icon: <Heart className="h-5 w-5 text-forest" />,
      macros: { protein: "20%", carbs: "50%", fat: "30%" }
    },
    {
      id: "keto",
      name: "Ketogenic",
      description: "High fat, adequate protein, low carbohydrate diet",
      icon: <Flame className="h-5 w-5 text-orange-500" />,
      macros: { protein: "20%", carbs: "5%", fat: "75%" }
    },
    {
      id: "vegan",
      name: "Vegan",
      description: "Plant-based diet excluding animal products",
      icon: <Carrot className="h-5 w-5 text-green-500" />,
      macros: { protein: "15%", carbs: "60%", fat: "25%" }
    },
    {
      id: "mediterranean",
      name: "Mediterranean",
      description: "Based on traditional foods from Mediterranean countries",
      icon: <Fish className="h-5 w-5 text-blue-500" />,
      macros: { protein: "15%", carbs: "55%", fat: "30%" }
    }
  ];

  const meals = [
    {
      id: "breakfast1",
      type: "Breakfast",
      name: "Greek Yogurt Parfait",
      calories: 350,
      protein: 20,
      carbs: 40,
      fat: 12,
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800"
    },
    {
      id: "lunch1",
      type: "Lunch",
      name: "Quinoa Salad with Grilled Chicken",
      calories: 480,
      protein: 32,
      carbs: 45,
      fat: 18,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800"
    },
    {
      id: "dinner1",
      type: "Dinner",
      name: "Baked Salmon with Roasted Vegetables",
      calories: 520,
      protein: 35,
      carbs: 35,
      fat: 25,
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800"
    },
    {
      id: "snack1",
      type: "Snack",
      name: "Apple and Almond Butter",
      calories: 220,
      protein: 7,
      carbs: 25,
      fat: 12,
      image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800"
    }
  ];

  const handleMealClick = (mealId: string) => {
    setSelectedMeal(mealId === selectedMeal ? null : mealId);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-forest mb-6">Diet Planner</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-forest">Meal Plan Generator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Select Diet Type</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {dietTypes.map(diet => (
                      <Card 
                        key={diet.id}
                        className={`cursor-pointer border transition-colors ${
                          selectedDiet === diet.id 
                            ? 'border-forest bg-sage-light/10' 
                            : 'border-border hover:border-forest/50'
                        }`}
                        onClick={() => setSelectedDiet(diet.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{diet.name}</h4>
                            {diet.icon}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{diet.description}</p>
                          <div className="flex justify-between text-xs">
                            <span>🍗 {diet.macros.protein}</span>
                            <span>🥖 {diet.macros.carbs}</span>
                            <span>🥑 {diet.macros.fat}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Daily Calorie Target</h3>
                    <span className="font-medium">{calorieTarget[0]} kcal</span>
                  </div>
                  <Slider
                    value={calorieTarget}
                    min={1200}
                    max={3000}
                    step={50}
                    onValueChange={setCalorieTarget}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1200 kcal</span>
                    <span>3000 kcal</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">Dietary Restrictions</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Gluten-Free", "Dairy-Free", "Nut-Free", "Vegetarian", "Pescatarian", "Low-Sodium", "Low-Sugar"].map(restriction => (
                      <Badge key={restriction} variant="outline" className="cursor-pointer hover:bg-sage-light/10">
                        {restriction}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button onClick={handleGenerateMealPlan} className="w-full">
                  <Utensils className="mr-2 h-4 w-4" />
                  Generate Meal Plan
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-forest">Nutrition Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Calories</span>
                    <span className="font-medium">{calorieTarget[0]} kcal</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-forest rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Protein</span>
                    <span className="font-medium">125g</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Carbs</span>
                    <span className="font-medium">225g</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fat</span>
                    <span className="font-medium">65g</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    <Info className="mr-2 h-4 w-4" />
                    View Detailed Nutrition
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-forest">Today's Meal Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Meals</TabsTrigger>
                <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
                <TabsTrigger value="lunch">Lunch</TabsTrigger>
                <TabsTrigger value="dinner">Dinner</TabsTrigger>
                <TabsTrigger value="snacks">Snacks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {meals.map(meal => (
                    <Card 
                      key={meal.id}
                      className={`cursor-pointer overflow-hidden ${
                        selectedMeal === meal.id ? 'ring-2 ring-forest' : ''
                      }`}
                      onClick={() => handleMealClick(meal.id)}
                    >
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={meal.image} 
                          alt={meal.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <Badge className="mb-2">{meal.type}</Badge>
                        <h3 className="font-medium mb-1">{meal.name}</h3>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{meal.calories} kcal</span>
                          <span>{meal.protein}g protein</span>
                        </div>
                        {selectedMeal === meal.id && (
                          <div className="mt-3 pt-3 border-t border-border animate-fade-in">
                            <div className="grid grid-cols-3 gap-2 text-xs text-center">
                              <div>
                                <div className="font-medium">{meal.protein}g</div>
                                <div className="text-muted-foreground">Protein</div>
                              </div>
                              <div>
                                <div className="font-medium">{meal.carbs}g</div>
                                <div className="text-muted-foreground">Carbs</div>
                              </div>
                              <div>
                                <div className="font-medium">{meal.fat}g</div>
                                <div className="text-muted-foreground">Fat</div>
                              </div>
                            </div>
                            <Button size="sm" className="w-full mt-3">
                              View Recipe
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="breakfast">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {meals.filter(m => m.type === "Breakfast").map(meal => (
                    <Card key={meal.id}>
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={meal.image} 
                          alt={meal.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-1">{meal.name}</h3>
                        <div className="flex justify-between text-sm text-muted-foreground mb-3">
                          <span>{meal.calories} kcal</span>
                          <span>{meal.protein}g protein</span>
                        </div>
                        <Button size="sm" className="w-full">
                          View Recipe
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="lunch">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {meals.filter(m => m.type === "Lunch").map(meal => (
                    <Card key={meal.id}>
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={meal.image} 
                          alt={meal.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-1">{meal.name}</h3>
                        <div className="flex justify-between text-sm text-muted-foreground mb-3">
                          <span>{meal.calories} kcal</span>
                          <span>{meal.protein}g protein</span>
                        </div>
                        <Button size="sm" className="w-full">
                          View Recipe
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="dinner">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {meals.filter(m => m.type === "Dinner").map(meal => (
                    <Card key={meal.id}>
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={meal.image} 
                          alt={meal.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-1">{meal.name}</h3>
                        <div className="flex justify-between text-sm text-muted-foreground mb-3">
                          <span>{meal.calories} kcal</span>
                          <span>{meal.protein}g protein</span>
                        </div>
                        <Button size="sm" className="w-full">
                          View Recipe
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="snacks">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {meals.filter(m => m.type === "Snack").map(meal => (
                    <Card key={meal.id}>
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={meal.image} 
                          alt={meal.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-1">{meal.name}</h3>
                        <div className="flex justify-between text-sm text-muted-foreground mb-3">
                          <span>{meal.calories} kcal</span>
                          <span>{meal.protein}g protein</span>
                        </div>
                        <Button size="sm" className="w-full">
                          View Recipe
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Diet;
