import { render, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { useCheckout } from "./Checkout.hooks";
import Checkout from "./Checkout";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCart } from "@/src/contexts/CartContext";
import { useQueries } from "@tanstack/react-query";
import { CartItem, ItemType } from "@/types/index";

jest.mock("framer-motion", () => {
    const FakeMotion = ({ children }: { children: React.ReactNode }) => (
        <>{children}</>
    );
    return {
        motion: new Proxy(FakeMotion, {
            get: () => FakeMotion,
        }),
        AnimatePresence: FakeMotion,
    };
});

jest.mock("next/router", () => ({ useRouter: jest.fn() }));
jest.mock("next-auth/react", () => ({
    useSession: jest.fn(),
    signIn: jest.fn(),
}));
jest.mock("@/src/contexts/CartContext", () => ({ useCart: jest.fn() }));
jest.mock("axios");
jest.mock("@tanstack/react-query", () => ({ useQueries: jest.fn() }));

jest.mock("./Checkout.styles", () => ({
    __esModule: true,
    useCheckoutStyles: () => ({}),
}));

jest.mock("@/src/components/LoadingScreen", () => ({
    __esModule: true,
    LoadingScreen: () => <div data-testid="loading-screen" />,
}));

jest.mock("@/src/components/Checkout/OrderSummary", () => ({
    __esModule: true,
    OrderSummary: () => <div data-testid="order-summary" />,
}));

jest.mock("@/src/components/Checkout/EmptyCheckout", () => ({
    __esModule: true,
    EmptyCheckout: () => <div data-testid="empty-checkout" />,
}));

const mockPush = jest.fn();

const defaultCartCtx = {
    cart: [] as CartItem[],
    getCartTotal: jest.fn(),
    clearCart: jest.fn(),
    showSnackbar: jest.fn(),
    loading: false,
};

interface WindowWithRazorpay {
    Razorpay?: jest.Mock;
}

beforeEach(() => {
    (window as unknown as WindowWithRazorpay).Razorpay = jest.fn();
});

afterEach(() => {
    delete (window as unknown as WindowWithRazorpay).Razorpay;
});

function setupDefaultMocks() {
    (useRouter as jest.Mock).mockReturnValue({
        push: mockPush,
        prefetch: jest.fn(),
    });
    (useSession as jest.Mock).mockReturnValue({
        data: null,
        status: "unauthenticated",
    });
    (useCart as jest.Mock).mockReturnValue(defaultCartCtx);
    (useQueries as jest.Mock).mockReturnValue([]);
    jest.clearAllMocks();
    mockPush.mockClear();
}

describe("Checkout - Hooks", () => {
    beforeEach(setupDefaultMocks);

    it("should return default state", () => {
        const { result } = renderHook(() => useCheckout());

        expect(result.current.cart).toEqual([]);
        expect(result.current.products).toEqual([]);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isLoadingProducts).toBe(false);
        expect(result.current.hasError).toBe(false);
        expect(result.current.processing).toBe(false);
        expect(result.current.status).toBe("unauthenticated");
    });

    it("should redirect to login when unauthenticated", () => {
        render(<Checkout />);
        expect(mockPush).toHaveBeenCalledWith("/login");
    });
});

describe("Checkout - UI", () => {
    const mockProducts: ItemType[] = [
        {
            id: "1",
            name: "Apple",
            price: 100,
            quantity: 10,
            image: "apple.jpg",
            description: "Fresh apple",
            category: "Fruit",
            discount: 0,
            isSeasonal: false,
            createdAt: "2025-01-01",
        },
        {
            id: "2",
            name: "Banana",
            price: 50,
            quantity: 20,
            image: "banana.jpg",
            description: "Fresh banana",
            category: "Fruit",
            discount: 5,
            isSeasonal: true,
            createdAt: "2025-01-01",
        },
    ];

    const mockCart: CartItem[] = [
        { id: "1", quantity: 2 },
        { id: "2", quantity: 1 },
    ];

    beforeEach(setupDefaultMocks);

    it("should render loading state", () => {
        (useSession as jest.Mock).mockReturnValue({
            data: null,
            status: "loading",
        });

        render(<Checkout />);
        expect(screen.getByTestId("loading-screen")).toBeInTheDocument();
    });

    it("should match snapshot with products loaded", () => {
        (useSession as jest.Mock).mockReturnValue({
            data: { user: { email: "test@test.com" } },
            status: "authenticated",
        });
        (useCart as jest.Mock).mockReturnValue({
            ...defaultCartCtx,
            cart: mockCart,
        });
        (useQueries as jest.Mock).mockReturnValue(
            mockCart.map((_item, i) => ({
                data: mockProducts[i],
                isLoading: false,
                error: null,
            }))
        );

        const { container } = render(<Checkout />);
        expect(container).toMatchSnapshot();
    });
});
