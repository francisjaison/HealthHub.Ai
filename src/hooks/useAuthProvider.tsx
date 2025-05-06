import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";
import { User, UserRole, AuthProvider, GoogleProfile, AuthContextType } from "@/types/auth";

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // Redirect to health form if profile is not completed
        if (parsedUser && !parsedUser.profileCompleted) {
          navigate("/health-form");
        }
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("user");
      }
    }
  }, [navigate]);

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // This is a mock implementation - in a real app, this would call an API
      // Special credential check for admin and doctor roles
      if (email === "admin@example.com") {
        if (password === "admin123") {
          const adminUser = { 
            email, 
            role: "admin" as UserRole, 
            name: "Admin User", 
            provider: "email" as AuthProvider,
            profileCompleted: true,
            uid: `email-${Math.random().toString(36).substring(2)}`
          };
          setUser(adminUser);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(adminUser));
          toast({
            title: "Login Successful",
            description: "Welcome to the admin panel!",
          });
          navigate("/admin");
          return true;
        }
      } else if (email === "doctor@example.com") {
        if (password === "doctor123") {
          const doctorUser = { 
            email, 
            role: "doctor" as UserRole, 
            name: "Doctor User", 
            provider: "email" as AuthProvider,
            profileCompleted: true,
            uid: `email-${Math.random().toString(36).substring(2)}`
          };
          setUser(doctorUser);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(doctorUser));
          toast({
            title: "Login Successful",
            description: "Welcome to the doctor panel!",
          });
          navigate("/doctor");
          return true;
        }
      }

      // Regular user login (mock)
      if (email && password.length >= 6) {
        const regularUser = { 
          email, 
          role: "patient" as UserRole, 
          provider: "email" as AuthProvider,
          profileCompleted: false,  // New users need to complete profile
          uid: `email-${Math.random().toString(36).substring(2)}`
        };
        setUser(regularUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(regularUser));
        toast({
          title: "Login Successful",
          description: "Welcome to HealthHub.ai!",
        });
        
        // Redirect to health form for profile completion
        navigate("/health-form");
        return true;
      }

      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // This is a mock implementation - in a real app, this would call an API
      if (email && password.length >= 6 && name) {
        const newUser = { 
          email, 
          role: "patient" as UserRole, 
          name, 
          provider: "email" as AuthProvider,
          profileCompleted: false,  // New users need to complete profile
          uid: `email-${Math.random().toString(36).substring(2)}`
        };
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(newUser));
        toast({
          title: "Account Created",
          description: "Your account has been created successfully!",
        });
        
        // Redirect to health form
        navigate("/health-form");
        return true;
      }

      toast({
        title: "Sign Up Failed",
        description: "Please fill in all fields correctly.",
        variant: "destructive",
      });
      return false;
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign Up Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const loginWithProvider = async (provider: "google" | "microsoft", profile?: GoogleProfile): Promise<boolean> => {
    try {
      // For Google auth with provided profile data
      if (provider === "google" && profile) {
        const { email, name, sub } = profile;
        
        const googleUser = { 
          email, 
          role: "patient" as UserRole, 
          name, 
          provider: "google" as AuthProvider,
          profileCompleted: false,  // New users need to complete profile
          uid: sub
        };
        
        setUser(googleUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(googleUser));
        
        toast({
          title: "Login Successful",
          description: `Welcome to HealthHub.ai, ${name}!`,
        });
        
        // Redirect to health form
        navigate("/health-form");
        return true;
      }
      
      // Legacy mock implementation for other providers or when profile is not provided
      const providerName = provider === "google" ? "Google" : "Microsoft";
      
      // Create a mock user based on the provider
      const mockEmail = `user-${Math.random().toString(36).substring(2)}@${provider}.com`;
      const mockName = `${providerName} User`;
      
      const newUser = { 
        email: mockEmail, 
        role: "patient" as UserRole, 
        name: mockName, 
        provider: provider as AuthProvider,
        profileCompleted: false,  // New users need to complete profile
        uid: `${provider}-${Math.random().toString(36).substring(2)}`
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      toast({
        title: "Login Successful",
        description: `You've been logged in with ${providerName}!`,
      });
      
      // Redirect to health form
      navigate("/health-form");
      return true;
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast({
        title: "Authentication Failed",
        description: `Could not sign in with ${provider}. Please try again.`,
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return {
    user,
    isAuthenticated,
    login,
    signUp,
    loginWithProvider,
    logout,
    updateUser
  };
};
