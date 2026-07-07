import React from "react";
import { render, screen } from "@testing-library/react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ItemType, UseProductDetailReturn } from "@/types/index";

jest.mock("framer-motion", () => {
    const MotionDiv = ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
        <div {...props}>{children}</div>
    );
    MotionDiv.displayName = "motion.div";
    const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;
    AnimatePresence.displayName = "AnimatePresence";
    return {
        motion: {
            div: MotionDiv,
        },
        AnimatePresence,
    };
});

jest.mock("next/router", () => ({
    useRouter: jest.fn(() => ({
        query: { id: "1" },
        push: jest.fn(),
    })),
}));

jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn(),
}));

const mockAddToCart = jest.fn();
const mockUpdateQuantity = jest.fn();
const mockRemoveFromCart = jest.fn();

jest.mock("@/src/contexts/CartContext", () => ({
    useCart: jest.fn(() => ({
        cart: [],
        addToCart: mockAddToCart,
        updateQuantity: mockUpdateQuantity,
        removeFromCart: mockRemoveFromCart,
    })),
}));

jest.mock("axios");

jest.mock("@mui/styles", () => ({
    makeStyles: jest.fn(() => jest.fn(() => ({}))),
}));

jest.mock("@/src/components/LoadingScreen", () => ({
    LoadingScreen: () => <div data-testid="loading-screen">Loading...</div>,
}));

jest.mock("@/src/components/ProductDetail/BreadcrumbsNav", () => ({
    BreadcrumbsNav: ({ productName }: { productName: string }) => (
        <div data-testid="breadcrumbs-nav">{productName}</div>
    ),
}));

jest.mock("@/src/components/ProductDetail/ProductInfo", () => ({
    ProductInfo: () => (
        <div data-testid="product-info">Product Info</div>
    ),
}));

jest.mock("@/src/components/ProductDetail/RelatedProducts", () => ({
    RelatedProducts: ({ relatedProducts }: { relatedProducts: ItemType[] }) => (
        <div data-testid="related-products">
            {relatedProducts.length} related product(s)
        </div>
    ),
}));

jest.mock("./ProductDetail.hooks", () => ({
    useProductDetail: jest.fn(),
}));

import { useQuery } from "@tanstack/react-query";
import { useProductDetail } from "./ProductDetail.hooks";
import ProductDetail from "./ProductDetail";

const theme = createTheme();

const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const mockProduct: ItemType = {
    id: "1",
    name: "Apple",
    price: 50,
    quantity: 20,
    image: "/apple.jpg",
    description: "Fresh apple from farm",
    category: "fruits",
    discount: 5,
    isSeasonal: false,
    createdAt: "2025-01-01T00:00:00Z",
};

const mockRelatedProducts: ItemType[] = [
    {
        id: "2",
        name: "Banana",
        price: 30,
        quantity: 10,
        image: "/banana.jpg",
        description: "Fresh banana",
        category: "fruits",
        discount: 0,
        isSeasonal: false,
        createdAt: "2025-01-01T00:00:00Z",
    },
];

const defaultHookReturn: UseProductDetailReturn = {
    product: mockProduct,
    isLoadingProduct: false,
    relatedProducts: mockRelatedProducts,
    cartQuantity: 0,
    error: null,
    setError: jest.fn(),
    snackbar: { open: false, message: "", severity: "success" },
    handleCloseSnackbar: jest.fn(),
    handleAddToCart: jest.fn(),
    handleQuantityChange: jest.fn(),
    handleShare: jest.fn(),
    isMobile: false,
};

describe("ProductDetail - Hooks", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch product by id from query", async () => {
        const useQueryMock = useQuery as jest.Mock;
        useQueryMock
            .mockReturnValue({ data: undefined, isLoading: false })
            .mockReturnValueOnce({ data: mockProduct, isLoading: false })
            .mockReturnValueOnce({
                data: mockRelatedProducts,
                isLoading: false,
            });

        const realHook = jest.requireActual(
            "./ProductDetail.hooks"
        ).useProductDetail;
        const { result } = renderHook(() => realHook());

        await waitFor(() => {
            expect(result.current.product).toEqual(mockProduct);
        });

        expect(result.current.isLoadingProduct).toBe(false);
        expect(result.current.relatedProducts).toEqual(mockRelatedProducts);
    });

    it("should add to cart on handleAddToCart", async () => {
        const useQueryMock = useQuery as jest.Mock;
        useQueryMock
            .mockReturnValue({ data: undefined, isLoading: false })
            .mockReturnValueOnce({
                data: { ...mockProduct, quantity: 5 },
                isLoading: false,
            })
            .mockReturnValueOnce({
                data: mockRelatedProducts,
                isLoading: false,
            });

        const realHook = jest.requireActual(
            "./ProductDetail.hooks"
        ).useProductDetail;
        const { result } = renderHook(() => realHook());

        await waitFor(() => {
            expect(result.current.product).toBeDefined();
        });

        act(() => {
            result.current.handleAddToCart();
        });

        expect(mockAddToCart).toHaveBeenCalled();
        expect(result.current.error).toBeNull();
    });

    it("should set error when adding out-of-stock product", async () => {
        const useQueryMock = useQuery as jest.Mock;
        useQueryMock
            .mockReturnValue({ data: undefined, isLoading: false })
            .mockReturnValueOnce({
                data: { ...mockProduct, quantity: 0 },
                isLoading: false,
            })
            .mockReturnValueOnce({
                data: mockRelatedProducts,
                isLoading: false,
            });

        const realHook = jest.requireActual(
            "./ProductDetail.hooks"
        ).useProductDetail;
        const { result } = renderHook(() => realHook());

        await waitFor(() => {
            expect(result.current.product).toBeDefined();
        });

        act(() => {
            result.current.handleAddToCart();
        });

        expect(mockAddToCart).not.toHaveBeenCalled();
        expect(result.current.error).toBe(
            "Cannot add to cart: out of stock."
        );
    });

    it("should copy link on handleShare", async () => {
        const writeText = jest.fn().mockResolvedValue(undefined);
        Object.assign(navigator, {
            clipboard: { writeText },
        });

        const useQueryMock = useQuery as jest.Mock;
        useQueryMock
            .mockReturnValue({ data: undefined, isLoading: false })
            .mockReturnValueOnce({ data: mockProduct, isLoading: false })
            .mockReturnValueOnce({
                data: mockRelatedProducts,
                isLoading: false,
            });

        const realHook = jest.requireActual(
            "./ProductDetail.hooks"
        ).useProductDetail;
        const { result } = renderHook(() => realHook());

        await waitFor(() => {
            expect(result.current.product).toBeDefined();
        });

        await act(async () => {
            await result.current.handleShare();
        });

        expect(writeText).toHaveBeenCalled();
        expect(result.current.snackbar.open).toBe(true);
        expect(result.current.snackbar.message).toBe("Link copied to clipboard!");
    });
});

describe("ProductDetail - UI", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render loading state", () => {
        (useProductDetail as jest.Mock).mockReturnValue({
            ...defaultHookReturn,
            product: undefined,
            isLoadingProduct: true,
        });

        renderWithTheme(<ProductDetail />);
        expect(screen.getByTestId("loading-screen")).toBeInTheDocument();
    });

    it("should match snapshot with product data", () => {
        (useProductDetail as jest.Mock).mockReturnValue(defaultHookReturn);

        const { asFragment } = renderWithTheme(<ProductDetail />);
        expect(asFragment()).toMatchSnapshot();
    });
});
