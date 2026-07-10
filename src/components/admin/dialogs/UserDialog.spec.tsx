import { MockUsers } from '@/entity/Users/Users.mock';
import { render, screen } from '@/src/utils/test';
import React from 'react';

import UserDialog from './UserDialog';

const defaultProps = {
  open: true,
  user: MockUsers[0],
  onClose: vi.fn(),
  onSave: vi.fn(),
  isLoading: false,
};

describe('UserDialog', () => {
  it('shows the edit title when the user has an id', () => {
    render(<UserDialog {...defaultProps} />);

    expect(screen.getByText('Edit User')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<UserDialog {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('shows the add title for a new user', () => {
    render(<UserDialog {...defaultProps} user={{}} />);

    expect(screen.getByText('Add New User')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('does not render content when closed', () => {
    render(<UserDialog {...defaultProps} open={false} />);

    expect(screen.queryByText('Edit User')).not.toBeInTheDocument();
  });
});
