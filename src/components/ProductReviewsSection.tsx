import React, { useState, useMemo } from 'react';
import {
  Star,
  MessageSquarePlus,
  ThumbsUp,
  CheckCircle2,
  Filter,
  Send,
  Sparkles,
  ShieldCheck,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useUserAccount } from '../hooks/useUserAccount';
import { Product, ProductReview } from '../types';
import { Button } from './Button';
import { cn } from '../utils/cn';

interface ProductReviewsSectionProps {
  product: Product;
  className?: string;
}

export function ProductReviewsSection({ product, className }: ProductReviewsSectionProps) {
  const { account, isLoggedIn } = useUserAccount();

  // Storage for user submitted reviews for this product
  const [storedReviews, setStoredReviews] = useLocalStorage<ProductReview[]>(
    `lumie.reviews_${product.id}`,
    product.userReviews || []
  );

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [filterSkinType, setFilterSkinType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');

  // New review form states
  const [newRating, setNewRating] = useState<number>(5);
  const [newAuthor, setNewAuthor] = useState(account?.name || '');
  const [newSkinType, setNewSkinType] = useState(account?.skinType || 'Combination');
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(true);

  // Helpfulness votes tracked in localStorage
  const [helpfulVotes, setHelpfulVotes] = useLocalStorage<Record<string, number>>(
    `lumie.review_helpful_${product.id}`,
    {}
  );
  const [userVoted, setUserVoted] = useLocalStorage<string[]>(
    `lumie.review_user_voted_${product.id}`,
    []
  );

  // Compute breakdown stats
  const totalReviews = storedReviews.length;
  const ratingSum = storedReviews.reduce((acc, r) => acc + r.rating, 0);
  const averageRating = totalReviews > 0 ? (ratingSum / totalReviews).toFixed(1) : product.rating.toFixed(1);

  const starCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    storedReviews.forEach((r) => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[rounded] = (counts[rounded] || 0) + 1;
    });
    return counts;
  }, [storedReviews]);

  // Filtered and sorted reviews
  const displayedReviews = useMemo(() => {
    let list = [...storedReviews];
    if (filterRating !== 'all') {
      list = list.filter((r) => Math.round(r.rating) === filterRating);
    }
    if (filterSkinType !== 'all') {
      list = list.filter((r) => r.skinType?.toLowerCase() === filterSkinType.toLowerCase());
    }
    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      list.sort((a, b) => a.rating - b.rating);
    }
    return list;
  }, [storedReviews, filterRating, filterSkinType, sortBy]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newTitle.trim()) {
      toast.error('Please fill in both the title and review message.');
      return;
    }

    const newRev: ProductReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: newAuthor.trim() || (isLoggedIn && account ? account.name : 'Verified Member'),
      rating: newRating,
      title: newTitle.trim(),
      comment: newComment.trim(),
      date: new Date().toISOString().slice(0, 10),
      verifiedBuyer: true,
      skinType: newSkinType,
    };

    setStoredReviews((prev) => [newRev, ...prev]);
    setNewTitle('');
    setNewComment('');
    setShowReviewForm(false);
    toast.success('Thank you for sharing your experience! Review posted.');
  };

  const handleHelpfulVote = (reviewId: string) => {
    if (userVoted.includes(reviewId)) {
      toast.info('You have already marked this review as helpful.');
      return;
    }
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
    setUserVoted((prev) => [...prev, reviewId]);
    toast.success('Marked review as helpful!');
  };

  return (
    <div className={cn('space-y-8', className)} id="reviews-section">
      {/* Overview Card with Breakdown Bars */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft">
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          {/* Average Rating Highlight */}
          <div className="lg:col-span-4 text-center lg:text-left space-y-3 lg:border-r lg:border-border/70 lg:pr-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Overall Community Rating
            </span>
            <div className="flex items-baseline justify-center lg:justify-start gap-3">
              <span className="font-display text-5xl font-bold text-foreground">
                {averageRating}
              </span>
              <span className="text-sm font-semibold text-muted-foreground">/ 5.0</span>
            </div>
            <div className="flex justify-center lg:justify-start text-accent">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'h-5 w-5',
                    star <= Math.round(Number(averageRating))
                      ? 'fill-accent text-accent'
                      : 'text-border'
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {totalReviews} verified reviews from real skincare enthusiasts
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowReviewForm((prev) => !prev)}
              className="w-full sm:w-auto mt-2"
            >
              <MessageSquarePlus className="h-4 w-4 mr-2" />
              {showReviewForm ? 'Close Form' : 'Write a Review'}
            </Button>
          </div>

          {/* Star Distribution Progress Bars */}
          <div className="lg:col-span-8 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = starCounts[stars as 1 | 2 | 3 | 4 | 5] || 0;
              const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <button
                  key={stars}
                  type="button"
                  onClick={() => setFilterRating((prev) => (prev === stars ? 'all' : stars))}
                  className={cn(
                    'flex items-center gap-3 w-full py-1 px-2 rounded-xl text-xs transition-colors cursor-pointer text-left',
                    filterRating === stars ? 'bg-primary/10 font-bold' : 'hover:bg-secondary/60'
                  )}
                >
                  <span className="w-12 text-muted-foreground flex items-center gap-1 font-medium">
                    {stars} <Star className="h-3 w-3 fill-accent text-accent" />
                  </span>
                  <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-muted-foreground font-mono">
                    {percentage}%
                  </span>
                  <span className="w-8 text-right text-muted-foreground text-2xs">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review Form Drawer / Card */}
      {showReviewForm && (
        <form
          onSubmit={handleSubmitReview}
          className="rounded-3xl border border-primary/30 bg-primary/[0.02] p-6 sm:p-8 space-y-5 animate-fade-down shadow-soft"
        >
          <div className="flex items-center justify-between border-b border-border/70 pb-4">
            <div>
              <h4 className="font-display text-xl font-bold text-foreground">
                Write a Verified Experience
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Share your skin type, texture notes, and real results to help fellow shoppers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Rating picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Your Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className="cursor-pointer hover:scale-120 transition-transform"
                >
                  <Star
                    className={cn(
                      'h-7 w-7 transition-colors',
                      star <= newRating ? 'fill-accent text-accent' : 'text-border'
                    )}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-semibold text-foreground">
                {newRating === 5
                  ? '5 Stars – Holy Grail Formula!'
                  : newRating === 4
                  ? '4 Stars – Very Effective'
                  : newRating === 3
                  ? '3 Stars – Average'
                  : newRating === 2
                  ? '2 Stars – Not suited for my skin'
                  : '1 Star – Disappointed'}
              </span>
            </div>
          </div>

          {/* Author Name & Skin Type */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="e.g. Maya R."
                className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Your Skin Type
              </label>
              <select
                value={newSkinType}
                onChange={(e) => setNewSkinType(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="Dry">Dry Skin</option>
                <option value="Oily">Oily & Acne-Prone</option>
                <option value="Sensitive">Sensitive & Reactive</option>
                <option value="Combination">Combination</option>
                <option value="Mature">Mature Skin</option>
              </select>
            </div>
          </div>

          {/* Headline */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Headline
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Noticed visible barrier repair within 4 days!"
              className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Detailed Comment */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Review Details
            </label>
            <textarea
              required
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="How does it feel on the skin? Have you noticed changes in redness, texture, hydration or morning glow?"
              className="w-full rounded-xl border border-border bg-card p-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* Recommend Toggle */}
          <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={wouldRecommend}
              onChange={(e) => setWouldRecommend(e.target.checked)}
              className="rounded text-primary focus:ring-primary h-4 w-4"
            />
            <span className="font-semibold">I recommend this skincare formula to others</span>
          </label>

          {/* Submit CTA */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowReviewForm(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <Send className="h-4 w-4 mr-2" />
              Post Review
            </Button>
          </div>
        </form>
      )}

      {/* Filter and Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground mr-1 hidden sm:inline">
            Filter:
          </span>
          <select
            value={filterRating === 'all' ? 'all' : String(filterRating)}
            onChange={(e) =>
              setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground outline-none cursor-pointer"
          >
            <option value="all">All Stars ({totalReviews})</option>
            <option value="5">5 Stars only ({starCounts[5] || 0})</option>
            <option value="4">4 Stars only ({starCounts[4] || 0})</option>
            <option value="3">3 Stars only ({starCounts[3] || 0})</option>
          </select>

          <select
            value={filterSkinType}
            onChange={(e) => setFilterSkinType(e.target.value)}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground outline-none cursor-pointer"
          >
            <option value="all">All Skin Types</option>
            <option value="dry">Dry Skin</option>
            <option value="oily">Oily Skin</option>
            <option value="sensitive">Sensitive Skin</option>
            <option value="combination">Combination Skin</option>
          </select>
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground outline-none cursor-pointer"
          >
            <option value="newest">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Review Cards List */}
      <div className="space-y-4">
        {displayedReviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No reviews match the current filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterRating('all');
                setFilterSkinType('all');
              }}
              className="mt-2 text-xs font-semibold text-primary underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          displayedReviews.map((rev) => {
            const votes = helpfulVotes[rev.id] || 0;
            const hasVoted = userVoted.includes(rev.id);

            return (
              <div
                key={rev.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-2xs hover:border-primary/30 transition-all space-y-3"
              >
                {/* Header row: stars, author, verified pill, date */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex text-accent">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={cn(
                            'h-4 w-4',
                            s <= rev.rating ? 'fill-accent text-accent' : 'text-border'
                          )}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-foreground text-sm">
                      {rev.author}
                    </span>
                    {rev.verifiedBuyer && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> Verified Buyer
                      </span>
                    )}
                    {rev.skinType && (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {rev.skinType} Skin
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(rev.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Review Headline & Text */}
                <h5 className="font-display text-base font-semibold text-foreground">
                  {rev.title}
                </h5>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {rev.comment}
                </p>

                {/* Footer: Helpful button */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                  <span className="text-muted-foreground text-2xs">
                    Verified clinical application
                  </span>
                  <button
                    type="button"
                    onClick={() => handleHelpfulVote(rev.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-3 py-1 transition-all cursor-pointer',
                      hasVoted
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    <ThumbsUp className="h-3 w-3" />
                    <span>Helpful ({votes})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
