import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/pages/index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as nextRouter from "next/router";
import userEvent from "@testing-library/user-event";
import { ItemType } from "@/types";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("@/src/components/ProductCard", () => ({
    __esModule: true,
    default: ({ product }: { product: ItemType }) => (
        <div data-testid="product-card">{product.name}</div>
    ),
}));

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

const renderWithQueryProvider = (ui: React.ReactNode) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false, // Disable retries for tests
            },
        },
    });
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
};

describe("Home Page", () => {
    let mockPush: jest.Mock;
    let mockRouter: Partial<nextRouter.NextRouter>;

    beforeEach(() => {
        mockPush = jest.fn();
        mockRouter = {
            push: mockPush,
            prefetch: jest.fn(),
            route: "/",
            pathname: "/",
            query: {},
            asPath: "/",
        };

        jest.spyOn(nextRouter, "useRouter").mockReturnValue(
            mockRouter as nextRouter.NextRouter
        );

        mockedAxios.get.mockClear();
        mockPush.mockClear();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("Hero Section", () => {
        it("renders hero section with main heading", () => {
            renderWithQueryProvider(<Home />);
            expect(
                screen.getByText(/Fresh Fruits Delivered to Your Door/i)
            ).toBeInTheDocument();
        });

        it("navigates to products when hero CTA button is clicked", async () => {
            renderWithQueryProvider(<Home />);
            const shopNowButton = screen.getAllByRole("button", {
                name: /Shop Now/i,
            })[0];

            await userEvent.click(shopNowButton);
            expect(mockPush).toHaveBeenCalledWith("/products");
        });
    });

    describe("Featured Products", () => {
        it("renders loading spinner while fetching products", () => {
            mockedAxios.get.mockImplementation(() => new Promise(() => {}));
            renderWithQueryProvider(<Home />);
            expect(screen.getByRole("progressbar")).toBeInTheDocument();
        });

        it("renders featured products after successful fetch", async () => {
            const mockProducts: ItemType[] = [
                {
                    id: "1",
                    name: "Apple",
                    quantity: 10,
                    price: 1.99,
                    image: "apple.jpg",
                    description: "Fresh apple",
                    category: "Fruit",
                    discount: 0,
                    isSeasonal: false,
                    createdAt: new Date().toISOString(),
                },
                {
                    id: "2",
                    name: "Banana",
                    quantity: 5,
                    price: 0.99,
                    image: "banana.jpg",
                    description: "Fresh banana",
                    category: "Fruit",
                    discount: 10,
                    isSeasonal: true,
                    createdAt: new Date().toISOString(),
                },
            ];

            mockedAxios.get.mockResolvedValueOnce({
                data: mockProducts,
                status: 200,
            });

            renderWithQueryProvider(<Home />);

            await waitFor(() =>
                expect(screen.getAllByTestId("product-card")).toHaveLength(2)
            );

            expect(screen.getByText("Apple")).toBeInTheDocument();
            expect(screen.getByText("Banana")).toBeInTheDocument();
        });

        it("handles empty products list", async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: [],
                status: 200,
            });

            renderWithQueryProvider(<Home />);

            await waitFor(() => {
                expect(
                    screen.queryByTestId("product-card")
                ).not.toBeInTheDocument();
            });
        });
    });

    describe("Benefits Section", () => {
        it("renders benefits section with correct content", () => {
            renderWithQueryProvider(<Home />);

            expect(screen.getByText("Why Choose Us?")).toBeInTheDocument();
            expect(screen.getByText("Farm Fresh")).toBeInTheDocument();
        });
    });
});
