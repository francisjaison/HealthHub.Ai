import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const LinkTest = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-forest">HealthHub Navigation Test</h1>
            <p className="text-muted-foreground mt-2">Testing all available routes and links</p>
            
            {isAuthenticated && (
              <div className="mt-4 p-4 bg-sage/10 rounded-lg">
                <p><strong>Current User:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
                <Button className="mt-2" variant="outline" onClick={logout}>Logout</Button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <LinkCard title="Public Pages" links={[
              { path: "/", label: "Home" },
              { path: "/login", label: "Login" },
              { path: "/signup", label: "Sign Up" },
              { path: "/test-login", label: "Test Login" }
            ]} />
            
            <LinkCard title="User Pages" links={[
              { path: "/dashboard", label: "Dashboard" },
              { path: "/profile", label: "Profile" },
              { path: "/health-form", label: "Health Form" },
              { path: "/risk", label: "Risk Assessment" }
            ]} />
            
            <LinkCard title="Admin & Doctor" links={[
              { path: "/admin", label: "Admin Panel" },
              { path: "/doctor", label: "Doctor Panel" },
              { path: "/doctor-dashboard", label: "Doctor Dashboard (legacy)" },
              { path: "/admin-dashboard", label: "Admin Dashboard (legacy)" }
            ]} />
          </div>
          
          <div className="mt-8 bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h2 className="text-lg font-semibold text-amber-800 mb-2">Troubleshooting Tips</h2>
            <ul className="list-disc pl-6 text-amber-700 space-y-2">
              <li>If you get a 404 error, it means the route isn't defined in <code>AppRoutes.tsx</code></li>
              <li>If you're redirected to login, you may not have proper authentication</li>
              <li>If you're redirected to dashboard, you may not have the correct role</li>
              <li>Check the browser console (F12) for any errors</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const LinkCard = ({ title, links }: { title: string, links: { path: string, label: string }[] }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h2 className="font-semibold text-lg mb-3 text-forest">{title}</h2>
      <div className="space-y-2">
        {links.map((link, index) => (
          <div key={index} className="flex items-center">
            <Link 
              to={link.path}
              className="w-full py-2 px-3 text-left rounded-md hover:bg-forest/10 text-forest transition-colors"
            >
              {link.label}
              <span className="text-xs text-gray-500 ml-2">{link.path}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinkTest; 