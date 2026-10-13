import { Category, CategoryId, Guide, Product, ProgressPhoto, Routine } from '../types';
import rawProductsData from './products.json';
import guidesData from './guides.json';

export const categories: Category[] = [
  {
    id: 'skincare',
    name: 'Skincare',
    tagline: 'Glow that starts at the surface',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'haircare',
    name: 'Haircare',
    tagline: 'Stronger roots, softer strands',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'wellness',
    name: 'Wellness',
    tagline: 'Beauty from the inside out',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
  },
];

export const concernsByCategory: Record<CategoryId, string[]> = {
  skincare: ['Dryness', 'Acne', 'Aging', 'Dullness', 'Sensitivity'],
  haircare: ['Frizz', 'Hair fall', 'Dryness', 'Volume', 'Scalp care'],
  wellness: ['Sleep', 'Energy', 'Glow', 'Immunity'],
};

export const allConcerns = Array.from(
  new Set([
    ...concernsByCategory.skincare,
    ...concernsByCategory.haircare,
    ...concernsByCategory.wellness,
  ])
);

export const skinTypes = ['Dry', 'Oily', 'Combination', 'Sensitive', 'Normal'];
export const hairTypes = ['Straight', 'Wavy', 'Curly', 'Coily'];
export const moods = ['Glowing', 'Calm', 'Tired', 'Stressed', 'Balanced'];

