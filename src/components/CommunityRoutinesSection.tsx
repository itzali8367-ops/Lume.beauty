import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Check,
  Download,
  Users,
  Star,
  Clock,
  Sun,
  Moon,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Heart,
  BadgeCheck,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';
import { communityRoutines, CommunityRoutine } from '../data/communityRoutinesData';
import { useAchievements } from '../hooks/useAchievements';
import { useProducts } from '../hooks/useProducts';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Button } from './Button';
import { cn } from '../utils/cn';

interface CommunityRoutinesSectionProps {
  onRoutineImported?: (routine: CommunityRoutine) => void;
  className?: string;
}

export function CommunityRoutinesSection({ onRoutineImported, className }: CommunityRoutinesSectionProps) {
  const [selectedSkinType, setSelectedSkinType] = useState<string>('All');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(communityRoutines[0]?.id || null);
  const { recordImportedRoutine, importedRoutines } = useAchievements();
  const { allProducts } = useProducts();

  const [likedRoutines, setLikedRoutines] = useLocalStorage<string[]>('lumie.community_likes', [
    'comm-barrier-rescue',
  ]);

  const skinTypes = [
    { label: 'All Types', value: 'All' },
    { label: 'Dry & Dehydrated', value: 'Dry' },
    { label: 'Oily & Acne-Prone', value: 'Oily' },
    { label: 'Sensitive & Reactive', value: 'Sensitive' },
    { label: 'Combination', value: 'Combination' },
    { label: 'Mature & Firming', value: 'Mature' },
    { label: 'Dull & Dark Spots', value: 'Dull' },
  ];

  const filteredRoutines = communityRoutines.filter((routine) => {
    if (selectedSkinType !== 'All' && routine.skinType !== selectedSkinType) {
      return false;
    }
    if (selectedTimeOfDay !== 'all') {
      if (selectedTimeOfDay === 'morning' && routine.timeOfDay === 'evening') return false;
      if (selectedTimeOfDay === 'evening' && routine.timeOfDay === 'morning') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = routine.title.toLowerCase().includes(q);
      const matchDesc = routine.description.toLowerCase().includes(q);
      const matchAuthor = routine.author.name.toLowerCase().includes(q);
      const matchTag = routine.tags.some((t) => t.toLowerCase().includes(q));
      const matchStep = routine.steps.some(
        (s) => s.title.toLowerCase().includes(q) || s.keyIngredient.toLowerCase().includes(q)
      );
      if (!matchTitle && !matchDesc && !matchAuthor && !matchTag && !matchStep) {
        return false;
      }
    }
    return true;
  });

  const handleToggleLike = (routineId: string) => {
    setLikedRoutines((prev) => {
      const exists = prev.includes(routineId);
      if (exists) {
        toast.info('Removed from saved community routines');
        return prev.filter((id) => id !== routineId);
      } else {
        toast.success('Saved to favorite community routines!');
        return [...prev, routineId];
      }
    });
  };

  const handleImportRoutine = (routine: CommunityRoutine) => {
    recordImportedRoutine(routine.id);
    if (onRoutineImported) {
      onRoutineImported(routine);
    }
    toast.success(`Imported "${routine.title}"! Unlocked 'Routine Architect' badge! 🏆`, {
      duration: 4000,
    });
  };

  const getProduct = (productId?: string) => {
    if (!productId) return null;
    return allProducts.find((p) => p.id === productId);
  };

  return (
    <section className={cn('space-y-8 animate-fade-up', className)}>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Users className="h-3.5 w-3.5" /> Collective Clinical Wisdom
          </span>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-foreground">
            Community Skincare Routines
          </h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Browse and import pre-configured daily regimens formulated by dermatologists, cosmetic chemists, and aesthetic leaders for specific skin types.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ingredient, concern..."
            className="w-full rounded-full border border-border bg-card pl-10 pr-4 py-2 text-xs sm:text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
          />
        </div>
      </div>

      {/* Skin Type Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground mr-1 hidden sm:inline">
          Skin Type:
        </span>
        {skinTypes.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => setSelectedSkinType(type.value)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer',
              selectedSkinType === type.value
                ? 'bg-primary text-primary-foreground shadow-2xs'
                : 'bg-card border border-border text-foreground hover:border-primary/50'
            )}
          >
            {type.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-1.5 bg-secondary/80 p-1 rounded-full text-xs">
          <button
            type="button"
            onClick={() => setSelectedTimeOfDay('all')}
            className={cn(
              'rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer',
              selectedTimeOfDay === 'all'
                ? 'bg-background text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            All Times
          </button>
          <button
            type="button"
            onClick={() => setSelectedTimeOfDay('morning')}
            className={cn(
              'rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1',
              selectedTimeOfDay === 'morning'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Sun className="h-3 w-3" /> AM
          </button>
          <button
            type="button"
            onClick={() => setSelectedTimeOfDay('evening')}
            className={cn(
              'rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1',
              selectedTimeOfDay === 'evening'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Moon className="h-3 w-3" /> PM
          </button>
        </div>
      </div>

      {/* Routine Cards List */}
      {filteredRoutines.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
          <Layers className="mx-auto h-12 w-12 text-muted-foreground/60" />
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            No routines found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try resetting your skin type filter or search terms.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSelectedSkinType('All');
              setSelectedTimeOfDay('all');
              setSearchQuery('');
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRoutines.map((routine) => {
            const isExpanded = expandedRoutineId === routine.id;
            const isImported = importedRoutines.includes(routine.id);
            const isLiked = likedRoutines.includes(routine.id);

            return (
              <div
                key={routine.id}
                className={cn(
                  'overflow-hidden rounded-[2rem] border transition-all duration-300',
                  isExpanded
                    ? 'border-primary/50 bg-card shadow-md ring-1 ring-primary/20'
                    : 'border-border bg-card hover:border-primary/30 hover:shadow-xs'
                )}
              >
                <div className="p-6 sm:p-7">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
                          {routine.skinType} Skin
                        </span>
                        <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                          {routine.timeOfDay === 'morning' ? (
                            <>
                              <Sun className="h-3 w-3" /> Morning AM
                            </>
                          ) : routine.timeOfDay === 'evening' ? (
                            <>
                              <Moon className="h-3 w-3" /> Evening PM
                            </>
                          ) : (
                            <>
                              <Sun className="h-3 w-3" /> AM & <Moon className="h-3 w-3" /> PM
                            </>
                          )}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                          <Clock className="h-3.5 w-3.5" /> {routine.durationMinutes} min protocol
                        </span>
                        <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold ml-auto sm:ml-0">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          {routine.metrics.rating} ({routine.metrics.reviewsCount} reviews)
                        </span>
                      </div>

                      <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                        {routine.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                        {routine.subtitle}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <img
                          src={routine.author.avatar}
                          alt={routine.author.name}
                          className="h-6 w-6 rounded-full object-cover border border-border"
                        />
                        <span className="text-xs font-semibold text-foreground">
                          {routine.author.name}
                        </span>
                        {routine.author.verified && (
                          <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          • {routine.author.role}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleLike(routine.id)}
                        className={cn(
                          'flex h-11 w-11 items-center justify-center rounded-2xl border transition-colors cursor-pointer',
                          isLiked
                            ? 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                            : 'border-border bg-card text-muted-foreground hover:text-foreground'
                        )}
                        title={isLiked ? 'Saved' : 'Save Routine'}
                      >
                        <Heart className={cn('h-5 w-5', isLiked && 'fill-rose-500')} />
                      </button>

                      <Button
                        size="md"
                        variant={isImported ? 'outline' : 'primary'}
                        onClick={() => handleImportRoutine(routine)}
                        className={cn(
                          'gap-2 font-semibold shadow-2xs',
                          isImported && 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30'
                        )}
                      >
                        {isImported ? (
                          <>
                            <Check className="h-4 w-4 text-emerald-600 stroke-[3]" />
                            <span>Imported</span>
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            <span>Import Routine</span>
                          </>
                        )}
                      </Button>

                      <button
                        type="button"
                        onClick={() => setExpandedRoutineId(isExpanded ? null : routine.id)}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-secondary/50 text-foreground hover:bg-secondary transition-colors cursor-pointer"
                        title={isExpanded ? 'Collapse steps' : 'Inspect steps'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-border/50">
                    {routine.tags.map((tag, tagIdx) => (
                      <span
                        key={`${routine.id}-tag-${tagIdx}-${tag}`}
                        className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                    <span className="ml-auto text-[11px] text-muted-foreground font-medium">
                      {routine.metrics.importsCount} community members imported
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-border bg-secondary/20 p-6 sm:p-8 space-y-6 animate-fade-down">
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
                      <h4 className="flex items-center gap-2 font-display text-sm font-semibold text-primary">
                        <ShieldCheck className="h-4 w-4" /> Dermatological Protocol Notes
                      </h4>
                      <ul className="mt-2 space-y-1 text-xs text-foreground/80">
                        {routine.clinicalHighlights.map((hl, i) => (
                          <li key={`${routine.id}-hl-${i}`} className="flex items-start gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Protocol Steps ({routine.steps.length})
                      </h4>
                      <div className="grid gap-3">
                        {routine.steps.map((step) => {
                          const product = getProduct(step.productSuggestion);
                          return (
                            <div
                              key={step.id}
                              className="rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              <div className="flex items-start gap-3.5 flex-1">
                                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-display text-xs font-bold">
                                  {step.stepNumber}
                                </span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h5 className="font-display text-sm font-bold text-foreground">
                                      {step.title}
                                    </h5>
                                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                                      {step.timeOfDay}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                    {step.description}
                                  </p>
                                  <span className="mt-1.5 inline-block text-[11px] font-semibold text-primary">
                                    Key Active: {step.keyIngredient}
                                  </span>
                                </div>
                              </div>

                              {product && (
                                <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/60 flex-shrink-0">
                                  <Link
                                    to={`/products/${product.id}`}
                                    className="flex items-center gap-2 group/prod"
                                    title="View formula details"
                                  >
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="h-10 w-10 rounded-xl object-cover border border-border"
                                    />
                                    <div className="text-left hidden xs:block">
                                      <span className="block text-xs font-semibold text-foreground group-hover/prod:text-primary transition-colors line-clamp-1 max-w-[120px]">
                                        {product.name}
                                      </span>
                                      <span className="block text-[11px] font-semibold text-primary">
                                        ${product.price.toFixed(2)}
                                      </span>
                                    </div>
                                  </Link>
                                  <a
                                    href={
                                      product.aliexpressUrl ||
                                      `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(product.name)}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-full bg-[#FF4747] hover:bg-[#E03131] text-white px-3 py-1.5 text-xs font-semibold shadow-2xs transition-transform hover:scale-105"
                                    title="Buy product on AliExpress"
                                  >
                                    <ShoppingBag className="h-3.5 w-3.5" />
                                    <span>Buy</span>
                                    <ExternalLink className="h-2.5 w-2.5 opacity-80" />
                                  </a>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs text-muted-foreground">
                        Importing replaces or supplements your current steps with this verified protocol.
                      </p>
                      <Button
                        size="md"
                        variant={isImported ? 'outline' : 'primary'}
                        onClick={() => handleImportRoutine(routine)}
                      >
                        {isImported ? 'Imported to My Routines ✓' : 'Import This Entire Routine'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
