import { useState, useEffect, useRef } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Video, Activity, FileText, RotateCcw, Download, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getExerciseAnalysis } from '@/lib/ai-service';
import { PoseDetector, drawPoseLandmarks, ExerciseMetrics, PoseData, generateExerciseReport } from '@/lib/pose-detection';
import * as tf from '@tensorflow/tfjs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ExerciseAnalyzerProps {
  exercise: string;
  onClose: () => void;
  onSaveReport?: (report: string) => void;
}

const ExerciseAnalyzer = ({ exercise, onClose, onSaveReport }: ExerciseAnalyzerProps) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoActive, setIsVideoActive] = useState<boolean>(false);
  const [isCameraLoading, setIsCameraLoading] = useState<boolean>(false);
  const [cameraTryCount, setCameraTryCount] = useState<number>(0);
  const [showReport, setShowReport] = useState<boolean>(false);
  const [report, setReport] = useState<string>('');
  
  // Metrics state
  const [metrics, setMetrics] = useState<ExerciseMetrics | null>(null);
  
  const MAX_CAMERA_TRIES = 2;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseDetectorRef = useRef<PoseDetector | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // Check if MediaPipe should be used based on environment variable
  const useMediaPipe = import.meta.env.VITE_USE_MEDIAPIPE === 'true';
  
  // Check if the browser supports getUserMedia
  const isCameraSupported = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };
  
  // Check if we're on a mobile device
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };
  
  // At the beginning of the component, add a ref to store UI elements that need cleanup
  const poseDetectionElementsRef = useRef<{debugInfo?: HTMLElement, repCounterDisplay?: HTMLElement} | null>(null);
  
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setIsAnalyzing(true);
        const result = await getExerciseAnalysis(exercise);
        // Check if the result contains an error message about API keys
        if (result.includes("AI service is not configured")) {
          // Update the error message to focus on the camera functionality
          setError("AI service is not available. Camera analysis will still work if enabled.");
          setAnalysis(""); // Clear analysis so the error is shown
        } else {
        setAnalysis(result);
        setError(null);
        }
      } catch (err) {
        // If there's an error fetching analysis, still allow camera functionality
        setError('AI text analysis unavailable. You can still use camera analysis for form guidance.');
        console.error('Exercise analysis error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    
    fetchAnalysis();
  }, [exercise]);
  
  // Initialize TensorFlow.js when component mounts
  useEffect(() => {
    const loadTf = async () => {
      try {
        // Load TensorFlow.js
        await tf.ready();
        console.log("TensorFlow.js initialized successfully");
      } catch (error) {
        console.error("Error initializing TensorFlow.js:", error);
        setError("Failed to initialize TensorFlow.js. Analysis features may not work properly.");
      }
    };
    
    loadTf();
  }, []);
  
  // Initialize pose detector
  const initializePoseDetector = async () => {
    try {
      // Create pose detector if it doesn't exist
      if (!poseDetectorRef.current) {
        console.log("Creating new pose detector for", exercise);
        poseDetectorRef.current = new PoseDetector(exercise);
      }
      
      // Initialize the detector
      const initSuccess = await poseDetectorRef.current.initialize();
      
      if (!initSuccess) {
        throw new Error("Failed to initialize pose detector");
      }
      
      console.log("Pose detector initialized");
      return true;
    } catch (error) {
      console.error("Error initializing pose detector:", error);
      setError("Could not initialize pose detection. Using basic camera mode instead.");
      return false;
    }
  };
  
  // Helper function to stop video stream
  const stopVideoStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      try {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        
        console.log(`Stopping ${tracks.length} camera tracks`);
        tracks.forEach(track => {
          track.stop();
          console.log(`Track ${track.id} stopped`);
        });
        
        // Clear the source
        videoRef.current.srcObject = null;
        videoRef.current.load(); // Reset the video element
      } catch (err) {
        console.error("Error stopping camera:", err);
      }
    }
  };
  
  // Function to ensure canvas size matches video
  const updateCanvasSize = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    // Match the display size to maintain aspect ratio
    canvas.style.width = `${video.clientWidth}px`;
    canvas.style.height = `${video.clientHeight}px`;
    
    console.log(`Updated canvas size to ${canvas.width}x${canvas.height}`);
  };
  
  // Detection loop for pose tracking
  const startPoseDetection = async () => {
    if (!videoRef.current || !canvasRef.current || !poseDetectorRef.current) {
      console.error("Missing required references for pose detection");
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error("Could not get canvas context");
      return;
    }
    
    // Use a local variable to track detection state throughout this function execution
    // This avoids relying on React state which might not have updated yet
    let localIsDetectionActive = true;
    
    // Update canvas size
    updateCanvasSize();
    console.log("Canvas size set to", canvas.width, "x", canvas.height);
    
    // Add visual debug indicator
    const debugInfo = document.createElement('div');
    debugInfo.style.position = 'absolute';
    debugInfo.style.top = '10px';
    debugInfo.style.left = '10px';
    debugInfo.style.color = 'lime';
    debugInfo.style.backgroundColor = 'rgba(0,0,0,0.5)';
    debugInfo.style.padding = '5px';
    debugInfo.style.fontSize = '12px';
    debugInfo.style.zIndex = '100';
    debugInfo.innerHTML = 'Pose detection active';
    canvas.parentElement?.appendChild(debugInfo);
    
    // Add status indicator for rep counting
    const repCounterDisplay = document.createElement('div');
    repCounterDisplay.style.position = 'absolute';
    repCounterDisplay.style.bottom = '10px';
    repCounterDisplay.style.left = '10px';
    repCounterDisplay.style.color = 'white';
    repCounterDisplay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    repCounterDisplay.style.padding = '8px 12px';
    repCounterDisplay.style.borderRadius = '4px';
    repCounterDisplay.style.fontSize = '18px';
    repCounterDisplay.style.fontWeight = 'bold';
    repCounterDisplay.style.zIndex = '100';
    repCounterDisplay.innerHTML = 'Reps: 0';
    canvas.parentElement?.appendChild(repCounterDisplay);
    
    // Store references to these elements for cleanup in the component's main useEffect
    const elementsToCleanup = { debugInfo, repCounterDisplay };
    poseDetectionElementsRef.current = elementsToCleanup;
    
    // Define frame counter to avoid processing every frame
    let frameCount = 0;
    
    const detectPose = async () => {
      // Detailed check to identify which component is missing, but don't use isVideoActive React state
      // as it might not be in sync with the actual video element state
      if (!video.paused && !video.ended && video.readyState >= 2) {
        // Video is actually playing, proceed
      } else if (!video) {
        console.error("Detection stopped: Video element is null");
        localIsDetectionActive = false;
      } else if (!canvas) {
        console.error("Detection stopped: Canvas element is null");
        localIsDetectionActive = false;
      } else if (!ctx) {
        console.error("Detection stopped: Canvas context is null");
        localIsDetectionActive = false;
      } else if (!poseDetectorRef.current) {
        console.error("Detection stopped: Pose detector is null");
        localIsDetectionActive = false;
      }
      
      if (!localIsDetectionActive) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
        console.log("Stopping pose detection loop due to missing components");
        if (debugInfo && debugInfo.parentElement) {
          debugInfo.parentElement.removeChild(debugInfo);
        }
        if (repCounterDisplay && repCounterDisplay.parentElement) {
          repCounterDisplay.parentElement.removeChild(repCounterDisplay);
        }
        return;
      }
      
      try {
        // Always draw video frame to canvas as background
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Process pose detection only every Nth frame for better performance
        frameCount++;
        if (frameCount % 3 === 0) { // Process every 3rd frame
          // Update debug info
          debugInfo.innerHTML = `Detection active | ${new Date().toLocaleTimeString()} | ${canvas.width}x${canvas.height}`;
          
          // Detect pose
          const pose = await poseDetectorRef.current.detectPose(video);
          
          if (pose && pose.keypoints && pose.keypoints.length > 0) {
            debugInfo.innerHTML += ` | Keypoints: ${pose.keypoints.length}`;
            
            // Draw pose landmarks
            drawPoseLandmarks(ctx, pose, exercise);
            
            // Calculate and update metrics
            const updatedMetrics = poseDetectorRef.current.calculateMetrics(pose);
            
            // Update rep counter display
            if (exercise !== 'Plank') {
              repCounterDisplay.innerHTML = `Reps: ${updatedMetrics.repCount}`;
              if (updatedMetrics.repState === 'down') {
                repCounterDisplay.style.color = 'yellow';
              } else {
                repCounterDisplay.style.color = 'white';
              }
            } else {
              // For plank, show duration instead
              repCounterDisplay.innerHTML = `Duration: ${Math.floor(updatedMetrics.duration / 60)}:${(updatedMetrics.duration % 60).toString().padStart(2, '0')}`;
            }
            
            // Only update metrics if detection is still active to avoid React state updates on unmounted components
            setMetrics(updatedMetrics);
          } else {
            // Draw guide text on canvas when no pose is detected
            debugInfo.innerHTML += ' | No pose detected';
            ctx.font = '20px Arial';
            ctx.fillStyle = 'red';
            ctx.textAlign = 'center';
            ctx.fillText('No pose detected - make sure your full body is visible', canvas.width/2, 30);
          }
        }
      } catch (error) {
        console.error('Error in pose detection loop:', error);
        debugInfo.innerHTML += ` | Error: ${error.message}`;
      }
      
      // Continue the loop only if detection is still active and component state is good
      if (localIsDetectionActive && !video.paused && video.readyState >= 2) {
        animationRef.current = requestAnimationFrame(detectPose);
      } else {
        // Log the reason for stopping
        if (video.paused) console.log("Video is paused - stopping detection");
        if (video.readyState < 2) console.log("Video not ready - stopping detection");
        
        localIsDetectionActive = false;
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      }
    };
    
    // Start the detection loop
    console.log("Starting pose detection loop");
    animationRef.current = requestAnimationFrame(detectPose);
  };

  // Function to start video analysis
  const startVideoAnalysis = async () => {
    setIsVideoActive(true);
    setIsCameraLoading(true);
    setError(null); // Clear any existing errors
    setShowReport(false);
    
    try {
      // Basic browser support check
      if (!isCameraSupported()) {
        throw new Error("Your browser doesn't support camera access. Try using Chrome, Firefox, or Safari.");
      }
      
      if (!videoRef.current) {
        throw new Error("Video element not found. Please try again.");
      }
      
      console.log("Requesting camera access");
      
      // Try with best quality first, then fall back to lower quality if needed
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        console.log("Got high-quality camera stream");
      } catch (err) {
        console.log("Could not get high-quality stream, trying standard quality", err);
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        });
        console.log("Got standard-quality camera stream");
      }
      
      if (!videoRef.current) return;
      
      // Stop any existing stream first
      if (videoRef.current.srcObject) {
        const oldStream = videoRef.current.srcObject as MediaStream;
        oldStream.getTracks().forEach(track => track.stop());
      }
      
      console.log("Setting video source");
        videoRef.current.srcObject = stream;
      
      // Explicitly set video properties for reliability
      videoRef.current.controls = false;
      videoRef.current.autoplay = true;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      
      // Create a promise that resolves when the video can play
      const canPlayPromise = new Promise<void>((resolve) => {
        if (!videoRef.current) return;
        
        // Check if video is already ready
        if (videoRef.current.readyState >= 2) {
          console.log("Video already ready, readyState:", videoRef.current.readyState);
          resolve();
          return;
        }
        
        // Setup event listeners
        const handleCanPlay = () => {
          console.log("Video can play now");
          cleanup();
          resolve();
        };
        
        const handleError = (e: Event) => {
          console.error("Video load error:", e);
          cleanup();
          setError("Error loading video stream. Please try again.");
          setIsCameraLoading(false);
          setIsVideoActive(false);
        };
        
        // Add the event listeners
        videoRef.current.addEventListener('canplay', handleCanPlay);
        videoRef.current.addEventListener('error', handleError);
        
        // Cleanup function to remove event listeners
        function cleanup() {
          if (videoRef.current) {
            videoRef.current.removeEventListener('canplay', handleCanPlay);
            videoRef.current.removeEventListener('error', handleError);
          }
        }
        
        // Safety timeout to prevent infinite waiting
        setTimeout(() => {
          if (videoRef.current && videoRef.current.readyState < 2) {
            console.warn("Video not ready after timeout, proceeding anyway");
            cleanup();
            resolve();
          }
        }, 5000);
      });
      
      // Wait for video to be ready
      await canPlayPromise;
      
      // Now ensure video is playing
      try {
        console.log("Attempting to play video");
        await videoRef.current.play();
        console.log("Video playing successfully");
        
        // Wait a short amount of time to ensure video is actually playing
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Double check video is still playing
        if (videoRef.current.paused || videoRef.current.ended) {
          console.error("Video paused or ended after play() call");
          throw new Error("Video playback interrupted");
        }
        
        // Now we can start pose detection with confidence
        setIsCameraLoading(false);
        
        console.log("Initializing pose detector");
        const detectorInitialized = await initializePoseDetector();
        
        if (detectorInitialized) {
          console.log("Starting pose detection");
          startPoseDetection();
          
          // Initialize metrics with default values so UI shows immediately
          setMetrics({
            repCount: 0,
            repQuality: 0,
            formScore: 0,
            calories: 0,
            duration: 0,
            lastRepTimestamp: Date.now(),
            avgRepDuration: 0,
            mistakes: [],
            repState: 'up'
          });
        } else {
          console.log("Falling back to basic guides");
          startDrawingOnCanvas();
        }
      } catch (err) {
        console.error("Video playback error:", err);
        setError("Error playing video stream. Please ensure your camera permissions are enabled and no other app is using your camera.");
        setIsCameraLoading(false);
        setIsVideoActive(false);
        stopVideoStream();
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Could not access camera: " + (err.message || "Unknown error") + 
               ". Please ensure camera permissions are granted in your browser settings.");
      setIsCameraLoading(false);
      setIsVideoActive(false);
      setCameraTryCount(prev => prev + 1);
    }
  };
  
  // Function to start drawing on canvas (fallback without MediaPipe)
  const startDrawingOnCanvas = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
          const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    console.log("Starting basic canvas drawing (without pose detection)");
    
    // Add visual indicator that we're in fallback mode
    const fallbackIndicator = document.createElement('div');
    fallbackIndicator.style.position = 'absolute';
    fallbackIndicator.style.top = '10px';
    fallbackIndicator.style.left = '10px';
    fallbackIndicator.style.color = 'yellow';
    fallbackIndicator.style.backgroundColor = 'rgba(0,0,0,0.5)';
    fallbackIndicator.style.padding = '5px';
    fallbackIndicator.style.fontSize = '12px';
    fallbackIndicator.style.zIndex = '100';
    fallbackIndicator.innerHTML = 'Basic mode - pose detection unavailable';
    canvasRef.current.parentElement?.appendChild(fallbackIndicator);
    
    // Animation function
    const drawFrame = () => {
      if (!isVideoActive || !videoRef.current || !canvasRef.current || !ctx) {
        console.log("Drawing stopped - components unavailable");
        if (fallbackIndicator.parentElement) {
          fallbackIndicator.parentElement.removeChild(fallbackIndicator);
        }
        return;
      }
      
      // Only draw if video is actually playing
      if (videoRef.current.readyState >= 2) {
        // Clear canvas
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                
        // Update canvas dimensions if needed
        if (canvasRef.current.width !== videoRef.current.videoWidth || 
            canvasRef.current.height !== videoRef.current.videoHeight) {
          canvasRef.current.width = videoRef.current.videoWidth || 640;
          canvasRef.current.height = videoRef.current.videoHeight || 480;
        }
        
        // Draw video frame
        try {
                ctx.drawImage(
                  videoRef.current, 
                  0, 0, 
                  canvasRef.current.width, 
                  canvasRef.current.height
                );
                
          // Add status message
          ctx.font = '16px Arial';
          ctx.fillStyle = 'yellow';
          ctx.textAlign = 'center';
          ctx.fillText('Advanced pose detection unavailable - using basic mode', 
            canvasRef.current.width/2, 30);
          
          // Draw exercise guides
                if (exercise === 'Push-ups') {
                  drawPushupGuides(ctx, canvasRef.current.width, canvasRef.current.height);
                } else if (exercise === 'Squats') {
                  drawSquatGuides(ctx, canvasRef.current.width, canvasRef.current.height);
                } else if (exercise === 'Plank') {
                  drawPlankGuides(ctx, canvasRef.current.width, canvasRef.current.height);
          } else if (exercise === 'Hip Circles') {
            drawHipCirclesGuides(ctx, canvasRef.current.width, canvasRef.current.height);
          } else if (exercise === 'Wrist Rotate') {
            drawWristRotateGuides(ctx, canvasRef.current.width, canvasRef.current.height);
          } else if (exercise === 'Arm Circles') {
            drawArmCirclesGuides(ctx, canvasRef.current.width, canvasRef.current.height);
          }
          
          fallbackIndicator.innerHTML = `Basic mode | ${new Date().toLocaleTimeString()} | Video: ${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`;
        } catch (err) {
          console.error("Error drawing on canvas:", err);
          fallbackIndicator.innerHTML += ` | Error: ${err.message}`;
        }
      } else {
        fallbackIndicator.innerHTML = `Basic mode | Video not ready: ${videoRef.current.readyState}`;
      }
      
      // Continue loop if video is still active
      if (isVideoActive) {
        requestAnimationFrame(drawFrame);
      } else if (fallbackIndicator.parentElement) {
        fallbackIndicator.parentElement.removeChild(fallbackIndicator);
      }
    };
    
    // Start the animation loop
    requestAnimationFrame(drawFrame);
  };
  
  // Function to stop the video analysis and clean up resources
  const stopVideoAnalysis = () => {
    console.log("Stopping video analysis");
    
    // Cancel animation frame if it exists
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    stopVideoStream();
    
    // Clear any canvas context
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    
    // Update state
      setIsVideoActive(false);
    setIsCameraLoading(false);
    setError(null);
  };
  
  // Generate a report from the metrics data
  const generateReport = () => {
    if (!metrics) return;
    
    // Generate report content
    const reportContent = generateExerciseReport(metrics, exercise);
    setReport(reportContent);
    setShowReport(true);
    
    // Save report if callback is provided
    if (onSaveReport) {
      onSaveReport(reportContent);
    }
  };
  
  // Add or update the main cleanup useEffect to handle the pose detection elements
  useEffect(() => {
    return () => {
      // Clean up animation frame
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      // Clean up video resources
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      // Clean up pose detection UI elements
      if (poseDetectionElementsRef.current) {
        const { debugInfo, repCounterDisplay } = poseDetectionElementsRef.current;
        if (debugInfo && debugInfo.parentElement) {
          debugInfo.parentElement.removeChild(debugInfo);
        }
        if (repCounterDisplay && repCounterDisplay.parentElement) {
          repCounterDisplay.parentElement.removeChild(repCounterDisplay);
        }
      }
    };
  }, []);

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

  // New guide functions for the added exercises
  const drawHipCirclesGuides = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Shoulder line
    ctx.beginPath();
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 3;
    ctx.moveTo(width * 0.4, height * 0.3);
    ctx.lineTo(width * 0.6, height * 0.3);
    ctx.stroke();
    
    // Torso
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.moveTo(width * 0.5, height * 0.3);
    ctx.lineTo(width * 0.5, height * 0.5);
    ctx.stroke();
    
    // Hip circle guide
    ctx.beginPath();
    ctx.strokeStyle = 'magenta';
    ctx.setLineDash([5, 5]);
    ctx.arc(width * 0.5, height * 0.5, height * 0.1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Add directional arrow
    ctx.beginPath();
    ctx.strokeStyle = 'cyan';
    ctx.moveTo(width * 0.45, height * 0.45);
    ctx.lineTo(width * 0.5, height * 0.4);
    ctx.lineTo(width * 0.55, height * 0.45);
    ctx.stroke();
    
    // Add instruction text
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Move hips in a circular motion', width * 0.5, height * 0.65);
  };

  const drawWristRotateGuides = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Arms position
    ctx.beginPath();
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 3;
    
    // Left arm
    ctx.moveTo(width * 0.3, height * 0.4);
    ctx.lineTo(width * 0.4, height * 0.4);
    
    // Right arm
    ctx.moveTo(width * 0.6, height * 0.4);
    ctx.lineTo(width * 0.7, height * 0.4);
    ctx.stroke();
    
    // Rotation guides for wrists
    ctx.beginPath();
    ctx.strokeStyle = 'cyan';
    ctx.setLineDash([3, 3]);
    
    // Left wrist rotation
    ctx.arc(width * 0.4, height * 0.4, width * 0.05, 0, Math.PI * 2);
    
    // Right wrist rotation
    ctx.arc(width * 0.6, height * 0.4, width * 0.05, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Add arrows indicating rotation
    ctx.beginPath();
    ctx.strokeStyle = 'magenta';
    
    // Left rotation arrow
    ctx.moveTo(width * 0.43, height * 0.37);
    ctx.lineTo(width * 0.4, height * 0.35);
    ctx.lineTo(width * 0.37, height * 0.37);
    
    // Right rotation arrow
    ctx.moveTo(width * 0.57, height * 0.37);
    ctx.lineTo(width * 0.6, height * 0.35);
    ctx.lineTo(width * 0.63, height * 0.37);
    ctx.stroke();
    
    // Add instruction text
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Rotate wrists in circular motions', width * 0.5, height * 0.55);
  };

  const drawArmCirclesGuides = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Shoulder points
    ctx.beginPath();
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 3;
    ctx.arc(width * 0.4, height * 0.3, 5, 0, Math.PI * 2); // Left shoulder
    ctx.arc(width * 0.6, height * 0.3, 5, 0, Math.PI * 2); // Right shoulder
    ctx.fill();
    
    // Circular motion paths
    ctx.beginPath();
    ctx.strokeStyle = 'cyan';
    ctx.setLineDash([5, 5]);
    
    // Left arm circle path
    ctx.arc(width * 0.4, height * 0.3, height * 0.2, 0, Math.PI * 2);
    
    // Right arm circle path
    ctx.arc(width * 0.6, height * 0.3, height * 0.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Arms in motion (simplified representation)
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    
    // Left arm in one position
    ctx.moveTo(width * 0.4, height * 0.3);
    ctx.lineTo(width * 0.3, height * 0.45);
    
    // Right arm in different position
    ctx.moveTo(width * 0.6, height * 0.3);
    ctx.lineTo(width * 0.7, height * 0.2);
    ctx.stroke();
    
    // Add directional arrows
    ctx.beginPath();
    ctx.strokeStyle = 'magenta';
    
    // Left circle direction
    ctx.moveTo(width * 0.33, height * 0.2);
    ctx.lineTo(width * 0.35, height * 0.15);
    ctx.lineTo(width * 0.38, height * 0.18);
    
    // Right circle direction
    ctx.moveTo(width * 0.67, height * 0.2);
    ctx.lineTo(width * 0.65, height * 0.15);
    ctx.lineTo(width * 0.62, height * 0.18);
    ctx.stroke();
    
    // Add instruction text
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Move arms in large circular motions', width * 0.5, height * 0.6);
  };
  
  // Helper to download report
  const downloadReport = () => {
    if (!report) return;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exercise.toLowerCase()}-report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Add resize event listener for canvas
  useEffect(() => {
    const handleResize = () => {
      if (isVideoActive) {
        updateCanvasSize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isVideoActive]);
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{exercise} Analysis</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          {/* Video container with improved positioning */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video 
                ref={videoRef} 
              className="absolute top-0 left-0 w-full h-full object-contain"
                playsInline 
                muted 
              />
              <canvas 
                ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full object-contain z-10 pointer-events-none"
            />
            
            {isCameraLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                <div className="flex flex-col items-center">
                  <div className="animate-spin h-8 w-8 rounded-full border-t-2 border-primary mb-2"></div>
                  <p className="text-white">Starting camera...</p>
                </div>
              </div>
            )}
            
            {!isVideoActive && !isCameraLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <Button 
                  size="lg" 
                  onClick={startVideoAnalysis} 
                  className="gap-2"
                >
                  <Camera className="h-5 w-5" />
                  Start Camera
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Metrics panel - always display this when video is active */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isVideoActive ? (
                metrics ? (
                  <div className="space-y-4">
                    {exercise !== 'Plank' && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Repetitions</span>
                          <span className="font-semibold">{metrics.repCount}</span>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Form Quality</span>
                        <span className="font-semibold">{metrics.formScore}%</span>
                      </div>
                      <Progress value={metrics.formScore} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Duration</span>
                        <span className="font-semibold">
                          {Math.floor(metrics.duration / 60)}:{(metrics.duration % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Calories</span>
                        <span className="font-semibold">{metrics.calories} kcal</span>
                      </div>
                    </div>
                    
                    {metrics.mistakes.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Form Tips:</p>
                        <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                          {metrics.mistakes.map((mistake, idx) => (
                            <li key={idx}>{mistake}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => generateReport()}>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                        if (poseDetectorRef.current) {
                          poseDetectorRef.current.resetMetrics();
                          setMetrics(poseDetectorRef.current.getMetrics());
                        }
                      }}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-center text-sm animate-pulse">Loading metrics...</p>
                    <div className="flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      Please stand in front of the camera so your full body is visible
                    </p>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center p-4">
                  <p className="text-sm text-muted-foreground">
                    Start camera to view exercise metrics
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
            </div>
      
      {/* Rest of the component */}
      {showReport ? (
        // Report view
            <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Exercise Report</h3>
            <Button variant="outline" size="sm" onClick={downloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          <div className="bg-secondary/20 p-4 rounded-md">
            <div dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br>') }} />
          </div>
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowReport(false)}
            >
              Back to Analysis
            </Button>
          </div>
        </div>
      ) : isVideoActive ? (
        <div className="prose prose-sm dark:prose-invert max-w-none mt-4">
              <h3 className="text-lg font-medium">Analyzing {exercise} in real-time</h3>
          <p>Follow these steps for best results:</p>
          <ul>
            <li>Position yourself so your full body is visible</li>
            <li>Ensure you have adequate lighting</li>
            <li>Wear clothing that contrasts with your background</li>
                <li>Perform the exercise at a moderate pace</li>
              </ul>
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={generateReport}
              disabled={metrics?.repCount === 0}
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button 
              variant="destructive" 
              onClick={stopVideoAnalysis}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Stop Camera
            </Button>
          </div>
          </div>
        ) : isAnalyzing ? (
        <div className="flex flex-col items-center py-6">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p>Loading exercise guidance...</p>
          </div>
        ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div>
              <h4 className="font-semibold">Camera Error</h4>
              <p className="text-sm">{error}</p>
              {cameraTryCount < 2 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={startVideoAnalysis} 
                  className="mt-2"
                >
                  Try Again
                </Button>
              )}
            </div>
          </div>
          </div>
        ) : (
        <div className="py-4">
          <div className="flex flex-col items-center px-4 space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Ready to analyze your {exercise}</h3>
              <p className="text-sm text-muted-foreground">
                Our AI will analyze your form in real-time and provide feedback.
              </p>
            </div>
            <Button 
              onClick={startVideoAnalysis} 
              size="lg"
              className="flex items-center gap-2"
            >
              <Camera className="h-5 w-5" />
              Start Camera Analysis
            </Button>
          </div>
          </div>
        )}
      
      {exercise && analysis && !isVideoActive && !showReport && (
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">AI Exercise Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm" dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br>') }}></div>
      </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExerciseAnalyzer;
