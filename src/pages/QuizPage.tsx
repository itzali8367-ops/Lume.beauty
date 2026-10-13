import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CalendarCheck,
  Heart,
  RotateCcw,
  Sun,
  Moon,
  Zap,
  Award,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Share2,
  Sliders,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSavedProducts } from '../hooks/useSavedProducts';
import { useRoutineProgress } from '../hooks/useRoutineProgress';
import { useProfile } from '../hooks/useProfile';
import { useProducts } from '../hooks/useProducts';
import { Button } from '../components/Button';
import { SocialShareModal } from '../components/SocialShareModal';
import { cn } from '../utils/cn';

interface Question {
  id: string;
  title: string;
  subtitle: string;
  multi?: boolean;
  options: {
    id: string;
    label: string;
    desc: string;
    icon?: string;
  }[];
}

const quizQuestions: Question[] = [
  {
    id: 'skinType',
    title: 'How does your bare skin feel mid-afternoon?',
    subtitle: 'Without any moisturizer applied at lunchtime:',
    options: [
      { id: 'Dry', label: 'Tight, flaky or parched', desc: 'Needs constant hydration & rich lipids', icon: '💧' },
      { id: 'Combination', label: 'Oily T-zone, normal cheeks', desc: 'Shine on forehead/nose with dry perimeters', icon: '✨' },
      { id: 'Oily', label: 'Uniformly shiny & slick', desc: 'Enlarged pores and excess sebum production', icon: '🌟' },
      { id: 'Sensitive', label: 'Flushed, stinging or reactive', desc: 'Delicate barrier prone to redness', icon: '🌿' },
      { id: 'Normal', label: 'Comfortable & balanced', desc: 'Neither excessively dry nor oily', icon: '🌸' },
    ],
  },
  {
    id: 'primaryConcerns',
    title: 'Select your top skin priorities',
    subtitle: 'We will target these directly with clinical-grade actives:',
    multi: true,
    options: [
      { id: 'Dullness', label: 'Fading Dullness & Uneven Tone', desc: 'Erase post-summer hyperpigmentation & fatigue', icon: '🌟' },
      { id: 'Dryness', label: 'Deep Cellular Moisture & Repair', desc: 'Soothe tightness and repair barrier lipids', icon: '💧' },
      { id: 'Acne', label: 'Clearing Breakouts & Blemishes', desc: 'Unclog pores and regulate sebum flow', icon: '✨' },
      { id: 'Aging', label: 'Smoothing Fine Lines & Firmness', desc: 'Collagen renewal and elasticity boost', icon: '⏳' },
      { id: 'Sensitivity', label: 'Calming Redness & Reactivity', desc: 'Colloidal oats, cica and barrier defense', icon: '🌿' },
    ],
  },
  {
    id: 'sensitivityLevel',
    title: 'How reactive is your skin to active ingredients?',
    subtitle: 'Helps us calibrate potent acids and retinol concentrations:',
    options: [
      { id: 'Resilient', label: 'Resilient & Hardy', desc: 'Rarely stings or reacts to new high-strength formulas', icon: '🛡️' },
      { id: 'Moderate', label: 'Mild / Occasional Tingling', desc: 'Mild flush with glycolic or strong vitamin C', icon: '⚖️' },
      { id: 'High', label: 'Highly Sensitive', desc: 'Easily reddens; strictly prefers fragrance-free soothing formulas', icon: '🌸' },
    ],
  },
  {
    id: 'environment',
    title: 'What best describes your daily environment?',
    subtitle: 'Environmental stress directly impacts skin barrier oxidation:',
    options: [
      { id: 'Urban', label: 'Metropolitan city with pollution', desc: 'Requires ectoin and high-antioxidant shielding', icon: '🏙️' },
      { id: 'Sunny', label: 'Sunny / warm climate', desc: 'Non-negotiable high SPF 50 daily photoprotection', icon: '☀️' },
      { id: 'DryCold', label: 'Dry indoor HVAC or harsh winters', desc: 'Heavy trans-epidermal water loss requires ceramides', icon: '❄️' },
      { id: 'Humid', label: 'Tropical or high humidity', desc: 'Requires ultralight weightless water-gel textures', icon: '🌴' },
    ],
  },
  {
    id: 'complexity',
    title: 'How extensive is your ideal daily skincare ritual?',
    subtitle: 'Consistency is far more important than a cabinet full of steps:',
    options: [
      { id: 'Minimalist', label: 'Minimalist (3 Essential Steps)', desc: 'Cleanse, Hydrate, Protect. Quick and effective.', icon: '⚡' },
      { id: 'Balanced', label: 'Balanced (4 Targeted Steps)', desc: 'Cleanse, Active Treatment Serum, Moisturizer, SPF.', icon: '🎯' },
      { id: 'Ritualist', label: 'The Complete Self-Care Ritual (5+ Steps)', desc: 'Double cleanse, essences, targeted actives & night masks.', icon: '✨' },
    ],
  },
];