// Detailed enhancements for products
const productDetailsMap: Record<string, Partial<Product>> = {
  'radiance-serum': {
    volume: '30 ml / 1.0 fl. oz.',
    routineStep: 'Treat',
    suitableFor: ['All skin types', 'Dull skin', 'Uneven texture', 'Early fine lines'],
    keyBenefits: [
      'Visibly brightens and fades stubborn hyperpigmentation in 3 weeks',
      'Neutralizes environmental free-radical damage with 15% Vitamin C',
      'Boosts natural collagen synthesis for firmer, plump skin',
      'Fast-absorbing golden serum with zero sticky residue',
    ],
    keyActives: [
      { name: 'Ethyl Ascorbic Acid (Vitamin C)', percentage: '15%', purpose: 'Potent, stable brightening & antioxidant shield' },
      { name: 'Ferulic Acid', percentage: '0.5%', purpose: 'Stabilizes vitamin C and doubles photoprotection' },
      { name: 'Niacinamide (Vitamin B3)', percentage: '2%', purpose: 'Evens skin tone and strengthens cellular barrier' },
    ],
    ingredients: [
      'Aqua/Water/Eau', '3-O-Ethyl Ascorbic Acid', 'Propanediol', 'Glycerin', 'Niacinamide',
      'Ferulic Acid', 'Sodium Hyaluronate', 'Tocopherol (Vitamin E)', 'Camellia Sinensis (Green Tea) Leaf Extract',
      'Citric Acid', 'Phenoxyethanol', 'Ethylhexylglycerin'
    ],
    howToUse: 'Smooth 3–4 drops onto freshly cleansed face, neck and décolletage every morning. Pat gently until absorbed before following with moisturizer and broad-spectrum SPF.',
    userReviews: [
      {
        id: 'rev-1',
        author: 'Elena Rostova',
        rating: 5,
        date: '2026-09-28',
        skinType: 'Combination',
        verifiedBuyer: true,
        title: 'Real luminosity without any stinging!',
        comment: 'I have notoriously sensitive combination skin, and most high-strength vitamin C serums make my cheeks flare red. Aurélia\'s formula is so gentle yet remarkably effective. In just 3 weeks, my post-acne dark marks have noticeably lightened.'
      },
      {
        id: 'rev-2',
        author: 'Chloe M.',
        rating: 5,
        date: '2026-10-02',
        skinType: 'Normal',
        verifiedBuyer: true,
        title: 'Holy grail morning step',
        comment: 'Lightweight, layers beautifully under makeup and SPF without pilling. Gives that dewy lit-from-within glow immediately upon application.'
      },
      {
        id: 'rev-3',
        author: 'Sarah Jenkins',
        rating: 4,
        date: '2026-08-15',
        skinType: 'Dry',
        verifiedBuyer: true,
        title: 'Very effective, slight citrus scent',
        comment: 'Faded sun spots considerably over the summer months. Bottle lasted over 2 months of daily use. Highly recommend!'
      }
    ]
  },
  'hydra-glow': {
    volume: '50 ml / 1.7 fl. oz.',
    routineStep: 'Hydrate',
    suitableFor: ['Dry', 'Normal', 'Dehydrated', 'Combination'],
    keyBenefits: [
      'Clinically proven 48-hour continuous cellular hydration',
      'Lightweight cloud-gel texture that melts effortlessly into skin',
      'Strengthens compromised skin barriers with barrier-identical ceramides',
      'Soothes redness and tight, parched winter skin',
    ],
    keyActives: [
      { name: 'Multi-Molecular Hyaluronic Acid', percentage: '3%', purpose: 'Deep and superficial multi-depth hydration' },
      { name: 'Ceramide NP & AP', percentage: '1%', purpose: 'Locks in moisture and prevents trans-epidermal water loss' },
      { name: 'Centella Asiatica (Cica)', percentage: '2%', purpose: 'Calms irritation and visibly relieves redness' },
    ],
    ingredients: [
      'Water', 'Glycerin', 'Caprylic/Capric Triglyceride', 'Dimethicone', 'Sodium Hyaluronate',
      'Hydrolyzed Hyaluronic Acid', 'Ceramide NP', 'Ceramide AP', 'Phytosphingosine',
      'Centella Asiatica Extract', 'Panthenol', 'Allantoin', 'Carbomer', 'Disodium EDTA'
    ],
    howToUse: 'Warm a dime-sized amount between clean fingertips and gently massage over face and neck morning and evening as the hydrating layer of your routine.',
    userReviews: [
      {
        id: 'rev-4',
        author: 'Marcus Vance',
        rating: 5,
        date: '2026-09-14',
        skinType: 'Dry',
        verifiedBuyer: true,
        title: 'Finally stopped my flaky winter skin',
        comment: 'I work long hours in dry air-conditioned offices. This is the only moisturizer that keeps my skin plump and smooth from 8am till bedtime without feeling greasy.'
      },
      {
        id: 'rev-5',
        author: 'Amara N.',
        rating: 5,
        date: '2026-09-22',
        skinType: 'Sensitive',
        verifiedBuyer: true,
        title: 'Pure comfort in a jar',
        comment: 'Soothing, gentle, and leaves a gorgeous satin bounce. No breakouts and no fragrance irritation whatsoever.'
      }
    ]
  },
  'gentle-cleanser': {
    volume: '150 ml / 5.1 fl. oz.',
    routineStep: 'Cleanse',
    suitableFor: ['All skin types', 'Sensitive', 'Blemish-prone'],
    keyBenefits: [
      'pH 5.5 balanced formulation respects the skin\'s acid mantle',
      'Removes impurities, makeup and daily grime without post-wash tightness',
      'Calming chamomile and oat extract to reduce morning puffiness',
    ],
    keyActives: [
      { name: 'Colloidal Oatmeal', percentage: '1.5%', purpose: 'Anti-irritant and barrier soothing' },
      { name: 'Glycerin & Amino Acid Surfactants', percentage: '10%', purpose: 'Ultra-mild, non-stripping cleansing base' }
    ],
    ingredients: [
      'Water/Aqua', 'Sodium Cocoyl Glycinate', 'Glycerin', 'Cocamidopropyl Betaine',
      'Avena Sativa (Oat) Kernel Flour', 'Chamomilla Recutita Extract', 'Aloe Barbadensis Leaf Juice',
      'Sodium Chloride', 'Citric Acid', 'Potassium Sorbate'
    ],
    howToUse: 'Dampen face with lukewarm water. Massage 1–2 pumps onto skin in circular motions for 60 seconds, then rinse cleanly and pat dry with a soft cloth.',
    userReviews: [
      {
        id: 'rev-6',
        author: 'Tara Lin',
        rating: 5,
        date: '2026-10-05',
        skinType: 'Sensitive',
        verifiedBuyer: true,
        title: 'Never leaves my face feeling tight',
        comment: 'The softest cloud-like foam! Cleans away sunscreen effortlessly and my skin feels balanced and so calm.'
      }
    ]
  },
  'retinol-renewal': {
    volume: '30 ml / 1.0 fl. oz.',
    routineStep: 'Treat',
    suitableFor: ['Aging concerns', 'Uneven texture', 'Congested pores'],
    keyBenefits: [
      'Encapsulated time-release 0.3% pure retinol for minimal sensitivity',
      'Accelerates cellular turnover to refine pores and soften fine lines',
      'Buffered with squalane and bisabolol to comfort active skin overnight',
    ],
    keyActives: [
      { name: 'Encapsulated Pure Retinol', percentage: '0.3%', purpose: 'Smooths wrinkles, clears pores, promotes collagen' },
      { name: 'Squalane (Olive-derived)', percentage: '5%', purpose: 'Mimics skin\'s natural sebum to cushion against dryness' }
    ],
    ingredients: [
      'Squalane', 'Caprylic/Capric Triglyceride', 'Retinol', 'Polysorbate 20', 'Bisabolol',
      'Tocopheryl Acetate', 'BHT', 'Helianthus Annuus Seed Oil'
    ],
    howToUse: 'Apply 2–3 drops to clean, completely dry skin at night 2–3 times weekly. Follow with a rich barrier moisturizer. Always wear SPF the following morning.',
    userReviews: [
      {
        id: 'rev-7',
        author: 'Hannah Davies',
        rating: 5,
        date: '2026-09-18',
        skinType: 'Combination',
        verifiedBuyer: true,
        title: 'Zero peeling, incredible smoothing results',
        comment: 'I was terrified of the dreaded retinol purge. This encapsulated formula gave me silky smooth skin within a month without any flaking or redness.'
      }
    ]
  },
  'spf-shield': {
    volume: '50 ml / 1.7 fl. oz.',
    routineStep: 'Protect',
    suitableFor: ['All skin types', 'Daily outdoor exposure', 'Under makeup'],
    keyBenefits: [
      'Broad spectrum SPF 50 PA++++ protection against UVA & UVB rays',
      'Zero white cast, transparent glow on all Fitzpatrick skin tones',
      'Infused with antioxidant ectoin and hyaluronic acid for urban defense',
    ],
    keyActives: [
      { name: 'Next-Gen UV Filter Matrix', percentage: 'SPF 50', purpose: 'Broad spectrum photostable barrier' },
      { name: 'Ectoin', percentage: '1%', purpose: 'Protects cells against blue light and urban pollution' }
    ],
    ingredients: [
      'Water', 'Diethylamino Hydroxybenzoyl Hexyl Benzoate', 'Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine',
      'Ethylhexyl Triazone', 'Ectoin', 'Niacinamide', 'Sodium Hyaluronate', 'Silica', 'Tocopherol'
    ],
    howToUse: 'Apply generously as the final step of your morning skincare routine 15 minutes before sun exposure. Reapply every 2 hours when spending extended time outdoors.',
    userReviews: [
      {
        id: 'rev-8',
        author: 'Dina K.',
        rating: 5,
        date: '2026-10-08',
        skinType: 'Oily',
        verifiedBuyer: true,
        title: 'The only sunscreen that doesn\'t grease up my T-zone',
        comment: 'Absorbs within seconds into a silky velvet finish with no white ghost cast. Doesn\'t sting my eyes at the gym either.'
      }
    ]
  },
  'repair-hair-oil': {
    volume: '45 ml / 1.5 fl. oz.',
    routineStep: 'Weekly Care',
    suitableFor: ['Frizzy hair', 'Split ends', 'Color-treated or heat-styled hair'],
    keyBenefits: [
      'Repairs broken keratin disulfide bonds from heat and coloring',
      'Tames flyaways and seals cuticle with mirror-like glass hair shine',
      'Lightweight cold-pressed marula, argan and camellia seed oils',
    ],
    keyActives: [
      { name: 'Camellia Japonica Seed Oil', percentage: 'Pure blend', purpose: 'Restores lipid barrier and elastic softness' },
      { name: 'Cold-Pressed Argan Oil', percentage: 'Organic', purpose: 'Smooths frizz and seals porous split ends' }
    ],
    ingredients: ['Camellia Japonica Seed Oil', 'Argania Spinosa Kernel Oil', 'Sclerocarya Birrea Seed Oil', 'Tocopherol', 'Fragrance/Parfum'],
    howToUse: 'Work 2–3 drops through damp towel-dried ends before blow drying, or smooth over dry styled hair to seal shine and eliminate frizz.',
    userReviews: [
      {
        id: 'rev-9',
        author: 'Rachel Bloom',
        rating: 5,
        date: '2026-09-30',
        skinType: 'Curly Hair',
        verifiedBuyer: true,
        title: 'Glass hair in 3 drops',
        comment: 'My bleached ends used to feel like straw. This oil transformed my hair into silk without weighing down my curls.'
      }
    ]
  },
  'volume-shampoo': {
    volume: '250 ml / 8.4 fl. oz.',
    routineStep: 'Cleanse',
    suitableFor: ['Fine, flat hair', 'Oily roots', 'Daily cleansing'],
    keyBenefits: [
      'Gently lifts roots and plumps fine strands with pea peptide proteins',
      'Sulfate-free formulation protects natural scalp microbiome',
      'Invigorating rosemary and mint aroma',
    ],
    keyActives: [
      { name: 'Hydrolyzed Pea Peptide', percentage: '2%', purpose: 'Volume and strand density builder' },
      { name: 'Biotin & Rosemary Extract', percentage: '1%', purpose: 'Stimulates micro-circulation at follicular roots' }
    ],
    ingredients: ['Water', 'Sodium Lauroyl Methyl Isethionate', 'Cocamidopropyl Hydroxysultaine', 'Pisum Sativum Peptide', 'Rosmarinus Officinalis Extract', 'Biotin'],
    howToUse: 'Lather into wet scalp and massage with fingertips for 2 minutes. Rinse thoroughly and follow with Silk Repair Conditioner.',
    userReviews: [
      {
        id: 'rev-10',
        author: 'Kelsey T.',
        rating: 4,
        date: '2026-08-29',
        skinType: 'Fine Hair',
        verifiedBuyer: true,
        title: 'Big bouncy hair all day long',
        comment: 'Doesn\'t dry out my hair and gives noticeable lift that lasts until day 2.'
      }
    ]
  },
  'silk-conditioner': {
    volume: '250 ml / 8.4 fl. oz.',
    routineStep: 'Hydrate',
    suitableFor: ['Dry hair', 'Tangled strands', 'Medium to thick hair'],
    keyBenefits: [
      'Instant slip and effortless detangling in 60 seconds',
      'Hydrates parched hair fibers without build-up',
      'Infused with silk amino acids and coconut squalane',
    ],
    keyActives: [
      { name: 'Silk Amino Acids', percentage: '2%', purpose: 'Deep moisture retention and strand elasticity' }
    ],
    ingredients: ['Water', 'Cetearyl Alcohol', 'Behentrimonium Chloride', 'Silk Amino Acids', 'Glycerin', 'Panthenol'],
    howToUse: 'Apply from mid-lengths to ends after shampooing. Leave on for 2–3 minutes, then rinse cleanly with cool water.',
    userReviews: [
      {
        id: 'rev-11',
        author: 'Jasmine Lee',
        rating: 5,
        date: '2026-09-12',
        skinType: 'Wavy Hair',
        verifiedBuyer: true,
        title: 'Untangles like magic',
        comment: 'Leaves my hair feeling soft like liquid silk.'
      }
    ]
  },
  'scalp-detox': {
    volume: '100 ml / 3.4 fl. oz.',
    routineStep: 'Weekly Care',
    suitableFor: ['Product buildup', 'Itchy or flaky scalp', 'Excess oil'],
    keyBenefits: [
      'Gently dissolves stubborn dry shampoo and dead skin buildup with 2% Salicylic Acid',
      'Rebalances scalp pH and soothes itchiness with tea tree and zinc PCA',
      'Applicator nozzle for precision section-by-section application',
    ],
    keyActives: [
      { name: 'Salicylic Acid (BHA)', percentage: '2%', purpose: 'Scalp exfoliation and follicle unclogging' },
      { name: 'Zinc PCA & Tea Tree Leaf Oil', percentage: '1%', purpose: 'Sebum regulation and microbial balance' }
    ],
    ingredients: ['Water', 'Glycerin', 'Salicylic Acid', 'Zinc PCA', 'Melaleuca Alternifolia Oil', 'Mentha Piperita Oil'],
    howToUse: 'Part damp or dry hair and apply directly to scalp before washing. Massage for 5 minutes, leave on for 10 minutes, then wash hair as usual.',
    userReviews: [
      {
        id: 'rev-12',
        author: 'Noah Sterling',
        rating: 5,
        date: '2026-09-04',
        skinType: 'Oily Scalp',
        verifiedBuyer: true,
        title: 'Instant relief from itchy buildup',
        comment: 'My scalp feels like it can finally breathe! Completely eliminated post-gym itch.'
      }
    ]
  },
  'collagen-glow': {
    volume: '300 g / 30 Servings',
    routineStep: 'Daily Wellness',
    suitableFor: ['Skin elasticity', 'Nail strength', 'Joint & gut wellness'],
    keyBenefits: [
      'Hydrolyzed grass-fed bovine peptides type I & III for maximum bioavailability',
      'Fortified with Vitamin C and hyaluronic acid to supercharge endogenous synthesis',
      'Unflavored, dissolves completely in morning coffee, tea or smoothies',
    ],
    keyActives: [
      { name: 'Hydrolyzed Collagen Peptides', percentage: '10g per scoop', purpose: 'Cellular dermal matrix and elastic repair' },
      { name: 'L-Ascorbic Acid (Vitamin C)', percentage: '100mg', purpose: 'Essential enzymatic co-factor for collagen synthesis' }
    ],
    ingredients: ['Hydrolyzed Bovine Collagen Peptides', 'Ascorbic Acid', 'Sodium Hyaluronate'],
    howToUse: 'Mix 1 scoop daily into your morning coffee, tea, water or smoothie. Stir until dissolved.',
    userReviews: [
      {
        id: 'rev-13',
        author: 'Claire Montrose',
        rating: 5,
        date: '2026-10-01',
        skinType: 'All',
        verifiedBuyer: true,
        title: 'Stronger nails and bouncy skin in 4 weeks',
        comment: 'I noticed my nails stopped peeling after week 2, and my facial skin looks noticeably firmer and more hydrated.'
      }
    ]
  },
  'calm-tea': {
    volume: '50 g / 25 biodegradable sachets',
    routineStep: 'Daily Wellness',
    suitableFor: ['Evening wind-down', 'Restless sleep', 'Stress recovery'],
    keyBenefits: [
      'Organic blend of chamomile blossoms, passionflower and lemon balm',
      'Naturally promotes GABA activity for serene restorative sleep cycles',
      'Caffeine-free and soothing for nighttime gut digestion',
    ],
    keyActives: [
      { name: 'German Chamomile & Passionflower', percentage: 'Herbal blend', purpose: 'Calming nervous tension and deep REM support' }
    ],
    ingredients: ['Organic Chamomile Flowers', 'Organic Passionflower', 'Organic Lemon Balm', 'Organic Lavender Buds', 'Organic Valerian Root'],
    howToUse: 'Steep 1 sachet in freshly boiled water (95°C / 200°F) for 5–7 minutes approximately 45 minutes before sleep.',
    userReviews: [
      {
        id: 'rev-14',
        author: 'Brooke S.',
        rating: 5,
        date: '2026-09-25',
        skinType: 'All',
        verifiedBuyer: true,
        title: 'My nightly relaxation ritual',
        comment: 'Delicious, smooth floral taste with zero bitterness. I sleep like a baby every night now.'
      }
    ]
  },
  'omega-capsules': {
    volume: '60 softgels / 30 day supply',
    routineStep: 'Daily Wellness',
    suitableFor: ['Dry skin', 'Inflammation', 'Dull hair & energy'],
    keyBenefits: [
      'Ultra-pure wild anchovy & sardine omega-3 with 800mg EPA & 400mg DHA',
      'Supports cutaneous lipid moisture barrier and systemic cellular vitality',
      'Infused with Biotin 5000mcg and Astaxanthin antioxidant',
    ],
    keyActives: [
      { name: 'Wild Fish Oil (EPA 800mg / DHA 400mg)', percentage: '1200mg', purpose: 'Cell membrane liquidity and anti-inflammatory balance' },
      { name: 'Biotin', percentage: '5000 mcg', purpose: 'Keratin infrastructure and hair follicle strength' }
    ],
    ingredients: ['Purified Deep Sea Fish Oil (Anchovy, Sardine)', 'Softgel Capsule (Gelatin, Glycerin, Water)', 'Natural Lemon Flavor', 'D-Alpha Tocopherol', 'Astaxanthin', 'Biotin'],
    howToUse: 'Take 2 softgels daily with a meal containing healthy fats for optimal absorption.',
    userReviews: [
      {
        id: 'rev-15',
        author: 'Valerie Gomez',
        rating: 5,
        date: '2026-09-19',
        skinType: 'All',
        verifiedBuyer: true,
        title: 'Zero fishy burps, amazing skin glow',
        comment: 'The natural lemon flavor prevents any unpleasant aftertaste. My chronic dry skin patches have completely vanished!'
      }
    ]
  }
};

