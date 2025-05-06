import { useState } from "react";
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
  ArrowRight
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

        {/* Health Assessment Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-forest/10 to-sage/10 dark:from-forest/30 dark:to-sage/20 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-forest dark:text-sage-light">Health Assessment</CardTitle>
              <CardDescription className="dark:text-slate-300">Comprehensive analysis of your health based on your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm dark:shadow-slate-900/50">
                  <Heart className="h-8 w-8 text-red-500 dark:text-red-400 mb-2" />
                  <p className="text-sm font-medium dark:text-slate-200">Cardiovascular</p>
                  <p className="text-lg font-bold dark:text-white">72<span className="text-xs font-normal text-muted-foreground dark:text-slate-400">/100</span></p>
                </div>
                <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm dark:shadow-slate-900/50">
                  <Apple className="h-8 w-8 text-green-500 dark:text-green-400 mb-2" />
                  <p className="text-sm font-medium dark:text-slate-200">Metabolic</p>
                  <p className="text-lg font-bold dark:text-white">84<span className="text-xs font-normal text-muted-foreground dark:text-slate-400">/100</span></p>
                </div>
                <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm dark:shadow-slate-900/50">
                  <Dumbbell className="h-8 w-8 text-amber-500 dark:text-amber-400 mb-2" />
                  <p className="text-sm font-medium dark:text-slate-200">Musculoskeletal</p>
                  <p className="text-lg font-bold dark:text-white">78<span className="text-xs font-normal text-muted-foreground dark:text-slate-400">/100</span></p>
                </div>
                <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm dark:shadow-slate-900/50">
                  <Brain className="h-8 w-8 text-purple-500 dark:text-purple-400 mb-2" />
                  <p className="text-sm font-medium dark:text-slate-200">Cognitive</p>
                  <p className="text-lg font-bold dark:text-white">90<span className="text-xs font-normal text-muted-foreground dark:text-slate-400">/100</span></p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm dark:shadow-slate-900/50">
                <div>
                  <p className="text-sm font-medium dark:text-slate-200">Overall Health Score</p>
                  <p className="text-2xl font-bold text-forest dark:text-emerald-400">81<span className="text-xs font-normal text-muted-foreground dark:text-slate-400">/100</span></p>
                </div>
                <PieChart className="h-10 w-10 text-forest dark:text-emerald-400" />
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-forest hover:bg-forest/90 dark:bg-forest/80 dark:hover:bg-forest/70">
                <Link to="/health-assessment">
                  View Detailed Assessment <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

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
      </div>
    </Layout>
  );
};

export default Dashboard;
