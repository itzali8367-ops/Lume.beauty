import { useMemo, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useGuides } from '../hooks/useGuides';
import { SectionHeading } from '../components/SectionHeading';
import { GuideCard } from '../components/GuideCard';
import { Button } from '../components/Button';
import { cn } from '../utils/cn';

const guideTabs = [
  { id: 'all', label: 'All' },
  { id: 'skincare', label: 'Skincare' },
  { id: 'haircare', label: 'Haircare' },
  { id: 'wellness', label: 'Wellness' },
];

export function GuidesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { allGuides } = useGuides();

  const filteredGuides = useMemo(() => {
    if (selectedCategory === 'all') return allGuides;
    return allGuides.filter((g) => g.category === selectedCategory);
  }, [allGuides, selectedCategory]);

  return (
    <div className="container-wide py-12">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border/80 pb-8">
        <SectionHeading
          eyebrow="Guides & Editorial"
          title="Expert knowledge, made simple"
          description="Evidence-backed rituals, ingredient deep dives, and holistic wellness guides from our team."
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {guideTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={cn(
                'rounded-full px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer',
                selectedCategory === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {filteredGuides.length} {filteredGuides.length === 1 ? 'article' : 'articles'}
        </p>
      </div>

      {filteredGuides.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGuides.map((guide) => (
            <div key={guide.id} className="relative group">
              <GuideCard guide={guide} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-[2.5rem] border border-dashed border-border bg-card p-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-primary">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="mt-5 font-display text-2xl font-semibold text-foreground">
            No articles in this section yet
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Explore other categories or check back soon for fresh edits from our dermatologists and editors.
          </p>
          <div className="mt-6">
            <Button variant="outline" onClick={() => setSelectedCategory('all')}>
              View All Guides
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
