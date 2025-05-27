import bcrypt from "bcryptjs";
import { encode, decode } from "next-auth/jwt";

const JWT_SECRET = String(process.env.JWT_SECRET);

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
    return decoded?.token ?? null;
};
