import React, { useState } from 'react';
import {
  Flame,
  Check,
  Sun,
  Moon,
  Sparkles,
  Calendar,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRoutineProgress, getTodayDateString } from '../hooks/useRoutineProgress';
import { Button } from './Button';
import { SocialShareModal } from './SocialShareModal';
import { cn } from '../utils/cn';

export interface HabitItem {
  id: string;
  name: string;
  category: 'AM' | 'PM' | 'Wellness';
  time: string;
  benefit: string;
}

const defaultHabits: HabitItem[] = [
  // AM Steps
  { id: 'am-1', name: 'Gentle Cleanser', category: 'AM', time: 'Morning', benefit: 'pH 5.5 balance & refresh' },
  { id: 'am-2', name: '15% Vitamin C Serum', category: 'AM', time: 'Morning', benefit: 'Antioxidant & tone brightening' },
  { id: 'am-3', name: 'Hydra Glow Moisturizer', category: 'AM', time: 'Morning', benefit: 'Hyaluronic acid lipid lock' },
  { id: 'am-4', name: 'Broad Spectrum SPF 50', category: 'AM', time: 'Morning', benefit: 'UVA/UVB photoprotection' },
  // PM Steps
  { id: 'pm-1', name: 'Double Cleanse Melt', category: 'PM', time: 'Evening', benefit: 'Dissolve sunscreen & city grime' },
  { id: 'pm-2', name: 'Encapsulated Retinol', category: 'PM', time: 'Evening', benefit: 'Nightly cellular renewal' },
  { id: 'pm-3', name: 'Deep Barrier Cream', category: 'PM', time: 'Evening', benefit: 'Ceramides prevent night dehydration' },
  { id: 'pm-4', name: 'Soothing Eye Pat', category: 'PM', time: 'Evening', benefit: 'Micro-circulation & depuff' },
  // Wellness
  { id: 'well-1', name: 'Morning Lemon Hydration', category: 'Wellness', time: 'Daily', benefit: 'Internal metabolic hydration' },
  { id: 'well-2', name: 'Collagen & Omega-3', category: 'Wellness', time: 'Daily', benefit: 'Dermal elasticity from within' },
  { id: 'well-4', name: 'Calm Night Herbal Tea', category: 'Wellness', time: 'Night', benefit: 'Deep REM restorative sleep' },
];

const milestoneBadges = [
  { days: 3, title: 'Fresh Dew', desc: '3 consecutive days', icon: '💧' },
  { days: 7, title: 'Radiance Rising', desc: '1 week consistent glow', icon: '🔥' },
  { days: 14, title: 'Barrier Defender', desc: '2 weeks cellular repair', icon: '🛡️' },
  { days: 30, title: 'Lumi Luminary', desc: 'Full 30-day dermal cycle', icon: '👑' },
];

interface DailyHabitTrackerProps {
  className?: string;
  onOpenInfographicGenerator?: () => void;
}

