import { useState } from 'react';
import {
  Bell,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRoutineReminders } from '../hooks/useRoutineReminders';
import { Button } from './Button';
import { cn } from '../utils/cn';

interface RoutineNotificationPromptProps {
  className?: string;
  defaultExpanded?: boolean;
}

export function RoutineNotificationPrompt({
  className,
  defaultExpanded = false,
}: RoutineNotificationPromptProps) {
  const {
    preferences,
    updatePreferences,
    requestPermission,
    triggerTestNotification,
    notificationPermission,
    hasNotificationSupport,
  } = useRoutineReminders();

  const [expanded, setExpanded] = useState(defaultExpanded);
  const isGranted = notificationPermission === 'granted' && preferences.browserNotifications;
  const isDenied = notificationPermission === 'denied';

  const handleOptIn = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast.success('🎉 Daily Skincare Reminders Active!', {
        description: `Morning: ${preferences.morningTime} AM • Evening: ${preferences.eveningTime} PM`,
      });
      setExpanded(true);
    }
  };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-3xl border transition-all duration-300',
        isGranted
          ? 'border-emerald-300/80 dark:border-emerald-900/60 bg-gradient-to-r from-emerald-50/70 dark:from-emerald-950/20 via-card to-emerald-50/40 dark:to-card p-5 sm:p-6'
          : 'border-primary/30 bg-gradient-to-r from-primary/5 via-secondary/40 to-background p-5 sm:p-6',
        className
      )}
    >
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={cn(
              'flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl shadow-xs transition-colors',
              isGranted
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-primary text-primary-foreground shadow-glow'
            )}
          >
            <Bell className="h-5 w-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
                Daily Skincare Routine Reminders
              </h3>
              {isGranted ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 text-2xs font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Service Worker Push Alerts Active
                </span>
              ) : isDenied ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-950/80 px-2.5 py-0.5 text-2xs font-semibold text-rose-800 dark:text-rose-300">
                  <AlertCircle className="h-3 w-3 text-rose-600" /> Blocked in Browser
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/80 px-2.5 py-0.5 text-2xs font-semibold text-amber-800 dark:text-amber-300">
                  <Sparkles className="h-3 w-3 text-amber-600" /> Push Opt-In Available
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Never miss your morning antioxidant protection or evening barrier repair. Service worker background push notifications deliver timely reminders straight to your device.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-center">
          {!isGranted && hasNotificationSupport && (
            <Button
              size="sm"
              variant="primary"
              onClick={handleOptIn}
              className="gap-1.5 shadow-xs font-semibold text-xs"
            >
              <Bell className="h-3.5 w-3.5" />
              <span>Opt-In for Reminders</span>
            </Button>
          )}

          {isGranted && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => triggerTestNotification('morning')}
              className="text-xs"
            >
              Test Alert
            </Button>
          )}

          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
            title={expanded ? 'Collapse settings' : 'Configure reminder times'}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Scheduling & Settings Drawer */}
      {expanded && (
        <div className="mt-5 border-t border-border/80 pt-5 animate-fade-down space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Morning Reminder Card */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600">
                    <Sun className="h-4 w-4" />
                  </span>
                  <span className="font-display text-sm font-bold text-foreground">
                    Morning Routine (AM)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.morningEnabled}
                  onChange={(e) => updatePreferences({ morningEnabled: e.target.checked })}
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
              </div>

              <p className="text-2xs text-muted-foreground">
                Alert to cleanse, apply Vitamin C antioxidant shield, and apply SPF 50.
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-border/50 text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Time:
                </span>
                <input
                  type="time"
                  value={preferences.morningTime}
                  onChange={(e) => updatePreferences({ morningTime: e.target.value })}
                  className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground outline-none focus:border-primary"
                />
              </div>

              <button
                type="button"
                onClick={() => triggerTestNotification('morning')}
                className="w-full rounded-xl bg-secondary/80 hover:bg-secondary py-1.5 text-2xs font-semibold text-secondary-foreground transition-colors cursor-pointer"
              >
                Send Morning Test Alert
              </button>
            </div>

            {/* Evening Reminder Card */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600">
                    <Moon className="h-4 w-4" />
                  </span>
                  <span className="font-display text-sm font-bold text-foreground">
                    Evening Routine (PM)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.eveningEnabled}
                  onChange={(e) => updatePreferences({ eveningEnabled: e.target.checked })}
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
              </div>

              <p className="text-2xs text-muted-foreground">
                Prompt to double cleanse, apply retinol renewal, and seal with ceramide cream.
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-border/50 text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Time:
                </span>
                <input
                  type="time"
                  value={preferences.eveningTime}
                  onChange={(e) => updatePreferences({ eveningTime: e.target.value })}
                  className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground outline-none focus:border-primary"
                />
              </div>

              <button
                type="button"
                onClick={() => triggerTestNotification('evening')}
                className="w-full rounded-xl bg-secondary/80 hover:bg-secondary py-1.5 text-2xs font-semibold text-secondary-foreground transition-colors cursor-pointer"
              >
                Send Evening Test Alert
              </button>
            </div>

            {/* Notification Delivery Options */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600">
                  <Volume2 className="h-4 w-4" />
                </span>
                <span className="font-display text-sm font-bold text-foreground">
                  Delivery Preferences
                </span>
              </div>

              <div className="space-y-2 text-xs pt-1">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-muted-foreground">Browser Push Alerts</span>
                  <input
                    type="checkbox"
                    checked={preferences.browserNotifications && notificationPermission === 'granted'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        requestPermission();
                      } else {
                        updatePreferences({ browserNotifications: false });
                      }
                    }}
                    className="h-4 w-4 rounded accent-primary cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-muted-foreground">Gentle Chime Sound</span>
                  <input
                    type="checkbox"
                    checked={preferences.soundEnabled}
                    onChange={(e) => updatePreferences({ soundEnabled: e.target.checked })}
                    className="h-4 w-4 rounded accent-primary cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-muted-foreground">In-App Banner Toasts</span>
                  <input
                    type="checkbox"
                    checked={preferences.persistentToast}
                    onChange={(e) => updatePreferences({ persistentToast: e.target.checked })}
                    className="h-4 w-4 rounded accent-primary cursor-pointer"
                  />
                </label>
              </div>

              <p className="text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                Reminders trigger automatically in the background even if you have other tabs open.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
