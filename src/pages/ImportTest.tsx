import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import Admin and Doctor panels to verify they can be imported
import AdminPanel from "./AdminPanel";
import DoctorPanel from "./DoctorPanel";

const ImportTest = () => {
  const [showComponent, setShowComponent] = React.useState<string | null>(null);
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Component Import Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-4">This page tests whether components can be successfully imported.</p>
              <p className="mb-4 text-green-600">
                ✓ AdminPanel and DoctorPanel were successfully imported
              </p>
              
              <div className="flex gap-4">
                <Button 
                  onClick={() => setShowComponent("admin")}
                  variant={showComponent === "admin" ? "default" : "outline"}
                >
                  Render AdminPanel
                </Button>
                <Button 
                  onClick={() => setShowComponent("doctor")}
                  variant={showComponent === "doctor" ? "default" : "outline"}
                >
                  Render DoctorPanel
                </Button>
                <Button 
                  onClick={() => setShowComponent(null)}
                  variant="outline"
                >
                  Hide Components
                </Button>
              </div>
            </div>
            
            {showComponent === "admin" && (
              <div className="mt-8 border-t pt-4">
                <p className="mb-2 font-bold">AdminPanel:</p>
                <AdminPanel />
              </div>
            )}
            
            {showComponent === "doctor" && (
              <div className="mt-8 border-t pt-4">
                <p className="mb-2 font-bold">DoctorPanel:</p>
                <DoctorPanel />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ImportTest; 