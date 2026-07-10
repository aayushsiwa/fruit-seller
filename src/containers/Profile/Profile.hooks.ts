import type { PincodeOffice } from '@/entity/Pincodes/Pincodes';
import { useGetAddresses } from '@/lib/api/addresses/getAddresses';
import { useSaveAddress } from '@/lib/api/addresses/saveAddress';
import { useGetPincode } from '@/lib/api/pincodes/getPincode';
import { useChangePassword } from '@/lib/api/profile/changePassword';
import { useGetProfile } from '@/lib/api/profile/getProfile';
import { useUpdateProfile } from '@/lib/api/profile/updateProfile';
import {
  changePasswordInitialValues,
  changePasswordSchema,
  profileSchema,
} from '@/lib/validation/profile';
import { useSnackbar } from '@/src/contexts/SnackBarContext';
import { Address } from '@/types/index';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

export const useProfilePage = (): UseProfilePageReturn => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const { showSnackbar } = useSnackbar();

  const {
    data: profileResponse,
    isLoading,
    error,
  } = useGetProfile();
  const user = profileResponse?.data || null;

  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const profileFormik = useFormik({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
    validationSchema: profileSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateProfileMutation.mutateAsync(values);
        await update();
        showSnackbar('Profile updated successfully', 'success');
      } catch {
        showSnackbar('Failed to update profile', 'error');
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: changePasswordInitialValues,
    validationSchema: changePasswordSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await changePasswordMutation.mutateAsync({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        showSnackbar('Password changed successfully', 'success');
        resetForm();
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { error?: string } } }).response
                ?.data?.error || 'Failed to change password'
            : 'Failed to change password';
        showSnackbar(message, 'error');
      }
    },
  });

  const { data: addressesResponse } = useGetAddresses(true);
  const savedAddresses = addressesResponse?.data || [];

  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    street: '',
    street2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    phone: '',
  });
  const [offices, setOffices] = useState<PincodeOffice[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<PincodeOffice | null>(
    null
  );

  const pin = newAddress.postal_code.trim();
  const isPinValid = pin.length === 6 && /^\d+$/.test(pin);

  const { data: pincodeResponse } = useGetPincode(pin, isPinValid && addressDialogOpen);
  const pincodeData = pincodeResponse?.data;

  useEffect(() => {
    if (!isPinValid) {
      setOffices([]);
      setSelectedOffice(null);
      setNewAddress((prev) => ({ ...prev, city: '', state: '' }));
      return;
    }
  }, [isPinValid]);

  useEffect(() => {
    if (!pincodeData) return;

    const result = pincodeData.offices;
    setOffices(result);

    if (result.length >= 1) {
      const office = result[0];
      setNewAddress((prev) => ({
        ...prev,
        city: office.district,
        state: office.state,
      }));
      setSelectedOffice(result.length === 1 ? office : null);
    }
  }, [pincodeData]);

  const handleSelectOffice = useCallback(
    (office: PincodeOffice | null) => {
      setSelectedOffice(office);
      if (office) {
        setNewAddress((prev) => ({
          ...prev,
          city: office.district,
          state: office.state,
        }));
      }
    },
    []
  );

  const saveAddressMutation = useSaveAddress();

  const handleSaveAddress = async () => {
    const { street, city, state, postal_code, country, phone } = newAddress;
    if (!street || !city || !state || !postal_code || !country || !phone) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    try {
      await saveAddressMutation.mutateAsync(newAddress);
      showSnackbar('Address saved successfully', 'success');
      setAddressDialogOpen(false);
      setNewAddress({
        street: '',
        street2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        phone: '',
      });
      setOffices([]);
      setSelectedOffice(null);
    } catch {
      showSnackbar('Failed to save address', 'error');
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return {
    user,
    isLoading,
    error: error ? error.message : null,
    session,
    profileFormik,
    isProfileSubmitting: updateProfileMutation.isPending,
    passwordFormik,
    isPasswordSubmitting: changePasswordMutation.isPending,
    savedAddresses,
    addressDialogOpen,
    setAddressDialogOpen,
    newAddress,
    setNewAddress,
    offices,
    selectedOffice,
    handleSelectOffice,
    handleSaveAddress,
    handleNavigation,
  };
};

export type UseProfilePageReturn = {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profileFormik: any;
  isProfileSubmitting: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passwordFormik: any;
  isPasswordSubmitting: boolean;
  savedAddresses: Address[];
  addressDialogOpen: boolean;
  setAddressDialogOpen: (open: boolean) => void;
  newAddress: Address;
  setNewAddress: React.Dispatch<React.SetStateAction<Address>>;
  offices: PincodeOffice[];
  selectedOffice: PincodeOffice | null;
  handleSelectOffice: (office: PincodeOffice | null) => void;
  handleSaveAddress: () => Promise<void>;
  handleNavigation: (path: string) => void;
};
