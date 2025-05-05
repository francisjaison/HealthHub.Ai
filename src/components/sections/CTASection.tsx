
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface CTASectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

const CTASection = ({ title, subtitle, ctaText, ctaLink }: CTASectionProps) => {
  return (
    <section className="py-16 md:py-24 bg-sage/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-forest to-forest-dark text-white rounded-2xl p-8 md:p-12 shadow-lg relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 animate-fade-in opacity-0">{title}</h2>
              <p className="text-white/80 mb-6 md:mb-0 animate-fade-in opacity-0 delay-100">{subtitle}</p>
            </div>
            <Link to={ctaLink} className="animate-fade-in opacity-0 delay-200">
              <Button size="lg" className="bg-white text-forest hover:bg-sage hover:text-forest-dark min-w-[200px]">
                {ctaText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
