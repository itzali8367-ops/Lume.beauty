import { ProductReview } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useProductReviews(productId: string) {
  const [customReviews, setCustomReviews] = useLocalStorage<Record<string, ProductReview[]>>(
    'lumie.product_custom_reviews',
    {}
  );

  const productCustomReviews = customReviews[productId] || [];

  const addReview = (review: Omit<ProductReview, 'id' | 'date'>) => {
    const newRev: ProductReview = {
      ...review,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      verifiedBuyer: true,
    };
    setCustomReviews((prev) => {
      const existing = prev[productId] || [];
      return {
        ...prev,
        [productId]: [newRev, ...existing],
      };
    });
    return newRev;
  };

  return {
    customReviews: productCustomReviews,
    addReview,
  };
}
