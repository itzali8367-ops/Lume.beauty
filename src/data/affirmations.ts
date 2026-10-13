export interface Affirmation {
  id: string;
  quote: string;
  author: string;
  theme: 'Radiance' | 'Mindful Self-Care' | 'Barrier Healing' | 'Inner Balance' | 'Rest & Renewal';
  tip?: string;
}

export const affirmationsList: Affirmation[] = [
  {
    id: 'aff-1',
    quote: 'True radiance begins the moment you give yourself permission to slow down and listen to what your skin is asking for.',
    author: 'Dr. Lena Park, Dermatological Editor',
    theme: 'Radiance',
    tip: 'Take 30 extra seconds to gently press your morning serum into your skin with warm palms today.',
  },
  {
    id: 'aff-2',
    quote: 'Your skin is not a canvas to be perfected, but a living barrier that protects you with quiet grace every single day.',
    author: 'Lumi Wellness Journal',
    theme: 'Barrier Healing',
    tip: 'Hydration from within is your strongest shield – drink a tall glass of lemon water before your first coffee.',
  },
  {
    id: 'aff-3',
    quote: 'Consistency in small, gentle rituals creates the profound transformation that intensity can never force.',
    author: 'Maya Rivera, Skin Specialist',
    theme: 'Mindful Self-Care',
    tip: 'Treat your evening cleanse not as a chore, but as a tender punctuation mark to the day.',
  },
  {
    id: 'aff-4',
    quote: 'When your inner world feels calm and grounded, your skin breathes freely and reflects that serene light.',
    author: 'Sofia Bennett, Holistic Guide',
    theme: 'Inner Balance',
    tip: 'Pair your evening moisturizer with five slow, deep diaphragmatic breaths before sleep.',
  },
  {
    id: 'aff-5',
    quote: 'Embrace where your skin is today. Healing and glowing are gentle rhythms, never linear races.',
    author: 'Jordan Cole, Scalp & Beauty Formulator',
    theme: 'Rest & Renewal',
    tip: 'Be patient with active treatments like retinol and vitamin C – skin cells renew in 28-day cycles.',
  },
  {
    id: 'aff-6',
    quote: 'Caring for your body is an act of deep reverence for the life you are building within it.',
    author: 'Camille Laurent, Founder',
    theme: 'Mindful Self-Care',
    tip: 'Apply SPF right after your moisturizer to seal in moisture and protect your future glow.',
  },
  {
    id: 'aff-7',
    quote: 'Rest is not a reward for work completed; it is the fundamental soil from which all beauty and vitality blossom.',
    author: 'Dr. Lena Park',
    theme: 'Rest & Renewal',
    tip: 'Dim ambient lights one hour before bed to support your natural melatonin and cellular repair.',
  },
  {
    id: 'aff-8',
    quote: 'The secret to luminous skin is not complicated chemistry – it is daily kindness to your natural barrier.',
    author: 'Lumi Rituals',
    theme: 'Radiance',
    tip: 'Never rub or tug when drying face; always pat gently with a clean microfiber cloth.',
  },
];

export function getTodayAffirmation(): Affirmation {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = Math.abs(dayOfYear) % affirmationsList.length;
  return affirmationsList[index];
}
