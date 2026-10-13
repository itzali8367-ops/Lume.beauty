import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Sparkles,
  Download,
  Copy,
  Check,
  Share2,
  Layers,
  Image as ImageIcon,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRoutineProgress, getTodayDateString } from '../hooks/useRoutineProgress';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useUserAccount } from '../hooks/useUserAccount';
import { useAchievements } from '../hooks/useAchievements';
import { Button } from './Button';
import { cn } from '../utils/cn';

export type ProgressShareTheme = 'rose-silk' | 'emerald-sage' | 'sunset-glow' | 'midnight-luxe';
export type ProgressShareAspect = '4:5' | '9:16' | '1:1';

interface ThemeConfig {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentGold: string;
  waterColor: string;
  bgColor: string;
  cardBg: string;
  textColor: string;
  subtextColor: string;
  barColorSteps: string;
  barColorWater: string;
  badgeBg: string;
  badgeText: string;
}

const shareThemes: Record<ProgressShareTheme, ThemeConfig> = {
  'rose-silk': {
    name: 'Rose Silk',
    primaryColor: '#D6456B',
    secondaryColor: '#FCE7ED',
    accentGold: '#D97706',
    waterColor: '#0284C7',
    bgColor: '#FFF5F6',
    cardBg: 'rgba(255, 255, 255, 0.90)',
    textColor: '#3F1E28',
    subtextColor: '#7C4A5A',
    barColorSteps: '#D6456B',
    barColorWater: '#38BDF8',
    badgeBg: '#FCE7ED',
    badgeText: '#A82B50',
  },
  'emerald-sage': {
    name: 'Emerald Sage',
    primaryColor: '#059669',
    secondaryColor: '#D1FAE5',
    accentGold: '#D97706',
    waterColor: '#0284C7',
    bgColor: '#F0FDF4',
    cardBg: 'rgba(255, 255, 255, 0.90)',
    textColor: '#064E3B',
    subtextColor: '#047857',
    barColorSteps: '#10B981',
    barColorWater: '#06B6D4',
    badgeBg: '#ECFDF5',
    badgeText: '#065F46',
  },
  'sunset-glow': {
    name: 'Sunset Glow',
    primaryColor: '#EA580C',
    secondaryColor: '#FFEDD5',
    accentGold: '#D97706',
    waterColor: '#0284C7',
    bgColor: '#FFF7ED',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    textColor: '#7C2D12',
    subtextColor: '#9A3412',
    barColorSteps: '#F97316',
    barColorWater: '#0EA5E9',
    badgeBg: '#FFEDD5',
    badgeText: '#C2410C',
  },
  'midnight-luxe': {
    name: 'Midnight Luxe',
    primaryColor: '#818CF8',
    secondaryColor: '#312E81',
    accentGold: '#FBBF24',
    waterColor: '#38BDF8',
    bgColor: '#0F172A',
    cardBg: 'rgba(30, 41, 59, 0.90)',
    textColor: '#F8FAFC',
    subtextColor: '#94A3B8',
    barColorSteps: '#6366F1',
    barColorWater: '#38BDF8',
    badgeBg: '#1E293B',
    badgeText: '#93C5FD',
  },
};

interface ProgressShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProgressShareModal({ isOpen, onClose }: ProgressShareModalProps) {
  const { streak, last7Days, todayDone } = useRoutineProgress();
  const { account } = useUserAccount();
  const { achievements, unlockedCount } = useAchievements();
  const todayKey = getTodayDateString();
  const [waterLogs] = useLocalStorage<Record<string, { glasses: number; goal: number }>>(
    'lumie.water_intake',
    { [todayKey]: { glasses: 6, goal: 8 } }
  );

  const [theme, setTheme] = useState<ProgressShareTheme>('rose-silk');
  const [aspect, setAspect] = useState<ProgressShareAspect>('4:5');
  const [includeBadges, setIncludeBadges] = useState(true);
  const [includeWater, setIncludeWater] = useState(true);
  const [customHeadline, setCustomHeadline] = useState(
    account?.name ? `${account.name}'s Glow Journey` : 'My Weekly Glow Progress'
  );
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeTheme = shareThemes[theme];
  const days = last7Days();
  const currentStreak = streak();
  const totalSteps = days.reduce((acc, d) => acc + d.count, 0);

  const waterData = days.map((d) => {
    const entry = waterLogs[d.date];
    return {
      date: d.date,
      dayName: d.label,
      glasses: entry?.glasses ?? (d.date === todayKey ? 6 : 7),
      goal: entry?.goal ?? 8,
      steps: d.count || (d.date === todayKey ? todayDone.length : 6),
    };
  });

