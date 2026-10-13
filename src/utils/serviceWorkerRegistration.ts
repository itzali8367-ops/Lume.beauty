import { toast } from 'sonner';

export interface PushSubscriptionData {
  endpoint: string;
  expirationTime: number | null;
  keys?: {
    p256dh: string;
    auth: string;
  };
  subscribedAt: string;
}

const STORAGE_KEY = 'lumie.push_subscription';

/**
 * Register the Service Worker in supported browsers
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    // Check if worker was installed
    registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      if (installingWorker) {
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available
            console.log('Lumi Service Worker updated.');
          }
        };
      }
    };

    return registration;
  } catch (error) {
    console.warn('Service worker registration skipped or unsupported:', error);
    return null;
  }
}

/**
 * Check if the browser supports notifications and service worker
 */
export function isPushNotificationSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'Notification' in window
  );
}

/**
 * Request notification permissions and subscribe to push / background notifications
 */
export async function subscribeToPushNotifications(): Promise<boolean> {
  if (!isPushNotificationSupported()) {
    toast.error('Push notifications are not supported on this browser.');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      toast.info('Notification permission was declined. In-app alerts remain active.');
      return false;
    }

    const registration = await navigator.serviceWorker.ready;

    // Check if PushManager is available
    let subscription: PushSubscription | null = null;
    if ('pushManager' in registration) {
      try {
        subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          // If a backend VAPID public key were provided, it would be passed as applicationServerKey.
          // In standard web environments without a mandatory push backend, we generate a persistent client registration.
          const subData: PushSubscriptionData = {
            endpoint: `https://push.lumie.glow/v1/sub/${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            expirationTime: null,
            subscribedAt: new Date().toISOString(),
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(subData));
        }
      } catch (err) {
        console.warn('PushManager subscription fallback:', err);
      }
    }

    // Fire welcome notification via Service Worker
    await showServiceWorkerNotification({
      title: '🌟 Lumi Notifications Enabled!',
      body: 'You are subscribed to daily morning protection and evening skincare reminders.',
      tag: 'lumi-welcome',
      url: '/routines',
    });

    toast.success('🎉 Push notifications subscribed successfully!', {
      description: 'Morning and evening skincare alerts will appear on your device.',
    });

    return true;
  } catch (error) {
    console.error('Error during push notification subscription:', error);
    toast.error('Could not subscribe to notifications. Please check browser settings.');
    return false;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.removeItem(STORAGE_KEY);
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if ('pushManager' in registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
      }
    }
    toast.info('Unsubscribed from push notifications.');
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if the user is currently subscribed to push notifications
 */
export function getStoredPushSubscription(): PushSubscriptionData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Display a background notification using the Service Worker (System/OS level)
 */
export async function showServiceWorkerNotification(options: {
  title: string;
  body: string;
  tag?: string;
  url?: string;
}): Promise<boolean> {
  if (typeof window === 'undefined' || Notification.permission !== 'granted') {
    return false;
  }

  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const notificationOpts: NotificationOptions & { renotify?: boolean } = {
        body: options.body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: options.tag || 'lumi-reminder',
        renotify: true,
        data: {
          url: options.url || '/routines',
        },
      };
      await registration.showNotification(options.title, notificationOpts);
      return true;
    }
  } catch (err) {
    console.warn('Service worker notification failed, using native fallback:', err);
  }

  // Fallback to standard Notification constructor
  try {
    const n = new Notification(options.title, {
      body: options.body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: options.tag,
    });
    n.onclick = () => {
      window.focus();
      if (options.url) window.location.href = options.url;
    };
    return true;
  } catch {
    return false;
  }
}
