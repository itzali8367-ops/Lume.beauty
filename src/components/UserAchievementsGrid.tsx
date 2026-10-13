import React, { useState } from 'react';
import {
  Flame,
  Droplets,
  Sun,
  Moon,
  Sparkles,
  Camera,
  Layers,
  Heart,
  Award,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Trophy,
} from 'lucide-react';
import { useAchievements, EvaluatedAchievement } from '../hooks/useAchievements';
import { BadgeModal } from './BadgeModal';
import { cn } from '../utils/cn';

export function UserAchievementsGrid() {
  const { achievements, unlockedCount, totalCount, overallPercentage, userTier } = useAchievements();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked' | 'streak' | 'hydration'>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<EvaluatedAchievement | null>(null);

  const filteredAchievements = achievements.filter((ach) => {
    if (filter === 'unlocked') return ach.unlocked;
    if (filter === 'locked') return !ach.unlocked;
    if (filter === 'streak') return ach.category === 'streak';
    if (filter === 'hydration') return ach.category === 'hydration';
    return true;
  });

  const renderIcon = (name: string, className?: string) => {
    switch (name) {
      case 'Flame':
        return <Flame className={className} />;
      case 'Droplets':
        return <Droplets className={className} />;
      case 'Sun':
        return <Sun className={className} />;
      case 'Moon':
        return <Moon className={className} />;
      case 'Camera':
        return <Camera className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Heart':
        return <Heart className={className} />;
      case 'Award':
        return <Award className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Sparkles':
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Tier & Overall Progress Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-gradient-to-br from-card via-card to-secondary/30 p-6 sm:p-8 shadow-sm">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 text-white shadow-md">
              <Trophy className="h-8 w-8 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-accent/20 px-3 py-0.5 text-xs font-semibold text-accent uppercase tracking-wider">
                  {userTier.badge}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Level {userTier.level}
                </span>
              </div>
              <h3 className="mt-1 font-display text-2xl font-bold text-foreground">
                {userTier.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Complete daily rituals, maintain water intake, and explore community routines to unlock badges.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-background/80 p-4 sm:min-w-[260px] backdrop-blur shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-1.5">
              <span>Collection Progress</span>
              <span className="text-primary font-bold">
                {unlockedCount} / {totalCount} Badges ({overallPercentage}%)
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{totalCount - unlockedCount} remaining to earn</span>
              <span>Next tier: Level {userTier.level < 4 ? userTier.level + 1 : 4}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
              filter === 'all'
                ? 'bg-primary text-primary-foreground shadow-2xs'
                : 'bg-card border border-border text-foreground hover:border-primary/50'
            )}
          >
            All Badges ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unlocked')}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5',
              filter === 'unlocked'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-card border border-border text-foreground hover:border-emerald-600/50'
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Unlocked ({unlockedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('locked')}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5',
              filter === 'locked'
                ? 'bg-primary text-primary-foreground shadow-2xs'
                : 'bg-card border border-border text-foreground hover:border-primary/50'
            )}
          >
            <Lock className="h-3.5 w-3.5" /> In Progress ({totalCount - unlockedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('streak')}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5',
              filter === 'streak'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-card border border-border text-foreground hover:border-amber-600/50'
            )}
          >
            <Flame className="h-3.5 w-3.5" /> Streaks
          </button>
          <button
            type="button"
            onClick={() => setFilter('hydration')}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5',
              filter === 'hydration'
                ? 'bg-cyan-600 text-white shadow-2xs'
                : 'bg-card border border-border text-foreground hover:border-cyan-600/50'
            )}
          >
            <Droplets className="h-3.5 w-3.5" /> Hydration
          </button>
        </div>
        <span className="text-xs text-muted-foreground hidden sm:block">
          Click any badge to inspect criteria & share
        </span>
      </div>

      {/* Badges Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAchievements.map((ach) => (
          <div
            key={ach.id}
            onClick={() => setSelectedAchievement(ach)}
            className={cn(
              'group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-5 transition-all duration-300 cursor-pointer hover:shadow-md hover:-translate-y-1',
              ach.unlocked
                ? 'border-border/80 bg-card hover:border-primary/60'
                : 'border-border/50 bg-secondary/20 hover:border-border'
            )}
          >
            <div>
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    'relative flex h-14 w-14 items-center justify-center rounded-2xl shadow-xs transition-transform duration-300 group-hover:scale-105',
                    ach.unlocked
                      ? `bg-gradient-to-tr ${ach.gradient} text-white shadow-md`
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {renderIcon(ach.iconName, 'h-7 w-7 stroke-[2]')}
                  {ach.unlocked && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                      ✓
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                      ach.unlocked
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                        : 'bg-secondary text-muted-foreground'
                    )}
                  >
                    {ach.unlocked ? 'Unlocked' : `${ach.progressPercent}%`}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground capitalize">
                    {ach.tier} tier
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {ach.title}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {ach.description}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-border/60">
              <div className="flex items-center justify-between text-[11px] font-medium text-foreground/80 mb-1.5">
                <span className="text-muted-foreground truncate max-w-[140px]">
                  {ach.requirementDescription}
                </span>
                <span className="font-semibold flex-shrink-0">
                  {ach.currentValue} / {ach.target}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    ach.unlocked
                      ? `bg-gradient-to-r ${ach.gradient}`
                      : 'bg-primary/50'
                  )}
                  style={{ width: `${ach.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <BadgeModal
        achievement={selectedAchievement}
        isOpen={!!selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
      />
    </div>
  );
}
