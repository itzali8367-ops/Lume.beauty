import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Sun, CheckCircle2 } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useProducts } from '../hooks/useProducts';
import { useGuides } from '../hooks/useGuides';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { Hero } from '../components/Hero';
import { SectionHeading } from '../components/SectionHeading';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { GuideCard } from '../components/GuideCard';
import { Button } from '../components/Button';
import { BeautyProfileModal } from '../components/BeautyProfileModal';
import { MorningRoutineWidget } from '../components/MorningRoutineWidget';
import { SkinConsultationForm } from '../components/SkinConsultationForm';
import { DailyWellnessAffirmation } from '../components/DailyWellnessAffirmation';
import { RoutineInfographicModal } from '../components/RoutineInfographicModal';
import { FaqSection } from '../components/FaqSection';

export function HomePage() {
  const { profile } = useProfile();
  const { allProducts } = useProducts();
  const { allGuides } = useGuides();
  const { siteSettings } = useSiteSettings();
  const [modalOpen, setModalOpen] = useState(false);
  const [infographicOpen, setInfographicOpen] = useState(false);

  const recommendedProducts = useMemo(() => {
    if (!profile || profile.concerns.length === 0) {
      return allProducts.filter((p) => p.featured);
    }
    const matched = allProducts.filter((p) =>
      p.concerns.some((c) => profile.concerns.includes(c))
    );
    return matched.length >= 3 ? matched : allProducts.filter((p) => p.featured);
  }, [allProducts, profile]);

  const { morningSection, routineBanner, categories } = siteSettings;

  return (
    <div>
      {/* Hero Header */}
      <Hero onPersonalize={() => setModalOpen(true)} />

      {/* Daily Wellness Affirmation Component */}
      <section className="container-wide -mt-6 sm:-mt-8 relative z-20 pb-8">
        <DailyWellnessAffirmation />
      </section>

      {/* Interactive Morning Routine Widget Section */}
      <section className="container-wide py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              <Sun className="h-3.5 w-3.5 fill-accent" /> {morningSection.badge}
            </span>
            <h2 className="font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              {morningSection.title}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              {morningSection.description}
            </p>
            <ul className="space-y-2 pt-2 text-sm text-foreground/80">
              {morningSection.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <MorningRoutineWidget />
          </div>
        </div>
      </section>

      {/* Interactive Multi-Step Diagnostic Regimen Finder */}
      <section className="container-wide py-12">
        <SkinConsultationForm />
      </section>

      {/* Three Pillars Categories */}
      <section className="container-wide py-14">
        <SectionHeading
          eyebrow="Explore"
          title="Find your focus"
          description="Three pillars of beauty, each with curated products and expert guidance."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              count={allProducts.filter((p) => p.category === cat.id).length}
            />
          ))}
        </div>
      </section>

      {/* Recommended Formulas Grid */}
      <section className="bg-card py-16 border-y border-border/80">
        <div className="container-wide">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow={profile ? `For ${profile.name}` : 'Recommended'}
              title={profile ? 'Picked for your skin & hair' : 'Trending this week'}
              description={
                profile
                  ? `Matched to your ${profile.skinType.toLowerCase()} skin and top concerns.`
                  : "Our editors' most-loved products across every category."
              }
            />
            {!profile && (
              <Button variant="secondary" onClick={() => setModalOpen(true)}>
                <Sparkles className="h-4 w-4 mr-1.5" /> Personalize
              </Button>
            )}
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recommendedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link to="/discover">
              <Button variant="outline" size="lg">
                See all products <ArrowRight className="h-5 w-5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Habit Callout Banner */}
      <section className="container-wide py-16">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-primary-foreground sm:px-12 shadow-soft">
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="relative max-w-xl">
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              {routineBanner.title}
            </h2>
            <p className="mt-3 text-base text-primary-foreground/90">
              {routineBanner.description}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/routines">
                <Button size="lg" variant="secondary">
                  {routineBanner.buttonText} <ArrowRight className="h-5 w-5 ml-1.5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setInfographicOpen(true)}
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                <Sparkles className="h-5 w-5 mr-1.5" /> Generate Visual Infographic
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Editor Guides */}
      <section className="container-wide pb-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Learn"
            title="Guides & expert tips"
            description="Short, practical reads to help you get the most from your routine."
          />
          <Link to="/guides">
            <Button variant="outline">All guides</Button>
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {allGuides.slice(0, 3).map((g) => (
            <GuideCard key={g.id} guide={g} />
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions Section (Trust & SEO) */}
      <FaqSection className="border-t border-border/80 bg-secondary/15" />

      {modalOpen && <BeautyProfileModal onClose={() => setModalOpen(false)} />}
      <RoutineInfographicModal
        isOpen={infographicOpen}
        onClose={() => setInfographicOpen(false)}
      />
    </div>
  );
}
