import React, { useState } from 'react';
import {
  X,
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
  Calendar,
  Share2,
  Sparkle
} from 'lucide-react';
import { EvaluatedAchievement } from '../hooks/useAchievements';
import { SocialShareModal } from './SocialShareModal';
import { Button } from './Button';
import { cn } from '../utils/cn';

interface BadgeModalProps {
  achievement: EvaluatedAchievement | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BadgeModal({ achievement, isOpen, onClose }: BadgeModalProps) {
  const [socialShareOpen, setSocialShareOpen] = useState(false);
  if (!isOpen || !achievement) return null;

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

  const formattedDate = achievement.unlockedAt
    ? new Date(achievement.unlockedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
        <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-border bg-card p-6 sm:p-8 shadow-2xl animate-scale-up">
          {/* Ambient Glow */}
          <div
            className={cn(
              'absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full blur-3xl opacity-30 pointer-events-none',
              achievement.unlocked ? 'bg-gradient-to-r ' + achievement.gradient : 'bg-muted'
            )}
          />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer z-10"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Badge Icon Emblem */}
          <div className="flex flex-col items-center text-center pt-2">
            <div className="relative my-4">
              {achievement.unlocked && (
                <div
                  className={cn(
                    'absolute -inset-3 rounded-full bg-gradient-to-tr blur-md opacity-70 animate-pulse',
                    achievement.gradient
                  )}
                />
              )}
              <div
                className={cn(
                  'relative flex h-28 w-28 items-center justify-center rounded-full shadow-lg border-2 transition-transform duration-300 hover:scale-105',
                  achievement.unlocked
                    ? `bg-gradient-to-tr ${achievement.gradient} text-white ${achievement.badgeBorder}`
                    : 'bg-muted/80 text-muted-foreground border-border/80'
                )}
              >
                {renderIcon(achievement.iconName, 'h-14 w-14 stroke-[1.8]')}
              </div>

              {achievement.unlocked ? (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-0.5 text-[11px] font-bold tracking-wider uppercase text-white shadow-md">
                  <CheckCircle2 className="h-3 w-3 stroke-[3]" /> Unlocked
                </span>
              ) : (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-0.5 text-[11px] font-semibold uppercase text-muted-foreground shadow-2xs">
                  In Progress
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
                {achievement.tier} Tier
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground capitalize">
                {achievement.category}
              </span>
            </div>

            <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
              {achievement.title}
            </h3>
            <p className="mt-2 text-sm text-foreground/80 leading-relaxed px-2">
              {achievement.description}
            </p>

            <div className="mt-6 w-full rounded-2xl border border-border/80 bg-secondary/40 p-4 text-left">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-2">
                <span className="text-muted-foreground">Requirement</span>
                <span>
                  {achievement.currentValue} / {achievement.target}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-border/70 p-0.5">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    achievement.unlocked ? `bg-gradient-to-r ${achievement.gradient}` : 'bg-primary/70'
                  )}
                  style={{ width: `${achievement.progressPercent}%` }}
                />
              </div>
              <p className="mt-2.5 text-xs text-muted-foreground">
                {achievement.requirementDescription}
              </p>
              {formattedDate && (
                <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-border/50 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  <Calendar className="h-3 w-3" />
                  <span>Earned on {formattedDate}</span>
                </div>
              )}
            </div>

            <div className="mt-5 rounded-xl bg-card border border-border/60 p-3.5 text-left flex items-start gap-2.5">
              <Sparkle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs italic text-muted-foreground leading-relaxed">
                "{achievement.quote}"
              </p>
            </div>

            <div className="mt-6 flex w-full gap-3">
              <Button
                variant="outline"
                size="md"
                className="flex-1"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={() => setSocialShareOpen(true)}
              >
                <Share2 className="h-4 w-4 mr-1.5" /> Share Badge
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SocialShareModal
        isOpen={socialShareOpen}
        onClose={() => setSocialShareOpen(false)}
        shareContext={{
          type: 'badge_unlocked',
          badgeName: achievement.title,
          title: `Unlocked "${achievement.title}" Badge!`,
        }}
      />
    </>
  );
}
