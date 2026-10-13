import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Guide } from '../types';

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      to={`/guides/${guide.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={guide.image}
          alt={guide.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3">
          <span className="inline-flex items-center rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground backdrop-blur shadow-2xs">
            {guide.category}
          </span>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {guide.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {guide.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{guide.author}</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {guide.readTime} min
          </span>
        </div>
      </div>
    </Link>
  );
}
