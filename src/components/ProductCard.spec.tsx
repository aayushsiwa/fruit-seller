import { MockProducts } from '@/entity/Products/Products.mock';
import * as AddFavoriteAPI from '@/lib/api/favorites/addFavorite';
import * as GetFavoritesAPI from '@/lib/api/favorites/getFavorites';
import * as RemoveFavoriteAPI from '@/lib/api/favorites/removeFavorite';
import ProductCard from '@/src/components/ProductCard';
import { IProduct } from '@/types/index';
import { render } from '@testing-library/react';
import * as NextRouter from 'next/router';
import React from 'react';

vi.mock('@/src/contexts/CartContext', () => ({
  useCart: () => ({
    cart: [],
    addToCart: vi.fn(),
    updateQuantity: vi.fn(),
    removeFromCart: vi.fn(),
  }),
}));

const sampleProduct: IProduct = {
  id: '1',
  name: 'Grapes',
  price: 100,
  discount: 10,
  stock: 20,
  image: '/grapes.jpg',
  description: 'Fresh Grapes from Nashik.',
  createdAt: '2025-05-01T00:00:00Z',
  category: 'fruits',
  isSeasonal: true,
};

describe('ProductCard Snapshot', () => {
  const mockPush = vi.fn();
  vi.spyOn(NextRouter, 'useRouter').mockImplementation(() => {
    type Return = ReturnType<typeof NextRouter.useRouter>;
    return {
      push: mockPush,
      query: {},
      asPath: '/favorites',
    } as Partial<Return> as Return;
  });

  vi.spyOn(GetFavoritesAPI, 'useGetFavorites').mockReturnValue({
    data: { data: MockProducts },
    isLoading: false,
    error: null,
  } as unknown as ReturnType<typeof GetFavoritesAPI.useGetFavorites>);

  vi.spyOn(AddFavoriteAPI, 'useAddFavorite').mockReturnValue({
    mutateAsync: vi.fn(),
  } as unknown as ReturnType<typeof AddFavoriteAPI.useAddFavorite>);

  vi.spyOn(RemoveFavoriteAPI, 'useRemoveFavorite').mockReturnValue({
    mutateAsync: vi.fn(),
  } as unknown as ReturnType<typeof RemoveFavoriteAPI.useRemoveFavorite>);

  it('renders correctly and matches snapshot', () => {
    const { asFragment } = render(<ProductCard product={sampleProduct} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