// Combine raw products with enriched details
export const products: Product[] = (rawProductsData as Product[]).map((prod) => ({
  ...prod,
  aliexpressUrl: prod.aliexpressUrl || `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(prod.name)}`,
  ...(productDetailsMap[prod.id] || {}),
}));

export const guides: Guide[] = guidesData as Guide[];

export const routines: Routine[] = [
  {
    id: 'morning-skin',
    name: 'Morning Glow',
    time: 'AM – Skincare',
    category: 'skincare',
    accent: 'from-amber-200 to-rose-200',
    steps: [
      { id: 'am-1', title: 'Gentle Cleanse', description: 'Refresh skin with a mild foaming cleanser.', timeOfDay: 'am', productSuggestion: 'gentle-cleanser' },
      { id: 'am-2', title: 'Vitamin C Serum', description: 'Brighten and protect against daily environmental stress.', timeOfDay: 'am', productSuggestion: 'radiance-serum' },
      { id: 'am-3', title: 'Hydrate & Lock In', description: 'Lock in moisture with a lightweight gel-cream.', timeOfDay: 'am', productSuggestion: 'hydra-glow' },
      { id: 'am-4', title: 'SPF 50 Daily Shield', description: 'Finish with broad-spectrum sun protection.', timeOfDay: 'am', productSuggestion: 'spf-shield' },
    ],
  },
  {
    id: 'evening-skin',
    name: 'Evening Repair',
    time: 'PM – Skincare',
    category: 'skincare',
    accent: 'from-rose-200 to-fuchsia-200',
    steps: [
      { id: 'pm-1', title: 'Double Cleanse', description: 'Remove sunscreen and daily impurities thoroughly.', timeOfDay: 'pm', productSuggestion: 'gentle-cleanser' },
      { id: 'pm-2', title: 'Retinol Treatment', description: 'Smooth texture and accelerate cellular renewal overnight.', timeOfDay: 'pm', productSuggestion: 'retinol-renewal' },
      { id: 'pm-3', title: 'Rich Moisturizer', description: 'Seal in actives and fortify the lipid barrier.', timeOfDay: 'pm', productSuggestion: 'hydra-glow' },
      { id: 'pm-4', title: 'Eye Care & Pat', description: 'Gently pat on a hydrating soothing eye cream.', timeOfDay: 'pm' },
    ],
  },
  {
    id: 'hair-wash',
    name: 'Wash Day',
    time: 'Weekly – Haircare',
    category: 'haircare',
    accent: 'from-amber-200 to-orange-200',
    steps: [
      { id: 'hair-1', title: 'Scalp Detox', description: 'Clear buildup and unclog follicles with a scalp treatment.', timeOfDay: 'weekly', productSuggestion: 'scalp-detox' },
      { id: 'hair-2', title: 'Cleanse', description: 'Wash with a sulfate-free volumizing shampoo.', timeOfDay: 'weekly', productSuggestion: 'volume-shampoo' },
      { id: 'hair-3', title: 'Deep Condition', description: 'Rebuild bonds with a silk repair conditioner.', timeOfDay: 'weekly', productSuggestion: 'silk-conditioner' },
      { id: 'hair-4', title: 'Seal with Oil', description: 'Smooth ends with a few drops of lightweight hair oil.', timeOfDay: 'weekly', productSuggestion: 'repair-hair-oil' },
    ],
  },
  {
    id: 'wellness-daily',
    name: 'Inner Glow',
    time: 'Daily – Wellness',
    category: 'wellness',
    accent: 'from-emerald-200 to-teal-200',
    steps: [
      { id: 'well-1', title: 'Hydrate', description: 'Drink a full glass of lemon water upon waking.', timeOfDay: 'am' },
      { id: 'well-2', title: 'Supplements', description: 'Take collagen peptides and omega-3 capsules.', timeOfDay: 'am', productSuggestion: 'collagen-glow' },
      { id: 'well-3', title: 'Mindful Movement', description: 'Five minutes of mindful stretching or a brisk outdoor walk.' },
      { id: 'well-4', title: 'Wind Down Tea', description: 'Calming chamomile and herbal tea before bed.', timeOfDay: 'pm', productSuggestion: 'calm-tea' },
    ],
  },
];

export const allRoutineSteps = routines.flatMap((r) => r.steps);

export const initialProgressPhotos: ProgressPhoto[] = [
  {
    id: 'photo-1',
    date: '2026-09-12',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
    tag: 'Bare Skin',
    skinScore: 6,
    notes: 'Day 1 starting the Lumi Morning Glow & Retinol regimen. Noticeable redness around nose and mild dullness.',
    concernsTracked: ['Dullness', 'Dryness']
  },
  {
    id: 'photo-2',
    date: '2026-09-26',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    tag: 'Progress',
    skinScore: 8,
    notes: 'Week 2 check-in. The Vitamin C + SPF combination is visibly brightening my forehead and cheekbones.',
    concernsTracked: ['Dullness']
  },
  {
    id: 'photo-3',
    date: '2026-10-10',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    tag: 'AM',
    skinScore: 9,
    notes: 'Month 1 milestone! Skin texture is so smooth and radiant. Zero dry flakes even with retinol.',
    concernsTracked: ['Dryness', 'Aging', 'Dullness']
  }
];

export const avatarOptions = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=faces',
];
