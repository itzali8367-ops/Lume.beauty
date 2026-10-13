import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Heart,
  CalendarCheck,
  Check,
  ShieldCheck,
  Sparkles,
  Droplets,
  Share2,
  CheckCircle2,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSavedProducts } from '../hooks/useSavedProducts';
import { useRoutineProgress } from '../hooks/useRoutineProgress';
import { useProductReviews } from '../hooks/useProductReviews';
import { useUserAccount } from '../hooks/useUserAccount';
import { useProducts } from '../hooks/useProducts';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { ProductReviewsSection } from '../components/ProductReviewsSection';
import { SocialShareModal } from '../components/SocialShareModal';
import { cn } from '../utils/cn';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { allProducts } = useProducts();
  const product = allProducts.find((p) => p.id === id);
  const { isSaved, toggle } = useSavedProducts();
  const { toggleStep } = useRoutineProgress();
  const { account } = useUserAccount();
  const { customReviews } = useProductReviews(id || '');

  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'howTo' | 'reviews'>('benefits');
  const [shareModalOpen, setShareModalOpen] = useState(false);

  if (!product) {
    return (
      <div className="container-wide py-24 text-center">
        <h1 className="font-display text-3xl font-semibold text-foreground">Product not found</h1>
        <p className="mt-2 text-muted-foreground">The product you are looking for does not exist.</p>
        <Link to="/discover" className="mt-4 inline-block">
          <Button>Back to Discover</Button>
        </Link>
      </div>
    );
  }

  const saved = isSaved(product.id);
  const allReviews = [...customReviews, ...(product.userReviews || [])];
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleToggleFavorite = () => {
    toggle(product.id);
    toast.success(saved ? 'Removed from favorites' : 'Saved to favorites');
  };

  const handleAddToRoutine = () => {
    const targetStepId =
      product.routineStep === 'Cleanse'
        ? 'am-1'
        : product.routineStep === 'Treat'
        ? 'am-2'
        : product.routineStep === 'Protect'
        ? 'am-4'
        : 'am-3';
    toggleStep(targetStepId);
    toast.success(`Added ${product.name} to your daily routine!`);
  };

  const buyUrl =
    product.aliexpressUrl ||
    `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(product.name)}`;

  return (
    <div className="container-wide py-10">
      {/* Back Link & Share */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/discover"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Discover
        </Link>
        <button
          type="button"
          onClick={() => setShareModalOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          title="Share product & reviews"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      {/* Main Product Hero */}
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Product Image */}
        <div className="relative">
          <div className="aspect-square overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-soft">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          {/* Badges */}
          <div className="absolute left-6 top-6 flex flex-wrap gap-2">
            <Badge className="bg-background/90 text-foreground backdrop-blur">
              {product.category}
            </Badge>
            {product.routineStep && (
              <span className="inline-flex items-center rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur">
                {product.routineStep} Step
              </span>
            )}
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {product.brand}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>

          {/* Price & Star Rating */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="font-display text-3xl font-semibold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {product.volume && (
              <span className="text-sm text-muted-foreground">({product.volume})</span>
            )}
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5 text-sm">
              <div className="flex text-accent">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      'h-4 w-4',
                      s <= Math.round(product.rating) ? 'fill-accent text-accent' : 'text-border'
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('reviews');
                  document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer text-left"
                title="View reviews and ratings"
              >
                <span className="font-semibold text-foreground">{product.rating}</span>
                <span className="text-muted-foreground underline underline-offset-2">
                  ({(product.reviews + customReviews.length).toLocaleString()} reviews)
                </span>
              </button>
            </div>
          </div>

          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {/* Targeted Concerns */}
          <div className="mt-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Targeted Concerns
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.concerns.map((concern) => (
                <span
                  key={concern}
                  className="rounded-full bg-secondary px-3.5 py-1 text-xs font-semibold text-secondary-foreground"
                >
                  {concern}
                </span>
              ))}
            </div>
          </div>

          {/* Key Benefits */}
          {product.keyBenefits && (
            <div className="mt-6 space-y-2 rounded-2xl bg-secondary/40 p-5 border border-border">
              <h3 className="font-display text-sm font-semibold text-foreground">Core Highlights</h3>
              <ul className="space-y-1.5">
                {product.keyBenefits.slice(0, 3).map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-foreground/85">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF4747] hover:bg-[#E03131] text-white px-7 py-3 font-display text-sm font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer flex-1 sm:flex-none"
              title="Buy this product on AliExpress"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Buy</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-80" />
            </a>

            <Button
              size="lg"
              variant={saved ? 'secondary' : 'outline'}
              onClick={handleToggleFavorite}
              className="flex-1 sm:flex-none"
            >
              <Heart className={cn('h-5 w-5 mr-2', saved && 'fill-primary text-primary')} />
              {saved ? 'Saved in Favorites' : 'Add to Favorites'}
            </Button>

            <Button size="lg" variant="ghost" onClick={handleAddToRoutine}>
              <CalendarCheck className="h-5 w-5 mr-2" />
              Add to Daily Routine
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-6 text-xs text-muted-foreground border-t border-border pt-4">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" /> Dermatologist Tested
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Droplets className="h-4 w-4 text-primary" /> Clean Actives
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" /> Cruelty-Free
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Section: Benefits, Ingredients, How To Use, Reviews */}
      <div className="mt-16">
        <div className="flex border-b border-border overflow-x-auto">
          {[
            { id: 'benefits', label: 'Benefits & Efficacy' },
            { id: 'ingredients', label: 'Actives & Ingredients' },
            { id: 'howTo', label: 'How to Use' },
            { id: 'reviews', label: `Reviews & Ratings (${allReviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'border-b-2 px-6 py-4 font-display text-base font-semibold transition-colors cursor-pointer whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Benefits */}
        {activeTab === 'benefits' && (
          <div className="mt-8 space-y-6 animate-fade-up">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card p-7">
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Clinical Efficacy & Results
                </h3>
                <ul className="mt-4 space-y-3">
                  {product.keyBenefits?.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </span>
                      <span className="text-sm text-foreground/90">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-border bg-card p-7">
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Skin Compatibility
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Formulated to respect delicate dermal lipid barriers without stinging or micro-tears.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.suitableFor?.map((type, i) => (
                    <span
                      key={i}
                      className="rounded-xl border border-border bg-secondary/50 px-3.5 py-1.5 text-xs font-semibold text-foreground"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Ingredients */}
        {activeTab === 'ingredients' && (
          <div className="mt-8 space-y-6 animate-fade-up">
            {product.keyActives && product.keyActives.length > 0 && (
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">Key Actives</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {product.keyActives.map((active, i) => (
                    <div key={i} className="rounded-2xl border border-border bg-card p-5">
                      <div className="flex items-center justify-between">
                        <span className="font-display font-semibold text-foreground">
                          {active.name}
                        </span>
                        {active.percentage && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                            {active.percentage}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {active.purpose}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-border bg-card p-7">
              <h3 className="font-display text-xl font-semibold text-foreground">
                Full Ingredients (INCI)
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Transparent clean chemistry, free from parabens, synthetic sulfates, and artificial dyes.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/80 font-mono">
                {product.ingredients?.join(', ') || 'Aqua, Glycerin, Propanediol, Sodium Hyaluronate, Tocopherol.'}
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: How to Use */}
        {activeTab === 'howTo' && (
          <div className="mt-8 space-y-6 animate-fade-up">
            <div className="rounded-3xl border border-border bg-card p-7">
              <h3 className="font-display text-xl font-semibold text-foreground">
                Application Protocol
              </h3>
              <p className="mt-3 text-base leading-relaxed text-foreground/90">
                {product.howToUse || 'Apply 2-3 drops to clean skin morning and evening.'}
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-secondary/50 p-4 border border-border">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Timing
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold text-foreground">
                    {product.routineStep === 'Protect' ? 'Every Morning' : 'AM & PM Ritual'}
                  </p>
                </div>
                <div className="rounded-2xl bg-secondary/50 p-4 border border-border">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Order in Routine
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold text-foreground">
                    {product.routineStep || 'Daily step'}
                  </p>
                </div>
                <div className="rounded-2xl bg-secondary/50 p-4 border border-border">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Amount
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold text-foreground">
                    3–4 drops or dime-sized
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: User Reviews & Ratings */}
        {activeTab === 'reviews' && (
          <div className="mt-8 animate-fade-up">
            <ProductReviewsSection product={product} />
          </div>
        )}
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-border pt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Pairs Well With
              </p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-foreground">
                Complementary Formulas
              </h2>
            </div>
            <Link to="/discover">
              <Button variant="outline">Browse all</Button>
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareContext={{
          type: 'general',
          title: `Discover ${product.name} on Lumi`,
        }}
      />
    </div>
  );
}
