import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  CalendarCheck,
  TrendingUp,
  Sparkles,
  Camera,
  Upload,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  Trophy,
  Share2,
  Droplets,
  Sun,
  Moon,
  Image as ImageIcon,
  Smile,
  Activity,
  ShieldCheck,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRoutineProgress, getTodayDateString } from '../hooks/useRoutineProgress';
import { useJournal } from '../hooks/useJournal';
import { useProfile } from '../hooks/useProfile';
import { useProgressPhotos } from '../hooks/useProgressPhotos';
import { useAchievements } from '../hooks/useAchievements';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { allRoutineSteps, routines } from '../data/mockData';
import { SectionHeading } from '../components/SectionHeading';
import { StatCard } from '../components/StatCard';
import { Button } from '../components/Button';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { DailyHabitTracker } from '../components/DailyHabitTracker';
import { RoutineInfographicModal } from '../components/RoutineInfographicModal';
import { ProgressShareModal } from '../components/ProgressShareModal';
import { SocialShareModal } from '../components/SocialShareModal';
import { WeeklyVisualSummary } from '../components/WeeklyVisualSummary';
import { UserAchievementsGrid } from '../components/UserAchievementsGrid';
import { ProgressWaterTracker } from '../components/ProgressWaterTracker';
import { RoutineNotificationPrompt } from '../components/RoutineNotificationPrompt';
import { SkincareHabitsDashboard } from '../components/SkincareHabitsDashboard';
import { cn } from '../utils/cn';

const moodOptions = [
  { label: 'Radiant', icon: '✨', description: 'Glowy & vibrant' },
  { label: 'Hydrated', icon: '💧', description: 'Plump & dewy' },
  { label: 'Calm', icon: '🌿', description: 'Soothed barrier' },
  { label: 'Sensitive', icon: '🌸', description: 'Flushed or reactive' },
  { label: 'Breakout', icon: '⚡', description: 'Active blemishes' },
  { label: 'Dry', icon: '🏜️', description: 'Tight or flaking' },
  { label: 'Restoring', icon: '🛡️', description: 'Repairing barrier' },
];

const skinFeelPresets = [
  'Plump',
  'Radiant',
  'Smooth',
  'Calm',
  'Hydrated',
  'Dehydrated',
  'Redness',
  'Breakout',
  'Tight',
  'Soft',
];

