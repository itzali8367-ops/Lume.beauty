import { useLocalStorage } from './useLocalStorage';
import { CategoryId } from '../types';

export interface SiteCategory {
  id: CategoryId;
  name: string;
  tagline: string;
  image: string;
}

export interface SiteSettings {
  brandName: string;
  brandTagline: string;
  announcement: {
    enabled: boolean;
    badge: string;
    text: string;
    link: string;
    linkText: string;
  };
  hero: {
    eyebrow: string;
    titlePrefix: string;
    titleHighlight: string;
    description: string;
    primaryCtaText: string;
    secondaryCtaText: string;
    ratingScore: string;
    ratingLabel: string;
    membersCount: string;
    membersLabel: string;
    image: string;
  };
  morningSection: {
    badge: string;
    title: string;
    description: string;
    bullets: string[];
  };
  routineBanner: {
    title: string;
    description: string;
    buttonText: string;
  };
  categories: SiteCategory[];
  footer: {
    tagline: string;
    supportEmail: string;
    newsletterTitle: string;
    newsletterSubtitle: string;
  };
}

export const defaultSiteSettings: SiteSettings = {
  brandName: 'Lumi',
  brandTagline: 'Personalized Beauty & Wellness',
  announcement: {
    enabled: true,
    badge: 'SPRING EDIT',
    text: '20% off all antioxidant serums & custom routines this week',
    link: '/discover',
    linkText: 'Shop Edit',
  },
  hero: {
    eyebrow: 'Personalized beauty guidance',
    titlePrefix: 'Your glow,',
    titleHighlight: ' perfectly guided',
    description:
      'Tailored routines, curated products and expert guides across skincare, haircare and wellness – all tracked in one beautiful place.',
    primaryCtaText: 'Personalize my feed',
    secondaryCtaText: 'Browse products',
    ratingScore: '4.9',
    ratingLabel: 'avg rating',
    membersCount: '50k+',
    membersLabel: 'glowing members',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
  },
  morningSection: {
    badge: 'Daily Habit Tracker',
    title: 'Start your day with intention',
    description:
      'A consistent morning routine seals hydration and shields your skin against daily pollution and UV radiation. Check off each step below and build your radiance streak.',
    bullets: [
      'Non-stripping amino acid cleansing',
      '15% Ethyl Ascorbic Acid free-radical defense',
      'Broad-spectrum SPF 50 daily barrier',
    ],
  },
  routineBanner: {
    title: "Build a routine you'll actually keep",
    description:
      'Follow guided morning, evening, hair and wellness rituals. Check off steps daily and watch your streak grow.',
    buttonText: 'Explore all routines',
  },
  categories: [
    {
      id: 'skincare',
      name: 'Skincare',
      tagline: 'Serums, moisturizers & SPF',
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'haircare',
      name: 'Haircare',
      tagline: 'Scalp health, oils & wash care',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'wellness',
      name: 'Wellness',
      tagline: 'Teas, adaptogens & sleep rituals',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
    },
  ],
  footer: {
    tagline: 'Your personal companion for skincare, haircare and wellness – tailored to you.',
    supportEmail: 'care@lumie.beauty',
    newsletterTitle: 'Join the Lumi Circle',
    newsletterSubtitle: 'Get our weekly editorial on clean ingredients, dermatologist tips, and new routines.',
  },
};

export function useSiteSettings() {
  const [siteSettings, setSiteSettings] = useLocalStorage<SiteSettings>(
    'lumie.site_settings',
    defaultSiteSettings
  );

  const updateSiteSettings = (updated: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const updateHero = (hero: Partial<SiteSettings['hero']>) => {
    setSiteSettings((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...hero },
    }));
  };

  const updateAnnouncement = (announcement: Partial<SiteSettings['announcement']>) => {
    setSiteSettings((prev) => ({
      ...prev,
      announcement: { ...prev.announcement, ...announcement },
    }));
  };

  const updateCategory = (id: CategoryId, data: Partial<SiteCategory>) => {
    setSiteSettings((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }));
  };

  const resetSiteSettings = () => {
    setSiteSettings(defaultSiteSettings);
  };

  return {
    siteSettings,
    updateSiteSettings,
    updateHero,
    updateAnnouncement,
    updateCategory,
    resetSiteSettings,
  };
}
