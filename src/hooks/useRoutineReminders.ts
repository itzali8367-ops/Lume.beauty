import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useLocalStorage } from './useLocalStorage';

export interface ReminderPreferences {
  morningEnabled: boolean;
  morningTime: string; // "08:00"
  eveningEnabled: boolean;
  eveningTime: string; // "21:00"
  browserNotifications: boolean;
  persistentToast: boolean;
  soundEnabled: boolean;
  lastMorningNotified?: string;
  lastEveningNotified?: string;
}

const defaultPreferences: ReminderPreferences = {
  morningEnabled: true,
  morningTime: '08:00',
  eveningEnabled: true,
  eveningTime: '21:00',
  browserNotifications: false,
  persistentToast: true,
  soundEnabled: true,
};

// Gentle audio chime using Web Audio API
function playChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(659.25, now);
    osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);

    setTimeout(() => {
      try {
        ctx.close().catch(() => {});
      } catch {}
    }, 600);
  } catch {
    // Ignore audio restrictions
  }
}

import {
  subscribeToPushNotifications,
  showServiceWorkerNotification,
} from '../utils/serviceWorkerRegistration';

export function useRoutineReminders() {
  const [preferences, setPreferences] = useLocalStorage<ReminderPreferences>(
    'lumie.routine_reminders',
    defaultPreferences
  );

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  });

  const hasNotificationSupport = typeof window !== 'undefined' && 'Notification' in window;

  // Auto-sync if permission was already granted previously
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const current = Notification.permission;
      setNotificationPermission(current);
      if (current === 'granted' && !preferences.browserNotifications) {
        setPreferences((prev) => ({ ...prev, browserNotifications: true }));
      }
    }
  }, [preferences.browserNotifications, setPreferences]);

  const requestPermission = useCallback(async () => {
    if (!hasNotificationSupport) {
      toast.error('Browser notifications are not supported in this browser.');
      return false;
    }
    const success = await subscribeToPushNotifications();
    if (success) {
      setNotificationPermission('granted');
      setPreferences((prev) => ({ ...prev, browserNotifications: true }));
      return true;
    } else {
      const current = typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'denied';
      setNotificationPermission(current);
      setPreferences((prev) => ({ ...prev, browserNotifications: false }));
      return false;
    }
  }, [hasNotificationSupport, setPreferences]);

  const sendNotification = useCallback(
    (type: 'morning' | 'evening', isTest = false) => {
      const isMorning = type === 'morning';
      const title = isMorning
        ? '☀️ Lumi: Morning Skincare Ritual'
        : '🌙 Lumi: Evening Nighttime Routine';
      const body = isMorning
        ? 'Time to cleanse, apply your vitamin C antioxidant shield, and protect with SPF!'
        : 'Time to wash the day away, apply retinol treatment, and lock in overnight moisture.';

      if (preferences.soundEnabled) {
        playChime();
      }

      // 1. Browser Native / Service Worker Push Notification
      if (
        hasNotificationSupport &&
        Notification.permission === 'granted' &&
        (preferences.browserNotifications || isTest)
      ) {
        showServiceWorkerNotification({
          title,
          body,
          tag: `lumie-${type}-reminder`,
          url: '/routines',
        }).catch(() => {});
      }

      // 2. Persistent In-App Toast Alert System
      if (preferences.persistentToast || isTest) {
        toast(title, {
          description: body,
          duration: 10000,
          action: {
            label: 'View Routine',
            onClick: () => {
              window.location.href = '/routines';
            },
          },
        });
      }
    },
    [hasNotificationSupport, preferences]
  );

  const triggerTestNotification = useCallback(
    (type: 'morning' | 'evening') => {
      sendNotification(type, true);
      toast.success(`Sent test ${type} routine reminder notification!`);
    },
    [sendNotification]
  );

  const updatePreferences = useCallback(
    (updates: Partial<ReminderPreferences>) => {
      setPreferences((prev) => ({ ...prev, ...updates }));
    },
    [setPreferences]
  );

  // Background interval to check time for reminders
  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayDateStr = now.toISOString().slice(0, 10);

      // Morning check
      if (
        preferences.morningEnabled &&
        currentTimeStr === preferences.morningTime &&
        preferences.lastMorningNotified !== todayDateStr
      ) {
        sendNotification('morning');
        setPreferences((prev) => ({ ...prev, lastMorningNotified: todayDateStr }));
      }

      // Evening check
      if (
        preferences.eveningEnabled &&
        currentTimeStr === preferences.eveningTime &&
        preferences.lastEveningNotified !== todayDateStr
      ) {
        sendNotification('evening');
        setPreferences((prev) => ({ ...prev, lastEveningNotified: todayDateStr }));
      }
    };

    const timer = setInterval(checkSchedule, 30000);
    return () => clearInterval(timer);
  }, [preferences, sendNotification, setPreferences]);

  return {
    preferences,
    updatePreferences,
    notificationPermission,
    hasNotificationSupport,
    requestPermission,
    triggerTestNotification,
    sendNotification,
  };
}
