import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  Droplets,
  Flame,
  TrendingUp,
  Sparkles,
  Award,
  Plus,
  CheckCircle2,
  BarChart3,
  Activity,
  Info,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRoutineProgress, getTodayDateString } from '../hooks/useRoutineProgress';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Button } from './Button';
import { SocialShareModal } from './SocialShareModal';
import { cn } from '../utils/cn';

interface WaterLogEntry {
  glasses: number;
  goal: number;
}

interface WeeklyVisualSummaryProps {
  className?: string;
}

export function WeeklyVisualSummary({ className }: WeeklyVisualSummaryProps) {
  const { progress, todayDone, streak, toggleStep } = useRoutineProgress();
  const todayKey = getTodayDateString();
  const [waterLogs, setWaterLogs] = useLocalStorage<Record<string, WaterLogEntry>>(
    'lumie.water_intake',
    {
      [todayKey]: { glasses: 5, goal: 8 },
    }
  );
  const [timeRange, setTimeRange] = useState<'7days' | '14days'>('7days');
  const [viewMode, setViewMode] = useState<'dual' | 'water' | 'routines'>('dual');
  const [waterUnit, setWaterUnit] = useState<'glasses' | 'ml'>('glasses');
  const [showShareModal, setShowShareModal] = useState(false);

  const daysCount = timeRange === '7days' ? 7 : 14;

  const chartData = useMemo(() => {
    const list = [];
    const today = new Date();
    const seedWater = [6, 7, 8, 5, 8, 7, 6, 8, 7, 6, 8, 8, 7, 8];
    const seedSteps = [6, 8, 7, 5, 8, 8, 7, 8, 6, 8, 7, 8, 8, 8];

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const isToday = iso === todayKey;
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const stepsLogged = progress[iso] ? progress[iso].length : isToday ? todayDone.length : seedSteps[i % seedSteps.length];
      const stepGoal = 8;

      const waterEntry = waterLogs[iso];
      const glassesLogged = waterEntry ? waterEntry.glasses : isToday ? 5 : seedWater[i % seedWater.length];
      const waterGoal = waterEntry?.goal || 8;
      const waterMl = glassesLogged * 250;
      const waterGoalMl = waterGoal * 250;

      const routineScore = Math.min(50, Math.round((stepsLogged / stepGoal) * 50));
      const waterScore = Math.min(50, Math.round((glassesLogged / waterGoal) * 50));
      const glowScore = Math.min(100, routineScore + waterScore);

      list.push({
        date: iso,
        label: isToday ? 'Today' : weekday,
        fullDate: monthDay,
        isToday,
        routineSteps: stepsLogged,
        routineGoal: stepGoal,
        waterGlasses: glassesLogged,
        waterGoal,
        waterMl,
        waterGoalMl,
        waterDisplay: waterUnit === 'glasses' ? glassesLogged : waterMl,
        waterGoalDisplay: waterUnit === 'glasses' ? waterGoal : waterGoalMl,
        glowScore,
        streakKept: stepsLogged >= 4 && glassesLogged >= 6,
      });
    }
    return list;
  }, [daysCount, progress, todayDone, waterLogs, todayKey, waterUnit]);

  const handleQuickWaterAdd = () => {
    const current = waterLogs[todayKey]?.glasses ?? 0;
    const goal = waterLogs[todayKey]?.goal ?? 8;
    const next = Math.min(16, current + 1);
    setWaterLogs((prev) => ({
      ...prev,
      [todayKey]: { glasses: next, goal },
    }));
    toast.success(`Logged +1 glass of water (${next} of ${goal} glasses today)`);
  };

  const handleQuickStepToggle = () => {
    const steps = ['am-1', 'am-2', 'am-3', 'am-4', 'pm-1', 'pm-2', 'pm-3', 'pm-4'];
    const undone = steps.find((s) => !todayDone.includes(s));
    if (undone) {
      toggleStep(undone);
      toast.success('Completed skincare routine step!');
    } else {
      toast.info('All daily routine steps are already completed today! Great job!');
    }
  };

  const currentStreak = streak();
  const totalWaterWeekly = chartData.reduce((acc, d) => acc + d.waterMl, 0);
  const avgWaterGlasses = (chartData.reduce((acc, d) => acc + d.waterGlasses, 0) / chartData.length).toFixed(1);
  const daysHitWaterGoal = chartData.filter((d) => d.waterGlasses >= d.waterGoal).length;
  const daysHitRoutineGoal = chartData.filter((d) => d.routineSteps >= d.routineGoal).length;
  const avgGlowScore = Math.round(chartData.reduce((acc, d) => acc + d.glowScore, 0) / chartData.length);

  return (
    <div
      className={cn(
        'rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft space-y-6',
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Performance Analytics
            </span>
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
            Weekly Streaks & Hydration Trends
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor consecutive skincare consistency and daily cellular water intake with interactive Recharts visualizations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full bg-secondary p-1 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('dual')}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold transition-all cursor-pointer',
                viewMode === 'dual'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Dual Overview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('water')}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold transition-all cursor-pointer',
                viewMode === 'water'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Droplets className="h-3.5 w-3.5 text-sky-400" />
              <span>Water Intake</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('routines')}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold transition-all cursor-pointer',
                viewMode === 'routines'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Flame className="h-3.5 w-3.5 text-amber-300" />
              <span>Routine Streaks</span>
            </button>
          </div>

          <div className="flex rounded-full border border-border bg-background p-1 text-xs">
            <button
              type="button"
              onClick={() => setTimeRange('7days')}
              className={cn(
                'rounded-full px-2.5 py-1 font-semibold transition-colors cursor-pointer',
                timeRange === '7days' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground'
              )}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('14days')}
              className={cn(
                'rounded-full px-2.5 py-1 font-semibold transition-colors cursor-pointer',
                timeRange === '14days' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground'
              )}
            >
              14 Days
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shadow-2xs"
            title="Export streaks and water trends as high-res shareable image"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share Stats</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative overflow-hidden rounded-2xl border border-amber-200/60 dark:border-amber-900/50 bg-gradient-to-br from-amber-500/10 via-background to-rose-500/5 p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Active Streak
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-foreground">
              {currentStreak}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">days unbroken</span>
          </div>
          <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">
            {daysHitRoutineGoal} of {daysCount} days completed full skincare regimen
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-sky-200/60 dark:border-sky-900/50 bg-gradient-to-br from-sky-500/10 via-background to-blue-500/5 p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">
              Avg. Hydration
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-600 dark:text-sky-400">
              <Droplets className="h-4 w-4 fill-sky-500 text-sky-500" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-foreground">
              {avgWaterGlasses}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">glasses / day</span>
          </div>
          <p className="mt-1 text-xs text-sky-800 dark:text-sky-300">
            {(totalWaterWeekly / 1000).toFixed(1)} Liters total water drank this period
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-emerald-200/60 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-500/10 via-background to-teal-500/5 p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Hydration Goals
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-foreground">
              {Math.round((daysHitWaterGoal / daysCount) * 100)}%
            </span>
            <span className="text-xs font-semibold text-muted-foreground">success rate</span>
          </div>
          <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-300">
            {daysHitWaterGoal} of {daysCount} days achieved 8 glasses (2,000ml)
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-purple-200/60 dark:border-purple-900/50 bg-gradient-to-br from-purple-500/10 via-background to-primary/5 p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-400">
              Glow Synergy
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400">
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-foreground">
              {avgGlowScore}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">/ 100 score</span>
          </div>
          <p className="mt-1 text-xs text-purple-800 dark:text-purple-300">
            Combined routine consistency & internal cellular hydration
          </p>
        </div>
      </div>

      {/* Recharts Component */}
      <div className="rounded-2xl border border-border bg-card/60 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="font-display text-lg font-bold text-foreground">
              {viewMode === 'dual' && 'Dual Correlation: Daily Steps Completed vs. Glasses Drank'}
              {viewMode === 'water' && 'Daily Water Intake Trend (8 Glasses / 2,000 mL Goal)'}
              {viewMode === 'routines' && 'Daily Skincare Steps Completed (8 Step AM + PM Regimen)'}
            </h3>
          </div>
          {viewMode === 'water' && (
            <div className="flex items-center gap-1 rounded-full border border-border bg-background p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setWaterUnit('glasses')}
                className={cn(
                  'rounded-full px-2.5 py-0.5 font-semibold cursor-pointer transition-colors',
                  waterUnit === 'glasses' ? 'bg-sky-500 text-white' : 'text-muted-foreground'
                )}
              >
                Glasses (8x)
              </button>
              <button
                type="button"
                onClick={() => setWaterUnit('ml')}
                className={cn(
                  'rounded-full px-2.5 py-0.5 font-semibold cursor-pointer transition-colors',
                  waterUnit === 'ml' ? 'bg-sky-500 text-white' : 'text-muted-foreground'
                )}
              >
                Milliliters (2,000ml)
              </button>
            </div>
          )}
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'dual' ? (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="routineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e11d48" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#fb7185" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#888888' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#888888' }} domain={[0, 10]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-border bg-card/95 p-3.5 shadow-xl backdrop-blur-md text-xs space-y-1.5">
                          <div className="font-bold text-foreground border-b border-border/80 pb-1 flex items-center justify-between">
                            <span>{data.fullDate} {data.isToday && '(Today)'}</span>
                            <span className="text-primary font-display font-semibold">
                              Glow: {data.glowScore}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-rose-500 font-semibold">
                            <span>Skincare Steps:</span>
                            <span>{data.routineSteps} / 8 steps</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-sky-500 font-semibold">
                            <span>Water Hydration:</span>
                            <span>{data.waterGlasses} glasses ({data.waterMl} ml)</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12 }}
                />
                <ReferenceLine y={8} stroke="#10b981" strokeDasharray="3 3" />
                <Bar
                  dataKey="routineSteps"
                  name="Skincare Steps"
                  fill="url(#routineGradient)"
                  radius={[6, 6, 0, 0]}
                  barSize={18}
                />
                <Bar
                  dataKey="waterGlasses"
                  name="Water Glasses"
                  fill="url(#waterGradient)"
                  radius={[6, 6, 0, 0]}
                  barSize={18}
                />
              </BarChart>
            ) : viewMode === 'water' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="pureWaterGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#888888' }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#888888' }}
                  domain={[0, waterUnit === 'glasses' ? 12 : 3000]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-sky-200 dark:border-sky-800 bg-card/95 p-3.5 shadow-xl backdrop-blur-md text-xs space-y-1.5">
                          <div className="font-bold text-foreground border-b border-border/80 pb-1">
                            {data.fullDate} {data.isToday && '• Today'}
                          </div>
                          <div className="flex items-center justify-between gap-4 text-sky-600 dark:text-sky-400 font-bold">
                            <span>Water Drank:</span>
                            <span>{data.waterGlasses} glasses ({data.waterMl} ml)</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="waterDisplay"
                  name={waterUnit === 'glasses' ? 'Water Glasses' : 'Water Volume (ml)'}
                  stroke="#0284c7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#pureWaterGradient)"
                />
              </AreaChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="streakGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#888888' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#888888' }} domain={[0, 10]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-card/95 p-3.5 shadow-xl backdrop-blur-md text-xs space-y-1.5">
                          <div className="font-bold text-foreground border-b border-border/80 pb-1">
                            {data.fullDate} {data.isToday && '• Today'}
                          </div>
                          <div className="flex items-center justify-between gap-4 text-amber-600 dark:text-amber-400 font-bold">
                            <span>Steps Finished:</span>
                            <span>{data.routineSteps} / 8</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="routineSteps"
                  name="Skincare Steps"
                  fill="url(#streakGradient)"
                  radius={[8, 8, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-4 w-4 text-sky-500 flex-shrink-0" />
            <span>
              Consistent cellular hydration multiplies topical hyaluronic acid & ceramide efficacy by up to 28%.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleQuickWaterAdd}
              className="bg-sky-500 hover:bg-sky-600 text-white border-none shadow-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Log +1 Glass Today
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleQuickStepToggle}
              className="border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40"
            >
              <Flame className="h-3.5 w-3.5 mr-1 text-amber-500" /> Complete Routine Step
            </Button>
          </div>
        </div>
      </div>

      <SocialShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareContext={{
          type: 'general',
          title: 'My Weekly Skincare Trends',
        }}
      />
    </div>
  );
}
