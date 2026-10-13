import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Check, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useGuides } from '../hooks/useGuides';
import { Badge } from '../components/Badge';
import { GuideCard } from '../components/GuideCard';

export function GuideDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { allGuides } = useGuides();
  const guide = allGuides.find((g) => g.id === id);

  if (!guide) {
    return (
      <div className="container-wide py-24 text-center">
        <h1 className="font-display text-3xl font-semibold text-foreground">Guide not found</h1>
        <Link to="/guides" className="mt-4 inline-block font-semibold text-primary">
          Back to guides
        </Link>
      </div>
    );
  }

  const related = allGuides
    .filter((g) => g.category === guide.category && g.id !== guide.id)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Article link copied to clipboard');
    }
  };

  return (
    <article>
      <div className="container-wide max-w-3xl pt-10">
        <div className="flex items-center justify-between">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> All guides
          </Link>
          <button
            type="button"
            onClick={handleShare}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            title="Share article"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Badge>{guide.category}</Badge>
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" /> {guide.readTime} min read
          </span>
        </div>

        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
          {guide.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">By {guide.author}</p>
      </div>

      <div className="container-wide mt-8 max-w-4xl">
        <div className="overflow-hidden rounded-3xl shadow-soft">
          <img
            src={guide.image}
            alt={guide.title}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      </div>

      <div className="container-wide mt-10 max-w-3xl pb-16">
        <div className="space-y-5">
          {guide.content.map((paragraph, idx) => (
            <p key={idx} className="text-lg leading-relaxed text-foreground/90">
              {paragraph}
            </p>
          ))}
        </div>

        {guide.takeaways && guide.takeaways.length > 0 && (
          <div className="mt-10 rounded-2xl border border-border bg-secondary/40 p-6">
            <h2 className="font-display text-xl font-semibold text-foreground">Key takeaways</h2>
            <ul className="mt-4 space-y-3">
              {guide.takeaways.map((item, idx) => (
                <li key={`${item}-${idx}`} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-base text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <div className="container-wide pb-20 border-t border-border pt-12">
          <h2 className="font-display text-2xl font-semibold text-foreground">Keep reading</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((rel) => (
              <GuideCard key={rel.id} guide={rel} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
