import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '../types';
import { useSavedProducts } from '../hooks/useSavedProducts';
import { Badge } from './Badge';
import { cn } from '../utils/cn';

const categoryLabels: Record<string, string> = {
  skincare: 'Skincare',
  haircare: 'Haircare',
  wellness: 'Wellness',
};

export function ProductCard({ product }: { product: Product }) {
  const { isSaved, toggle } = useSavedProducts();
  const navigate = useNavigate();
  const saved = isSaved(product.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
    toast.success(saved ? 'Removed from favorites' : 'Saved to favorites');
  };

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const buyUrl =
    product.aliexpressUrl ||
    `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(product.name)}`;

  return (
    <article
      onClick={handleCardClick}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={handleToggle}
          aria-label={saved ? 'Remove from favorites' : 'Save to favorites'}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background cursor-pointer"
        >
          <Heart className={cn('h-5 w-5 transition-colors', saved && 'fill-primary text-primary')} />
        </button>
        <span className="absolute left-3 top-3">
          <Badge className="bg-background/90 text-foreground backdrop-blur">
            {categoryLabels[product.category] || product.category}
          </Badge>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </p>
        <Link
          to={`/products/${product.id}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 font-display text-lg font-semibold leading-snug text-foreground hover:text-primary transition-colors"
        >
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

        <div className="mt-3 flex items-center gap-1.5 text-sm">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="font-semibold text-foreground">{product.rating}</span>
          <span className="text-muted-foreground">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="font-display text-xl font-semibold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggle}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary cursor-pointer"
            >
              {saved ? 'Saved' : 'Save'}
            </button>
            <a
              href={buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-full bg-[#FF4747] hover:bg-[#E03131] text-white px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all duration-200 hover:shadow-sm hover:scale-105"
              title="Buy this product on AliExpress"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Buy</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-80" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
