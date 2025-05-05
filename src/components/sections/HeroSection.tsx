
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryText?: string;
  secondaryLink?: string;
}

const HeroSection = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  secondaryText,
  secondaryLink,
}: HeroSectionProps) => {
  return (
    <div className="relative overflow-hidden bg-sage/5">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cream rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-lilac rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '8s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-forest animate-fade-in opacity-0">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-10 animate-fade-in opacity-0 delay-200">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in opacity-0 delay-300">
            <Link to={ctaLink}>
              <Button className="bg-forest hover:bg-forest-dark text-white px-8 py-6 text-lg">
                {ctaText}
              </Button>
            </Link>
            {secondaryText && secondaryLink && (
              <Link to={secondaryLink}>
                <Button variant="outline" className="border-forest text-forest hover:bg-forest/10 px-8 py-6 text-lg">
                  {secondaryText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden z-10">
        <svg 
          viewBox="0 0 1440 74" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full text-background"
        >
          <path 
            d="M0 24L120 32C240 40 480 56 720 64C960 72 1200 72 1320 72H1440V0H1320C1200 0 960 0 720 0C480 0 240 0 120 0H0V24Z" 
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
