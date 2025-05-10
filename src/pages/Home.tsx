import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  HeartPulse, 
  Brain, 
  Activity, 
  Dumbbell, 
  Salad, 
  FileText,
  BarChart4,
  CircleUser,
  MessageSquare,
  Star,
  ChevronRight,
  UserIcon
} from "lucide-react";

// Define Testimonial data outside the component
const testimonials = [
  {
    quote: "The risk assessment feature was eye-opening! It helped me make proactive changes to my lifestyle.",
    author: "Sarah L.",
    role: "Busy Professional",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    quote: "I finally feel in control of my fitness journey thanks to the AI coach. The personalized plans are amazing.",
    author: "Michael B.",
    role: "Fitness Enthusiast",
    image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    quote: "Managing my diet has never been easier. The meal planner understands my needs perfectly.",
    author: "Jessica P.",
    role: "Health Conscious Eater",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <Layout>
      {/* Hero Section with enhanced background */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
        {/* Improved animated background with multiple layers */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sage/5 via-cream/10 to-background">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM0RDVENTMiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTZWMGg2djMwem0wIDMwaC02VjQyaDZ2MTh6Ii8+PHBhdGggZD0iTTMwIDMwVjBoNnYzMGgtNnoiIHRyYW5zZm9ybT0icm90YXRlKDkwIDE4IDE1KSIvPjwvZz48L2c+PC9zdmc+')]"></div>
          
          {/* Improved animated shapes with better positioning and effects */}
          <div className="absolute top-1/6 left-1/5 w-72 h-72 rounded-full bg-gradient-to-br from-forest/10 to-sage/20 opacity-30 blur-3xl animate-pulse" 
               style={{ animationDuration: '15s' }}></div>
          <div className="absolute bottom-1/4 right-1/5 w-80 h-80 rounded-full bg-gradient-to-tr from-sage/20 to-cream/30 opacity-30 blur-3xl animate-pulse" 
               style={{ animationDuration: '18s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full bg-gradient-to-bl from-lilac/15 to-forest/10 opacity-30 blur-3xl animate-pulse" 
               style={{ animationDuration: '12s' }}></div>
          
          {/* Additional animated elements */}
          <motion.div 
            className="absolute left-[15%] top-[20%] w-2 h-2 rounded-full bg-forest/40"
            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute right-[25%] top-[30%] w-3 h-3 rounded-full bg-sage/50"
            animate={{ scale: [1, 1.8, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div 
            className="absolute left-[40%] bottom-[20%] w-2 h-2 rounded-full bg-cream/60"
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          
          {/* Subtle gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50"></div>
        </div>
        
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
            {/* Hero content - Left side */}
            <motion.div 
              className="lg:col-span-3 space-y-6 text-center lg:text-left"
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              <motion.span 
                variants={fadeInUp}
                className="inline-block py-1.5 px-4 rounded-full bg-gradient-to-r from-forest/20 to-forest/10 text-forest font-medium text-sm backdrop-blur-sm shadow-sm"
              >
                Health Reimagined with AI
              </motion.span>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-forest tracking-tight leading-tight"
              >
                Your Complete <br className="hidden md:inline" />
                <span className="relative">
                  <span className="relative z-10">AI-Powered</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-gradient-to-r from-sage/50 to-sage/20 -z-10 rounded-sm"></span>
                </span> <br className="hidden md:inline" />
                Health Partner
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0"
              >
                Experience personalized care through advanced AI that predicts health risks, 
                coaches your workouts, plans your meals, and securely manages your records.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp}
                className="flex flex-wrap gap-4 justify-center lg:justify-start"
              >
                <Link to="/signup">
                  <Button 
                    size="lg" 
                    className="group bg-gradient-to-r from-forest to-forest-dark text-white font-medium transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/risk">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-forest text-forest hover:bg-forest/5 font-medium backdrop-blur-sm shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                  >
                    Explore Features
                  </Button>
                </Link>
              </motion.div>
              
              {/* Trust indicators - Refined with better styling */}
              <motion.div 
                variants={fadeInUp}
                className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start text-muted-foreground space-y-2 sm:space-y-0 sm:space-x-4"
              >
                {/* Avatar Group */}
                <div className="flex items-center">
                  <div className="flex -space-x-2 overflow-hidden">
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover shadow-md" src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User 1"/>
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover shadow-md" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User 2"/>
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover shadow-md" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User 3"/>
                    <div className="inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-gradient-to-br from-forest to-forest-dark text-xs font-medium text-white shadow-md">+5k</div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-600 dark:text-gray-400">Join 5,000+ users</span>
                </div>
                {/* Separator */}
                <span className="hidden sm:inline-block text-gray-300 dark:text-gray-700">|</span>
                {/* Rating */}
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400 mr-1" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">4.8</span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">(250+ reviews)</span>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Hero visual - Right side with improved styling */}
            <motion.div 
              className="lg:col-span-2 relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative h-[400px] md:h-[500px]">
                {/* Main visual frame with improved styling */}
                <motion.div 
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/80 to-cream/40 dark:from-slate-800/80 dark:to-slate-900/40 backdrop-blur-md p-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 dark:border-slate-700/20 overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="absolute top-2 left-4 flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  
                  {/* Visual content - App preview mockup */}
                  <div className="w-full h-full mt-4 rounded-lg bg-white/90 dark:bg-slate-800/90 shadow-inner overflow-hidden flex flex-col">
                    <div className="h-16 border-b flex items-center px-4">
                      <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center mr-3">
                        <HeartPulse className="h-4 w-4 text-forest" />
                      </div>
                      <div>
                        <div className="h-4 w-32 bg-forest/20 rounded-full"></div>
                        <div className="h-3 w-24 bg-forest/10 rounded-full mt-1"></div>
                      </div>
                    </div>
                    
                    {/* Animate grid items */}
                    <motion.div 
                      className="flex-1 p-4 grid grid-cols-2 gap-3"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {[
                        { icon: <HeartPulse className="h-5 w-5" />, color: "bg-gradient-to-br from-red-100 to-red-50 text-red-500 dark:from-red-900/30 dark:to-red-800/20 dark:text-red-400" },
                        { icon: <Brain className="h-5 w-5" />, color: "bg-gradient-to-br from-purple-100 to-purple-50 text-purple-500 dark:from-purple-900/30 dark:to-purple-800/20 dark:text-purple-400" },
                        { icon: <Activity className="h-5 w-5" />, color: "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-500 dark:from-blue-900/30 dark:to-blue-800/20 dark:text-blue-400" },
                        { icon: <Dumbbell className="h-5 w-5" />, color: "bg-gradient-to-br from-amber-100 to-amber-50 text-amber-500 dark:from-amber-900/30 dark:to-amber-800/20 dark:text-amber-400" },
                      ].map((item, i) => (
                        <motion.div 
                          key={i}
                          className="rounded-lg bg-white dark:bg-slate-700/50 shadow-sm border border-gray-100 dark:border-slate-600/10 p-3 flex flex-col justify-between"
                          variants={itemVariants}
                          whileHover={{ scale: 1.05, y: -5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        >
                          <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center mb-2 shadow-sm`}>
                            {item.icon}
                          </div>
                          <div className="space-y-1.5">
                            <div className="h-3 w-full bg-gray-100 dark:bg-slate-600/30 rounded-full"></div>
                            <div className="h-3 w-2/3 bg-gray-100 dark:bg-slate-600/30 rounded-full"></div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                    
                    <div className="h-16 border-t flex items-center justify-around px-4">
                      {[HeartPulse, Activity, CircleUser, MessageSquare].map((Icon, i) => (
                        <div key={i} className={`w-10 h-10 rounded-full ${i === 0 ? 'bg-forest/10' : 'bg-transparent'} flex items-center justify-center`}>
                          <Icon className={`h-5 w-5 ${i === 0 ? 'text-forest' : 'text-gray-400'}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
                
                {/* Floating elements with improved styling */}
                <motion.div 
                  className="absolute -right-6 top-1/4 p-3 rounded-lg bg-white shadow-xl border border-white/50 backdrop-blur-sm"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                  <BarChart4 className="h-5 w-5 text-forest" />
                </motion.div>
                <motion.div 
                  className="absolute -left-8 top-1/2 p-3 rounded-lg bg-white shadow-xl border border-white/50 backdrop-blur-sm"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                >
                  <FileText className="h-5 w-5 text-forest" />
                </motion.div>
                <motion.div 
                  className="absolute -bottom-4 left-1/3 p-3 rounded-lg bg-white shadow-xl border border-white/50 backdrop-blur-sm"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                >
                  <Salad className="h-5 w-5 text-forest" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section with improved styling */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Subtle background pattern for this section */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-sage/5 to-background opacity-60"></div>
        <div className="absolute inset-0 -z-10 opacity-[0.15] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMzBhMSAxIDAgMSAxIDAgMiAxIDEgMCAwIDEgMC0yem0xMCAwYTEgMSAwIDEgMSAwIDIgMSAxIDAgMCAxIDAtMnptLTIwIDBhMSAxIDAgMSAxIDAgMiAxIDEgMCAwIDEgMC0yem0xMCAxMGExIDEgMCAxIDEgMCAyIDEgMSAwIDAgMSAwLTJ6bS0xMC0yMGExIDEgMCAxIDEgMCAyIDEgMSAwIDAgMSAwLTJ6bTIwIDBhMSAxIDAgMSAxIDAgMiAxIDEgMCAwIDEgMC0yem0tMTAgMjBhMSAxIDAgMSAxIDAgMiAxIDEgMCAwIDEgMC0yem0xMC0xMGExIDEgMCAxIDEgMCAyIDEgMSAwIDAgMSAwLTJ6bS0yMCAwYTEgMSAwIDEgMSAwIDIgMSAxIDAgMCAxIDAtMnoiIGZpbGw9IiM0RDVENTMiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')]"></div>
        
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-forest mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              Comprehensive Health Features
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Experience our suite of AI-powered tools designed to revolutionize your health journey
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              {
                icon: <Activity className="h-6 w-6" />,
                title: "Health Risk Assessment",
                description: "AI-powered analysis of your health metrics to predict and prevent potential issues",
                link: "/risk",
                color: "from-red-50 to-pink-50 border-red-100/50 hover:border-red-200",
                iconBg: "bg-red-100/80 text-red-600"
              },
              {
                icon: <Dumbbell className="h-6 w-6" />,
                title: "AI Workout Coach",
                description: "Personalized training plans with real-time form correction and feedback",
                link: "/trainer",
                color: "from-amber-50 to-orange-50 border-amber-100/50 hover:border-amber-200",
                iconBg: "bg-amber-100/80 text-amber-600"
              },
              {
                icon: <Salad className="h-6 w-6" />,
                title: "Smart Diet Planner",
                description: "Customized meal plans based on your preferences and nutritional needs",
                link: "/diet",
                color: "from-green-50 to-emerald-50 border-green-100/50 hover:border-green-200",
                iconBg: "bg-green-100/80 text-green-600"
              },
              {
                icon: <MessageSquare className="h-6 w-6" />,
                title: "Health Chatbot",
                description: "Instant answers to your wellness and fitness questions from our AI assistant",
                link: "/chat",
                color: "from-blue-50 to-sky-50 border-blue-100/50 hover:border-blue-200",
                iconBg: "bg-blue-100/80 text-blue-600"
              },
              {
                icon: <FileText className="h-6 w-6" />,
                title: "OCR Prescription Scanner",
                description: "Digitize your prescriptions for easy management and automated scheduling",
                link: "/ocr",
                color: "from-indigo-50 to-violet-50 border-indigo-100/50 hover:border-indigo-200",
                iconBg: "bg-indigo-100/80 text-indigo-600"
              },
              {
                icon: <Brain className="h-6 w-6" />,
                title: "Disease Predictor",
                description: "Advanced disease risk assessment using cutting-edge machine learning models",
                link: "/disease-predictor",
                color: "from-purple-50 to-pink-50 border-purple-100/50 hover:border-purple-200",
                iconBg: "bg-purple-100/80 text-purple-600"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`group rounded-xl bg-gradient-to-br ${feature.color} border p-6 shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <div className={`${feature.iconBg} h-12 w-12 rounded-lg flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-forest">{feature.title}</h3>
                <p className="mb-4 text-muted-foreground">{feature.description}</p>
                <Link to={feature.link} className="inline-flex items-center text-sm font-medium text-forest group-hover:text-forest-dark">
                  Explore 
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* How It Works Section */}
          <section className="py-20 px-4 bg-gradient-to-b from-sage/5 to-background">
            <div className="container mx-auto max-w-5xl">
              <div className="text-center mb-16">
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold text-forest mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  Getting Started is Easy
                </motion.h2>
                <motion.p 
                  className="text-lg text-muted-foreground max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Follow these simple steps to unlock personalized health insights.
                </motion.p>
              </div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                {/* Step 1 */}
                <motion.div variants={fadeInUp} >
                  <motion.div 
                    className="flex flex-col items-center text-center p-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-full transition-shadow duration-300"
                    whileHover={{ y: -8, scale: 1.03, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"}}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                   >
                    <div className="relative mb-5"> {/* Increased bottom margin */}
                      {/* Main number circle */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-forest to-forest-dark text-white flex items-center justify-center text-2xl font-bold shadow-lg mb-4">
                        1
                      </div>
                      {/* Icon overlay - slightly larger, better bg */}
                      <div className="absolute -bottom-3 right-0 p-2.5 bg-cream dark:bg-slate-700 rounded-full shadow-md border-2 border-white dark:border-slate-800">
                        <UserIcon className="h-5 w-5 text-forest dark:text-sage-light" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-forest dark:text-sage-light mb-2">Create Account</h3>
                    <p className="text-muted-foreground text-sm px-2 flex-grow"> {/* Added flex-grow */}
                      Sign up quickly and securely using your email or social accounts.
                    </p>
                  </motion.div>
                </motion.div>

                {/* Step 2 */}
                <motion.div variants={fadeInUp} >
                   <motion.div 
                     className="flex flex-col items-center text-center p-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-full transition-shadow duration-300"
                     whileHover={{ y: -8, scale: 1.03, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"}}
                     transition={{ type: "spring", stiffness: 300, damping: 15 }}
                   >
                    <div className="relative mb-5">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-forest to-forest-dark text-white flex items-center justify-center text-2xl font-bold shadow-lg mb-4">
                        2
                      </div>
                      <div className="absolute -bottom-3 right-0 p-2.5 bg-cream dark:bg-slate-700 rounded-full shadow-md border-2 border-white dark:border-slate-800">
                        <FileText className="h-5 w-5 text-forest dark:text-sage-light" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-forest dark:text-sage-light mb-2">Input Your Data</h3>
                    <p className="text-muted-foreground text-sm px-2 flex-grow">
                      Complete your health profile, connect devices, or upload records.
                    </p>
                  </motion.div>
                </motion.div>

                {/* Step 3 */}
                <motion.div variants={fadeInUp} >
                   <motion.div 
                     className="flex flex-col items-center text-center p-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-full transition-shadow duration-300"
                     whileHover={{ y: -8, scale: 1.03, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"}}
                     transition={{ type: "spring", stiffness: 300, damping: 15 }}
                   >
                     <div className="relative mb-5">
                       <div className="w-16 h-16 rounded-full bg-gradient-to-br from-forest to-forest-dark text-white flex items-center justify-center text-2xl font-bold shadow-lg mb-4">
                         3
                       </div>
                       <div className="absolute -bottom-3 right-0 p-2.5 bg-cream dark:bg-slate-700 rounded-full shadow-md border-2 border-white dark:border-slate-800">
                         <Brain className="h-5 w-5 text-forest dark:text-sage-light" />
                       </div>
                     </div>
                     <h3 className="text-xl font-semibold text-forest dark:text-sage-light mb-2">Receive Insights</h3>
                     <p className="text-muted-foreground text-sm px-2 flex-grow">
                       Our AI analyzes your data to provide personalized predictions and plans.
                     </p>
                   </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 px-4 bg-background">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold text-forest mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  What Our Users Say
                </motion.h2>
                <motion.p 
                  className="text-lg text-muted-foreground max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Hear from individuals who transformed their health with our AI partner.
                </motion.p>
              </div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {testimonials.map((testimonial, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden p-6 border border-transparent hover:border-sage/50 transition-colors"
                    variants={fadeInUp}
                  >
                    <div className="flex items-center mb-4">
                      <img className="h-12 w-12 rounded-full object-cover mr-4" src={testimonial.image} alt={testimonial.author} />
                      <div>
                        <p className="font-semibold text-forest dark:text-sage-light">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.quote}"</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="py-20 px-4 text-center">
             <div className="container mx-auto max-w-3xl">
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold text-forest mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                   Ready to take control of your health?
                </motion.h2>
                <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, margin: "-100px" }}
                   transition={{ duration: 0.6, delay: 0.1 }}
                >
                   <Link to="/signup">
                     <Button 
                       size="lg" 
                       className="group bg-forest hover:bg-forest-dark text-white font-medium transition-all duration-300 shadow-md hover:shadow-xl"
                     >
                       Sign Up for Free
                       <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                     </Button>
                   </Link>
                </motion.div>
             </div>
          </section>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
