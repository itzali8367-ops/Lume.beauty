import { Product } from '../types';
import { products as initialProducts } from '../data/mockData';
import { useLocalStorage } from './useLocalStorage';

export function useProducts() {
  const [allProducts, setAllProducts] = useLocalStorage<Product[]>('lumie.all_products', initialProducts);

  const addProduct = (productData: Omit<Product, 'id'> & { id?: string }) => {
    const slug = (productData.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const newProduct: Product = {
      ...productData,
      id: productData.id || `${slug}-${Date.now().toString().slice(-4)}`,
      reviews: productData.reviews || 0,
      rating: productData.rating || 5.0,
      concerns: productData.concerns || ['Glow'],
    };
    setAllProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setAllProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setAllProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const resetProducts = () => {
    setAllProducts(initialProducts);
  };

  return {
    allProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
  };
}
