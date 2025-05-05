
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="max-w-md">
          <h1 className="text-7xl font-bold text-forest mb-6">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you are looking for doesn't exist or has been moved. Don't worry, 
            this is just a temporary message as we build out the complete HealthHub.ai platform.
          </p>
          <Link to="/">
            <Button className="bg-forest hover:bg-forest-dark text-white">Return to Home</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
