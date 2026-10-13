import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { concernsByCategory } from '../data/mockData';
import { useProducts } from '../hooks/useProducts';
import { SectionHeading } from '../components/SectionHeading';
import { ProductCard } from '../components/ProductCard';
import { cn } from '../utils/cn';
import { CategoryId } from '../types';

const categoryTabs = [
  { id: 'all', label: 'All' },
  { id: 'skincare', label: 'Skincare' },
  { id: 'haircare', label: 'Haircare' },
  { id: 'wellness', label: 'Wellness' },
];

export function DiscoverPage() {
  const { allProducts } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const [search, setSearch] = useState('');
  const [selectedConcern, setSelectedConcern] = useState<string | null>(null);

  const handleCategoryChange = (catId: string) => {
    setSelectedConcern(null);
    setSearchParams(catId === 'all' ? {} : { category: catId });
  };

  const availableConcerns = useMemo(() => {
    if (categoryParam === 'all') return [];
    return concernsByCategory[categoryParam as CategoryId] || [];
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchCat = categoryParam === 'all' || p.category === categoryParam;
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());
      const matchConcern = !selectedConcern || p.concerns.includes(selectedConcern);
      return matchCat && matchSearch && matchConcern;
    });
  }, [allProducts, categoryParam, search, selectedConcern]);

  return (
    <div className="container-wide py-12">
      <SectionHeading
        eyebrow="Discover"
        title="Curated products for every concern"
        description="Search, filter and save the products that fit your routine."
      />

      <div className="mt-8 flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products or brands..."
            className="h-12 w-full rounded-full border border-border bg-card pl-12 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleCategoryChange(tab.id)}
              className={cn(
                'rounded-full px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer',
                categoryParam === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {availableConcerns.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {availableConcerns.map((concern) => (
              <button
                key={concern}
                onClick={() =>
                  setSelectedConcern((prev) => (prev === concern ? null : concern))
                }
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer',
                  selectedConcern === concern
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                )}
              >
                {concern}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
      </p>

      {filteredProducts.length > 0 ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <p className="font-display text-xl font-semibold text-foreground">No matches found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search or clear your filters.
          </p>
        </div>
      )}
    </div>
  );
}