  const totalWaterGlasses = waterData.reduce((acc, d) => acc + d.glasses, 0);
  const avgWater = (totalWaterGlasses / Math.max(1, waterData.length)).toFixed(1);
  const glowScore = Math.min(100, Math.round(((totalSteps / 42) * 50) + ((totalWaterGlasses / 56) * 50)));
  const unlockedBadges = achievements.filter((a) => a.unlocked).slice(0, 3);

  const renderCardToCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsGenerating(true);

    let width = 1080;
    let height = 1350;
    if (aspect === '9:16') {
      height = 1920;
    } else if (aspect === '1:1') {
      height = 1080;
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (theme === 'midnight-luxe') {
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(0.5, '#1E293B');
      grad.addColorStop(1, '#0B0F19');
    } else if (theme === 'emerald-sage') {
      grad.addColorStop(0, '#F0FDF4');
      grad.addColorStop(0.5, '#DCFCE7');
      grad.addColorStop(1, '#BBF7D0');
    } else if (theme === 'sunset-glow') {
      grad.addColorStop(0, '#FFF7ED');
      grad.addColorStop(0.5, '#FFEDD5');
      grad.addColorStop(1, '#FED7AA');
    } else {
      grad.addColorStop(0, '#FFF5F6');
      grad.addColorStop(0.5, '#FCE7ED');
      grad.addColorStop(1, '#F7D0DC');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const margin = 48;
    ctx.strokeStyle = activeTheme.primaryColor + '40';
    ctx.lineWidth = 3;
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    ctx.strokeStyle = activeTheme.accentGold + '80';
    ctx.lineWidth = 1;
    ctx.strokeRect(margin + 10, margin + 10, width - (margin + 10) * 2, height - (margin + 10) * 2);

    let curY = margin + 55;
    ctx.textAlign = 'center';
    ctx.fillStyle = activeTheme.primaryColor;
    ctx.font = '600 24px Inter, sans-serif';
    ctx.fillText('L U M I   •   S K I N   W E L L N E S S', width / 2, curY);

    curY += 50;
    ctx.fillStyle = activeTheme.textColor;
    ctx.font = '700 44px Fraunces, Georgia, serif';
    ctx.fillText(customHeadline, width / 2, curY);

    curY += 34;
    const startDate = days[0]?.date || 'This Week';
    const endDate = days[days.length - 1]?.date || 'Today';
    ctx.fillStyle = activeTheme.subtextColor;
    ctx.font = '500 20px Inter, sans-serif';
    ctx.fillText(`Weekly Consistency Snapshot • ${startDate} to ${endDate}`, width / 2, curY);

    curY += 45;

    function drawCard(x: number, y: number, w: number, h: number, radius = 24) {
      if (!ctx) return;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.fillStyle = activeTheme.cardBg;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = activeTheme.primaryColor + '20';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }

    const cardGap = 24;
    const cardWidth = (width - margin * 2 - 40 - cardGap) / 2;
    const statCardHeight = 155;
    const cardStartX = margin + 20;

    drawCard(cardStartX, curY, cardWidth, statCardHeight);
    ctx.textAlign = 'left';
    ctx.font = '600 20px Inter, sans-serif';
    ctx.fillStyle = activeTheme.primaryColor;
    ctx.fillText('🔥 CURRENT GLOW STREAK', cardStartX + 28, curY + 42);
    ctx.font = '700 52px Fraunces, Georgia, serif';
    ctx.fillStyle = activeTheme.textColor;
    ctx.fillText(`${currentStreak} Days`, cardStartX + 28, curY + 100);

    const card2X = cardStartX + cardWidth + cardGap;
    drawCard(card2X, curY, cardWidth, statCardHeight);
    ctx.font = '600 20px Inter, sans-serif';
    ctx.fillStyle = activeTheme.primaryColor;
    ctx.fillText('✨ RADIANCE SCORE', card2X + 28, curY + 42);
    ctx.font = '700 52px Fraunces, Georgia, serif';
    ctx.fillStyle = activeTheme.textColor;
    ctx.fillText(`${glowScore}%`, card2X + 28, curY + 100);

    curY += statCardHeight + 35;

    if (includeWater) {
      const fullWidth = width - margin * 2 - 40;
      const metricsHeight = 100;
      drawCard(cardStartX, curY, fullWidth, metricsHeight);

      ctx.font = '600 20px Inter, sans-serif';
      ctx.fillStyle = activeTheme.waterColor;
      ctx.fillText('💧 Daily Water Hydration', cardStartX + 30, curY + 42);
      ctx.font = '700 28px Fraunces, Georgia, serif';
      ctx.fillStyle = activeTheme.textColor;
      ctx.fillText(`${avgWater} glasses/day avg`, cardStartX + 30, curY + 76);

      const col2X = cardStartX + fullWidth * 0.54;
      ctx.font = '600 20px Inter, sans-serif';
      ctx.fillStyle = activeTheme.primaryColor;
      ctx.fillText('💧 Total Weekly Volume', col2X, curY + 42);
      ctx.font = '700 28px Fraunces, Georgia, serif';
      ctx.fillStyle = activeTheme.textColor;
      ctx.fillText(`${totalWaterGlasses * 250} ml hydrated`, col2X, curY + 76);

      curY += metricsHeight + 35;
    }

    const chartHeight = aspect === '9:16' ? 320 : aspect === '1:1' ? 210 : 260;
    const chartWidth = width - margin * 2 - 40;
    drawCard(cardStartX, curY, chartWidth, chartHeight);

    ctx.font = '600 22px Fraunces, Georgia, serif';
    ctx.fillStyle = activeTheme.textColor;
    ctx.fillText('Weekly Consistency & Hydration Trends', cardStartX + 30, curY + 42);

    const chartPlotY = curY + 70;
    const chartPlotHeight = chartHeight - 110;
    const colWidth = (chartWidth - 60) / 7;

    waterData.forEach((day, i) => {
      const xCenter = cardStartX + 30 + i * colWidth + colWidth / 2;
      const barW = Math.min(24, colWidth * 0.35);
      const stepVal = Math.min(10, day.steps);
      const waterVal = Math.min(10, day.glasses);
      const hSteps = (stepVal / 10) * chartPlotHeight;
      const hWater = (waterVal / 10) * chartPlotHeight;
      const baselineY = chartPlotY + chartPlotHeight;

      ctx.fillStyle = activeTheme.barColorSteps;
      ctx.beginPath();
      ctx.roundRect(xCenter - barW - 3, baselineY - hSteps, barW, hSteps, [6, 6, 0, 0]);
      ctx.fill();

      ctx.fillStyle = activeTheme.barColorWater;
      ctx.beginPath();
      ctx.roundRect(xCenter + 3, baselineY - hWater, barW, hWater, [6, 6, 0, 0]);
      ctx.fill();

      ctx.textAlign = 'center';
      ctx.font = '600 16px Inter, sans-serif';
      ctx.fillStyle = activeTheme.subtextColor;
      ctx.fillText(day.dayName, xCenter, baselineY + 24);
    });

    curY += chartHeight + 35;

    if (includeBadges && aspect !== '1:1') {
      const badgesWidth = width - margin * 2 - 40;
      const badgesHeight = 145;
      drawCard(cardStartX, curY, badgesWidth, badgesHeight);

      ctx.textAlign = 'left';
      ctx.font = '600 20px Inter, sans-serif';
      ctx.fillStyle = activeTheme.accentGold;
      ctx.fillText(`🏆 ACQUIRED BADGES (${unlockedCount} UNLOCKED)`, cardStartX + 30, curY + 38);

      const badgeDisplayList = unlockedBadges.length > 0 ? unlockedBadges : achievements.slice(0, 3);
      const bSlotW = (badgesWidth - 60) / 3;

      badgeDisplayList.forEach((badge, idx) => {
        const bx = cardStartX + 30 + idx * bSlotW;
        const by = curY + 54;

        ctx.fillStyle = badge.unlocked ? activeTheme.badgeBg : 'rgba(0,0,0,0.05)';
        ctx.beginPath();
        ctx.roundRect(bx, by, bSlotW - 15, 68, 16);
        ctx.fill();

        ctx.textAlign = 'left';
        ctx.font = '700 18px Fraunces, Georgia, serif';
        ctx.fillStyle = badge.unlocked ? activeTheme.textColor : activeTheme.subtextColor;
        ctx.fillText(badge.title, bx + 16, by + 32);
      });
    }

    const footerY = height - margin - 25;
    ctx.textAlign = 'center';
    ctx.font = '500 18px Inter, sans-serif';
    ctx.fillStyle = activeTheme.subtextColor;
    ctx.fillText('Generated on Lumi • Verified Consistency Journal • lumie.glow', width / 2, footerY);

    const dataUrl = canvas.toDataURL('image/png', 0.95);
    setGeneratedImageUrl(dataUrl);
    setIsGenerating(false);
  }, [
    aspect,
    theme,
    includeBadges,
    includeWater,
    customHeadline,
    days,
    currentStreak,
    glowScore,
    totalSteps,
    waterData,
    avgWater,
    totalWaterGlasses,
    unlockedBadges,
    unlockedCount,
    activeTheme,
    achievements,
  ]);

