import { render, screen } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";
import { SnackbarProvider } from "./SnackBarContext";
import { ReactNode } from "react";
import userEvent from "@testing-library/user-event";

function renderWithProviders(ui: ReactNode) {
    return render(
        <SnackbarProvider>
            <CartProvider>{ui}</CartProvider>
        </SnackbarProvider>
    );
}

const mockProducts = [
    {
        id: "1",
        name: "Apple",
        price: 1.0,
        quantity: 10,
        image: "apple.jpg",
        description: "Fresh apple",
        category: "Fruit",
        discount: 10,
        isSeasonal: false,
        createdAt: "2023-01-01",
    },
    {
        id: "2",
        name: "Banana",
        price: 0.5,
        quantity: 20,
        image: "banana.jpg",
        description: "Fresh banana",
        category: "Fruit",
        discount: 5,
        isSeasonal: false,
        createdAt: "2023-01-01",
    },
];

function TestComponent() {
    const { cart, addToCart, removeFromCart, clearCart } = useCart();

    return (
        <div>
            <button onClick={() => addToCart(mockProducts[0])}>Add</button>
            <button onClick={() => removeFromCart("1")}>Remove</button>
            <button onClick={clearCart}>Clear</button>
            <div data-testid="cart-length">{cart.length}</div>
        </div>
    );
}

describe("CartProvider", () => {
    beforeAll(() => {
        global.fetch = jest.fn((url: string) => {
            const productId = url.split("/").pop();
            const product = mockProducts.find((p) => p.id === productId);
            if (product) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(product),
                } as Response);
            }
            return Promise.resolve({ ok: false } as Response);
        }) as jest.Mock;
    });

    afterAll(() => {
        jest.restoreAllMocks();
        (global.fetch as jest.Mock).mockRestore();
    });
    
    it("adds items to the cart", async() => {
        renderWithProviders(<TestComponent />);
        const addButton = screen.getByText("Add");
        await userEvent.click(addButton);
        expect(screen.getByTestId("cart-length").textContent).toBe("1");
    });

    it("removes item from cart", async () => {
        renderWithProviders(<TestComponent />);
        const addButton = screen.getByText("Add");
        await userEvent.click(addButton);
        const removeButton = screen.getByText("Remove");
        await userEvent.click(removeButton);
        expect(screen.getByTestId("cart-length").textContent).toBe("0");
    });

    it("clears the cart", async () => {
        renderWithProviders(<TestComponent />);
        const addButton = screen.getByText("Add");
        await userEvent.click(addButton);
        const clearButton = screen.getByText("Clear");
        await userEvent.click(clearButton);
        expect(screen.getByTestId("cart-length").textContent).toBe("0");
    });
});
