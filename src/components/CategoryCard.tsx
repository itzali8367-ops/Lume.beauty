import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '../types';

export interface CategoryCardProps {
  category: Category;
  count: number;
}

export function CategoryCard({ category, count }: CategoryCardProps) {
  return (
    <Link
      to={`/discover?category=${category.id}`}
      className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl p-6 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
    >
      <img
        src={category.image}
        alt={category.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
          {count} products
        </p>
        <h3 className="mt-1 flex items-center gap-1 font-display text-2xl font-semibold">
          {category.name}
          <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </h3>
        <p className="mt-1 text-sm text-white/85">{category.tagline}</p>
      </div>
    </Link>
  );
}
