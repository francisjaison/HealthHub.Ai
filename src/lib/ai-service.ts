import axios from 'axios';

// Configuration for AI services
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
// No OpenAI dependency at all

// Helper function to get text from Gemini API
export const getGeminiResponse = async (prompt: string): Promise<string> => {
  try {
    // Check if API key is available
    if (!GEMINI_API_KEY) {
      console.log("Using local exercise data instead of API");
      // Return a local response instead of requiring an API key
      return "AI service is not configured. Camera analysis will still work.";
    }

    // Gemini API endpoint
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    
    const response = await axios.post(
      `${endpoint}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      }
    );

    // Extract text from the response
    if (response.data.candidates && response.data.candidates[0].content.parts) {
      return response.data.candidates[0].content.parts[0].text;
    }
    
    return "Could not generate a response from AI.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Error communicating with AI service.";
  }
};

// Helper function for health-related AI queries
export const getHealthAdvice = async (query: string): Promise<string> => {
  const healthPrompt = `As a healthcare assistant, please provide helpful information about: ${query}. 
    Include factual information and suggestions, but make it clear that this is not medical advice and 
    the user should consult with a healthcare professional for personalized guidance.`;
  
  return getGeminiResponse(healthPrompt);
};

// Helper function for exercise analysis
export const getExerciseAnalysis = async (exercise: string): Promise<string> => {
  // Check if API key is available first
  if (!GEMINI_API_KEY) {
    console.log("No API key available, using local exercise data");
    
    // Return pre-written exercise descriptions based on exercise type
    if (exercise === "Push-ups") {
      return "AI service is not configured. Camera analysis will still work.";
    } else if (exercise === "Squats") {
      return "AI service is not configured. Camera analysis will still work.";
    } else if (exercise === "Plank") {
      return "AI service is not configured. Camera analysis will still work.";
    } else {
      return "AI service is not configured. Camera analysis will still work.";
    }
  }
  
  const analysisPrompt = `Provide a detailed analysis of the exercise "${exercise}" including:
    1. Proper form and technique
    2. Common mistakes to avoid
    3. Modifications for different fitness levels
    4. Target muscles worked
    5. Benefits of this exercise
    6. Safety precautions
    
    Format the response in markdown with clear headings and bullet points.`;
  
  // Use Gemini only for exercise analysis
  return getGeminiResponse(analysisPrompt);
};
