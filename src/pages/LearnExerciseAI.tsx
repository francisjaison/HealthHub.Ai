
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Dumbbell, Search, Activity, RotateCcw, ThumbsUp, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import ExerciseAnalyzer from "@/components/ExerciseAnalyzer";

// Sample exercise data for demonstration
const SAMPLE_EXERCISES = [
  {
    name: "Push-ups",
    type: "Strength",
    difficulty: "Beginner",
    muscles: ["Chest", "Triceps", "Shoulders"],
    steps: [
      "Start in a plank position with your hands slightly wider than shoulder-width",
      "Lower your body until your chest nearly touches the floor",
      "Push yourself back up to the starting position",
      "Keep your body in a straight line throughout the movement"
    ],
    tips: "Keep your core engaged and don't let your hips sag",
    sets: "3",
    reps: "10-15",
    restTime: "60 seconds"
  },
  {
    name: "Squats",
    type: "Strength",
    difficulty: "Beginner",
    muscles: ["Quadriceps", "Hamstrings", "Glutes"],
    steps: [
      "Stand with feet shoulder-width apart",
      "Bend your knees and lower your hips as if sitting in a chair",
      "Keep your chest up and back straight",
      "Lower until thighs are parallel to the ground",
      "Return to standing position"
    ],
    tips: "Keep weight in your heels and knees tracking over toes",
    sets: "3",
    reps: "12-15",
    restTime: "90 seconds"
  },
  {
    name: "Plank",
    type: "Core",
    difficulty: "Beginner",
    muscles: ["Abs", "Back", "Shoulders"],
    steps: [
      "Get into a push-up position with forearms on the ground",
      "Keep elbows directly under shoulders",
      "Create a straight line from head to heels",
      "Hold the position while engaging your core"
    ],
    tips: "Don't let your hips rise or sag, keep breathing",
    sets: "3",
    reps: "Hold for 30-60 seconds",
    restTime: "60 seconds"
  }
];

