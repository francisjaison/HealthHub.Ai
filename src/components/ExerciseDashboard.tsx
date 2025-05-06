import { useState, useEffect } from 'react';
import { Calendar, Clock, BarChart2, Activity, FileText, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ExerciseReport {
  id: string;
  exercise: string;
  date: string;
  duration: number; // in seconds
  repCount: number;
  formScore: number;
  calories: number;
}

interface ExerciseDashboardProps {
  onStartExercise?: (exerciseName: string) => void;
}

const ExerciseDashboard = ({ onStartExercise }: ExerciseDashboardProps) => {
  const [reports, setReports] = useState<ExerciseReport[]>([]);
  const [totalExerciseTime, setTotalExerciseTime] = useState<number>(0);
  const [averageFormScore, setAverageFormScore] = useState<number>(0);
  const [totalCalories, setTotalCalories] = useState<number>(0);
  
  // Sample data - in a real app, this would come from a database
  useEffect(() => {
    // Simulate loading reports from storage
    const loadReports = () => {
      const storedReports = localStorage.getItem('exerciseReports');
      if (storedReports) {
        return JSON.parse(storedReports) as ExerciseReport[];
      }
      
      // Return sample data if no stored reports
      return [
        {
          id: '1',
          exercise: 'Push-ups',
          date: new Date(Date.now() - 86400000).toISOString(),
          duration: 180,
          repCount: 15,
          formScore: 85,
          calories: 25
        },
        {
          id: '2',
          exercise: 'Squats',
          date: new Date(Date.now() - 172800000).toISOString(),
          duration: 240,
          repCount: 20,
          formScore: 78,
          calories: 35
        },
        {
          id: '3',
          exercise: 'Plank',
          date: new Date(Date.now() - 259200000).toISOString(),
          duration: 120,
          repCount: 0,
          formScore: 92,
          calories: 15
        }
      ];
    };
    
    const reports = loadReports();
    setReports(reports);
    
    // Calculate dashboard metrics
    if (reports.length > 0) {
      // Total exercise time
      const totalTime = reports.reduce((total, report) => total + report.duration, 0);
      setTotalExerciseTime(totalTime);
      
      // Average form score
      const avgScore = reports.reduce((total, report) => total + report.formScore, 0) / reports.length;
      setAverageFormScore(Math.round(avgScore));
      
      // Total calories
      const totalCals = reports.reduce((total, report) => total + report.calories, 0);
      setTotalCalories(totalCals);
    }
  }, []);
  
  // Function to add a new report
  const addReport = (report: Omit<ExerciseReport, 'id' | 'date'>) => {
    const newReport: ExerciseReport = {
      ...report,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    const updatedReports = [...reports, newReport];
    setReports(updatedReports);
    
    // Update localStorage
    localStorage.setItem('exerciseReports', JSON.stringify(updatedReports));
    
    // Update dashboard metrics
    setTotalExerciseTime(prev => prev + report.duration);
    setAverageFormScore(Math.round(
      reports.reduce((total, r) => total + r.formScore, report.formScore) / (reports.length + 1)
    ));
    setTotalCalories(prev => prev + report.calories);
  };
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format date to a readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Exercise Dashboard</h2>
      
      {/* Summary metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Exercise Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(totalExerciseTime / 60)} min
            </div>
            <p className="text-xs text-muted-foreground">
              Across {reports.length} sessions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Form Score
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageFormScore}%
            </div>
            <Progress value={averageFormScore} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Calories Burned
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCalories} kcal
            </div>
            <p className="text-xs text-muted-foreground">
              Keep it up for better results!
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Exercise quickstart */}
      <div className="my-6">
        <h3 className="text-lg font-medium mb-4">Quick Start Exercise</h3>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => onStartExercise && onStartExercise('Push-ups')}
          >
            <Activity className="h-4 w-4" />
            Push-ups
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => onStartExercise && onStartExercise('Squats')}
          >
            <Activity className="h-4 w-4" />
            Squats
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => onStartExercise && onStartExercise('Plank')}
          >
            <Activity className="h-4 w-4" />
            Plank
          </Button>
        </div>
      </div>
      
      {/* Exercise history */}
      <div>
        <h3 className="text-lg font-medium mb-4">Exercise History</h3>
        
        {reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{report.exercise}</CardTitle>
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {formatDate(report.date)}
                    </span>
                  </div>
                  <CardDescription>
                    {report.exercise === 'Plank' 
                      ? `Held for ${formatTime(report.duration)}`
                      : `Completed ${report.repCount} reps`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">{formatTime(report.duration)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Form Score</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{report.formScore}%</p>
                        <Progress value={report.formScore} className="h-2 w-16" />
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Calories</p>
                      <p className="font-medium">{report.calories} kcal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No exercise history yet. Start your first exercise!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExerciseDashboard; 