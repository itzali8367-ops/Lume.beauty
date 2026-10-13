import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquarePlus, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useTheme } from '../hooks/useTheme';
import { BrandLogo } from './BrandLogo';

function FooterColumn({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="font-display text-base font-semibold text-foreground">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((n) => (
          <li key={`${n.label}-${n.to}`}>
            <Link to={n.to} className="text-sm text-muted-foreground transition-colors hover:text-primary">
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ onOpenFeedback }: { onOpenFeedback?: () => void }) {
  const [email, setEmail] = useState('');
  const { siteSettings } = useSiteSettings();
  const { isDark, toggleTheme } = useTheme();
  const { footer, brandName, categories } = siteSettings;

  const handleSubscribe = () => {
    if (email.trim()) {
      toast.success(`Thank you for subscribing to ${brandName}!`);
      setEmail('');
    }
  };

  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="container-wide grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="inline-block" title="Lumi Home">
            <BrandLogo size="md" showSubtitle />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {footer.tagline}
          </p>
          {footer.supportEmail && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="h-3.5 w-3.5 text-primary" />
              <span>{footer.supportEmail}</span>
            </div>
          )}
          <div className="mt-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary transition-colors cursor-pointer"
            >
              {isDark ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>Daylight View</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Evening Skincare Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        <FooterColumn
          title="Explore"
          items={[
            { label: 'Discover Formulas', to: '/discover' },
            { label: 'Clinical Guides', to: '/guides' },
            { label: 'Daily Routines', to: '/routines' },
            { label: 'Community Routines', to: '/routines?view=community' },
            { label: 'Badges & Progress', to: '/progress' },
            { label: 'Skin Diagnostic Quiz', to: '/quiz' },
          ]}
        />

        <FooterColumn
          title="Categories"
          items={categories.map((c) => ({
            label: c.name,
            to: `/discover?category=${c.id}`,
          }))}
        />

        <div>
          <h4 className="font-display text-base font-semibold text-foreground">
            {footer.newsletterTitle || 'Stay in the glow'}
          </h4>
          <p className="mt-3 text-sm text-muted-foreground">
            {footer.newsletterSubtitle || 'Weekly tips and product edits, straight to your inbox.'}
          </p>
          <div className="mt-4 flex gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 text-foreground"
            />
            <button
              type="button"
              onClick={handleSubscribe}
              className="rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
            >
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-border py-5">
        <div className="container-wide flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {brandName}. Crafted for your glow.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {/* Dark / Light Theme Mode Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to daylight theme' : 'Switch to evening skincare dark mode'}
              title={isDark ? 'Daylight view' : 'Comfortable evening skincare dark mode'}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer shadow-2xs"
            >
              {isDark ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>Daylight View</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Evening Dark Mode</span>
                </>
              )}
            </button>

            {onOpenFeedback && (
              <button
                type="button"
                onClick={onOpenFeedback}
                className="inline-flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer text-xs font-semibold"
              >
                <MessageSquarePlus className="h-3.5 w-3.5 text-primary" />
                <span>Feedback & Bug Report</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
