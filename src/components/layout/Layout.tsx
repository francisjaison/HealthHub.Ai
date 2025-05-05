
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import CustomCursor from '@/components/ui/CustomCursor';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for user preference in localStorage or system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [mounted, setMounted] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply dark mode class to html element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);
  
  // Handle mount state for animations
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <AnimatePresence mode="wait">
        <motion.main 
          className="flex-grow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.5, 
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CustomCursor />
      <Toaster />
      
      {/* Enhanced background decorative elements with better contrast for both modes */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-sage/10 to-transparent opacity-80 dark:from-forest/20"></div>
        
        {/* Light floating orbs with improved contrast for both light and dark modes */}
        <motion.div 
          className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-cream dark:bg-sage/30 opacity-30 blur-3xl dark:opacity-40"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3],
            y: [0, -15, 0] 
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        
        <motion.div 
          className="absolute bottom-40 right-1/4 w-96 h-96 rounded-full bg-sage/30 dark:bg-cream/20 opacity-20 blur-3xl dark:opacity-30"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
            y: [0, 20, 0] 
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2 
          }}
        />
        
        {/* Additional animated element with better visibility in both modes */}
        <motion.div 
          className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full bg-lilac/20 dark:bg-forest-light/30 opacity-30 blur-3xl dark:opacity-50"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0] 
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5 
          }}
        />
        
        {/* Moving gradient mesh for subtle background texture - more visible in both modes */}
        <div className="absolute inset-0 opacity-10 bg-grid dark:opacity-15"></div>
      </div>
    </div>
  );
};

export default Layout;
