import React, { useState } from 'react';
import { Droplets, Plus, Minus, RotateCcw, Award, CheckCircle2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Button } from './Button';
import { cn } from '../utils/cn';

interface WaterLogEntry {
  glasses: number;
  goal: number;
}

const hydrationTips = [
  'Hyaluronic acid holds 1,000x its weight in water – drinking water directly amplifies your skincare serum efficacy!',
  'Adequate cellular hydration improves skin elasticity and visibly diminishes fine dehydration lines.',
  'Drinking a glass of water upon waking kickstarts digestive lymphatic drainage and morning glow.',
  'Hydration keeps sebum production balanced, preventing the rebound oiliness triggered by dehydration.',
  'Well-hydrated skin heals faster from blemishes and UV exposure.',
];

export function DailyWaterTracker({ className }: { className?: string }) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const [logs, setLogs] = useLocalStorage<Record<string, WaterLogEntry>>('lumie.water_intake', {
    [todayKey]: { glasses: 4, goal: 8 },
  });

  const [activeGoal] = useState<number>(() => logs[todayKey]?.goal || 8);

  const currentGlasses = logs[todayKey]?.glasses ?? 0;
  const goal = logs[todayKey]?.goal ?? activeGoal;
  const percentage = Math.min(100, Math.round((currentGlasses / goal) * 100));
  const isGoalReached = currentGlasses >= goal;

  const calculateStreak = () => {
    let streakCount = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayLog = logs[key];
      if (dayLog && dayLog.glasses >= dayLog.goal) {
        streakCount++;
      } else if (i > 0) {
        break;
      }
    }
    return streakCount;
  };

  const streak = calculateStreak();

  const updateGlasses = (newCount: number) => {
    const validCount = Math.max(0, Math.min(16, newCount));
    setLogs((prev) => ({
      ...prev,
      [todayKey]: {
        glasses: validCount,
        goal: goal,
      },
    }));

    if (validCount >= goal && currentGlasses < goal) {
      toast.success('🎉 Daily Hydration Goal Reached! Skin barrier fully replenished!', {
        description: 'You drank 8 glasses (2,000 ml) of water today.',
      });
    }
  };

  const handleAddGlass = () => {
    const next = currentGlasses + 1;
    updateGlasses(next);
    toast.success(`Logged glass ${next} (${next * 250} ml total)`);
  };

  const handleRemoveGlass = () => {
    if (currentGlasses > 0) {
      updateGlasses(currentGlasses - 1);
    }
  };

  const handleReset = () => {
    updateGlasses(0);
    toast.info('Reset water tracker for today');
  };

  const randomTip = hydrationTips[Math.abs(todayKey.charCodeAt(todayKey.length - 1)) % hydrationTips.length];

  return (
    <div className={cn('overflow-hidden rounded-3xl border border-sky-200/70 dark:border-sky-900/50 bg-gradient-to-br from-sky-50/70 dark:from-sky-950/20 via-background to-blue-50/40 dark:to-background p-6 sm:p-8 shadow-soft', className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white shadow-xs">
              <Droplets className="h-4 w-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">
              Internal Skin Hydration
            </span>
          </div>
          <h3 className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Daily Water Intake Tracker
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Drink 8 glasses (2,000 ml) throughout the day to nourish your skin from the inside out.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-sky-100/80 dark:bg-sky-950/50 px-4 py-2.5 text-sky-800 dark:text-sky-300 border border-sky-200/60 dark:border-sky-900/60 shadow-2xs">
          <Award className="h-5 w-5 text-sky-600 dark:text-sky-400" />
          <div className="text-left">
            <div className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">Hydration Streak</div>
            <div className="font-display text-base font-bold text-sky-950 dark:text-sky-100">
              {streak} {streak === 1 ? 'Day' : 'Days'} In A Row
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-sky-200/60 dark:border-sky-900/40 bg-card/80 p-5 backdrop-blur-xs">
          <div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-display text-4xl font-bold text-sky-950 dark:text-sky-100">{currentGlasses}</span>
                <span className="text-sm font-semibold text-muted-foreground"> / {goal} glasses</span>
              </div>
              <span className="rounded-full bg-sky-100 dark:bg-sky-950/60 px-3 py-1 font-display text-sm font-bold text-sky-700 dark:text-sky-300">
                {currentGlasses * 250} ml ({percentage}%)
              </span>
            </div>

            <div className="mt-4 relative h-6 w-full overflow-hidden rounded-full bg-sky-100/80 dark:bg-sky-950/60 p-1">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 transition-all duration-500 shadow-sm"
                style={{ width: `${percentage}%` }}
              />
            </div>

            {isGoalReached ? (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/40">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Goal achieved! Your skin barrier is fully hydrated today.</span>
              </div>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">
                {goal - currentGlasses} more {goal - currentGlasses === 1 ? 'glass' : 'glasses'} ({(goal - currentGlasses) * 250} ml) left to reach your daily glow goal.
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button
              onClick={handleAddGlass}
              size="sm"
              className="bg-sky-500 hover:bg-sky-600 text-white border-none flex-1 sm:flex-none shadow-xs"
            >
              <Plus className="h-4 w-4 mr-1.5" /> +1 Glass (250ml)
            </Button>
            <Button
              onClick={() => updateGlasses(currentGlasses + 2)}
              size="sm"
              variant="outline"
              className="border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/40"
            >
              <Droplets className="h-3.5 w-3.5 mr-1 text-sky-600" /> +500ml Bottle
            </Button>
            <button
              type="button"
              onClick={handleRemoveGlass}
              disabled={currentGlasses <= 0}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-40 cursor-pointer"
              title="Remove one glass"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-destructive cursor-pointer"
              title="Reset for today"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-sky-200/60 dark:border-sky-900/40 bg-card/80 p-5 backdrop-blur-xs">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>TAP ANY GLASS TO LOG IN REAL-TIME</span>
              <span>1 glass = 250 ml / 8.5 oz</span>
            </div>

            <div className="mt-4 grid grid-cols-4 sm:grid-cols-8 gap-2.5">
              {Array.from({ length: goal }).map((_, index) => {
                const isFilled = index < currentGlasses;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      if (isFilled && index === currentGlasses - 1) {
                        updateGlasses(index);
                      } else {
                        updateGlasses(index + 1);
                      }
                    }}
                    className={cn(
                      'group relative flex flex-col items-center justify-end rounded-2xl border p-2.5 transition-all duration-300 cursor-pointer hover:scale-105',
                      isFilled
                        ? 'border-sky-400 dark:border-sky-500 bg-sky-500/10 shadow-xs'
                        : 'border-dashed border-sky-200 dark:border-sky-900 bg-sky-50/30 dark:bg-sky-950/20 hover:border-sky-300'
                    )}
                    title={`Glass #${index + 1} (${(index + 1) * 250}ml)`}
                  >
                    <div className="relative flex h-14 w-8 items-end justify-center rounded-b-xl border-2 border-t-0 border-sky-400/80 bg-sky-100/30 dark:bg-sky-950/30 overflow-hidden">
                      <div
                        className={cn(
                          'w-full transition-all duration-500',
                          isFilled
                            ? 'h-full bg-gradient-to-t from-sky-500 to-sky-400 shadow-inner'
                            : 'h-0 group-hover:h-3 group-hover:bg-sky-200 dark:group-hover:bg-sky-800'
                        )}
                      />
                      {isFilled && (
                        <div className="absolute top-1 left-1.5 h-1.5 w-1.5 rounded-full bg-white/60" />
                      )}
                    </div>
                    <span className={cn(
                      'mt-2 text-2xs font-bold transition-colors',
                      isFilled ? 'text-sky-700 dark:text-sky-300 font-semibold' : 'text-muted-foreground'
                    )}>
                      #{index + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-sky-50/90 dark:bg-sky-950/40 p-3 text-xs text-sky-900 dark:text-sky-200 border border-sky-200/50 dark:border-sky-800/50">
            <Info className="h-4 w-4 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong className="font-semibold text-sky-950 dark:text-sky-100">Glow Science: </strong>
              {randomTip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
