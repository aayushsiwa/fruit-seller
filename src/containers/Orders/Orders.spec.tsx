import { render, screen, renderHook, waitFor } from "@testing-library/react";
import { useOrdersPage } from "./Orders.hooks";
import Orders from "./Orders";
import axios from "axios";
import * as nextRouter from "next/router";
import { Order } from "@/types/index";

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

jest.mock("@/src/components/LoadingScreen", () => ({
    LoadingScreen: () => <div data-testid="loading-screen">Loading...</div>,
}));

jest.mock("dayjs", () => {
    const dayjsFn = () => ({ fromNow: () => "a few days ago" });
    dayjsFn.extend = jest.fn();
    return dayjsFn;
});
jest.mock("dayjs/plugin/relativeTime", () => jest.fn());

jest.mock("@/constants/index", () => ({
    currency: "₹",
}));

jest.mock("@mui/styles", () => ({
    makeStyles: () => () => ({}),
}));

const mockOrders: Order[] = [
    {
        id: "order-1",
        userName: "John Doe",
        items: [
            { id: "p1", quantity: 2 },
            { id: "p2", quantity: 1 },
        ],
        total: 250.5,
        createdAt: "2025-06-01T10:00:00Z",
        status: "Processing",
    },
    {
        id: "order-2",
        userName: "Jane Doe",
        items: [{ id: "p3", quantity: 1 }],
        total: 99.99,
        createdAt: "2025-05-15T08:30:00Z",
        status: "Delivered",
        delivered_at: "2025-05-20T12:00:00Z",
    },
];

describe("Orders - Hooks", () => {
    let axiosGetSpy: jest.SpyInstance;
    let mockPush: jest.Mock;

    beforeEach(() => {
        mockPush = jest.fn();
        jest.spyOn(nextRouter, "useRouter").mockReturnValue({
            push: mockPush,
            query: {},
        } as unknown as nextRouter.NextRouter);

        axiosGetSpy = jest.spyOn(axios, "get").mockResolvedValue({
            status: 200,
            data: mockOrders,
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should fetch orders on mount and set them", async () => {
        const { result } = renderHook(() => useOrdersPage());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.orders).toHaveLength(2);
        expect(result.current.orders[0].id).toBe("order-1");
        expect(result.current.error).toBeNull();
        expect(axiosGetSpy).toHaveBeenCalledWith("/api/orders");
    });

    it("should handle fetch error", async () => {
        axiosGetSpy.mockRejectedValueOnce(new Error("Network Error"));

        const { result } = renderHook(() => useOrdersPage());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.orders).toHaveLength(0);
        expect(result.current.error).toBe("Network Error");
    });

    it("should navigate on handleViewOrder / handleContinueShopping", async () => {
        const { result } = renderHook(() => useOrdersPage());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        result.current.handleViewOrder("order-1");
        expect(mockPush).toHaveBeenCalledWith("/orders/order-1");

        result.current.handleContinueShopping();
        expect(mockPush).toHaveBeenCalledWith("/products");
    });
});

describe("Orders - UI", () => {
    let axiosGetSpy: jest.SpyInstance;
    let mockPush: jest.Mock;

    beforeEach(() => {
        mockPush = jest.fn();
        jest.spyOn(nextRouter, "useRouter").mockReturnValue({
            push: mockPush,
            query: {},
        } as unknown as nextRouter.NextRouter);

        axiosGetSpy = jest.spyOn(axios, "get");
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should render loading state", () => {
        axiosGetSpy.mockImplementationOnce(() => new Promise(() => {}));

        render(<Orders />);

        expect(screen.getByTestId("loading-screen")).toBeInTheDocument();
    });

    it("should render empty state", async () => {
        axiosGetSpy.mockResolvedValueOnce({ data: [], status: 200 });

        render(<Orders />);

        await waitFor(() => {
            expect(screen.getByText("My Orders")).toBeInTheDocument();
        });

        expect(screen.getByText("No orders yet")).toBeInTheDocument();
        expect(screen.getByText("Start Shopping")).toBeInTheDocument();
    });

    it("should match snapshot when rendering orders", async () => {
        axiosGetSpy.mockResolvedValueOnce({ data: mockOrders, status: 200 });

        const { asFragment } = render(<Orders />);

        await waitFor(() => {
            expect(screen.getByText("My Orders")).toBeInTheDocument();
        });

        expect(asFragment()).toMatchSnapshot();
    });
});
