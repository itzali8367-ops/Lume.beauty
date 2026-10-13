import React, { useState } from 'react';
import {
  X,
  MessageSquarePlus,
  Bug,
  Lightbulb,
  Heart,
  Send,
  Star,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { useUserAccount } from '../hooks/useUserAccount';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Button } from './Button';
import { cn } from '../utils/cn';

export interface UserFeedbackEntry {
  id: string;
  category: 'bug' | 'feature' | 'question' | 'praise';
  title: string;
  message: string;
  rating?: number;
  userName?: string;
  userEmail?: string;
  pageUrl: string;
  createdAt: string;
}

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { account, isLoggedIn } = useUserAccount();
  const [feedbackList, setFeedbackList] = useLocalStorage<UserFeedbackEntry[]>(
    'lumie.user_feedback',
    []
  );

  const [category, setCategory] = useState<'bug' | 'feature' | 'question' | 'praise'>('feature');
  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState(account?.name || '');
  const [userEmail, setUserEmail] = useState(account?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    {
      id: 'feature' as const,
      label: 'Feature Idea',
      icon: Lightbulb,
      description: 'Suggest a feature or improvement',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    },
    {
      id: 'bug' as const,
      label: 'Report Bug',
      icon: Bug,
      description: 'Something looks off or isn\'t working',
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
    },
    {
      id: 'question' as const,
      label: 'Question',
      icon: MessageSquarePlus,
      description: 'Skincare or routine inquiry',
      color: 'text-sky-500 bg-sky-500/10 border-sky-500/30',
    },
    {
      id: 'praise' as const,
      label: 'Glow Love',
      icon: Heart,
      description: 'Share what you enjoy most',
      color: 'text-pink-500 bg-pink-500/10 border-pink-500/30',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please describe your feedback or suggestion');
      return;
    }

    setIsSubmitting(true);
    const newEntry: UserFeedbackEntry = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      category,
      title: title.trim() || (category === 'bug' ? 'Bug Report' : category === 'feature' ? 'Feature Suggestion' : 'User Feedback'),
      message: message.trim(),
      rating,
      userName: userName.trim() || (isLoggedIn && account ? account.name : 'Anonymous Glowing User'),
      userEmail: userEmail.trim() || (isLoggedIn && account ? account.email : undefined),
      pageUrl: window.location.pathname,
      createdAt: new Date().toISOString(),
    };

    setFeedbackList((prev) => [newEntry, ...prev]);
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success('Thank you! Your feedback has been received.', {
      description: 'We review user suggestions continuously to improve Lumi post-launch.',
    });

    setTimeout(() => {
      setSubmitted(false);
      setTitle('');
      setMessage('');
      onClose();
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl overflow-hidden animate-scale-up">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
          aria-label="Close feedback modal"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4 animate-fade-up">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground">
              Feedback Received!
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Your feedback has been logged. Thank you for helping us make Lumi the best skincare companion.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="pr-8">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Shape Platform Future
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold text-foreground">
                Help Us Improve Lumi
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Found a bug or have an idea for a new routine feature? Send your thoughts directly to the creator.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Category Pills */}
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                  Feedback Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {categories.map((c) => {
                    const Icon = c.icon;
                    const isActive = category === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        className={cn(
                          'flex flex-col items-center justify-center rounded-2xl border p-2.5 text-center transition-all cursor-pointer',
                          isActive
                            ? 'border-primary bg-primary/10 text-primary shadow-2xs font-semibold ring-1 ring-primary/40'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                        )}
                      >
                        <Icon className="h-4 w-4 mb-1" />
                        <span className="text-xs">{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Overall Satisfaction Rating */}
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                  How is your experience so far?
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-115 transition-transform cursor-pointer"
                    >
                      <Star
                        className={cn(
                          'h-6 w-6 transition-colors',
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-border hover:text-amber-200'
                        )}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-medium text-muted-foreground">
                    {rating === 5 ? 'Loved it! 💖' : rating === 4 ? 'Very Good ✨' : rating === 3 ? 'Average 😊' : 'Needs work'}
                  </span>
                </div>
              </div>

              {/* Title / Subject (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1 uppercase tracking-wider">
                  Summary
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    category === 'bug'
                      ? 'e.g. Water cup count not refreshing on mobile'
                      : category === 'feature'
                      ? 'e.g. Add weekly calendar view for wash day'
                      : 'Brief summary'
                  }
                  className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Detailed Message */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1 uppercase tracking-wider">
                  Details <span className="text-primary">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    category === 'bug'
                      ? 'What happened? Please share steps so we can reproduce and fix it quickly.'
                      : 'Describe your idea, what problem it solves, and how you imagine it working.'
                  }
                  className="w-full rounded-xl border border-border bg-secondary/30 p-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              {/* Name & Email (optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-2xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Your Name (optional)
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Sarah J."
                    className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Your Email (for updates)
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
