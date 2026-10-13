import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Sparkles,
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Clock,
  Tag
} from 'lucide-react';
import { products, routines } from '../data/mockData';
import { useGuides } from '../hooks/useGuides';
import { Product, Guide, Routine } from '../types';
import { cn } from '../utils/cn';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'products' | 'guides' | 'routines'>('all');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { allGuides } = useGuides();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const cleanQuery = query.trim().toLowerCase();

  const matchedProducts: Product[] = useMemo(() => {
    if (!cleanQuery) return [];
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(cleanQuery) ||
        p.brand.toLowerCase().includes(cleanQuery) ||
        p.description.toLowerCase().includes(cleanQuery) ||
        p.category.toLowerCase().includes(cleanQuery) ||
        p.concerns.some((c) => c.toLowerCase().includes(cleanQuery)) ||
        p.ingredients?.some((ing) => ing.toLowerCase().includes(cleanQuery))
      );
    });
  }, [cleanQuery]);

  const matchedGuides: Guide[] = useMemo(() => {
    if (!cleanQuery) return [];
    return allGuides.filter((g) => {
      return (
        g.title.toLowerCase().includes(cleanQuery) ||
        g.excerpt.toLowerCase().includes(cleanQuery) ||
        g.category.toLowerCase().includes(cleanQuery) ||
        g.author.toLowerCase().includes(cleanQuery) ||
        g.tags.some((t) => t.toLowerCase().includes(cleanQuery)) ||
        g.takeaways.some((t) => t.toLowerCase().includes(cleanQuery))
      );
    });
  }, [cleanQuery]);

  const matchedRoutines: Routine[] = useMemo(() => {
    if (!cleanQuery) return [];
    return routines.filter((r) => {
      return (
        r.name.toLowerCase().includes(cleanQuery) ||
        r.time.toLowerCase().includes(cleanQuery) ||
        r.category.toLowerCase().includes(cleanQuery) ||
        r.steps.some(
          (s) =>
            s.title.toLowerCase().includes(cleanQuery) ||
            s.description.toLowerCase().includes(cleanQuery)
        )
      );
    });
  }, [cleanQuery]);

  const totalResults = matchedProducts.length + matchedGuides.length + matchedRoutines.length;

  const popularSearches = [
    'Vitamin C',
    'Retinol',
    'Hydration',
    'Barrier repair',
    'SPF 50',
    'Frizz',
    'Layering serums',
    'Scalp care',
  ];

  const handleSelectProduct = (id: string) => {
    onClose();
    navigate(`/products/${id}`);
  };

  const handleSelectGuide = (id: string) => {
    onClose();
    navigate(`/guides/${id}`);
  };

  const handleSelectRoutine = () => {
    onClose();
    navigate(`/routines`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:pt-20">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-border/80 bg-card shadow-2xl animate-fade-up">
        {/* Header Input */}
        <div className="relative flex items-center border-b border-border/80 px-4 py-3 sm:px-6">
          <Search className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, guides, routines, or concerns..."
            className="h-12 w-full bg-transparent text-base sm:text-lg font-medium text-foreground outline-none placeholder:text-muted-foreground/60"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-lg border border-border bg-muted/60 px-2 py-1 text-[11px] font-mono text-muted-foreground">
              ESC
            </kbd>
          )}
        </div>

        {/* Filter Categories */}
        {cleanQuery && totalResults > 0 && (
          <div className="flex border-b border-border/60 px-4 sm:px-6 py-2 gap-1.5 overflow-x-auto bg-secondary/30">
            {[
              { id: 'all', label: `All (${totalResults})` },
              { id: 'products', label: `Products (${matchedProducts.length})` },
              { id: 'guides', label: `Guides (${matchedGuides.length})` },
              { id: 'routines', label: `Routines (${matchedRoutines.length})` },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id as any)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer',
                  activeFilter === f.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {!cleanQuery ? (
            <div className="space-y-6 py-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Popular Topics
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3.5 py-1.5 text-xs font-medium text-foreground hover:border-primary/50 hover:bg-secondary transition-colors cursor-pointer"
                    >
                      <Tag className="h-3 w-3 text-primary" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Quick Navigation
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/quiz');
                    }}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 text-left hover:border-primary/40 transition-colors cursor-pointer"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-display text-sm font-semibold text-foreground">Skin Quiz</p>
                      <p className="text-[11px] text-muted-foreground">Custom regimen</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/routines');
                    }}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 text-left hover:border-primary/40 transition-colors cursor-pointer"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
                      <CalendarCheck className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-display text-sm font-semibold text-foreground">Routines</p>
                      <p className="text-[11px] text-muted-foreground">Daily rituals</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/guides');
                    }}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 text-left hover:border-primary/40 transition-colors cursor-pointer"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                      <BookOpen className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-display text-sm font-semibold text-foreground">Guides</p>
                      <p className="text-[11px] text-muted-foreground">Editorial reads</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center">
              <p className="font-display text-xl font-semibold text-foreground">
                No matches found for "{query}"
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try searching for ingredients like "Vitamin C", concerns like "Dryness", or products.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {(activeFilter === 'all' || activeFilter === 'products') && matchedProducts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Products ({matchedProducts.length})
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {matchedProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProduct(p.id)}
                        className="group flex items-center gap-3.5 rounded-2xl border border-border bg-card p-3 transition-all hover:border-primary/40 hover:bg-secondary/20 cursor-pointer"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-12 w-12 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              {p.brand}
                            </span>
                            <span className="font-display font-semibold text-primary text-sm">
                              ${p.price.toFixed(2)}
                            </span>
                          </div>
                          <h4 className="font-display text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {p.name}
                          </h4>
                          <p className="truncate text-xs text-muted-foreground">{p.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(activeFilter === 'all' || activeFilter === 'guides') && matchedGuides.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Guides & Articles ({matchedGuides.length})
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {matchedGuides.map((g) => (
                      <div
                        key={g.id}
                        onClick={() => handleSelectGuide(g.id)}
                        className="group flex items-center gap-3.5 rounded-2xl border border-border bg-card p-3 transition-all hover:border-primary/40 hover:bg-secondary/20 cursor-pointer"
                      >
                        <img
                          src={g.image}
                          alt={g.title}
                          className="h-12 w-12 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-semibold uppercase tracking-wider text-primary">
                              {g.category}
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {g.readTime} min read
                            </span>
                          </div>
                          <h4 className="font-display text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {g.title}
                          </h4>
                          <p className="truncate text-xs text-muted-foreground">{g.excerpt}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(activeFilter === 'all' || activeFilter === 'routines') && matchedRoutines.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Rituals & Routines ({matchedRoutines.length})
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {matchedRoutines.map((r) => (
                      <div
                        key={r.id}
                        onClick={handleSelectRoutine}
                        className="group flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-secondary/20 cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                              {r.time}
                            </span>
                          </div>
                          <h4 className="mt-1 font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                            {r.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {r.steps.length} guided steps • {r.steps.map((s) => s.title).join(', ')}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border/80 bg-muted/40 px-6 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">
              ESC
            </kbd>
            <span>to close</span>
          </div>
          <span className="font-medium text-foreground">Lumi Search</span>
        </div>
      </div>
    </div>
  );
}
