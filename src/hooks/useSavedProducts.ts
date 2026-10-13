import { useLocalStorage } from './useLocalStorage';

export function useSavedProducts() {
  const [saved, setSaved] = useLocalStorage<string[]>('lumie.saved', []);

  return {
    saved,
    isSaved: (id: string) => saved.includes(id),
    toggle: (id: string) => {
      setSaved((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    },
    saveAll: (ids: string[]) => {
      setSaved((prev) => Array.from(new Set([...prev, ...ids])));
    },
    clearAll: () => {
      setSaved([]);
    },
  };
}
