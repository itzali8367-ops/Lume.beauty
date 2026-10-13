import { Guide } from '../types';
import { guides as initialGuides } from '../data/mockData';
import { useLocalStorage } from './useLocalStorage';

export function useGuides() {
  const [allGuides, setAllGuides] = useLocalStorage<Guide[]>('lumie.all_guides', initialGuides);

  const addGuide = (guideData: Omit<Guide, 'id'>) => {
    const slug = guideData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const newGuide: Guide = {
      ...guideData,
      id: `${slug || 'guide'}-${Date.now().toString().slice(-4)}`,
    };
    setAllGuides((prev) => [newGuide, ...prev]);
    return newGuide;
  };

  const updateGuide = (id: string, updates: Partial<Guide>) => {
    setAllGuides((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGuide = (id: string) => {
    setAllGuides((prev) => prev.filter((g) => g.id !== id));
  };

  const resetGuides = () => {
    setAllGuides(initialGuides);
  };

  const isCustomGuide = (id: string) => {
    return !initialGuides.some((g) => g.id === id);
  };

  return {
    allGuides,
    customGuides: allGuides.filter((g) => isCustomGuide(g.id)),
    addGuide,
    updateGuide,
    deleteGuide,
    resetGuides,
    isCustomGuide,
  };
}
