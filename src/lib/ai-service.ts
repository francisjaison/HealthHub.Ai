
import axios from 'axios';

// Configuration for AI services
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

// Helper function to get text from Gemini API
export const getGeminiResponse = async (prompt: string): Promise<string> => {
  try {
    // Check if API key is available
    if (!GEMINI_API_KEY) {
      console.error("Gemini API key is not set");
      return "AI service is not configured. Please provide an API key.";
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

// Helper function for OpenAI API calls
export const getOpenAIResponse = async (prompt: string): Promise<string> => {
  try {
    // Check if API key is available
    if (!OPENAI_API_KEY) {
      console.error("OpenAI API key is not set");
      return "OpenAI service is not configured. Please provide an API key.";
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4-turbo", // You can change this to a different model if needed
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.choices && response.data.choices[0].message) {
      return response.data.choices[0].message.content;
    }
    
    return "Could not generate a response from OpenAI.";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "Error communicating with OpenAI service.";
  }
};

// Helper function for exercise analysis
export const getExerciseAnalysis = async (exercise: string): Promise<string> => {
  const analysisPrompt = `Provide a detailed analysis of the exercise "${exercise}" including:
    1. Proper form and technique
    2. Common mistakes to avoid
    3. Modifications for different fitness levels
    4. Target muscles worked
    5. Benefits of this exercise
    6. Safety precautions
    
    Format the response in markdown with clear headings and bullet points.`;
  
  // Use OpenAI for more detailed exercise analysis
  return getOpenAIResponse(analysisPrompt);
};
