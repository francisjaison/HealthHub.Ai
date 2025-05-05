
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface LogoutButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | 
             "ghost" | "link" | null | undefined;
  children?: React.ReactNode;
}

const LogoutButton = ({ 
  className = "",
  variant = "outline",
  children 
}: LogoutButtonProps) => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <Button 
      onClick={handleLogout} 
      variant={variant} 
      className={`flex items-center gap-2 ${className}`}
    >
      {children || (
        <>
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </>
      )}
    </Button>
  );
};

export default LogoutButton;
