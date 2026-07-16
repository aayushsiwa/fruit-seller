import * as GetProductAPI from '@/lib/api/products/getProduct';
import * as GetRelatedProductsAPI from '@/lib/api/products/getRelatedProducts';
import {
  act,
  mockAddToCart,
  render,
  renderHook,
  waitFor,
} from '@/src/utils/test';
import { IProduct } from '@/types/index';
import * as MaterialUI from '@mui/material';
import * as NextRouter from 'next/router';
import React from 'react';

import ProductDetail from './ProductDetail';

const mockProduct: IProduct = {
  ID: '1',
  name: 'Apple',
  price: 50,
  stock: 10,
  images: [{ url: '/apple.jpg', altText: 'Apple' }],
  description: 'Fresh apple from farm',
  category: 'fruits',
  discount: 5,
  isSeasonal: false,
  createdAt: '2025-01-01T00:00:00Z',
};

const mockRelatedProducts: IProduct[] = [
  {
    ID: '2',
    name: 'Banana',
    price: 30,
    stock: 10,
    images: [{ url: '/banana.jpg', altText: 'Banana' }],
    description: 'Fresh banana',
    category: 'fruits',
    discount: 0,
    isSeasonal: false,
    createdAt: '2025-01-01T00:00:00Z',
  },
];

describe('ProductDetail - Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(NextRouter, 'useRouter').mockImplementation(() => {
      type Return = ReturnType<typeof NextRouter.useRouter>;
      return {
        push: vi.fn(),
        query: { id: '1' },
      } as Partial<Return> as Return;
    });
  });

  it('should fetch product by id from query', async () => {
    vi.spyOn(GetProductAPI, 'useGetProduct').mockReturnValue({
      data: { data: { product: mockProduct } },
      isLoading: false,
    } as any);
    vi.spyOn(GetRelatedProductsAPI, 'useGetRelatedProducts').mockReturnValue({
      data: { data: { products: mockRelatedProducts } },
      isLoading: false,
    } as any);

    const realHook = ((await vi.importActual('./ProductDetail.hooks')) as any)
      .useProductDetail;
    const { result } = renderHook(() => realHook());

    await waitFor(() => {
      expect(result.current.product).toEqual(mockProduct);
    });

    expect(result.current.isLoadingProduct).toBe(false);
    expect(result.current.relatedProducts).toEqual(mockRelatedProducts);
  });

  it('should add to cart on handleAddToCart', async () => {
    vi.spyOn(GetProductAPI, 'useGetProduct').mockReturnValue({
      data: { data: { product: { ...mockProduct, quantity: 5 } } },
      isLoading: false,
    } as any);
    vi.spyOn(GetRelatedProductsAPI, 'useGetRelatedProducts').mockReturnValue({
      data: { data: { products: mockRelatedProducts } },
      isLoading: false,
    } as any);

    const realHook = ((await vi.importActual('./ProductDetail.hooks')) as any)
      .useProductDetail;
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

  it('should set error when adding out-of-stock product', async () => {
    vi.spyOn(GetProductAPI, 'useGetProduct').mockReturnValue({
      data: { data: { product: { ...mockProduct, stock: 0 } } },
      isLoading: false,
    } as any);
    vi.spyOn(GetRelatedProductsAPI, 'useGetRelatedProducts').mockReturnValue({
      data: { data: { products: mockRelatedProducts } },
      isLoading: false,
    } as any);

    const realHook = ((await vi.importActual('./ProductDetail.hooks')) as any)
      .useProductDetail;
    const { result } = renderHook(() => realHook());

    await waitFor(() => {
      expect(result.current.product).toBeDefined();
    });

    act(() => {
      result.current.handleAddToCart();
    });

    expect(mockAddToCart).not.toHaveBeenCalled();
    expect(result.current.error).toBe('Cannot add to cart: out of stock.');
  });

  it('should copy link on handleShare', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    vi.spyOn(GetProductAPI, 'useGetProduct').mockReturnValue({
      data: { data: { product: mockProduct } },
      isLoading: false,
    } as any);
    vi.spyOn(GetRelatedProductsAPI, 'useGetRelatedProducts').mockReturnValue({
      data: { data: { products: mockRelatedProducts } },
      isLoading: false,
    } as any);

    const realHook = ((await vi.importActual('./ProductDetail.hooks')) as any)
      .useProductDetail;
    const { result } = renderHook(() => realHook());

    await waitFor(() => {
      expect(result.current.product).toBeDefined();
    });

    await act(async () => {
      await result.current.handleShare();
    });

    expect(writeText).toHaveBeenCalled();
    expect(result.current.snackbar.open).toBe(true);
    expect(result.current.snackbar.message).toBe('Link copied to clipboard!');
  });
});

