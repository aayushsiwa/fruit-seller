import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { heroSlides } from "@/config";
import axios from "axios";

const fetchFeaturedProducts = async () => {
  const response = await axios.get("/api/products?featured=true");
  if (response.status !== 200) {
    throw new Error("Failed to fetch featured products");
  }
  return response.data;
};

export const useHomePage = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const { data: featuredProducts, isLoading, error } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: fetchFeaturedProducts,
  });

  return {
    router,
    currentSlide,
    setCurrentSlide,
    featuredProducts,
    isLoading,
    error,
  };
};