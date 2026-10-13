import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Flame, Sparkles, Sun, ArrowRight, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useRoutineProgress } from '../hooks/useRoutineProgress';
import { cn } from '../utils/cn';

interface MorningStep {
  id: string;
  order: number;
  title: string;
  subhead: string;
  category: string;
  duration: string;
  productId?: string;
  productName?: string;
}

const defaultMorningSteps: MorningStep[] = [
  {
    id: 'am-1',
    order: 1,
    title: 'Gentle Cleanse',
    subhead: 'Remove overnight sebum & refresh skin with lukewarm water',
    category: 'Cleanse',
    duration: '60 sec',
    productId: 'gentle-cleanser',
    productName: 'Gentle Foam Cleanser',
  },
  {
    id: 'am-2',
    order: 2,
    title: 'Vitamin C Antioxidant Serum',
    subhead: 'Brighten dark spots & shield against UV/pollution free radicals',
    category: 'Treat',
    duration: '30 sec absorb',
    productId: 'radiance-serum',
    productName: 'Radiance Vitamin C Serum',
  },
  {
    id: 'am-3',
    order: 3,
    title: 'Barrier Hydration Gel-Cream',
    subhead: 'Replenish moisture barrier with hyaluronic acid & ceramides',
    category: 'Hydrate',
    duration: 'Pat gently',
    productId: 'hydra-glow',
    productName: 'Hydra Glow Moisturizer',
  },
  {
    id: 'am-4',
    order: 4,
    title: 'SPF 50 Daily Shield',
    subhead: 'Non-negotiable broad spectrum protection to prevent aging',
    category: 'Protect',
    duration: 'Finish step',
    productId: 'spf-shield',
    productName: 'SPF 50 Daily Shield',
  },
];

export function MorningRoutineWidget({ className }: { className?: string }) {
  const { isDone, toggleStep, addSteps, removeSteps, streak } = useRoutineProgress();
  const [celebrateDismissed, setCelebrateDismissed] = useState(false);

  const completedCount = defaultMorningSteps.filter((s) => isDone(s.id)).length;
  const totalSteps = defaultMorningSteps.length;
  const isAllCompleted = completedCount === totalSteps;
  const percentage = Math.round((completedCount / totalSteps) * 100);

  const handleStepToggle = (step: MorningStep) => {
    const wasDone = isDone(step.id);
    toggleStep(step.id);
    if (!wasDone) {
      if (completedCount + 1 === totalSteps) {
        toast.success('All morning steps completed! Your skin is glowing.');
        setCelebrateDismissed(false);
      } else {
        toast.success(`${step.title} complete`);
      }
    }
  };

  const handleReset = () => {
    removeSteps(defaultMorningSteps.map((s) => s.id));
    setCelebrateDismissed(false);
    toast.info('Morning routine reset for today');
  };

  const handleCompleteAll = () => {
    addSteps(defaultMorningSteps.map((s) => s.id));
    setCelebrateDismissed(false);
    toast.success('Morning ritual complete! Ready to conquer the day.');
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8 transition-all',
        className
      )}
    >
      {/* Ambient gradient */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-100/60 dark:bg-amber-900/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-rose-100/50 dark:bg-rose-900/15 blur-3xl" />

      {/* Header */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 shadow-sm">
            <Sun className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                AM Ritual
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h3 className="font-display text-2xl font-semibold text-foreground">
              Morning Routine
            </h3>
          </div>
        </div>

        {/* Streak and quick actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-accent/15 px-3.5 py-1.5 text-xs font-semibold text-accent">
            <Flame className="h-4 w-4 fill-accent" />
            <span>{streak()} day streak</span>
          </div>
          {completedCount > 0 && !isAllCompleted && (
            <button
              type="button"
              onClick={handleCompleteAll}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer px-2"
            >
              Complete all
            </button>
          )}
          {completedCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset morning steps"
              title="Reset morning steps"
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar & Summary */}
      <div className="relative mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            Progress: <span className="font-semibold text-primary">{completedCount}</span> of {totalSteps} steps completed
          </span>
          <span className="font-display text-sm font-semibold text-primary">{percentage}%</span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-secondary/80">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* All completed celebration banner */}
      {isAllCompleted && !celebrateDismissed && (
        <div className="relative mt-5 flex items-center justify-between rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/15 to-amber-500/10 border border-primary/20 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display font-semibold text-foreground">
                Radiance Unlocked!
              </p>
              <p className="text-xs text-muted-foreground">
                Your skin is protected, hydrated, and ready for today.
              </p>
            </div>
          </div>
          <Link
            to="/routines"
            className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
          >
            Evening ritual →
          </Link>
        </div>
      )}

      {/* Interactive steps list */}
      <div className="relative mt-5 space-y-3">
        {defaultMorningSteps.map((step) => {
          const done = isDone(step.id);
          return (
            <div
              key={step.id}
              className={cn(
                'group flex items-start gap-4 rounded-2xl border p-4 transition-all duration-200',
                done
                  ? 'border-primary/40 bg-primary/[0.04]'
                  : 'border-border bg-card/70 hover:border-primary/40 hover:bg-card'
              )}
            >
              <button
                type="button"
                onClick={() => handleStepToggle(step)}
                aria-label={`Mark step ${step.title} as ${done ? 'incomplete' : 'complete'}`}
                className={cn(
                  'mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl font-display text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs',
                  done
                    ? 'bg-primary text-primary-foreground scale-105'
                    : 'bg-secondary text-secondary-foreground hover:bg-primary/20'
                )}
              >
                {done ? <Check className="h-4 w-4 stroke-[2.5]" /> : step.order}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      onClick={() => handleStepToggle(step)}
                      className={cn(
                        'font-display text-base font-semibold transition-colors cursor-pointer',
                        done ? 'text-muted-foreground line-through decoration-primary/50' : 'text-foreground'
                      )}
                    >
                      {step.title}
                    </span>
                    <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                      {step.category}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{step.duration}</span>
                </div>
                <p
                  onClick={() => handleStepToggle(step)}
                  className={cn(
                    'mt-1 text-xs leading-relaxed transition-colors cursor-pointer',
                    done ? 'text-muted-foreground/70' : 'text-muted-foreground'
                  )}
                >
                  {step.subhead}
                </p>

                {step.productId && (
                  <div className="mt-2.5 flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Product:</span>
                    <Link
                      to={`/products/${step.productId}`}
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                    >
                      <span>{step.productName}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/70 text-xs text-muted-foreground">
        <span>Step 4 of 4 includes broad-spectrum sunscreen</span>
        <Link
          to="/routines"
          className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
        >
          View full routines library <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
