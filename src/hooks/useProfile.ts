import { UserProfile } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useProfile() {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>('lumie.profile', null);

  return {
    profile,
    saveProfile: (p: UserProfile) => setProfile(p),
    clearProfile: () => setProfile(null),
    hasProfile: Boolean(profile),
  };
}
