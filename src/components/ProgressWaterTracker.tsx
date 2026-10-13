import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from 'recharts';
import {
  Droplets,
  Plus,
  Minus,
  RotateCcw,
  Award,
  CheckCircle2,
  Info,
  Flame,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getTodayDateString } from '../hooks/useRoutineProgress';
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

interface ProgressWaterTrackerProps {
  className?: string;
}

export function ProgressWaterTracker({ className }: ProgressWaterTrackerProps) {
  const todayKey = getTodayDateString();

  // Load water intake from localStorage with seed history for weekly visualization
  const [logs, setLogs] = useLocalStorage<Record<string, WaterLogEntry>>('lumie.water_intake', {
    [todayKey]: { glasses: 5, goal: 8 },
  });

  const [activeGoal] = useState<number>(() => logs[todayKey]?.goal || 8);
  const currentGlasses = logs[todayKey]?.glasses ?? 0;
  const goal = logs[todayKey]?.goal ?? activeGoal;
  const percentage = Math.min(100, Math.round((currentGlasses / goal) * 100));
  const isGoalReached = currentGlasses >= goal;

  // Calculate hydration streak (consecutive days goal met)
  const streak = useMemo(() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayLog = logs[key];
      const dayGoal = dayLog?.goal || 8;
      if (dayLog && dayLog.glasses >= dayGoal) {
        count++;
      } else if (i > 0) {
        break;
      }
    }
    return count;
  }, [logs]);

  // Generate 7-day weekly dataset for Recharts Bar Chart
  const weeklyData = useMemo(() => {
    const list = [];
    const today = new Date();
    // Default pleasant baseline numbers for prior days if user hasn't logged yet
    const fallbackSeed = [6, 7, 8, 5, 8, 7, 6];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const isToday = iso === todayKey;
      const dayLabel = isToday ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const fullDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const dayLog = logs[iso];
      const glasses = dayLog ? dayLog.glasses : isToday ? currentGlasses : fallbackSeed[i % fallbackSeed.length];
      const targetGoal = dayLog?.goal || 8;
      const ml = glasses * 250;

      list.push({
        date: iso,
        dayLabel,
        fullDate,
        isToday,
        glasses,
        goal: targetGoal,
        ml,
        percentage: Math.min(100, Math.round((glasses / targetGoal) * 100)),
        metGoal: glasses >= targetGoal,
      });
    }
    return list;
  }, [logs, currentGlasses, todayKey]);

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
      toast.success('🎉 Daily Hydration Goal Met! Skin barrier fully replenished!', {
        description: 'You reached 8 glasses (2,000 ml) of cellular hydration today.',
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
  const totalWeeklyMl = weeklyData.reduce((acc, d) => acc + d.ml, 0);
  const avgGlasses = (weeklyData.reduce((acc, d) => acc + d.glasses, 0) / 7).toFixed(1);
  const daysHitGoal = weeklyData.filter((d) => d.metGoal).length;

  return (
    <div
      className={cn(
        'rounded-3xl border border-sky-200/80 dark:border-sky-900/50 bg-gradient-to-br from-sky-50/70 dark:from-sky-950/20 via-card to-blue-50/30 dark:to-card p-6 sm:p-8 shadow-soft space-y-8',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white shadow-xs">
              <Droplets className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
              Cellular Hydration Journal
            </span>
          </div>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-foreground">
            Daily Water Intake & Weekly Consistency
          </h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            Log each 250ml glass with a single tap. Internal hydration accelerates dermal cell turnover and maximizes serum absorption.
          </p>
        </div>

        {/* Stats Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl bg-sky-100/80 dark:bg-sky-950/60 px-4 py-2.5 text-sky-900 dark:text-sky-200 border border-sky-200 dark:border-sky-900 shadow-2xs">
            <Award className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Hydration Streak
              </div>
              <div className="font-display text-base font-bold text-sky-950 dark:text-sky-100">
                {streak} {streak === 1 ? 'Day' : 'Days'} In A Row
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-card px-4 py-2.5 border border-border shadow-2xs">
            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Weekly Volume
              </div>
              <div className="font-display text-base font-bold text-foreground">
                {(totalWeeklyMl / 1000).toFixed(1)} L Drank
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Counter & Recharts Visualizer */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Interactive Counter & Glasses Logger */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-sky-200/70 dark:border-sky-900/50 bg-card p-6 shadow-2xs">
            {/* Counter Highlight */}
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-display text-5xl font-extrabold text-sky-950 dark:text-sky-100">
                  {currentGlasses}
                </span>
                <span className="text-sm font-semibold text-muted-foreground ml-1">
                  / {goal} glasses
                </span>
              </div>
              <span className="rounded-full bg-sky-100 dark:bg-sky-950/80 px-3.5 py-1 text-xs font-bold text-sky-700 dark:text-sky-300">
                {currentGlasses * 250} ml ({percentage}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 relative h-4 w-full overflow-hidden rounded-full bg-sky-100 dark:bg-sky-950/60 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 transition-all duration-500 shadow-xs"
                style={{ width: `${percentage}%` }}
              />
            </div>

            {isGoalReached ? (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 p-3 text-xs font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Daily goal reached! 2,000ml cellular hydration achieved.</span>
              </div>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">
                {goal - currentGlasses} more {goal - currentGlasses === 1 ? 'glass' : 'glasses'} ({(goal - currentGlasses) * 250} ml) to complete today's goal.
              </p>
            )}

            {/* Counter Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Button
                onClick={handleAddGlass}
                size="md"
                className="bg-sky-500 hover:bg-sky-600 text-white border-none flex-1 shadow-xs font-semibold"
              >
                <Plus className="h-4 w-4 mr-1.5" /> +1 Glass (250ml)
              </Button>

              <Button
                onClick={() => updateGlasses(currentGlasses + 2)}
                size="md"
                variant="outline"
                className="border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/40"
              >
                <Droplets className="h-3.5 w-3.5 mr-1 text-sky-600" /> +500ml Bottle
              </Button>

              <button
                type="button"
                onClick={handleRemoveGlass}
                disabled={currentGlasses <= 0}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-40 cursor-pointer transition-colors"
                title="Remove one glass"
              >
                <Minus className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
                title="Reset counter for today"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 8 Clickable Glass Graphic Icons */}
          <div className="rounded-2xl border border-sky-200/70 dark:border-sky-900/50 bg-card p-5">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-3">
              <span>TAP ANY GLASS TO SET INTAKE</span>
              <span>1 glass = 250 ml</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {Array.from({ length: 8 }).map((_, index) => {
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
                      'group flex flex-col items-center justify-end rounded-xl border p-2 transition-all cursor-pointer hover:scale-105',
                      isFilled
                        ? 'border-sky-400 dark:border-sky-500 bg-sky-500/10 shadow-xs'
                        : 'border-dashed border-sky-200 dark:border-sky-900 bg-sky-50/30 dark:bg-sky-950/20 hover:border-sky-300'
                    )}
                    title={`Glass #${index + 1} (${(index + 1) * 250}ml)`}
                  >
                    <div className="relative flex h-12 w-7 items-end justify-center rounded-b-lg border-2 border-t-0 border-sky-400/80 bg-sky-100/30 dark:bg-sky-950/40 overflow-hidden">
                      <div
                        className={cn(
                          'w-full transition-all duration-400',
                          isFilled
                            ? 'h-full bg-gradient-to-t from-sky-500 to-sky-400'
                            : 'h-0 group-hover:h-2 group-hover:bg-sky-200'
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        'mt-1.5 text-[10px] font-bold',
                        isFilled ? 'text-sky-700 dark:text-sky-300' : 'text-muted-foreground'
                      )}
                    >
                      #{index + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Consistency Recharts Bar Chart */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  7-Day Hydration Consistency
                </h3>
                <p className="text-xs text-muted-foreground">
                  Glasses logged per day compared to the daily 8-glass (2,000ml) target
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-3 w-3 rounded-full bg-sky-500 inline-block" />
                  <span>Daily Glasses</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="h-0.5 w-4 border-t-2 border-dashed border-emerald-500 inline-block" />
                  <span>8 Glass Goal</span>
                </span>
              </div>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="waterBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="todayBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity={1} />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.85} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
                  <XAxis
                    dataKey="dayLabel"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: '#888888' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#888888' }}
                    domain={[0, 12]}
                  />

                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-xl border border-sky-200 dark:border-sky-800 bg-card/95 p-3.5 shadow-xl backdrop-blur-md text-xs space-y-1.5">
                            <div className="font-bold text-foreground border-b border-border/80 pb-1 flex items-center justify-between gap-4">
                              <span>{data.fullDate} {data.isToday && '(Today)'}</span>
                              <span className="text-sky-600 dark:text-sky-400 font-semibold">
                                {data.percentage}% Goal
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-4 text-sky-600 dark:text-sky-400 font-bold">
                              <span>Water Drank:</span>
                              <span>{data.glasses} glasses ({data.ml} ml)</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 text-muted-foreground">
                              <span>Daily Target:</span>
                              <span>{data.goal} glasses (2,000 ml)</span>
                            </div>
                            <div className="pt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                              {data.metGoal ? '✓ Goal Achieved!' : `${data.goal - data.glasses} glasses under goal`}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  {/* Reference line for 8-glass goal */}
                  <ReferenceLine
                    y={8}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    label={{
                      value: 'Goal (8)',
                      fill: '#10b981',
                      fontSize: 10,
                      position: 'insideTopRight',
                    }}
                  />

                  <Bar
                    dataKey="glasses"
                    name="Glasses"
                    radius={[8, 8, 0, 0]}
                    barSize={28}
                  >
                    {weeklyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isToday ? 'url(#todayBarGradient)' : 'url(#waterBarGradient)'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Metrics Footer */}
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border/70 pt-4 text-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Weekly Avg
                </span>
                <span className="font-display text-lg font-bold text-foreground">
                  {avgGlasses} glasses/day
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Goals Reached
                </span>
                <span className="font-display text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {daysHitGoal} of 7 days
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Hydration Level
                </span>
                <span className="font-display text-lg font-bold text-sky-600 dark:text-sky-400">
                  {Math.round((daysHitGoal / 7) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Glow Science Advice Box */}
          <div className="flex items-start gap-3 rounded-2xl bg-sky-50/90 dark:bg-sky-950/40 p-4 border border-sky-200/60 dark:border-sky-900/60 text-xs text-sky-900 dark:text-sky-200">
            <Info className="h-5 w-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-sky-950 dark:text-sky-100 block mb-0.5">
                Dermatologist Hydration Note:
              </strong>
              {randomTip}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
