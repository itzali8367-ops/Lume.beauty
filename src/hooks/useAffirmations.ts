import { useLocalStorage } from './useLocalStorage';
import { Affirmation, affirmationsList } from '../data/affirmations';

export function useAffirmations() {
  const [affirmations, setAffirmations] = useLocalStorage<Affirmation[]>(
    'lumie.affirmations',
    affirmationsList
  );

  const addAffirmation = (newAff: Omit<Affirmation, 'id'>) => {
    const created: Affirmation = {
      ...newAff,
      id: `aff-custom-${Date.now()}`,
    };
    setAffirmations((prev) => [created, ...prev]);
    return created;
  };

  const updateAffirmation = (id: string, updated: Partial<Omit<Affirmation, 'id'>>) => {
    setAffirmations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
    );
  };

  const deleteAffirmation = (id: string) => {
    setAffirmations((prev) => prev.filter((a) => a.id !== id));
  };

  const resetAffirmations = () => {
    setAffirmations(affirmationsList);
  };

  const getToday = (): Affirmation => {
    if (!affirmations.length) return affirmationsList[0];
    const now = new Date();
    const dayOfYear = Math.floor(
      (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    return affirmations[dayOfYear % affirmations.length];
  };

  return {
    affirmations,
    addAffirmation,
    updateAffirmation,
    deleteAffirmation,
    resetAffirmations,
    getToday,
  };
}
