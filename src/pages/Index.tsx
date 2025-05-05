
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Icons for features
  const FeatureIcons = {
    RiskPredictor: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    WorkoutCoach: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    DietPlanner: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2" />
        <path d="M18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
        <path d="M18 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      </svg>
    ),
    HealthChat: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    OCRScanner: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    HealthRecords: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  };

  // Features data
  const features = [
    {
      id: 'risk-predictor',
      title: 'Health Risk Predictor',
      description: 'Get personalized health risk assessments using advanced AI algorithms and visualize your results with SHAP charts.',
      icon: FeatureIcons.RiskPredictor,
      link: '/risk',
    },
    {
      id: 'workout-coach',
      title: 'AI Workout Coach',
      description: 'Receive real-time form correction and personalized workout plans tailored to your fitness goals and abilities.',
      icon: FeatureIcons.WorkoutCoach,
      link: '/trainer',
    },
    {
      id: 'diet-planner',
      title: 'Smart Diet Planner',
      description: 'Generate customized meal plans based on your dietary preferences, restrictions, and nutritional requirements.',
      icon: FeatureIcons.DietPlanner,
      link: '/diet',
    },
    {
      id: 'health-chat',
      title: 'Health Chatbot',
      description: 'Chat with our AI-powered health assistant to get instant answers to your wellness and fitness questions.',
      icon: FeatureIcons.HealthChat,
      link: '/chat',
    },
    {
      id: 'ocr-scanner',
      title: 'OCR Prescription Scanner',
      description: 'Scan and digitize your prescriptions for easy management and automated medication scheduling.',
      icon: FeatureIcons.OCRScanner,
      link: '/ocr',
    },
    {
      id: 'health-records',
      title: 'Blockchain Health Records',
      description: 'Secure your health data with blockchain technology for immutable and verifiable health records.',
      icon: FeatureIcons.HealthRecords,
      link: '/records',
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 'testimonial-1',
      quote: "Sage Serenity's Risk Predictor helped me identify potential health issues before they became serious. The personalized recommendations were invaluable.",
      author: "Sarah Johnson",
      title: "Fitness Enthusiast",
    },
    {
      id: 'testimonial-2',
      quote: "The AI Workout Coach corrected my form instantly, helping me prevent injuries and get better results from my training sessions.",
      author: "Michael Chen",
      title: "Marathon Runner",
    },
    {
      id: 'testimonial-3',
      quote: "As someone with multiple dietary restrictions, the Diet Planner has been a game-changer. It creates delicious meal plans that meet all my nutritional needs.",
      author: "Priya Sharma",
      title: "Nutrition Specialist",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        title="Your AI-Powered Health & Wellness Partner"
        subtitle="Experience personalized health risk assessments, AI workout coaching, custom diet planning, and more—all powered by advanced AI technology."
        ctaText="Sign Up Free"
        ctaLink="/auth"
        secondaryText="View Demo"
        secondaryLink="/demo"
      />

      {/* Features Section */}
      <FeaturesSection
        title="Comprehensive Health Features"
        subtitle="Discover our suite of AI-powered tools designed to enhance your health and fitness journey."
        features={features}
      />

      {/* Testimonials Section */}
      <TestimonialsSection
        title="Success Stories"
        subtitle="See how Sage Serenity has transformed the health and wellness journeys of our users."
        testimonials={testimonials}
      />

      {/* CTA Section */}
      <CTASection
        title="Ready to transform your wellness journey?"
        subtitle="Join thousands of users who have improved their health with our AI-powered platform."
        ctaText="Get Started Today"
        ctaLink="/auth"
      />
    </Layout>
  );
};

export default Index;
