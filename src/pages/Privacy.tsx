
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Privacy = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-12 flex items-center justify-center gap-3">
            <Shield className="h-10 w-10 text-forest dark:text-cream" />
            <h1 className="text-4xl font-bold text-forest dark:text-cream text-center">
              Privacy Policy
            </h1>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-sm border border-border mb-8">
            <p className="text-muted-foreground mb-6">
              Last updated: May 1, 2025
            </p>

            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="mb-6">
                At HealthHub.Ai, we take your privacy seriously. This Privacy
                Policy explains how we collect, use, disclose, and safeguard your
                information when you use our service.
              </p>
              
              <p className="mb-6">
                Please read this Privacy Policy carefully. By accessing or using
                our service, you acknowledge that you have read and understood
                this Privacy Policy.
              </p>
            </div>

            <Accordion type="single" collapsible className="mt-8">
              <AccordionItem value="data-collection">
                <AccordionTrigger className="text-xl font-semibold text-forest dark:text-cream">
                  Data Collection
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="mb-4">
                    We collect several types of information to provide and improve our service to you:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>
                      <strong>Personal Information:</strong> Name, email address, phone number, date of birth, gender, and health information you choose to provide.
                    </li>
                    <li>
                      <strong>Usage Information:</strong> How you interact with our service, the features you use, the time spent on our platform.
                    </li>
                    <li>
                      <strong>Device Information:</strong> Web browser, IP address, time zone, and cookies installed on your device.
                    </li>
                    <li>
                      <strong>Health Data:</strong> Information about your health conditions, medications, symptoms, and other health-related data you provide to us.
                    </li>
                  </ul>
                  <p>
                    All health data is encrypted and stored securely in compliance with healthcare privacy standards.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="data-use">
                <AccordionTrigger className="text-xl font-semibold text-forest dark:text-cream">
                  Data Use
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="mb-4">
                    We use your data for the following purposes:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>To provide and maintain our service</li>
                    <li>To personalize your experience</li>
                    <li>To improve our service and develop new features</li>
                    <li>To communicate with you about updates, support, and marketing</li>
                    <li>To analyze usage patterns and optimize our platform</li>
                    <li>To generate aggregated, anonymized insights</li>
                    <li>To comply with legal obligations</li>
                  </ul>
                  <p>
                    We do not sell your personal information to third parties. Your health data is used solely for providing you with personalized health insights and recommendations.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="third-party">
                <AccordionTrigger className="text-xl font-semibold text-forest dark:text-cream">
                  Third-Party Services
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="mb-4">
                    We may use third-party services that collect, monitor, and analyze data to help us improve our service:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>
                      <strong>Analytics Providers:</strong> We use services like Google Analytics to understand user behavior.
                    </li>
                    <li>
                      <strong>Cloud Storage Providers:</strong> We use secure cloud services to store encrypted data.
                    </li>
                    <li>
                      <strong>Authentication Providers:</strong> We may use services like Google Sign-In for account authentication.
                    </li>
                    <li>
                      <strong>Payment Processors:</strong> If applicable, we use trusted payment processors for handling transactions.
                    </li>
                  </ul>
                  <p>
                    All third-party service providers are required to maintain the confidentiality of your information and are prohibited from using it for any purpose other than providing services to us.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="your-rights">
                <AccordionTrigger className="text-xl font-semibold text-forest dark:text-cream">
                  Your Rights
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="mb-4">
                    Depending on your location, you may have certain rights regarding your personal information:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>The right to access your personal information</li>
                    <li>The right to rectify inaccurate or incomplete information</li>
                    <li>The right to delete your personal information</li>
                    <li>The right to restrict or object to processing</li>
                    <li>The right to data portability</li>
                    <li>The right to withdraw consent</li>
                  </ul>
                  <p className="mb-4">
                    To exercise any of these rights, please contact us using the information provided in the Contact section.
                  </p>
                  <p>
                    Please note that we may ask you to verify your identity before responding to such requests, and we may not be able to comply with your request in certain circumstances, such as when it would conflict with our legal obligations.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-12">
            <p>For questions about this privacy policy, please contact us at privacy@healthhub.ai</p>
          </div>
        </motion.div>
        
        {/* Back to Top Button */}
        <motion.div
          className="fixed bottom-8 right-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: showBackToTop ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-forest/80 text-cream hover:bg-forest border-forest shadow-md"
            onClick={scrollToTop}
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Privacy;
