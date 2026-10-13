import { useState } from 'react';
import {
  ChevronDown,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Search,
  Droplets,
  Flame,
  ShoppingBag,
  Moon,
} from 'lucide-react';
import { cn } from '../utils/cn';

interface FaqItem {
  id: string;
  category: 'routine' | 'ingredients' | 'affiliate' | 'tracking';
  question: string;
  answer: string;
  highlights?: string[];
}

export function FaqSection({ className }: { className?: string }) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'routine' | 'ingredients' | 'affiliate' | 'tracking'>('all');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-2']);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'routine',
      question: 'How do I know which skincare routine matches my specific skin type?',
      answer:
        'You can take our clinical 2-minute Skin Diagnostic Quiz to identify your primary skin type (Oily, Dry, Sensitive, Combination, or Normal) and your targeted concerns. We also provide pre-configured Community Routine Templates formulated by medical aestheticians and dermatologists that you can browse and import with a single click.',
      highlights: [
        'Personalized diagnostic algorithm',
        'Ready-to-use community routine templates',
        'Tailored AM and PM step sequences',
      ],
    },
    {
      id: 'faq-2',
      category: 'ingredients',
      question: 'Can I use Vitamin C in the morning and Retinol in the evening?',
      answer:
        'Yes! In fact, this is considered the gold-standard dual-action regimen in modern dermatology. Vitamin C provides potent antioxidant protection against daytime UV and pollution-induced free radicals, while Retinol works overnight during your circadian repair peak to accelerate cellular turnover and stimulate collagen synthesis. Always pair daytime Vitamin C with broad-spectrum SPF 50.',
      highlights: [
        'Vitamin C shields and neutralizes free radicals in the AM',
        'Retinol repairs and accelerates cellular turnover in the PM',
        'Always finish your morning routine with broad-spectrum SPF 50',
      ],
    },
    {
      id: 'faq-3',
      category: 'ingredients',
      question: 'What is the correct order to layer multi-step skincare products?',
      answer:
        'The general clinical rule is thinnest to thickest consistency: Cleanser → Toner/Essence → Water-based Serums (Vitamin C, Niacinamide, Hyaluronic Acid) → Targeted Emulsions → Moisturizing Creams → Facial Oils → Sunscreen (AM always last). Applying in this order ensures lightweight active molecules penetrate deeply before being sealed by occlusive moisturizers.',
      highlights: [
        'Order of application: Watery textures first, occlusive creams last',
        'Allow 30 to 60 seconds between active serums for maximum absorption',
        'Sunscreen must always be the final step of your morning routine',
      ],
    },
    {
      id: 'faq-4',
      category: 'routine',
      question: 'Why does Lumi feature a dedicated dark mode for evening routines?',
      answer:
        'Bright blue light from phone screens suppresses natural melatonin production and interferes with cellular regeneration during sleep. Our Evening Skincare Dark Mode utilizes soothing obsidian and warm slate tones with reduced contrast so you can check off your PM cleanse and retinol rituals comfortably before bed without straining your eyes or disrupting circadian rhythm.',
      highlights: [
        'Comfortable evening viewing during nighttime skincare routines',
        'Reduces eye strain and preserves natural melatonin production',
        'Easily toggled with the Sun/Moon icon in the top header',
      ],
    },
    {
      id: 'faq-5',
      category: 'tracking',
      question: 'How do the daily water tracker and streak system calculate my radiance score?',
      answer:
        'Your daily Radiance Score combines two core physiological pillars: completing your scheduled AM/PM skincare habits (up to 50 points) and reaching your daily cellular hydration goal of 8 glasses / 2,000ml (up to 50 points). Unbroken consecutive days build your Glow Streak, which unlocks progressive achievement badges like 7-Day Glow Streak and Aqua Olympian.',
      highlights: [
        'Real-time glass logger (250ml per glass)',
        'Consecutive day streak counter with flame heatmap',
        'Unlocks commemorative badges and level progression',
      ],
    },
    {
      id: 'faq-6',
      category: 'affiliate',
      question: 'How does purchasing products work on Lumi?',
      answer:
        'Every product card and routine step includes a direct "Buy" button linking directly to verified merchant listings on AliExpress and beauty partners. When you click Buy, you are taken directly to the formula without any price markup for you. We may earn a small referral commission, which helps keep Lumi free, ad-free, and continually updated.',
      highlights: [
        'Curated directly for ingredient efficacy, clean chemistry, and affordability',
        'Direct "Buy" button connects straight to product listings',
        'Zero price markup or extra fees for users',
      ],
    },
    {
      id: 'faq-7',
      category: 'routine',
      question: 'What should I do if my skin barrier feels tight, red, or stinging?',
      answer:
        'When your lipid barrier is compromised, immediately pause potent active ingredients like exfoliating AHA/BHA acids and strong retinoids. Switch to our "Deep Barrier Rescue" routine: cleanse with a gentle non-stripping cleanser, flood with soothing humectants (panthenol, hyaluronic acid), and seal with a rich 3:1:1 physiological ceramide cream. Most barriers heal within 7 to 14 days of gentle care.',
      highlights: [
        'Pause active chemical exfoliants and retinoids immediately',
        'Emphasize barrier-identical ceramides, cholesterol, and fatty acids',
        'Hydrate internally with plenty of water and avoid hot wash water',
      ],
    },
    {
      id: 'faq-8',
      category: 'tracking',
      question: 'Can I share my routine streak or achievements to social media?',
      answer:
        'Yes! You can click the "Share" icon in the header or on your Progress Page to open our Social Share component. You can share your streak milestones directly to Twitter/X or export a high-resolution 9:16 Instagram Story image with your stats, badges, and hydration metrics using the Web Share API or one-click download.',
      highlights: [
        'One-click Twitter / X intent share with pre-crafted captions',
        'Instagram Stories (9:16) and Feed (4:5) canvas image export',
        'Web Share API support for native sharing to messaging and story apps',
      ],
    },
  ];

  const filteredFaqs = faqs.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.highlights?.some((h) => h.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const toggleOpen = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container-wide">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <HelpCircle className="h-3.5 w-3.5" /> Frequently Asked Questions
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need to Know About Your Glow
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Clinical guidance on building lasting routines, combining active ingredients, affiliate transparency, and tracking your skin wellness.
          </p>

          {/* Search Bar */}
          <div className="relative mt-6 max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search answers (e.g. Retinol, barrier, dark mode...)"
              className="w-full rounded-full border border-border bg-card pl-11 pr-4 py-2.5 text-xs sm:text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-2xs transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all' as const, label: 'All Questions' },
              { id: 'routine' as const, label: 'Routines & Skin Types' },
              { id: 'ingredients' as const, label: 'Ingredients & Pairing' },
              { id: 'tracking' as const, label: 'Streaks & Hydration' },
              { id: 'affiliate' as const, label: 'Affiliates & Buying' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer',
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-2xs'
                    : 'bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="mx-auto mt-10 max-w-3xl space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No matching questions found for "{searchQuery}". Try a different search term or reset filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-3 text-xs font-semibold text-primary underline underline-offset-2"
              >
                Reset Search
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className={cn(
                    'rounded-2xl border transition-all duration-200 overflow-hidden',
                    isOpen
                      ? 'border-primary/40 bg-card shadow-xs ring-1 ring-primary/10'
                      : 'border-border bg-card hover:border-primary/30'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleOpen(faq.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between p-5 sm:p-6 text-left cursor-pointer"
                  >
                    <span className="font-display text-base sm:text-lg font-semibold text-foreground pr-4">
                      {faq.question}
                    </span>
                    <span
                      className={cn(
                        'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-transform duration-200',
                        isOpen && 'rotate-180 bg-primary/10 text-primary'
                      )}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 pt-0 border-t border-border/50 animate-fade-down">
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                      {faq.highlights && faq.highlights.length > 0 && (
                        <div className="mt-3.5 rounded-xl bg-secondary/50 p-3.5">
                          <span className="text-2xs font-bold uppercase tracking-wider text-primary block mb-1.5">
                            Key Takeaways
                          </span>
                          <ul className="space-y-1">
                            {faq.highlights.map((h, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-foreground/85">
                                <span className="text-primary font-bold">•</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Additional trust banner */}
        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 p-6 sm:p-8 text-center">
          <h3 className="font-display text-lg font-bold text-foreground">
            Still have questions about your specific skin regimen?
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Our personalized skin diagnostic matches ingredients to your exact tolerance levels and barrier health.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/quiz"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-2xs hover:bg-primary/90 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" /> Take Skin Diagnostic Quiz
            </a>
            <a
              href="/routines"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-semibold text-foreground hover:border-primary transition-all"
            >
              Explore Daily Rituals
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
