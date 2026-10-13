import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Flame,
  Heart,
  CalendarCheck,
  Camera,
  Bell,
  LogOut,
  Edit3,
  Check,
  Moon,
  Sun,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import { avatarOptions, hairTypes, skinTypes, allConcerns } from '../data/mockData';
import { useUserAccount } from '../hooks/useUserAccount';
import { useRoutineProgress } from '../hooks/useRoutineProgress';
import { useSavedProducts } from '../hooks/useSavedProducts';
import { useProgressPhotos } from '../hooks/useProgressPhotos';
import { useJournal } from '../hooks/useJournal';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/Button';
import { AuthModal } from '../components/AuthModal';
import { SocialShareModal } from '../components/SocialShareModal';
import { cn } from '../utils/cn';

export function AccountPage() {
  const { account, isLoggedIn, updateAccount, logout } = useUserAccount();
  const { streak } = useRoutineProgress();
  const { saved } = useSavedProducts();
  const { photos } = useProgressPhotos();
  const { entries } = useJournal();
  const { isDark, toggleTheme } = useTheme();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications'>('profile');

  const [name, setName] = useState(account?.name || 'Camille Laurent');
  const [email, setEmail] = useState(account?.email || 'camille@lumie.glow');
  const [avatar, setAvatar] = useState(account?.avatarUrl || avatarOptions[0]);
  const [skinType, setSkinType] = useState(account?.skinType || 'Combination');
  const [hairType, setHairType] = useState(account?.hairType || 'Wavy');
  const [concerns, setConcerns] = useState<string[]>(account?.concerns || ['Dryness', 'Dullness']);

  const [morningReminder, setMorningReminder] = useState(account?.preferences.morningReminder ?? true);
  const [eveningReminder, setEveningReminder] = useState(account?.preferences.eveningReminder ?? true);
  const [newsletter, setNewsletter] = useState(account?.preferences.weeklyNewsletter ?? true);

  const toggleConcern = (c: string) => {
    setConcerns((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateAccount({
      name,
      email,
      avatarUrl: avatar,
      skinType,
      hairType,
      concerns,
      preferences: {
        morningReminder,
        eveningReminder,
        weeklyNewsletter: newsletter,
      },
    });
    toast.success('Account profile updated successfully');
  };

  const handleLogout = () => {
    logout();
    toast.info('You have signed out of your account');
  };

  if (!isLoggedIn) {
    return (
      <div className="container-wide py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-primary">
          <User className="h-8 w-8" />
        </div>
        <h2 className="mt-4 font-display text-3xl font-semibold text-foreground">
          Sign In to Your Account
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Access your personalized skin regimen, track streaks, and maintain your photo journal.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => setAuthModalOpen(true)}>
            Sign In or Create Account
          </Button>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="container-wide py-12">
      {/* Account Hero Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-gradient-to-r from-card via-card to-secondary/30 p-8 shadow-soft sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-5">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-primary/40 shadow-sm">
              <img src={account?.avatarUrl || avatar} alt={account?.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  Lumi Member
                </span>
                <span className="text-xs text-muted-foreground">
                  Joined {account?.createdAt ? new Date(account.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '2026'}
                </span>
              </div>
              <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">
                {account?.name}
              </h1>
              <p className="text-sm text-muted-foreground">{account?.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button variant="outline" size="sm" onClick={() => setShareModalOpen(true)}>
              <Share2 className="h-3.5 w-3.5 mr-1.5 text-primary" /> Share Stats
            </Button>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {isDark ? <Sun className="h-3.5 w-3.5 mr-1.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />}
              {isDark ? 'Light Theme' : 'Evening Dark Mode'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAuthModalOpen(true)}>
              <Edit3 className="h-3.5 w-3.5 mr-1.5" /> Switch Account
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Live stats */}
        <div className="mt-8 grid gap-4 border-t border-border/80 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3 rounded-2xl bg-card p-4 border border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <Flame className="h-5 w-5 fill-accent" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-foreground">{streak()} Days</p>
              <p className="text-xs text-muted-foreground">Current Streak</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-card p-4 border border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-foreground">{saved.length} Items</p>
              <p className="text-xs text-muted-foreground">Saved Favorites</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-card p-4 border border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-foreground">{entries.length} Logs</p>
              <p className="text-xs text-muted-foreground">Skin Check-Ins</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-card p-4 border border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-foreground">{photos.length} Photos</p>
              <p className="text-xs text-muted-foreground">Progress Journal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10">
        <div className="flex border-b border-border">
          {[
            { id: 'profile', label: 'Skin Profile & Bio', icon: <User className="h-4 w-4 mr-2" /> },
            { id: 'notifications', label: 'Ritual Reminders', icon: <Bell className="h-4 w-4 mr-2" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center border-b-2 px-6 py-3.5 font-display text-base font-semibold transition-colors cursor-pointer',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="mt-8 max-w-2xl space-y-6 animate-fade-up">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Avatar Photo
              </label>
              <div className="mt-3 flex items-center gap-3 overflow-x-auto pb-2">
                {avatarOptions.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatar(opt)}
                    className={cn(
                      'relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 transition-all cursor-pointer',
                      avatar === opt ? 'border-primary ring-2 ring-primary/40 scale-105' : 'border-border opacity-70 hover:opacity-100'
                    )}
                  >
                    <img src={opt} alt="Avatar" className="h-full w-full object-cover" />
                    {avatar === opt && (
                      <span className="absolute inset-0 flex items-center justify-center bg-primary/30 text-white">
                        <Check className="h-4 w-4 stroke-[3]" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Skin Type
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {skinTypes.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSkinType(st)}
                    className={cn(
                      'rounded-full border px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer',
                      skinType === st
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-foreground hover:border-primary/40'
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Hair Texture
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {hairTypes.map((ht) => (
                  <button
                    key={ht}
                    type="button"
                    onClick={() => setHairType(ht)}
                    className={cn(
                      'rounded-full border px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer',
                      hairType === ht
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-foreground hover:border-primary/40'
                    )}
                  >
                    {ht}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Top Concerns Tracked
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {allConcerns.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleConcern(c)}
                    className={cn(
                      'rounded-full border px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer',
                      concerns.includes(c)
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-foreground hover:border-primary/40'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" size="lg">
              Save Account Preferences
            </Button>
          </form>
        )}

        {activeTab === 'notifications' && (
          <div className="mt-8 max-w-2xl space-y-5 animate-fade-up">
            <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5">
              <div>
                <p className="font-display text-base font-semibold text-foreground">
                  Morning Glow Reminder (08:00 AM)
                </p>
                <p className="text-xs text-muted-foreground">
                  Gentle daily push to complete your antioxidant serum and SPF application.
                </p>
              </div>
              <input
                type="checkbox"
                checked={morningReminder}
                onChange={(e) => setMorningReminder(e.target.checked)}
                className="h-5 w-5 accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5">
              <div>
                <p className="font-display text-base font-semibold text-foreground">
                  Evening Wind-Down Reminder (09:30 PM)
                </p>
                <p className="text-xs text-muted-foreground">
                  Prompt to double-cleanse, apply retinol treatment, and lock in night moisture.
                </p>
              </div>
              <input
                type="checkbox"
                checked={eveningReminder}
                onChange={(e) => setEveningReminder(e.target.checked)}
                className="h-5 w-5 accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5">
              <div>
                <p className="font-display text-base font-semibold text-foreground">
                  Weekly Glow Editorial Newsletter
                </p>
                <p className="text-xs text-muted-foreground">
                  Curated ingredient deep-dives, dermatologist interviews, and seasonal edits.
                </p>
              </div>
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="h-5 w-5 accent-primary cursor-pointer"
              />
            </div>

            <Button
              onClick={() => {
                updateAccount({
                  preferences: {
                    morningReminder,
                    eveningReminder,
                    weeklyNewsletter: newsletter,
                  },
                });
                toast.success('Notification preferences saved');
              }}
            >
              Update Notification Settings
            </Button>
          </div>
        )}
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <SocialShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} />
    </div>
  );
}
