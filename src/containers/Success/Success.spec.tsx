import React from "react";
import { render, screen } from "@testing-library/react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ItemType, UseSuccessReturn } from "@/types/index";

jest.mock("framer-motion", () => {
    const MotionDiv = ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
        <div {...props}>{children}</div>
    );
    MotionDiv.displayName = "motion.div";
    return {
        motion: {
            div: MotionDiv,
        },
    };
});

const mockPush = jest.fn();
const mockQuery: { orderId?: string } = { orderId: "order-1" };

jest.mock("next/router", () => ({
    useRouter: jest.fn(() => ({
        query: mockQuery,
        push: mockPush,
    })),
}));

jest.mock("axios");

jest.mock("@mui/styles", () => ({
    makeStyles: jest.fn(() => jest.fn(() => ({}))),
}));

jest.mock("react-icons/fi", () => ({
    FiCheckCircle: (props: Record<string, unknown>) => (
        <svg data-testid="fi-check-circle" {...props} />
    ),
}));

jest.mock("@/src/components/LoadingScreen", () => ({
    LoadingScreen: () => <div data-testid="loading-screen">Loading...</div>,
}));

jest.mock("@/src/components/Success/OrderDetails", () => ({
    OrderDetails: () => <div data-testid="order-details">Order Details</div>,
}));

jest.mock("@/src/components/Success/ErrorMessage", () => ({
    ErrorMessage: ({
        message,
        onRetry,
    }: {
        message: string;
        onRetry: () => void;
    }) => (
        <div data-testid="error-message">
            {message}
            <button data-testid="retry-button" onClick={onRetry}>
                Retry
            </button>
        </div>
    ),
}));

jest.mock("./Success.hooks", () => ({
    useSuccess: jest.fn(),
}));

import axios from "axios";
import { useSuccess } from "./Success.hooks";
import Success from "./Success";

const theme = createTheme();

const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const mockOrder = {
    id: "order-1",
    userName: "John Doe",
    items: [{ id: "p1", quantity: 2 }],
    total: 100,
    createdAt: "2025-06-01T00:00:00Z",
    status: "Processing" as const,
};

const mockProducts: ItemType[] = [
    {
        id: "p1",
        name: "Apple",
        price: 50,
        quantity: 10,
        image: "/apple.jpg",
        description: "Fresh apple",
        category: "fruits",
        discount: 0,
        isSeasonal: false,
        createdAt: "2025-01-01T00:00:00Z",
    },
];

const defaultHookReturn: UseSuccessReturn = {
    order: mockOrder,
    products: mockProducts,
    isLoading: false,
    error: null,
    handleContinueShopping: jest.fn(),
};

describe("Success - Hooks", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockQuery.orderId = "order-1";
    });

    it("should fetch order by orderId from query", async () => {
        const axiosGet = axios.get as unknown as jest.Mock;
        axiosGet.mockResolvedValueOnce({ data: mockOrder });
        axiosGet.mockResolvedValueOnce({ data: mockProducts[0] });

        const realHook = jest.requireActual("./Success.hooks").useSuccess;
        const { result } = renderHook(() => realHook());

        await waitFor(() => {
            expect(result.current.order).toEqual(mockOrder);
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it("should handle fetch error", async () => {
        const axiosGet = axios.get as unknown as jest.Mock;
        axiosGet.mockRejectedValue(new Error("Network error"));

        const realHook = jest.requireActual("./Success.hooks").useSuccess;
        const { result } = renderHook(() => realHook());

        await waitFor(() => {
            expect(result.current.error).toBe("Network error");
        });

        expect(result.current.order).toBeNull();
        expect(result.current.isLoading).toBe(false);
    });

    it("should navigate on handleContinueShopping", () => {
        const axiosGet = axios.get as unknown as jest.Mock;
        axiosGet.mockResolvedValue({ data: mockOrder });

        const realHook = jest.requireActual("./Success.hooks").useSuccess;
        const { result } = renderHook(() => realHook());

        act(() => {
            result.current.handleContinueShopping();
        });

        expect(mockPush).toHaveBeenCalledWith("/products");
    });
});

describe("Success - UI", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render loading state", () => {
        (useSuccess as jest.Mock).mockReturnValue({
            ...defaultHookReturn,
            order: null,
            products: [],
            isLoading: true,
            error: null,
        });

        renderWithTheme(<Success />);
        expect(screen.getByTestId("loading-screen")).toBeInTheDocument();
    });

    it("should render error state", () => {
        const handleContinueShopping = jest.fn();
        (useSuccess as jest.Mock).mockReturnValue({
            ...defaultHookReturn,
            order: null,
            products: [],
            isLoading: false,
            error: "Something went wrong",
            handleContinueShopping,
        });

        renderWithTheme(<Success />);
        expect(screen.getByTestId("error-message")).toBeInTheDocument();
        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("should match snapshot with order data", () => {
        (useSuccess as jest.Mock).mockReturnValue(defaultHookReturn);

        const { asFragment } = renderWithTheme(<Success />);
        expect(asFragment()).toMatchSnapshot();
    });
});
