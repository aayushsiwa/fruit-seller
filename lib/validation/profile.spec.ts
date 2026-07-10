import {
  changePasswordSchema,
  profileSchema,
} from './profile';

describe('profileSchema', () => {
  it('should validate valid profile data', async () => {
    const valid = { firstName: 'John', lastName: 'Doe' };
    await expect(profileSchema.validate(valid)).resolves.toEqual(valid);
  });

  it('should reject empty firstName', async () => {
    await expect(
      profileSchema.validate({ firstName: '', lastName: 'Doe' })
    ).rejects.toThrow('First name must be at least 2 characters');
  });

  it('should reject firstName shorter than 2 chars', async () => {
    await expect(
      profileSchema.validate({ firstName: 'J', lastName: 'Doe' })
    ).rejects.toThrow('First name must be at least 2 characters');
  });

  it('should reject empty lastName', async () => {
    await expect(
      profileSchema.validate({ firstName: 'John', lastName: '' })
    ).rejects.toThrow('Last name is required');
  });
});

describe('changePasswordSchema', () => {
  it('should validate when passwords match', async () => {
    const valid = {
      currentPassword: 'oldPass1!',
      newPassword: 'NewPass1!',
      confirmNewPassword: 'NewPass1!',
    };
    await expect(changePasswordSchema.validate(valid)).resolves.toEqual(valid);
  });

  it('should reject when passwords do not match', async () => {
    const invalid = {
      currentPassword: 'oldPass1!',
      newPassword: 'NewPass1!',
      confirmNewPassword: 'Different1!',
    };
    await expect(changePasswordSchema.validate(invalid)).rejects.toThrow(
      'Passwords must match'
    );
  });

  it('should reject weak new password', async () => {
    const invalid = {
      currentPassword: 'oldPass1!',
      newPassword: 'weak',
      confirmNewPassword: 'weak',
    };
    await expect(changePasswordSchema.validate(invalid)).rejects.toThrow(
      'Password must be at least 8 characters'
    );
  });

  it('should reject new password without special char', async () => {
    const invalid = {
      currentPassword: 'oldPass1!',
      newPassword: 'Password1',
      confirmNewPassword: 'Password1',
    };
    await expect(changePasswordSchema.validate(invalid)).rejects.toThrow(
      'special character'
    );
  });

  it('should require currentPassword', async () => {
    await expect(
      changePasswordSchema.validate({
        currentPassword: '',
        newPassword: 'NewPass1!',
        confirmNewPassword: 'NewPass1!',
      })
    ).rejects.toThrow('Current password is required');
  });
});
