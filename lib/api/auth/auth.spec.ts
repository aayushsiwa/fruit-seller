// @vitest-environment node
import {
  comparePassword,
  generateJWT,
  generateResetToken,
  hashPassword,
  verifyJWT,
  verifyResetToken,
} from './auth';

process.env.JWT_SECRET = 'your-custom-jwt-secret-with-long-length-32';

describe('Auth Helpers - Passwords', () => {
  it('should hash and compare passwords correctly', async () => {
    const password = 'mySecurePassword123';
    const hash = await hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);

    const matchesCorrect = await comparePassword(password, hash);
    expect(matchesCorrect).toBe(true);

    const matchesIncorrect = await comparePassword('wrongPassword', hash);
    expect(matchesIncorrect).toBe(false);
  });
});

describe('Auth Helpers - JWTs', () => {
  it('should generate and verify a valid JWT with correct claims', async () => {
    const email = 'user@example.com';
    const role = 'USER';
    const token = await generateJWT(email, role);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    // next-auth decode flattens the token payload — email/role are top-level on decoded
    const decoded = await verifyJWT(token);
    expect(decoded).not.toBeNull();
    expect((decoded as any)?.email).toBe(email);
    expect((decoded as any)?.role).toBe(role);
  });

  it('should throw for an invalid JWT', async () => {
    // verifyJWT has no try/catch, so it propagates the jose error
    await expect(verifyJWT('invalid-jwt-token')).rejects.toThrow();
  });
});

describe('Auth Helpers - Reset Tokens', () => {
  it('should generate and verify a valid reset token', async () => {
    const email = 'test@example.com';
    const token = await generateResetToken(email);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const decodedEmail = await verifyResetToken(token);
    expect(decodedEmail).toBe(email);
  });

  it('should return null for an invalid token', async () => {
    const result = await verifyResetToken('invalid-token');
    expect(result).toBeNull();
  });
});
