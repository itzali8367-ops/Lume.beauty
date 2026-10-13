import { useCallback, useRef, useSyncExternalStore } from 'react';

type Listener = () => void;
const listenersMap = new Map<string, Set<Listener>>();
const cacheMap = new Map<string, { raw: string | null; parsed: unknown }>();

function getStorageSnapshot<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') {
    return initialValue;
  }
  try {
    const raw = window.localStorage.getItem(key);
    const cached = cacheMap.get(key);
    if (cached && cached.raw === raw) {
      return cached.parsed as T;
    }
    if (raw === null) {
      cacheMap.set(key, { raw: null, parsed: initialValue });
      return initialValue;
    }
    const parsed = JSON.parse(raw);
    cacheMap.set(key, { raw, parsed });
    return parsed as T;
  } catch {
    return initialValue;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (val: T | ((prev: T) => T)) => void] {
  const initialValueRef = useRef(initialValue);
  initialValueRef.current = initialValue;

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      let set = listenersMap.get(key);
      if (!set) {
        set = new Set<Listener>();
        listenersMap.set(key, set);
      }
      set.add(onStoreChange);

      const onStorage = (e: StorageEvent) => {
        if (e.key === key) {
          cacheMap.delete(key);
          onStoreChange();
        }
      };

      window.addEventListener('storage', onStorage);

      return () => {
        const s = listenersMap.get(key);
        s?.delete(onStoreChange);
        if (s && s.size === 0) {
          listenersMap.delete(key);
        }
        window.removeEventListener('storage', onStorage);
      };
    },
    [key]
  );

  const getSnapshot = useCallback(() => {
    return getStorageSnapshot<T>(key, initialValueRef.current);
  }, [key]);

  const getServerSnapshot = useCallback(() => {
    return initialValueRef.current;
  }, []);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (val: T | ((prev: T) => T)) => {
      try {
        const current = getStorageSnapshot<T>(key, initialValueRef.current);
        const next = typeof val === 'function' ? (val as (prev: T) => T)(current) : val;
        const raw = JSON.stringify(next);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, raw);
        }
        cacheMap.set(key, { raw, parsed: next });

        const set = listenersMap.get(key);
        if (set) {
          queueMicrotask(() => {
            Array.from(set).forEach((listener) => {
              try {
                listener();
              } catch (err) {
                console.error(err);
              }
            });
          });
        }
      } catch (err) {
        console.error(`Error saving localStorage key "${key}":`, err);
      }
    },
    [key]
  );

  return [value, setValue];
}
