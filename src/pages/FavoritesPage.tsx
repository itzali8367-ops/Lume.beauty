import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Trash2, CalendarCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useSavedProducts } from '../hooks/useSavedProducts';
import { useRoutineProgress } from '../hooks/useRoutineProgress';
import { useProducts } from '../hooks/useProducts';
import { SectionHeading } from '../components/SectionHeading';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { cn } from '../utils/cn';

const categoryTabs = [
  { id: 'all', label: 'All Favorites' },
  { id: 'skincare', label: 'Skincare' },
  { id: 'haircare', label: 'Haircare' },
  { id: 'wellness', label: 'Wellness' },
];

export function FavoritesPage() {
  const { saved, clearAll } = useSavedProducts();
  const { addSteps } = useRoutineProgress();
  const { allProducts } = useProducts();
  const [selectedCat, setSelectedCat] = useState('all');

  const savedProductsList = useMemo(() => {
    return allProducts.filter((p) => saved.includes(p.id));
  }, [allProducts, saved]);

  const filtered = useMemo(() => {
    if (selectedCat === 'all') return savedProductsList;
    return savedProductsList.filter((p) => p.category === selectedCat);
  }, [savedProductsList, selectedCat]);

  const handleClearAll = () => {
    clearAll();
    toast.info('All favorites removed');
  };

  const handleAddAllToRoutine = () => {
    addSteps(['am-1', 'am-2', 'am-3']);
    toast.success('Added your saved favorites to your daily routine!');
  };

  return (
    <div className="container-wide py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="My Vanity"
          title="Saved Favorites"
          description="Your personal beauty edit. Review formulas, compare actives, and add them directly to your daily ritual."
        />
        {savedProductsList.length > 0 && (
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleAddAllToRoutine}>
              <CalendarCheck className="h-4 w-4 mr-1.5" /> Add to Routine
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1.5" /> Clear All
            </Button>
          </div>
        )}
      </div>

      {savedProductsList.length > 0 ? (
        <div className="mt-8 space-y-8">
          <div className="flex flex-wrap gap-2">
            {categoryTabs.map((tab) => {
              const count =
                tab.id === 'all'
                  ? savedProductsList.length
                  : savedProductsList.filter((p) => p.category === tab.id).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCat(tab.id)}
                  className={cn(
                    'rounded-full px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer',
                    selectedCat === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
                  )}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>

          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} {filtered.length === 1 ? 'saved formula' : 'saved formulas'}
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-12 rounded-[2.5rem] border border-dashed border-border bg-card p-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-primary">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="mt-5 font-display text-2xl font-semibold text-foreground">
            Your vanity is waiting
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            You haven't bookmarked any products yet. Browse our curated collection across skincare,
            haircare, and wellness to save your top picks.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/discover">
              <Button size="lg">
                Explore Products <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
            <Link to="/quiz">
              <Button size="lg" variant="outline">
                <Sparkles className="h-4 w-4 mr-1.5" /> Take Skin Quiz
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
