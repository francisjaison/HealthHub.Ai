import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  MessageSquare,
  MinusCircle,
  MaximizeIcon,
  MinimizeIcon
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
import { Link } from "react-router-dom";
import AIChat from "@/components/chat/AIChat";

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

        {isLoadingSummary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </div>
        ) : summaryData ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
          <Card className="bg-white dark:bg-slate-800">
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-muted-foreground">Heart Rate</p>
                        <h4 className="text-2xl font-bold">{summaryData.heartRate.value} {summaryData.heartRate.unit}</h4>
                      </div>
                      <div className="h-10 w-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="h-5 w-5 text-red-500" />
                      </div>
                </div>
                    <div className="text-xs">
                      {summaryData.heartRate.change !== 0 && (
                          <span className={`${summaryData.heartRate.change > 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
                              {summaryData.heartRate.change > 0 ? '↑' : '↓'} {Math.abs(summaryData.heartRate.change)}%
                          </span>
                      )}
                      <span className="text-muted-foreground ml-1">from yesterday</span>
                </div>
              </div>
                  <div className="mt-auto">
                    <SparklineChart 
                      data={summaryData.heartRate.trendData}
                      strokeColor="#ef4444"
                      fillColor="#ef4444"
                      height={30} 
                    />
              </div>
            </CardContent>
          </Card>
            </motion.div>
             <motion.div variants={itemVariants}>
          <Card className="bg-white dark:bg-slate-800">
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-muted-foreground">Steps</p>
                        <h4 className="text-2xl font-bold">{summaryData.steps.value.toLocaleString()}</h4>
                      </div>
                      <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Activity className="h-5 w-5 text-blue-500" />
                      </div>
                </div>
                    <div className="text-xs">
                        {summaryData.steps.change !== 0 && (
                          <span className={`${summaryData.steps.change > 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
                              {summaryData.steps.change > 0 ? '↑' : '↓'} {Math.abs(summaryData.steps.change)}%
                          </span>
                        )}
                      <span className="text-muted-foreground ml-1">from yesterday</span>
                </div>
              </div>
                   <div className="mt-auto">
                     <SparklineChart 
                        data={summaryData.steps.trendData}
                        strokeColor="#3b82f6"
                        fillColor="#3b82f6"
                        height={30}
                      />
              </div>
            </CardContent>
          </Card>
             </motion.div>
             <motion.div variants={itemVariants}>
          <Card className="bg-white dark:bg-slate-800">
                 <CardContent className="p-4 flex flex-col justify-between h-full">
                   <div>
                      <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-muted-foreground">Calories</p>
                          <h4 className="text-2xl font-bold">{summaryData.calories.value.toLocaleString()}</h4>
                        </div>
                        <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <LucideBarChart className="h-5 w-5 text-orange-500" />
                        </div>
                </div>
                      <div className="text-xs">
                        {summaryData.calories.change !== 0 && (
                            <span className={`${summaryData.calories.change > 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
                                {summaryData.calories.change > 0 ? '↑' : '↓'} {Math.abs(summaryData.calories.change)}%
                            </span>
                        )}
                        <span className="text-muted-foreground ml-1">from yesterday</span>
                </div>
              </div>
                    <div className="mt-auto">
                       <SparklineChart 
                          data={summaryData.calories.trendData}
                          strokeColor="#f97316"
                          fillColor="#f97316"
                          height={30}
                        />
              </div>
            </CardContent>
          </Card>
             </motion.div>
             <motion.div variants={itemVariants}>
          <Card className="bg-white dark:bg-slate-800">
                 <CardContent className="p-4 flex flex-col justify-between h-full">
                   <div>
                      <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                          <h4 className="text-2xl font-bold">{summaryData.temperature.value}{summaryData.temperature.unit}</h4>
                </div>
                        <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Thermometer className="h-5 w-5 text-purple-500" />
                </div>
              </div>
                      <div className="text-xs">
                        <span className="text-gray-500 font-medium">-</span>
                        <span className="text-muted-foreground ml-1">normal</span>
                      </div>
              </div>
            </CardContent>
          </Card>
             </motion.div>
          </motion.div>
        ) : null}

        {/* Charts Section */}
        {isLoadingHeartRate || isLoadingActivity ? (
          <div className="grid grid-cols-1 gap-6 mb-6">
            <Skeleton className="h-96" /> 
            <Skeleton className="h-96" /> 
            <Skeleton className="h-96" /> 
            <Skeleton className="h-96" /> 
        </div>
        ) : ( 
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {heartRateData && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-semibold text-forest">Heart Rate (Area)</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant={period === "day" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setPeriod("day")}
                >
                  Day
                </Button>
                <Button 
                  variant={period === "week" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setPeriod("week")}
                >
                  Week
                </Button>
                <Button 
                  variant={period === "month" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setPeriod("month")}
                >
                  Month
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={heartRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[60, 90]} />
                <Tooltip 
                    contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--popover-foreground))',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                    }}
                    itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                    cursor={{ fill: 'hsl(var(--accent))', fillOpacity: 0.3 }}
                />
                <Area type="monotone" dataKey="value" stroke="#4D5D53" fill="#B2AC88" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
            )}
            {activityData && (
        <Card className="mb-6">
          <CardHeader>
                    <CardTitle className="text-xl font-semibold text-forest">Activity Overview (Area)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#4D5D53" />
                <YAxis yAxisId="right" orientation="right" stroke="#B2AC88" />
                <Tooltip 
                    contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--popover-foreground))',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                    }}
                    itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                    cursor={{ fill: 'hsl(var(--accent))', fillOpacity: 0.3 }}
                />
                <Area yAxisId="left" type="monotone" dataKey="steps" stroke="#4D5D53" fill="#4D5D53" fillOpacity={0.3} />
                <Area yAxisId="right" type="monotone" dataKey="calories" stroke="#B2AC88" fill="#B2AC88" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
            )}

            {heartRateData && (
                <Card className="mb-6"> 
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-forest">Heart Rate Trend (Line)</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={heartRateData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[60, 90]} />
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: 'hsl(var(--popover))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--popover-foreground))',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                            }}
                            itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                            cursor={{ fill: 'hsl(var(--accent))', fillOpacity: 0.3 }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="value" name="Heart Rate" stroke="#ef4444" strokeWidth={2} dot={false} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
            )}

            {activityData && (
                <Card className="mb-6">
                   <CardHeader>
                      <CardTitle className="text-xl font-semibold text-forest">Activity Overview (Bar/Line)</CardTitle>
                   </CardHeader>
                   <CardContent className="h-80">
                     <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={activityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}> 
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#4D5D53" label={{ value: 'Steps', angle: -90, position: 'insideLeft' }}/>
                        <YAxis yAxisId="right" orientation="right" stroke="#B2AC88" label={{ value: 'Calories', angle: 90, position: 'insideRight' }}/>
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: 'hsl(var(--popover))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--popover-foreground))',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                            }}
                            itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                            cursor={{ fill: 'hsl(var(--accent))', fillOpacity: 0.3 }}
                        />
                        <Legend verticalAlign="top" height={36}/>
                        <Bar yAxisId="left" dataKey="steps" name="Steps" fill="#4D5D53" />
                        <Line yAxisId="right" type="monotone" dataKey="calories" name="Calories Burned" stroke="#B2AC88" strokeWidth={2} dot={false} />
                      </RechartsBarChart>
                     </ResponsiveContainer>
                   </CardContent>
                </Card>
            )}

          </motion.div>
        )}

        {isLoadingAppointments ? (
           <Skeleton className="h-64" />
        ) : appointmentsData && appointmentsData.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-forest">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                  {appointmentsData.map((appt) => {
                    const { date, time } = formatAppointmentDateTime(appt.dateTime);
                    const IconComponent = iconMap[appt.icon as keyof typeof iconMap] || iconMap.Default;
                    return (
                      <div key={appt.id} className="flex items-center justify-between p-4 bg-sage-light/10 rounded-lg">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-sage/20 rounded-full flex items-center justify-center mr-4">
                            <IconComponent className="h-6 w-6 text-forest" />
                  </div>
                  <div>
                            <p className="font-medium">{appt.title}</p>
                            <p className="text-sm text-muted-foreground">{appt.doctorName}</p>
                  </div>
                </div>
                <div className="text-right">
                          <p className="font-medium">{date}</p>
                          <p className="text-sm text-muted-foreground">{time}</p>
                </div>
              </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
           !isErrorAppointments && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-forest">Upcoming Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">No upcoming appointments scheduled.</p>
          </CardContent>
        </Card>
              </motion.div>
           )
        )
      }

        {/* AI Chat Integration - Add this section before the end of the container div */}
        <div ref={chatRef} id="ai-chat" className="mt-8 scroll-mt-24">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-xl font-semibold text-forest flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                AI Health Assistant
              </CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setMinimizeChat(!minimizeChat)}
                  className="h-8 w-8 p-0"
                >
                  {minimizeChat ? <MaximizeIcon className="h-4 w-4" /> : <MinimizeIcon className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowChat(false)}
                  className="h-8 w-8 p-0"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            {showChat && !minimizeChat && (
              <CardContent className="p-0">
                <div className="h-[600px]">
                  <AIChat floatingMode={false} initiallyOpen={true} />
                </div>
              </CardContent>
            )}
            {showChat && minimizeChat && (
              <CardContent className="p-4">
                <div className="text-center text-muted-foreground">
                  <p>Chat is minimized. Click the maximize button to expand.</p>
                </div>
              </CardContent>
            )}
            {!showChat && (
              <CardContent className="p-6">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-forest/40 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">AI Health Assistant</h3>
                  <p className="text-muted-foreground mb-4">
                    Get instant answers to your health questions, medication information, 
                    and personalized wellness advice.
                  </p>
                  <Button onClick={() => setShowChat(true)} className="bg-forest hover:bg-forest-dark text-white">
                    Start Chat
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