export function ProgressPage() {
  const { streak, last7Days, todayDone, completedCount } = useRoutineProgress();
  const { entries, addEntry, deleteEntry } = useJournal();
  const { profile } = useProfile();
  const { photos, addPhoto, deletePhoto } = useProgressPhotos();
  const { unlockedCount, totalCount } = useAchievements();

  const todayKey = getTodayDateString();
  const [waterLogs, setWaterLogs] = useLocalStorage<Record<string, { glasses: number; goal: number }>>(
    'lumie.water_intake',
    { [todayKey]: { glasses: 6, goal: 8 } }
  );

  const currentWaterGlasses = waterLogs[todayKey]?.glasses ?? 0;
  const waterGoal = waterLogs[todayKey]?.goal ?? 8;

  const morningRoutine = routines.find((r) => r.id === 'morning-skin') || routines[0];
  const eveningRoutine = routines.find((r) => r.id === 'evening-skin') || routines[1];
  const morningDoneCount = morningRoutine ? completedCount(morningRoutine.steps.map((s) => s.id)) : 0;
  const eveningDoneCount = eveningRoutine ? completedCount(eveningRoutine.steps.map((s) => s.id)) : 0;
  const isMorningComplete = morningRoutine ? morningDoneCount === morningRoutine.steps.length : false;
  const isEveningComplete = eveningRoutine ? eveningDoneCount === eveningRoutine.steps.length : false;

  const [activeTab, setActiveTab] = useState<'trends' | 'water' | 'habits' | 'overview' | 'photos' | 'badges'>('trends');
  const [showInfographicModal, setShowInfographicModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);

  // Journal form state
  const [rating, setRating] = useState(5);
  const [selectedMood, setSelectedMood] = useState('Radiant');
  const [customMoodIconUrl, setCustomMoodIconUrl] = useState('');
  const [skinFeelTags, setSkinFeelTags] = useState<string[]>(['Plump', 'Calm']);
  const [note, setNote] = useState('');

  // Photo modal state
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoDate, setPhotoDate] = useState(todayKey);
  const [photoTag, setPhotoTag] = useState<'AM' | 'PM' | 'Bare Skin' | 'Progress'>('Bare Skin');
  const [photoScore, setPhotoScore] = useState(8);
  const [photoNotes, setPhotoNotes] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState('');

  const [beforePhotoId, setBeforePhotoId] = useState(photos[0]?.id || '');
  const [afterPhotoId, setAfterPhotoId] = useState(photos[photos.length - 1]?.id || '');

  const days = last7Days();
  const maxCount = Math.max(...days.map((d) => d.count), allRoutineSteps.length / 2, 1);
  const totalWeeklySteps = days.reduce((acc, cur) => acc + cur.count, 0);

  const toggleSkinFeelTag = (tag: string) => {
    setSkinFeelTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleMoodIconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image is too large. Please select an icon or photo under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setCustomMoodIconUrl(reader.result as string);
        toast.success('Custom mood icon uploaded! ✨');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickAddWater = () => {
    const next = Math.min(16, currentWaterGlasses + 1);
    setWaterLogs((prev) => ({
      ...prev,
      [todayKey]: { glasses: next, goal: waterGoal },
    }));
    toast.success(`Logged glass ${next} (${next * 250} ml total) 💧`);
  };

  const handleQuickMinusWater = () => {
    if (currentWaterGlasses > 0) {
      const next = currentWaterGlasses - 1;
      setWaterLogs((prev) => ({
        ...prev,
        [todayKey]: { glasses: next, goal: waterGoal },
      }));
    }
  };

  const handleLog = () => {
    const selectedOption = moodOptions.find((m) => m.label === selectedMood);
    addEntry({
      date: todayKey,
      rating,
      mood: selectedMood,
      moodIcon: selectedOption?.icon || '✨',
      customMoodIconUrl: customMoodIconUrl || undefined,
      skinFeel: skinFeelTags,
      note: note.trim() || undefined,
      routineCorrelation: {
        morningDone: isMorningComplete,
        eveningDone: isEveningComplete,
        stepsCompleted: todayDone.length,
        waterGlasses: currentWaterGlasses,
        waterGoal,
        streakDays: streak(),
      },
    });
    setNote('');
    toast.success('Check-in logged and correlated with today\'s routines! ✨');
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        toast.error('Image is too large. Please select a photo under 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoDataUrl) {
      toast.error('Please select or capture a photo first');
      return;
    }
    const created = addPhoto({
      date: photoDate,
      imageUrl: photoDataUrl,
      tag: photoTag,
      skinScore: photoScore,
      notes: photoNotes.trim() || undefined,
    });
    setAfterPhotoId(created.id);
    setPhotoDataUrl('');
    setPhotoNotes('');
    setShowPhotoModal(false);
    toast.success('Progress photo logged successfully!');
  };

  const beforePhoto = photos.find((p) => p.id === beforePhotoId) || photos[0];
  const afterPhoto = photos.find((p) => p.id === afterPhotoId) || photos[photos.length - 1] || photos[0];

  return (
    <div className="container-wide py-12 space-y-8">
      {/* Browser Notification Opt-In Prompt Banner */}
      <RoutineNotificationPrompt />

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow={profile ? `${profile.name}'s journey` : 'Progress & Consistency'}
          title="Track your glow"
          description="Complete daily skincare habits, log water intake with weekly Recharts analytics, build unbroken streaks, and earn badges."
        />

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            size="md"
            variant="outline"
            onClick={() => setShowSocialModal(true)}
            className="shadow-2xs gap-1.5"
          >
            <Share2 className="h-4 w-4 text-primary" /> Social Share
          </Button>

          <Button
            size="md"
            variant="outline"
            onClick={() => setShowInfographicModal(true)}
            className="shadow-2xs"
          >
            <Sparkles className="h-4 w-4 mr-1.5 text-primary" /> Routine Card
          </Button>

          <Button
            size="md"
            variant="primary"
            onClick={() => setShowShareModal(true)}
            className="shadow-2xs"
          >
            Export Stats Image
          </Button>

          {/* Tab Selector - Fully Responsive Scrollable Bar */}
          <div className="flex items-center rounded-full bg-secondary p-1 gap-1 overflow-x-auto max-w-full no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('trends')}
              className={cn(
                'flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
                activeTab === 'trends'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <TrendingUp className="h-3.5 w-3.5" /> Trends
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('habits')}
              className={cn(
                'flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
                activeTab === 'habits'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Skincare Habits
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('water')}
              className={cn(
                'flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
                activeTab === 'water'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Droplets className="h-3.5 w-3.5" /> Water Tracker
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={cn(
                'flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
                activeTab === 'overview'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Journal
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('photos')}
              className={cn(
                'flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
                activeTab === 'photos'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Camera className="h-3.5 w-3.5" /> Photos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('badges')}
              className={cn(
                'flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
                activeTab === 'badges'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Trophy className="h-3.5 w-3.5" /> Badges ({unlockedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Top 5 Stat Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          icon={<Flame className="h-5 w-5 fill-accent text-accent" />}
          label="Current streak"
          value={`${streak()} days`}
        />
        <StatCard
          icon={<CalendarCheck className="h-5 w-5 text-primary" />}
          label="Steps today"
          value={`${todayDone.length}`}
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
          label="This week"
          value={`${totalWeeklySteps} steps`}
        />
        <StatCard
          icon={<Trophy className="h-5 w-5 text-amber-500" />}
          label="Badges unlocked"
          value={`${unlockedCount} / ${totalCount}`}
        />
        <StatCard
          icon={<Camera className="h-5 w-5 text-indigo-600" />}
          label="Progress photos"
          value={`${photos.length} logged`}
          className="col-span-2 sm:col-span-1"
        />
      </div>

      {/* TAB 1: VISUAL TRENDS (HABIT DASHBOARD + OVERALL ANALYTICS + WATER TRACKER) */}
      {activeTab === 'trends' && (
        <div className="space-y-8 animate-fade-up">
          <SkincareHabitsDashboard onOpenInfographic={() => setShowInfographicModal(true)} />
          <WeeklyVisualSummary />
          <ProgressWaterTracker />
        </div>
      )}

      {/* TAB 2: WATER TRACKER WITH RECHARTS BAR CHART */}
      {activeTab === 'water' && (
        <div className="space-y-8 animate-fade-up">
          <ProgressWaterTracker />
        </div>
      )}

      {/* TAB 3: HABITS */}
      {activeTab === 'habits' && (
        <div className="space-y-8 animate-fade-up">
          <SkincareHabitsDashboard onOpenInfographic={() => setShowInfographicModal(true)} />
          <DailyHabitTracker
            onOpenInfographicGenerator={() => setShowInfographicModal(true)}
          />
        </div>
      )}

      {/* TAB 4: OVERVIEW & JOURNAL WITH SKIN CONDITION & ROUTINE CORRELATION */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-up">
          {/* Live Today Routine & Hydration Correlation Banner */}
          <div className="overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/5 via-accent/5 to-sky-500/5 p-5 sm:p-7 shadow-soft">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs">
                    <Activity className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Daily Correlation Spotlight
                  </span>
                </div>
                <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold text-foreground">
                  Today's Skincare Routine & Hydration State
                </h3>
                <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
                  Log your skin condition notes below to discover how daily habits compound into radiant skin.
                </p>
              </div>

              {/* Quick Water Intake Logger directly inside Journal tab */}
              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-sky-300/40 dark:border-sky-800/40 bg-card/80 p-3 shadow-2xs">
                <div className="flex items-center gap-2 mr-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white shadow-2xs">
                    <Droplets className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                      Water Intake
                    </div>
                    <div className="text-sm font-bold text-foreground">
                      {currentWaterGlasses} / {waterGoal} glasses ({currentWaterGlasses * 250} ml)
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleQuickMinusWater}
                    disabled={currentWaterGlasses === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 transition-colors cursor-pointer"
                    title="Remove glass"
                    aria-label="Remove glass"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickAddWater}
                    className="flex h-8 items-center gap-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 px-3 text-xs font-bold text-white transition-colors cursor-pointer shadow-2xs"
                    title="Add 1 glass of water"
                  >
                    <Plus className="h-3.5 w-3.5" /> +1 Glass
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Metric Correlation Badges */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              <div className="flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card/90 p-3 shadow-2xs">
                <span className={cn(
                  'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl',
                  isMorningComplete ? 'bg-amber-500 text-white' : 'bg-amber-500/10 text-amber-600'
                )}>
                  <Sun className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase">AM Routine</div>
                  <div className="text-xs sm:text-sm font-bold text-foreground truncate">
                    {isMorningComplete ? 'Completed ✓' : `${morningDoneCount}/${morningRoutine?.steps.length ?? 4} done`}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card/90 p-3 shadow-2xs">
                <span className={cn(
                  'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl',
                  isEveningComplete ? 'bg-indigo-600 text-white' : 'bg-indigo-500/10 text-indigo-600'
                )}>
                  <Moon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase">PM Routine</div>
                  <div className="text-xs sm:text-sm font-bold text-foreground truncate">
                    {isEveningComplete ? 'Completed ✓' : `${eveningDoneCount}/${eveningRoutine?.steps.length ?? 4} done`}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card/90 p-3 shadow-2xs">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
                  <Droplets className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase">Hydration Goal</div>
                  <div className="text-xs sm:text-sm font-bold text-foreground truncate">
                    {Math.round((currentWaterGlasses / waterGoal) * 100)}% ({currentWaterGlasses >= waterGoal ? 'Goal Met ✓' : `${waterGoal - currentWaterGlasses} to go`})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card/90 p-3 shadow-2xs">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Flame className="h-4 w-4 fill-accent" />
                </span>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase">Glow Streak</div>
                  <div className="text-xs sm:text-sm font-bold text-foreground truncate">
                    {streak()} Days Consistent
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main 2-Column Journal Layout: Form on Left/Right, Consistency Chart & Entries below */}
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* Journal Check-In & Skin Condition Logger */}
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-soft lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between border-b border-border/70 pb-4">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    Log Skin Condition & Notes
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Rate how your skin feels and upload mood icons or selfies to correlate with your habits.
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {todayKey}
                </span>
              </div>

              {/* 1. Skin Rating */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Skin Rating (1 - 5)
                  </label>
                  <span className="text-xs font-semibold text-primary">
                    {rating === 5
                      ? '5/5 Radiant & Dewy'
                      : rating === 4
                      ? '4/5 Calm & Smooth'
                      : rating === 3
                      ? '3/5 Balanced'
                      : rating === 2
                      ? '2/5 Dry or Tight'
                      : '1/5 Sensitized / Flare'}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={cn(
                        'flex h-11 items-center justify-center rounded-xl font-display text-base sm:text-lg font-bold transition-all cursor-pointer',
                        rating >= num
                          ? 'bg-primary text-primary-foreground shadow-xs ring-1 ring-primary/40'
                          : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                      )}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Mood Icons Selection + Custom Upload */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Skin Mood & State
                  </label>
                  <span className="text-2xs text-muted-foreground">
                    Select a mood or upload your own
                  </span>
                </div>

                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2">
                  {moodOptions.map((m) => (
                    <button
                      key={m.label}
                      type="button"
                      onClick={() => {
                        setSelectedMood(m.label);
                        // If user clicks a standard preset, keep uploaded custom icon optional
                      }}
                      className={cn(
                        'flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all cursor-pointer shadow-2xs',
                        selectedMood === m.label
                          ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30 font-semibold'
                          : 'border-border bg-card text-foreground/80 hover:border-primary/40'
                      )}
                    >
                      <span className="text-lg flex-shrink-0">{m.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">{m.label}</div>
                        <div className="text-[10px] text-muted-foreground truncate hidden xs:block">{m.description}</div>
                      </div>
                    </button>
                  ))}

                  {/* Upload Custom Mood Icon / Sticker / Selfie Button */}
                  <label className="flex items-center gap-2 rounded-xl border border-dashed border-primary/50 bg-primary/5 p-2.5 text-left transition-all cursor-pointer hover:bg-primary/10">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMoodIconFileChange}
                      className="hidden"
                    />
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary flex-shrink-0">
                      <Camera className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-primary truncate">Upload Icon</div>
                      <div className="text-[10px] text-muted-foreground truncate">Custom image</div>
                    </div>
                  </label>
                </div>

                {/* Preview of Uploaded Custom Mood Icon */}
                {customMoodIconUrl && (
                  <div className="mt-3 flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 sm:p-3 animate-fade-in">
                    <div className="flex items-center gap-3">
                      <img
                        src={customMoodIconUrl}
                        alt="Uploaded mood icon"
                        className="h-10 w-10 rounded-xl object-cover border border-emerald-500/40 shadow-xs"
                      />
                      <div>
                        <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                          Custom Mood Icon Attached
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Will be saved with today's journal entry & streak stamp
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCustomMoodIconUrl('')}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      title="Remove uploaded icon"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Skin Texture & Feel Tags */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                  Skin Condition & Feel Tags
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {skinFeelPresets.map((tag) => {
                    const active = skinFeelTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleSkinFeelTag(tag)}
                        className={cn(
                          'rounded-full border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs',
                          active
                            ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                            : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40'
                        )}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Daily Observations Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                  Daily Notes & Routine Correlation
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What products felt most effective today? Any skin barrier changes, breakouts, or hydration observations?"
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-border bg-secondary/30 p-3.5 text-xs sm:text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 leading-relaxed placeholder:text-muted-foreground/70"
                />
              </div>

              {/* Routine Correlation Stamping Notice & Submit */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-border/60">
                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                  <span>
                    Auto-correlates with AM/PM routine status ({morningDoneCount + eveningDoneCount} steps) & {currentWaterGlasses} glasses of water
                  </span>
                </div>
                <Button size="md" variant="primary" onClick={handleLog} className="w-full sm:w-auto shadow-md">
                  <Sparkles className="h-4 w-4 mr-1.5" /> Log Daily Journal
                </Button>
              </div>
            </div>

            {/* Right Column: Weekly Consistency & Routine Correlation Analytics */}
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-soft lg:col-span-5 space-y-6">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Weekly Consistency
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Routine habits completed over the last 7 days
                </p>
                <div className="mt-6 flex h-44 items-end justify-between gap-2.5 sm:gap-3">
                  {days.map((day) => (
                    <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex w-full flex-1 items-end">
                        <div
                          className="w-full rounded-t-lg bg-primary/80 transition-all duration-500 hover:bg-primary"
                          style={{ height: `${Math.max((day.count / maxCount) * 100, 8)}%` }}
                          title={`${day.count} steps on ${day.date}`}
                        />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">{day.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Habit Correlation Insights */}
              <div className="rounded-2xl border border-border/80 bg-secondary/40 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>Consistency Correlation Insights</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Skin cells regenerate on a 28-day cycle. Drinking your target 8 glasses of water daily while maintaining active routines stabilizes the moisture barrier by up to 34%.
                </p>
              </div>
            </div>
          </div>

          {/* Your Correlated Journal Entries History */}
          <div className="mt-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-2xl font-bold text-foreground">
                  Your Correlated Skin Diary
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Track how daily routines, hydration levels, and mood correlate with skin health over time
                </p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {entries.length} {entries.length === 1 ? 'Entry' : 'Entries'} logged
              </span>
            </div>

            {entries.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
                <p className="font-display text-lg font-semibold text-foreground">No check-in entries yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Log your first check-in above with notes or mood icons to see your correlation history.
                </p>
                <Link to="/routines" className="mt-4 inline-block">
                  <Button variant="outline">Go to routines</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {entries.map((entry) => (
                  <div
                    key={entry.date}
                    className="relative flex flex-col justify-between rounded-3xl border border-border bg-card p-5 sm:p-6 transition-all hover:border-primary/40 shadow-soft space-y-4"
                  >
                    <div>
                      {/* Top Header: Date, Rating, Mood, Delete */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Mood Icon: Custom Upload or Emoji */}
                          {entry.customMoodIconUrl ? (
                            <img
                              src={entry.customMoodIconUrl}
                              alt={entry.mood}
                              className="h-11 w-11 rounded-2xl object-cover border border-primary/30 shadow-xs flex-shrink-0"
                            />
                          ) : (
                            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl shadow-2xs">
                              {entry.moodIcon || '✨'}
                            </span>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-display text-base font-bold text-foreground">
                                {entry.mood}
                              </span>
                              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                                {entry.rating}/5
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(entry.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            deleteEntry(entry.date);
                            toast.info(`Deleted entry for ${entry.date}`);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Skin Feel Tags */}
                      {entry.skinFeel && entry.skinFeel.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {entry.skinFeel.map((feel) => (
                            <span
                              key={feel}
                              className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-[11px] font-semibold text-secondary-foreground"
                            >
                              {feel}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Daily Notes */}
                      {entry.note && (
                        <p className="mt-3 text-xs sm:text-sm text-foreground/90 leading-relaxed italic border-l-2 border-primary/40 pl-3">
                          "{entry.note}"
                        </p>
                      )}
                    </div>

                    {/* Routine Correlation Badge Section */}
                    {entry.routineCorrelation && (
                      <div className="rounded-2xl border border-border/70 bg-secondary/40 p-3 pt-2.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Correlated Routine & Hydration
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-semibold text-[11px]',
                            entry.routineCorrelation.morningDone
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                              : 'bg-muted text-muted-foreground'
                          )}>
                            <Sun className="h-3 w-3" />
                            {entry.routineCorrelation.morningDone ? 'AM Ritual Done' : 'AM Incomplete'}
                          </span>

                          <span className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-semibold text-[11px]',
                            entry.routineCorrelation.eveningDone
                              ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300'
                              : 'bg-muted text-muted-foreground'
                          )}>
                            <Moon className="h-3 w-3" />
                            {entry.routineCorrelation.eveningDone ? 'PM Ritual Done' : 'PM Incomplete'}
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-300 px-2.5 py-0.5 font-semibold text-[11px]">
                            <Droplets className="h-3 w-3" />
                            {entry.routineCorrelation.waterGlasses}/{entry.routineCorrelation.waterGoal} Glasses
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 text-accent px-2.5 py-0.5 font-semibold text-[11px]">
                            <Flame className="h-3 w-3 fill-accent" />
                            {entry.routineCorrelation.streakDays}d Streak
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: PHOTOS */}
      {activeTab === 'photos' && (
        <div className="space-y-12 animate-fade-up">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
                <Camera className="h-3.5 w-3.5 text-primary" /> Visual Timeline
              </span>
              <h3 className="mt-1 font-display text-2xl font-semibold text-foreground">
                Skin Transformation Gallery
              </h3>
              <p className="text-sm text-muted-foreground">
                Document bare-skin progress weekly in consistent lighting.
              </p>
            </div>
            <Button size="lg" onClick={() => setShowPhotoModal(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Log Progress Photo
            </Button>
          </div>

          {photos.length >= 2 && beforePhoto && afterPhoto && (
            <div className="rounded-[2.5rem] border border-border bg-card p-6 shadow-soft sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-display text-2xl font-semibold text-foreground">
                    Interactive Before & After Comparison
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Drag the central slider left and right to inspect texture and redness evolution.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-semibold text-muted-foreground">Before:</span>
                    <select
                      value={beforePhotoId}
                      onChange={(e) => setBeforePhotoId(e.target.value)}
                      className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium outline-none text-foreground"
                    >
                      {photos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.date} ({p.tag})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-semibold text-muted-foreground">After:</span>
                    <select
                      value={afterPhotoId}
                      onChange={(e) => setAfterPhotoId(e.target.value)}
                      className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium outline-none text-foreground"
                    >
                      {photos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.date} ({p.tag})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <BeforeAfterSlider
                beforeImage={beforePhoto.imageUrl}
                afterImage={afterPhoto.imageUrl}
                beforeLabel={`Before • ${beforePhoto.date} (${beforePhoto.tag})`}
                afterLabel={`After • ${afterPhoto.date} (${afterPhoto.tag})`}
              />
            </div>
          )}

          <div>
            <h4 className="font-display text-2xl font-semibold text-foreground">
              All Photo Check-Ins ({photos.length})
            </h4>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-soft"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={item.imageUrl}
                      alt={`Skin log ${item.date}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-background/90 text-foreground px-3 py-1 text-xs font-semibold backdrop-blur">
                      {item.tag}
                    </span>
                    <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm">
                      Score: {item.skinScore}/10
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          deletePhoto(item.id);
                          toast.info('Photo removed from journal');
                        }}
                        className="text-muted-foreground hover:text-destructive cursor-pointer"
                        title="Delete photo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {item.notes && (
                      <p className="mt-3 text-xs leading-relaxed text-foreground/80">{item.notes}</p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/80 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setBeforePhotoId(item.id);
                          toast.success(`Set ${item.date} as "Before" photo`);
                        }}
                        className="font-medium text-muted-foreground hover:text-primary cursor-pointer"
                      >
                        Set as Before
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAfterPhotoId(item.id);
                          toast.success(`Set ${item.date} as "After" photo`);
                        }}
                        className="font-semibold text-primary hover:underline cursor-pointer"
                      >
                        Set as After
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: BADGES */}
      {activeTab === 'badges' && (
        <div className="space-y-8 animate-fade-up">
          <UserAchievementsGrid />
        </div>
      )}

      {/* Add Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-xs"
            onClick={() => setShowPhotoModal(false)}
          />
          <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-card p-6 shadow-soft sm:p-8">
            <h3 className="font-display text-2xl font-semibold text-foreground">
              Log Progress Photo
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a selfie or skin closeup to measure barrier improvement.
            </p>
            <form onSubmit={handleAddPhotoSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Skin Photograph
                </label>
                {photoDataUrl ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border">
                    <img src={photoDataUrl} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoDataUrl('')}
                      className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white hover:bg-black/80"
                    >
                      Change Photo
                    </button>
                  </div>
                ) : (
                  <label className="flex aspect-[16/9] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/40 p-6 text-center hover:border-primary/50 cursor-pointer transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="mt-2 text-sm font-semibold text-foreground">
                      Click to upload photo or take selfie
                    </span>
                    <span className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG, WebP up to 8MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={photoDate}
                    onChange={(e) => setPhotoDate(e.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Lighting / Phase Tag
                  </label>
                  <select
                    value={photoTag}
                    onChange={(e) => setPhotoTag(e.target.value as any)}
                    className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none text-foreground"
                  >
                    <option value="Bare Skin">Bare Skin</option>
                    <option value="AM">Morning (AM)</option>
                    <option value="PM">Evening (PM)</option>
                    <option value="Progress">Treatment Progress</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Overall Skin Radiance Score: {photoScore}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={photoScore}
                  onChange={(e) => setPhotoScore(Number(e.target.value))}
                  className="mt-2 w-full accent-primary cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Notes & Observations
                </label>
                <textarea
                  rows={2}
                  value={photoNotes}
                  onChange={(e) => setPhotoNotes(e.target.value)}
                  placeholder="e.g. Cheeks feel softer, minor redness receding around chin."
                  className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button type="button" variant="ghost" onClick={() => setShowPhotoModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save to Photo Journal</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Routine Infographic Modal */}
      <RoutineInfographicModal
        isOpen={showInfographicModal}
        onClose={() => setShowInfographicModal(false)}
      />

      {/* Shareable Progress Image Export Modal */}
      <ProgressShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      {/* Social Sharing Component Modal */}
      <SocialShareModal
        isOpen={showSocialModal}
        onClose={() => setShowSocialModal(false)}
        shareContext={{
          type: 'streak_milestone',
          title: `${streak()}-Day Skincare Progress`,
        }}
      />
    </div>
  );
}
