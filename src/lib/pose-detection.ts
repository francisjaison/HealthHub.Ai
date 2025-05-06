import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import '@mediapipe/pose';

// Interface for exercise metrics
export interface ExerciseMetrics {
  repCount: number;
  repQuality: number; // 0-100%
  formScore: number; // 0-100%
  calories: number;
  duration: number; // in seconds
  lastRepTimestamp: number;
  avgRepDuration: number;
  mistakes: string[];
  repState: 'up' | 'down'; // Current state in the rep cycle
}

// Interface for pose data
export interface PoseData {
  keypoints: poseDetection.Keypoint[];
  score: number;
}

// Initialize metrics object
export const initializeMetrics = (): ExerciseMetrics => {
  return {
    repCount: 0,
    repQuality: 0,
    formScore: 0,
    calories: 0,
    duration: 0,
    lastRepTimestamp: Date.now(),
    avgRepDuration: 0,
    mistakes: [],
    repState: 'up'
  };
};

// Class to handle pose detection and metrics
export class PoseDetector {
  private detector: poseDetection.PoseDetector | null = null;
  private isInitialized: boolean = false;
  private exerciseType: string = '';
  private metrics: ExerciseMetrics;
  private repState: 'up' | 'down' = 'up';
  private lastPose: PoseData | null = null;
  private startTime: number = 0;
  
  // Add necessary private properties for the new exercises
  private hipCircleData?: {
    lastXDir: number;
    lastYDir: number;
    directionChanges: number;
    lastChangeTime: number;
    positions: {x: number, y: number}[];
    lastAngle: number;
  };

  private wristRotateData?: {
    leftLastDir: number;
    rightLastDir: number;
    leftDirChanges: number;
    rightDirChanges: number;
    lastChangeTime: number;
    leftPositions: {x: number, y: number}[];
    rightPositions: {x: number, y: number}[];
    leftLastAngle: number;
    rightLastAngle: number;
  };

  private armCircleData?: {
    leftXDir: number;
    leftYDir: number;
    rightXDir: number;
    rightYDir: number;
    leftDirChanges: number;
    rightDirChanges: number;
    lastChangeTime: number;
    leftPositions: {x: number, y: number}[];
    rightPositions: {x: number, y: number}[];
    leftLastAngle: number;
    rightLastAngle: number;
  };
  
  constructor(exerciseType: string) {
    this.exerciseType = exerciseType;
    this.metrics = initializeMetrics();
    this.startTime = Date.now();
    console.log(`PoseDetector created for ${exerciseType}`);
  }
  
