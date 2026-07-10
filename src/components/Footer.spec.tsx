import { render, screen } from '@/src/utils/test';
import React from 'react';

import Footer from './Footer';

describe('Footer', () => {
  it('renders the brand and section headings', () => {
    render(<Footer />);

    expect(screen.getByText('Fruit Seller')).toBeInTheDocument();
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<Footer />);
    expect(container).toMatchSnapshot();
  });

  it('renders the social media buttons', () => {
    render(<Footer />);

    expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
  });
});
