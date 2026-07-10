import { MockProducts } from '@/entity/Products/Products.mock';
import { render, screen } from '@/src/utils/test';
import React from 'react';

import ProductDialog from './ProductDialog';

const defaultProps = {
  open: true,
  product: MockProducts[0],
  onClose: vi.fn(),
  onSave: vi.fn(),
  isLoading: false,
};

describe('ProductDialog', () => {
  it('shows the edit title when the product has an id', () => {
    render(<ProductDialog {...defaultProps} />);

    expect(screen.getByText('Edit Product')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<ProductDialog {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('shows the add title for a new product', () => {
    render(<ProductDialog {...defaultProps} product={{}} />);

    expect(screen.getByText('Add New Product')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('does not render content when closed', () => {
    render(<ProductDialog {...defaultProps} open={false} />);

    expect(screen.queryByText('Edit Product')).not.toBeInTheDocument();
  });
});
