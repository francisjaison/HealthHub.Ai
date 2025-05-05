
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Award, Users, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const teamMembers = [
  {
    name: "Dr. Sarah Johnson",
    role: "Founder & Medical Director",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "Michael Chen",
    role: "Chief Technology Officer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "Emily Rodriguez",
    role: "AI Research Lead",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "David Patel",
    role: "Data Science Engineer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "Zoe Williams",
    role: "UX/UI Designer",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "James Wilson",
    role: "Healthcare Advisor",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
];

const features = [
  {
    title: "AI-Powered Analysis",
    description: "Our advanced machine learning algorithms analyze your health data to provide personalized insights and recommendations.",
    icon: <Award className="w-6 h-6" />,
  },
  {
    title: "Secure & Private",
    description: "Your health data is encrypted and protected with enterprise-grade security measures to ensure your privacy.",
    icon: <CheckCircle className="w-6 h-6" />,
  },
  {
    title: "Doctor Verified",
    description: "All our health recommendations are reviewed by licensed medical professionals for accuracy and reliability.",
    icon: <Users className="w-6 h-6" />,
  },
];

const About = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Banner */}
        <motion.div 
          className="relative rounded-2xl overflow-hidden mb-16 bg-sage/10 dark:bg-forest/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-sage/40 to-transparent dark:from-forest/60" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center p-8 lg:p-16">
            <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
              <h1 className="text-3xl lg:text-5xl font-bold text-forest dark:text-cream mb-4">
                Transforming Healthcare with AI
              </h1>
              <p className="text-lg text-forest-dark dark:text-cream/90 mb-6">
                HealthHub.Ai combines cutting-edge artificial intelligence with medical expertise to provide personalized healthcare insights and recommendations.
              </p>
              <div className="flex gap-4">
                <Button variant="default" className="bg-forest hover:bg-forest-dark text-cream">
                  Learn More
                </Button>
                <Button variant="outline" className="border-forest text-forest hover:bg-forest/10 dark:border-cream dark:text-cream">
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                alt="Healthcare team" 
                className="rounded-xl shadow-lg w-full h-auto object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Our Mission Section */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="h-14 w-14 rounded-full bg-sage/15 flex items-center justify-center mr-4">
              <Award className="h-8 w-8 text-forest dark:text-cream" />
            </div>
            <h2 className="text-3xl font-bold text-forest dark:text-cream">Our Mission</h2>
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-muted-foreground mb-6">
              At HealthHub.Ai, we believe that technology can transform healthcare by making it more accessible, personalized, and proactive. Our mission is to empower individuals to take control of their health through AI-driven insights and evidence-based recommendations.
            </p>
            <p className="text-lg text-muted-foreground">
              By combining the expertise of medical professionals with cutting-edge machine learning algorithms, we aim to democratize access to high-quality healthcare information and support individuals in making informed decisions about their wellbeing.
            </p>
          </div>
        </motion.section>

        {/* Meet the Team Section */}
        <motion.section 
          className="mb-20"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          <h2 className="text-3xl font-bold text-center text-forest dark:text-cream mb-12 flex items-center justify-center">
            <Users className="mr-3 h-8 w-8" />
            Meet the Team
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-4 border-2 border-sage">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium text-forest dark:text-cream">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why HealthHub.Ai Section */}
        <motion.section 
          className="mb-20"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          <h2 className="text-3xl font-bold text-center text-forest dark:text-cream mb-12 flex items-center justify-center">
            <CheckCircle className="mr-3 h-8 w-8" />
            Why HealthHub.Ai?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-md"
              >
                <div className="h-12 w-12 rounded-lg bg-sage/15 flex items-center justify-center text-forest dark:text-cream mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-forest dark:text-cream">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="rounded-2xl bg-gradient-to-r from-forest to-forest-dark text-cream p-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Be part of the healthcare revolution. Sign up today to experience the future of personalized health insights powered by AI.
          </p>
          <Link to="/signup">
            <Button className="bg-cream hover:bg-cream/90 text-forest text-lg px-8 py-6 h-auto rounded-full flex items-center">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.section>
      </div>
    </Layout>
  );
};

export default About;
