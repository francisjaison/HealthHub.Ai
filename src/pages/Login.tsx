import { useState, useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import GoogleButton from "@/components/auth/GoogleButton";
import MicrosoftButton from "@/components/auth/MicrosoftButton";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

// Define login form schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const [activeRole, setActiveRole] = useState<"user" | "doctor" | "admin">("user");
  
  // Check if there's a specific role in the URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("admin")) {
      setActiveRole("admin");
      form.setValue("email", "admin@example.com");
    } else if (path.includes("doctor")) {
      setActiveRole("doctor");
      form.setValue("email", "doctor@example.com");
    }
  }, [location]);

  // Define form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg border-sage/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-forest">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your HealthHub.ai account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="your@email.com"
                              className="pl-10"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="text-right">
                    <Link to="/forgot-password" className="text-sm text-forest hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-forest hover:bg-forest-dark"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </Form>

              <div className="mt-4 p-3 border rounded-md bg-sage/10 dark:bg-forest-light/10">
                <h3 className="text-sm font-semibold mb-2">Role-specific logins:</h3>
                <div className="space-y-2 text-xs">
                  <button 
                    className={`w-full text-left p-2 rounded-md flex justify-between items-center ${activeRole === "admin" ? "bg-forest/20 dark:bg-forest/40" : "hover:bg-forest/10 dark:hover:bg-forest/20"}`}
                    onClick={() => {
                      setActiveRole("admin");
                      form.setValue("email", "admin@example.com");
                      form.setValue("password", "admin123");
                    }}
                    type="button"
                  >
                    <span className="font-medium">Admin:</span>
                    <span className="font-mono">admin@example.com / admin123</span>
                  </button>
                  <button 
                    className={`w-full text-left p-2 rounded-md flex justify-between items-center ${activeRole === "doctor" ? "bg-forest/20 dark:bg-forest/40" : "hover:bg-forest/10 dark:hover:bg-forest/20"}`}
                    onClick={() => {
                      setActiveRole("doctor");
                      form.setValue("email", "doctor@example.com");
                      form.setValue("password", "doctor123");
                    }}
                    type="button"
                  >
                    <span className="font-medium">Doctor:</span>
                    <span className="font-mono">doctor@example.com / doctor123</span>
                  </button>
                  <button 
                    className={`w-full text-left p-2 rounded-md flex justify-between items-center ${activeRole === "user" ? "bg-forest/20 dark:bg-forest/40" : "hover:bg-forest/10 dark:hover:bg-forest/20"}`}
                    onClick={() => {
                      setActiveRole("user");
                      form.setValue("email", "");
                      form.setValue("password", "");
                    }}
                    type="button"
                  >
                    <span className="font-medium">Regular User:</span>
                    <span className="font-mono">any email / password (min 6 chars)</span>
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <GoogleButton />
                  <MicrosoftButton />
                </div>
              </div>

              <div className="mt-6 text-center text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-forest font-medium hover:underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