  useEffect(() => {
    if (isOpen) {
      renderCardToCanvas();
    }
  }, [isOpen, renderCardToCanvas]);

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const a = document.createElement('a');
    a.href = generatedImageUrl;
    a.download = `lumie-glow-progress-${todayKey}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Downloaded your progress image card!');
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        toast.success('Progress card copied to clipboard!');
        setTimeout(() => setCopied(false), 2500);
      });
    } catch {
      handleDownload();
      toast.info('Direct clipboard copy restricted. Downloaded PNG instead!');
    }
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (navigator.share) {
      try {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], `lumie-progress-${todayKey}.png`, { type: 'image/png' });
          await navigator.share({
            title: customHeadline,
            text: `Tracking my skincare streaks and hydration journey on Lumi! Currently at a ${currentStreak}-day glow streak! ✨`,
            files: [file],
          });
          toast.success('Shared your wellness journey!');
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 overflow-y-auto bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-5xl rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-7 shadow-2xl my-auto max-h-[94vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border/80 pb-4 sm:pb-5 pr-2">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-2xs flex-shrink-0">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
                Export Shareable Progress Snapshot
              </h2>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Generate high-resolution aesthetic wellness cards with streaks, water intake trends, and badges
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer flex-shrink-0"
            aria-label="Close export modal"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        <div className="mt-5 sm:mt-6 grid gap-6 lg:gap-8 lg:grid-cols-12 items-start">
          <div className="space-y-6 lg:col-span-5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">
                Card Headline
              </label>
              <input
                type="text"
                value={customHeadline}
                onChange={(e) => setCustomHeadline(e.target.value)}
                maxLength={45}
                className="w-full rounded-2xl border border-border bg-secondary/40 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
                Social Format / Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAspect('4:5')}
                  className={cn(
                    'flex flex-col items-center justify-center rounded-2xl border p-3 text-xs font-semibold transition-all cursor-pointer',
                    aspect === '4:5'
                      ? 'border-primary bg-primary/10 text-primary shadow-2xs'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                  )}
                >
                  <ImageIcon className="h-4 w-4 mb-1" />
                  <span>4:5 Feed</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAspect('9:16')}
                  className={cn(
                    'flex flex-col items-center justify-center rounded-2xl border p-3 text-xs font-semibold transition-all cursor-pointer',
                    aspect === '9:16'
                      ? 'border-primary bg-primary/10 text-primary shadow-2xs'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                  )}
                >
                  <Smartphone className="h-4 w-4 mb-1" />
                  <span>9:16 Story</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAspect('1:1')}
                  className={cn(
                    'flex flex-col items-center justify-center rounded-2xl border p-3 text-xs font-semibold transition-all cursor-pointer',
                    aspect === '1:1'
                      ? 'border-primary bg-primary/10 text-primary shadow-2xs'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                  )}
                >
                  <Layers className="h-4 w-4 mb-1" />
                  <span>1:1 Square</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
                Color Palette & Mood
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(shareThemes) as ProgressShareTheme[]).map((tKey) => {
                  const t = shareThemes[tKey];
                  const active = theme === tKey;
                  return (
                    <button
                      key={tKey}
                      type="button"
                      onClick={() => setTheme(tKey)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-2xl border p-3 text-left transition-all cursor-pointer',
                        active
                          ? 'border-primary bg-primary/10 text-foreground ring-1 ring-primary'
                          : 'border-border bg-card hover:border-primary/30'
                      )}
                    >
                      <div
                        className="h-5 w-5 rounded-full border border-black/10 flex-shrink-0"
                        style={{ backgroundColor: t.primaryColor }}
                      />
                      <span className="text-xs font-semibold">{t.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleDownload}
                className="w-full shadow-md"
              >
                <Download className="h-4 w-4 mr-2" />
                Download High-Res PNG
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleCopy}
                  className="w-full"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1.5 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1.5" />
                      Copy Image
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleShare}
                  className="w-full"
                >
                  <Share2 className="h-4 w-4 mr-1.5 text-primary" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative w-full rounded-2xl bg-secondary/50 p-4 border border-border/80 flex flex-col items-center">
              <span className="text-[11px] font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-primary" /> Real-time Canvas Preview
              </span>
              <div
                className={cn(
                  'w-full max-w-[420px] rounded-2xl overflow-hidden shadow-2xl border border-border/80 bg-white transition-all',
                  aspect === '4:5' && 'aspect-[4/5]',
                  aspect === '9:16' && 'aspect-[9/16] max-w-[340px]',
                  aspect === '1:1' && 'aspect-square'
                )}
              >
                {generatedImageUrl ? (
                  <img
                    src={generatedImageUrl}
                    alt="Progress Shareable Card Preview"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                    <RefreshCw className="h-5 w-5 animate-spin mr-2" /> Rendering card...
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
