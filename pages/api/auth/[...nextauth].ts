import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";
import { comparePassword } from "@/lib/auth";
import type { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "openid email profile",
                },
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    return null;
                }

                try {
                    const { data: user, error } = await supabase
                        .from("fruitsellerusers")
                        .select("*")
                        .eq("email", credentials.email)
                        .single();

                    if (error || !user) {
                        console.log("User not found or query error:", error);
                        return null;
                    }

                    const isValid = await comparePassword(
                        credentials.password,
                        user.password
                    );

                    if (!isValid) {
                        console.log("Invalid password");
                        return null;
                    }

                    const safeUser = { ...user };
                    delete safeUser.password;
                    return safeUser;
                } catch (error) {
                    console.error("Authorize error:", error);
                    return null;
                }
            },
        }),
    ],

    callbacks: {
        async signIn({ user, account }) {
            try {
                if (account?.provider === "google") {
                    console.log("Google Sign-In: Checking user", user.email);
                    const { data: existingUser, error } = await supabase
                        .from("fruitsellerusers")
                        .select("*")
                        .eq("email", user.email!)
                        .single();

                    if (error && error.code !== "PGRST116") {
                        console.error("Supabase query error:", error);
                        return false;
                    }

                    const userExists = !!existingUser;

                    if (!userExists) {
                        const { error: userError } = await supabase
                            .from("fruitsellerusers")
                            .insert({
                                email: user.email,
                                first_name: user.name?.split(" ")[0] || "",
                                last_name:
                                    user.name?.split(" ").slice(1).join(" ") ||
                                    "",
                                role: "buyer",
                                provider: "google",
                                provider_id: user.id,
                            });

                        if (userError) {
                            console.error("Failed to create user:", userError);
                            return false;
                        }
                    }
                }
                return true;
            } catch (error) {
                console.error("Sign in error:", error);
                return false;
            }
        },

        async jwt({ token, user, account }) {
            if (user && account) {
                console.log("JWT callback: Fetching user", user.email);
                const { data: supabaseUser, error } = await supabase
                    .from("fruitsellerusers")
                    .select("*")
                    .eq("email", user.email!)
                    .single();

                if (error) {
                    console.error("JWT callback error:", error);
                } else if (supabaseUser) {
                    token.id = supabaseUser.id;
                    token.role = supabaseUser.role;
                    token.cart_id = supabaseUser.cart_id;
                    token.email = supabaseUser.email;
                    token.name =
                        `${supabaseUser.first_name} ${supabaseUser.last_name}`.trim();
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role as string;
                session.user.cart_id = token.cart_id as string;
            }
            return session;
        },
    },

    pages: {
        signIn: "/login",
        error: "/auth/error",
    },

    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },

    secret: process.env.NEXTAUTH_SECRET,

    debug: process.env.NODE_ENV === "development",

    cookies: {
        state: {
            name: `next-auth.state`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
                maxAge: 15 * 60,
            },
        },
        callbackUrl: {
            name: `next-auth.callback-url`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
                maxAge: 15 * 60,
            },
        },
        csrfToken: {
            name: `next-auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
                maxAge: 15 * 60,
            },
        },
    },
};

export default NextAuth(authOptions);
