import * as CartClearAPI from '@/lib/api/cart/clearCart';
import * as CartGetAPI from '@/lib/api/cart/getCart';
import * as CartRemoveAPI from '@/lib/api/cart/removeCartItem';
import * as CartAPI from '@/lib/api/cart/saveCartItem';
import * as CartUpdateAPI from '@/lib/api/cart/updateCartItem';
import { render, screen } from '@/src/utils/test';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';

import { CartProvider, useCart } from './CartContext';
import { SnackbarProvider } from './SnackBarContext';

vi.mock('@/src/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'u1', email: 'a@b.c' }, isAdmin: () => false }),
}));

vi.unmock('@/src/contexts/CartContext');
vi.unmock('@/src/contexts/SnackBarContext');

function renderWithProviders(ui: ReactNode) {
  return render(
    <SnackbarProvider>
      <CartProvider>{ui}</CartProvider>
    </SnackbarProvider>
  );
}

const product = {
  ID: 'p1',
  name: 'Apple',
  price: 1,
  stock: 10,
  images: [],
  description: '',
  category: '',
  discount: 0,
  isSeasonal: false,
  createdAt: '',
} as any;

function TestComponent() {
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart } =
    useCart();
  return (
    <div>
      <button onClick={() => addToCart(product)}>Add</button>
      <button onClick={() => updateQuantity('p1', 3, 10)}>Update</button>
      <button onClick={() => removeFromCart('p1')}>Remove</button>
      <button onClick={clearCart}>Clear</button>
      <div data-testid="cart-length">{cart.length}</div>
    </div>
  );
}

describe('CartProvider - server sync', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(CartGetAPI, 'getCartAPI').mockResolvedValue([]);
    vi.spyOn(CartAPI, 'saveCartItemAPI').mockResolvedValue({
      productID: 'p1',
      quantity: 1,
    });
    vi.spyOn(CartUpdateAPI, 'updateCartItemAPI').mockResolvedValue({
      productID: 'p1',
      quantity: 3,
    });
    vi.spyOn(CartRemoveAPI, 'removeCartItemAPI').mockResolvedValue(undefined);
    vi.spyOn(CartClearAPI, 'clearCartAPI').mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('pushes the logged-out localStorage cart to the server on login', async () => {
    localStorage.setItem(
      'cart',
      JSON.stringify([{ productID: 'local-1', quantity: 2 }])
    );

    renderWithProviders(<TestComponent />);

    expect(await screen.findByTestId('cart-length')).toHaveTextContent('1');
    expect(CartAPI.saveCartItemAPI).toHaveBeenCalledWith({
      productID: 'local-1',
      quantity: 2,
    });
  });

  it('keeps the higher quantity when the same product is on both sides', async () => {
    localStorage.setItem(
      'cart',
      JSON.stringify([{ productID: 'p1', quantity: 2 }])
    );
    vi.spyOn(CartGetAPI, 'getCartAPI').mockResolvedValue([
      { productID: 'p1', quantity: 3 },
    ]);

    renderWithProviders(<TestComponent />);

    // Server has more (3) than local (2) -> server wins, PUT with max (3)
    expect(await screen.findByTestId('cart-length')).toHaveTextContent('1');
    expect(CartUpdateAPI.updateCartItemAPI).toHaveBeenCalledWith({
      productID: 'p1',
      quantity: 3,
    });
  });

  it('skips and removes a product that no longer exists on the server', async () => {
    localStorage.setItem(
      'cart',
      JSON.stringify([
        { productID: 'ok-1', quantity: 1 },
        { productID: 'bad-2', quantity: 1 },
      ])
    );
    vi.spyOn(CartAPI, 'saveCartItemAPI').mockImplementation(
      async ({ productID }: { productID: string; quantity: number }) => {
        if (productID === 'bad-2') {
          throw Object.assign(new Error('Not found'), {
            response: { status: 404 },
          });
        }
        return { productID: productID, quantity: 1 };
      }
    );

    renderWithProviders(<TestComponent />);

    // bad-2 is not found -> dropped; ok-1 remains
    expect(await screen.findByTestId('cart-length')).toHaveTextContent('1');
    expect(CartAPI.saveCartItemAPI).toHaveBeenCalledWith({
      productID: 'bad-2',
      quantity: 1,
    });
  });

  it('merges the server cart into local on login', async () => {
    vi.spyOn(CartGetAPI, 'getCartAPI').mockResolvedValue([
      { productID: 'server-1', quantity: 2 },
    ]);

    renderWithProviders(<TestComponent />);

    expect(await screen.findByTestId('cart-length')).toHaveTextContent('1');
    expect(CartGetAPI.getCartAPI).toHaveBeenCalled();
  });

  it('syncs add to the server', async () => {
    renderWithProviders(<TestComponent />);
    await userEvent.click(screen.getByText('Add'));

    expect(CartAPI.saveCartItemAPI).toHaveBeenCalledWith({
      productID: 'p1',
      quantity: 1,
    });
  });

  it('syncs quantity update to the server', async () => {
    renderWithProviders(<TestComponent />);
    await userEvent.click(screen.getByText('Add'));
    await userEvent.click(screen.getByText('Update'));

    expect(CartUpdateAPI.updateCartItemAPI).toHaveBeenCalledWith({
      productID: 'p1',
      quantity: 3,
    });
  });

  it('syncs remove to the server', async () => {
    renderWithProviders(<TestComponent />);
    await userEvent.click(screen.getByText('Add'));
    await userEvent.click(screen.getByText('Remove'));

    expect(CartRemoveAPI.removeCartItemAPI).toHaveBeenCalledWith('p1');
  });

  it('syncs clear to the server', async () => {
    renderWithProviders(<TestComponent />);
    await userEvent.click(screen.getByText('Add'));
    await userEvent.click(screen.getByText('Clear'));

    expect(CartClearAPI.clearCartAPI).toHaveBeenCalled();
  });
});
