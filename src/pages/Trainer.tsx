
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Calendar, User, Clock, Award, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Trainer = () => {
  const { toast } = useToast();
  
  const bookSession = () => {
    toast({
      title: "Session Booked",
      description: "Your training session has been scheduled successfully."
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-forest mb-6">Personal Trainer</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-forest">Meet Your Trainer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="aspect-square rounded-xl bg-sage-light/20 flex items-center justify-center">
                    <User className="h-24 w-24 text-forest/40" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-bold mb-2">Alex Thompson</h2>
                  <p className="text-muted-foreground mb-4">Professional Fitness Trainer, Certified Nutritionist</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-forest mr-2" />
                      <span>10+ Years Experience</span>
                    </div>
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 text-forest mr-2" />
                      <span>Specialized in HIIT</span>
                    </div>
                    <div className="flex items-center">
                      <Dumbbell className="h-5 w-5 text-forest mr-2" />
                      <span>Strength Training</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-forest mr-2" />
                      <span>Flexible Schedule</span>
                    </div>
                  </div>
                  
                  <p className="mb-4">
                    Alex specializes in creating personalized workout plans to help clients achieve their fitness goals, whether it's weight loss, muscle gain, or overall health improvement.
                  </p>
                  
                  <Button onClick={bookSession}>Schedule a Session</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-forest">Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Monday", "Wednesday", "Friday"].map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-sage-light/10 rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-forest mr-2" />
                      <span>{day}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">9 AM - 5 PM</span>
                    </div>
                  </div>
                ))}
                
                {["Tuesday", "Thursday"].map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-sage-light/10 rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-forest mr-2" />
                      <span>{day}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">1 PM - 9 PM</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                <Clock className="mr-2 h-4 w-4" />
                View Full Schedule
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-forest">Training Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Weight Loss Program",
                  description: "A comprehensive program focused on sustainable weight loss through balanced nutrition and targeted exercises.",
                  duration: "12 weeks",
                  intensity: "Moderate"
                },
                {
                  title: "Muscle Building",
                  description: "Designed to increase muscle mass and strength through progressive resistance training and protein-rich nutrition plans.",
                  duration: "16 weeks",
                  intensity: "High"
                },
                {
                  title: "Flexibility & Mobility",
                  description: "Improve your range of motion, posture, and prevent injuries with specialized stretching and mobility exercises.",
                  duration: "8 weeks",
                  intensity: "Low-Moderate"
                }
              ].map((program, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-2">{program.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{program.description}</p>
                    <div className="flex justify-between text-sm mb-4">
                      <span className="text-muted-foreground">Duration: <span className="font-medium text-foreground">{program.duration}</span></span>
                      <span className="text-muted-foreground">Intensity: <span className="font-medium text-foreground">{program.intensity}</span></span>
                    </div>
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Trainer;
