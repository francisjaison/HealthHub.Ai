import os
import google.generativeai as genai
from fastapi import APIRouter, Depends, HTTPException, status
from schemas import AIChatMessageInput, AIChatMessageOutput
from routers.auth import get_current_user # Correct function name
from models import User # Import User if needed for dependency

router = APIRouter(
    prefix="/ai-chat",
    tags=["AI Chat"],
    responses={404: {"description": "Not found"}},
)

# --- Gemini Configuration --- 
genai_model = None
genai_configured_successfully = False

try:
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        genai.configure(api_key=api_key)
        # Define the model (e.g., gemini-1.5-flash)
        genai_model = genai.GenerativeModel('gemini-1.5-flash') 
        genai_configured_successfully = True
        print("Gemini API configured successfully.")
    else:
        print("Warning: GEMINI_API_KEY environment variable not set. AI Chat will not function.")
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    # genai_configured_successfully remains False

# --- API Endpoint --- 

@router.post("/chat", response_model=AIChatMessageOutput)
async def handle_chat_message(
    chat_input: AIChatMessageInput,
    current_user: User = Depends(get_current_user) # Corrected function name
):
    """Receives a user message and returns a response from the Gemini AI model."""
    
    # Check if Gemini was configured successfully at startup
    if not genai_configured_successfully or not genai_model:
         raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI Chat service is not configured or unavailable."
        )
        
    try:
        # Generate content using the pre-configured model
        response = genai_model.generate_content(chat_input.message)
        
        # Optional: Check for safety ratings or blocked prompts
        # if response.prompt_feedback.block_reason:
        #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Request blocked due to safety concerns.")

        ai_response = response.text
        
    except Exception as e:
        print(f"Error generating response from Gemini: {e}")
        # Consider more specific error handling based on Gemini exceptions if needed
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get response from AI service."
        )

    return AIChatMessageOutput(response=ai_response)

# Add more endpoints if needed, e.g., for managing chat history 