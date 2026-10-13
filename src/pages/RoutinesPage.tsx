import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Flame,
  Check,
  Sparkles,
  Sun,
  Moon,
  CalendarCheck,
  RotateCcw,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Users,
  Download,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import { routines } from '../data/mockData';
import { communityRoutines, CommunityRoutine } from '../data/communityRoutinesData';
import { useRoutineProgress } from '../hooks/useRoutineProgress';
import { useProducts } from '../hooks/useProducts';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SectionHeading } from '../components/SectionHeading';
import { Button } from '../components/Button';
import { RoutineInfographicModal } from '../components/RoutineInfographicModal';
import { DailyWaterTracker } from '../components/DailyWaterTracker';
import { RoutineReminderBanner } from '../components/RoutineReminderBanner';
import { CommunityRoutinesSection } from '../components/CommunityRoutinesSection';
import { SocialShareModal } from '../components/SocialShareModal';
import { cn } from '../utils/cn';

export function RoutinesPage() {
  const [searchParams] = useSearchParams();
  const [pageView, setPageView] = useState<'rituals' | 'community'>(() => {
    return searchParams.get('view') === 'community' ? 'community' : 'rituals';
  });

  useEffect(() => {
    const view = searchParams.get('view');
    if (view === 'community') {
      setPageView('community');
    }
  }, [searchParams]);

  const [skincareMode, setSkincareMode] = useState<'morning' | 'evening'>('morning');
  const [activeCategory, setActiveCategory] = useState<'skincare' | 'haircare' | 'wellness' | 'imported'>('skincare');
  const [showInfographicModal, setShowInfographicModal] = useState(false);
  const [showSocialShareModal, setShowSocialShareModal] = useState(false);

  const [importedRoutine, setImportedRoutine] = useLocalStorage<CommunityRoutine | null>(
    'lumie.active_imported_routine',
    communityRoutines[0]
  );

  const { isDone, toggleStep, addSteps, removeSteps, completedCount, streak } = useRoutineProgress();
  const { allProducts } = useProducts();

  const morningRoutine = routines.find((r) => r.id === 'morning-skin') || routines[0];
  const eveningRoutine = routines.find((r) => r.id === 'evening-skin') || routines[1];
  const hairRoutine = routines.find((r) => r.id === 'hair-wash') || routines[2];
  const wellnessRoutine = routines.find((r) => r.id === 'wellness-daily') || routines[3];

  const convertedImportedRoutine = importedRoutine
    ? {
        id: importedRoutine.id,
        name: importedRoutine.title,
        time: `${importedRoutine.skinType} Skin • ${importedRoutine.durationMinutes} min`,
        category: 'skincare' as const,
        accent: 'from-pink-200 to-rose-200',
        steps: importedRoutine.steps.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          timeOfDay: (s.timeOfDay === 'am' ? 'am' : s.timeOfDay === 'pm' ? 'pm' : undefined) as 'am' | 'pm' | undefined,
          productSuggestion: s.productSuggestion,
        })),
      }
    : null;

  const activeRoutine =
    activeCategory === 'imported' && convertedImportedRoutine
      ? convertedImportedRoutine
      : activeCategory === 'haircare'
      ? hairRoutine
      : activeCategory === 'wellness'
      ? wellnessRoutine
      : skincareMode === 'morning'
      ? morningRoutine
      : eveningRoutine;

  const totalSteps = activeRoutine.steps.length;
  const doneCount = completedCount(activeRoutine.steps.map((s) => s.id));
  const isRoutineComplete = doneCount === totalSteps;

  const morningDoneCount = completedCount(morningRoutine.steps.map((s) => s.id));
  const isMorningComplete = morningDoneCount === morningRoutine.steps.length;
  const eveningDoneCount = completedCount(eveningRoutine.steps.map((s) => s.id));
  const isEveningComplete = eveningDoneCount === eveningRoutine.steps.length;

  const handleToggle = (stepId: string, title: string) => {
    toggleStep(stepId);
    if (!isDone(stepId)) {
      toast.success(`${title} completed! ✨`);
    }
  };

  const handleCompleteAllInRoutine = () => {
    const stepIds = activeRoutine.steps.map((s) => s.id);
    addSteps(stepIds);
    toast.success(`All ${activeRoutine.name} steps marked complete!`);
  };

  const handleResetRoutine = () => {
    const stepIds = activeRoutine.steps.map((s) => s.id);
    removeSteps(stepIds);
    toast.info(`Reset ${activeRoutine.name} for today.`);
  };

  const getProductForStep = (productId?: string) => {
    if (!productId) return null;
    return allProducts.find((p) => p.id === productId);
  };

  return (
    <div className="container-wide py-12 space-y-10">
      <RoutineReminderBanner />

      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Rituals & Regimens"
          title="Daily Skincare & Habit Tracker"
          description="Check off each step as you complete it. Build consistent morning and evening streaks to unlock radiant skin."
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-full bg-secondary p-1">
            <button
              type="button"
              onClick={() => setPageView('rituals')}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors cursor-pointer',
                pageView === 'rituals'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Sparkles className="h-3.5 w-3.5" /> My Daily Rituals
            </button>
            <button
              type="button"
              onClick={() => setPageView('community')}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors cursor-pointer',
                pageView === 'community'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Users className="h-3.5 w-3.5" /> Community Routines
            </button>
          </div>

          <Button
            size="md"
            variant="outline"
            onClick={() => setShowSocialShareModal(true)}
            className="shadow-2xs gap-1.5"
          >
            <Share2 className="h-4 w-4 text-primary" /> Share Stats
          </Button>

          <Button
            size="md"
            variant="outline"
            onClick={() => setShowInfographicModal(true)}
            className="shadow-2xs"
          >
            <Sparkles className="h-4 w-4 mr-1.5 text-primary" /> Visual Card
          </Button>

          <div className="flex items-center gap-2 rounded-full bg-accent/15 px-4 py-2 text-accent font-semibold">
            <Flame className="h-5 w-5 fill-accent" />
            <span>{streak()} day streak</span>
          </div>
        </div>
      </div>

      {pageView === 'community' ? (
        <CommunityRoutinesSection
          onRoutineImported={(routine) => {
            setImportedRoutine(routine);
            setActiveCategory('imported');
            setPageView('rituals');
          }}
        />
      ) : (
        <>
          {/* CATEGORY & MORNING/EVENING NAVIGATION */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-6">
            <div className="inline-flex items-center rounded-2xl bg-secondary/80 p-1.5 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('skincare');
                  setSkincareMode('morning');
                }}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer',
                  activeCategory === 'skincare' && skincareMode === 'morning'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-xs'
                    : 'text-foreground/80 hover:text-foreground'
                )}
              >
                <Sun className="h-4 w-4" />
                <span>Morning Routine (AM)</span>
                {isMorningComplete && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/30 text-[10px]">
                    ✓
                  </span>
                )}
                <span className="rounded-full bg-black/10 px-2 py-0.5 text-[11px]">
                  {morningDoneCount}/{morningRoutine.steps.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('skincare');
                  setSkincareMode('evening');
                }}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer',
                  activeCategory === 'skincare' && skincareMode === 'evening'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xs'
                    : 'text-foreground/80 hover:text-foreground'
                )}
              >
                <Moon className="h-4 w-4" />
                <span>Evening Routine (PM)</span>
                {isEveningComplete && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/30 text-[10px]">
                    ✓
                  </span>
                )}
                <span className="rounded-full bg-black/10 px-2 py-0.5 text-[11px]">
                  {eveningDoneCount}/{eveningRoutine.steps.length}
                </span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground mr-1 hidden md:inline">
                Other Rituals:
              </span>
              {convertedImportedRoutine && (
                <button
                  type="button"
                  onClick={() => setActiveCategory('imported')}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5',
                    activeCategory === 'imported'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xs'
                      : 'bg-card border border-pink-300 dark:border-pink-800 text-foreground hover:border-pink-500'
                  )}
                >
                  <Sparkles className="h-3.5 w-3.5 text-pink-400" />
                  <span>Imported ({importedRoutine?.skinType})</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveCategory('haircare')}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
                  activeCategory === 'haircare'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground hover:border-primary/50'
                )}
              >
                Wash Day (Hair)
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('wellness')}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
                  activeCategory === 'wellness'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground hover:border-primary/50'
                )}
              >
                Inner Glow (Wellness)
              </button>
              <button
                type="button"
                onClick={() => setPageView('community')}
                className="rounded-full px-3 py-1.5 text-xs font-semibold border border-dashed border-primary/60 text-primary hover:bg-primary/5 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Download className="h-3 w-3" /> Browse Templates
              </button>
            </div>
          </div>

          {/* ACTIVE ROUTINE DASHBOARD */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Status */}
            <div className="space-y-6">
              <div
                className={cn(
                  'relative overflow-hidden rounded-[2.5rem] p-7 text-foreground shadow-sm transition-all duration-300',
                  activeCategory === 'imported'
                    ? 'bg-gradient-to-br from-pink-100 dark:from-pink-950/40 via-rose-50 dark:via-background to-orange-100 dark:to-orange-950/30 border border-pink-200/60 dark:border-pink-900/50'
                    : activeCategory === 'skincare' && skincareMode === 'morning'
                    ? 'bg-gradient-to-br from-amber-100 dark:from-amber-950/40 via-amber-50 dark:via-background to-orange-100 dark:to-orange-950/30 border border-amber-200/60 dark:border-amber-900/50'
                    : activeCategory === 'skincare' && skincareMode === 'evening'
                    ? 'bg-gradient-to-br from-indigo-100 dark:from-indigo-950/40 via-indigo-50 dark:via-background to-purple-100 dark:to-purple-950/30 border border-indigo-200/60 dark:border-indigo-900/50'
                    : 'bg-gradient-to-br from-emerald-100 dark:from-emerald-950/40 via-teal-50 dark:via-background to-cyan-100 dark:to-cyan-950/30 border border-teal-200/60 dark:border-teal-900/50'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-card/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground backdrop-blur border border-border/50">
                    {activeCategory === 'imported' ? (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-pink-600" /> Community Protocol ({importedRoutine?.skinType})
                      </>
                    ) : activeCategory === 'skincare' && skincareMode === 'morning' ? (
                      <>
                        <Sun className="h-3.5 w-3.5 text-amber-600" /> Morning Protocol
                      </>
                    ) : activeCategory === 'skincare' && skincareMode === 'evening' ? (
                      <>
                        <Moon className="h-3.5 w-3.5 text-indigo-600" /> Night Repair
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-primary" /> {activeRoutine.time}
                      </>
                    )}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {activeCategory === 'imported'
                      ? `${importedRoutine?.durationMinutes || 6} min`
                      : skincareMode === 'morning'
                      ? '5–7 min'
                      : '8–10 min'}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-2xl sm:text-3xl font-semibold text-foreground">
                  {activeRoutine.name}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-foreground/80 leading-relaxed">
                  {activeCategory === 'imported'
                    ? importedRoutine?.subtitle || importedRoutine?.description
                    : skincareMode === 'morning'
                    ? 'Antioxidant defense, moisture locking & essential SPF photoprotection.'
                    : skincareMode === 'evening'
                    ? 'Deep impurities removal, cellular retinol renewal & trans-epidermal moisture seal.'
                    : 'Targeted wellness care to support long-term glow and vitality.'}
                </p>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground/80 mb-2">
                    <span>Today's Progress</span>
                    <span>
                      {doneCount} of {totalSteps} steps completed
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-card/80 p-0.5 border border-border/50">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        skincareMode === 'morning'
                          ? 'bg-amber-500'
                          : skincareMode === 'evening'
                          ? 'bg-indigo-600'
                          : 'bg-emerald-600'
                      )}
                      style={{ width: `${(doneCount / totalSteps) * 100}%` }}
                    />
                  </div>
                </div>

                {isRoutineComplete ? (
                  <div className="mt-6 flex items-center justify-between gap-2.5 rounded-2xl bg-card/90 p-3.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-2xs backdrop-blur border border-emerald-300 dark:border-emerald-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <span>
                        {skincareMode === 'morning'
                          ? 'Morning routine crushed! Skin is protected & glowing.'
                          : 'Evening ritual complete! Rest well while skin repairs.'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSocialShareModal(true)}
                      className="rounded-full bg-emerald-600 text-white px-3 py-1 text-2xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      Share
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={handleCompleteAllInRoutine}
                      className="flex-1 rounded-xl bg-foreground text-background py-2 px-3 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Mark All Complete
                    </button>
                    {doneCount > 0 && (
                      <button
                        type="button"
                        onClick={handleResetRoutine}
                        className="rounded-xl border border-border bg-card p-2 text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                        title="Reset today's steps"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
                <h4 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  {skincareMode === 'morning' ? 'Morning Glow Tip' : 'Night Renewal Tip'}
                </h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {skincareMode === 'morning'
                    ? 'Allow your Vitamin C serum 60 seconds to absorb before applying moisturiser and SPF. Vitamin C and SPF work synergistically to neutralize UV-generated free radicals.'
                    : 'Always apply retinol to completely dry skin to minimize stinging. Seal with a ceramide cream to lock in cellular hydration throughout your 8 hours of sleep.'}
                </p>
              </div>
            </div>

            {/* Right Checklist */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {activeRoutine.name} Checklist
                </h3>
                <span className="text-xs text-muted-foreground">
                  Click checkbox or step to toggle
                </span>
              </div>

              <div className="space-y-3">
                {activeRoutine.steps.map((step, idx) => {
                  const done = isDone(step.id);
                  const linkedProduct = getProductForStep(step.productSuggestion);
                  const buyUrl = linkedProduct?.aliexpressUrl || `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(linkedProduct?.name || step.title)}`;

                  return (
                    <div
                      key={`${activeRoutine.id}-${step.id}-${idx}`}
                      className={cn(
                        'group rounded-2xl border transition-all duration-200',
                        done
                          ? 'border-primary/40 bg-primary/5 shadow-2xs'
                          : 'border-border bg-card hover:border-primary/40 hover:shadow-xs'
                      )}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-4">
                        <button
                          type="button"
                          onClick={() => handleToggle(step.id, step.title)}
                          className="flex items-start gap-4 text-left flex-1 cursor-pointer"
                        >
                          <span
                            className={cn(
                              'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl font-display text-sm font-semibold transition-colors mt-0.5',
                              done
                                ? 'bg-primary text-primary-foreground shadow-2xs'
                                : 'bg-secondary text-secondary-foreground group-hover:bg-primary/20'
                            )}
                          >
                            {done ? <Check className="h-4 w-4 stroke-[3]" /> : idx + 1}
                          </span>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  'font-display text-base font-semibold text-foreground transition-all',
                                  done && 'line-through text-muted-foreground'
                                )}
                              >
                                {step.title}
                              </span>
                              {step.timeOfDay && (
                                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase text-secondary-foreground">
                                  {step.timeOfDay}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </button>

                        {linkedProduct && (
                          <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/60 flex-shrink-0">
                            <Link
                              to={`/products/${linkedProduct.id}`}
                              className="flex items-center gap-2 group/prod"
                              title="View formula details"
                            >
                              <img
                                src={linkedProduct.image}
                                alt={linkedProduct.name}
                                className="h-10 w-10 rounded-xl object-cover border border-border"
                              />
                              <div className="text-left hidden xs:block">
                                <span className="block text-xs font-semibold text-foreground group-hover/prod:text-primary transition-colors line-clamp-1 max-w-[120px]">
                                  {linkedProduct.name}
                                </span>
                                <span className="block text-[11px] font-semibold text-primary">
                                  ${linkedProduct.price.toFixed(2)}
                                </span>
                              </div>
                            </Link>

                            <a
                              href={buyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#FF4747] hover:bg-[#E03131] text-white px-3.5 py-1.5 text-xs font-semibold shadow-2xs transition-all duration-200 hover:scale-105"
                              title="Buy product on AliExpress"
                            >
                              <ShoppingBag className="h-3.5 w-3.5" />
                              <span>Buy</span>
                              <ExternalLink className="h-2.5 w-2.5 opacity-80" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <DailyWaterTracker className="mt-6" />

          <div className="pt-12 border-t border-border/80">
            <CommunityRoutinesSection
              onRoutineImported={(routine) => {
                setImportedRoutine(routine);
                setActiveCategory('imported');
              }}
            />
          </div>
        </>
      )}

      <RoutineInfographicModal
        isOpen={showInfographicModal}
        onClose={() => setShowInfographicModal(false)}
        defaultRoutineId={activeRoutine.id}
      />

      <SocialShareModal
        isOpen={showSocialShareModal}
        onClose={() => setShowSocialShareModal(false)}
        shareContext={{
          type: 'routine_complete',
          title: `${activeRoutine.name} Stats`,
        }}
      />
    </div>
  );
}
