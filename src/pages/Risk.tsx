
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Risk = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the enhanced risk planner page after a short delay
    const timer = setTimeout(() => {
      navigate("/risk-planner");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="h-8 w-8 text-forest animate-spin mb-4" />
            <h3 className="text-lg font-medium mb-2">Redirecting to Risk Assessment Hub</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              We've enhanced our risk assessment functionality. Redirecting you to our new Risk Assessment Hub.
            </p>
            <Button onClick={() => navigate("/risk-planner")}>
              Go to Risk Assessment Hub
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Risk;
