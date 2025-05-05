
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ChevronUp, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const Terms = () => {
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
            <FileText className="h-10 w-10 text-forest dark:text-cream" />
            <h1 className="text-4xl font-bold text-forest dark:text-cream text-center">
              Terms of Service
            </h1>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-sm border border-border mb-8">
            <p className="text-muted-foreground mb-6">
              Last updated: May 1, 2025
            </p>

            <div className="prose prose-slate dark:prose-invert max-w-none">
              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-forest dark:text-cream mb-4">
                  1. Introduction
                </h2>
                <p className="mb-4 text-muted-foreground">
                  Welcome to HealthHub.Ai ("we," "our," or "us"). By accessing
                  or using our website, mobile application, and services
                  (collectively, the "Services"), you agree to be bound by these
                  Terms of Service ("Terms"). If you do not agree to these Terms,
                  you may not access or use the Services.
                </p>
                <p className="text-muted-foreground">
                  Please read these Terms carefully. They govern your use of our
                  Services and contain important information about your legal
                  rights, remedies, and obligations. By using our Services, you
                  acknowledge that you have read and understood these Terms and
                  agree to be bound by them.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-forest dark:text-cream mb-4">
                  2. User Responsibilities
                </h2>
                <p className="mb-4 text-muted-foreground">
                  By using our Services, you agree to:
                </p>
                <ol className="list-decimal pl-6 mb-4 space-y-2 text-muted-foreground">
                  <li>
                    Provide accurate, truthful, and complete information when
                    creating an account or using our Services.
                  </li>
                  <li>
                    Maintain the security and confidentiality of your account
                    credentials and notify us immediately of any unauthorized
                    access.
                  </li>
                  <li>
                    Use our Services only for lawful purposes and in accordance
                    with these Terms.
                  </li>
                  <li>
                    Not use our Services in any way that could damage, disable,
                    overburden, or impair our systems.
                  </li>
                  <li>
                    Not attempt to access any portion of our Services through
                    unauthorized means.
                  </li>
                  <li>
                    Not use our Services for illegal, fraudulent, or
                    unauthorized purposes.
                  </li>
                  <li>
                    Not interfere with or disrupt the integrity or performance of
                    our Services or third-party data contained therein.
                  </li>
                </ol>
                <p className="mb-4 text-muted-foreground">
                  <strong className="text-forest dark:text-cream">Medical Disclaimer:</strong> Our Services do not provide medical advice, diagnosis, or treatment. The health information provided through our Services is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-forest dark:text-cream mb-4">
                  3. Intellectual Property
                </h2>
                <p className="mb-4 text-muted-foreground">
                  Unless otherwise indicated, our Services and all content and
                  materials therein, including, without limitation, our logo,
                  designs, text, graphics, pictures, information, data, software,
                  sound files, other files, and their selection and arrangement
                  (collectively, "Content"), are the proprietary property of
                  HealthHub.Ai or our licensors and are protected by U.S. and
                  international copyright laws.
                </p>
                <p className="mb-4 text-muted-foreground">
                  We grant you a limited, non-transferable, non-sublicensable,
                  revocable license to access and use our Services and Content
                  for personal, non-commercial purposes only, subject to these
                  Terms.
                </p>
                <p className="text-muted-foreground">
                  You may not: (i) modify, copy, distribute, transmit, display,
                  perform, reproduce, publish, license, create derivative works
                  from, transfer, or sell any Content; (ii) use any Content for
                  commercial purposes; (iii) decompile, reverse engineer, or
                  disassemble our Services or Content; (iv) remove any copyright
                  or proprietary notices from our Services or Content; or (v) use
                  our Services or Content in any way not expressly permitted by
                  these Terms.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-forest dark:text-cream mb-4">
                  4. Limitation of Liability
                </h2>
                <p className="mb-4 text-muted-foreground">
                  To the maximum extent permitted by applicable law,
                  HealthHub.Ai and its officers, directors, employees, agents,
                  affiliates, and partners shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages, or
                  any loss of profits or revenues, whether incurred directly or
                  indirectly, or any loss of data, use, goodwill, or other
                  intangible losses, resulting from:
                </p>
                <ol className="list-decimal pl-6 mb-4 space-y-2 text-muted-foreground">
                  <li>
                    Your access to, use of, or inability to access or use our
                    Services;
                  </li>
                  <li>
                    Any conduct or content of any third party on our Services;
                  </li>
                  <li>
                    Any content obtained from our Services; or
                  </li>
                  <li>
                    Unauthorized access, use, or alteration of your
                    transmissions or content.
                  </li>
                </ol>
                <p className="text-muted-foreground">
                  In no event shall our total liability to you for all claims
                  arising out of or relating to the use of our Services exceed
                  the amount paid by you, if any, for accessing our Services
                  during the twelve (12) months immediately preceding the date
                  of the claim.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-forest dark:text-cream mb-4">
                  5. Contact Information
                </h2>
                <p className="mb-4 text-muted-foreground">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className="mb-4 text-muted-foreground">
                  <p>HealthHub.Ai, Inc.</p>
                  <p>123 AI Boulevard</p>
                  <p>San Francisco, CA 94103</p>
                  <p>United States</p>
                </div>
                <p className="text-muted-foreground">
                  Email: <a href="mailto:legal@healthhub.ai" className="text-forest dark:text-cream hover:underline">legal@healthhub.ai</a>
                </p>
              </section>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-12">
            <p>By using HealthHub.Ai's services, you acknowledge that you have read, understood, and agree to these Terms of Service.</p>
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

export default Terms;
