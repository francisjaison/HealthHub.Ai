
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Send, PaperclipIcon, Plus, ChevronRight } from "lucide-react";

const Chat = () => {
  const [message, setMessage] = useState("");

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the message
    setMessage("");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-forest mb-6">Health Consultation</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-forest">Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    New Consultation
                  </Button>
                  
                  {[
                    { name: "Dr. Emily Chen", active: true, time: "2m ago", unread: 3 },
                    { name: "Dr. Robert Johnson", active: false, time: "1h ago", unread: 0 },
                    { name: "Dr. Sarah Williams", active: false, time: "3d ago", unread: 0 },
                  ].map((chat, index) => (
                    <Button 
                      key={index}
                      variant={chat.active ? "default" : "ghost"}
                      className="w-full justify-start"
                    >
                      <div className="flex items-center w-full">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={`https://i.pravatar.cc/150?img=${index + 20}`} />
                          <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow text-left">
                          <p className="text-sm font-medium truncate">{chat.name}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-muted-foreground">{chat.time}</span>
                          {chat.unread > 0 && (
                            <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-forest text-[10px] text-white font-medium">
                              {chat.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Chat Area */}
          <div className="md:col-span-3">
            <Card className="flex flex-col h-[600px]">
              <CardHeader className="border-b">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="https://i.pravatar.cc/150?img=20" />
                    <AvatarFallback>EC</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-md">Dr. Emily Chen</CardTitle>
                    <p className="text-xs text-muted-foreground">General Practitioner • Online</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow overflow-auto p-4">
                <div className="space-y-4">
                  {[
                    { sender: "doctor", text: "Hello! How can I help you today?", time: "10:03 AM" },
                    { sender: "user", text: "Hi Dr. Chen, I've been experiencing some mild headaches for the past week, usually in the afternoon.", time: "10:05 AM" },
                    { sender: "doctor", text: "I understand. Have you noticed any triggers for these headaches? For example, are they related to screen time, stress, or certain foods?", time: "10:07 AM" },
                    { sender: "user", text: "I think they might be related to screen time. I've been working longer hours lately.", time: "10:08 AM" },
                    { sender: "doctor", text: "That could definitely be a factor. Let's discuss some strategies to manage this. First, are you taking regular breaks from screens? The 20-20-20 rule can be helpful - every 20 minutes, look at something 20 feet away for 20 seconds.", time: "10:10 AM" },
                  ].map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-lg p-3 ${
                        msg.sender === 'user' 
                          ? 'bg-forest text-white' 
                          : 'bg-sage-light/20'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                        }`}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="p-4 border-t">
                <form onSubmit={sendMessage} className="flex items-center">
                  <Button type="button" variant="ghost" size="icon" className="h-10 w-10">
                    <PaperclipIcon className="h-5 w-5" />
                  </Button>
                  <Input 
                    placeholder="Type your message..." 
                    className="flex-grow mx-2" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Button type="submit" size="icon" className="h-10 w-10">
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-forest">Available Specialists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "Dr. Michael Brown", specialty: "Cardiologist", available: "Available Today" },
                  { name: "Dr. Jessica Lee", specialty: "Dermatologist", available: "Next Available: Tomorrow" },
                  { name: "Dr. David Kim", specialty: "Nutritionist", available: "Available Today" }
                ].map((doctor, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Avatar className="h-12 w-12 mr-3">
                          <AvatarImage src={`https://i.pravatar.cc/150?img=${index + 30}`} />
                          <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        </div>
                      </div>
                      <p className="text-sm text-green-600 mb-4">{doctor.available}</p>
                      <Button variant="outline" className="w-full">
                        Book Consultation
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
