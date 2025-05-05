
import { FeatureCard } from '../ui/feature-card';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

interface FeaturesSectionProps {
  title: string;
  subtitle: string;
  features: Feature[];
}

const FeaturesSection = ({ title, subtitle, features }: FeaturesSectionProps) => {
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
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              to={feature.link}
              delay={100 * index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
