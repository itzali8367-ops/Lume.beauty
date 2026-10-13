import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Heart,
  CalendarCheck,
  RefreshCw,
  Star,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { products } from '../data/mockData';
import { useProfile } from '../hooks/useProfile';
import { useSavedProducts } from '../hooks/useSavedProducts';
import { Product } from '../types';
import { Button } from './Button';
import { cn } from '../utils/cn';

interface ConsultationState {
  concerns: string[];
  skinType: string;
  hydrationLevel: string;
  sunExposure: string;
  primaryGoal: string;
  routinePreference: string;
}

const concernOptions = [
  { id: 'Dryness', label: 'Dryness & Flaking', icon: '💧', desc: 'Skin feels tight, parched or rough' },
  { id: 'Acne', label: 'Acne & Breakouts', icon: '✨', desc: 'Frequent blemishes, blackheads or clogged pores' },
  { id: 'Dullness', label: 'Dullness & Dark Spots', icon: '🌟', desc: 'Lack of natural radiance or hyperpigmentation' },
  { id: 'Aging', label: 'Fine Lines & Elasticity', icon: '⏳', desc: 'Early wrinkles, loss of firmness or bounce' },
  { id: 'Sensitivity', label: 'Redness & Sensitivity', icon: '🌿', desc: 'Easily irritated, stinging or reactive barrier' },
];

const skinTypeOptions = [
  { id: 'Dry', label: 'Dry', desc: 'Feels tight after washing, craves rich balms' },
  { id: 'Combination', label: 'Combination', desc: 'Oily forehead and nose, normal or dry cheeks' },
  { id: 'Oily', label: 'Oily', desc: 'Visible shine, larger pores throughout face' },
  { id: 'Sensitive', label: 'Sensitive', desc: 'Prone to burning, redness or reaction' },
  { id: 'Normal', label: 'Balanced', desc: 'Even texture with no extreme oil or dryness' },
];

const goalOptions = [
  { id: 'Glow', label: 'Lit-from-within Radiance', sub: 'Brighten dark marks & boost luminous bounce' },
  { id: 'Barrier', label: 'Repair Moisture Barrier', sub: 'Restore ceramides & eliminate flaking tightness' },
  { id: 'Clear', label: 'Clear Pores & Clarify', sub: 'Smooth texture & prevent stubborn breakouts' },
  { id: 'Renew', label: 'Smooth & Youthful Renewal', sub: 'Accelerate collagen synthesis & soften lines' },
];

