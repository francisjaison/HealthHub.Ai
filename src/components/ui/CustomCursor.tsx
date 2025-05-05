
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Set cursor visible after component mounts to prevent initial animation from wrong position
    setTimeout(() => setIsVisible(true), 500);
    
    // Check for dark mode
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Listen for dark mode changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });
    
    observer.observe(document.documentElement, {attributes: true});
    
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const handlePointerCheck = () => {
      const hoveredElement = document.elementFromPoint(position.x, position.y);
      const clickable = hoveredElement?.closest('a, button, [role="button"], input, select, textarea, label');
      setIsPointer(!!clickable);
    };
    
    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);
    
    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousemove', handlePointerCheck);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousemove', handlePointerCheck);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [position.x, position.y]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className={`fixed pointer-events-none z-50 rounded-full ${isDarkMode ? 'bg-sage-light' : 'bg-forest'} mix-blend-difference hidden md:block`}
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          scale: isActive ? 0.5 : 1,
          opacity: 1
        }}
        initial={{ opacity: 0 }}
        transition={{ 
          type: "spring", 
          damping: 40, 
          stiffness: 400,
          mass: 0.8
        }}
        style={{ 
          width: 8, 
          height: 8, 
        }}
      />
      <motion.div
        className={`fixed pointer-events-none z-40 border rounded-full hidden md:block ${
          isPointer 
            ? isDarkMode ? 'border-sage-light' : 'border-forest' 
            : 'border-white/80 mix-blend-difference'
        }`}
        animate={{
          x: position.x - 20,
          y: position.y - 20,
          scale: isActive ? 1.2 : isPointer ? 1.8 : 1,
          opacity: isPointer ? 0.7 : 0.3,
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 150, 
          mass: 0.5 
        }}
        style={{ 
          width: 40, 
          height: 40, 
          borderWidth: isPointer ? 1.5 : 1,
        }}
      />
      {isPointer && (
        <motion.div
          className={`fixed pointer-events-none z-45 ${isDarkMode ? 'text-sage-light' : 'text-forest'} text-xs font-semibold hidden md:block`}
          animate={{
            x: position.x,
            y: position.y + 30,
            opacity: 0.8,
          }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          click
        </motion.div>
      )}
    </>
  );
};

export default CustomCursor;