  // Initialize the detector
  async initialize(): Promise<boolean> {
    try {
      console.log("Starting TensorFlow.js initialization");
      
      // Make sure TensorFlow.js is ready
      await tf.ready();
      console.log("TensorFlow.js initialized successfully");
      
      // Use a more accurate model configuration
      console.log("Creating pose detector with MoveNet model");
      const model = poseDetection.SupportedModels.MoveNet;
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true,
        minPoseScore: 0.25, // Higher minimum pose score for more accurate detection
        multiPoseMaxDimension: 256, // Optimize for single person detection
      };
      
      this.detector = await poseDetection.createDetector(model, detectorConfig);
      this.isInitialized = true;
      console.log("MoveNet pose detector initialized successfully");
      return true;
    } catch (error) {
      console.error('Error initializing pose detector:', error);
      return false;
    }
  }
  
  // Detect pose from a video element
  async detectPose(video: HTMLVideoElement): Promise<PoseData | null> {
    if (!this.isInitialized || !this.detector) {
      console.warn('Detector not initialized');
      return null;
    }
    
    try {
      // Use a more robust estimation configuration
      const poses = await this.detector.estimatePoses(video, {
        flipHorizontal: false,
        maxPoses: 1, // Focus on one person only for better accuracy
      });
      
      if (poses && poses.length > 0) {
        // Apply additional filtering for higher confidence
        const filteredKeypoints = poses[0].keypoints
          .map((kp, index) => {
            if (!kp.name) {
              // Assign standard keypoint names based on index for MoveNet
              const standardNames = [
                'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
                'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
                'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
                'left_knee', 'right_knee', 'left_ankle', 'right_ankle'
              ];
              return { 
                ...kp, 
                name: index < standardNames.length ? standardNames[index] : `keypoint_${index}` 
              };
            }
            return kp;
          });
        
        // Apply keypoint smoothing if we have previous pose data
        const smoothedKeypoints = this.lastPose ? 
          this.smoothKeypoints(filteredKeypoints, this.lastPose.keypoints, 0.3) : 
          filteredKeypoints;
        
        const poseData: PoseData = {
          keypoints: smoothedKeypoints,
          score: poses[0].score || 0
        };
        
        this.lastPose = poseData;
        return poseData;
      }
      
      return null;
    } catch (error) {
      console.error('Error detecting pose:', error);
      return null;
    }
  }
  
  // Smooth keypoints to reduce jitter and improve tracking stability
  private smoothKeypoints(
    currentKeypoints: poseDetection.Keypoint[], 
    previousKeypoints: poseDetection.Keypoint[],
    smoothingFactor: number = 0.3
  ): poseDetection.Keypoint[] {
    // Only smooth if we have the same number of keypoints
    if (currentKeypoints.length !== previousKeypoints.length) {
      return currentKeypoints;
    }
    
    return currentKeypoints.map((keypoint, i) => {
      const prevKeypoint = previousKeypoints[i];
      if (!prevKeypoint || keypoint.score === undefined || prevKeypoint.score === undefined) {
        return keypoint;
      }
      
      // Higher confidence keypoints get less smoothing, lower confidence get more
      const adaptiveSmoothingFactor = 
        keypoint.score > 0.7 ? smoothingFactor * 0.5 : 
        keypoint.score > 0.5 ? smoothingFactor : 
        smoothingFactor * 1.5;
      
      // Only smooth if current score is reasonable
      if (keypoint.score < 0.1) {
        return keypoint;
      }
      
      // Apply exponential smoothing
      return {
        ...keypoint,
        x: prevKeypoint.x * adaptiveSmoothingFactor + keypoint.x * (1 - adaptiveSmoothingFactor),
        y: prevKeypoint.y * adaptiveSmoothingFactor + keypoint.y * (1 - adaptiveSmoothingFactor)
      };
    });
  }
  
  // Helper to find a specific keypoint by name with improved confidence threshold
  private findKeypoint(keypoints: poseDetection.Keypoint[], name: string): poseDetection.Keypoint | null {
    const keypoint = keypoints.find(kp => kp.name === name);
    // Increase minimum confidence threshold for more reliable detection
    if (keypoint && keypoint.score && keypoint.score > 0.4) {
      return keypoint;
    }
    return null;
  }
  
  // Calculate metrics based on pose data
  calculateMetrics(pose: PoseData): ExerciseMetrics {
    // Log keypoints for debugging
    console.log("Processing keypoints for metrics calculation:", 
      pose.keypoints.map(kp => ({ name: kp.name, score: kp.score })));
    
    // Update exercise duration
    this.metrics.duration = Math.floor((Date.now() - this.startTime) / 1000);
    
    // Process specific exercise
    if (this.exerciseType === 'Push-ups') {
      this.processPushupMetrics(pose);
    } else if (this.exerciseType === 'Squats') {
      this.processSquatMetrics(pose);
    } else if (this.exerciseType === 'Plank') {
      this.processPlankMetrics(pose);
    } else if (this.exerciseType === 'Hip Circles') {
      this.processHipCirclesMetrics(pose);
    } else if (this.exerciseType === 'Wrist Rotate') {
      this.processWristRotateMetrics(pose);
    } else if (this.exerciseType === 'Arm Circles') {
      this.processArmCirclesMetrics(pose);
    }
    
    // Calculate calories (very rough estimation)
    // MET values: pushups ~3.8, squats ~5, plank ~3.5, hip circles ~3.0, wrist rotate ~1.5, arm circles ~3.3
    let met = 3.8; // Default to pushup
    if (this.exerciseType === 'Squats') met = 5;
    else if (this.exerciseType === 'Plank') met = 3.5;
    else if (this.exerciseType === 'Hip Circles') met = 3.0;
    else if (this.exerciseType === 'Wrist Rotate') met = 1.5;
    else if (this.exerciseType === 'Arm Circles') met = 3.3;
    
    // Calories = MET * weight(kg) * time(hours)
    // Using 70kg as default weight
    this.metrics.calories = (met * 70 * (this.metrics.duration / 3600)).toFixed(1) as unknown as number;
    
    // Set repState in the metrics object
    this.metrics.repState = this.repState;
    
    return { ...this.metrics };
  }
  
  // Process push-up metrics
  private processPushupMetrics(pose: PoseData): void {
    const keypoints = pose.keypoints;
    
    // Get relevant keypoints for push-ups
    let leftShoulder = this.findKeypoint(keypoints, 'left_shoulder');
    let rightShoulder = this.findKeypoint(keypoints, 'right_shoulder');
    let leftElbow = this.findKeypoint(keypoints, 'left_elbow');
    let rightElbow = this.findKeypoint(keypoints, 'right_elbow');
    let leftWrist = this.findKeypoint(keypoints, 'left_wrist');
    let rightWrist = this.findKeypoint(keypoints, 'right_wrist');
    
    console.log("Push-up keypoints:", { leftShoulder, rightShoulder, leftElbow, rightElbow, leftWrist, rightWrist });
    
    // Fallback to the most relevant keypoints by index if names aren't found
    // MoveNet model provides 17 keypoints in a specific order
    if (!leftShoulder && keypoints.length >= 6) leftShoulder = keypoints[5]; // left_shoulder is index 5
    if (!rightShoulder && keypoints.length >= 7) rightShoulder = keypoints[6]; // right_shoulder is index 6
    if (!leftElbow && keypoints.length >= 8) leftElbow = keypoints[7]; // left_elbow is index 7
    if (!rightElbow && keypoints.length >= 8) rightElbow = keypoints[8]; // right_elbow is index 8
    if (!leftWrist && keypoints.length >= 9) leftWrist = keypoints[9]; // left_wrist is index 9
    if (!rightWrist && keypoints.length >= 10) rightWrist = keypoints[10]; // right_wrist is index 10
    
    console.log("Push-up keypoints after fallback:", { leftShoulder, rightShoulder, leftElbow, rightElbow, leftWrist, rightWrist });
    
    if (!leftShoulder || !rightShoulder || !leftElbow || !rightElbow || !leftWrist || !rightWrist) {
      console.warn("Missing required keypoints for push-up analysis");
      // Still display some metrics even if we can't analyze the pushup properly
      this.metrics.repQuality = 50; // Default quality
      this.metrics.formScore = 50; // Default form score
      return;
    }
    
    try {
      // Calculate elbow angles (simplified)
      const leftElbowAngle = this.calculateAngle(leftShoulder, leftElbow, leftWrist);
      const rightElbowAngle = this.calculateAngle(rightShoulder, rightElbow, rightWrist);
      
      const avgElbowAngle = (leftElbowAngle + rightElbowAngle) / 2;
      console.log("Average elbow angle:", avgElbowAngle, "Left:", leftElbowAngle, "Right:", rightElbowAngle);
      
      // Use elbow angle to detect push-up reps
      // When person goes down, elbows bend (angle gets smaller)
      if (this.repState === 'up' && avgElbowAngle < 130) {
        console.log("Push-up: Transitioning from UP to DOWN state, angle:", avgElbowAngle);
        this.repState = 'down';
      } else if (this.repState === 'down' && avgElbowAngle > 160) {
        // Completed a rep
        console.log("Push-up: Completed rep! Transitioning from DOWN to UP state, angle:", avgElbowAngle);
        this.repState = 'up';
        this.metrics.repCount++;
        
        // Calculate rep duration
        const now = Date.now();
        const repDuration = now - this.metrics.lastRepTimestamp;
        this.metrics.lastRepTimestamp = now;
        
        // Update average rep duration
        if (this.metrics.repCount > 1) {
          this.metrics.avgRepDuration = 
            (this.metrics.avgRepDuration * (this.metrics.repCount - 1) + repDuration) / this.metrics.repCount;
        } else {
          this.metrics.avgRepDuration = repDuration;
        }
        
        // Calculate form score (simplified)
        const formQuality = Math.min(100, 70 + Math.random() * 30); // Replace with actual calculation
        this.metrics.formScore = Math.round((this.metrics.formScore * (this.metrics.repCount - 1) + formQuality) / this.metrics.repCount);
      }
      
      // Check for common mistakes
      this.metrics.mistakes = [];
      
      // Example: Check if elbows are too wide
      const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
      const elbowWidth = Math.abs(leftElbow.x - rightElbow.x);
      
      if (elbowWidth > shoulderWidth * 2) {
        this.metrics.mistakes.push('Elbows too wide');
      }
      
      // Calculate rep quality (simplified)
      this.metrics.repQuality = 100 - (this.metrics.mistakes.length * 15);
      if (this.metrics.repQuality < 0) this.metrics.repQuality = 0;
    } catch (error) {
      console.error("Error in push-up metrics calculation:", error);
      // Set default metrics values to avoid crashing
      this.metrics.repQuality = 50; 
      this.metrics.formScore = 50;
    }
  }
  
  // Process squat metrics
  private processSquatMetrics(pose: PoseData): void {
    const keypoints = pose.keypoints;
    
    // Get relevant keypoints for squats
    let leftHip = this.findKeypoint(keypoints, 'left_hip');
    let rightHip = this.findKeypoint(keypoints, 'right_hip');
    let leftKnee = this.findKeypoint(keypoints, 'left_knee');
    let rightKnee = this.findKeypoint(keypoints, 'right_knee');
    let leftAnkle = this.findKeypoint(keypoints, 'left_ankle');
    let rightAnkle = this.findKeypoint(keypoints, 'right_ankle');
    
    console.log("Squat keypoints:", { leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle });
    
    // Fallback to the most relevant keypoints by index if names aren't found
    // MoveNet model provides 17 keypoints in a specific order
    if (!leftHip && keypoints.length >= 12) leftHip = keypoints[11]; // left_hip is index 11
    if (!rightHip && keypoints.length >= 13) rightHip = keypoints[12]; // right_hip is index 12
    if (!leftKnee && keypoints.length >= 14) leftKnee = keypoints[13]; // left_knee is index 13
    if (!rightKnee && keypoints.length >= 15) rightKnee = keypoints[14]; // right_knee is index 14
    if (!leftAnkle && keypoints.length >= 16) leftAnkle = keypoints[15]; // left_ankle is index 15
    if (!rightAnkle && keypoints.length >= 17) rightAnkle = keypoints[16]; // right_ankle is index 16
    
    console.log("Squat keypoints after fallback:", { leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle });
    
    if (!leftHip || !rightHip || !leftKnee || !rightKnee || !leftAnkle || !rightAnkle) {
      console.warn("Missing required keypoints for squat analysis");
      // Still display some metrics even if we can't analyze properly
      this.metrics.repQuality = 50; // Default quality
      this.metrics.formScore = 50; // Default form score
      return;
    }
    
    try {
      // Calculate knee angles
      const leftKneeAngle = this.calculateAngle(leftHip, leftKnee, leftAnkle);
      const rightKneeAngle = this.calculateAngle(rightHip, rightKnee, rightAnkle);
      
      const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;
      console.log("Average knee angle:", avgKneeAngle, "Left:", leftKneeAngle, "Right:", rightKneeAngle);
      
      // Use knee angle to detect squat reps
      if (this.repState === 'up' && avgKneeAngle < 120) {
        console.log("Squat: Transitioning from UP to DOWN state, angle:", avgKneeAngle);
        this.repState = 'down';
      } else if (this.repState === 'down' && avgKneeAngle > 160) {
        // Completed a rep
        console.log("Squat: Completed rep! Transitioning from DOWN to UP state, angle:", avgKneeAngle);
        this.repState = 'up';
        this.metrics.repCount++;
        
        // Calculate rep duration
        const now = Date.now();
        const repDuration = now - this.metrics.lastRepTimestamp;
        this.metrics.lastRepTimestamp = now;
        
        // Update average rep duration
        if (this.metrics.repCount > 1) {
          this.metrics.avgRepDuration = 
            (this.metrics.avgRepDuration * (this.metrics.repCount - 1) + repDuration) / this.metrics.repCount;
        } else {
          this.metrics.avgRepDuration = repDuration;
        }
        
        // Calculate form score (simplified)
        const formQuality = Math.min(100, 70 + Math.random() * 30); // Replace with actual calculation
        this.metrics.formScore = Math.round((this.metrics.formScore * (this.metrics.repCount - 1) + formQuality) / this.metrics.repCount);
      }
      
      // Check for common mistakes
      this.metrics.mistakes = [];
      
      // Example: Check if knees are going too far forward
      // (Simplified - would need more sophisticated calculation in real implementation)
      if (leftKnee.x < leftAnkle.x - 50 || rightKnee.x < rightAnkle.x - 50) {
        this.metrics.mistakes.push('Knees too far forward');
      }
      
      // Calculate rep quality
      this.metrics.repQuality = 100 - (this.metrics.mistakes.length * 15);
      if (this.metrics.repQuality < 0) this.metrics.repQuality = 0;
    } catch (error) {
      console.error("Error in squat metrics calculation:", error);
      // Set default metrics values to avoid crashing
      this.metrics.repQuality = 50; 
      this.metrics.formScore = 50;
    }
  }
  
  // Process plank metrics
  private processPlankMetrics(pose: PoseData): void {
    // For plank, we don't count reps, but we measure hold time and form
    this.metrics.repCount = 0; // Plank doesn't have reps
    
    const keypoints = pose.keypoints;
    
    // Get relevant keypoints for plank
    let leftShoulder = this.findKeypoint(keypoints, 'left_shoulder');
    let rightShoulder = this.findKeypoint(keypoints, 'right_shoulder');
    let leftHip = this.findKeypoint(keypoints, 'left_hip');
    let rightHip = this.findKeypoint(keypoints, 'right_hip');
    let leftAnkle = this.findKeypoint(keypoints, 'left_ankle');
    let rightAnkle = this.findKeypoint(keypoints, 'right_ankle');
    
    console.log("Plank keypoints:", { leftShoulder, rightShoulder, leftHip, rightHip, leftAnkle, rightAnkle });
    
    // Fallback to the most relevant keypoints by index if names aren't found
    if (!leftShoulder && keypoints.length >= 6) leftShoulder = keypoints[5]; // left_shoulder is index 5
    if (!rightShoulder && keypoints.length >= 7) rightShoulder = keypoints[6]; // right_shoulder is index 6
    if (!leftHip && keypoints.length >= 12) leftHip = keypoints[11]; // left_hip is index 11
    if (!rightHip && keypoints.length >= 13) rightHip = keypoints[12]; // right_hip is index 12
    if (!leftAnkle && keypoints.length >= 16) leftAnkle = keypoints[15]; // left_ankle is index 15
    if (!rightAnkle && keypoints.length >= 17) rightAnkle = keypoints[16]; // right_ankle is index 16
    
    console.log("Plank keypoints after fallback:", { leftShoulder, rightShoulder, leftHip, rightHip, leftAnkle, rightAnkle });
    
    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !leftAnkle || !rightAnkle) {
      console.warn("Missing required keypoints for plank analysis");
      // Still display some metrics even if we can't analyze properly
      this.metrics.repQuality = 50; // Default quality
      this.metrics.formScore = 50; // Default form score
      return;
    }
    
    try {
      // Check for common mistakes
      this.metrics.mistakes = [];
      
      // Calculate alignment - shoulders, hips, and ankles should be roughly in a straight line
      // This is a simplified check
      const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
      const hipY = (leftHip.y + rightHip.y) / 2;
      const ankleY = (leftAnkle.y + rightAnkle.y) / 2;
      
      const verticalAlignment = Math.abs((shoulderY - hipY) / (hipY - ankleY) - 1);
      console.log("Plank vertical alignment:", verticalAlignment);
      
      if (verticalAlignment > 0.3) {
        this.metrics.mistakes.push('Body not aligned properly');
      }
      
      // Simplified form score for plank
      const formScore = Math.min(100, Math.max(0, 85 - verticalAlignment * 100));
      this.metrics.formScore = Math.round(formScore);
      
      // For plank, rep quality is the same as form score
      this.metrics.repQuality = this.metrics.formScore;
    } catch (error) {
      console.error("Error in plank metrics calculation:", error);
      // Set default metrics values to avoid crashing
      this.metrics.repQuality = 50; 
      this.metrics.formScore = 50;
    }
  }
  
  // Process hip circles metrics with improved tracking
  private processHipCirclesMetrics(pose: PoseData): void {
    const keypoints = pose.keypoints;
    
    // Get relevant keypoints for hip circles
    let leftHip = this.findKeypoint(keypoints, 'left_hip');
    let rightHip = this.findKeypoint(keypoints, 'right_hip');
    let leftShoulder = this.findKeypoint(keypoints, 'left_shoulder');
    let rightShoulder = this.findKeypoint(keypoints, 'right_shoulder');
    
    // Fallback to indices if names aren't found
    if (!leftHip && keypoints.length >= 12) leftHip = keypoints[11]; // left_hip index
    if (!rightHip && keypoints.length >= 13) rightHip = keypoints[12]; // right_hip index
    if (!leftShoulder && keypoints.length >= 6) leftShoulder = keypoints[5]; // left_shoulder index
    if (!rightShoulder && keypoints.length >= 7) rightShoulder = keypoints[6]; // right_shoulder index
    
    if (!leftHip || !rightHip || !leftShoulder || !rightShoulder) {
      console.warn("Missing required keypoints for hip circles analysis");
      this.metrics.repQuality = 50; // Default quality
      this.metrics.formScore = 50; // Default form score
      return;
    }
    
    try {
      // Calculate hip position relative to shoulders (normalized)
      const shoulderMidpoint = {
        x: (leftShoulder.x + rightShoulder.x) / 2,
        y: (leftShoulder.y + rightShoulder.y) / 2,
      };
      
      const hipMidpoint = {
        x: (leftHip.x + rightHip.x) / 2,
        y: (leftHip.y + rightHip.y) / 2,
      };
      
      // Get previous hip position with better error handling
      const prevHipMidpoint = this.lastPose ? {
        x: (this.findKeypoint(this.lastPose.keypoints, 'left_hip')?.x || leftHip.x + 
           this.findKeypoint(this.lastPose.keypoints, 'right_hip')?.x || rightHip.x) / 2,
        y: (this.findKeypoint(this.lastPose.keypoints, 'left_hip')?.y || leftHip.y + 
           this.findKeypoint(this.lastPose.keypoints, 'right_hip')?.y || rightHip.y) / 2,
      } : hipMidpoint;
      
      // Calculate movement vectors
      const xDiff = hipMidpoint.x - prevHipMidpoint.x;
      const yDiff = hipMidpoint.y - prevHipMidpoint.y;
      
      // Initialize tracking data with improved angular tracking
      if (!this.hipCircleData) {
        this.hipCircleData = {
          lastXDir: Math.sign(xDiff),
          lastYDir: Math.sign(yDiff),
          directionChanges: 0,
          lastChangeTime: Date.now(),
          positions: [], // Track recent positions for better circle detection
          lastAngle: Math.atan2(yDiff, xDiff)
        };
      } else {
        // Add current position to tracking array with limited size
        this.hipCircleData.positions.push({x: hipMidpoint.x, y: hipMidpoint.y});
        if (this.hipCircleData.positions.length > 15) {
          this.hipCircleData.positions.shift(); // Remove oldest position
        }
        
        const currentXDir = Math.sign(xDiff);
        const currentYDir = Math.sign(yDiff);
        const currentAngle = Math.atan2(yDiff, xDiff);
        
        // Calculate angle change for more accurate rotation detection
        let angleDiff = currentAngle - this.hipCircleData.lastAngle;
        // Normalize angle difference to [-π, π]
        if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
        
        // Update the direction changes count using both directional and angular data
        if ((currentXDir !== 0 && currentXDir !== this.hipCircleData.lastXDir) ||
            (currentYDir !== 0 && currentYDir !== this.hipCircleData.lastYDir) ||
            (Math.abs(angleDiff) > Math.PI / 4)) { // Direction change if angle changes by more than 45°
          this.hipCircleData.directionChanges++;
          this.hipCircleData.lastXDir = currentXDir;
          this.hipCircleData.lastYDir = currentYDir;
          this.hipCircleData.lastAngle = currentAngle;
        }
        
        // Check if we have a complete circle using multiple detection methods
        if (this.hipCircleData.directionChanges >= 4 || this.detectCircularPattern(this.hipCircleData.positions)) {
          const now = Date.now();
          // Only count as a rep if enough time has passed (avoid rapid oscillations)
          if (now - this.hipCircleData.lastChangeTime > 1000) {
            this.metrics.repCount++;
            this.hipCircleData.lastChangeTime = now;
            
            // Calculate rep duration
            const repDuration = now - this.metrics.lastRepTimestamp;
            this.metrics.lastRepTimestamp = now;
            
            // Update average rep duration
            if (this.metrics.repCount > 1) {
              this.metrics.avgRepDuration = 
                (this.metrics.avgRepDuration * (this.metrics.repCount - 1) + repDuration) / this.metrics.repCount;
            } else {
              this.metrics.avgRepDuration = repDuration;
            }
          }
          
          this.hipCircleData.directionChanges = 0;
          this.hipCircleData.positions = []; // Reset positions after detecting a circle
        }
      }
      
      // Improved checks for common mistakes
      this.metrics.mistakes = [];
      
      // Check if hip movement is too small using the tracked positions
      const hipMovement = this.calculateMovementRange(this.hipCircleData.positions);
      if (hipMovement < 0.02) { // Increased threshold for more accuracy
        this.metrics.mistakes.push('Hip movement too small - make wider circles');
      }
      
      // More accurate check for torso alignment
      const verticalAlignment = Math.abs(shoulderMidpoint.x - hipMidpoint.x);
      if (verticalAlignment > 0.1) { // Threshold for alignment
        this.metrics.mistakes.push('Keep torso upright during hip circles');
      }
      
      // Additional check for smooth movement
      if (this.hipCircleData.positions.length > 5) {
        const smoothness = this.calculateMovementSmoothness(this.hipCircleData.positions);
        if (smoothness < 0.7) {
          this.metrics.mistakes.push('Try to make smoother, more controlled circles');
        }
      }
      
      // Calculate form quality with weighted components
      const movementScore = Math.min(100, hipMovement * 2000);
      const alignmentScore = Math.max(0, 100 - verticalAlignment * 500);
      const smoothnessScore = this.hipCircleData.positions.length > 5 ? 
        this.calculateMovementSmoothness(this.hipCircleData.positions) * 100 : 80;
      
      // Weighted average of different quality factors
      this.metrics.formScore = Math.round(
        (movementScore * 0.4) + (alignmentScore * 0.3) + (smoothnessScore * 0.3)
      );
      this.metrics.repQuality = this.metrics.formScore;
      
      // Ensure reasonable values
      if (this.metrics.repQuality < 0) this.metrics.repQuality = 0;
      if (this.metrics.repQuality > 100) this.metrics.repQuality = 100;
      
    } catch (error) {
      console.error("Error in hip circles metrics calculation:", error);
      this.metrics.repQuality = 50;
      this.metrics.formScore = 50;
    }
  }
  
  // Detect whether a series of points forms a circular pattern
  private detectCircularPattern(points: {x: number, y: number}[]): boolean {
    if (points.length < 8) return false; // Need enough points for reliable detection
    
    // Calculate center of points
    const center = points.reduce(
      (acc, pt) => ({x: acc.x + pt.x / points.length, y: acc.y + pt.y / points.length}), 
      {x: 0, y: 0}
    );
    
    // Calculate average distance from center (radius)
    const avgRadius = points.reduce(
      (sum, pt) => sum + Math.sqrt(Math.pow(pt.x - center.x, 2) + Math.pow(pt.y - center.y, 2)), 
      0
    ) / points.length;
    
    // Calculate variance in radius (should be low for circles)
    const radiusVariance = points.reduce(
      (sum, pt) => {
        const r = Math.sqrt(Math.pow(pt.x - center.x, 2) + Math.pow(pt.y - center.y, 2));
        return sum + Math.pow(r - avgRadius, 2);
      }, 
      0
    ) / points.length;
    
    // Calculate angle coverage to ensure we have points around the circle
    let angles = points.map(pt => 
      Math.atan2(pt.y - center.y, pt.x - center.x)
    );
    
    // Sort angles and compute the maximum gap
    angles.sort();
    let maxGap = 0;
    for (let i = 0; i < angles.length; i++) {
      const nextIndex = (i + 1) % angles.length;
      const gap = i < angles.length - 1 ? 
        angles[nextIndex] - angles[i] : 
        (angles[0] + 2 * Math.PI) - angles[i];
      maxGap = Math.max(maxGap, gap);
    }
    
    // For a good circle:
    // 1. Radius variance should be low relative to average radius
    // 2. Max angle gap should be small (points distributed around circle)
    const isCircular = 
      (radiusVariance / (avgRadius * avgRadius) < 0.2) && // Low radius variance
      (maxGap < Math.PI); // No large gaps in the circle
    
    return isCircular;
  }
  
  // Calculate range of movement from a set of points
  private calculateMovementRange(points: {x: number, y: number}[]): number {
    if (points.length < 2) return 0;
    
    let minX = points[0].x, maxX = points[0].x;
    let minY = points[0].y, maxY = points[0].y;
    
    for (const pt of points) {
      minX = Math.min(minX, pt.x);
      maxX = Math.max(maxX, pt.x);
      minY = Math.min(minY, pt.y);
      maxY = Math.max(maxY, pt.y);
    }
    
    // Return average of X and Y ranges
    return ((maxX - minX) + (maxY - minY)) / 2;
  }
  
  // Calculate smoothness of movement (0-1, higher is smoother)
  private calculateMovementSmoothness(points: {x: number, y: number}[]): number {
    if (points.length < 4) return 1;
    
    let totalAngularChange = 0;
    
    for (let i = 1; i < points.length - 1; i++) {
      // Calculate vectors between consecutive points
      const v1 = {
        x: points[i].x - points[i-1].x,
        y: points[i].y - points[i-1].y
      };
      
      const v2 = {
        x: points[i+1].x - points[i].x,
        y: points[i+1].y - points[i].y
      };
      
      // Calculate magnitudes of vectors
      const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
      const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
      
      // Skip if movement is too small to measure accurately
      if (mag1 < 0.001 || mag2 < 0.001) continue;
      
      // Calculate dot product and angle between vectors
      const dotProduct = v1.x * v2.x + v1.y * v2.y;
      const cosAngle = dotProduct / (mag1 * mag2);
      
      // Clamp to valid cosine range due to floating point errors
      const clampedCosAngle = Math.max(-1, Math.min(1, cosAngle));
      const angle = Math.acos(clampedCosAngle);
      
      totalAngularChange += angle;
    }
    
    // For a perfect circle, total angular change would be small
    // Normalize to 0-1 range with higher values meaning smoother
    const avgChange = totalAngularChange / (points.length - 2);
    return Math.max(0, 1 - (avgChange / Math.PI));
  }
  
  // Process wrist rotation metrics
  private processWristRotateMetrics(pose: PoseData): void {
    const keypoints = pose.keypoints;
    
    // Get relevant keypoints for wrist rotation
    let leftWrist = this.findKeypoint(keypoints, 'left_wrist');
    let rightWrist = this.findKeypoint(keypoints, 'right_wrist');
    let leftElbow = this.findKeypoint(keypoints, 'left_elbow');
    let rightElbow = this.findKeypoint(keypoints, 'right_elbow');
    
    // Fallback to indices if names aren't found
    if (!leftWrist && keypoints.length >= 10) leftWrist = keypoints[9]; // left_wrist index
    if (!rightWrist && keypoints.length >= 11) rightWrist = keypoints[10]; // right_wrist index
    if (!leftElbow && keypoints.length >= 8) leftElbow = keypoints[7]; // left_elbow index
    if (!rightElbow && keypoints.length >= 9) rightElbow = keypoints[8]; // right_elbow index
    
    if (!leftWrist || !rightWrist || !leftElbow || !rightElbow) {
      console.warn("Missing required keypoints for wrist rotation analysis");
      this.metrics.repQuality = 50;
      this.metrics.formScore = 50;
      return;
    }
    
    try {
      // Track wrist movement pattern to detect rotations
      // For wrist rotations, we'll track the position of the wrist relative to the elbow
      
      // Store previous positions with better error handling
      const prevLeftWristPos = this.lastPose ? 
        this.findKeypoint(this.lastPose.keypoints, 'left_wrist') || { x: leftWrist.x, y: leftWrist.y } 
        : { x: leftWrist.x, y: leftWrist.y };
      
      const prevRightWristPos = this.lastPose ? 
        this.findKeypoint(this.lastPose.keypoints, 'right_wrist') || { x: rightWrist.x, y: rightWrist.y } 
        : { x: rightWrist.x, y: rightWrist.y };
      
      // Calculate movement vectors (3D would be better but we work with what we have in 2D)
      const leftWristXDiff = leftWrist.x - prevLeftWristPos.x;
      const leftWristYDiff = leftWrist.y - prevLeftWristPos.y;
      const rightWristXDiff = rightWrist.x - prevRightWristPos.x;
      const rightWristYDiff = rightWrist.y - prevRightWristPos.y;
      
      // Calculate relative position to elbow for better rotation detection
      const leftWristRelX = leftWrist.x - leftElbow.x;
      const leftWristRelY = leftWrist.y - leftElbow.y;
      const rightWristRelX = rightWrist.x - rightElbow.x;
      const rightWristRelY = rightWrist.y - rightElbow.y;
      
      // Calculate angles for more accurate rotation detection
      const leftWristAngle = Math.atan2(leftWristRelY, leftWristRelX);
      const rightWristAngle = Math.atan2(rightWristRelY, rightWristRelX);
      
      // Initialize with extended tracking data
      if (!this.wristRotateData) {
        this.wristRotateData = {
          leftLastDir: Math.sign(leftWristXDiff),
          rightLastDir: Math.sign(rightWristXDiff),
          leftDirChanges: 0,
          rightDirChanges: 0,
          lastChangeTime: Date.now(),
          leftPositions: [{x: leftWrist.x, y: leftWrist.y}],
          rightPositions: [{x: rightWrist.x, y: rightWrist.y}],
          leftLastAngle: leftWristAngle,
          rightLastAngle: rightWristAngle
        };
      } else {
        // Add current positions to tracking arrays with limited size
        this.wristRotateData.leftPositions.push({x: leftWrist.x, y: leftWrist.y});
        this.wristRotateData.rightPositions.push({x: rightWrist.x, y: rightWrist.y});
        
        if (this.wristRotateData.leftPositions.length > 10) {
          this.wristRotateData.leftPositions.shift();
        }
        if (this.wristRotateData.rightPositions.length > 10) {
          this.wristRotateData.rightPositions.shift();
        }
        
        // Calculate angle changes for better rotation detection
        let leftAngleDiff = leftWristAngle - this.wristRotateData.leftLastAngle;
        let rightAngleDiff = rightWristAngle - this.wristRotateData.rightLastAngle;
        
        // Normalize angle differences to [-π, π]
        if (leftAngleDiff > Math.PI) leftAngleDiff -= 2 * Math.PI;
        if (leftAngleDiff < -Math.PI) leftAngleDiff += 2 * Math.PI;
        if (rightAngleDiff > Math.PI) rightAngleDiff -= 2 * Math.PI;
        if (rightAngleDiff < -Math.PI) rightAngleDiff += 2 * Math.PI;
        
        // Detect direction changes with multiple methods
        const leftCurrentDir = Math.sign(leftWristXDiff);
        const rightCurrentDir = Math.sign(rightWristXDiff);
        
        // Track direction changes with improved sensitivity
        if ((leftCurrentDir !== 0 && leftCurrentDir !== this.wristRotateData.leftLastDir) ||
            Math.abs(leftAngleDiff) > Math.PI / 6) { // 30 degrees threshold
          this.wristRotateData.leftDirChanges++;
          this.wristRotateData.leftLastDir = leftCurrentDir;
          this.wristRotateData.leftLastAngle = leftWristAngle;
        }
        
        if ((rightCurrentDir !== 0 && rightCurrentDir !== this.wristRotateData.rightLastDir) ||
            Math.abs(rightAngleDiff) > Math.PI / 6) {
          this.wristRotateData.rightDirChanges++;
          this.wristRotateData.rightLastDir = rightCurrentDir;
          this.wristRotateData.rightLastAngle = rightWristAngle;
        }
        
        // Detect rotation by combining directional changes and pattern analysis
        const leftCircular = this.detectCircularPattern(this.wristRotateData.leftPositions);
        const rightCircular = this.detectCircularPattern(this.wristRotateData.rightPositions);
        const totalChanges = this.wristRotateData.leftDirChanges + this.wristRotateData.rightDirChanges;
        
        // Detect rotation completion using multiple criteria
        if ((this.wristRotateData.leftDirChanges >= 2 && this.wristRotateData.rightDirChanges >= 2) || 
            (leftCircular && rightCircular) || 
            totalChanges >= 6) {
          const now = Date.now();
          // Only count as a rep if enough time has passed (prevent overcounting)
          if (now - this.wristRotateData.lastChangeTime > 500) {
            this.metrics.repCount++;
            this.wristRotateData.lastChangeTime = now;
            
            // Calculate rep duration
            const repDuration = now - this.metrics.lastRepTimestamp;
            this.metrics.lastRepTimestamp = now;
            
            // Update average rep duration
            if (this.metrics.repCount > 1) {
              this.metrics.avgRepDuration = 
                (this.metrics.avgRepDuration * (this.metrics.repCount - 1) + repDuration) / this.metrics.repCount;
            } else {
              this.metrics.avgRepDuration = repDuration;
            }
            
            // Reset counters for next rep
            this.wristRotateData.leftDirChanges = 0;
            this.wristRotateData.rightDirChanges = 0;
          }
        }
      }
      
      // Enhanced checks for common mistakes
      this.metrics.mistakes = [];
      
      // Check if elbows are moving too much (should be relatively stable)
      const leftElbowMovement = this.lastPose ? 
        Math.abs(leftElbow.x - (this.findKeypoint(this.lastPose.keypoints, 'left_elbow')?.x || leftElbow.x)) : 0;
      
      const rightElbowMovement = this.lastPose ? 
        Math.abs(rightElbow.x - (this.findKeypoint(this.lastPose.keypoints, 'right_elbow')?.x || rightElbow.x)) : 0;
      
      if (leftElbowMovement > 0.05 || rightElbowMovement > 0.05) {
        this.metrics.mistakes.push('Keep elbows steady during wrist rotations');
      }
      
      // Calculate quality based on symmetry between wrists
      const symmetryDiff = Math.abs(this.wristRotateData?.leftDirChanges - this.wristRotateData?.rightDirChanges);
      if (symmetryDiff > 1) {
        this.metrics.mistakes.push('Try to rotate both wrists at the same rate');
      }
      
      // Check for sufficient range of motion
      const leftWristMovement = this.calculateMovementRange(this.wristRotateData.leftPositions);
      const rightWristMovement = this.calculateMovementRange(this.wristRotateData.rightPositions);
      
      if (leftWristMovement < 0.02 || rightWristMovement < 0.02) {
        this.metrics.mistakes.push('Increase your wrist rotation range');
      }
      
      // Calculate smoothness
      let leftSmoothness = 1;
      let rightSmoothness = 1;
      
      if (this.wristRotateData.leftPositions.length > 4) {
        leftSmoothness = this.calculateMovementSmoothness(this.wristRotateData.leftPositions);
      }
      
      if (this.wristRotateData.rightPositions.length > 4) {
        rightSmoothness = this.calculateMovementSmoothness(this.wristRotateData.rightPositions);
      }
      
      const avgSmoothness = (leftSmoothness + rightSmoothness) / 2;
      if (avgSmoothness < 0.6) {
        this.metrics.mistakes.push('Try to make smoother, more controlled rotations');
      }
      
      // Calculate form quality with weighted components
      const movementScore = Math.min(100, (leftWristMovement + rightWristMovement) * 1000);
      const symmetryScore = 100 - Math.min(100, symmetryDiff * 20);
      const stabilityScore = 100 - Math.min(100, (leftElbowMovement + rightElbowMovement) * 500);
      const smoothnessScore = avgSmoothness * 100;
      
      // Weighted average for quality score
      this.metrics.formScore = Math.round(
        (movementScore * 0.3) + (symmetryScore * 0.3) + (stabilityScore * 0.2) + (smoothnessScore * 0.2)
      );
      this.metrics.repQuality = this.metrics.formScore;
      
      // Ensure reasonable values
      if (this.metrics.repQuality < 0) this.metrics.repQuality = 0;
      if (this.metrics.repQuality > 100) this.metrics.repQuality = 100;
      
    } catch (error) {
      console.error("Error in wrist rotation metrics calculation:", error);
      this.metrics.repQuality = 50;
      this.metrics.formScore = 50;
    }
  }
  
  // Process arm circles metrics with improved tracking
  private processArmCirclesMetrics(pose: PoseData): void {
    const keypoints = pose.keypoints;
    
    // Get relevant keypoints for arm circles
    let leftShoulder = this.findKeypoint(keypoints, 'left_shoulder');
    let rightShoulder = this.findKeypoint(keypoints, 'right_shoulder');
    let leftElbow = this.findKeypoint(keypoints, 'left_elbow');
    let rightElbow = this.findKeypoint(keypoints, 'right_elbow');
    let leftWrist = this.findKeypoint(keypoints, 'left_wrist');
    let rightWrist = this.findKeypoint(keypoints, 'right_wrist');
    
    // Fallback to indices if names aren't found
    if (!leftShoulder && keypoints.length >= 6) leftShoulder = keypoints[5];
    if (!rightShoulder && keypoints.length >= 7) rightShoulder = keypoints[6];
    if (!leftElbow && keypoints.length >= 8) leftElbow = keypoints[7];
    if (!rightElbow && keypoints.length >= 9) rightElbow = keypoints[8];
    if (!leftWrist && keypoints.length >= 10) leftWrist = keypoints[9];
    if (!rightWrist && keypoints.length >= 11) rightWrist = keypoints[10];
    
    if (!leftShoulder || !rightShoulder || !leftElbow || !rightElbow || !leftWrist || !rightWrist) {
      console.warn("Missing required keypoints for arm circles analysis");
      this.metrics.repQuality = 50;
      this.metrics.formScore = 50;
      return;
    }
    
    try {
      // Get previous wrist positions with better error handling
      const prevLeftWristPos = this.lastPose ? 
        this.findKeypoint(this.lastPose.keypoints, 'left_wrist') || { x: leftWrist.x, y: leftWrist.y } 
        : { x: leftWrist.x, y: leftWrist.y };
      
      const prevRightWristPos = this.lastPose ? 
        this.findKeypoint(this.lastPose.keypoints, 'right_wrist') || { x: rightWrist.x, y: rightWrist.y } 
        : { x: rightWrist.x, y: rightWrist.y };
      
      // Calculate x and y changes
      const leftWristXDiff = leftWrist.x - prevLeftWristPos.x;
      const leftWristYDiff = leftWrist.y - prevLeftWristPos.y;
      const rightWristXDiff = rightWrist.x - prevRightWristPos.x;
      const rightWristYDiff = rightWrist.y - prevRightWristPos.y;
      
      // Calculate wrist positions relative to shoulders for better circle detection
      const leftWristRelX = leftWrist.x - leftShoulder.x;
      const leftWristRelY = leftWrist.y - leftShoulder.y;
      const rightWristRelX = rightWrist.x - rightShoulder.x;
      const rightWristRelY = rightWrist.y - rightShoulder.y;
      
      // Get angles from shoulder to wrist for rotation detection
      const leftWristAngle = Math.atan2(leftWristRelY, leftWristRelX);
      const rightWristAngle = Math.atan2(rightWristRelY, rightWristRelX);
      
      // Initialize with extended tracking data
      if (!this.armCircleData) {
        this.armCircleData = {
          leftXDir: Math.sign(leftWristXDiff),
          leftYDir: Math.sign(leftWristYDiff),
          rightXDir: Math.sign(rightWristXDiff),
          rightYDir: Math.sign(rightWristYDiff),
          leftDirChanges: 0,
          rightDirChanges: 0,
          lastChangeTime: Date.now(),
          leftPositions: [{x: leftWristRelX, y: leftWristRelY}], // Store relative to shoulder
          rightPositions: [{x: rightWristRelX, y: rightWristRelY}],
          leftLastAngle: leftWristAngle,
          rightLastAngle: rightWristAngle
        };
      } else {
        // Add current positions to tracking arrays (relative to shoulder position)
        this.armCircleData.leftPositions.push({x: leftWristRelX, y: leftWristRelY});
        this.armCircleData.rightPositions.push({x: rightWristRelX, y: rightWristRelY});
        
        if (this.armCircleData.leftPositions.length > 15) {
          this.armCircleData.leftPositions.shift();
        }
        if (this.armCircleData.rightPositions.length > 15) {
          this.armCircleData.rightPositions.shift();
        }
        
        // Calculate angle changes for improved rotation detection
        let leftAngleDiff = leftWristAngle - this.armCircleData.leftLastAngle;
        let rightAngleDiff = rightWristAngle - this.armCircleData.rightLastAngle;
        
        // Normalize angle differences to [-π, π]
        if (leftAngleDiff > Math.PI) leftAngleDiff -= 2 * Math.PI;
        if (leftAngleDiff < -Math.PI) leftAngleDiff += 2 * Math.PI;
        if (rightAngleDiff > Math.PI) rightAngleDiff -= 2 * Math.PI;
        if (rightAngleDiff < -Math.PI) rightAngleDiff += 2 * Math.PI;
        
        // Track direction changes with improved sensitivity
        const currentLeftXDir = Math.sign(leftWristXDiff);
        const currentLeftYDir = Math.sign(leftWristYDiff);
        const currentRightXDir = Math.sign(rightWristXDiff);
        const currentRightYDir = Math.sign(rightWristYDiff);
        
        // Track direction changes for left arm with angle-based improvements
        if ((currentLeftXDir !== 0 && currentLeftXDir !== this.armCircleData.leftXDir) ||
            (currentLeftYDir !== 0 && currentLeftYDir !== this.armCircleData.leftYDir) ||
            Math.abs(leftAngleDiff) > Math.PI / 6) { // 30 degrees threshold
          this.armCircleData.leftDirChanges++;
          this.armCircleData.leftXDir = currentLeftXDir;
          this.armCircleData.leftYDir = currentLeftYDir;
          this.armCircleData.leftLastAngle = leftWristAngle;
        }
        
        // Track direction changes for right arm
        if ((currentRightXDir !== 0 && currentRightXDir !== this.armCircleData.rightXDir) ||
            (currentRightYDir !== 0 && currentRightYDir !== this.armCircleData.rightYDir) ||
            Math.abs(rightAngleDiff) > Math.PI / 6) {
          this.armCircleData.rightDirChanges++;
          this.armCircleData.rightXDir = currentRightXDir;
          this.armCircleData.rightYDir = currentRightYDir;
          this.armCircleData.rightLastAngle = rightWristAngle;
        }
        
        // Detect circle completion using multiple methods
        const leftCircular = this.detectCircularPattern(this.armCircleData.leftPositions);
        const rightCircular = this.detectCircularPattern(this.armCircleData.rightPositions);
        
        // More accurate detection of completed arm circles
        if ((this.armCircleData.leftDirChanges >= 4 && this.armCircleData.rightDirChanges >= 4) || 
            (leftCircular && rightCircular)) {
          const now = Date.now();
          // Only count as a rep if enough time has passed
          if (now - this.armCircleData.lastChangeTime > 1000) {
            this.metrics.repCount++;
            this.armCircleData.lastChangeTime = now;
            
            // Calculate rep duration
            const repDuration = now - this.metrics.lastRepTimestamp;
            this.metrics.lastRepTimestamp = now;
            
            // Update average rep duration
            if (this.metrics.repCount > 1) {
              this.metrics.avgRepDuration = 
                (this.metrics.avgRepDuration * (this.metrics.repCount - 1) + repDuration) / this.metrics.repCount;
            } else {
              this.metrics.avgRepDuration = repDuration;
            }
          }
          
          // Reset counters after counting a rep
          this.armCircleData.leftDirChanges = 0;
          this.armCircleData.rightDirChanges = 0;
        }
      }
      
      // Enhanced checks for common mistakes
      this.metrics.mistakes = [];
      
      // Check arm extension - arms should be relatively straight
      const leftArmAngle = this.calculateAngle(leftShoulder, leftElbow, leftWrist);
      const rightArmAngle = this.calculateAngle(rightShoulder, rightElbow, rightWrist);
      
      if (leftArmAngle < 150 || rightArmAngle < 150) {
        this.metrics.mistakes.push('Keep arms straighter during arm circles');
      }
      
      // Check if circles are too small
      const leftWristDistance = Math.sqrt(leftWristRelX * leftWristRelX + leftWristRelY * leftWristRelY);
      const rightWristDistance = Math.sqrt(rightWristRelX * rightWristRelX + rightWristRelY * rightWristRelY);
      
      // Arm should be extended during circles
      const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
      const minArmExtension = shoulderWidth * 0.6; // Arms should be extended to at least 60% of shoulder width
      
      if (leftWristDistance < minArmExtension || rightWristDistance < minArmExtension) {
        this.metrics.mistakes.push('Extend your arms fully during circles');
      }
      
      // Check for circle size using movement range
      const leftCircleSize = this.calculateMovementRange(this.armCircleData.leftPositions);
      const rightCircleSize = this.calculateMovementRange(this.armCircleData.rightPositions);
      
      if (leftCircleSize < 0.1 || rightCircleSize < 0.1) {
        this.metrics.mistakes.push('Make larger arm circles');
      }
      
      // Check for matching circles (symmetry)
      const sizeDifference = Math.abs(leftCircleSize - rightCircleSize);
      if (sizeDifference > 0.05) {
        this.metrics.mistakes.push('Try to make equally sized circles with both arms');
      }
      
      // Check for smooth movement
      let leftSmoothness = 1;
      let rightSmoothness = 1;
      
      if (this.armCircleData.leftPositions.length > 5) {
        leftSmoothness = this.calculateMovementSmoothness(this.armCircleData.leftPositions);
      }
      
      if (this.armCircleData.rightPositions.length > 5) {
        rightSmoothness = this.calculateMovementSmoothness(this.armCircleData.rightPositions);
      }
      
      const avgSmoothness = (leftSmoothness + rightSmoothness) / 2;
      if (avgSmoothness < 0.65) {
        this.metrics.mistakes.push('Try to make smoother, more fluid arm circles');
      }
      
      // Calculate form quality with weighted components
      const extensionScore = Math.min(100, 
        ((leftArmAngle - 120) + (rightArmAngle - 120)) * 1.25
      );
      const circleScore = Math.min(100, (leftCircleSize + rightCircleSize) * 300);
      const symmetryScore = 100 - Math.min(100, sizeDifference * 500);
      const smoothnessScore = avgSmoothness * 100;
      
      // Weighted average for a comprehensive quality score
      this.metrics.formScore = Math.round(
        (extensionScore * 0.3) + (circleScore * 0.3) + (symmetryScore * 0.2) + (smoothnessScore * 0.2)
      );
      this.metrics.repQuality = this.metrics.formScore;
      
      // Ensure reasonable values
      if (this.metrics.repQuality < 0) this.metrics.repQuality = 0;
      if (this.metrics.repQuality > 100) this.metrics.repQuality = 100;
      
    } catch (error) {
      console.error("Error in arm circles metrics calculation:", error);
      this.metrics.repQuality = 50;
      this.metrics.formScore = 50;
    }
  }
  
  // Calculate angle between three points
  private calculateAngle(a: poseDetection.Keypoint, b: poseDetection.Keypoint, c: poseDetection.Keypoint): number {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    
    return angle;
  }
  
  // Get current metrics
  getMetrics(): ExerciseMetrics {
    return { ...this.metrics };
  }
  
  // Reset metrics
  resetMetrics(): void {
    this.metrics = initializeMetrics();
    this.startTime = Date.now();
    this.repState = 'up';
  }
}

