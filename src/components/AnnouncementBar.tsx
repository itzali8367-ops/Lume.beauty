import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

export function AnnouncementBar() {
  const { siteSettings } = useSiteSettings();
  const { announcement } = siteSettings;

  if (!announcement || !announcement.enabled || !announcement.text) {
    return null;
  }

  return (
    <aside aria-label="Announcement" className="relative z-50 bg-foreground text-background py-2 px-4 text-xs">
      <div className="container-wide flex flex-wrap items-center justify-center gap-2.5 text-center">
        {announcement.badge && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            {announcement.badge}
          </span>
        )}
        <span className="font-medium text-background/90">{announcement.text}</span>
        {announcement.link && (
          <Link
            to={announcement.link}
            className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-2 hover:text-primary/90 transition-colors"
          >
            <span>{announcement.linkText || 'Learn More'}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </aside>
  );
}
