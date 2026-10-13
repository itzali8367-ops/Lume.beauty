import { CategoryId } from '../types';

export interface CommunityRoutineStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  keyIngredient: string;
  timeOfDay: 'am' | 'pm' | 'any';
  productSuggestion?: string;
}

export interface CommunityRoutine {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  skinType: 'Dry' | 'Oily' | 'Sensitive' | 'Combination' | 'Mature' | 'Dull';
  timeOfDay: 'morning' | 'evening' | 'both';
  category: CategoryId;
  durationMinutes: number;
  author: {
    name: string;
    handle: string;
    role: string;
    avatar: string;
    verified: boolean;
  };
  metrics: {
    importsCount: number;
    rating: number;
    reviewsCount: number;
    likesCount: number;
  };
  tags: string[];
  clinicalHighlights: string[];
  steps: CommunityRoutineStep[];
}

export const communityRoutines: CommunityRoutine[] = [
  {
    id: 'comm-barrier-rescue',
    title: 'Deep Barrier Rescue & Ceramide Glaze',
    subtitle: 'Lipid restoration for chronically dry, flaky, or compromised skin',
    description: 'Developed to replenish the stratum corneum with optimal 3:1:1 physiological lipids (ceramides, cholesterol, free fatty acids). Eliminates tightness and locks in deep cellular hydration.',
    skinType: 'Dry',
    timeOfDay: 'both',
    category: 'skincare',
    durationMinutes: 6,
    author: {
      name: 'Dr. Sophia Chen',
      handle: '@dr.sophiaskin',
      role: 'Clinical Dermatology Resident',
      avatar: 'https://images.unsplash.com/photo-1594824813576-857e4e16c87a?w=150&h=150&fit=crop&crop=face',
      verified: true,
    },
    metrics: {
      importsCount: 482,
      rating: 4.96,
      reviewsCount: 124,
      likesCount: 310,
    },
    tags: ['Dry Skin', 'Ceramides', 'Skin Barrier', 'Dewy Glow'],
    clinicalHighlights: [
      '3:1:1 physiological lipid ratio repairs moisture barrier within 7 days',
      'Hyaluronic & Beta-Glucan multi-weight hydration prevents trans-epidermal water loss',
      'Free from drying alcohol, fragrance, and essential oils',
    ],
    steps: [
      {
        id: 'comm-step-1-1',
        stepNumber: 1,
        title: 'Nourishing Oat & Squalane Cleansing Emulsion',
        description: 'Gently dissolves dust and impurities without stripping natural skin sebum. Leaves a soft, supple lipid film.',
        keyIngredient: 'Colloidal Oat 2% & Plant Squalane',
        timeOfDay: 'any',
        productSuggestion: 'gentle-cleanser',
      },
      {
        id: 'comm-step-1-2',
        stepNumber: 2,
        title: '5-Layer Hyaluronic Milky Essence',
        description: 'Pat 3–4 drops onto damp skin to flood dehydration lines with micro and macro humectant molecules.',
        keyIngredient: 'Multi-molecular Hyaluronic Acid & Panthenol',
        timeOfDay: 'any',
        productSuggestion: 'hydra-glow',
      },
      {
        id: 'comm-step-1-3',
        stepNumber: 3,
        title: 'Ceramide NP & Phytosphingosine Shield Cream',
        description: 'Warm between fingertips and gently press into facial contours to seal cellular hydration.',
        keyIngredient: 'Ceramide NP, AP, EOP + Fatty Acids',
        timeOfDay: 'any',
        productSuggestion: 'hydra-glow',
      },
      {
        id: 'comm-step-1-4',
        stepNumber: 4,
        title: 'Mineral Defense SPF 50 / Night Squalane Seal',
        description: 'In AM finish with broad-spectrum physical SPF; in PM seal dry patches with 2 drops of organic cold-pressed squalane.',
        keyIngredient: 'Broad-Spectrum UV Matrix & 100% Squalane',
        timeOfDay: 'any',
        productSuggestion: 'spf-shield',
      },
    ],
  },
  {
    id: 'comm-bha-clarifying',
    title: 'BHA Clarifying & Sebum Balance Regimen',
    subtitle: 'Deep follicle unclogging and pore refinement for oily & blemish-prone skin',
    description: 'Targeted botanical and chemical exfoliation protocol engineered to regulate excess sebum production, prevent cystic congestion, and refine enlarged pore appearance without over-stripping.',
    skinType: 'Oily',
    timeOfDay: 'morning',
    category: 'skincare',
    durationMinutes: 5,
    author: {
      name: 'Marcus Vance',
      handle: '@skincare_marcus',
      role: 'Licensed Medical Aesthetician',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: true,
    },
    metrics: {
      importsCount: 615,
      rating: 4.92,
      reviewsCount: 189,
      likesCount: 442,
    },
    tags: ['Oily Skin', 'Salicylic Acid', 'Pore Control', 'Matte Finish'],
    clinicalHighlights: [
      '2% Salicylic Acid lipophilic action penetrates oil glands to dissolve dead sebum',
      'Niacinamide 5% clinically reduces shine by 34% within 14 days',
      'Non-comedogenic gel texture maintains hydration without clogging pores',
    ],
    steps: [
      {
        id: 'comm-step-2-1',
        stepNumber: 1,
        title: 'Purifying Salicylic & Green Tea Foaming Wash',
        description: 'Lather for 60 seconds targeting nose, chin, and forehead to lift debris and calm inflammatory redness.',
        keyIngredient: 'Salicylic Acid 1.5% + Green Tea Polyphenols',
        timeOfDay: 'am',
        productSuggestion: 'gentle-cleanser',
      },
      {
        id: 'comm-step-2-2',
        stepNumber: 2,
        title: 'Zinc PCA & Niacinamide Balancing Tonic',
        description: 'Swipe or press into T-zone to normalize sebum flow and visibly tighten texture.',
        keyIngredient: 'Niacinamide 5% + Zinc PCA 1%',
        timeOfDay: 'am',
        productSuggestion: 'radiance-serum',
      },
      {
        id: 'comm-step-2-3',
        stepNumber: 3,
        title: 'Oil-Free Weightless Water-Gel Moisturizer',
        description: 'Fast-absorbing burst of hydration that strengthens the barrier with zero greasy residue or shine.',
        keyIngredient: 'Tremella Mushroom + Centella Extract',
        timeOfDay: 'am',
        productSuggestion: 'hydra-glow',
      },
      {
        id: 'comm-step-2-4',
        stepNumber: 4,
        title: 'Invisible Velvet Matte SPF 50 Fluid',
        description: 'Oil-absorbing silica microspheres keep your skin shine-free while shielding against photoaging.',
        keyIngredient: 'Aerogel UV Filters + Silica Matte Spheres',
        timeOfDay: 'am',
        productSuggestion: 'spf-shield',
      },
    ],
  },
  {
    id: 'comm-centella-calming',
    title: 'Centella Asiatica Calming & Anti-Redness',
    subtitle: 'Gentle SOS recovery for reactive, stinging, or rosacea-prone skin',
    description: 'An ultra-soothing, hypoallergenic regimen built around Asiaticoside, Madecassoside, and Oat Beta-Glucan to immediately cool cutaneous inflammation and restore reactive skin equilibrium.',
    skinType: 'Sensitive',
    timeOfDay: 'both',
    category: 'skincare',
    durationMinutes: 5,
    author: {
      name: 'Chloe Kim',
      handle: '@chloe_glows',
      role: 'Seoul K-Beauty Formulator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      verified: true,
    },
    metrics: {
      importsCount: 539,
      rating: 4.98,
      reviewsCount: 156,
      likesCount: 388,
    },
    tags: ['Sensitive Skin', 'Centella', 'Anti-Redness', 'Soothing SOS'],
    clinicalHighlights: [
      'Calms vascular flush and inflammatory burning within 15 minutes of application',
      'Dermatologically tested on sensitive and eczema-prone Fitzpatrick types I–VI',
      '0% artificial fragrances, parabens, alcohol, or harsh preservatives',
    ],
    steps: [
      {
        id: 'comm-step-3-1',
        stepNumber: 1,
        title: 'Low-pH Centella Comfort Gel Cleanser',
        description: 'Ultra-mild surfactant matrix matching the skin natural pH 5.5 to cleanse without any stinging or tightness.',
        keyIngredient: 'Centella Asiatica Water 45% + Amino Acids',
        timeOfDay: 'any',
        productSuggestion: 'gentle-cleanser',
      },
      {
        id: 'comm-step-3-2',
        stepNumber: 2,
        title: 'Madecassoside & Mugwort Calming Ampoule',
        description: 'Concentrated cica drops that suppress irritation receptors and soothe flushed facial capillaries.',
        keyIngredient: 'Pure Madecassoside + Artemisia Extract',
        timeOfDay: 'any',
        productSuggestion: 'radiance-serum',
      },
      {
        id: 'comm-step-3-3',
        stepNumber: 3,
        title: 'Panthenol 5% & Beta-Glucan Barrier Balm',
        description: 'A comforting, non-suffocating lipid cream that fortifies fragile skin and accelerates cellular wound repair.',
        keyIngredient: 'Pro-Vitamin B5 (Panthenol 5%) + Ceramide Complex',
        timeOfDay: 'any',
        productSuggestion: 'hydra-glow',
      },
      {
        id: 'comm-step-3-4',
        stepNumber: 4,
        title: 'Non-Nano Zinc Physical Sunscreen SPF 50',
        description: '100% gentle mineral shield that reflects solar heat and UV rays while calming ambient skin warmth.',
        keyIngredient: 'Non-Nano Zinc Oxide 12% + Allantoin',
        timeOfDay: 'am',
        productSuggestion: 'spf-shield',
      },
    ],
  },
  {
    id: 'comm-combo-harmony',
    title: 'Zone-Balancing Botanical Radiance Harmony',
    subtitle: 'Precision equilibrium for combination skin with oily T-zone & dry cheeks',
    description: 'Solves the classic combination skin conundrum by providing dual-zone balance: targeted pore refinement for the forehead and nose with rich antioxidant moisture cushion for the cheek contour.',
    skinType: 'Combination',
    timeOfDay: 'morning',
    category: 'skincare',
    durationMinutes: 6,
    author: {
      name: 'Maya Lin',
      handle: '@mayaskinlab',
      role: 'Cosmetic Chemist & Formulator',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
      verified: true,
    },
    metrics: {
      importsCount: 394,
      rating: 4.89,
      reviewsCount: 98,
      likesCount: 265,
    },
    tags: ['Combination', 'Dual Zone', 'Botanical Balance', 'Glow Balance'],
    clinicalHighlights: [
      'Dual-zone technique prevents clogging the nose while curing dry cheek patches',
      'Botanical antioxidants illuminate the skin for an effortless clean-girl glow',
      'Optimizes natural skin sebum-water ratio to 1:1 equilibrium',
    ],
    steps: [
      {
        id: 'comm-step-4-1',
        stepNumber: 1,
        title: 'Balancing Rice & Willow Bark Foaming Polish',
        description: 'Dissolves oily buildup along the nose while keeping cheeks supple and hydrated.',
        keyIngredient: 'Fermented Rice Filtrate + Willow Bark Extract',
        timeOfDay: 'am',
        productSuggestion: 'gentle-cleanser',
      },
      {
        id: 'comm-step-4-2',
        stepNumber: 2,
        title: 'Vitamin C Radiance & Antioxidant Infusion',
        description: 'Brightens sun spots and protects cellular collagen against daily pollution exposure.',
        keyIngredient: 'Stabilized Vitamin C 10% + Kakadu Plum',
        timeOfDay: 'am',
        productSuggestion: 'radiance-serum',
      },
      {
        id: 'comm-step-4-3',
        stepNumber: 3,
        title: 'Hydra-Balance Lightweight Emulsion',
        description: 'Layer lightly on forehead and nose, applying a generous second layer across drier cheeks and neck.',
        keyIngredient: 'Hyaluronic Acid + Green Tea Squalane',
        timeOfDay: 'am',
        productSuggestion: 'hydra-glow',
      },
      {
        id: 'comm-step-4-4',
        stepNumber: 4,
        title: 'Silk Invisible UV Shield SPF 50',
        description: 'Weightless sunscreen veil that melts into skin with zero grease, tackiness, or pilling under makeup.',
        keyIngredient: 'Next-Gen Filter Matrix + Ectoin',
        timeOfDay: 'am',
        productSuggestion: 'spf-shield',
      },
    ],
  },
  {
    id: 'comm-peptide-retinol',
    title: 'Peptide Architecture & Cellular Retinoid Renewal',
    subtitle: 'Clinically proven firming, collagen rejuvenation, and elastic smoothing',
    description: 'An advanced nightly age-defying protocol designed to stimulate fibroblast collagen synthesis, smooth fine expression lines, and dramatically refine dermal elasticity with encapsulated retinol and multi-peptides.',
    skinType: 'Mature',
    timeOfDay: 'evening',
    category: 'skincare',
    durationMinutes: 8,
    author: {
      name: 'Dr. Elena Rostova',
      handle: '@drelenaradiance',
      role: 'Board-Certified Aesthetic Physician',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      verified: true,
    },
    metrics: {
      importsCount: 448,
      rating: 4.97,
      reviewsCount: 142,
      likesCount: 375,
    },
    tags: ['Mature Skin', 'Retinol', 'Copper Peptides', 'Collagen Firming'],
    clinicalHighlights: [
      'Encapsulated time-release 0.3% Retinol eliminates typical flaking and irritation',
      'Copper Tripeptide-1 boosts collagen I & III production by 68% in vitro',
      'Rich lipid ceramide sandwich technique prevents trans-epidermal moisture loss',
    ],
    steps: [
      {
        id: 'comm-step-5-1',
        stepNumber: 1,
        title: 'Lipid Replenishing Double Cleanse',
        description: 'Massage nourishing oil cleanser to melt makeup and daily pollutants, followed by gentle creamy foaming wash.',
        keyIngredient: 'Camellia Seed Oil + Phospholipids',
        timeOfDay: 'pm',
        productSuggestion: 'gentle-cleanser',
      },
      {
        id: 'comm-step-5-2',
        stepNumber: 2,
        title: 'Multi-Peptide Matrix & Argireline Elixir',
        description: 'Apply over forehead, crow feet, and smile lines to stimulate dermal elastin and relax micro-tension.',
        keyIngredient: 'Matrixyl 3000 + Copper Tripeptide-1',
        timeOfDay: 'pm',
        productSuggestion: 'radiance-serum',
      },
      {
        id: 'comm-step-5-3',
        stepNumber: 3,
        title: 'Encapsulated Retinol Renewal Complex',
        description: 'Apply a pea-sized amount over dry skin. Accelerates overnight cellular turnover and smooths texture.',
        keyIngredient: 'Encapsulated Pure Retinol 0.3% + Bisabolol',
        timeOfDay: 'pm',
        productSuggestion: 'retinol-renewal',
      },
      {
        id: 'comm-step-5-4',
        stepNumber: 4,
        title: 'Deep Barrier Overnight Glaze & Eye Cream',
        description: 'Seal with a rich peptide lipid cream and gently tap nourishing eye cream around orbital bone.',
        keyIngredient: 'Ceramide Complex + Marine Collagen Peptides',
        timeOfDay: 'pm',
        productSuggestion: 'hydra-glow',
      },
    ],
  },
  {
    id: 'comm-glass-skin-brightening',
    title: 'Glass Skin Brightening & Antioxidant Defend',
    subtitle: 'Fade hyperpigmentation, even skin tone, and unlock mirror-like radiance',
    description: 'Inspired by modern glass skin rituals. Synergizes 15% Vitamin C, Alpha Arbutin, Licorice Root, and Niacinamide to target dark spots, post-blemish erythema, and reveal luminous, translucent skin.',
    skinType: 'Dull',
    timeOfDay: 'morning',
    category: 'skincare',
    durationMinutes: 7,
    author: {
      name: 'Alix Rivera',
      handle: '@alix_glows',
      role: 'Celebrity Facialist & Glow Expert',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      verified: true,
    },
    metrics: {
      importsCount: 521,
      rating: 4.95,
      reviewsCount: 167,
      likesCount: 412,
    },
    tags: ['Dull Skin', 'Glass Skin', 'Vitamin C', 'Fade Dark Spots'],
    clinicalHighlights: [
      'Inhibits tyrosinase enzyme activity to stop melanin overproduction',
      'Enhances light reflection on cheekbones and forehead for natural dewy radiance',
      'Synergistic antioxidants provide 8x solar radical photoprotection under SPF',
    ],
    steps: [
      {
        id: 'comm-step-6-1',
        stepNumber: 1,
        title: 'Gentle Enzyme Brightening Powder Wash',
        description: 'Papaya and rice enzymes gently dissolve dead, light-scattering surface cells for immediate clarity.',
        keyIngredient: 'Papain Enzymes + Rice Bran Extract',
        timeOfDay: 'am',
        productSuggestion: 'gentle-cleanser',
      },
      {
        id: 'comm-step-6-2',
        stepNumber: 2,
        title: '15% Vitamin C + Ferulic Acid Glow Drops',
        description: 'Press 4–5 drops onto face and neck. Neutralizes free radicals and fades persistent discoloration.',
        keyIngredient: 'Ethyl Ascorbic Acid 15% + Ferulic Acid 0.5%',
        timeOfDay: 'am',
        productSuggestion: 'radiance-serum',
      },
      {
        id: 'comm-step-6-3',
        stepNumber: 3,
        title: 'Alpha Arbutin & Licorice Tone Harmonizer',
        description: 'Targeted spot treatment that evens skin tone and prevents new post-sun blemishes.',
        keyIngredient: 'Alpha Arbutin 2% + Glycyrrhiza Glabra',
        timeOfDay: 'am',
        productSuggestion: 'hydra-glow',
      },
      {
        id: 'comm-step-6-4',
        stepNumber: 4,
        title: 'Radiance Dew SPF 50 Broad Spectrum Veil',
        description: 'Dewy finish sunscreen infused with light-reflecting hydration spheres for instant all-day glass skin glow.',
        keyIngredient: 'Broad-Spectrum UV Matrix + Hyaluronic Acid',
        timeOfDay: 'am',
        productSuggestion: 'spf-shield',
      },
    ],
  },
];
