import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, BrainCircuit } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

// Define the API key
const API_KEY = 'AIzaSyAu4GFDGSwt_wRtLX59oZecm3RUMzhczAo';
const MODEL = 'gemini-2.0-flash';

// Define message type
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChatbot = () => {
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
          content: 'Hello! I\'m your health assistant powered by Gemini AI. How can I help you today? You can ask me about nutrition, exercise recommendations, general health questions, or wellness advice.',
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

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

  const getExampleQuestions = () => [
    "What's a good exercise routine for beginners?",
    "How can I improve my sleep quality?",
    "What are some healthy breakfast options?",
    "Can you suggest stretches for lower back pain?",
    "What nutrients am I missing if I'm always tired?",
    "How much water should I drink daily?"
  ];

  const handleExampleClick = (question: string) => {
    setInput(question);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-center text-forest mb-4">Health Assistant AI</h1>
            <p className="text-lg text-center text-muted-foreground max-w-2xl">
              Powered by Google Gemini AI, your personal health companion is ready to answer 
              your questions and provide guidance on your wellness journey.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with example questions */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-forest flex items-center">
                  <BrainCircuit className="mr-2 h-5 w-5" />
                  Example Questions
                </CardTitle>
                <CardDescription>
                  Click on any question to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getExampleQuestions().map((question, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className="w-full justify-start text-left h-auto py-2 font-normal text-sm"
                      onClick={() => handleExampleClick(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main chat area */}
          <div className="lg:col-span-3">
            <Card className="shadow-md border-sage/20">
              <CardHeader className="bg-forest text-white border-b border-forest-dark/20">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3 border-2 border-white/20">
                    <AvatarImage src="/favicon.ico" />
                    <AvatarFallback className="bg-sage text-white">AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">Health Assistant</CardTitle>
                    <p className="text-xs text-white/70">Powered by Google Gemini AI</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="h-[500px] overflow-y-auto p-6 bg-sage-light/5">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                          <AvatarImage src="/favicon.ico" />
                          <AvatarFallback className="bg-forest text-white">AI</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={`max-w-[85%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-forest text-white ml-2'
                            : 'bg-white dark:bg-slate-800 border border-sage/20 shadow-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                        }`}>{formatTime(message.timestamp)}</p>
                      </div>
                      
                      {message.role === 'user' && (
                        <Avatar className="h-8 w-8 ml-2 mt-1 flex-shrink-0">
                          <AvatarFallback className="bg-sage-light text-forest">You</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start mb-4">
                      <Avatar className="h-8 w-8 mr-2 mt-1">
                        <AvatarImage src="/favicon.ico" />
                        <AvatarFallback className="bg-forest text-white">AI</AvatarFallback>
                      </Avatar>
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
              
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <Input 
                    type="text"
                    placeholder="Type your health question here..."
                    value={input}
                    onChange={handleInputChange}
                    className="flex-grow"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    className="bg-forest hover:bg-forest-dark text-white px-4" 
                    disabled={isLoading || !input.trim()}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Send
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIChatbot; 