import { MockUsers } from '@/entity/Users/Users.mock';
import * as GetAddressesAPI from '@/lib/api/addresses/getAddresses';
import * as ChangePasswordAPI from '@/lib/api/profile/changePassword';
import * as GetProfileAPI from '@/lib/api/profile/getProfile';
import * as UpdateProfileAPI from '@/lib/api/profile/updateProfile';
import {
  mockPush,
  mockUseSession,
  render,
  renderHook,
  waitFor,
} from '@/src/utils/test';
import * as MaterialUI from '@mui/material';
import * as NextRouter from 'next/router';

import Profile from './Profile';
import * as ProfileHooks from './Profile.hooks';

describe('Profile - Hooks', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: '1',
          name: 'Alice Smith',
          email: 'alice@example.com',
          role: 'user',
        },
      },
      status: 'authenticated',
      update: vi.fn(),
    });

    vi.spyOn(NextRouter, 'useRouter').mockImplementation(() => {
      type Return = ReturnType<typeof NextRouter.useRouter>;
      return {
        push: mockPush,
        query: {},
        asPath: '/profile',
      } as Partial<Return> as Return;
    });

    vi.spyOn(GetProfileAPI, 'useGetProfile').mockReturnValue({
      data: { data: MockUsers[0] },
      isLoading: false,
      error: null,
    } as unknown as ReturnType<typeof GetProfileAPI.useGetProfile>);

    vi.spyOn(GetAddressesAPI, 'useGetAddresses').mockReturnValue({
      data: { data: [] },
      isLoading: false,
      error: null,
    } as unknown as ReturnType<typeof GetAddressesAPI.useGetAddresses>);

    vi.spyOn(UpdateProfileAPI, 'useUpdateProfile').mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof UpdateProfileAPI.useUpdateProfile>);

    vi.spyOn(ChangePasswordAPI, 'useChangePassword').mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof ChangePasswordAPI.useChangePassword>);
  });

  it('should fetch profile on mount and set user', async () => {
    const { result } = renderHook(() => ProfileHooks.useProfilePage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(MockUsers[0]);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    vi.spyOn(GetProfileAPI, 'useGetProfile').mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network Error') as any,
    } as unknown as ReturnType<typeof GetProfileAPI.useGetProfile>);

    const { result } = renderHook(() => ProfileHooks.useProfilePage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe('Network Error');
  });

  it('should navigate on handleNavigation', async () => {
    const { result } = renderHook(() => ProfileHooks.useProfilePage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    result.current.handleNavigation('/products');
    expect(mockPush).toHaveBeenCalledWith('/products');
  });
});

describe('Profile - UI', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: '1',
          name: 'Alice Smith',
          email: 'alice@example.com',
          role: 'user',
        },
      },
      status: 'authenticated',
      update: vi.fn(),
    });

    vi.spyOn(NextRouter, 'useRouter').mockImplementation(() => {
      type Return = ReturnType<typeof NextRouter.useRouter>;
      return {
        push: mockPush,
        query: {},
        asPath: '/profile',
      } as Partial<Return> as Return;
    });

    vi.spyOn(GetAddressesAPI, 'useGetAddresses').mockReturnValue({
      data: { data: [] },
      isLoading: false,
      error: null,
    } as unknown as ReturnType<typeof GetAddressesAPI.useGetAddresses>);

    vi.spyOn(UpdateProfileAPI, 'useUpdateProfile').mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof UpdateProfileAPI.useUpdateProfile>);

    vi.spyOn(ChangePasswordAPI, 'useChangePassword').mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof ChangePasswordAPI.useChangePassword>);
  });

  describe('when rendered in web view', () => {
    beforeEach(() => {
      vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(false);
    });

    it('should match snapshot when API is loading', () => {
      vi.spyOn(GetProfileAPI, 'useGetProfile').mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as unknown as ReturnType<typeof GetProfileAPI.useGetProfile>);

      const { container } = render(<Profile />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when profile is loaded', () => {
      vi.spyOn(GetProfileAPI, 'useGetProfile').mockReturnValue({
        data: { data: MockUsers[0] },
        isLoading: false,
        error: null,
      } as unknown as ReturnType<typeof GetProfileAPI.useGetProfile>);

      const { container } = render(<Profile />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when API fails', () => {
      vi.spyOn(GetProfileAPI, 'useGetProfile').mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network Error') as any,
      } as unknown as ReturnType<typeof GetProfileAPI.useGetProfile>);

      const { container } = render(<Profile />);
      expect(container).toMatchSnapshot();
    });
  });
});
