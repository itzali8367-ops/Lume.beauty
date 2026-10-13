import React, { useState } from 'react';
import { X, Upload, Sparkles, Plus, Trash2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useGuides } from '../hooks/useGuides';
import { useUserAccount } from '../hooks/useUserAccount';
import { CategoryId } from '../types';
import { Button } from './Button';
import { cn } from '../utils/cn';

const sampleCoverOptions = [
  { label: 'Skincare Glow', url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80' },
  { label: 'Hair Care', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Inner Wellness', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80' },
  { label: 'Radiant Portrait', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80' },
  { label: 'Cleanser Texture', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80' },
  { label: 'Golden Hair Oil', url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80' },
];

interface BlogUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublished?: (guideId: string) => void;
}

export function BlogUploadModal({ isOpen, onClose, onPublished }: BlogUploadModalProps) {
  const { addGuide } = useGuides();
  const { account } = useUserAccount();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('skincare');
  const [author, setAuthor] = useState(account?.name || 'Community Beauty Editor');
  const [readTime, setReadTime] = useState(4);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(sampleCoverOptions[0].url);
  const [takeaways, setTakeaways] = useState<string[]>([
    'Start with gentle daily consistency',
    'Listen to your skin\'s barrier needs',
  ]);
  const [tagsInput, setTagsInput] = useState('Routine, Tips, Glow');
  const [newTakeawayText, setNewTakeawayText] = useState('');

  if (!isOpen) return null;

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        toast.error('Image is too large. Please select a photo under 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImage(reader.result as string);
        toast.success('Custom cover image loaded');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTakeaway = () => {
    if (newTakeawayText.trim()) {
      setTakeaways((prev) => [...prev, newTakeawayText.trim()]);
      setNewTakeawayText('');
    }
  };

  const handleRemoveTakeaway = (idx: number) => {
    setTakeaways((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      toast.error('Please fill in article title, excerpt, and content.');
      return;
    }

    const paragraphs = content
      .split('\n\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const created = addGuide({
      title: title.trim(),
      category,
      author: author.trim() || 'Community Editor',
      readTime: Number(readTime) || 3,
      excerpt: excerpt.trim(),
      image: coverImage,
      content: paragraphs.length > 0 ? paragraphs : [content.trim()],
      takeaways: takeaways.length > 0 ? takeaways : ['Consistency is the key to healthy skin.'],
      tags: tags.length > 0 ? tags : ['Guide', 'Wellness'],
    });

    toast.success('Blog published successfully!');
    if (onPublished) onPublished(created.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-ink/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-border bg-card p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen className="h-4 w-4" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Lumi Editorial Creator
          </span>
        </div>

        <h3 className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">
          Write & Upload a Guide or Blog
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Share your beauty rituals, ingredient discoveries, and wellness insights with the Lumi community.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Article Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Morning Ice-Rolling Ritual: Why It Transforms Puffy Skin"
              className="mt-1 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
              >
                <option value="skincare">Skincare</option>
                <option value="haircare">Haircare</option>
                <option value="wellness">Wellness</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Author Name
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Dr. Lena Park or your name"
                className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Cover Image
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative aspect-[16/10] w-36 overflow-hidden rounded-xl border border-border bg-muted flex-shrink-0">
                <img src={coverImage} alt="Cover preview" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 space-y-2">
                <label className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer transition-colors shadow-2xs">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload custom image file</span>
                  <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {sampleCoverOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCoverImage(opt.url)}
                      className={cn(
                        'rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer',
                        coverImage === opt.url
                          ? 'border-primary bg-primary text-primary-foreground font-semibold'
                          : 'border-border bg-background text-foreground hover:border-primary/40'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Brief Excerpt / Hook *
            </label>
            <textarea
              required
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A compelling 1-2 sentence preview to draw readers in..."
              className="mt-1 w-full rounded-xl border border-border bg-background p-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Article Content (Paragraphs) *
            </label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article here. Separate paragraphs with an empty line..."
              className="mt-1 w-full rounded-xl border border-border bg-background p-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Key Takeaways
            </label>
            <div className="mt-1 space-y-2">
              {takeaways.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl bg-secondary/60 px-3.5 py-2 text-xs text-foreground"
                >
                  <span className="flex-1 pr-2">• {item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTakeaway(idx)}
                    className="text-muted-foreground hover:text-destructive cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTakeawayText}
                  onChange={(e) => setNewTakeawayText(e.target.value)}
                  placeholder="Add a key takeaway point..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTakeaway();
                    }
                  }}
                  className="h-10 flex-1 rounded-xl border border-border bg-background px-3 text-xs outline-none focus:border-primary text-foreground"
                />
                <Button type="button" size="sm" variant="outline" onClick={handleAddTakeaway}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Article Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Morning, Serums, Ice"
                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs outline-none focus:border-primary text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Est. Read Time (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={readTime}
                onChange={(e) => setReadTime(Number(e.target.value))}
                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs outline-none focus:border-primary text-foreground"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="lg">
              <Sparkles className="h-4 w-4 mr-1.5" /> Publish Blog to Guides
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
