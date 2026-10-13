import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Sparkles,
  Download,
  Copy,
  Check,
  Heart,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { routines } from '../data/mockData';
import { useRoutineProgress, getTodayDateString } from '../hooks/useRoutineProgress';
import { useUserAccount } from '../hooks/useUserAccount';
import { useJournal } from '../hooks/useJournal';
import { getTodayAffirmation } from '../data/affirmations';
import { Button } from './Button';
import { cn } from '../utils/cn';

interface RoutineInfographicModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRoutineId?: string;
}

export type InfographicTheme = 'rose-silk' | 'botanical-sage' | 'golden-sunbeam' | 'midnight-luxe' | 'editorial-ivory';
export type InfographicAspect = '4:5' | '9:16' | '1:1';

interface ThemeConfig {
  name: string;
  badgeBg: string;
  badgeText: string;
  primaryColor: string;
  bgColor: string;
  cardBg: string;
  textColor: string;
  subtextColor: string;
  accentGold: string;
  gradient: string;
}

const themePresets: Record<InfographicTheme, ThemeConfig> = {
  'rose-silk': {
    name: 'Rose Silk',
    badgeBg: '#FCE7ED',
    badgeText: '#A82B50',
    primaryColor: '#D6456B',
    bgColor: '#FFF5F6',
    cardBg: 'rgba(255, 255, 255, 0.85)',
    textColor: '#3F1E28',
    subtextColor: '#7C4A5A',
    accentGold: '#E6A75E',
    gradient: 'linear-gradient(135deg, #FFF5F6 0%, #FCE7ED 50%, #F7D0DC 100%)',
  },
  'botanical-sage': {
    name: 'Botanical Sage',
    badgeBg: '#E2ECE4',
    badgeText: '#235937',
    primaryColor: '#2D6A4F',
    bgColor: '#F4F7F4',
    cardBg: 'rgba(255, 255, 255, 0.85)',
    textColor: '#1B382B',
    subtextColor: '#406352',
    accentGold: '#D89E4E',
    gradient: 'linear-gradient(135deg, #F4F7F4 0%, #E2ECE4 50%, #D0E0D4 100%)',
  },
  'golden-sunbeam': {
    name: 'Golden Sunbeam',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    primaryColor: '#D97706',
    bgColor: '#FFFBEB',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    textColor: '#451A03',
    subtextColor: '#78350F',
    accentGold: '#F59E0B',
    gradient: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)',
  },
  'midnight-luxe': {
    name: 'Midnight Luxe',
    badgeBg: '#1E293B',
    badgeText: '#93C5FD',
    primaryColor: '#60A5FA',
    bgColor: '#0F172A',
    cardBg: 'rgba(30, 41, 59, 0.85)',
    textColor: '#F8FAFC',
    subtextColor: '#94A3B8',
    accentGold: '#FBBF24',
    gradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
  },
  'editorial-ivory': {
    name: 'Editorial Ivory',
    badgeBg: '#E2E8F0',
    badgeText: '#0F172A',
    primaryColor: '#0F172A',
    bgColor: '#FAF9F6',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    textColor: '#0F172A',
    subtextColor: '#475569',
    accentGold: '#B45309',
    gradient: 'linear-gradient(135deg, #FAF9F6 0%, #F1F0EA 50%, #E5E3D8 100%)',
  },
};

