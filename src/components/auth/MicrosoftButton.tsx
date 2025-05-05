
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface MicrosoftButtonProps {
  text?: string;
  className?: string;
  onSuccess?: (token: string) => void;
}

const MicrosoftButton = ({ 
  text = "Continue with Microsoft", 
  className = "",
  onSuccess
}: MicrosoftButtonProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithProvider } = useAuth();

  const handleMicrosoftSignIn = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success case with Microsoft provider
      const success = await loginWithProvider("microsoft");
      
      if (success && onSuccess) {
        const mockToken = "microsoft-mock-token-" + Math.random().toString(36).substring(2);
        onSuccess(mockToken);
      }
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Could not sign in with Microsoft. Please try again.",
        variant: "destructive",
      });
      console.error("Microsoft sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      type="button"
      variant="outline" 
      onClick={handleMicrosoftSignIn}
      disabled={isLoading}
      className={`w-full flex items-center justify-center gap-2 ${className}`}
    >
      {!isLoading ? (
        <svg className="h-5 w-5" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
          <path fill="#f35325" d="M1 1h10v10H1z"/>
          <path fill="#81bc06" d="M12 1h10v10H12z"/>
          <path fill="#05a6f0" d="M1 12h10v10H1z"/>
          <path fill="#ffba08" d="M12 12h10v10H12z"/>
        </svg>
      ) : null}
      {isLoading ? "Processing..." : text}
    </Button>
  );
};

export default MicrosoftButton;
