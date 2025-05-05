
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock, MessageSquare, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  reason: z.string().min(1, "Please select a reason for contact"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      reason: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Message sent",
        description: "Thank you for your message. We'll get back to you soon."
      });
    }, 1500);
  };

  const resetForm = () => {
    form.reset();
    setIsSubmitted(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-forest mb-6">Contact Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-forest">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {!isSubmitted ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input placeholder="john@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="How can we help you?" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="reason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reason for Contact</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 md:grid-cols-2 gap-2"
                              >
                                <div className="flex items-center space-x-2 rounded-md border p-2">
                                  <RadioGroupItem value="customer-service" id="customer-service" />
                                  <FormLabel htmlFor="customer-service" className="font-normal cursor-pointer flex-1">
                                    Customer Service
                                  </FormLabel>
                                </div>
                                
                                <div className="flex items-center space-x-2 rounded-md border p-2">
                                  <RadioGroupItem value="technical-support" id="technical-support" />
                                  <FormLabel htmlFor="technical-support" className="font-normal cursor-pointer flex-1">
                                    Technical Support
                                  </FormLabel>
                                </div>
                                
                                <div className="flex items-center space-x-2 rounded-md border p-2">
                                  <RadioGroupItem value="billing" id="billing" />
                                  <FormLabel htmlFor="billing" className="font-normal cursor-pointer flex-1">
                                    Billing & Subscription
                                  </FormLabel>
                                </div>
                                
                                <div className="flex items-center space-x-2 rounded-md border p-2">
                                  <RadioGroupItem value="feedback" id="feedback" />
                                  <FormLabel htmlFor="feedback" className="font-normal cursor-pointer flex-1">
                                    Feedback & Suggestions
                                  </FormLabel>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please provide as much detail as possible..."
                                className="h-32 resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>Sending... <Icons.spinner className="ml-2 h-4 w-4 animate-spin" /></>
                          ) : (
                            <>Send Message <MessageSquare className="ml-2 h-4 w-4" /></>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="flex flex-col items-center py-12 text-center">
                    <div className="bg-green-100 text-green-700 rounded-full p-3 mb-4">
                      <Check className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      Your message has been successfully sent. We'll get back to you as soon as possible, usually within 24-48 hours.
                    </p>
                    <Button onClick={resetForm}>Send Another Message</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-forest">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-sage-light/20 p-2 rounded-md mr-3">
                      <Mail className="h-5 w-5 text-forest" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:support@healthhub.ai" className="text-sm text-forest hover:underline">support@healthhub.ai</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-sage-light/20 p-2 rounded-md mr-3">
                      <Phone className="h-5 w-5 text-forest" />
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href="tel:+18005551234" className="text-sm text-forest hover:underline">+1 (800) 555-1234</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-sage-light/20 p-2 rounded-md mr-3">
                      <MapPin className="h-5 w-5 text-forest" />
                    </div>
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">
                        123 Health Avenue<br />
                        Suite 456<br />
                        San Francisco, CA 94107
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-sage-light/20 p-2 rounded-md mr-3">
                      <Clock className="h-5 w-5 text-forest" />
                    </div>
                    <div>
                      <p className="font-medium">Business Hours</p>
                      <p className="text-sm text-muted-foreground">
                        Monday - Friday: 9AM - 6PM<br />
                        Saturday: 10AM - 4PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-forest">Support Channels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-sage-light/10 rounded-lg">
                    <div className="mr-3">
                      <MessageSquare className="h-5 w-5 text-forest" />
                    </div>
                    <div>
                      <p className="font-medium">Live Chat</p>
                      <p className="text-xs text-muted-foreground">Available 24/7</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto">Online</Badge>
                  </div>
                  
                  <div className="flex items-center p-3 bg-sage-light/10 rounded-lg">
                    <div className="mr-3">
                      <Icons.slack className="h-5 w-5 text-forest" />
                    </div>
                    <div>
                      <p className="font-medium">Community Forum</p>
                      <p className="text-xs text-muted-foreground">Join our user community</p>
                    </div>
                    <Button size="sm" variant="outline" className="ml-auto">
                      Join
                    </Button>
                  </div>
                  
                  <div className="flex items-center p-3 bg-sage-light/10 rounded-lg">
                    <div className="mr-3">
                      <Icons.youtube className="h-5 w-5 text-forest" />
                    </div>
                    <div>
                      <p className="font-medium">Video Tutorials</p>
                      <p className="text-xs text-muted-foreground">Learn how to use our platform</p>
                    </div>
                    <Button size="sm" variant="outline" className="ml-auto">
                      Watch
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-forest">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "How do I reset my password?",
                  answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. Follow the instructions sent to your email to create a new password."
                },
                {
                  question: "Is my health data secure?",
                  answer: "Yes, we take security very seriously. All your health data is encrypted and stored securely in compliance with HIPAA and other regulatory standards."
                },
                {
                  question: "How accurate are the health risk assessments?",
                  answer: "Our health risk assessments are based on established medical research and algorithms. However, they are meant to be informational and not a replacement for professional medical advice."
                },
                {
                  question: "Can I export my health data?",
                  answer: "Yes, you can export your health data in various formats (PDF, CSV) from your account settings. This makes it easy to share information with your healthcare provider."
                },
              ].map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-md font-medium text-forest">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-3">Didn't find what you're looking for?</p>
              <Button variant="outline">
                Visit Help Center
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Contact;
