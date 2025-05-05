
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface GoogleButtonProps {
  text?: string;
  className?: string;
  onSuccess?: (token: string) => void;
}

const GoogleButton = ({ 
  text = "Continue with Google", 
  className = "",
  onSuccess
}: GoogleButtonProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithProvider } = useAuth();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      // Set up Google OAuth popup
      const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
      const redirectUri = window.location.origin + "/auth/callback";
      
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "155897550402-sagl9b4qt62j5o1v108cr4dbhqrpfugb.apps.googleusercontent.com";
      
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "email profile",
        prompt: "select_account",
        access_type: "offline"
      });

      // For this demo, we'll use a simulated flow since we can't implement the full OAuth flow in this environment
      console.log(`Opening Google Auth URL: ${googleAuthUrl}?${params.toString()}`);
      
      // Simulate a successful authentication for demo purposes
      setTimeout(async () => {
        const mockGoogleProfile = {
          email: "demo.user@gmail.com",
          name: "Demo User",
          sub: "google-" + Math.random().toString(36).substring(2)
        };
        
        // Call the loginWithProvider function from AuthContext
        const success = await loginWithProvider("google", mockGoogleProfile);
        
        if (success && onSuccess) {
          const mockToken = "google-mock-token-" + Math.random().toString(36).substring(2);
          onSuccess(mockToken);
        }
        
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
      console.error("Google sign-in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button 
      type="button"
      variant="outline" 
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={`w-full flex items-center justify-center gap-2 ${className}`}
    >
      {!isLoading ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      ) : null}
      {isLoading ? "Processing..." : text}
    </Button>
  );
};

export default GoogleButton;