export function RoutineInfographicModal({
  isOpen,
  onClose,
  defaultRoutineId = 'morning-skin',
}: RoutineInfographicModalProps) {
  const { account } = useUserAccount();
  const { streak } = useRoutineProgress();
  const { addEntry } = useJournal();

  const [selectedRoutineId, setSelectedRoutineId] = useState(defaultRoutineId);
  const [theme, setTheme] = useState<InfographicTheme>('rose-silk');
  const [aspect, setAspect] = useState<InfographicAspect>('4:5');
  const [showAffirmation, setShowAffirmation] = useState(true);
  const [showStreak, setShowStreak] = useState(true);
  const [customTitle, setCustomTitle] = useState(
    account?.name ? `${account.name}'s Glow Ritual` : 'Daily Skincare Ritual'
  );
  const [customSkinType, setCustomSkinType] = useState(account?.skinType || 'Combination');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedJournal, setSavedJournal] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRoutine = routines.find((r) => r.id === selectedRoutineId) || routines[0];
  const currentAffirmation = getTodayAffirmation();
  const activeTheme = themePresets[theme];

  const renderInfographicToCanvas = useCallback(async () => {
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

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (theme === 'rose-silk') {
      grad.addColorStop(0, '#FFF5F6');
      grad.addColorStop(0.5, '#FCE7ED');
      grad.addColorStop(1, '#F7D0DC');
    } else if (theme === 'botanical-sage') {
      grad.addColorStop(0, '#F4F7F4');
      grad.addColorStop(0.5, '#E2ECE4');
      grad.addColorStop(1, '#D0E0D4');
    } else if (theme === 'golden-sunbeam') {
      grad.addColorStop(0, '#FFFBEB');
      grad.addColorStop(0.5, '#FEF3C7');
      grad.addColorStop(1, '#FDE68A');
    } else if (theme === 'midnight-luxe') {
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(0.5, '#1E293B');
      grad.addColorStop(1, '#334155');
    } else {
      grad.addColorStop(0, '#FAF9F6');
      grad.addColorStop(0.5, '#F1F0EA');
      grad.addColorStop(1, '#E5E3D8');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Frame borders
    const margin = 50;
    ctx.strokeStyle = activeTheme.primaryColor + '33';
    ctx.lineWidth = 3;
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    ctx.strokeStyle = activeTheme.accentGold + '66';
    ctx.lineWidth = 1;
    ctx.strokeRect(margin + 12, margin + 12, width - (margin + 12) * 2, height - (margin + 12) * 2);

    // Corner decorative accents
    const cornerSize = 24;
    ctx.fillStyle = activeTheme.accentGold;
    ctx.fillRect(margin + 8, margin + 8, cornerSize, 3);
    ctx.fillRect(margin + 8, margin + 8, 3, cornerSize);
    ctx.fillRect(width - margin - 8 - cornerSize, margin + 8, cornerSize, 3);
    ctx.fillRect(width - margin - 11, margin + 8, 3, cornerSize);

    // Header
    let cursorY = margin + 70;
    ctx.font = "bold 32px 'Fraunces', Georgia, serif";
    ctx.fillStyle = activeTheme.primaryColor;
    ctx.textAlign = 'center';
    ctx.fillText('LUMI', width / 2, cursorY);

    cursorY += 28;
    ctx.font = "600 14px 'Inter', sans-serif";
    ctx.fillStyle = activeTheme.accentGold;
    ctx.letterSpacing = '4px';
    ctx.fillText('SKINCARE & WELLNESS RITUAL', width / 2, cursorY);

    cursorY += 55;
    ctx.font = "bold 44px 'Fraunces', Georgia, serif";
    ctx.fillStyle = activeTheme.textColor;
    ctx.letterSpacing = '0px';
    ctx.fillText(customTitle, width / 2, cursorY);

    cursorY += 34;
    ctx.font = "500 18px 'Inter', sans-serif";
    ctx.fillStyle = activeTheme.subtextColor;
    ctx.fillText(
      `${activeRoutine.name} • ${customSkinType} Skin • Step-by-Step Regimen`,
      width / 2,
      cursorY
    );

    if (showStreak) {
      cursorY += 45;
      const badgeText = `🔥 ${streak()} DAY CONSISTENCY STREAK`;
      ctx.font = "bold 15px 'Inter', sans-serif";
      const badgeWidth = ctx.measureText(badgeText).width + 36;
      const badgeX = width / 2 - badgeWidth / 2;
      const badgeY = cursorY - 24;
      ctx.fillStyle = activeTheme.badgeBg;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeWidth, 34, 17);
      ctx.fill();
      ctx.fillStyle = activeTheme.badgeText;
      ctx.fillText(badgeText, width / 2, cursorY);
    }

    // Steps list
    cursorY += 50;
    const cardWidth = width - margin * 2 - 80;
    const cardX = width / 2 - cardWidth / 2;
    const steps = activeRoutine.steps;
    const stepHeight = aspect === '9:16' ? 140 : 110;
    const stepSpacing = aspect === '9:16' ? 24 : 16;

    steps.forEach((step, index) => {
      const stepY = cursorY + index * (stepHeight + stepSpacing);
      ctx.fillStyle = activeTheme.cardBg;
      ctx.beginPath();
      ctx.roundRect(cardX, stepY, cardWidth, stepHeight, 22);
      ctx.fill();
      ctx.strokeStyle = activeTheme.primaryColor + '22';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const circleRadius = 24;
      const circleX = cardX + 45;
      const circleY = stepY + stepHeight / 2;
      ctx.fillStyle = activeTheme.primaryColor;
      ctx.beginPath();
      ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "bold 20px 'Fraunces', Georgia, serif";
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${index + 1}`, circleX, circleY);

      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = "bold 22px 'Fraunces', Georgia, serif";
      ctx.fillStyle = activeTheme.textColor;
      ctx.fillText(step.title, cardX + 90, stepY + 24);

      ctx.font = "400 15px 'Inter', sans-serif";
      ctx.fillStyle = activeTheme.subtextColor;
      ctx.fillText(step.description, cardX + 90, stepY + 56);
    });

    if (showAffirmation) {
      const affY = height - margin - 120;
      ctx.textAlign = 'center';
      ctx.font = "italic 16px 'Fraunces', Georgia, serif";
      ctx.fillStyle = activeTheme.textColor;
      const quote = `"${currentAffirmation.quote.slice(0, 110)}..."`;
      ctx.fillText(quote, width / 2, affY);

      ctx.font = "600 13px 'Inter', sans-serif";
      ctx.fillStyle = activeTheme.accentGold;
      ctx.fillText(`✨ Daily Practice: ${currentAffirmation.tip || 'Hydrate & nourish your natural barrier'}`, width / 2, affY + 28);
    }

    const footerY = height - margin - 40;
    ctx.textAlign = 'center';
    ctx.font = "500 13px 'Inter', sans-serif";
    ctx.fillStyle = activeTheme.subtextColor;
    ctx.fillText('Crafted with Lumi • Your Personal Beauty & Wellness Companion', width / 2, footerY);

    const url = canvas.toDataURL('image/png', 1.0);
    setGeneratedImageUrl(url);
    setIsGenerating(false);
  }, [
    selectedRoutineId,
    theme,
    aspect,
    showAffirmation,
    showStreak,
    customTitle,
    customSkinType,
    streak,
    activeRoutine,
    activeTheme,
    currentAffirmation,
  ]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        renderInfographicToCanvas();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, renderInfographicToCanvas]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const a = document.createElement('a');
    a.href = generatedImageUrl;
    a.download = `lumie-${selectedRoutineId}-infographic.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('High-resolution routine infographic downloaded!');
  };

  const handleCopyImage = async () => {
    if (!generatedImageUrl) return;
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error('Could not create image blob');
          return;
        }
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        toast.success('Infographic copied to clipboard!');
        setTimeout(() => setCopied(false), 2500);
      }, 'image/png');
    } catch {
      handleDownload();
      toast.info('Direct copy restricted. Downloaded image instead!');
    }
  };

  const handleSaveToJournal = () => {
    addEntry({
      date: getTodayDateString(),
      rating: 5,
      mood: 'Glowing',
      note: `Generated ${activeRoutine.name} Infographic (${activeTheme.name} Theme). Streak: ${streak()} days.`,
    });
    setSavedJournal(true);
    toast.success('Saved to your Glow Journal progress records!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-ink/60 backdrop-blur-xs" onClick={onClose} />
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative z-10 my-auto max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-[2.5rem] border border-border bg-card p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Aesthetic Image Creator
              </span>
              <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
                Personalized Skincare Routine Infographic
              </h2>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5 space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Target Routine
              </label>
              <div className="grid grid-cols-2 gap-2">
                {routines.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRoutineId(r.id)}
                    className={cn(
                      'rounded-xl border p-2.5 text-left text-xs font-medium transition-all cursor-pointer',
                      selectedRoutineId === r.id
                        ? 'border-primary bg-primary/10 text-primary font-semibold shadow-xs'
                        : 'border-border bg-card text-foreground hover:border-primary/40'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{r.name}</span>
                      {selectedRoutineId === r.id && <Check className="h-3 w-3" />}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{r.time}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center justify-between">
                <span>Color Palette & Aesthetic</span>
                <span className="font-normal text-primary">{activeTheme.name}</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {(Object.keys(themePresets) as InfographicTheme[]).map((tKey) => {
                  const t = themePresets[tKey];
                  return (
                    <button
                      key={tKey}
                      type="button"
                      onClick={() => setTheme(tKey)}
                      className={cn(
                        'flex flex-col items-center rounded-xl border p-2 text-center transition-all cursor-pointer',
                        theme === tKey
                          ? 'border-primary ring-2 ring-primary/30 shadow-xs'
                          : 'border-border hover:border-primary/40'
                      )}
                    >
                      <span
                        className="h-6 w-full rounded-lg mb-1 shadow-2xs"
                        style={{ background: t.gradient }}
                      />
                      <span className="text-[10px] font-semibold text-foreground truncate w-full">
                        {t.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Card Ratio
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '4:5', label: 'Portrait Card', desc: '4:5 Post' },
                  { id: '9:16', label: 'Story Format', desc: '9:16 Mobile' },
                  { id: '1:1', label: 'Square Poster', desc: '1:1 Vanity' },
                ].map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAspect(a.id as InfographicAspect)}
                    className={cn(
                      'rounded-xl border p-2.5 text-center text-xs font-medium transition-all cursor-pointer',
                      aspect === a.id
                        ? 'border-primary bg-primary/10 text-primary font-semibold shadow-xs'
                        : 'border-border bg-card text-foreground hover:border-primary/40'
                    )}
                  >
                    <div>{a.label}</div>
                    <div className="text-[10px] text-muted-foreground">{a.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-2xl bg-secondary/40 p-4 border border-border">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Card Headline Title
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="mt-1 h-9 w-full rounded-xl border border-border bg-card px-3 text-xs outline-none focus:border-primary text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Skin Type Tag
                </label>
                <input
                  type="text"
                  value={customSkinType}
                  onChange={(e) => setCustomSkinType(e.target.value)}
                  className="mt-1 h-9 w-full rounded-xl border border-border bg-card px-3 text-xs outline-none focus:border-primary text-foreground"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={renderInfographicToCanvas}
              className="w-full"
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', isGenerating && 'animate-spin')} />
              Refresh Visual Preview
            </Button>
          </div>

          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-border/80 bg-muted/60 p-2 shadow-soft">
              {generatedImageUrl ? (
                <img
                  src={generatedImageUrl}
                  alt="Personalized Skincare Infographic"
                  className="w-full h-auto rounded-[1.5rem] shadow-sm object-contain"
                />
              ) : (
                <div className="flex aspect-[4/5] w-full items-center justify-center text-muted-foreground text-sm">
                  Rendering aesthetic routine poster...
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
              <Button size="lg" onClick={handleDownload} className="flex-1 shadow-glow">
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </Button>
              <button
                type="button"
                onClick={handleCopyImage}
                className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
                title="Copy image to clipboard"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={handleSaveToJournal}
                disabled={savedJournal}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-4 py-3 text-sm font-semibold transition-colors cursor-pointer',
                  savedJournal
                    ? 'bg-secondary text-primary font-bold'
                    : 'border border-border bg-card text-foreground hover:bg-secondary'
                )}
                title="Save into your Glow Journal"
              >
                <Heart className={cn('h-4 w-4', savedJournal && 'fill-primary text-primary')} />
                <span>{savedJournal ? 'In Journal' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