export function SkinConsultationForm({ className }: { className?: string }) {
  const [step, setStep] = useState(1);
  const { saveProfile } = useProfile();
  const { toggle, isSaved } = useSavedProducts();
  const [form, setForm] = useState<ConsultationState>({
    concerns: ['Dryness', 'Dullness'],
    skinType: 'Combination',
    hydrationLevel: 'Moderate / Normal',
    sunExposure: 'Moderate Outdoor Exposure (1-2 hrs)',
    primaryGoal: 'Glow',
    routinePreference: 'Balanced 4-Step',
  });

  const toggleConcern = (concern: string) => {
    setForm((prev) => {
      const exists = prev.concerns.includes(concern);
      const updated = exists ? prev.concerns.filter((c) => c !== concern) : [...prev.concerns, concern];
      return { ...prev, concerns: updated.length ? updated : [concern] };
    });
  };

  const matchedProducts: { product: Product; matchScore: number; reason: string }[] = React.useMemo(() => {
    return products
      .filter((p) => p.category === 'skincare')
      .map((p) => {
        let score = 70;
        const reasons: string[] = [];
        const matchedConcerns = p.concerns.filter((c) => form.concerns.includes(c));
        score += matchedConcerns.length * 12;
        if (matchedConcerns.length > 0) {
          reasons.push(`Targets ${matchedConcerns.join(' & ')}`);
        }
        if (p.suitableFor?.some((s) => s.toLowerCase().includes(form.skinType.toLowerCase()) || s.includes('All'))) {
          score += 10;
        }
        if (form.primaryGoal === 'Glow' && p.id === 'radiance-serum') {
          score += 8;
          reasons.push('Ideal for your glow goal');
        }
        if (form.primaryGoal === 'Barrier' && p.id === 'hydra-glow') {
          score += 8;
          reasons.push('Key ceramide barrier restoration');
        }
        return {
          product: p,
          matchScore: Math.min(score, 99),
          reason: reasons[0] || 'Essential routine foundation',
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  }, [form]);

  const handleApplyRoutine = () => {
    saveProfile({
      name: 'Glowing You',
      skinType: form.skinType,
      hairType: 'Wavy',
      concerns: form.concerns,
    });
    matchedProducts.forEach((m) => {
      if (!isSaved(m.product.id)) {
        toggle(m.product.id);
      }
    });
    toast.success('Your personalized routine has been saved and added to your favorites!');
  };

  const handleReset = () => {
    setStep(1);
  };

  return (
    <section
      id="consultation-tool"
      className={cn(
        'relative overflow-hidden rounded-[2.5rem] border border-border bg-gradient-to-b from-card via-card to-background p-6 shadow-soft sm:p-10 lg:p-12',
        className
      )}
    >
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-secondary/70 dark:bg-secondary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />

      {/* Progress Header */}
      <div className="relative mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Multi-Step Diagnostic
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Personalized Skin Regimen Finder
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Answer 3 quick questions for dermatologist-grade product matching tailored to your skin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all',
                  step === s
                    ? 'bg-primary text-primary-foreground shadow-sm scale-110'
                    : step > s
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {step > s ? <Check className="h-3.5 w-3.5" /> : s}
              </span>
              {s < 4 && (
                <div
                  className={cn(
                    'h-0.5 w-4 sm:w-6 rounded-full transition-colors',
                    step > s ? 'bg-primary/40' : 'bg-muted'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: CONCERNS */}
      {step === 1 && (
        <div className="relative animate-fade-up space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Step 1 of 3</span>
            <h3 className="mt-1 font-display text-2xl font-semibold text-foreground">
              What are your primary skin concerns?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Select all that apply. We tailor key actives and hydration balance based on this.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {concernOptions.map((item) => {
              const selected = form.concerns.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleConcern(item.id)}
                  className={cn(
                    'group flex flex-col items-start rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer',
                    selected
                      ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30'
                      : 'border-border bg-card/60 hover:border-primary/40 hover:bg-card'
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-2xl">{item.icon}</span>
                    <span
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded-full border transition-colors',
                        selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card'
                      )}
                    >
                      {selected && <Check className="h-3 w-3 stroke-[3]" />}
                    </span>
                  </div>
                  <h4 className="mt-3 font-display text-base font-semibold text-foreground">
                    {item.label}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <Button size="lg" onClick={() => setStep(2)}>
              Next: Skin Type <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: SKIN TYPE & HYDRATION */}
      {step === 2 && (
        <div className="relative animate-fade-up space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Step 2 of 3</span>
            <h3 className="mt-1 font-display text-2xl font-semibold text-foreground">
              How does your skin feel throughout the day?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              This ensures your cleanser and moisturizer textures never clog pores or leave dry patches.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Select your skin type
            </label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {skinTypeOptions.map((st) => {
                const selected = form.skinType === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, skinType: st.id }))}
                    className={cn(
                      'flex flex-col items-start rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer',
                      selected
                        ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30'
                        : 'border-border bg-card/60 hover:border-primary/40 hover:bg-card'
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-display font-semibold text-foreground">{st.label}</span>
                      <span
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded-full border',
                          selected ? 'border-primary bg-primary' : 'border-border'
                        )}
                      >
                        {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">{st.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" onClick={() => setStep(1)}>
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
            </Button>
            <Button size="lg" onClick={() => setStep(3)}>
              Next: Goals & Lifestyle <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: GOALS & PREFERENCES */}
      {step === 3 && (
        <div className="relative animate-fade-up space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Step 3 of 3</span>
            <h3 className="mt-1 font-display text-2xl font-semibold text-foreground">
              What is your primary glow ambition?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We align targeted active serums and restorative treatments to deliver this outcome.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {goalOptions.map((goal) => {
              const selected = form.primaryGoal === goal.id;
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, primaryGoal: goal.id }))}
                  className={cn(
                    'flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer',
                    selected
                      ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30'
                      : 'border-border bg-card/60 hover:border-primary/40'
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border',
                      selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                    )}
                  >
                    {selected && <Check className="h-3 w-3 stroke-[3]" />}
                  </span>
                  <div>
                    <span className="font-display font-semibold text-foreground">{goal.label}</span>
                    <p className="mt-0.5 text-xs text-muted-foreground">{goal.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" onClick={() => setStep(2)}>
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
            </Button>
            <Button size="lg" onClick={() => setStep(4)}>
              Generate My Regimen <Sparkles className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: RESULTS */}
      {step === 4 && (
        <div className="relative animate-fade-up space-y-8">
          <div className="rounded-2xl bg-secondary/50 p-6 border border-border">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" /> Customized Analysis
                </span>
                <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">
                  Your Tailored 3-Step Core Regimen
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Configured for <strong className="text-foreground">{form.skinType} skin</strong> with a focus on{' '}
                  <strong className="text-foreground">{form.concerns.join(', ')}</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retake
                </Button>
                <Button size="sm" onClick={handleApplyRoutine}>
                  <Heart className="h-3.5 w-3.5 mr-1 fill-current" /> Save Recommendations
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {matchedProducts.map(({ product, matchScore, reason }) => {
              const saved = isSaved(product.id);
              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-sm">
                      <Zap className="h-3 w-3 fill-current" /> {matchScore}% Match
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        toggle(product.id);
                        toast.success(saved ? 'Removed from favorites' : 'Saved to favorites');
                      }}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur hover:bg-background cursor-pointer"
                    >
                      <Heart className={cn('h-4 w-4', saved && 'fill-primary text-primary')} />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold uppercase tracking-wider">{product.brand}</span>
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {product.rating}
                      </span>
                    </div>

                    <Link
                      to={`/products/${product.id}`}
                      className="mt-1 font-display text-lg font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-xs text-primary font-medium">{reason}</p>
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                      {product.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/70">
                      <span className="font-display text-lg font-semibold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                      <Link to={`/products/${product.id}`}>
                        <Button size="sm" variant="outline">
                          View details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-card border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display font-semibold text-foreground">
                  Ready to follow this routine?
                </p>
                <p className="text-xs text-muted-foreground">
                  Check off each step daily with our interactive Morning & Evening ritual trackers.
                </p>
              </div>
            </div>
            <Link to="/routines">
              <Button size="md">
                Launch Routine Tracker <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
