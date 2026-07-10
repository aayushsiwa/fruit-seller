import bcrypt from 'bcryptjs';
import { decode, encode } from 'next-auth/jwt';

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-custom-jwt-secret-with-long-length-32';

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const comparePassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export const generateJWT = async (email: string, role: string) => {
  const token = await encode({
    token: { email, role },
    secret: JWT_SECRET,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return token!;
};

export const verifyJWT = async (token: string) => {
  const decoded = await decode({
    token,
    secret: JWT_SECRET,
  });
  return decoded ?? null;
};

export const generateResetToken = async (email: string) => {
  const token = await encode({
    token: { email, type: 'reset' },
    secret: JWT_SECRET,
    maxAge: 60 * 60, // 1 hour
  });
  return token!;
};

export const verifyResetToken = async (token: string) => {
  try {
    const decoded = await decode({
      token,
      secret: JWT_SECRET,
    });
    if (decoded?.type === 'reset') {
      return decoded.email as string;
    }
    return null;
  } catch {
    return null;
  }
};
