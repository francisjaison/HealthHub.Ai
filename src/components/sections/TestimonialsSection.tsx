
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  avatarUrl?: string;
}

interface TestimonialsSectionProps {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}

const TestimonialsSection = ({ title, subtitle, testimonials }: TestimonialsSectionProps) => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-forest animate-fade-in opacity-0">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground animate-fade-in opacity-0 delay-100">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className="border border-border animate-fade-in opacity-0"
              style={{ animationDelay: `${100 * index}ms` }}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col h-full">
                  <div className="mb-4 text-forest">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                    </svg>
                  </div>
                  <p className="text-foreground mb-6 flex-grow">{testimonial.quote}</p>
                  <div className="flex items-center">
                    {testimonial.avatarUrl ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img src={testimonial.avatarUrl} alt={testimonial.author} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-sage text-white flex items-center justify-center mr-3">
                        {testimonial.author.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-forest">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
