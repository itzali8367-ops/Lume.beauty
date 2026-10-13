import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Star } from 'lucide-react';
import { Button } from './Button';
import { useSiteSettings } from '../hooks/useSiteSettings';

export interface HeroProps {
  onPersonalize: () => void;
}

export function Hero({ onPersonalize }: HeroProps) {
  const { siteSettings } = useSiteSettings();
  const { hero } = siteSettings;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-secondary/60 blur-3xl pointer-events-none" />
      <div className="absolute -left-24 top-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
      <div className="container-wide relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
            <Sparkles className="h-4 w-4" /> {hero.eyebrow}
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
            {hero.titlePrefix}
            <span className="text-primary">{hero.titleHighlight}</span>
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            {hero.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={onPersonalize}>
              {hero.primaryCtaText} <ArrowRight className="h-5 w-5 ml-1" />
            </Button>
            <Link to="/discover">
              <Button size="lg" variant="outline">
                {hero.secondaryCtaText}
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Star className="h-5 w-5 fill-accent text-accent" />
              <span className="font-semibold text-foreground">{hero.ratingScore}</span>
              <span className="text-sm text-muted-foreground">{hero.ratingLabel}</span>
            </div>
            <div className="h-6 w-px bg-border" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{hero.membersCount}</span> {hero.membersLabel}
            </p>
          </div>
        </div>
        <div className="relative animate-fade-up">
          <div className="overflow-hidden rounded-[2.5rem] shadow-soft border border-border/80">
            <img
              src={hero.image}
              alt="Woman with radiant, glowing skin"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-card border border-border/80 p-4 shadow-soft sm:block">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Today's routine
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-foreground">
              Morning Glow • 3/4
            </p>
            <div className="mt-2 h-2 w-40 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-3/4 rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
