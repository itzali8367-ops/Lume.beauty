import { initialProgressPhotos } from '../data/mockData';
import { ProgressPhoto } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useProgressPhotos() {
  const [photos, setPhotos] = useLocalStorage<ProgressPhoto[]>('lumie.progress_photos', initialProgressPhotos);

  const addPhoto = (photo: Omit<ProgressPhoto, 'id'>) => {
    const newEntry: ProgressPhoto = {
      ...photo,
      id: 'photo-' + Date.now(),
    };
    setPhotos((prev) => [newEntry, ...prev]);
    return newEntry;
  };

  const deletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePhoto = (id: string, updates: Partial<ProgressPhoto>) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  return {
    photos,
    addPhoto,
    deletePhoto,
    updatePhoto,
  };
}
