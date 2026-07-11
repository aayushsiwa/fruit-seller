import { MockProducts } from '@/entity/Products/Products.mock';
import * as GetProductAPI from '@/lib/api/products/getProduct';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';

import { CartProvider, useCart } from './CartContext';
import { SnackbarProvider } from './SnackBarContext';

vi.unmock('@/src/contexts/CartContext');
vi.unmock('@/src/contexts/SnackBarContext');

function renderWithProviders(ui: ReactNode) {
  return render(
    <SnackbarProvider>
      <CartProvider>{ui}</CartProvider>
    </SnackbarProvider>
  );
}

const mockProducts = MockProducts;

function TestComponent() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  return (
    <div>
      <button onClick={() => addToCart(mockProducts[0])}>Add</button>
      <button onClick={() => removeFromCart(mockProducts[0].ID)}>Remove</button>
      <button onClick={clearCart}>Clear</button>
      <div data-testid="cart-length">{cart.length}</div>
    </div>
  );
}

describe('CartProvider', () => {
  beforeEach(() => {
    vi.spyOn(GetProductAPI, 'getProductAPI').mockImplementation(
      (id: string) => {
        const product = mockProducts.find((p) => p.ID === id);
        if (product) {
          return Promise.resolve({
            status: 200,
            data: { product },
          } as any);
        }
        return Promise.reject(new Error('Product not found'));
      }
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('adds items to the cart', async () => {
    renderWithProviders(<TestComponent />);
    const addButton = screen.getByText('Add');
    await userEvent.click(addButton);
    expect(screen.getByTestId('cart-length').textContent).toBe('1');
  });

  it('removes item from cart', async () => {
    renderWithProviders(<TestComponent />);
    const addButton = screen.getByText('Add');
    await userEvent.click(addButton);
    const removeButton = screen.getByText('Remove');
    await userEvent.click(removeButton);
    expect(screen.getByTestId('cart-length').textContent).toBe('0');
  });

  it('clears the cart', async () => {
    renderWithProviders(<TestComponent />);
    const addButton = screen.getByText('Add');
    await userEvent.click(addButton);
    const clearButton = screen.getByText('Clear');
    await userEvent.click(clearButton);
    expect(screen.getByTestId('cart-length').textContent).toBe('0');
  });
});
