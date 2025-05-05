
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dumbbell, 
  Heart, 
  Calendar, 
  Clock, 
  PlayCircle,
  BarChart,
  ChevronRight,
  Activity,
  Target,
  Check,
  MoveHorizontal,
  ArrowRight
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const GymTraining = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("today");
  
  const markComplete = (exercise: string) => {
    toast({
      title: "Exercise Completed",
      description: `"${exercise}" marked as completed!`
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-forest">Gym Training</h1>
          <div className="flex space-x-2">
            <Button>
              <PlayCircle className="mr-2 h-4 w-4" />
              Start Workout
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Workouts</p>
                  <h4 className="text-2xl font-bold">3/5</h4>
                </div>
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Weight</p>
                  <h4 className="text-2xl font-bold">12,450 lbs</h4>
                </div>
                <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-green-500 text-xs font-medium">↑ 8%</span>
                <span className="text-xs text-muted-foreground ml-1">from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Workout Time</p>
                  <h4 className="text-2xl font-bold">3.5 hours</h4>
                </div>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-green-500 text-xs font-medium">↑ 12%</span>
                <span className="text-xs text-muted-foreground ml-1">from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Training Streak</p>
                  <h4 className="text-2xl font-bold">14 days</h4>
                </div>
                <div className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-red-500" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-xs text-muted-foreground">Keep it up!</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Training Plan */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-forest">Current Training Plan</CardTitle>
                <p className="text-sm text-muted-foreground">Strength Building - Intermediate</p>
              </div>
              <div className="flex items-center mt-2 md:mt-0">
                <div className="mr-4">
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="font-medium">Week 4 of 12</p>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-forest h-2 rounded-full" style={{ width: '33%' }}></div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="today" onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="thisWeek">This Week</TabsTrigger>
                <TabsTrigger value="overview">Plan Overview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="today" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Day 24: Chest & Triceps</h3>
                  <Button size="sm">
                    Start Workout
                    <PlayCircle className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {[
                    {
                      name: "Barbell Bench Press",
                      sets: 4,
                      reps: "8-10",
                      rest: "90 sec",
                      weight: "135 lbs",
                      completed: false
                    },
                    {
                      name: "Incline Dumbbell Press",
                      sets: 3,
                      reps: "10-12",
                      rest: "60 sec",
                      weight: "45 lbs",
                      completed: false
                    },
                    {
                      name: "Cable Flyes",
                      sets: 3,
                      reps: "12-15",
                      rest: "60 sec",
                      weight: "25 lbs",
                      completed: false
                    },
                    {
                      name: "Tricep Pushdowns",
                      sets: 4,
                      reps: "10-12",
                      rest: "60 sec",
                      weight: "50 lbs",
                      completed: false
                    },
                    {
                      name: "Overhead Tricep Extension",
                      sets: 3,
                      reps: "12-15",
                      rest: "60 sec",
                      weight: "30 lbs",
                      completed: false
                    }
                  ].map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-sage-light/10 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{exercise.name}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <span className="font-medium text-forest mr-1">{exercise.sets}</span> sets
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-forest mr-1">{exercise.reps}</span> reps
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{exercise.rest}</span>
                          </div>
                          <div className="flex items-center">
                            <Dumbbell className="h-3 w-3 mr-1" />
                            <span>{exercise.weight}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant={exercise.completed ? "default" : "outline"} 
                        size="sm"
                        className="ml-4"
                        onClick={() => markComplete(exercise.name)}
                      >
                        {exercise.completed ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Completed
                          </>
                        ) : "Mark Complete"}
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="thisWeek">
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-md font-semibold">Monday - Chest & Triceps</CardTitle>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="text-sm text-muted-foreground">
                        5 exercises • 45-60 min • Strength Focus
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-md font-semibold">Tuesday - Rest Day</CardTitle>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="text-sm text-muted-foreground">
                        Active recovery, stretching, or light cardio
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-md font-semibold">Wednesday - Back & Biceps</CardTitle>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="text-sm text-muted-foreground">
                        6 exercises • 50-65 min • Strength & Hypertrophy
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-md font-semibold">Thursday - Rest Day</CardTitle>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="text-sm text-muted-foreground">
                        Active recovery, stretching, or light cardio
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-md font-semibold">Friday - Legs & Core</CardTitle>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="text-sm text-muted-foreground">
                        7 exercises • 60-75 min • Strength & Endurance
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Exercise Library */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-forest">Exercise Library</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="popular">
              <TabsList className="mb-6">
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="chest">Chest</TabsTrigger>
                <TabsTrigger value="back">Back</TabsTrigger>
                <TabsTrigger value="legs">Legs</TabsTrigger>
                <TabsTrigger value="arms">Arms</TabsTrigger>
              </TabsList>
              
              <TabsContent value="popular" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      name: "Barbell Squat",
                      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500",
                      category: "Legs",
                      muscles: "Quads, Glutes, Hamstrings"
                    },
                    {
                      name: "Bench Press",
                      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
                      category: "Chest",
                      muscles: "Pecs, Triceps, Shoulders"
                    },
                    {
                      name: "Deadlift",
                      image: "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=500",
                      category: "Back",
                      muscles: "Lower Back, Hamstrings, Glutes"
                    },
                    {
                      name: "Pull-up",
                      image: "https://images.unsplash.com/photo-1598971639058-afc1e1d38c79?w=500",
                      category: "Back",
                      muscles: "Lats, Biceps, Forearms"
                    }
                  ].map((exercise, index) => (
                    <Card key={index} className="overflow-hidden">
                      <AspectRatio ratio={4/3}>
                        <img
                          src={exercise.image}
                          alt={exercise.name}
                          className="object-cover w-full h-full"
                        />
                      </AspectRatio>
                      <CardContent className="p-4">
                        <h3 className="text-md font-semibold">{exercise.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Target className="h-4 w-4 mr-1" />
                          <span>{exercise.category}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {exercise.muscles}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-center">
                  <Button variant="outline">
                    View All Exercises
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Progress Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-forest">Progress Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Bench Press Progress</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Chart visualization would go here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Squat Progress</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Chart visualization would go here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Personal Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { exercise: "Bench Press", weight: "185 lbs", date: "Apr 15, 2025" },
                      { exercise: "Squat", weight: "275 lbs", date: "Apr 10, 2025" },
                      { exercise: "Deadlift", weight: "315 lbs", date: "Apr 12, 2025" },
                      { exercise: "Overhead Press", weight: "135 lbs", date: "Apr 18, 2025" }
                    ].map((record, index) => (
                      <Card key={index} className="bg-sage-light/5">
                        <CardContent className="p-4">
                          <h4 className="font-medium">{record.exercise}</h4>
                          <p className="text-xl font-bold text-forest">{record.weight}</p>
                          <p className="text-xs text-muted-foreground">{record.date}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GymTraining;
