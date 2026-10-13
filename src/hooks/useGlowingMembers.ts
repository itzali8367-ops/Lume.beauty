import { useLocalStorage } from './useLocalStorage';

export interface GlowingMember {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  skinType: string;
  hairType: string;
  concerns: string[];
  streak: number;
  archetype: string;
  joinedDate: string;
  tier: 'Glow Starter' | 'Radiant Daily' | 'Lumi VIP';
  status: 'active' | 'resting';
}

const initialGlowingMembers: GlowingMember[] = [
  {
    id: 'mem-1',
    name: 'Camille Laurent',
    email: 'camille@lumie.glow',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    skinType: 'Combination',
    hairType: 'Wavy',
    concerns: ['Dryness', 'Dullness'],
    streak: 14,
    archetype: 'The Hydration Purist',
    joinedDate: '2026-08-12',
    tier: 'Lumi VIP',
    status: 'active',
  },
  {
    id: 'mem-2',
    name: 'Elena Rostova',
    email: 'elena.r@aura.beauty',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces',
    skinType: 'Sensitive',
    hairType: 'Straight',
    concerns: ['Redness', 'Barrier Healing'],
    streak: 21,
    archetype: 'The Barrier Rebuilder',
    joinedDate: '2026-07-28',
    tier: 'Lumi VIP',
    status: 'active',
  },
  {
    id: 'mem-3',
    name: 'Sophia Chen',
    email: 'sophia.chen@glowclub.io',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces',
    skinType: 'Oily',
    hairType: 'Straight',
    concerns: ['Acne', 'Large Pores'],
    streak: 9,
    archetype: 'The Botanical Minimalist',
    joinedDate: '2026-09-02',
    tier: 'Radiant Daily',
    status: 'active',
  },
  {
    id: 'mem-4',
    name: 'Maya Patel',
    email: 'maya.patel@wellness.com',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=faces',
    skinType: 'Dry',
    hairType: 'Curly',
    concerns: ['Dehydration', 'Fine Lines'],
    streak: 7,
    archetype: 'The Cell Renewal Specialist',
    joinedDate: '2026-09-15',
    tier: 'Radiant Daily',
    status: 'active',
  },
  {
    id: 'mem-5',
    name: 'Liam Vance',
    email: 'liam.v@lumie.glow',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    skinType: 'Normal',
    hairType: 'Wavy',
    concerns: ['Sun Protection', 'Dullness'],
    streak: 18,
    archetype: 'The Radiant Purist',
    joinedDate: '2026-08-30',
    tier: 'Lumi VIP',
    status: 'active',
  },
  {
    id: 'mem-6',
    name: 'Jordan Taylor',
    email: 'jtaylor@modernskin.org',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces',
    skinType: 'Combination',
    hairType: 'Coily',
    concerns: ['Hyperpigmentation'],
    streak: 4,
    archetype: 'The Barrier Rebuilder',
    joinedDate: '2026-10-01',
    tier: 'Glow Starter',
    status: 'active',
  },
];

export function useGlowingMembers() {
  const [members, setMembers] = useLocalStorage<GlowingMember[]>(
    'lumie.glowing_members',
    initialGlowingMembers
  );

  const addMember = (memberData: Omit<GlowingMember, 'id'>) => {
    const newMember: GlowingMember = {
      ...memberData,
      id: 'mem-' + Date.now(),
    };
    setMembers((prev) => [newMember, ...prev]);
    return newMember;
  };

  const updateMember = (id: string, updates: Partial<GlowingMember>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const resetMembers = () => {
    setMembers(initialGlowingMembers);
  };

  return {
    members,
    addMember,
    updateMember,
    deleteMember,
    resetMembers,
  };
}
