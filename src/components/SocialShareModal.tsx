import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Flame,
  Droplets,
  Sparkles,
  Award,
  Download,
  ExternalLink,
  Smartphone,
  CalendarCheck,
  Send,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRoutineProgress, getTodayDateString } from '../hooks/useRoutineProgress';
import { useUserAccount } from '../hooks/useUserAccount';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Button } from './Button';
import { cn } from '../utils/cn';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareContext?: {
    type?: 'routine_complete' | 'streak_milestone' | 'badge_unlocked' | 'general';
    title?: string;
    subtitle?: string;
    badgeName?: string;
  };
}

export function SocialShareModal({
  isOpen,
  onClose,
  shareContext = { type: 'general' },
}: SocialShareModalProps) {
  const { streak, todayDone, last7Days } = useRoutineProgress();
  const { account } = useUserAccount();
  const todayKey = getTodayDateString();
  const [waterLogs] = useLocalStorage<Record<string, { glasses: number; goal: number }>>(
    'lumie.water_intake',
    { [todayKey]: { glasses: 6, goal: 8 } }
  );

  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cardImage, setCardImage] = useState<string>('');
  const [platformFormat, setPlatformFormat] = useState<'story' | 'post'>('story'); // 9:16 vs 4:5
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentStreak = streak();
  const todayStepsCount = todayDone.length;
  const todayWater = waterLogs[todayKey]?.glasses ?? 6;
  const userName = account?.name || 'Skincare Enthusiast';

  // Dynamic share text based on context
  const defaultShareText =
    shareContext.type === 'streak_milestone'
      ? `🔥 Just hit a ${currentStreak}-day consistent glow streak on Lumi! Glowing from the inside out with daily mindful skincare & hydration. ✨ #LumiGlow #SkincareRoutine #SkinBarrier`
      : shareContext.type === 'badge_unlocked'
      ? `🏆 Unlocked the "${shareContext.badgeName || 'Radiance'}" achievement on Lumi! Consistency compounds into lasting healthy skin. 🌿 #LumiGlow #SkinJourney #GlowingSkin`
      : `✨ Completed today's morning & evening rituals on Lumi! ${currentStreak}-day streak and feeling refreshed. 🌸 #LumiGlow #SelfCare #SkinBarrier`;

  const [shareCaption, setShareCaption] = useState(defaultShareText);

  useEffect(() => {
    setShareCaption(defaultShareText);
  }, [shareContext.type, shareContext.badgeName, currentStreak]);

  // Generate aesthetic share card on hidden canvas
  const renderCard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsGenerating(true);

    const width = 1080;
    const height = platformFormat === 'story' ? 1920 : 1350;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient: luxurious evening rose & obsidian tone
    const isDarkTheme = document.documentElement.classList.contains('dark');
    const grad = ctx.createLinearGradient(0, 0, width, height);

    if (isDarkTheme) {
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(0.4, '#1E293B');
      grad.addColorStop(1, '#0B0F19');
    } else {
      grad.addColorStop(0, '#FFF5F6');
      grad.addColorStop(0.5, '#FCE7ED');
      grad.addColorStop(1, '#F7D0DC');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative outer border
    const margin = 48;
    ctx.strokeStyle = isDarkTheme ? 'rgba(214, 69, 107, 0.35)' : 'rgba(214, 69, 107, 0.25)';
    ctx.lineWidth = 3;
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1;
    ctx.strokeRect(margin + 12, margin + 12, width - (margin + 12) * 2, height - (margin + 12) * 2);

    // Top Brand Monogram
    let curY = margin + (platformFormat === 'story' ? 120 : 80);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#D6456B';
    ctx.font = '700 36px Fraunces, Georgia, serif';
    ctx.fillText('L U M I', width / 2, curY);

    curY += 34;
    ctx.fillStyle = isDarkTheme ? '#CBD5E1' : '#7C4A5A';
    ctx.font = '600 16px Inter, sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('DAILY SKINCARE & WELLNESS RITUAL', width / 2, curY);

    curY += 70;
    // Central Trophy / Streak Emblem
    const emblemY = curY + 60;
    ctx.beginPath();
    ctx.arc(width / 2, emblemY, 70, 0, Math.PI * 2);
    ctx.fillStyle = '#D6456B';
    ctx.fill();

    ctx.font = '64px sans-serif';
    ctx.fillText('✨', width / 2, emblemY + 22);

    curY = emblemY + 120;
    // Headline
    ctx.fillStyle = isDarkTheme ? '#F8FAFC' : '#3F1E28';
    ctx.font = '700 48px Fraunces, Georgia, serif';
    ctx.letterSpacing = '0px';
    const mainTitle =
      shareContext.type === 'streak_milestone'
        ? `${currentStreak}-Day Glow Streak!`
        : shareContext.type === 'badge_unlocked'
        ? `Achievement Unlocked!`
        : `Daily Ritual Complete`;
    ctx.fillText(mainTitle, width / 2, curY);

    curY += 38;
    ctx.fillStyle = isDarkTheme ? '#94A3B8' : '#7C4A5A';
    ctx.font = '500 22px Inter, sans-serif';
    ctx.fillText(`Logged by ${userName} • ${todayKey}`, width / 2, curY);

    // Stat Cards
    curY += 60;
    const cardWidth = 440;
    const cardHeight = 150;
    const card1X = width / 2 - cardWidth - 16;
    const card2X = width / 2 + 16;

    // Helper for rounded card
    const drawPillCard = (x: number, y: number, w: number, h: number) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 24);
      ctx.fillStyle = isDarkTheme ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.9)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(214, 69, 107, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    // Card 1: Streak
    drawPillCard(card1X, curY, cardWidth, cardHeight);
    ctx.textAlign = 'left';
    ctx.font = '600 20px Inter, sans-serif';
    ctx.fillStyle = '#D97706';
    ctx.fillText('🔥 STREAK', card1X + 32, curY + 45);
    ctx.font = '700 50px Fraunces, Georgia, serif';
    ctx.fillStyle = isDarkTheme ? '#F8FAFC' : '#3F1E28';
    ctx.fillText(`${currentStreak} Days`, card1X + 32, curY + 105);

    // Card 2: Steps
    drawPillCard(card2X, curY, cardWidth, cardHeight);
    ctx.font = '600 20px Inter, sans-serif';
    ctx.fillStyle = '#0284C7';
    ctx.fillText('💧 HYDRATION', card2X + 32, curY + 45);
    ctx.font = '700 50px Fraunces, Georgia, serif';
    ctx.fillStyle = isDarkTheme ? '#F8FAFC' : '#3F1E28';
    ctx.fillText(`${todayWater * 250} ml`, card2X + 32, curY + 105);

    curY += cardHeight + 45;

    // Philosophy Quote
    if (platformFormat === 'story') {
      const quoteBoxY = curY + 40;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 400, quoteBoxY, 800, 140, 20);
      ctx.fillStyle = isDarkTheme ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.7)';
      ctx.fill();

      ctx.textAlign = 'center';
      ctx.font = 'italic 500 24px Fraunces, Georgia, serif';
      ctx.fillStyle = isDarkTheme ? '#E2E8F0' : '#4A2834';
      ctx.fillText(
        '"Consistency in small, gentle rituals creates the profound transformation."',
        width / 2,
        quoteBoxY + 60
      );
      ctx.font = '600 16px Inter, sans-serif';
      ctx.fillStyle = '#D6456B';
      ctx.fillText('— Lumi Wellness Journal', width / 2, quoteBoxY + 100);
    }

    // Footer Watermark
    const footerY = height - margin - 35;
    ctx.textAlign = 'center';
    ctx.font = '500 20px Inter, sans-serif';
    ctx.fillStyle = isDarkTheme ? '#64748B' : '#8A5868';
    ctx.fillText('Track your radiance daily on Lumi • lumie.glow', width / 2, footerY);

    const dataUrl = canvas.toDataURL('image/png', 0.95);
    setCardImage(dataUrl);
    setIsGenerating(false);
  }, [platformFormat, shareContext, currentStreak, userName, todayKey, todayWater]);

  useEffect(() => {
    if (isOpen) {
      renderCard();
    }
  }, [isOpen, renderCard]);

  // Social Intent Handlers
  const handleShareTwitter = () => {
    try {
      const text = encodeURIComponent(shareCaption);
      const url = encodeURIComponent(window.location.origin || 'https://lumie.glow');
      const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
      window.open(twitterUrl, '_blank', 'noopener,noreferrer');
      toast.success('Opened Twitter share window!');
    } catch {
      toast.info('Could not open Twitter pop-up. Copied caption to clipboard.');
      handleCopyText();
    }
  };

  const handleShareInstagramStory = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Lumi Skincare Story',
          text: shareCaption,
          url: window.location.href,
        });
        toast.success('Shared directly to Instagram Story or chosen app!');
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          return;
        }
      }
    }
    // Fallback: download card and instruct user
    handleDownloadCard();
    toast.info('Story image downloaded! Open Instagram and upload from your camera roll.');
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Lumi Skincare Progress',
          text: shareCaption,
          url: window.location.href,
        });
        toast.success('Shared successfully!');
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          return;
        }
      }
    }
    handleCopyText();
  };

  const handleDownloadCard = () => {
    if (!cardImage) return;
    const a = document.createElement('a');
    a.href = cardImage;
    a.download = `lumi-routine-stats-${todayKey}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Downloaded aesthetic progress image!');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareCaption);
    setCopiedText(true);
    toast.success('Share caption copied to clipboard!');
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopiedImage(true);
        toast.success('Image card copied to clipboard!');
        setTimeout(() => setCopiedImage(false), 2000);
      });
    } catch {
      handleDownloadCard();
      toast.info('Direct image copy restricted. Downloaded image instead!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 overflow-y-auto bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-7 shadow-2xl my-auto max-h-[94vh] overflow-y-auto animate-scale-up">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3.5 top-3.5 sm:right-5 sm:top-5 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer z-10"
          aria-label="Close share modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-border/80 pb-4 sm:pb-5 pr-10">
          <span className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-2xs font-bold uppercase tracking-wider text-primary">
                Social Sharing & Web Share API
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
              Share Your Skincare Milestones
            </h2>
          </div>
        </div>

        {/* Content Body: Left Controls, Right Preview */}
        <div className="mt-5 sm:mt-6 grid gap-6 lg:gap-8 lg:grid-cols-12 items-start">
          {/* Controls */}
          <div className="space-y-4 sm:space-y-5 lg:col-span-6">
            {/* Format Switcher */}
            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5 sm:mb-2">
                Card Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPlatformFormat('story')}
                  className={cn(
                    'flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl border p-2.5 sm:p-3 text-xs font-semibold transition-all cursor-pointer text-center',
                    platformFormat === 'story'
                      ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30 shadow-2xs'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                  )}
                >
                  <Smartphone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">Story (9:16)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPlatformFormat('post')}
                  className={cn(
                    'flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl border p-2.5 sm:p-3 text-xs font-semibold transition-all cursor-pointer text-center',
                    platformFormat === 'post'
                      ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30 shadow-2xs'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                  )}
                >
                  <CalendarCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">Feed (4:5)</span>
                </button>
              </div>
            </div>

            {/* Editable Share Text */}
            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                Share Caption
              </label>
              <textarea
                rows={3}
                value={shareCaption}
                onChange={(e) => setShareCaption(e.target.value)}
                className="w-full rounded-2xl border border-border bg-secondary/40 p-3 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
              />
            </div>

            {/* Direct Social Channels Grid */}
            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5 sm:mb-2">
                Direct Channels
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                {/* Twitter / X */}
                <button
                  type="button"
                  onClick={handleShareTwitter}
                  className="flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 p-2.5 sm:p-3 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  <svg className="h-4 w-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>Share to Twitter / X</span>
                </button>

                {/* Instagram Story */}
                <button
                  type="button"
                  onClick={handleShareInstagramStory}
                  className="flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl border border-pink-500/30 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-amber-500/10 hover:opacity-90 text-pink-600 dark:text-pink-400 p-2.5 sm:p-3 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  <svg className="h-4 w-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>Instagram Story</span>
                </button>
              </div>
            </div>

            {/* Web Share & Native Actions */}
            <div className="flex flex-col gap-2 pt-1">
              <Button
                variant="primary"
                size="md"
                onClick={handleWebShare}
                className="w-full shadow-md gap-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share via Web Share API</span>
              </Button>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadCard}
                  className="text-xs w-full"
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyImage}
                  className="text-xs w-full"
                >
                  {copiedImage ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy Card
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyText}
                  className="text-xs w-full"
                >
                  {copiedText ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy Text
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Live Card Preview */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center w-full">
            <div className="w-full max-w-[290px] xs:max-w-[320px] sm:max-w-[340px] rounded-2xl bg-secondary/50 p-2.5 sm:p-3 border border-border/80 shadow-soft flex flex-col items-center mx-auto">
              <span className="text-[11px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-primary" /> Visual Story Preview
              </span>
              <div
                className={cn(
                  'w-full rounded-xl overflow-hidden shadow-xl border border-border/70 bg-white transition-all',
                  platformFormat === 'story' ? 'aspect-[9/16]' : 'aspect-[4/5]'
                )}
              >
                {cardImage ? (
                  <img
                    src={cardImage}
                    alt="Social Share Progress Card"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                    Rendering card...
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
