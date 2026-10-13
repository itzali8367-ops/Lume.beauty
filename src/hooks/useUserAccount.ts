import { UserAccount } from '../types';
import { useLocalStorage } from './useLocalStorage';

const defaultAccount: UserAccount = {
  id: 'user-default',
  name: 'Camille Laurent',
  email: 'camille@lumie.glow',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
  skinType: 'Combination',
  hairType: 'Wavy',
  concerns: ['Dryness', 'Dullness', 'Aging'],
  createdAt: '2026-09-01',
  preferences: {
    morningReminder: true,
    eveningReminder: true,
    weeklyNewsletter: true,
  },
};

export function useUserAccount() {
  const [account, setAccount] = useLocalStorage<UserAccount | null>('lumie.user_account', defaultAccount);

  const login = (email: string, name?: string, avatarUrl?: string) => {
    const updated: UserAccount = {
      id: 'usr-' + Date.now(),
      name: name || email.split('@')[0],
      email,
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
      skinType: account?.skinType || 'Combination',
      hairType: account?.hairType || 'Wavy',
      concerns: account?.concerns || ['Dullness'],
      createdAt: account?.createdAt || new Date().toISOString().slice(0, 10),
      preferences: account?.preferences || {
        morningReminder: true,
        eveningReminder: true,
        weeklyNewsletter: true,
      },
    };
    setAccount(updated);
    return updated;
  };

  const signup = (data: Partial<UserAccount> & { email: string; name: string }) => {
    const created: UserAccount = {
      id: 'usr-' + Date.now(),
      name: data.name,
      email: data.email,
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
      skinType: data.skinType || 'Combination',
      hairType: data.hairType || 'Wavy',
      concerns: data.concerns || ['Dryness', 'Dullness'],
      createdAt: new Date().toISOString().slice(0, 10),
      preferences: {
        morningReminder: true,
        eveningReminder: true,
        weeklyNewsletter: true,
        ...data.preferences,
      },
    };
    setAccount(created);
    return created;
  };

  const updateAccount = (updates: Partial<UserAccount>) => {
    setAccount((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const logout = () => {
    setAccount(null);
  };

  return {
    account,
    isLoggedIn: Boolean(account),
    login,
    signup,
    updateAccount,
    logout,
  };
}
