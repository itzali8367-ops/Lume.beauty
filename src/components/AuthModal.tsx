import React, { useState } from 'react';
import { X, Sparkles, User, Mail, Check } from 'lucide-react';
import { toast } from 'sonner';
import { avatarOptions, hairTypes, skinTypes, allConcerns } from '../data/mockData';
import { useUserAccount } from '../hooks/useUserAccount';
import { Button } from './Button';
import { cn } from '../utils/cn';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'profile';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const { account, login, signup, updateAccount, isLoggedIn } = useUserAccount();
  const [mode, setMode] = useState<'login' | 'signup' | 'profile'>(
    isLoggedIn ? 'profile' : initialMode
  );
  const [name, setName] = useState(account?.name || '');
  const [email, setEmail] = useState(account?.email || '');
  const [avatar, setAvatar] = useState(account?.avatarUrl || avatarOptions[0]);
  const [skinType, setSkinType] = useState(account?.skinType || 'Combination');
  const [hairType, setHairType] = useState(account?.hairType || 'Wavy');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(
    account?.concerns || ['Dryness', 'Dullness']
  );

  if (!isOpen) return null;

  const toggleConcern = (c: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!email.trim()) {
        toast.error('Please enter your email address');
        return;
      }
      login(email, name, avatar);
      toast.success(`Welcome back, ${name || email.split('@')[0]}!`);
      onClose();
    } else if (mode === 'signup') {
      if (!email.trim() || !name.trim()) {
        toast.error('Please fill in your name and email');
        return;
      }
      signup({
        name,
        email,
        avatarUrl: avatar,
        skinType,
        hairType,
        concerns: selectedConcerns,
      });
      toast.success(`Account created! Welcome to Lumi, ${name}.`);
      onClose();
    } else {
      updateAccount({
        name,
        email,
        avatarUrl: avatar,
        skinType,
        hairType,
        concerns: selectedConcerns,
      });
      toast.success('Profile preferences updated.');
      onClose();
    }
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

        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {mode === 'profile' ? 'Your Lumi Account' : 'Member Access'}
          </span>
        </div>

        <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">
          {mode === 'login'
            ? 'Sign in to your glow'
            : mode === 'signup'
            ? 'Join the Lumi community'
            : 'Personalize Your Profile'}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === 'login'
            ? 'Access your saved routines, skin score history, and favorites across devices.'
            : mode === 'signup'
            ? 'Create an account to track your daily streak and unlock personalized regimens.'
            : 'Manage your skin type, concerns, and avatar.'}
        </p>

        {mode !== 'profile' && (
          <div className="mt-6 flex rounded-xl bg-secondary/60 p-1">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={cn(
                'flex-1 rounded-lg py-2 text-xs font-semibold transition-colors cursor-pointer',
                mode === 'login' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={cn(
                'flex-1 rounded-lg py-2 text-xs font-semibold transition-colors cursor-pointer',
                mode === 'signup' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Create Account
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Choose Avatar
            </label>
            <div className="mt-2 flex items-center gap-3 overflow-x-auto pb-2">
              {avatarOptions.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatar(opt)}
                  className={cn(
                    'relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 transition-all cursor-pointer',
                    avatar === opt ? 'border-primary ring-2 ring-primary/30 scale-105' : 'border-border opacity-70 hover:opacity-100'
                  )}
                >
                  <img src={opt} alt="Avatar option" className="h-full w-full object-cover" />
                  {avatar === opt && (
                    <span className="absolute inset-0 flex items-center justify-center bg-primary/30 text-white">
                      <Check className="h-4 w-4 stroke-[3]" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {(mode === 'signup' || mode === 'profile') && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your Full Name
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Camille Laurent"
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email Address
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {(mode === 'signup' || mode === 'profile') && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Skin Type
                </label>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {skinTypes.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSkinType(st)}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer',
                        skinType === st
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-foreground hover:border-primary/40'
                      )}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Hair Type
                </label>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {hairTypes.map((ht) => (
                    <button
                      key={ht}
                      type="button"
                      onClick={() => setHairType(ht)}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer',
                        hairType === ht
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-foreground hover:border-primary/40'
                      )}
                    >
                      {ht}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Top Concerns
                </label>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {allConcerns.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleConcern(c)}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer',
                        selectedConcerns.includes(c)
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-foreground hover:border-primary/40'
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="pt-2">
            <Button type="submit" size="lg" className="w-full">
              {mode === 'login' ? 'Sign In to Lumi' : mode === 'signup' ? 'Complete Profile & Join' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
