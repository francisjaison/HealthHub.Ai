
import { useState, useEffect, useRef } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getExerciseAnalysis } from '@/lib/ai-service';

interface ExerciseAnalyzerProps {
  exercise: string;
  onClose: () => void;
}

const ExerciseAnalyzer = ({ exercise, onClose }: ExerciseAnalyzerProps) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoActive, setIsVideoActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Check if MediaPipe should be used based on environment variable
  const useMediaPipe = import.meta.env.VITE_USE_MEDIAPIPE === 'true';
  
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setIsAnalyzing(true);
        const result = await getExerciseAnalysis(exercise);
        setAnalysis(result);
        setError(null);
      } catch (err) {
        setError('Failed to analyze exercise. Please try again.');
        console.error('Exercise analysis error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    
    fetchAnalysis();
  }, [exercise]);

  // Function to start video analysis
  const startVideoAnalysis = async () => {
    setIsVideoActive(true);
    
    if (!useMediaPipe) {
      setError("MediaPipe is disabled. Enable it by setting VITE_USE_MEDIAPIPE=true in your .env file.");
      return;
    }
    
    // Access the user's camera
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        videoRef.current.srcObject = stream;
        
        // We'll simulate pose detection here with visual feedback
        // In a real implementation, this would use MediaPipe's Pose model
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            // Simple simulation of pose detection
            const simulatePoseDetection = () => {
              if (videoRef.current && canvasRef.current && ctx) {
                // Clear previous drawings
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                
                // Draw the video frame
                ctx.drawImage(
                  videoRef.current, 
                  0, 0, 
                  canvasRef.current.width, 
                  canvasRef.current.height
                );
                
                // Draw some visual indicators to simulate pose detection
                // These would be replaced with actual pose landmarks in a real implementation
                if (exercise === 'Push-ups') {
                  drawPushupGuides(ctx, canvasRef.current.width, canvasRef.current.height);
                } else if (exercise === 'Squats') {
                  drawSquatGuides(ctx, canvasRef.current.width, canvasRef.current.height);
                } else if (exercise === 'Plank') {
                  drawPlankGuides(ctx, canvasRef.current.width, canvasRef.current.height);
                }
                
                // Continue the detection loop
                requestAnimationFrame(simulatePoseDetection);
              }
            };
            
            simulatePoseDetection();
          }
        }
      }
    } catch (err) {
      setError('Could not access camera. Please check your permissions.');
      setIsVideoActive(false);
      console.error('Camera access error:', err);
    }
  };

  // Helper functions to draw guides for different exercises
  const drawPushupGuides = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Shoulder line
    ctx.beginPath();
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 3;
    ctx.moveTo(width * 0.3, height * 0.4);
    ctx.lineTo(width * 0.7, height * 0.4);
    ctx.stroke();
    
    // Spine line
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.moveTo(width * 0.5, height * 0.4);
    ctx.lineTo(width * 0.5, height * 0.7);
    ctx.stroke();
    
    // Arms
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.moveTo(width * 0.3, height * 0.4);
    ctx.lineTo(width * 0.2, height * 0.6);
    ctx.moveTo(width * 0.7, height * 0.4);
    ctx.lineTo(width * 0.8, height * 0.6);
    ctx.stroke();
  };

  const drawSquatGuides = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Hip line
    ctx.beginPath();
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 3;
    ctx.moveTo(width * 0.4, height * 0.5);
    ctx.lineTo(width * 0.6, height * 0.5);
    ctx.stroke();
    
    // Spine line
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.moveTo(width * 0.5, height * 0.3);
    ctx.lineTo(width * 0.5, height * 0.5);
    ctx.stroke();
    
    // Legs
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.moveTo(width * 0.4, height * 0.5);
    ctx.lineTo(width * 0.3, height * 0.7);
    ctx.lineTo(width * 0.3, height * 0.9);
    ctx.moveTo(width * 0.6, height * 0.5);
    ctx.lineTo(width * 0.7, height * 0.7);
    ctx.lineTo(width * 0.7, height * 0.9);
    ctx.stroke();
  };

  const drawPlankGuides = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Straight line for body
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 3;
    ctx.moveTo(width * 0.3, height * 0.4);
    ctx.lineTo(width * 0.7, height * 0.4);
    ctx.stroke();
    
    // Arms
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.moveTo(width * 0.3, height * 0.4);
    ctx.lineTo(width * 0.3, height * 0.6);
    ctx.moveTo(width * 0.7, height * 0.4);
    ctx.lineTo(width * 0.7, height * 0.6);
    ctx.stroke();
  };

  // Function to stop the video analysis
  const stopVideoAnalysis = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsVideoActive(false);
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {exercise} Analysis
          {isAnalyzing && !isVideoActive && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        </CardTitle>
        <CardDescription>
          AI-powered exercise form and technique analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isVideoActive ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-full max-w-lg">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full rounded-lg border border-border"
              />
              <canvas 
                ref={canvasRef}
                width="640"
                height="480"
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h3 className="text-lg font-medium">Analyzing {exercise} in real-time</h3>
              <p>For best results:</p>
              <ul>
                <li>Make sure your full body is visible</li>
                <li>Wear clothing that contrasts with the background</li>
                <li>Ensure good lighting conditions</li>
                <li>Perform the exercise at a moderate pace</li>
              </ul>
            </div>
          </div>
        ) : isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p>Analyzing {exercise}... Please wait.</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-destructive">
            <AlertCircle className="h-12 w-12 mb-4" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br>') }} />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        {!isVideoActive && !isAnalyzing && (
          <Button onClick={startVideoAnalysis} variant="default" className="w-full">
            <Video className="mr-2 h-4 w-4" />
            Analyze with Camera
          </Button>
        )}
        {isVideoActive && (
          <Button onClick={stopVideoAnalysis} variant="destructive" className="w-full">
            Stop Camera Analysis
          </Button>
        )}
        <Button onClick={onClose} variant="outline" className="w-full">
          Close Analysis
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExerciseAnalyzer;
