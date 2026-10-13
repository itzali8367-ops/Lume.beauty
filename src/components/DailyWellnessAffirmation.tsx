import { useState, useEffect } from 'react';
import { Quote, RefreshCw, Copy, Check, Heart, Feather } from 'lucide-react';
import { toast } from 'sonner';
import { Affirmation } from '../data/affirmations';
import { useAffirmations } from '../hooks/useAffirmations';
import { useJournal } from '../hooks/useJournal';
import { getTodayDateString } from '../hooks/useRoutineProgress';
import { cn } from '../utils/cn';

export function DailyWellnessAffirmation({ className }: { className?: string }) {
  const { affirmations, getToday } = useAffirmations();
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation>(getToday);
  const [copied, setCopied] = useState(false);
  const [savedToJournal, setSavedToJournal] = useState(false);
  const { addEntry } = useJournal();

  useEffect(() => {
    setCurrentAffirmation(getToday());
  }, [affirmations]);

  const handleShuffle = () => {
    const list = affirmations.length > 0 ? affirmations : [currentAffirmation];
    const remaining = list.filter((a) => a.id !== currentAffirmation.id);
    const pool = remaining.length > 0 ? remaining : list;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setCurrentAffirmation(random);
    setCopied(false);
    setSavedToJournal(false);
    toast.info('New daily affirmation drawn ✨');
  };

  const handleCopy = () => {
    const text = `"${currentAffirmation.quote}" — ${currentAffirmation.author} (via Lumi)`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Affirmation copied to clipboard');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSaveToJournal = () => {
    addEntry({
      date: getTodayDateString(),
      rating: 5,
      mood: 'Calm',
      note: `Daily Affirmation: "${currentAffirmation.quote}"`,
    });
    setSavedToJournal(true);
    toast.success('Affirmation saved to your Glow Journal!');
  };

  const themeColors: Record<Affirmation['theme'], { bg: string; text: string }> = {
    'Radiance': { bg: 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300', text: 'text-amber-700 dark:text-amber-300' },
    'Mindful Self-Care': { bg: 'bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300', text: 'text-rose-700 dark:text-rose-300' },
    'Barrier Healing': { bg: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300', text: 'text-emerald-700 dark:text-emerald-300' },
    'Inner Balance': { bg: 'bg-teal-100 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300', text: 'text-teal-700 dark:text-teal-300' },
    'Rest & Renewal': { bg: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300', text: 'text-indigo-700 dark:text-indigo-300' },
  };

  const themeStyle = themeColors[currentAffirmation.theme] || {
    bg: 'bg-secondary text-secondary-foreground',
    text: 'text-primary',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[2.5rem] border border-border/80 bg-gradient-to-br from-card via-card to-secondary/30 p-6 shadow-soft sm:p-10 transition-all duration-300',
        className
      )}
    >
      {/* Background ambient accents */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-rose-200/30 dark:bg-rose-900/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-amber-100/40 dark:bg-amber-900/20 blur-3xl" />

      {/* Header bar */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-primary shadow-xs">
            <Quote className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Daily Wellness Affirmation
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Mindful pause for your beauty ritual</p>
          </div>
        </div>

        {/* Theme pill & Action buttons */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors',
              themeStyle.bg
            )}
          >
            {currentAffirmation.theme}
          </span>
          <button
            type="button"
            onClick={handleShuffle}
            title="Draw another affirmation"
            aria-label="Draw another affirmation"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Quote */}
      <div className="relative py-6 sm:py-8">
        <blockquote className="relative">
          <p className="font-display text-xl font-normal leading-relaxed text-foreground sm:text-2xl lg:text-3xl italic">
            "{currentAffirmation.quote}"
          </p>
          <footer className="mt-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <span className="h-px w-6 bg-border" />
            <cite className="not-italic text-foreground">{currentAffirmation.author}</cite>
          </footer>
        </blockquote>

        {/* Daily Mindful Tip Box */}
        {currentAffirmation.tip && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-secondary/50 p-4 border border-border/80">
            <Feather className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-foreground/90">
              <span className="font-semibold text-foreground">Today's Mindful Practice: </span>
              {currentAffirmation.tip}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-5 text-xs">
        <p className="text-muted-foreground">
          Grounded rituals compound into everlasting radiant skin.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 font-semibold text-foreground hover:border-primary/40 transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Share Quote'}</span>
          </button>
          <button
            type="button"
            onClick={handleSaveToJournal}
            disabled={savedToJournal}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-semibold transition-colors cursor-pointer',
              savedToJournal
                ? 'bg-primary/20 text-primary'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs'
            )}
          >
            <Heart className={cn('h-3.5 w-3.5', savedToJournal && 'fill-primary')} />
            <span>{savedToJournal ? 'In Journal' : 'Save to Journal'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