// Helper function to draw pose landmarks on canvas
export const drawPoseLandmarks = (
  ctx: CanvasRenderingContext2D,
  pose: PoseData,
  exercise: string
): void => {
  if (!pose || !pose.keypoints || pose.keypoints.length === 0) return;
  
  const keypoints = pose.keypoints;
  
  // Draw keypoints
  for (const keypoint of keypoints) {
    if (keypoint.score === undefined || keypoint.score > 0.2) { // Lower threshold for visualization
      ctx.beginPath();
      ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'aqua';
      ctx.fill();
      
      // Draw keypoint name for debugging
      if (keypoint.name) {
        ctx.font = '10px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(keypoint.name, keypoint.x + 7, keypoint.y);
      }
    }
  }
  
  // Define MoveNet-specific connections for better visualization
  const connections = [
    // Face
    [0, 1], [0, 2], [1, 3], [2, 4], // Nose to eyes to ears
    // Upper body
    [5, 6], // Left to right shoulder
    [5, 7], [7, 9], // Left shoulder to left elbow to left wrist
    [6, 8], [8, 10], // Right shoulder to right elbow to right wrist
    [5, 11], [6, 12], // Shoulders to hips
    [11, 12], // Left to right hip
    // Lower body
    [11, 13], [13, 15], // Left hip to left knee to left ankle
    [12, 14], [14, 16], // Right hip to right knee to right ankle
  ];
  
  ctx.strokeStyle = 'rgb(0, 255, 0)';
  ctx.lineWidth = 2;
  
  // Draw connections between keypoints
  for (const [fromIdx, toIdx] of connections) {
    if (fromIdx < keypoints.length && toIdx < keypoints.length) {
      const from = keypoints[fromIdx];
      const to = keypoints[toIdx];
      
      if (
        (from.score === undefined || from.score > 0.2) && 
        (to.score === undefined || to.score > 0.2)
      ) {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      }
    }
  }
  
  // Draw exercise-specific highlights
  if (exercise === 'Push-ups') {
    // Highlight arms and shoulders for push-ups (indices 5-10)
    const pushupIndices = [5, 6, 7, 8, 9, 10]; // Shoulders, elbows, wrists
    highlightKeypointsByIndices(ctx, keypoints, pushupIndices);
  } else if (exercise === 'Squats') {
    // Highlight legs for squats (indices 11-16)
    const squatIndices = [11, 12, 13, 14, 15, 16]; // Hips, knees, ankles
    highlightKeypointsByIndices(ctx, keypoints, squatIndices);
  } else if (exercise === 'Plank') {
    // Highlight core for plank (indices 5, 6, 11, 12)
    const plankIndices = [5, 6, 11, 12]; // Shoulders and hips
    highlightKeypointsByIndices(ctx, keypoints, plankIndices);
  } else if (exercise === 'Hip Circles') {
    // Highlight hips, shoulders, and spine for hip circles
    const hipCircleIndices = [5, 6, 11, 12]; // Shoulders and hips
    highlightKeypointsByIndices(ctx, keypoints, hipCircleIndices);
    
    // Draw a guide for hip circles
    if (keypoints[11] && keypoints[12] && keypoints[11].score && keypoints[12].score) {
      const hipX = (keypoints[11].x + keypoints[12].x) / 2;
      const hipY = (keypoints[11].y + keypoints[12].y) / 2;
      
      // Draw hip center with larger highlight
      ctx.beginPath();
      ctx.arc(hipX, hipY, 12, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 0, 255, 0.5)';
      ctx.fill();
      ctx.strokeStyle = 'magenta';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw a suggested circle path
      ctx.beginPath();
      ctx.arc(hipX, hipY, 25, 0, 2 * Math.PI);
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.6)';
      ctx.stroke();
      ctx.setLineDash([]);
    }
  } else if (exercise === 'Wrist Rotate') {
    // Highlight arms and wrists for wrist rotations
    const wristRotateIndices = [7, 8, 9, 10]; // Elbows and wrists
    highlightKeypointsByIndices(ctx, keypoints, wristRotateIndices);
    
    // Draw wrist guides
    const leftWrist = keypoints[9];
    const leftElbow = keypoints[7];
    const rightWrist = keypoints[10];
    const rightElbow = keypoints[8];
    
    if (leftWrist && leftWrist.score && leftElbow && leftElbow.score) {
      // Draw left wrist larger highlight
      ctx.beginPath();
      ctx.arc(leftWrist.x, leftWrist.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 165, 0, 0.5)';
      ctx.fill();
      ctx.strokeStyle = 'orange';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw rotation circle guide
      ctx.beginPath();
      ctx.arc(leftWrist.x, leftWrist.y, 15, 0, 2 * Math.PI);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(255, 165, 0, 0.6)';
      ctx.stroke();
    }
    
    if (rightWrist && rightWrist.score && rightElbow && rightElbow.score) {
      // Draw right wrist larger highlight
      ctx.beginPath();
      ctx.arc(rightWrist.x, rightWrist.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 165, 0, 0.5)';
      ctx.fill();
      ctx.strokeStyle = 'orange';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw rotation circle guide
      ctx.beginPath();
      ctx.arc(rightWrist.x, rightWrist.y, 15, 0, 2 * Math.PI);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(255, 165, 0, 0.6)';
      ctx.stroke();
      ctx.setLineDash([]);
    }
  } else if (exercise === 'Arm Circles') {
    // Highlight shoulders, arms and wrists for arm circles
    const armCircleIndices = [5, 6, 7, 8, 9, 10]; // Shoulders, elbows, and wrists
    highlightKeypointsByIndices(ctx, keypoints, armCircleIndices);
    
    // Draw arm circle guides
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftWrist = keypoints[9];
    const rightWrist = keypoints[10];
    
    if (leftShoulder && leftShoulder.score && leftWrist && leftWrist.score) {
      // Draw suggested circle path for left arm
      ctx.beginPath();
      ctx.arc(leftShoulder.x, leftShoulder.y, 
        Math.hypot(leftWrist.x - leftShoulder.x, leftWrist.y - leftShoulder.y), 
        0, 2 * Math.PI);
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(0, 191, 255, 0.6)';
      ctx.stroke();
    }
    
    if (rightShoulder && rightShoulder.score && rightWrist && rightWrist.score) {
      // Draw suggested circle path for right arm
      ctx.beginPath();
      ctx.arc(rightShoulder.x, rightShoulder.y, 
        Math.hypot(rightWrist.x - rightShoulder.x, rightWrist.y - rightShoulder.y), 
        0, 2 * Math.PI);
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(0, 191, 255, 0.6)';
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Extra visual guides with arrows showing rotation direction
    if (leftWrist && leftWrist.score && leftShoulder && leftShoulder.score) {
      const radius = Math.hypot(leftWrist.x - leftShoulder.x, leftWrist.y - leftShoulder.y);
      const arrowAngle = Math.atan2(leftWrist.y - leftShoulder.y, leftWrist.x - leftShoulder.x);
      
      // Draw arrow indicating rotation direction
      drawRotationArrow(ctx, leftShoulder.x, leftShoulder.y, radius, arrowAngle, true);
    }
    
    if (rightWrist && rightWrist.score && rightShoulder && rightShoulder.score) {
      const radius = Math.hypot(rightWrist.x - rightShoulder.x, rightWrist.y - rightShoulder.y);
      const arrowAngle = Math.atan2(rightWrist.y - rightShoulder.y, rightWrist.x - rightShoulder.x);
      
      // Draw arrow indicating rotation direction
      drawRotationArrow(ctx, rightShoulder.x, rightShoulder.y, radius, arrowAngle, false);
    }
  }
};

