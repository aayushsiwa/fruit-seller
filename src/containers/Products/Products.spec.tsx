import { renderHook, act, waitFor } from "@testing-library/react";
import { useProductsPage } from "./Products.hooks";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ItemType } from "@/types/index";

describe("Products - Hooks", () => {
    const mockProducts: ItemType[] = [
        {
            id: "1",
            name: "Grapes",
            price: 100,
            discount: 10,
            quantity: 20,
            image: "/grapes.jpg",
            description: "Fresh Grapes from Nashik.",
            createdAt: "2025-05-01T00:00:00Z",
            category: "berries",
            isSeasonal: true,
        },
        {
            id: "2",
            name: "Apple",
            price: 50,
            discount: 5,
            quantity: 0,
            image: "/apple.jpg",
            description: "Organic Apples from Himachal.",
            createdAt: "2025-05-02T00:00:00Z",
            category: "fruits",
            isSeasonal: false,
        },
    ];

    const createWrapper = () => {
        const queryClient = new QueryClient({});
        const Wrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
        Wrapper.displayName = "QueryClientProviderWrapper";
        return Wrapper;
    };

    let axiosGetSpy: jest.SpyInstance;

    beforeEach(() => {
        axiosGetSpy = jest.spyOn(axios, "get").mockResolvedValue({
            status: 200,
            data: mockProducts,
        });

        Object.defineProperty(window, "location", {
            value: {
                search: "",
            },
            writable: true,
        });
    });

    afterEach(() => {
        axiosGetSpy.mockRestore();
    });

    it("fetches and sets products correctly", async () => {
        const { result } = renderHook(() => useProductsPage(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.products).toHaveLength(2);
        });

        expect(axiosGetSpy).toHaveBeenCalledWith("/api/products");
        expect(axiosGetSpy).toHaveBeenCalledTimes(1);

        expect(result.current.products.length).toBe(2);
        expect(result.current.products[0].name).toBe("Grapes");
        expect(result.current.products[1].name).toBe("Apple");
        expect(result.current.minPrice).toBe(50);
        expect(result.current.maxPrice).toBe(100);
        expect(result.current.isLoading).toBe(false);
    });

    it("applies price range filter correctly", async () => {
        const { result } = renderHook(() => useProductsPage(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.products).toHaveLength(2);
        });

        act(() => {
            result.current.setPriceRange([90, 110]);
        });

        await waitFor(() => {
            expect(result.current.filteredProducts).toHaveLength(1);
        });

        expect(result.current.filteredProducts[0].name).toBe("Grapes");
        expect(axiosGetSpy).toHaveBeenCalledWith("/api/products");
    });

    it("filters by inStockOnly", async () => {
        const { result } = renderHook(() => useProductsPage(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.products).toHaveLength(2);
        });

        act(() => {
            result.current.setInStockOnly(true);
        });

        await waitFor(() => {
            expect(result.current.filteredProducts).toHaveLength(1);
        });

        expect(result.current.filteredProducts[0].name).toBe("Grapes");
        expect(result.current.filteredProducts[0].quantity).toBeGreaterThan(0);
    });

    it("sorts by discounted", async () => {
        const { result } = renderHook(() => useProductsPage(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.products).toHaveLength(2);
        });

        act(() => {
            result.current.setSortOption("discounted");
        });

        await waitFor(() => {
            expect(result.current.filteredProducts.length).toBeGreaterThan(0);
        });

        expect(result.current.filteredProducts).toHaveLength(2);
        expect(result.current.filteredProducts[0].discount).toBe(10);
        expect(result.current.filteredProducts[1].discount).toBe(5);
    });

    it("returns correct filter summary", async () => {
        const { result } = renderHook(() => useProductsPage(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.products).toHaveLength(2);
        });

        act(() => {
            result.current.setInStockOnly(true);
            result.current.setCategory("berries");
            result.current.setSortOption("discounted");
        });

        await waitFor(() => {
            const summary = result.current.getFilterSummary();
            expect(summary.length).toBeGreaterThan(0);
        });

        const summary = result.current.getFilterSummary();

        expect(summary).toEqual(
            expect.arrayContaining([
                expect.stringContaining("Category: berries"),
                expect.stringContaining("Sort: "),
                expect.stringContaining("In Stock Only"),
            ])
        );
        expect(result.current.filteredProducts[0].name).toBe("Grapes");
    });
});
