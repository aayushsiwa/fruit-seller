import { heroSlides } from '@/constants/home';
import { useGetFeaturedProducts } from '@/lib/api/products/getFeaturedProducts';
import { IProduct } from '@/types/index';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useHomePage = (): UseHomePageReturn => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const { data: response, isLoading, error } = useGetFeaturedProducts();
  const featuredProducts = response?.data?.products || [];

  return {
    router,
    currentSlide,
    setCurrentSlide,
    featuredProducts,
    isLoading,
    error,
  };
};

export type UseHomePageReturn = {
  router: ReturnType<typeof useRouter>;
  currentSlide: number;
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
  featuredProducts: IProduct[];
  isLoading: boolean;
  error: unknown;
};
