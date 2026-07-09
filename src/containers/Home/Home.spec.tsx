import * as GetFeaturedProductsAPI from '@/lib/api/products/getFeaturedProducts';
import {
  mockPush,
  mockUseRouter,
  render,
  screen,
  waitFor,
} from '@/src/utils/test';
import { IProduct } from '@/types/index';
import * as MaterialUI from '@mui/material';
import userEvent from '@testing-library/user-event';

import Home from './Home';

describe('Home Page', () => {
  beforeEach(() => {
    vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(false);
    mockUseRouter.mockReturnValue({
      push: mockPush,
      prefetch: vi.fn(),
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Hero Section', () => {
    it('renders hero section with main heading', () => {
      render(<Home />);
      expect(
        screen.getByText(/Fresh Fruits Delivered to Your Door/i)
      ).toBeInTheDocument();
    });

    it('navigates to products when hero CTA button is clicked', async () => {
      render(<Home />);
      const shopNowButton = screen.getAllByRole('button', {
        name: /Shop Now/i,
      })[0];

      await userEvent.click(shopNowButton);
      expect(mockPush).toHaveBeenCalledWith('/products');
    });
  });

  describe('Featured Products', () => {
    it('renders loading spinner while fetching products', () => {
      vi.spyOn(
        GetFeaturedProductsAPI,
        'useGetFeaturedProducts'
      ).mockReturnValue({ isLoading: true } as any);
      render(<Home />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders featured products after successful fetch', async () => {
      const mockProducts: IProduct[] = [
        {
          id: '1',
          name: 'Apple',
          stock: 10,
          price: 1.99,
          image: 'apple.jpg',
          description: 'Fresh apple',
          category: 'Fruit',
          discount: 0,
          isSeasonal: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Banana',
          stock: 5,
          price: 0.99,
          image: 'banana.jpg',
          description: 'Fresh banana',
          category: 'Fruit',
          discount: 10,
          isSeasonal: true,
          createdAt: new Date().toISOString(),
        },
      ];

      vi.spyOn(
        GetFeaturedProductsAPI,
        'useGetFeaturedProducts'
      ).mockReturnValue({
        data: { data: { products: mockProducts } },
        isLoading: false,
      } as any);

      render(<Home />);

      await waitFor(() =>
        expect(screen.getByText('Apple')).toBeInTheDocument()
      );

      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('handles empty products list', async () => {
      vi.spyOn(
        GetFeaturedProductsAPI,
        'useGetFeaturedProducts'
      ).mockReturnValue({
        data: { data: { products: [] } },
        isLoading: false,
      } as any);

      render(<Home />);

      await waitFor(() => {
        expect(screen.queryByText('Apple')).not.toBeInTheDocument();
      });
    });
  });

  describe('Benefits Section', () => {
    it('renders benefits section with correct content', () => {
      render(<Home />);

      expect(screen.getByText('Why Choose Us?')).toBeInTheDocument();
      expect(screen.getByText('Farm Fresh')).toBeInTheDocument();
    });
  });

  describe('Home Page Snapshots', () => {
    describe('when rendered in web view', () => {
      beforeEach(() => {
        vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(false);
      });

      it('should match snapshot when API is loading', () => {
        vi.spyOn(
          GetFeaturedProductsAPI,
          'useGetFeaturedProducts'
        ).mockReturnValue({ isLoading: true } as any);
        const { container } = render(<Home />);
        expect(container).toMatchSnapshot();
      });

      it('should match snapshot when API is successful', async () => {
        vi.spyOn(
          GetFeaturedProductsAPI,
          'useGetFeaturedProducts'
        ).mockReturnValue({
          data: { data: { products: [] } },
          isLoading: false,
        } as any);
        const { container } = render(<Home />);
        expect(container).toMatchSnapshot();
      });
    });

    describe('when rendered in mobile view', () => {
      beforeEach(() => {
        vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(true);
      });

      it('should match snapshot when API is loading', () => {
        vi.spyOn(
          GetFeaturedProductsAPI,
          'useGetFeaturedProducts'
        ).mockReturnValue({ isLoading: true } as any);
        const { container } = render(<Home />);
        expect(container).toMatchSnapshot();
      });

      it('should match snapshot when API is successful', async () => {
        vi.spyOn(
          GetFeaturedProductsAPI,
          'useGetFeaturedProducts'
        ).mockReturnValue({
          data: { data: { products: [] } },
          isLoading: false,
        } as any);
        const { container } = render(<Home />);
        expect(container).toMatchSnapshot();
      });
    });
  });
});
