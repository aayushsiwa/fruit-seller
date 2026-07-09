import { currency } from '@/constants/index';
import { categories, sortOptions } from '@/constants/productsPage';
import { useGetProducts } from '@/lib/api/products/getProducts';
import { IProduct } from '@/types/index';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export type ProductsPageHooks = {
  products: IProduct[];
  filteredProducts: IProduct[];
  priceRange: [number, number];
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  minPrice: number;
  maxPrice: number;
  sortOption: string;
  setSortOption: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  inStockOnly: boolean;
  setInStockOnly: React.Dispatch<React.SetStateAction<boolean>>;
  openFilterDialog: boolean;
  setOpenFilterDialog: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  error: string | null;
  handleResetFilters: () => void;
  getFilterSummary: () => string[];
  categories: typeof categories;
  sortOptions: typeof sortOptions;
};

export const useProductsPage = (): ProductsPageHooks => {
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [sortOption, setSortOption] = useState('none');
  const [category, setCategory] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  const { data: response, isLoading, error } = useGetProducts();
  const data = response?.data?.products;

  useEffect(() => {
    if (data?.length) {
      setProducts(data);
      const prices = data.map((p) => p.price);
      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));
      setMinPrice(min);
      setMaxPrice(max);
      setPriceRange([min, max]);
    }
  }, [data]);

  useEffect(() => {
    let filtered = [...products];

    const searchQuery = router.query.search as string;
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search)
      );
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (inStockOnly) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    switch (sortOption) {
      case 'discounted':
        filtered = filtered
          .filter((p) => p.discount > 0)
          .sort((a, b) => b.discount - a.discount);
        break;
      case 'new':
        const recent = new Date();
        recent.setDate(recent.getDate() - 14);
        filtered = filtered
          .filter((p) => new Date(p.createdAt) >= recent)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        break;
      case 'seasonal':
        filtered = filtered
          .filter((p) => p.isSeasonal)
          .sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredProducts(filtered);
  }, [
    priceRange,
    category,
    sortOption,
    inStockOnly,
    products,
    router.query.search,
  ]);

  const handleResetFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setCategory('all');
    setSortOption('none');
    setInStockOnly(false);
  };

  const getFilterSummary = () => {
    const filters: string[] = [];
    if (priceRange[0] !== minPrice || priceRange[1] !== maxPrice)
      filters.push(
        `Price: ${currency}${priceRange[0]} - ${currency}${priceRange[1]}`
      );
    if (category !== 'all') filters.push(`Category: ${category}`);
    if (sortOption !== 'none')
      filters.push(
        `Sort: ${sortOptions.find((o) => o.value === sortOption)?.label}`
      );
    if (inStockOnly) filters.push('In Stock Only');
    return filters;
  };

  return {
    products,
    filteredProducts,
    priceRange,
    setPriceRange,
    minPrice,
    maxPrice,
    sortOption,
    setSortOption,
    category,
    setCategory,
    inStockOnly,
    setInStockOnly,
    openFilterDialog,
    setOpenFilterDialog,
    isLoading,
    error: error ? (typeof error === 'string' ? error : error.message) : null,
    handleResetFilters,
    getFilterSummary,
    categories,
    sortOptions,
  };
};