export function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({
    skinType: ['Combination'],
    primaryConcerns: ['Dullness', 'Dryness'],
    sensitivityLevel: ['Moderate'],
    environment: ['Urban'],
    complexity: ['Balanced'],
  });
  const [quizFinished, setQuizFinished] = useState(false);
  const [showLiveFilterDrawer, setShowLiveFilterDrawer] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const { saveProfile } = useProfile();
  const { toggle, isSaved, saveAll } = useSavedProducts();
  const { addSteps } = useRoutineProgress();
  const { allProducts } = useProducts();

  const currentQ = quizQuestions[currentStep];

  const handleSelectOption = (qId: string, optId: string, multi = false) => {
    setAnswers((prev) => {
      if (!multi) {
        return { ...prev, [qId]: [optId] };
      }
      const existing = prev[qId] || [];
      const updated = existing.includes(optId)
        ? existing.filter((x) => x !== optId)
        : [...existing, optId];
      return { ...prev, [qId]: updated.length ? updated : [optId] };
    });
  };

  const handleNext = () => {
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      toast.success('Your personalized diagnostic regimen is ready!');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const skinType = answers.skinType?.[0] || 'Combination';
  const concerns = answers.primaryConcerns?.length ? answers.primaryConcerns : ['Dullness'];
  const sensitivity = answers.sensitivityLevel?.[0] || 'Moderate';
  const environment = answers.environment?.[0] || 'Urban';

  const archetype = useMemo(() => {
    if (concerns.includes('Acne') && (skinType === 'Oily' || skinType === 'Combination')) {
      return {
        title: 'The Clarifying Pore Alchemist',
        tagline: 'Regulate sebum, decongest micro-comedones, and maintain deep non-greasy hydration.',
        barrierStatus: 'Lipid Excess with Reactive Pores',
        keyActives: ['Salicylic Acid (BHA)', 'Niacinamide 5%', 'Centella Asiatica', 'Zinc PCA'],
        caution: 'Avoid heavy occlusive mineral oils and stripping alcohol washes.',
      };
    }
    if (concerns.includes('Dryness') || skinType === 'Dry') {
      return {
        title: 'The Barrier Restoration Maven',
        tagline: 'Replenish trans-epidermal water loss and reinforce cellular lipid cement.',
        barrierStatus: 'Moisture-Depleted & Compromised Stratum Corneum',
        keyActives: ['Ceramides NP/AP/EOP', 'Multi-Molecular Hyaluronic Acid', 'Squalane', 'Panthenol'],
        caution: 'Avoid high-foaming sulfates and excessive physical scrubs.',
      };
    }
    if (concerns.includes('Aging')) {
      return {
        title: 'The Ageless Cellular Sculptor',
        tagline: 'Stimulate collagen synthesis, smooth texture, and shield against photo-aging.',
        barrierStatus: 'Decreased Fibroblast Turnover',
        keyActives: ['Encapsulated Retinol 0.3%', 'Copper Peptides', 'Broad Spectrum SPF 50', 'Tocopherol'],
        caution: 'Never apply retinol without broad-spectrum daily sun protection.',
      };
    }
    if (concerns.includes('Sensitivity') || skinType === 'Sensitive') {
      return {
        title: 'The Calming Barrier Guardian',
        tagline: 'Soothe hyper-reactive nerve endings and restore an anti-inflammatory baseline.',
        barrierStatus: 'Sensitive & Vascularly Fragile',
        keyActives: ['Colloidal Oat Extract', 'Madecassoside (Cica)', 'Bisabolol', 'Ectoin'],
        caution: 'Avoid synthetic fragrances, essential oils, and harsh chemical peels.',
      };
    }
    return {
      title: 'The Dew Radiance Strategist',
      tagline: 'Neutralize oxidative stress, accelerate cellular turnover, and maximize light-reflecting glow.',
      barrierStatus: 'Balanced with Surface Oxidative Fatigue',
      keyActives: ['15% THD Ascorbate (Vitamin C)', 'Niacinamide', 'Kakadu Plum', 'Hyaluronic Acid'],
      caution: 'Ensure antioxidant serums are sealed with an adequate moisture barrier.',
    };
  }, [concerns, skinType]);

  const matchedPicks = useMemo(() => {
    const skincareOnly = allProducts.filter((p) => p.category === 'skincare');
    return skincareOnly
      .map((product) => {
        let score = 75;
        const matchingConcerns = product.concerns.filter((c) => concerns.includes(c));
        score += matchingConcerns.length * 9;

        if (product.suitableFor?.some((s) => s.toLowerCase().includes(skinType.toLowerCase()) || s.toLowerCase().includes('all'))) {
          score += 8;
        }
        if (sensitivity === 'High' && (product.id === 'gentle-cleanser' || product.id === 'hydra-glow')) {
          score += 6;
        }
        if ((environment === 'Sunny' || environment === 'Urban') && product.id === 'spf-shield') {
          score += 7;
        }

        let stepRole = 'Targeted Active';
        if (product.routineStep === 'Cleanse' || product.id.includes('cleanse')) stepRole = 'Step 1 • Cleanse';
        else if (product.routineStep === 'Treat' || product.id.includes('serum') || product.id.includes('retinol')) stepRole = 'Step 2 • Treat';
        else if (product.routineStep === 'Hydrate' || product.id.includes('glow') || product.id.includes('cream')) stepRole = 'Step 3 • Hydrate';
        else if (product.routineStep === 'Protect' || product.id.includes('spf')) stepRole = 'Step 4 • Protect';

        const finalScore = Math.min(Math.max(score, 78), 99);
        return {
          product,
          match: finalScore,
          stepRole,
          matchedConcerns: matchingConcerns,
          aliexpressUrl:
            product.aliexpressUrl ||
            `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(product.name)}`,
        };
      })
      .sort((a, b) => b.match - a.match);
  }, [allProducts, concerns, skinType, sensitivity, environment]);

  const topRecommendations = matchedPicks.slice(0, 4);

  const handleSaveToProfile = () => {
    saveProfile({
      name: 'Glowing Member',
      skinType,
      hairType: 'Wavy',
      concerns,
    });
    const idsToSave = topRecommendations.map((m) => m.product.id);
    saveAll(idsToSave);
    toast.success('Diagnostic profile & recommended products saved to your account!');
  };

  const handleApplyToRoutineTracker = () => {
    addSteps(['am-1', 'am-2', 'am-3', 'am-4', 'pm-1', 'pm-2', 'pm-3', 'pm-4']);
    toast.success('Bespoke routine added to your daily tracker! Visit Routines to begin.');
  };

  return (
    <div className="container-wide py-12">
      {!quizFinished ? (
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Clinical Skin Diagnostic
            </span>
            <h1 className="mt-4 font-display text-3xl font-semibold text-foreground sm:text-4xl">
              Discover Your Personalized Regimen
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Step {currentStep + 1} of {quizQuestions.length} • Real-time formula matching
            </p>
            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${((currentStep + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-10 rounded-[2.5rem] border border-border bg-card p-6 shadow-soft sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  {currentQ.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{currentQ.subtitle}</p>
              </div>
              {currentQ.multi && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Multi-select
                </span>
              )}
            </div>

            <div className="mt-6 space-y-3">
              {currentQ.options.map((opt) => {
                const selected = (answers[currentQ.id] || []).includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, opt.id, currentQ.multi)}
                    className={cn(
                      'flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer',
                      selected
                        ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary/40'
                        : 'border-border bg-card/60 hover:border-primary/40'
                    )}
                  >
                    <span className="text-2xl mt-0.5">{opt.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-display font-semibold text-foreground">
                          {opt.label}
                        </span>
                        <span
                          className={cn(
                            'flex h-5 w-5 items-center justify-center rounded-full border transition-colors',
                            selected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border'
                          )}
                        >
                          {selected && <Check className="h-3 w-3 stroke-[3]" />}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-border/80 pt-6">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className={currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Previous
              </Button>
              <Button size="lg" onClick={handleNext}>
                {currentStep === quizQuestions.length - 1 ? 'Generate My Regimen' : 'Next Step'}
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-fade-up space-y-10">
          {/* Hero Archetype Banner */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/95 to-primary/85 p-8 text-primary-foreground shadow-soft sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <div className="relative max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
                  <Award className="h-3.5 w-3.5" /> Diagnostic Skin Archetype
                </span>
                <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-medium backdrop-blur">
                  Skin Type: {skinType}
                </span>
              </div>
              <h1 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                {archetype.title}
              </h1>
              <p className="mt-3 text-base text-primary-foreground/90 leading-relaxed max-w-2xl">
                {archetype.tagline}
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-xs">
                <div className="rounded-xl bg-white/15 px-3 py-2 backdrop-blur">
                  <span className="opacity-75 block text-[11px]">Barrier Status</span>
                  <span className="font-semibold">{archetype.barrierStatus}</span>
                </div>
                <div className="rounded-xl bg-white/15 px-3 py-2 backdrop-blur">
                  <span className="opacity-75 block text-[11px]">Primary Concerns</span>
                  <span className="font-semibold">{concerns.join(', ')}</span>
                </div>
                <div className="rounded-xl bg-white/15 px-3 py-2 backdrop-blur">
                  <span className="opacity-75 block text-[11px]">Reactivity</span>
                  <span className="font-semibold">{sensitivity} Sensitivity</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button size="lg" variant="secondary" onClick={handleSaveToProfile}>
                  <Heart className="h-4 w-4 mr-1.5 fill-current" /> Save Profile & Regimen
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowLiveFilterDrawer((prev) => !prev)}
                  className="bg-white/10 text-primary-foreground border-white/30 hover:bg-white/20"
                >
                  <Sliders className="h-4 w-4 mr-1.5" />
                  {showLiveFilterDrawer ? 'Hide Filters' : 'Fine-Tune Concerns'}
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => setShareModalOpen(true)}
                  className="text-primary-foreground hover:bg-white/10"
                >
                  <Share2 className="h-4 w-4 mr-1.5" /> Share Report
                </Button>
                <Button
                  size="md"
                  variant="ghost"
                  onClick={() => {
                    setQuizFinished(false);
                    setCurrentStep(0);
                  }}
                  className="text-primary-foreground/80 hover:bg-white/10"
                >
                  <RotateCcw className="h-4 w-4 mr-1.5" /> Retake Quiz
                </Button>
              </div>
            </div>
          </div>

          {/* REAL-TIME FILTER ADJUSTMENT DRAWER */}
          {showLiveFilterDrawer && (
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 animate-fade-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-primary" />
                  <h3 className="font-display font-semibold text-foreground">
                    Real-Time Diagnostic Adjustment
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground">
                  Updates compatibility scores live
                </span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    Skin Type
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Dry', 'Combination', 'Oily', 'Sensitive', 'Normal'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleSelectOption('skinType', type)}
                        className={cn(
                          'rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer',
                          skinType === type
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card border border-border text-foreground hover:border-primary/50'
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    Concerns (Click to toggle)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Dullness', 'Dryness', 'Acne', 'Aging', 'Sensitivity'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleSelectOption('primaryConcerns', c, true)}
                        className={cn(
                          'rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer',
                          concerns.includes(c)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card border border-border text-foreground hover:border-primary/50'
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CLINICAL ACTIVES & BARRIER BREAKDOWN */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="font-display font-semibold text-foreground">Target Actives</h3>
              </div>
              <ul className="mt-4 space-y-2 text-xs">
                {archetype.keyActives.map((active) => (
                  <li key={active} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span className="font-medium text-foreground">{active}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center gap-2 text-amber-600">
                <Info className="h-5 w-5" />
                <h3 className="font-display font-semibold text-foreground">Formulation Rule</h3>
              </div>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                {archetype.caution}
              </p>
              <div className="mt-4 rounded-xl bg-secondary/50 p-3 text-[11px] text-muted-foreground">
                Optimal skin pH: 5.2 – 5.5. Maintain daily lipid barrier integrity.
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-primary">
                  <CalendarCheck className="h-5 w-5" />
                  <h3 className="font-display font-semibold text-foreground">Sync to Routine</h3>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Apply this calibrated morning and evening ritual directly to your daily streak tracker.
                </p>
              </div>
              <Button size="md" onClick={handleApplyToRoutineTracker} className="mt-4 w-full">
                <Sparkles className="h-4 w-4 mr-1.5" /> Apply Regimen Now
              </Button>
            </div>
          </div>

          {/* PERSONALIZED PRODUCT RECOMMENDATIONS */}
          <section className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> Matched Clinical Formulas
                </span>
                <h2 className="mt-1 font-display text-2xl font-semibold text-foreground sm:text-3xl">
                  Your Bespoke 4-Step Regimen
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Algorithmically ranked for {skinType.toLowerCase()} skin and targeting{' '}
                  {concerns.join(', ')}
                </p>
              </div>
              <Link to="/routines">
                <Button variant="outline" size="md">
                  View in Daily Tracker <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {topRecommendations.map(({ product, match, stepRole, aliexpressUrl }) => {
                const saved = isSaved(product.id);
                return (
                  <div
                    key={product.id}
                    className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm">
                        <Zap className="h-3 w-3 fill-current" /> {match}% Match
                      </span>
                      <span className="absolute right-3 top-3 rounded-full bg-background/90 text-foreground px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur">
                        {stepRole}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="uppercase tracking-wider font-semibold text-[11px]">
                          {product.brand}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
                          ★ {product.rating}
                        </div>
                      </div>

                      <Link
                        to={`/products/${product.id}`}
                        className="mt-1 font-display text-base font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {product.concerns.map((c) => (
                          <span
                            key={c}
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[10px] font-medium',
                              concerns.includes(c)
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'bg-secondary text-secondary-foreground'
                            )}
                          >
                            {c}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-2">
                        <span className="font-display text-lg font-semibold text-primary">
                          ${product.price.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggle(product.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
                            title={saved ? 'Saved' : 'Save'}
                          >
                            <Heart
                              className={cn(
                                'h-3.5 w-3.5',
                                saved && 'fill-primary text-primary'
                              )}
                            />
                          </button>
                          <a
                            href={aliexpressUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-full bg-[#FF4747] hover:bg-[#E03131] text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition-transform duration-200 hover:scale-105"
                            title="Buy this product on AliExpress"
                          >
                            <ShoppingBag className="h-3 w-3" />
                            <span>Buy</span>
                            <ExternalLink className="h-2.5 w-2.5 opacity-80" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* AM vs PM Ritual Blueprint */}
          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                  <Sun className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Morning Glow Ritual
                  </h3>
                  <p className="text-xs text-muted-foreground">Antioxidant Defense & Photoprotection</p>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground text-[10px]">
                    1
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground">Gentle Cleanse</h4>
                    <p className="text-muted-foreground text-[11px]">Refresh sebum without stripping moisture</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground text-[10px]">
                    2
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground">Radiance Vitamin C Serum</h4>
                    <p className="text-muted-foreground text-[11px]">Shield against free radicals & brighten marks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground text-[10px]">
                    3
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground">Hydra Glow Barrier Gel</h4>
                    <p className="text-muted-foreground text-[11px]">Hyaluronic acid & barrier ceramides lock-in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground text-[10px]">
                    4
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground">SPF 50 Daily Invisible Shield</h4>
                    <p className="text-muted-foreground text-[11px]">Broad-spectrum UVA/UVB defense against premature lines</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
                  <Moon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Evening Cellular Repair
                  </h3>
                  <p className="text-xs text-muted-foreground">Deep Cell Turnover & Lipid Nourishment</p>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground text-[10px]">
                    1
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground">Double Cleanse Foam</h4>
                    <p className="text-muted-foreground text-[11px]">Completely dissolves sunscreen and micro-pollutants</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground text-[10px]">
                    2
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground">Overnight Retinol Renewal</h4>
                    <p className="text-muted-foreground text-[11px]">Encapsulated 0.3% retinol stimulates collagen overnight</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground text-[10px]">
                    3
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground">Ceramide Barrier Cushion</h4>
                    <p className="text-muted-foreground text-[11px]">Seals trans-epidermal moisture loss during REM sleep</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground text-[10px]">
                    4
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground">Calm Herbal Night Tea</h4>
                    <p className="text-muted-foreground text-[11px]">Chamomile and passionflower for deep restorative rest</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      <SocialShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareContext={{
          type: 'general',
          title: `My Skin Archetype: ${archetype.title}`,
        }}
      />
    </div>
  );
}
