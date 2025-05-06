import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart, 
  LineChart, 
  Calendar, 
  Heart, 
  Activity, 
  Thermometer,
  User, 
  Bell, 
  AlertCircle,
  LucideBarChart,
  LucideLineChart,
  PieChart,
  Dumbbell,
  Brain,
  Apple,
  ArrowRight,
  MessageSquare,
  MinusCircle,
  Maximize,
  Minimize
} from "lucide-react";
import { 
  AreaChart, Area, 
  LineChart as RechartsLineChart, Line,
  BarChart as RechartsBarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchDashboardSummary,
  fetchHeartRateData,
  fetchActivityData,
  fetchUpcomingAppointments 
} from "@/lib/api";
import { format } from 'date-fns';
import SparklineChart from "@/components/SparklineChart";
import AIChat from "@/components/chat/AIChat";

// This is the new fixed file without merge conflicts and with correct icon names

const formatAppointmentDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  const datePart = format(date, 'MMM d, yyyy');
  const timePart = format(date, 'h:mm a');
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return { date: 'Today', time: timePart };
  if (date.toDateString() === tomorrow.toDateString()) return { date: 'Tomorrow', time: timePart };

  return { date: datePart, time: timePart };
};

const iconMap = {
  Heart: Heart,
  Activity: Activity,
  LineChart: LineChart,
  Default: Calendar
};

const Dashboard = () => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>("week");
  const { isAuthenticated } = useAuth();
  const [showChat, setShowChat] = useState(false);
  const [minimizeChat, setMinimizeChat] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Query hooks for fetching data
  const { 
    data: summaryData,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
    error: errorSummary
  } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: () => fetchDashboardSummary(null),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  const { 
    data: heartRateData,
    isLoading: isLoadingHeartRate,
    isError: isErrorHeartRate,
    error: errorHeartRate
  } = useQuery({
    queryKey: ['heartRateData', period],
    queryFn: () => fetchHeartRateData(null, period),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, 
  });

  const { 
    data: activityData,
    isLoading: isLoadingActivity,
    isError: isErrorActivity,
    error: errorActivity
  } = useQuery({
    queryKey: ['activityData', period],
    queryFn: () => fetchActivityData(null, period),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, 
  });

  const { 
    data: appointmentsData,
    isLoading: isLoadingAppointments,
    isError: isErrorAppointments,
    error: errorAppointments
  } = useQuery({
    queryKey: ['upcomingAppointments'],
    queryFn: () => fetchUpcomingAppointments(null),
    enabled: isAuthenticated,
    staleTime: 15 * 60 * 1000,
  });
  
  const isLoading = isLoadingSummary || isLoadingHeartRate || isLoadingActivity || isLoadingAppointments;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const renderError = (error: unknown) => (
    <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
      <AlertCircle className="flex-shrink-0 inline w-4 h-4 me-3" />
      <span className="font-medium">Error loading data:</span> {error instanceof Error ? error.message : 'An unknown error occurred'}
    </div>
  );

  const scrollToChat = () => {
    setShowChat(true);
    setMinimizeChat(false);
    if (chatRef.current) {
      chatRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle navigation to chat section via URL hash
  useEffect(() => {
    // Check if there's a hash in the URL
    if (window.location.hash === '#ai-chat') {
      setShowChat(true);
      setMinimizeChat(false);
      // Scroll to chat section with a small delay to ensure components are rendered
      setTimeout(() => {
        chatRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }

    // Listen for hash changes
    const handleHashChange = () => {
      if (window.location.hash === '#ai-chat') {
        setShowChat(true);
        setMinimizeChat(false);
        setTimeout(() => {
          chatRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-forest">Health Dashboard</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="mr-2 h-4 w-4" />
              Alerts
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="bg-forest hover:bg-forest-dark text-white"
              onClick={scrollToChat}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              AI Chat
            </Button>
            <Button variant="outline" size="sm">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </div>
        </div>

        {isErrorSummary && renderError(errorSummary)}
        {isErrorHeartRate && renderError(errorHeartRate)}
        {isErrorActivity && renderError(errorActivity)}
        {isErrorAppointments && renderError(errorAppointments)}

        {/* Add the rest of your Dashboard component here */}
        
        {/* Chat minimize/maximize button */}
        <Button 
          onClick={() => setMinimizeChat(!minimizeChat)}
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50"
        >
          {minimizeChat ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
          {minimizeChat ? " Expand Chat" : " Minimize"}
        </Button>
        
        {/* Chat section when not minimized */}
        {showChat && !minimizeChat && (
          <div ref={chatRef} className="mt-8">
            <Card>
              <CardHeader className="bg-forest text-white">
                <CardTitle>AI Health Assistant</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <AIChat />
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Minimized chat indicator */}
        {showChat && minimizeChat && (
          <div className="fixed bottom-16 right-4 bg-forest text-white p-2 rounded-md shadow-lg z-50">
            <MessageSquare className="h-5 w-5" />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
