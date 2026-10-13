import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Sparkles,
  Menu,
  X,
  Heart,
  User,
  Search,
  Trophy,
  Bell,
} from 'lucide-react';
import { useSavedProducts } from '../hooks/useSavedProducts';
import { useUserAccount } from '../hooks/useUserAccount';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useRoutineReminders } from '../hooks/useRoutineReminders';
import { AuthModal } from './AuthModal';
import { GlobalSearchModal } from './GlobalSearchModal';
import { BrandLogo } from './BrandLogo';
import { cn } from '../utils/cn';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/discover', label: 'Discover' },
  { to: '/guides', label: 'Guides' },
  { to: '/routines', label: 'Routines' },
  { to: '/quiz', label: 'Skin Quiz' },
  { to: '/progress', label: 'Progress' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { saved } = useSavedProducts();
  const { account, isLoggedIn } = useUserAccount();
  const { siteSettings } = useSiteSettings();
  const {
    notificationPermission,
    requestPermission,
    triggerTestNotification,
  } = useRoutineReminders();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md transition-colors duration-200">
      <div className="container-wide flex h-16 items-center justify-between gap-3 sm:gap-4">
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center flex-shrink-0" title="Lumi Home">
          <BrandLogo size="md" />
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-secondary text-secondary-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Global Search Bar (Input style on desktop) */}
        <div className="flex-1 max-w-xs hidden sm:block">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-10 w-full items-center justify-between rounded-full border border-border bg-card/80 px-4 text-xs font-medium text-muted-foreground shadow-2xs hover:border-primary/50 hover:bg-card transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span>Search products, guides...</span>
            </span>
            <kbd className="flex items-center gap-0.5 rounded border border-border bg-muted/70 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons - Responsive Adaptive Bar */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Routine Notification Toggle Button */}
          <button
            type="button"
            onClick={async () => {
              if (notificationPermission !== 'granted') {
                await requestPermission();
              } else {
                triggerTestNotification('morning');
              }
            }}
            aria-label={
              notificationPermission === 'granted'
                ? 'Routine notifications active (click to trigger test alert)'
                : 'Enable skincare routine reminders'
            }
            title={
              notificationPermission === 'granted'
                ? 'Routine notifications active (click to send test alert)'
                : 'Enable skincare routine reminders'
            }
            className={cn(
              'relative flex h-8.5 w-8.5 sm:h-10 sm:w-10 items-center justify-center rounded-full border transition-all duration-200 cursor-pointer shadow-2xs',
              notificationPermission === 'granted'
                ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary'
            )}
          >
            <Bell className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            {notificationPermission === 'granted' ? (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background" />
            ) : (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-primary text-[8px] sm:text-[9px] font-bold text-primary-foreground">
                !
              </span>
            )}
          </button>

          {/* Mobile search button */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
            className="hidden xs:flex h-8.5 w-8.5 sm:h-10 sm:w-10 items-center justify-center rounded-full text-foreground hover:bg-muted sm:hidden cursor-pointer"
          >
            <Search className="h-4.5 w-4.5" />
          </button>

          {/* Achievements / Badges shortcut */}
          <Link
            to="/progress"
            title="Your Badges & Achievements"
            className="hidden md:flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Badges</span>
          </Link>

          {/* Favorites link with badge */}
          <Link
            to="/favorites"
            className="hidden xs:flex relative h-8.5 w-8.5 sm:h-10 sm:w-10 items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors"
            title="Saved Favorites"
          >
            <Heart className={cn('h-4.5 w-4.5', saved.length > 0 && 'fill-primary text-primary')} />
            {saved.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {saved.length}
              </span>
            )}
          </Link>

          {/* User Account / Profile */}
          {isLoggedIn && account ? (
            <Link
              to="/account"
              className="hidden sm:flex items-center gap-2 rounded-full border border-border/80 bg-card py-1 pl-1 pr-3 text-xs font-semibold text-foreground hover:border-primary transition-colors"
            >
              <img
                src={account.avatarUrl}
                alt={account.name}
                className="h-7 w-7 rounded-full object-cover"
              />
              <span className="max-w-[90px] truncate">{account.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="hidden sm:flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-secondary/70 transition-colors cursor-pointer"
            >
              <User className="h-3.5 w-3.5" /> Sign In
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
            className="flex h-8.5 w-8.5 sm:h-10 sm:w-10 items-center justify-center rounded-full text-foreground hover:bg-muted lg:hidden cursor-pointer"
          >
            {open ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <nav className="border-t border-border bg-background lg:hidden animate-fade-up">
          <div className="container-wide flex flex-col py-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-4 py-2.5 text-base font-semibold transition-colors',
                    isActive
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-foreground hover:bg-muted'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={async () => {
                setOpen(false);
                if (notificationPermission !== 'granted') {
                  await requestPermission();
                } else {
                  triggerTestNotification('morning');
                }
              }}
              className="flex items-center justify-between rounded-xl px-4 py-2.5 text-base font-semibold text-foreground hover:bg-muted text-left cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <span>Routine Notifications</span>
              </span>
              <span
                className={cn(
                  'text-xs font-bold',
                  notificationPermission === 'granted' ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary'
                )}
              >
                {notificationPermission === 'granted' ? 'Active (Test)' : 'Enable'}
              </span>
            </button>

            <NavLink
              to="/favorites"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between rounded-xl px-4 py-2.5 text-base font-semibold transition-colors',
                  isActive ? 'bg-secondary text-secondary-foreground' : 'text-foreground hover:bg-muted'
                )
              }
            >
              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4" /> Favorites
              </span>
              {saved.length > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground font-bold">
                  {saved.length}
                </span>
              )}
            </NavLink>
            <NavLink
              to="/account"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2.5 text-base font-semibold transition-colors',
                  isActive ? 'bg-secondary text-secondary-foreground' : 'text-foreground hover:bg-muted'
                )
              }
            >
              <User className="h-4 w-4" /> Account & Profile
            </NavLink>
          </div>
        </nav>
      )}

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
