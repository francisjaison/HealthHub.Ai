import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const TestLogin = () => {
  const { login } = useAuth();

  const loginAsAdmin = async () => {
    console.log("Attempting admin login...");
    const result = await login("admin@example.com", "admin123");
    console.log("Admin login result:", result);
  };

  const loginAsDoctor = async () => {
    console.log("Attempting doctor login...");
    const result = await login("doctor@example.com", "doctor123");
    console.log("Doctor login result:", result);
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-forest mb-2">Test Login Page</h1>
            <p className="text-muted-foreground">Click the buttons below to test direct login</p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={loginAsAdmin} 
              className="w-full bg-forest hover:bg-forest-dark"
            >
              Login as Admin
            </Button>
            
            <Button 
              onClick={loginAsDoctor} 
              className="w-full bg-forest hover:bg-forest-dark"
            >
              Login as Doctor
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <p>This page bypasses the regular login form</p>
            <p>Check the browser console for detailed login results</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TestLogin; 