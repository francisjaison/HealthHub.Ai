import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageSquare, X, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Define the API key
const API_KEY = 'AIzaSyAu4GFDGSwt_wRtLX59oZecm3RUMzhczAo';
const MODEL = 'gemini-2.0-flash';

// Define message type
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isNew?: boolean;
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
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // Focus input after loading
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isLoading]);

  // Initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: 'Hello! I\'m your health assistant powered by Google Gemini. How can I help you today?',
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Handle unread messages when chat is closed
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
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
      isNew: true,
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
        isNew: true,
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
      // If chat is not open, increment unread count
      if (!isOpen && floatingMode) {
        setUnreadCount(prev => prev + 1);
      }
      
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Add error message
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again later.',
        timestamp: new Date(),
        isNew: true,
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
        <CardHeader className="bg-gradient-to-r from-forest to-forest-dark text-white py-3 px-4 flex flex-row justify-between items-center">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2 border-2 border-white bg-gradient-to-br from-sage-light to-sage">
              <AvatarImage src="/favicon.ico" />
              <AvatarFallback className="bg-forest-light text-white">
                <Sparkles className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-medium">Health Assistant</CardTitle>
              <p className="text-xs text-white/80">Powered by Google Gemini</p>
            </div>
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
        
        <CardContent className="p-0 bg-gradient-to-b from-sage-light/10 to-white dark:from-slate-900/20 dark:to-slate-800">
          <div className={`${floatingMode ? 'h-[350px]' : 'h-[500px]'} overflow-y-auto p-4`}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={message.isNew ? { opacity: 0, y: 20 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 mr-2 self-end">
                    <AvatarFallback className="bg-forest text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={cn(
                    "max-w-[85%] rounded-lg p-3 shadow-sm",
                    message.role === 'user' 
                      ? "bg-gradient-to-r from-forest to-forest-dark text-white rounded-tr-none"
                      : "bg-white dark:bg-slate-800 border border-sage/20 rounded-tl-none"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={cn(
                    "text-xs mt-1",
                    message.role === 'user' ? "text-white/70" : "text-muted-foreground"
                  )}>{formatTime(message.timestamp)}</p>
                </motion.div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 ml-2 self-end">
                    <AvatarFallback className="bg-sage-dark text-white">
                      U
                    </AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start mb-3"
              >
                <Avatar className="h-8 w-8 mr-2 self-end">
                  <AvatarFallback className="bg-forest text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[85%] rounded-lg p-3 bg-white dark:bg-slate-800 border border-sage/20 shadow-sm rounded-tl-none">
                  <div className="flex items-center">
                    <div className="flex space-x-1">
                      <motion.div 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                        className="w-2 h-2 bg-forest rounded-full"
                      />
                      <motion.div 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                        className="w-2 h-2 bg-forest rounded-full"
                      />
                      <motion.div 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                        className="w-2 h-2 bg-forest rounded-full"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground ml-2">Generating response...</p>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        
        <CardFooter className="p-3 border-t bg-white dark:bg-slate-900">
          <form onSubmit={handleSendMessage} className="flex flex-col w-full gap-2">
            <div className="flex flex-wrap gap-2 mb-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs bg-sage-light/10 hover:bg-sage-light/20 border-sage/30"
                onClick={() => setInput("What's my heart rate trend?")}
              >
                💓 Heart rate trend
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs bg-sage-light/10 hover:bg-sage-light/20 border-sage/30"
                onClick={() => setInput("Give me diet tips for reducing cholesterol")}
              >
                🥗 Diet tips
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs bg-sage-light/10 hover:bg-sage-light/20 border-sage/30"
                onClick={() => setInput("What exercises help with lower back pain?")}
              >
                🏋️ Exercise advice
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs bg-sage-light/10 hover:bg-sage-light/20 border-sage/30"
                onClick={() => setInput("Explain my sleep pattern data")}
              >
                😴 Sleep insights
              </Button>
            </div>
            <div className="flex w-full gap-2">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Type your health question..."
                value={input}
                onChange={handleInputChange}
                className="flex-grow focus-visible:ring-forest dark:bg-slate-800"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="bg-gradient-to-r from-forest to-forest-dark hover:from-forest-dark hover:to-forest text-white shadow-md" 
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
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
              <Card className="border-forest-light/20 overflow-hidden rounded-xl border-2 border-forest/20">
                {chatContent}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      );
    }

    // Integrated mode
    return (
      <Card className={cn(
        "border-forest-light/20 overflow-hidden h-full rounded-xl shadow-lg border-2 border-forest/20",
        className
      )}>
        {chatContent}
      </Card>
    );
  };

  // Only show toggle button in floating mode
  return (
    <>
      {floatingMode && (
        <div className="fixed bottom-6 right-6 z-50">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={toggleChat}
              className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-forest to-forest-dark text-white hover:from-forest-dark hover:to-forest"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
            {unreadCount > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
              >
                {unreadCount}
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
      
      {(isOpen || !floatingMode) && renderChatWindow()}
    </>
  );
};

export default AIChat; 