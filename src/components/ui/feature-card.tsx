
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  className?: string;
  delay?: number;
}

export function FeatureCard({ title, description, icon, to, className, delay = 0 }: FeatureCardProps) {
  return (
    <Link 
      to={to}
      className={cn(
        "flex flex-col p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-md animate-fade-in opacity-0",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-12 w-12 rounded-lg bg-sage/15 flex items-center justify-center text-forest mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-forest">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Link>
  );
}