const LearnExerciseAI = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [exerciseType, setExerciseType] = useState("all");
  const [userPrompt, setUserPrompt] = useState("");
  const [generatedWorkout, setGeneratedWorkout] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const { toast } = useToast();

  // Filter exercises based on search and type
  const filteredExercises = SAMPLE_EXERCISES.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = exerciseType === "all" || exercise.type.toLowerCase() === exerciseType.toLowerCase();
    return matchesSearch && matchesType;
  });

  // Handle generating AI workout plan
  const generateWorkoutPlan = async () => {
    if (!userPrompt) {
      toast({
        title: "Missing information",
        description: "Please describe your fitness goals and preferences.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // This is a simulation. In a real app, this would be an API call to your AI backend
      const sampleResponse = `
# Personalized Workout Plan

Based on your goals to ${userPrompt.toLowerCase().includes("weight loss") ? "lose weight" : "build strength"}, here's a 4-week plan:

## Week 1-2: Foundation
- **Monday**: 3 sets of 12 Push-ups, 3 sets of 15 Squats, 3 sets of 30-second Planks
- **Wednesday**: 30 minutes of brisk walking, 3 sets of 10 Lunges (each leg)
- **Friday**: 3 sets of 12 Push-ups, 3 sets of 15 Squats, 3 sets of 30-second Planks

## Week 3-4: Progression
- **Monday**: 4 sets of 15 Push-ups, 4 sets of 20 Squats, 3 sets of 45-second Planks
- **Wednesday**: 30 minutes of interval training (alternating 3 minutes brisk walk, 1 minute jog)
- **Friday**: 4 sets of 15 Push-ups, 4 sets of 20 Squats, 3 sets of 45-second Planks

Rest 60-90 seconds between sets. Focus on proper form over quantity.
`;
      
      setGeneratedWorkout(sampleResponse);
      setIsLoading(false);
      
      toast({
        title: "Workout Plan Generated",
        description: "Your personalized workout plan is ready!"
      });
    }, 2000);
  };

  // Reset generated workout
  const resetWorkout = () => {
    setUserPrompt("");
    setGeneratedWorkout("");
  };
  
  // Handle analyzing an exercise
  const analyzeExercise = (exerciseName: string) => {
    setSelectedExercise(exerciseName);
    toast({
      title: "Analyzing Exercise",
      description: `Analyzing ${exerciseName} form and technique...`
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
          <h1 className="text-4xl font-bold mb-3 text-forest dark:text-sage-light">Learn Exercise with AI</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover exercises, learn proper form, and get AI-powered workout plans tailored to your fitness goals
          </p>
        </motion.div>

        <Tabs defaultValue="exercises" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-2">
            <TabsTrigger value="exercises">Exercise Library</TabsTrigger>
            <TabsTrigger value="ai-planner">AI Workout Planner</TabsTrigger>
          </TabsList>
          
          {/* Exercise Library Tab */}
          <TabsContent value="exercises">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search exercises..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    variant={exerciseType === "all" ? "default" : "outline"}
                    onClick={() => setExerciseType("all")}
                    className="flex-grow md:flex-grow-0"
                  >
                    All
                  </Button>
                  <Button 
                    variant={exerciseType === "strength" ? "default" : "outline"}
                    onClick={() => setExerciseType("strength")}
                    className="flex-grow md:flex-grow-0"
                  >
                    <Dumbbell className="mr-1 h-4 w-4" />
                    Strength
                  </Button>
                  <Button 
                    variant={exerciseType === "core" ? "default" : "outline"}
                    onClick={() => setExerciseType("core")}
                    className="flex-grow md:flex-grow-0"
                  >
                    <Activity className="mr-1 h-4 w-4" />
                    Core
                  </Button>
                </div>
              </div>

              {selectedExercise ? (
                <ExerciseAnalyzer 
                  exercise={selectedExercise}
                  onClose={() => setSelectedExercise(null)} 
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredExercises.length > 0 ? (
                    filteredExercises.map((exercise, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                              {exercise.name}
                              <Badge variant="outline">{exercise.difficulty}</Badge>
                            </CardTitle>
                            <CardDescription>
                              <span className="font-medium">{exercise.type}</span> • Works: {exercise.muscles.join(", ")}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <h4 className="font-semibold mb-2">How to perform:</h4>
                            <ol className="list-decimal ml-5 space-y-1 text-sm">
                              {exercise.steps.map((step, i) => (
                                <li key={i}>{step}</li>
                              ))}
                            </ol>
                            
                            <div className="mt-4 pt-3 border-t border-border">
                              <p className="text-sm text-muted-foreground">
                                <strong>Tip:</strong> {exercise.tips}
                              </p>
                            </div>
                          </CardContent>
                          <CardFooter className="flex flex-col gap-3">
                            <div className="flex justify-between text-sm w-full">
                              <div className="flex items-center gap-1">
                                <RotateCcw className="h-4 w-4 text-muted-foreground" />
                                <span>{exercise.sets} sets</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                                <span>{exercise.reps}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Timer className="h-4 w-4 text-muted-foreground" />
                                <span>Rest: {exercise.restTime}</span>
                              </div>
                            </div>
                            <Button 
                              variant="default" 
                              className="w-full"
                              onClick={() => analyzeExercise(exercise.name)}
                            >
                              Analyze Form & Technique
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">No exercises found matching your criteria.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* AI Workout Planner Tab */}
          <TabsContent value="ai-planner">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Your Workout Plan</CardTitle>
                  <CardDescription>
                    Describe your fitness goals, experience level, and any preferences to get a personalized workout plan.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Example: I want to lose weight and tone my arms. I can work out 3 days a week for 30 minutes. I don't have any equipment at home."
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    rows={6}
                    className="resize-none mb-4"
                  />
                  <Button 
                    onClick={generateWorkoutPlan} 
                    className="w-full" 
                    disabled={isLoading || !userPrompt}
                  >
                    {isLoading ? (
                      <>Generating Plan...</>
                    ) : (
                      <>
                        Generate Workout Plan
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
              
              <Card className={generatedWorkout ? "" : "bg-muted/40"}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    Your Personalized Workout Plan
                    {generatedWorkout && (
                      <Button variant="ghost" size="sm" onClick={resetWorkout}>
                        <RotateCcw className="h-4 w-4 mr-1" /> Reset
                      </Button>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {generatedWorkout ? "Here's your AI-generated workout plan based on your goals" : "Your plan will appear here after generation"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedWorkout ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="whitespace-pre-line">{generatedWorkout}</div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>Fill out your details and click "Generate Workout Plan"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default LearnExerciseAI;
