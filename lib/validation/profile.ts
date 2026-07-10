import * as Yup from 'yup';

export const profileSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(1, 'Last name is required')
    .required('Last name is required'),
});

export const profileInitialValues = {
  firstName: '',
  lastName: '',
};

export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must be at least 8 characters, include uppercase, lowercase, a number, a special character (@$!%*?&), and contain no spaces or unsafe characters'
    ),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});

export const changePasswordInitialValues = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};
