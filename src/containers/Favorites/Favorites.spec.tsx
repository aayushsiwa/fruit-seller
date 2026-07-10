import { MockProducts } from '@/entity/Products/Products.mock';
import * as GetFavoritesAPI from '@/lib/api/favorites/getFavorites';
import { render, renderHook, waitFor } from '@/src/utils/test';
import * as MaterialUI from '@mui/material';
import * as NextRouter from 'next/router';

import Favorites from './Favorites';
import { useFavoritesPage } from './Favorites.hooks';

describe('Favorites - Hooks', () => {
  let mockPush: any;

  beforeEach(() => {
    mockPush = vi.fn();
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
  });

  it('should fetch favorites on mount and set them', async () => {
    const { result } = renderHook(() => useFavoritesPage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.favorites).toHaveLength(2);
    expect(result.current.favorites[0].name).toBe('Grapes');
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    vi.spyOn(GetFavoritesAPI, 'useGetFavorites').mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network Error') as any,
    } as unknown as ReturnType<typeof GetFavoritesAPI.useGetFavorites>);

    const { result } = renderHook(() => useFavoritesPage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.favorites).toHaveLength(0);
    expect(result.current.error).toBe('Network Error');
  });

  it('should navigate on handleContinueShopping', async () => {
    const { result } = renderHook(() => useFavoritesPage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    result.current.handleContinueShopping();
    expect(mockPush).toHaveBeenCalledWith('/products');
  });
});

describe('Favorites - UI', () => {
  let mockPush: any;

  beforeEach(() => {
    mockPush = vi.fn();
    vi.spyOn(NextRouter, 'useRouter').mockImplementation(() => {
      type Return = ReturnType<typeof NextRouter.useRouter>;
      return {
        push: mockPush,
        query: {},
        asPath: '/favorites',
      } as Partial<Return> as Return;
    });
  });

  describe('when rendered in web view', () => {
    beforeEach(() => {
      vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(false);
    });

    it('should match snapshot when API is loading', () => {
      vi.spyOn(GetFavoritesAPI, 'useGetFavorites').mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as unknown as ReturnType<typeof GetFavoritesAPI.useGetFavorites>);

      const { container } = render(<Favorites />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when API is successful', () => {
      vi.spyOn(GetFavoritesAPI, 'useGetFavorites').mockReturnValue({
        data: { data: MockProducts },
        isLoading: false,
        error: null,
      } as unknown as ReturnType<typeof GetFavoritesAPI.useGetFavorites>);

      const { container } = render(<Favorites />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when API is empty', () => {
      vi.spyOn(GetFavoritesAPI, 'useGetFavorites').mockReturnValue({
        data: { data: [] },
        isLoading: false,
        error: null,
      } as unknown as ReturnType<typeof GetFavoritesAPI.useGetFavorites>);

      const { container } = render(<Favorites />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when API fails', () => {
      vi.spyOn(GetFavoritesAPI, 'useGetFavorites').mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network Error') as any,
      } as unknown as ReturnType<typeof GetFavoritesAPI.useGetFavorites>);

      const { container } = render(<Favorites />);
      expect(container).toMatchSnapshot();
    });
  });
});
