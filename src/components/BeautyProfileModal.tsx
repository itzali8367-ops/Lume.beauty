import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import { useProfile } from '../hooks/useProfile';
import { allConcerns, hairTypes, skinTypes } from '../data/mockData';
import { Button } from './Button';
import { cn } from '../utils/cn';

function OptionGroup({
  label,
  options,
  value,
  onToggle,
}: {
  label: string;
  options: string[];
  value: string[];
  onToggle: (val: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer',
              value.includes(opt)
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-foreground hover:border-primary/50'
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function BeautyProfileModal({ onClose }: { onClose: () => void }) {
  const { saveProfile } = useProfile();
  const [name, setName] = useState('');
  const [skinType, setSkinType] = useState('Combination');
  const [hairType, setHairType] = useState('Wavy');
  const [concerns, setConcerns] = useState<string[]>([]);

  const toggleConcern = (concern: string) => {
    setConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    );
  };

  const handleSave = () => {
    saveProfile({
      name: name.trim() || 'Beautiful',
      skinType,
      hairType,
      concerns,
    });
    toast.success('Your personalized feed is ready');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-card p-6 shadow-soft sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
          <Sparkles className="h-4 w-4" /> Personalize
        </span>
        <h2 className="mt-4 font-display text-2xl font-semibold text-foreground">
          Let's tailor your glow
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Answer a few quick questions to get recommendations made for you.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-foreground">
              What should we call you?
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <OptionGroup
            label="Skin type"
            options={skinTypes}
            value={[skinType]}
            onToggle={(val) => setSkinType(val)}
          />

          <OptionGroup
            label="Hair type"
            options={hairTypes}
            value={[hairType]}
            onToggle={(val) => setHairType(val)}
          />

          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">Your top concerns</p>
            <div className="flex flex-wrap gap-2">
              {allConcerns.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleConcern(c)}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer',
                    concerns.includes(c)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-foreground hover:border-primary/50'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button className="mt-7 w-full" size="lg" onClick={handleSave}>
          Create my feed
        </Button>
      </div>
    </div>
  );
}