// Helper function to draw rotation arrows for arm circles and wrist rotations
const drawRotationArrow = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  angle: number,
  clockwise: boolean = true
): void => {
  // Draw an arrow along the circle path to indicate rotation direction
  const arrowLength = 15;
  const arrowWidth = 6;
  
  // Calculate arrow position just ahead of current angle
  const arrowAngle = clockwise ? angle + Math.PI / 6 : angle - Math.PI / 6;
  const arrowX = centerX + radius * Math.cos(arrowAngle);
  const arrowY = centerY + radius * Math.sin(arrowAngle);
  
  // Calculate tangent angle for the arrow
  const tangentAngle = arrowAngle + (clockwise ? Math.PI / 2 : -Math.PI / 2);
  
  // Calculate arrow points
  const tipX = arrowX + arrowLength * Math.cos(tangentAngle);
  const tipY = arrowY + arrowLength * Math.sin(tangentAngle);
  
  const leftX = arrowX + arrowWidth * Math.cos(tangentAngle - Math.PI / 2);
  const leftY = arrowY + arrowWidth * Math.sin(tangentAngle - Math.PI / 2);
  
  const rightX = arrowX + arrowWidth * Math.cos(tangentAngle + Math.PI / 2);
  const rightY = arrowY + arrowWidth * Math.sin(tangentAngle + Math.PI / 2);
  
  // Draw arrow
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(leftX, leftY);
  ctx.lineTo(rightX, rightY);
  ctx.closePath();
  
  ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(255, 200, 0)';
  ctx.lineWidth = 1;
  ctx.stroke();
};

