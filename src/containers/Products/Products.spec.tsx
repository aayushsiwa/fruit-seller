import { MockProducts } from '@/entity/Products/Products.mock';
import * as GetProductsAPI from '@/lib/api/products/getProducts';
import { act, render, renderHook, waitFor } from '@/src/utils/test';
import * as MaterialUI from '@mui/material';
import * as NextRouter from 'next/router';

import ProductsPage from './Products';
import * as ProductsHooks from './Products.hooks';

describe('Products - Hooks', () => {
  beforeEach(() => {
    // Mock API query hook to return successful data
    vi.spyOn(GetProductsAPI, 'useGetProducts').mockReturnValue({
      data: { data: { products: MockProducts } },
      isLoading: false,
      error: null,
    } as unknown as ReturnType<typeof GetProductsAPI.useGetProducts>);

    vi.spyOn(NextRouter, 'useRouter').mockImplementation(() => {
      type Return = ReturnType<typeof NextRouter.useRouter>;
      return {
        push: vi.fn(),
        pathname: '/products',
        query: { search: '' },
        prefetch: vi.fn(),
      } as Partial<Return> as Return;
    });
  });

  it('fetches and sets products correctly', async () => {
    const { result } = renderHook(() => ProductsHooks.useProductsPage());

    await waitFor(() => {
      expect(result.current.products).toHaveLength(2);
    });

    expect(result.current.products.length).toBe(2);
    expect(result.current.products[0].name).toBe('Grapes');
    expect(result.current.products[1].name).toBe('Apple');
    expect(result.current.minPrice).toBe(50);
    expect(result.current.maxPrice).toBe(100);
    expect(result.current.isLoading).toBe(false);
  });

  it('applies price range filter correctly', async () => {
    const { result } = renderHook(() => ProductsHooks.useProductsPage());

    await waitFor(() => {
      expect(result.current.products).toHaveLength(2);
    });

    act(() => {
      result.current.setPriceRange([90, 110]);
    });

    await waitFor(() => {
      expect(result.current.filteredProducts).toHaveLength(1);
    });

    expect(result.current.filteredProducts[0].name).toBe('Grapes');
  });

  it('filters by inStockOnly', async () => {
    const { result } = renderHook(() => ProductsHooks.useProductsPage());

    await waitFor(() => {
      expect(result.current.products).toHaveLength(2);
    });

    act(() => {
      result.current.setInStockOnly(true);
    });

    await waitFor(() => {
      expect(result.current.filteredProducts).toHaveLength(1);
    });

    expect(result.current.filteredProducts[0].name).toBe('Grapes');
    expect(result.current.filteredProducts[0].stock).toBeGreaterThan(0);
  });

  it('sorts by discounted', async () => {
    const { result } = renderHook(() => ProductsHooks.useProductsPage());
    await waitFor(() => {
      expect(result.current.products).toHaveLength(2);
    });

    act(() => {
      result.current.setSortOption('discounted');
    });

    await waitFor(() => {
      expect(result.current.filteredProducts.length).toBeGreaterThan(0);
    });

    expect(result.current.filteredProducts).toHaveLength(2);
    expect(result.current.filteredProducts[0].discount).toBe(10);
    expect(result.current.filteredProducts[1].discount).toBe(5);
  });

  it('returns correct filter summary', async () => {
    const { result } = renderHook(() => ProductsHooks.useProductsPage());

    await waitFor(() => {
      expect(result.current.products).toHaveLength(2);
    });

    act(() => {
      result.current.setInStockOnly(true);
      result.current.setCategory('berries');
      result.current.setSortOption('discounted');
    });

    await waitFor(() => {
      const summary = result.current.getFilterSummary();
      expect(summary.length).toBeGreaterThan(0);
    });

    const summary = result.current.getFilterSummary();

    expect(summary).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Category: berries'),
        expect.stringContaining('Sort: '),
        expect.stringContaining('In Stock Only'),
      ])
    );
    expect(result.current.filteredProducts[0].name).toBe('Grapes');
  });
});

describe('Products - UI', () => {
  beforeEach(() => {
    vi.spyOn(NextRouter, 'useRouter').mockImplementation(() => {
      type Return = ReturnType<typeof NextRouter.useRouter>;
      return {
        push: vi.fn(),
        pathname: '/products',
        query: { search: '' },
        prefetch: vi.fn(),
      } as Partial<Return> as Return;
    });
  });

  describe('when rendered in web view', () => {
    beforeEach(() => {
      vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(false);
    });

    it('should match snapshot when API is loading', () => {
      vi.spyOn(GetProductsAPI, 'useGetProducts').mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as unknown as ReturnType<typeof GetProductsAPI.useGetProducts>);

      const { container } = render(<ProductsPage />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when API is successful', () => {
      vi.spyOn(GetProductsAPI, 'useGetProducts').mockReturnValue({
        data: { data: { products: MockProducts } },
        isLoading: false,
        error: null,
      } as unknown as ReturnType<typeof GetProductsAPI.useGetProducts>);

      const { container } = render(<ProductsPage />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when API fails', () => {
      vi.spyOn(GetProductsAPI, 'useGetProducts').mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to fetch products'),
      } as unknown as ReturnType<typeof GetProductsAPI.useGetProducts>);

      const { container } = render(<ProductsPage />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('when rendered in mobile view', () => {
    beforeEach(() => {
      vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(true);
    });

    it('should match snapshot when API is loading', () => {
      vi.spyOn(GetProductsAPI, 'useGetProducts').mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as unknown as ReturnType<typeof GetProductsAPI.useGetProducts>);

      const { container } = render(<ProductsPage />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when API is successful', () => {
      vi.spyOn(GetProductsAPI, 'useGetProducts').mockReturnValue({
        data: { data: { products: MockProducts } },
        isLoading: false,
        error: null,
      } as unknown as ReturnType<typeof GetProductsAPI.useGetProducts>);

      const { container } = render(<ProductsPage />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when API fails', () => {
      vi.spyOn(GetProductsAPI, 'useGetProducts').mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to fetch products'),
      } as unknown as ReturnType<typeof GetProductsAPI.useGetProducts>);

      const { container } = render(<ProductsPage />);
      expect(container).toMatchSnapshot();
    });
  });
});