describe('ProductDetail - UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(NextRouter, 'useRouter').mockImplementation(() => {
      type Return = ReturnType<typeof NextRouter.useRouter>;
      return {
        push: vi.fn(),
        query: { id: '1' },
      } as Partial<Return> as Return;
    });
  });

  describe('when rendered in web view', () => {
    beforeEach(() => {
      vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(false);
    });

    it('should match snapshot when API is loading', () => {
      vi.spyOn(GetProductAPI, 'useGetProduct').mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any);
      vi.spyOn(GetRelatedProductsAPI, 'useGetRelatedProducts').mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any);

      const { container } = render(<ProductDetail />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when API is successful', async () => {
      vi.spyOn(GetProductAPI, 'useGetProduct').mockReturnValue({
        data: { data: { product: mockProduct } },
        isLoading: false,
      } as any);
      vi.spyOn(GetRelatedProductsAPI, 'useGetRelatedProducts').mockReturnValue({
        data: { data: { products: mockRelatedProducts } },
        isLoading: false,
      } as any);

      const { container } = render(<ProductDetail />);

      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when API fails', () => {
      vi.spyOn(GetProductAPI, 'useGetProduct').mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to fetch details'),
      } as any);
      vi.spyOn(GetRelatedProductsAPI, 'useGetRelatedProducts').mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to fetch details'),
      } as any);

      const { container } = render(<ProductDetail />);
      expect(container).toMatchSnapshot();
    });

    it('should show a not-found message when the product 404s', () => {
      vi.spyOn(GetProductAPI, 'useGetProduct').mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Request failed with status code 404'),
      } as any);
      vi.spyOn(GetRelatedProductsAPI, 'useGetRelatedProducts').mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      } as any);

      const { getByText } = render(<ProductDetail />);

      expect(getByText('Product not found')).toBeInTheDocument();
      expect(getByText('Browse products')).toBeInTheDocument();
    });
  });

  describe('when rendered in mobile view', () => {
    beforeEach(() => {
      vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(true);
    });

    it('should match snapshot when API is loading', () => {
      vi.spyOn(GetProductAPI, 'useGetProduct').mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any);
      vi.spyOn(GetRelatedProductsAPI, 'useGetRelatedProducts').mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any);

      const { container } = render(<ProductDetail />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when API is successful', async () => {
      vi.spyOn(GetProductAPI, 'useGetProduct').mockReturnValue({
        data: { data: { product: mockProduct } },
        isLoading: false,
      } as any);
      vi.spyOn(GetRelatedProductsAPI, 'useGetRelatedProducts').mockReturnValue({
        data: { data: { products: mockRelatedProducts } },
        isLoading: false,
      } as any);

      const { container } = render(<ProductDetail />);

      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when API fails', () => {
      vi.spyOn(GetProductAPI, 'useGetProduct').mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to fetch details'),
      } as any);
      vi.spyOn(GetRelatedProductsAPI, 'useGetRelatedProducts').mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to fetch details'),
      } as any);

      const { container } = render(<ProductDetail />);
      expect(container).toMatchSnapshot();
    });
  });
});
