import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  BookOpen,
  Sparkles,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  RotateCcw,
  Search,
  Upload,
  X,
  TrendingUp,
  Settings,
  Quote,
  Eye,
  Star,
  Globe,
  Sliders,
  Sun,
  Bell,
  CheckCircle2,
  Save,
  Lock,
  LogOut,
  Key,
  EyeOff,
  Users,
  ShoppingBag,
  MessageSquare,
  Bug,
  Lightbulb,
} from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '../hooks/useProducts';
import { useGuides } from '../hooks/useGuides';
import { useSiteSettings, SiteSettings } from '../hooks/useSiteSettings';
import { useAffirmations } from '../hooks/useAffirmations';
import { useGlowingMembers } from '../hooks/useGlowingMembers';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Product, Guide, CategoryId, ProductReview } from '../types';
import { Affirmation } from '../data/affirmations';
import { UserFeedbackEntry } from '../components/FeedbackModal';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { BrandLogo } from '../components/BrandLogo';
import { cn } from '../utils/cn';

const sampleImages = [
  { label: 'Skincare Dropper', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80' },
  { label: 'Hair Care Bottles', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Wellness Ritual', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80' },
  { label: 'Radiant Hero', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80' },
  { label: 'Foam Cleanser', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80' },
  { label: 'Hair Oil Dropper', url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80' },
  { label: 'Volume Shampoo', url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80' },
  { label: 'Collagen Powder', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80' },
];

export function AdminPage() {
  const { allProducts, addProduct, updateProduct, deleteProduct, resetProducts } = useProducts();
  const { allGuides, addGuide, updateGuide, deleteGuide, resetGuides } = useGuides();
  const { siteSettings, updateSiteSettings, resetSiteSettings } = useSiteSettings();
  const {
    affirmations,
    addAffirmation,
    updateAffirmation,
    deleteAffirmation,
    resetAffirmations,
  } = useAffirmations();
  const {
    members,
    resetMembers,
  } = useGlowingMembers();

  const [feedbackList] = useLocalStorage<UserFeedbackEntry[]>(
    'lumie.user_feedback',
    []
  );

  const [adminAuth, setAdminAuth] = useLocalStorage<{
    isAuthenticated: boolean;
    username: string;
  }>('lumie.admin_session', { isAuthenticated: false, username: '' });

  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'guides' | 'ratings' | 'members' | 'feedback' | 'site-settings' | 'affirmations'
  >('overview');

  const [productSearch, setProductSearch] = useState('');
  const [guideSearch, setGuideSearch] = useState('');

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
  const [affModalOpen, setAffModalOpen] = useState(false);
  const [editingAff, setEditingAff] = useState<Affirmation | null>(null);

  // Product Form State
  const [pName, setPName] = useState('');
  const [pBrand, setPBrand] = useState('Aurélia');
  const [pCategory, setPCategory] = useState<CategoryId>('skincare');
  const [pPrice, setPPrice] = useState<number>(38);
  const [pVolume, setPVolume] = useState('50 ml / 1.7 fl. oz.');
  const [pImage, setPImage] = useState(sampleImages[0].url);
  const [pDescription, setPDescription] = useState('');
  const [pRoutineStep, setPRoutineStep] = useState<Product['routineStep']>('Treat');
  const [pConcerns, setPConcerns] = useState<string[]>(['Dullness']);
  const [pFeatured, setPFeatured] = useState(false);
  const [pIngredientsText, setPIngredientsText] = useState('Aqua, Glycerin, Sodium Hyaluronate, Niacinamide, Tocopherol');
  const [pHowToUse, setPHowToUse] = useState('Apply 2-3 drops to clean skin morning and evening.');
  const [pAliexpressUrl, setPAliexpressUrl] = useState('');

  // Guide Form State
  const [gTitle, setGTitle] = useState('');
  const [gCategory, setGCategory] = useState<CategoryId>('skincare');
  const [gAuthor, setGAuthor] = useState('Dr. Lena Park');
  const [gReadTime, setGReadTime] = useState(5);
  const [gImage, setGImage] = useState(sampleImages[0].url);
  const [gExcerpt, setGExcerpt] = useState('');
  const [gContent, setGContent] = useState('');
  const [gTakeaways, setGTakeaways] = useState<string[]>(['Consistent daily care beats intensity']);
  const [gTakeawayInput, setGTakeawayInput] = useState('');

  // Affirmation Form State
  const [affQuote, setAffQuote] = useState('');
  const [affAuthor, setAffAuthor] = useState('Lumi Wellness Editor');
  const [affTheme, setAffTheme] = useState<Affirmation['theme']>('Radiance');
  const [affTip, setAffTip] = useState('');

  // Site Settings Local Form State
  const [siteForm, setSiteForm] = useState<SiteSettings>(siteSettings);
  const [newBullet, setNewBullet] = useState('');

  useEffect(() => {
    setSiteForm(siteSettings);
  }, [siteSettings]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = loginUser.trim();
    const p = loginPass.trim();
    if (
      u.toLowerCase() === 'admin' &&
      (p === 'lumie2025' || p === 'glowadmin' || p === 'admin123' || p === 'admin')
    ) {
      setAdminAuth({ isAuthenticated: true, username: u });
      setLoginError('');
      toast.success('Welcome back, Administrator!');
    } else {
      setLoginError('Invalid username or password. Please use admin / lumie2025.');
      toast.error('Authentication failed');
    }
  };

  const handleFillDemoCredentials = () => {
    setLoginUser('admin');
    setLoginPass('lumie2025');
    setLoginError('');
  };

  const handleAdminLogout = () => {
    setAdminAuth({ isAuthenticated: false, username: '' });
    toast.info('Signed out of Admin Panel');
  };

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setPName('');
    setPBrand('Aurélia');
    setPCategory('skincare');
    setPPrice(38);
    setPVolume('50 ml / 1.7 fl. oz.');
    setPImage(sampleImages[0].url);
    setPDescription('');
    setPRoutineStep('Treat');
    setPConcerns(['Dullness']);
    setPFeatured(false);
    setPIngredientsText('Aqua, Glycerin, Sodium Hyaluronate, Niacinamide, Tocopherol');
    setPHowToUse('Apply 2-3 drops to clean skin morning and evening.');
    setPAliexpressUrl('');
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setPName(prod.name);
    setPBrand(prod.brand);
    setPCategory(prod.category);
    setPPrice(prod.price);
    setPVolume(prod.volume || '50 ml');
    setPImage(prod.image);
    setPDescription(prod.description);
    setPRoutineStep(prod.routineStep || 'Treat');
    setPConcerns(prod.concerns || ['Glow']);
    setPFeatured(!!prod.featured);
    setPIngredientsText(prod.ingredients?.join(', ') || 'Aqua, Glycerin, Sodium Hyaluronate');
    setPHowToUse(prod.howToUse || 'Apply morning and evening.');
    setPAliexpressUrl(prod.aliexpressUrl || '');
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) {
      toast.error('Please enter product name');
      return;
    }
    const ingredients = pIngredientsText
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    const aliexpressUrlVal = pAliexpressUrl.trim() || undefined;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: pName.trim(),
        brand: pBrand.trim(),
        category: pCategory,
        price: Number(pPrice) || 20,
        volume: pVolume.trim(),
        image: pImage,
        description: pDescription.trim(),
        routineStep: pRoutineStep,
        concerns: pConcerns,
        featured: pFeatured,
        ingredients,
        howToUse: pHowToUse.trim(),
        aliexpressUrl: aliexpressUrlVal,
      });
      toast.success(`Updated ${pName}!`);
    } else {
      addProduct({
        name: pName.trim(),
        brand: pBrand.trim(),
        category: pCategory,
        price: Number(pPrice) || 20,
        volume: pVolume.trim(),
        image: pImage,
        description: pDescription.trim(),
        routineStep: pRoutineStep,
        concerns: pConcerns,
        featured: pFeatured,
        ingredients,
        howToUse: pHowToUse.trim(),
        rating: 5.0,
        reviews: 1,
        aliexpressUrl: aliexpressUrlVal,
      });
      toast.success(`Published new product: ${pName}!`);
    }
    setProductModalOpen(false);
  };

  const handleOpenNewGuide = () => {
    setEditingGuide(null);
    setGTitle('');
    setGCategory('skincare');
    setGAuthor('Dr. Lena Park');
    setGReadTime(5);
    setGImage(sampleImages[0].url);
    setGExcerpt('');
    setGContent('');
    setGTakeaways(['Consistent daily care beats intensity']);
    setGTakeawayInput('');
    setGuideModalOpen(true);
  };

  const handleOpenEditGuide = (guide: Guide) => {
    setEditingGuide(guide);
    setGTitle(guide.title);
    setGCategory(guide.category);
    setGAuthor(guide.author);
    setGReadTime(guide.readTime);
    setGImage(guide.image);
    setGExcerpt(guide.excerpt);
    setGContent(guide.content.join('\n\n'));
    setGTakeaways(guide.takeaways || []);
    setGTakeawayInput('');
    setGuideModalOpen(true);
  };

  const handleSaveGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gTitle.trim() || !gExcerpt.trim() || !gContent.trim()) {
      toast.error('Please enter title, excerpt, and content.');
      return;
    }
    const paragraphs = gContent
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    if (editingGuide) {
      updateGuide(editingGuide.id, {
        title: gTitle.trim(),
        category: gCategory,
        author: gAuthor.trim(),
        readTime: Number(gReadTime) || 4,
        image: gImage,
        excerpt: gExcerpt.trim(),
        content: paragraphs.length ? paragraphs : [gContent.trim()],
        takeaways: gTakeaways,
      });
      toast.success(`Updated blog: ${gTitle}!`);
    } else {
      addGuide({
        title: gTitle.trim(),
        category: gCategory,
        author: gAuthor.trim(),
        readTime: Number(gReadTime) || 4,
        image: gImage,
        excerpt: gExcerpt.trim(),
        content: paragraphs.length ? paragraphs : [gContent.trim()],
        takeaways: gTakeaways,
        tags: ['Guide', 'Wellness'],
      });
      toast.success(`Published new blog: ${gTitle}!`);
    }
    setGuideModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        toast.error('Image must be under 8MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setter(reader.result as string);
        toast.success('Custom photo loaded');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenNewAffirmation = () => {
    setEditingAff(null);
    setAffQuote('');
    setAffAuthor('Lumi Wellness Editor');
    setAffTheme('Radiance');
    setAffTip('');
    setAffModalOpen(true);
  };

  const handleOpenEditAffirmation = (aff: Affirmation) => {
    setEditingAff(aff);
    setAffQuote(aff.quote);
    setAffAuthor(aff.author);
    setAffTheme(aff.theme);
    setAffTip(aff.tip || '');
    setAffModalOpen(true);
  };

  const handleSaveAffirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!affQuote.trim()) {
      toast.error('Please enter a quote');
      return;
    }
    if (editingAff) {
      updateAffirmation(editingAff.id, {
        quote: affQuote.trim(),
        author: affAuthor.trim() || 'Lumi Wellness Editor',
        theme: affTheme,
        tip: affTip.trim() || undefined,
      });
      toast.success('Affirmation updated!');
    } else {
      addAffirmation({
        quote: affQuote.trim(),
        author: affAuthor.trim() || 'Lumi Wellness Editor',
        theme: affTheme,
        tip: affTip.trim() || undefined,
      });
      toast.success('New affirmation added to rotation!');
    }
    setAffModalOpen(false);
  };

  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(siteForm);
    toast.success('Site-wide settings updated successfully! Live across entire site.');
  };

  const handleResetSiteSettings = () => {
    if (window.confirm('Reset all site appearance and content to default values?')) {
      resetSiteSettings();
      toast.success('Site content restored to default');
    }
  };

  const handleAddMorningBullet = () => {
    if (newBullet.trim()) {
      setSiteForm((prev) => ({
        ...prev,
        morningSection: {
          ...prev.morningSection,
          bullets: [...prev.morningSection.bullets, newBullet.trim()],
        },
      }));
      setNewBullet('');
    }
  };

  const handleRemoveMorningBullet = (index: number) => {
    setSiteForm((prev) => ({
      ...prev,
      morningSection: {
        ...prev.morningSection,
        bullets: prev.morningSection.bullets.filter((_, i) => i !== index),
      },
    }));
  };

  const filteredProducts = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredGuides = allGuides.filter(
    (g) =>
      g.title.toLowerCase().includes(guideSearch.toLowerCase()) ||
      g.author.toLowerCase().includes(guideSearch.toLowerCase()) ||
      g.category.toLowerCase().includes(guideSearch.toLowerCase())
  );

  const allProductReviews = useMemo(() => {
    const list: (ProductReview & { productId: string; productName: string; productImage: string })[] = [];
    allProducts.forEach((prod) => {
      if (prod.userReviews && prod.userReviews.length > 0) {
        prod.userReviews.forEach((rev) => {
          list.push({
            ...rev,
            productId: prod.id,
            productName: prod.name,
            productImage: prod.image,
          });
        });
      }
    });
    return list;
  }, [allProducts]);

  if (!adminAuth.isAuthenticated) {
    return (
      <div className="container-wide py-16 flex items-center justify-center min-h-[75vh]">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-soft">
          <div className="flex flex-col items-center text-center">
            <BrandLogo size="lg" />
            <div className="mt-4 flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Lock className="h-3.5 w-3.5" />
              <span>Restricted Access Control</span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold text-foreground">
              Administrator Sign In
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter your credentials to manage products, buy links, user feedback, and site content.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Username
              </label>
              <input
                type="text"
                required
                value={loginUser}
                onChange={(e) => {
                  setLoginUser(e.target.value);
                  setLoginError('');
                }}
                placeholder="admin"
                className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPass}
                  onChange={(e) => {
                    setLoginPass(e.target.value);
                    setLoginError('');
                  }}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 pr-10 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="rounded-xl bg-destructive/10 p-3 text-xs font-semibold text-destructive">
                {loginError}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full">
              <Key className="h-4 w-4 mr-2" /> Sign In to Admin Panel
            </Button>
          </form>

          <div className="mt-6 rounded-2xl border border-border bg-secondary/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold uppercase tracking-wider text-primary">
                Administrator Credentials
              </span>
              <button
                type="button"
                onClick={handleFillDemoCredentials}
                className="text-2xs font-semibold text-primary underline hover:text-primary/80 cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
            <div className="mt-2 text-xs space-y-1 text-foreground/80 font-mono">
              <div>Username: <span className="font-bold text-foreground">admin</span></div>
              <div>Password: <span className="font-bold text-foreground">lumie2025</span></div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
              ← Return to Lumi Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-wide py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Settings className="h-4 w-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Control Center
            </span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Lumi Admin Panel
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage product catalog, verify buy links, view customer feedback, and customize site appearance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Admin: {adminAuth.username || 'admin'}</span>
          </div>
          <Link to="/" target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> View Live Site
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAdminLogout}
            className="text-muted-foreground hover:text-destructive cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sign Out
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.confirm('Reset all products and guides to initial sample data?')) {
                resetProducts();
                resetGuides();
                resetMembers();
                toast.success('Reset site content to default state');
              }
            }}
            className="text-muted-foreground hover:text-destructive"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reset Defaults
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex border-b border-border overflow-x-auto">
        {[
          { id: 'overview', label: 'Dashboard', icon: <TrendingUp className="h-4 w-4 mr-2" /> },
          { id: 'products', label: `Products (${allProducts.length})`, icon: <Package className="h-4 w-4 mr-2" /> },
          { id: 'guides', label: `Guides (${allGuides.length})`, icon: <BookOpen className="h-4 w-4 mr-2" /> },
          { id: 'ratings', label: `Reviews (${allProductReviews.length})`, icon: <Star className="h-4 w-4 mr-2" /> },
          { id: 'feedback', label: `User Feedback (${feedbackList.length})`, icon: <MessageSquare className="h-4 w-4 mr-2" /> },
          { id: 'members', label: `Members (${members.length})`, icon: <Users className="h-4 w-4 mr-2" /> },
          { id: 'site-settings', label: 'Appearance & Copy', icon: <Sliders className="h-4 w-4 mr-2" /> },
          { id: 'affirmations', label: `Affirmations (${affirmations.length})`, icon: <Quote className="h-4 w-4 mr-2" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center border-b-2 px-5 py-3.5 font-display text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="mt-8 space-y-8 animate-fade-up">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Catalog Products</span>
                <Package className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-3 font-display text-3xl font-semibold text-foreground">
                {allProducts.length}
              </p>
              <p className="text-xs text-muted-foreground">Across Skincare, Haircare, Wellness</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Customer Feedback</span>
                <MessageSquare className="h-5 w-5 text-sky-500" />
              </div>
              <p className="mt-3 font-display text-3xl font-semibold text-foreground">
                {feedbackList.length}
              </p>
              <p className="text-xs text-muted-foreground">Bug reports & feature requests</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Verified Reviews</span>
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              </div>
              <p className="mt-3 font-display text-3xl font-semibold text-foreground">
                {allProductReviews.length}
              </p>
              <p className="text-xs text-muted-foreground">Star ratings on products</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Editorial Guides</span>
                <BookOpen className="h-5 w-5 text-accent" />
              </div>
              <p className="mt-3 font-display text-3xl font-semibold text-foreground">
                {allGuides.length}
              </p>
              <p className="text-xs text-muted-foreground">Published articles</p>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h3 className="font-display text-xl font-semibold text-foreground">Quick Management Actions</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button onClick={() => { setActiveTab('products'); handleOpenNewProduct(); }}>
                <Plus className="h-4 w-4 mr-1.5" /> Upload Product
              </Button>
              <Button onClick={() => { setActiveTab('guides'); handleOpenNewGuide(); }} variant="secondary">
                <Plus className="h-4 w-4 mr-1.5" /> Publish Blog Guide
              </Button>
              <Button onClick={() => setActiveTab('feedback')} variant="outline">
                <MessageSquare className="h-4 w-4 mr-1.5" /> Review Feedback ({feedbackList.length})
              </Button>
              <Button onClick={() => setActiveTab('site-settings')} variant="ghost">
                <Sliders className="h-4 w-4 mr-1.5" /> Site Appearance
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRODUCTS */}
      {activeTab === 'products' && (
        <div className="mt-8 space-y-6 animate-fade-up">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by name, brand..."
                className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-4 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <Button onClick={handleOpenNewProduct}>
              <Plus className="h-4 w-4 mr-1.5" /> Upload New Product
            </Button>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-secondary/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Routine Step</th>
                    <th className="py-3.5 px-4">Buy Link</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="h-11 w-11 rounded-xl object-cover flex-shrink-0" />
                          <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              {p.brand}
                            </span>
                            <Link to={`/products/${p.id}`} className="block font-display font-semibold text-foreground hover:text-primary transition-colors">
                              {p.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge>{p.category}</Badge>
                      </td>
                      <td className="py-3 px-4 font-semibold text-primary">
                        ${p.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-foreground">
                        {p.routineStep || 'Daily step'}
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={p.aliexpressUrl || `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(p.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
                        >
                          <ShoppingBag className="h-3 w-3" />
                          <span>Buy link active</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/products/${p.id}`} target="_blank" className="p-1.5 text-muted-foreground hover:text-foreground" title="View live">
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 text-muted-foreground hover:text-primary cursor-pointer"
                            title="Edit product"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete "${p.name}"?`)) {
                                deleteProduct(p.id);
                                toast.info(`Deleted ${p.name}`);
                              }
                            }}
                            className="p-1.5 text-muted-foreground hover:text-destructive cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. GUIDES */}
      {activeTab === 'guides' && (
        <div className="mt-8 space-y-6 animate-fade-up">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={guideSearch}
                onChange={(e) => setGuideSearch(e.target.value)}
                placeholder="Search articles by title, author..."
                className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-4 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <Button onClick={handleOpenNewGuide}>
              <Plus className="h-4 w-4 mr-1.5" /> Write New Blog
            </Button>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-secondary/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-3.5 px-4">Article Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Author</th>
                    <th className="py-3.5 px-4">Read Time</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredGuides.map((g) => (
                    <tr key={g.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={g.image} alt={g.title} className="h-11 w-14 rounded-xl object-cover flex-shrink-0" />
                          <div className="min-w-0 max-w-md">
                            <Link to={`/guides/${g.id}`} className="font-display font-semibold text-foreground hover:text-primary transition-colors block truncate">
                              {g.title}
                            </Link>
                            <p className="text-xs text-muted-foreground truncate">{g.excerpt}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge>{g.category}</Badge>
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-foreground">
                        {g.author}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {g.readTime} min
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/guides/${g.id}`} target="_blank" className="p-1.5 text-muted-foreground hover:text-foreground" title="View article">
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEditGuide(g)}
                            className="p-1.5 text-muted-foreground hover:text-primary cursor-pointer"
                            title="Edit guide"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete blog "${g.title}"?`)) {
                                deleteGuide(g.id);
                                toast.info(`Deleted ${g.title}`);
                              }
                            }}
                            className="p-1.5 text-muted-foreground hover:text-destructive cursor-pointer"
                            title="Delete guide"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. USER FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="mt-8 space-y-6 animate-fade-up">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">
                User Feedback & Bug Reports ({feedbackList.length})
              </h3>
              <p className="text-xs text-muted-foreground">
                Inquiries and bug submissions captured via the floating Feedback button.
              </p>
            </div>
          </div>

          {feedbackList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="mt-3 font-semibold text-foreground">No feedback submissions yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Submissions from the feedback modal will automatically appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {feedbackList.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                        item.category === 'bug'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : item.category === 'feature'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-primary/10 text-primary'
                      )}>
                        {item.category === 'bug' ? 'Bug Report' : item.category === 'feature' ? 'Feature Idea' : item.category}
                      </span>
                      {item.rating && (
                        <span className="text-xs text-amber-500 font-bold">
                          ★ {item.rating}/5
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        by {item.userName || 'Anonymous'}
                      </span>
                      {item.userEmail && (
                        <span className="text-xs text-muted-foreground font-mono">
                          ({item.userEmail})
                        </span>
                      )}
                    </div>
                    <span className="text-2xs text-muted-foreground font-mono">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <h4 className="font-display text-base font-semibold text-foreground">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. RATINGS */}
      {activeTab === 'ratings' && (
        <div className="mt-8 space-y-6 animate-fade-up">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold text-foreground">
              Product Reviews & Star Ratings ({allProductReviews.length})
            </h3>
          </div>
          <div className="space-y-3">
            {allProductReviews.map((rev) => (
              <div key={rev.id} className="rounded-2xl border border-border bg-card p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-500">★ {rev.rating}</span>
                    <span className="font-semibold text-foreground">{rev.author}</span>
                    <span className="text-xs text-muted-foreground font-medium">on {rev.productName}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{rev.date}</span>
                </div>
                <h4 className="font-display text-sm font-semibold text-foreground">{rev.title}</h4>
                <p className="text-xs text-muted-foreground">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. APPEARANCE & SITE SETTINGS */}
      {activeTab === 'site-settings' && (
        <form onSubmit={handleSaveSiteSettings} className="mt-8 space-y-8 animate-fade-up">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                <Sliders className="h-5 w-5 text-primary" /> Whole Site Content & Appearance Customizer
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Edit branding, announcement banners, hero headlines, and category descriptions.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleResetSiteSettings}>
                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset to Defaults
              </Button>
              <Button type="submit" size="md">
                <Save className="h-4 w-4 mr-1.5" /> Save All Site Changes
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Globe className="h-3.5 w-3.5" /> Brand Identity
            </span>
            <h4 className="font-display text-lg font-semibold text-foreground">
              Site Brand & Header Name
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={siteForm.brandName}
                  onChange={(e) => setSiteForm((prev) => ({ ...prev, brandName: e.target.value }))}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-primary text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={siteForm.brandTagline}
                  onChange={(e) => setSiteForm((prev) => ({ ...prev, brandTagline: e.target.value }))}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary text-foreground"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={handleResetSiteSettings}>
              Reset to Defaults
            </Button>
            <Button type="submit" size="lg">
              <Save className="h-4 w-4 mr-1.5" /> Save All Site Changes
            </Button>
          </div>
        </form>
      )}

      {/* 7. AFFIRMATIONS */}
      {activeTab === 'affirmations' && (
        <div className="mt-8 space-y-6 animate-fade-up">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground">
                Daily Wellness Affirmations Pool ({affirmations.length})
              </h3>
            </div>
            <Button onClick={handleOpenNewAffirmation}>
              <Plus className="h-4 w-4 mr-1.5" /> Add New Affirmation
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {affirmations.map((aff) => (
              <div key={aff.id} className="relative group rounded-2xl border border-border bg-card p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                    {aff.theme}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{aff.author}</span>
                    <button
                      type="button"
                      onClick={() => handleOpenEditAffirmation(aff)}
                      className="p-1 text-muted-foreground hover:text-primary cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Delete this affirmation?')) {
                          deleteAffirmation(aff.id);
                          toast.info('Affirmation deleted');
                        }
                      }}
                      className="p-1 text-muted-foreground hover:text-destructive cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="font-display text-base font-normal italic text-foreground leading-relaxed">
                  "{aff.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCT MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-ink/60 backdrop-blur-xs" onClick={() => setProductModalOpen(false)} />
          <div className="relative z-10 my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-border bg-card p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setProductModalOpen(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-display text-2xl font-semibold text-foreground">
              {editingProduct ? `Edit ${editingProduct.name}` : 'Upload New Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="e.g. Radiance Vitamin C Serum"
                    className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={pBrand}
                    onChange={(e) => setPBrand(e.target.value)}
                    placeholder="e.g. Aurélia"
                    className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Category
                  </label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value as CategoryId)}
                    className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                  >
                    <option value="skincare">Skincare</option>
                    <option value="haircare">Haircare</option>
                    <option value="wellness">Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Volume / Size
                  </label>
                  <input
                    type="text"
                    value={pVolume}
                    onChange={(e) => setPVolume(e.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Direct Buy Link / AliExpress URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={pAliexpressUrl}
                    onChange={(e) => setPAliexpressUrl(e.target.value)}
                    placeholder="e.g. https://www.aliexpress.com/item/10050012345.html"
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Product Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="ghost" onClick={() => setProductModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="lg">
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GUIDE MODAL */}
      {guideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-ink/60 backdrop-blur-xs" onClick={() => setGuideModalOpen(false)} />
          <div className="relative z-10 my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-border bg-card p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setGuideModalOpen(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-display text-2xl font-semibold text-foreground">
              {editingGuide ? `Edit ${editingGuide.title}` : 'Write New Blog'}
            </h3>

            <form onSubmit={handleSaveGuide} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={gTitle}
                  onChange={(e) => setGTitle(e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Excerpt *
                </label>
                <textarea
                  required
                  rows={2}
                  value={gExcerpt}
                  onChange={(e) => setGExcerpt(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Content *
                </label>
                <textarea
                  required
                  rows={5}
                  value={gContent}
                  onChange={(e) => setGContent(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="ghost" onClick={() => setGuideModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="lg">
                  {editingGuide ? 'Save Changes' : 'Publish Article'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
