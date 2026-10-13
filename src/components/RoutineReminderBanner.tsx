import React, { useState } from 'react';
import { Bell, Sun, Moon, Settings2, CheckCircle2, X } from 'lucide-react';
import { useRoutineReminders } from '../hooks/useRoutineReminders';
import { Button } from './Button';
import { cn } from '../utils/cn';

export function RoutineReminderBanner({ className }: { className?: string }) {
  const {
    preferences,
    updatePreferences,
    requestPermission,
    triggerTestNotification,
    notificationPermission,
    hasNotificationSupport,
  } = useRoutineReminders();
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const isBrowserActive = preferences.browserNotifications && notificationPermission === 'granted';

  return (
    <div
      className={cn(
        'overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/5 via-secondary/40 to-background p-5 shadow-xs transition-all',
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display text-base font-semibold text-foreground">
                Daily Routine Reminders
              </h4>
              {isBrowserActive && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-2xs font-semibold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Browser Alerts On
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Morning ({preferences.morningTime}) & Evening ({preferences.eveningTime}) alerts so you never break your glow streak.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isBrowserActive && hasNotificationSupport && (
            <Button
              size="sm"
              onClick={requestPermission}
              className="bg-primary text-primary-foreground shadow-xs text-xs"
            >
              <Bell className="h-3.5 w-3.5 mr-1.5" /> Enable Browser Alerts
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setExpanded((prev) => !prev)}
            className="text-xs"
          >
            <Settings2 className="h-3.5 w-3.5 mr-1.5" />
            {expanded ? 'Hide Settings' : 'Reminder Settings'}
          </Button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            title="Dismiss reminder panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-5 border-t border-border/80 pt-4 animate-fade-down space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span className="font-display text-sm font-semibold text-foreground">
                    Morning Routine
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.morningEnabled}
                  onChange={(e) => updatePreferences({ morningEnabled: e.target.checked })}
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Reminder Time:</span>
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
                className="mt-3 w-full rounded-xl bg-secondary/80 py-1.5 text-2xs font-semibold text-secondary-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                Test AM Alert Now
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-indigo-500" />
                  <span className="font-display text-sm font-semibold text-foreground">
                    Evening Routine
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.eveningEnabled}
                  onChange={(e) => updatePreferences({ eveningEnabled: e.target.checked })}
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Reminder Time:</span>
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
                className="mt-3 w-full rounded-xl bg-secondary/80 py-1.5 text-2xs font-semibold text-secondary-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                Test PM Alert Now
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <span className="font-display text-sm font-semibold text-foreground">
                Notification Modes
              </span>
              <div className="mt-3 space-y-2 text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-muted-foreground">Persistent Toast Alerts</span>
                  <input
                    type="checkbox"
                    checked={preferences.persistentToast}
                    onChange={(e) => updatePreferences({ persistentToast: e.target.checked })}
                    className="h-4 w-4 rounded accent-primary"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-muted-foreground">Gentle Sound Chime</span>
                  <input
                    type="checkbox"
                    checked={preferences.soundEnabled}
                    onChange={(e) => updatePreferences({ soundEnabled: e.target.checked })}
                    className="h-4 w-4 rounded accent-primary"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-muted-foreground">Browser Push Alerts</span>
                  <input
                    type="checkbox"
                    checked={preferences.browserNotifications}
                    onChange={(e) => {
                      if (e.target.checked) {
                        requestPermission();
                      } else {
                        updatePreferences({ browserNotifications: false });
                      }
                    }}
                    className="h-4 w-4 rounded accent-primary"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
