import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';

// Define the API key
const API_KEY = 'AIzaSyAu4GFDGSwt_wRtLX59oZecm3RUMzhczAo';
const MODEL = 'gemini-2.0-flash';

// Define message type
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  floatingMode?: boolean;
  initiallyOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

const AIChat: React.FC<AIChatProps> = ({
  floatingMode = false,
  initiallyOpen = false,
  onClose,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: 'Hello! I\'m your health assistant. How can I help you today?',
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen && onClose) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Prepare conversation history for the API
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));
      
      // Add the new user message
      history.push({
        role: 'user',
        parts: [{ text: input }]
      });
      
      // Call Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: history,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });
      
      const data = await response.json();
      
      // Extract the assistant's response
      let assistantResponse = '';
      if (data.candidates && data.candidates[0]?.content?.parts) {
        assistantResponse = data.candidates[0].content.parts[0].text;
      } else {
        assistantResponse = "I'm sorry, I couldn't generate a response. Please try again.";
      }
      
      // Add assistant response to chat
      const assistantMessage: Message = {
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Add error message
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again later.',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format time for message display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render the chat window based on mode (floating or integrated)
  const renderChatWindow = () => {
    const chatContent = (
      <>
        <CardHeader className="bg-forest text-white py-3 px-4 flex flex-row justify-between items-center">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2 border-2 border-white">
              <AvatarImage src="/favicon.ico" />
              <AvatarFallback className="bg-forest-light text-white">AI</AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg font-medium">Health Assistant</CardTitle>
          </div>
          {floatingMode && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="h-8 w-8 text-white hover:bg-forest-light/20 -mr-2"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="p-0">
          <div className={`${floatingMode ? 'h-80' : 'h-[400px]'} overflow-y-auto p-4 bg-sage-light/10`}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-forest text-white'
                      : 'bg-white dark:bg-slate-800 border border-sage/20 shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                  }`}>{formatTime(message.timestamp)}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="max-w-[85%] rounded-lg p-3 bg-white dark:bg-slate-800 border border-sage/20 shadow-sm">
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2 text-forest" />
                    <p className="text-sm text-muted-foreground">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        
        <CardFooter className="p-3 border-t">
          <form onSubmit={handleSendMessage} className="flex w-full gap-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={handleInputChange}
              className="flex-grow"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="bg-forest hover:bg-forest-dark text-white" 
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardFooter>
      </>
    );

    if (floatingMode) {
      return (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 shadow-2xl rounded-xl"
            >
              <Card className="border-forest-light/20 overflow-hidden">
                {chatContent}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      );
    }

    // Integrated mode
    return (
      <Card className={`border-forest-light/20 overflow-hidden h-full ${className}`}>
        {chatContent}
      </Card>
    );
  };

  // Only show toggle button in floating mode
  return (
    <>
      {floatingMode && (
        <Button
          onClick={toggleChat}
          className="rounded-full w-14 h-14 fixed bottom-6 right-6 shadow-lg bg-forest text-white hover:bg-forest-dark z-50"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
      
      {(isOpen || !floatingMode) && renderChatWindow()}
    </>
  );
};

export default AIChat; 