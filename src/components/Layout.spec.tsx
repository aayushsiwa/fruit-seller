import { mockUseAuth, render, screen } from '@/src/utils/test';
import * as MaterialUI from '@mui/material';
import React from 'react';

import Layout from './Layout';

describe('Layout', () => {
  beforeEach(() => {
    vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(false);
  });

  it('renders children within the layout', () => {
    render(
      <Layout>
        <div>Page content</div>
      </Layout>
    );

    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <Layout>
        <div>Page content</div>
      </Layout>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders a loading screen while auth is loading', () => {
    mockUseAuth.mockReturnValue({
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      isAdmin: vi.fn(() => false),
      user: null,
      loading: true,
      error: null,
    });

    render(
      <Layout>
        <div>Page content</div>
      </Layout>
    );

    expect(screen.queryByText('Page content')).not.toBeInTheDocument();
  });
});
