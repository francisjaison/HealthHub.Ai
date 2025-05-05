
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dumbbell, 
  Heart, 
  Target, 
  Calendar, 
  Clock, 
  Users, 
  PlayCircle,
  Bookmark,
  Share2,
  Timer,
  ChevronRight,
  Star,
  Award,
  BarChart
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const FitnessTrainer = () => {
  const [activeTab, setActiveTab] = useState("recommended");
  const { toast } = useToast();
  
  const saveWorkout = (name: string) => {
    toast({
      title: "Workout Saved",
      description: `"${name}" has been saved to your library.`
    });
  };
  
  const bookClass = (name: string) => {
    toast({
      title: "Class Booked",
      description: `You've successfully booked the "${name}" class.`
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-forest">Fitness Trainer</h1>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Bookmark className="mr-2 h-4 w-4" />
              Saved
            </Button>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Activity</p>
                  <h4 className="text-2xl font-bold">4/7 days</h4>
                </div>
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '57%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Calories Burned</p>
                  <h4 className="text-2xl font-bold">1,248</h4>
                </div>
                <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                  <BarChart className="h-6 w-6 text-orange-500" />
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
                  <p className="text-sm text-muted-foreground">Workout Minutes</p>
                  <h4 className="text-2xl font-bold">185</h4>
                </div>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <Timer className="h-6 w-6 text-blue-500" />
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
                  <p className="text-sm text-muted-foreground">Heart Health</p>
                  <h4 className="text-2xl font-bold">Good</h4>
                </div>
                <div className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-xs text-muted-foreground">Average HR: 72 BPM</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workout Library */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-forest">Workout Library</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="recommended" onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="beginner">Beginner</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recommended" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Morning Cardio Blast",
                      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500",
                      level: "Beginner",
                      duration: "20 min",
                      category: "Cardio",
                      trainer: "Sarah Fit"
                    },
                    {
                      title: "Full Body Strength",
                      image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=500",
                      level: "Intermediate",
                      duration: "35 min",
                      category: "Strength",
                      trainer: "Mike Power"
                    },
                    {
                      title: "Gentle Yoga Flow",
                      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
                      level: "All Levels",
                      duration: "30 min",
                      category: "Yoga",
                      trainer: "Emma Peace"
                    },
                  ].map((workout, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="relative">
                        <AspectRatio ratio={16/9}>
                          <img
                            src={workout.image}
                            alt={workout.title}
                            className="object-cover w-full h-full"
                          />
                        </AspectRatio>
                        <Button size="sm" className="absolute top-2 right-2" variant="outline" onClick={() => saveWorkout(workout.title)}>
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-1">{workout.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="mr-3">{workout.duration}</span>
                          <Target className="h-4 w-4 mr-1" />
                          <span>{workout.level}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback>{workout.trainer.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{workout.trainer}</span>
                          </div>
                          <Button size="sm">
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-center">
                  <Button variant="outline">
                    View All Workouts
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="trending">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "HIIT Challenge",
                      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=500",
                      level: "Advanced",
                      duration: "25 min",
                      category: "HIIT",
                      trainer: "Alex Strong"
                    },
                    {
                      title: "Dance Cardio Party",
                      image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=500",
                      level: "Beginner",
                      duration: "40 min",
                      category: "Dance",
                      trainer: "Jessica Move"
                    },
                    {
                      title: "Core Crusher",
                      image: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=500",
                      level: "Intermediate",
                      duration: "15 min",
                      category: "Core",
                      trainer: "Tom Abs"
                    },
                  ].map((workout, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="relative">
                        <AspectRatio ratio={16/9}>
                          <img
                            src={workout.image}
                            alt={workout.title}
                            className="object-cover w-full h-full"
                          />
                        </AspectRatio>
                        <Button size="sm" className="absolute top-2 right-2" variant="outline" onClick={() => saveWorkout(workout.title)}>
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-1">{workout.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="mr-3">{workout.duration}</span>
                          <Target className="h-4 w-4 mr-1" />
                          <span>{workout.level}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback>{workout.trainer.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{workout.trainer}</span>
                          </div>
                          <Button size="sm">
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Featured Trainers */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-forest">Featured Trainers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Sarah Johnson",
                  specialty: "Cardio & HIIT",
                  image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=150",
                  rating: 4.9,
                  clients: 278
                },
                {
                  name: "Mike Wilson",
                  specialty: "Strength Training",
                  image: "https://images.unsplash.com/photo-1567013127542-490d757e6aa7?w=150",
                  rating: 4.8,
                  clients: 312
                },
                {
                  name: "Emma Chen",
                  specialty: "Yoga & Pilates",
                  image: "https://images.unsplash.com/photo-1593164842264-854604db2260?w=150",
                  rating: 5.0,
                  clients: 205
                },
                {
                  name: "David Kim",
                  specialty: "Functional Fitness",
                  image: "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?w=150",
                  rating: 4.7,
                  clients: 189
                }
              ].map((trainer, index) => (
                <Card key={index} className="bg-white dark:bg-slate-800">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={trainer.image} alt={trainer.name} />
                        <AvatarFallback>{trainer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-semibold">{trainer.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{trainer.specialty}</p>
                      <div className="flex items-center mb-3">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm ml-1">{trainer.rating} • {trainer.clients} clients</span>
                      </div>
                      <Button size="sm" className="w-full">View Profile</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-forest">Upcoming Live Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Morning Energizer",
                  trainer: "Emma Chen",
                  date: "Tomorrow",
                  time: "7:00 AM",
                  duration: "30 min",
                  attendees: 24,
                  image: "https://images.unsplash.com/photo-1593164842264-854604db2260?w=150",
                },
                {
                  title: "Full Body Strength",
                  trainer: "Mike Wilson",
                  date: "Tomorrow",
                  time: "6:00 PM",
                  duration: "45 min",
                  attendees: 18,
                  image: "https://images.unsplash.com/photo-1567013127542-490d757e6aa7?w=150",
                },
                {
                  title: "Gentle Yoga Flow",
                  trainer: "Sarah Johnson",
                  date: "Apr 29, 2025",
                  time: "7:30 PM",
                  duration: "60 min",
                  attendees: 15,
                  image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=150",
                }
              ].map((liveClass, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-sage-light/10 rounded-lg">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={liveClass.image} alt={liveClass.trainer} />
                      <AvatarFallback>{liveClass.trainer.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{liveClass.title}</h4>
                      <p className="text-sm text-muted-foreground">with {liveClass.trainer}</p>
                      <div className="flex items-center mt-1 text-sm">
                        <Clock className="h-3 w-3 mr-1 text-forest" />
                        <span className="mr-3">{liveClass.duration}</span>
                        <Users className="h-3 w-3 mr-1 text-forest" />
                        <span>{liveClass.attendees} attending</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{liveClass.date}</p>
                    <p className="text-sm text-muted-foreground">{liveClass.time}</p>
                    <Button size="sm" className="mt-2" onClick={() => bookClass(liveClass.title)}>
                      Book Class
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FitnessTrainer;
