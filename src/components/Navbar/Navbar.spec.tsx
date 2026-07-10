import { render, screen } from '@/src/utils/test';
import * as MaterialUI from '@mui/material';
import React from 'react';

import { Navbar } from './Navbar';

describe('Navbar', () => {
  describe('desktop view', () => {
    beforeEach(() => {
      vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(false);
    });

    it('renders the brand and desktop navigation links', () => {
      render(<Navbar />);

      expect(screen.getByText('Fruit Seller')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Search products...')
      ).toBeInTheDocument();
    });

    it('matches snapshot', () => {
      const { container } = render(<Navbar />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('mobile view', () => {
    beforeEach(() => {
      vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(true);
    });

    it('renders the brand and the menu toggle', () => {
      render(<Navbar />);

      expect(screen.getByText('Fruit Seller')).toBeInTheDocument();
      expect(screen.getByLabelText('menu')).toBeInTheDocument();
    });
  });
});