// Helper function to highlight specific joints by indices
const highlightKeypointsByIndices = (
  ctx: CanvasRenderingContext2D,
  keypoints: poseDetection.Keypoint[],
  indices: number[]
): void => {
  for (const index of indices) {
    if (index < keypoints.length) {
      const keypoint = keypoints[index];
      
      if (keypoint.score === undefined || keypoint.score > 0.2) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.fill();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }
};

// Utility to generate exercise reports
export const generateExerciseReport = (metrics: ExerciseMetrics, exercise: string): string => {
  const { repCount, repQuality, formScore, calories, duration, avgRepDuration, mistakes } = metrics;
  
  let report = `# ${exercise} Exercise Report\n\n`;
  
  if (exercise === 'Plank') {
    report += `## Duration\n${formatTime(duration)}\n\n`;
  } else {
    report += `## Repetitions\n${repCount} reps\n\n`;
    report += `## Average Rep Duration\n${Math.round(avgRepDuration / 1000)} seconds\n\n`;
  }
  
  report += `## Form Quality\n${formScore}%\n\n`;
  report += `## Calories Burned\n${calories} kcal\n\n`;
  report += `## Total Duration\n${formatTime(duration)}\n\n`;
  
  if (mistakes.length > 0) {
    report += `## Areas for Improvement\n`;
    mistakes.forEach(mistake => {
      report += `- ${mistake}\n`;
    });
    report += '\n';
  }
  
  // Add recommendations based on performance
  report += `## Recommendations\n`;
  
  if (formScore < 70) {
    report += `- Focus on improving form before increasing intensity\n`;
  } else if (formScore >= 90) {
    report += `- Excellent form! Consider increasing resistance or difficulty\n`;
  }
  
  if (exercise !== 'Plank' && repCount < 5) {
    report += `- Aim for more repetitions in your next session\n`;
  } else if (exercise !== 'Plank' && repCount > 15) {
    report += `- Great endurance! Consider adding resistance for increased strength benefits\n`;
  }
  
  if (exercise === 'Plank' && duration < 30) {
    report += `- Work on increasing your plank hold time\n`;
  } else if (exercise === 'Plank' && duration > 60) {
    report += `- Try more challenging plank variations\n`;
  }
  
  return report;
};

// Format time in MM:SS
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}; 