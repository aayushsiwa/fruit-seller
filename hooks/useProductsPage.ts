import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ItemType } from "@/types";
import { categories, sortOptions, currency } from "@/config";
import axios from "axios";

const fetchProducts = async (): Promise<ItemType[]> => {
    const response = await axios.get("/api/products");
    if (response.status !== 200) throw new Error("Failed to fetch products");
    return response.data;
};

export const useProductsPage = () => {
    const [products, setProducts] = useState<ItemType[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ItemType[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100);
    const [sortOption, setSortOption] = useState("none");
    const [category, setCategory] = useState("all");
    const [inStockOnly, setInStockOnly] = useState(false);
    const [openFilterDialog, setOpenFilterDialog] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
    });

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

        const searchParams = new URLSearchParams(window.location.search);
        const searchQuery = searchParams.get("search");
        if (searchQuery) {
            const search = searchQuery.toLowerCase();
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(search)
            );
        }

        filtered = filtered.filter(
            (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
        );

        if (category !== "all") {
            filtered = filtered.filter((p) => p.category === category);
        }

        if (inStockOnly) {
            filtered = filtered.filter((p) => p.quantity > 0);
        }

        switch (sortOption) {
            case "discounted":
                filtered = filtered
                    .filter((p) => p.discount > 0)
                    .sort((a, b) => b.discount - a.discount);
                break;
            case "new":
                const recent = new Date();
                recent.setDate(recent.getDate() - 14);
                filtered = filtered
                    .filter((p) => new Date(p.createdAt) >= recent)
                    .sort(
                        (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                    );
                break;
            case "seasonal":
                filtered = filtered
                    .filter((p) => p.isSeasonal)
                    .sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        setFilteredProducts(filtered);
    }, [priceRange, category, sortOption, inStockOnly, products]);

    const handleResetFilters = () => {
        setPriceRange([minPrice, maxPrice]);
        setCategory("all");
        setSortOption("none");
        setInStockOnly(false);
    };

    const getFilterSummary = () => {
        const filters: string[] = [];
        if (priceRange[0] !== minPrice || priceRange[1] !== maxPrice)
            filters.push(
                `Price: ${currency}${priceRange[0]} - ${currency}${priceRange[1]}`
            );
        if (category !== "all") filters.push(`Category: ${category}`);
        if (sortOption !== "none")
            filters.push(
                `Sort: ${
                    sortOptions.find((o) => o.value === sortOption)?.label
                }`
            );
        if (inStockOnly) filters.push("In Stock Only");
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
        error,
        handleResetFilters,
        getFilterSummary,
        categories,
        sortOptions,
    };
};
