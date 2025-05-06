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
import ExerciseDashboard from "@/components/ExerciseDashboard";

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
  },
  {
    name: "Hip Circles",
    type: "Mobility",
    difficulty: "Beginner",
    muscles: ["Hips", "Lower Back", "Core"],
    steps: [
      "Stand with feet shoulder-width apart and hands on hips",
      "Rotate your hips in a circular motion, making a complete circle",
      "Perform rotations in one direction, then switch to the opposite direction",
      "Keep your upper body stable throughout the movement"
    ],
    tips: "Focus on making smooth, controlled circles and engage your core",
    sets: "2",
    reps: "10-12 circles in each direction",
    restTime: "30 seconds"
  },
  {
    name: "Wrist Rotate",
    type: "Mobility",
    difficulty: "Beginner",
    muscles: ["Wrists", "Forearms"],
    steps: [
      "Extend your arms in front of you",
      "Make fists with both hands",
      "Rotate your wrists in circular motions",
      "Perform rotations in both clockwise and counterclockwise directions"
    ],
    tips: "Keep movements slow and controlled, avoid overextending",
    sets: "2",
    reps: "10-15 rotations in each direction",
    restTime: "20 seconds"
  },
  {
    name: "Arm Circles",
    type: "Mobility",
    difficulty: "Beginner",
    muscles: ["Shoulders", "Upper Back", "Arms"],
    steps: [
      "Stand with feet shoulder-width apart",
      "Extend your arms out to the sides at shoulder height",
      "Move your arms in a circular motion, making small circles",
      "Gradually increase to larger circles, then reverse direction"
    ],
    tips: "Keep your shoulders relaxed and maintain good posture",
    sets: "2",
    reps: "10 small circles, 10 medium circles, 10 large circles in each direction",
    restTime: "45 seconds"
  }
];

const LearnExerciseAI = () => {
  const { toast } = useToast();
  const [userPrompt, setUserPrompt] = useState("");
  const [generatedWorkout, setGeneratedWorkout] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("exercises"); // Added state for active tab
  
  // Interface for exercise reports
  interface ExerciseReport {
    id: string;
    exercise: string;
    date: string;
    duration: number;
    repCount: number;
    formScore: number;
    calories: number;
  }
  
  // Handle saving a report
  const handleSaveReport = (reportContent: string) => {
    try {
      // Parse duration from report
      const durationMatch = reportContent.match(/Total Duration\s*\n([0-9:]+)/);
      const duration = durationMatch ? convertTimeToSeconds(durationMatch[1]) : 0;
      
      // Parse rep count from report
      const repCountMatch = reportContent.match(/Repetitions\s*\n(\d+)/);
      const repCount = repCountMatch ? parseInt(repCountMatch[1], 10) : 0;
      
      // Parse form score from report
      const formScoreMatch = reportContent.match(/Form Quality\s*\n(\d+)%/);
      const formScore = formScoreMatch ? parseInt(formScoreMatch[1], 10) : 0;
      
      // Parse calories from report
      const caloriesMatch = reportContent.match(/Calories Burned\s*\n([\d.]+)/);
      const calories = caloriesMatch ? parseFloat(caloriesMatch[1]) : 0;
      
      // Only proceed if we have an exercise selected
      if (selectedExercise) {
        // Create report object
        const report: Omit<ExerciseReport, 'id' | 'date'> = {
          exercise: selectedExercise,
          duration,
          repCount,
          formScore,
          calories
        };
        
        // Get existing reports from localStorage
        const existingReportsStr = localStorage.getItem('exerciseReports');
        let existingReports: ExerciseReport[] = [];
        
        if (existingReportsStr) {
          existingReports = JSON.parse(existingReportsStr);
        }
        
        // Add new report
        const newReport: ExerciseReport = {
          ...report,
          id: Date.now().toString(),
          date: new Date().toISOString()
        };
        
        // Save back to localStorage
        localStorage.setItem('exerciseReports', JSON.stringify([...existingReports, newReport]));
        
        toast({
          title: "Report Saved",
          description: `Your ${selectedExercise} exercise report has been saved to your dashboard.`
        });
      }
    } catch (error) {
      console.error("Error saving report:", error);
      toast({
        title: "Error Saving Report",
        description: "There was a problem saving your exercise report.",
        variant: "destructive"
      });
    }
  };
  
  // Helper function to convert MM:SS to seconds
  const convertTimeToSeconds = (timeStr: string): number => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return (minutes * 60) + seconds;
  };

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
- **Wednesday**: 30 minutes of brisk walking, 3 sets of 10 Hip Circles (each direction), 2 sets of Arm Circles
- **Friday**: 3 sets of 12 Push-ups, 3 sets of 15 Squats, 3 sets of Wrist Rotate exercises

## Week 3-4: Progression
- **Monday**: 4 sets of 15 Push-ups, 4 sets of 20 Squats, 3 sets of 45-second Planks
- **Wednesday**: 30 minutes of interval training (alternating 3 minutes brisk walk, 1 minute jog), 3 sets of Hip Circles, 3 sets of Arm Circles
- **Friday**: 4 sets of 15 Push-ups, 4 sets of 20 Squats, 4 sets of Wrist Rotate exercises

Start each workout with 5 minutes of mobility exercises (Hip Circles and Arm Circles) to warm up. Rest 60-90 seconds between sets. Focus on proper form over quantity.
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
  
  // Handle starting an exercise from dashboard
  const handleStartExercise = (exerciseName: string) => {
    setActiveTab("exercises");
    analyzeExercise(exerciseName);
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-6">Learn & Exercise with AI</h1>
        
        <Tabs defaultValue="exercises" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="workout">Workout Plan</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="exercises">
            {selectedExercise ? (
              <ExerciseAnalyzer 
                exercise={selectedExercise} 
                onClose={() => setSelectedExercise(null)}
                onSaveReport={handleSaveReport}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SAMPLE_EXERCISES.map((exercise) => (
                  <Card key={exercise.name} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle>{exercise.name}</CardTitle>
                      <CardDescription>
                        <Badge variant="outline" className="mr-1">{exercise.type}</Badge>
                        <Badge variant="outline">{exercise.difficulty}</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">
                        <strong>Target Muscles: </strong>
                        {exercise.muscles.join(", ")}
                      </p>
                      <p className="text-sm mb-2"><strong>Tips:</strong> {exercise.tips}</p>
                    </CardContent>
                    <CardFooter className="bg-muted/50 flex justify-between pt-3">
                      <div className="text-xs text-muted-foreground">
                        {exercise.sets} sets × {exercise.reps} reps
                      </div>
                      <Button size="sm" onClick={() => analyzeExercise(exercise.name)}>
                        Analyze
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="workout">
            <Card>
              <CardHeader>
                <CardTitle>AI Workout Plan Generator</CardTitle>
                <CardDescription>
                  Describe your fitness goals and preferences to generate a personalized workout plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Textarea
                      placeholder="Describe your fitness goals, preferences, and any limitations (e.g., 'I want to build upper body strength, have access to dumbbells only, and can exercise 3 times a week')"
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  {generatedWorkout && (
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: generatedWorkout.replace(/\n/g, '<br>') }} />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="ghost" 
                  onClick={resetWorkout}
                  disabled={!generatedWorkout || isLoading}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button 
                  onClick={generateWorkoutPlan}
                  disabled={isLoading || !userPrompt}
                >
                  {isLoading ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <Dumbbell className="mr-2 h-4 w-4" />
                      Generate Workout Plan
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="dashboard">
            <ExerciseDashboard onStartExercise={handleStartExercise} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default LearnExerciseAI;
