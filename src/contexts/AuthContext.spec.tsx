import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/src/contexts/AuthContext";
import * as nextAuth from "next-auth/react";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
        mutations: {
            retry: false,
        },
    },
});

const Wrapper: React.FC<{
    children: React.ReactNode;
    session?: { user: { email: string; role: string } } | null;
    status?: "authenticated" | "loading" | "unauthenticated";
}> = ({ children, session = null }) => {
    const sessionWithExpires = session
        ? {
              ...session,
              expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
          }
        : null;

    return (
        <SessionProvider session={sessionWithExpires}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>{children}</AuthProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
};

const TestComponent = () => {
    const { user, loading, error, register, login, logout, isAdmin } =
        useAuth();

    return (
        <div>
            <div>User: {user?.email || "none"}</div>
            <div>Loading: {loading.toString()}</div>
            <div>Error: {error || "none"}</div>
            <div>Is Admin: {isAdmin() ? "yes" : "no"}</div>
            <button
                onClick={() =>
                    register({
                        firstName: "Test",
                        lastName: "User",
                        email: "test@example.com",
                        password: "pass",
                    })
                }
            >
                Register
            </button>
            <button onClick={() => login("test@example.com", "pass")}>
                Login
            </button>
            <button onClick={() => logout()}>Logout</button>
        </div>
    );
};

describe("AuthProvider", () => {
    it("provides user data and admin check when authenticated", async () => {
        jest.spyOn(nextAuth, "useSession").mockReturnValue({
            data: {
                user: { email: "admin@example.com", role: "admin" },
                expires: new Date(Date.now() + 1000 * 60 * 60).toString(),
            },
            status: "authenticated",
            update: jest.fn(),
        });

        render(
            <Wrapper
                session={{
                    user: { email: "admin@example.com", role: "admin" },
                }}
                status="authenticated"
            >
                <TestComponent />
            </Wrapper>
        );

        await waitFor(
            () => {
                expect(
                    screen.getByText(/User: admin@example.com/i)
                ).toBeInTheDocument();
                expect(screen.getByText(/Loading: false/i)).toBeInTheDocument();
                expect(screen.getByText(/Error: none/i)).toBeInTheDocument();
                expect(screen.getByText(/Is Admin: yes/i)).toBeInTheDocument();
            },
            { timeout: 1000, interval: 50 }
        );
    });

    it("displays loading state", async () => {
        jest.spyOn(nextAuth, "useSession").mockReturnValue({
            data: null,
            status: "loading",
            update: jest.fn(),
        });

        render(
            <Wrapper status="loading">
                <TestComponent />
            </Wrapper>
        );

        await waitFor(
            () => {
                expect(screen.getByText(/User: none/i)).toBeInTheDocument();
                expect(screen.getByText(/Loading: true/i)).toBeInTheDocument();
                expect(screen.getByText(/Error: none/i)).toBeInTheDocument();
                expect(screen.getByText(/Is Admin: no/i)).toBeInTheDocument();
            },
            { timeout: 1000, interval: 50 }
        );
    });

    it("displays unauthenticated state", async () => {
        jest.spyOn(nextAuth, "useSession").mockReturnValue({
            data: null,
            status: "unauthenticated",
            update: jest.fn(),
        });

        render(
            <Wrapper>
                <TestComponent />
            </Wrapper>
        );

        await waitFor(
            () => {
                expect(screen.getByText(/User: none/i)).toBeInTheDocument();
                expect(screen.getByText(/Loading: false/i)).toBeInTheDocument();
                expect(screen.getByText(/Error: none/i)).toBeInTheDocument();
                expect(screen.getByText(/Is Admin: no/i)).toBeInTheDocument();
            },
            { timeout: 1000, interval: 50 }
        );
    });

    it("handles register success", async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: {} });
        const signInSpy = jest.spyOn(nextAuth, "signIn").mockResolvedValue({
            error: null,
            status: 200,
            ok: true,
            url: "",
        });

        render(
            <Wrapper>
                <TestComponent />
            </Wrapper>
        );

        await userEvent.click(screen.getByText("Register"));

        await waitFor(
            () => {
                expect(mockedAxios.post).toHaveBeenCalledWith(
                    "/api/auth/register",
                    {
                        firstName: "Test",
                        lastName: "User",
                        email: "test@example.com",
                        password: "pass",
                    },
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                );
                expect(signInSpy).not.toHaveBeenCalled();
                expect(screen.getByText(/Error: none/i)).toBeInTheDocument();
            },
            { timeout: 2000, interval: 50 }
        );
    });

    it("handles register failure", async () => {
        mockedAxios.post.mockRejectedValueOnce({
            response: { data: { message: "Registration failed" }, status: 400 },
        });
        const signInSpy = jest.spyOn(nextAuth, "signIn");

        render(
            <Wrapper>
                <TestComponent />
            </Wrapper>
        );

        await userEvent.click(screen.getByText("Register"));

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith(
                "/api/auth/register",
                {
                    firstName: "Test",
                    lastName: "User",
                    email: "test@example.com",
                    password: "pass",
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            expect(signInSpy).not.toHaveBeenCalled();
            expect(
                screen.getByText(/Error: /i)
            ).toBeInTheDocument();
        });
    });

    it("handles login success", async () => {
        const signInSpy = jest.spyOn(nextAuth, "signIn").mockResolvedValue({
            error: null,
            status: 200,
            ok: true,
            url: "",
        });

        render(
            <Wrapper>
                <TestComponent />
            </Wrapper>
        );

        await userEvent.click(screen.getByText("Login"));

        await waitFor(
            () => {
                expect(signInSpy).toHaveBeenCalledWith("credentials", {
                    redirect: false,
                    email: "test@example.com",
                    password: "pass",
                });
                expect(screen.getByText(/Error: none/i)).toBeInTheDocument();
            },
            { timeout: 2000, interval: 50 }
        );
    });

    it("handles login failure", async () => {
        const signInSpy = jest.spyOn(nextAuth, "signIn").mockResolvedValue({
            error: "Invalid credentials",
            status: 401,
            ok: false,
            url: "",
        });

        render(
            <Wrapper>
                <TestComponent />
            </Wrapper>
        );

        await expect(
            userEvent.click(screen.getByText("Login"))
        ).resolves.toBeUndefined();

        await waitFor(
            () => {
                expect(signInSpy).toHaveBeenCalledWith("credentials", {
                    redirect: false,
                    email: "test@example.com",
                    password: "pass",
                });
                expect(
                    screen.getByText(/Error: Invalid credentials/i)
                ).toBeInTheDocument();
            },
            { timeout: 2000, interval: 50 }
        );
    });

    it("handles logout success", async () => {
        const signOutSpy = jest
            .spyOn(nextAuth, "signOut")
            .mockResolvedValue(undefined);

        render(
            <Wrapper>
                <TestComponent />
            </Wrapper>
        );

        await userEvent.click(screen.getByText("Logout"));

        await waitFor(
            () => {
                expect(signOutSpy).toHaveBeenCalledWith({ redirect: false });
                expect(screen.getByText(/Error: none/i)).toBeInTheDocument();
            },
            { timeout: 2000, interval: 50 }
        );
    });

    it("handles logout failure", async () => {
        const signOutSpy = jest
            .spyOn(nextAuth, "signOut")
            .mockRejectedValue(new Error("Logout error"));

        render(
            <Wrapper>
                <TestComponent />
            </Wrapper>
        );

        await expect(
            userEvent.click(screen.getByText("Logout"))
        ).resolves.toBeUndefined();

        await waitFor(() => {
            expect(signOutSpy).toHaveBeenCalledWith({ redirect: false });
            expect(
                screen.getByText(/Error: Logout error/i)
            ).toBeInTheDocument();
        });
    });
});