export function DailyHabitTracker({ className, onOpenInfographicGenerator }: DailyHabitTrackerProps) {
  const { isDone, toggleStep, addSteps, streak, progress } = useRoutineProgress();
  const [activeCategory, setActiveCategory] = useState<'all' | 'AM' | 'PM' | 'Wellness'>('all');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const currentStreak = streak();

  const filteredHabits = defaultHabits.filter(
    (h) => activeCategory === 'all' || h.category === activeCategory
  );

  const completedTodayCount = defaultHabits.filter((h) => isDone(h.id)).length;
  const totalCount = defaultHabits.length;
  const percentage = Math.round((completedTodayCount / totalCount) * 100);

  const handleToggle = (habit: HabitItem) => {
    const wasDone = isDone(habit.id);
    toggleStep(habit.id);
    if (!wasDone) {
      toast.success(`Completed: ${habit.name}`);
    }
  };

  const handleCompleteCategory = (cat: 'AM' | 'PM') => {
    const targets = defaultHabits.filter((h) => h.category === cat);
    addSteps(targets.map((t) => t.id));
    toast.success(`Marked all ${cat} tasks as complete!`);
  };

  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const iso = d.toISOString().slice(0, 10);
    const dayTasks = progress[iso] ?? [];
    const isToday = iso === getTodayDateString();
    return {
      date: iso,
      dayNum: d.getDate(),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      completedCount: dayTasks.length,
      hasSteps: dayTasks.length > 0,
      isPerfect: dayTasks.length >= 4,
      isToday,
    };
  });

  return (
    <div
      className={cn(
        'rounded-[2.5rem] border border-border bg-card p-6 shadow-soft sm:p-8 lg:p-10 transition-all',
        className
      )}
    >
      {/* Top Banner with Streak Visualization */}
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-border/80 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/20 text-accent">
              <Flame className="h-4 w-4 fill-accent" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Daily Skin Habit Tracker
            </span>
          </div>
          <h2 className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Today's Skincare & Wellness Ritual
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete daily steps to maintain cellular hydration and fortify your skin barrier.
          </p>
        </div>

        {/* Streak Counter & Milestone Box */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-primary/20 px-5 py-3 shadow-xs">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-sm">
              <Flame className="h-7 w-7 fill-white" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                ✦
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-bold text-foreground">
                  {currentStreak}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Day Streak
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {currentStreak >= 7 ? 'Radiance on fire 🔥' : 'Keep glowing every day'}
              </p>
            </div>
          </div>

          <Button
            size="md"
            variant="outline"
            onClick={() => setShareModalOpen(true)}
            className="shadow-2xs gap-1.5"
          >
            <Share2 className="h-4 w-4 text-primary" /> Share Stats
          </Button>

          {onOpenInfographicGenerator && (
            <Button size="md" onClick={onOpenInfographicGenerator} className="shadow-glow">
              <Sparkles className="h-4 w-4 mr-1.5" /> Generate Infographic
            </Button>
          )}
        </div>
      </div>

      {/* Visual Streak Calendar Grid (14-Day View) */}
      <div className="mt-8 rounded-3xl bg-secondary/40 p-5 sm:p-6 border border-border/80">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <h3 className="font-display text-base font-semibold text-foreground">
              14-Day Consistency Flame Heatmap
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">
            {last14Days.filter((d) => d.hasSteps).length} of 14 days active
          </span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 text-center">
          {last14Days.map((day) => (
            <div
              key={day.date}
              className={cn(
                'flex flex-col items-center justify-center rounded-2xl p-2 transition-all',
                day.isToday && 'ring-2 ring-primary ring-offset-2 ring-offset-card bg-card font-bold',
                day.hasSteps ? 'bg-card border border-primary/20 shadow-2xs' : 'bg-muted/40 border border-transparent'
              )}
            >
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                {day.dayName.slice(0, 1)}
              </span>
              <div
                className={cn(
                  'mt-1 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-transform',
                  day.hasSteps
                    ? day.isPerfect
                      ? 'bg-accent text-white shadow-xs scale-105'
                      : 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
                title={`${day.date}: ${day.completedCount} steps completed`}
              >
                {day.hasSteps ? <Flame className="h-4 w-4 fill-current" /> : day.dayNum}
              </div>
              <span className="mt-1 text-[9px] text-muted-foreground font-mono">
                {day.completedCount > 0 ? `${day.completedCount}` : '•'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Streak Milestones Badges */}
      <div className="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-4">
        {milestoneBadges.map((badge) => {
          const unlocked = currentStreak >= badge.days;
          return (
            <div
              key={badge.days}
              className={cn(
                'flex items-center gap-3 rounded-2xl border p-3.5 transition-all',
                unlocked
                  ? 'border-primary/40 bg-primary/5 shadow-2xs'
                  : 'border-border bg-card/60 opacity-60'
              )}
            >
              <span className="text-2xl">{badge.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-xs font-semibold text-foreground truncate">
                    {badge.title}
                  </span>
                  {unlocked && <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" />}
                </div>
                <p className="text-[10px] text-muted-foreground">{badge.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Metric Bar */}
      <div className="mt-8 flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            Today's Completion:{' '}
            <strong className="text-primary font-semibold">{completedTodayCount}</strong> of{' '}
            {totalCount} habits done
          </span>
          <span className="font-display font-semibold text-primary">{percentage}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Category Filter Tabs & Category Shortcuts */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: `All (${defaultHabits.length})` },
            { id: 'AM', label: 'Morning Ritual (AM)' },
            { id: 'PM', label: 'Evening Ritual (PM)' },
            { id: 'Wellness', label: 'Daily Wellness' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as any)}
              className={cn(
                'rounded-full px-4 py-2 text-xs font-semibold transition-colors cursor-pointer',
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Quick Batch Complete Buttons */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleCompleteCategory('AM')}
            className="flex items-center gap-1 rounded-full border border-border px-3 py-1 font-semibold text-muted-foreground hover:text-foreground hover:border-primary/50 cursor-pointer"
          >
            <Sun className="h-3.5 w-3.5 text-amber-600" />
            <span>Mark AM Done</span>
          </button>
          <button
            type="button"
            onClick={() => handleCompleteCategory('PM')}
            className="flex items-center gap-1 rounded-full border border-border px-3 py-1 font-semibold text-muted-foreground hover:text-foreground hover:border-primary/50 cursor-pointer"
          >
            <Moon className="h-3.5 w-3.5 text-indigo-600" />
            <span>Mark PM Done</span>
          </button>
        </div>
      </div>

      {/* Interactive Habit Task Cards */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {filteredHabits.map((habit) => {
          const done = isDone(habit.id);
          return (
            <div
              key={habit.id}
              onClick={() => handleToggle(habit)}
              className={cn(
                'group flex items-start gap-3.5 rounded-2xl border p-4 transition-all duration-200 cursor-pointer',
                done
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/20'
              )}
            >
              <button
                type="button"
                aria-label={`Toggle habit ${habit.name}`}
                className={cn(
                  'mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl transition-all cursor-pointer shadow-2xs',
                  done
                    ? 'bg-primary text-primary-foreground scale-105'
                    : 'bg-secondary text-secondary-foreground group-hover:bg-primary/20'
                )}
              >
                {done && <Check className="h-4 w-4 stroke-[3]" />}
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      'font-display text-base font-semibold transition-colors',
                      done ? 'text-muted-foreground line-through decoration-primary/40' : 'text-foreground'
                    )}
                  >
                    {habit.name}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                      habit.category === 'AM'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        : habit.category === 'PM'
                        ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300'
                        : 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                    )}
                  >
                    {habit.category}
                  </span>
                </div>
                <p
                  className={cn(
                    'mt-0.5 text-xs text-muted-foreground',
                    done && 'text-muted-foreground/60'
                  )}
                >
                  {habit.benefit}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <SocialShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareContext={{
          type: 'streak_milestone',
          title: `${currentStreak}-Day Skincare Streak`,
        }}
      />
    </div>
  );
}
