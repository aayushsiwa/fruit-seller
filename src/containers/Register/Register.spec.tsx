import { render, screen } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import Register from "./Register";

const mockSignIn = jest.fn();
const mockRouterPush = jest.fn();
const mockShowSnackbar = jest.fn();
const mockRegister = jest.fn();
const mockLogin = jest.fn();

const mockMutateAsync = jest.fn();
const mockUseMutation = jest.fn(() => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
}));

let capturedRegisterOnSubmit:
    | ((
          values: Record<string, unknown>,
          helpers: { setSubmitting: (v: boolean) => void }
      ) => Promise<void>)
    | undefined;

const mockFormik = {
    values: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
    },
    touched: {} as Record<string, boolean>,
    errors: {} as Record<string, string>,
    handleSubmit: jest.fn(),
    handleChange: jest.fn(),
    handleBlur: jest.fn(),
    isSubmitting: false,
};

const mockUseFormik = jest.fn(
    ({
        onSubmit,
    }: {
        onSubmit: (
            values: Record<string, unknown>,
            helpers: { setSubmitting: (v: boolean) => void }
        ) => Promise<void>;
    }) => {
        capturedRegisterOnSubmit = onSubmit;
        return mockFormik;
    }
);

jest.mock("next-auth/react", () => ({
    signIn: (...args: unknown[]) => (mockSignIn as (...args: unknown[]) => unknown)(...args),
}));

jest.mock("next/router", () => ({
    useRouter: () => ({ push: mockRouterPush }),
}));

jest.mock("formik", () => ({
    useFormik: (args: unknown) => mockUseFormik(args as { onSubmit: (values: Record<string, unknown>, helpers: { setSubmitting: (v: boolean) => void }) => Promise<void> }),
}));

jest.mock("@tanstack/react-query", () => ({
    useMutation: () => mockUseMutation(),
}));

jest.mock("@/src/contexts/SnackBarContext", () => ({
    useSnackbar: () => ({ showSnackbar: mockShowSnackbar }),
}));

jest.mock("@/src/contexts/AuthContext", () => ({
    useAuth: () => ({ register: mockRegister, login: mockLogin }),
}));

jest.mock("@/lib/validation/registerSchema", () => ({
    registerInitialValues: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
    },
    registerSchema: { validate: jest.fn() },
}));

jest.mock("react-icons/fi", () => ({
    FiEye: () => <svg data-testid="FiEye" />,
    FiEyeOff: () => <svg data-testid="FiEyeOff" />,
}));

jest.mock("react-icons/tb", () => ({
    TbBrandGoogle: () => <svg data-testid="TbBrandGoogle" />,
}));

jest.mock("@mui/styles", () => ({
    makeStyles: () => () => ({}),
}));

jest.mock("next/link", () => {
    const MockLink = ({
        children,
        href,
    }: {
        children: React.ReactNode;
        href: string;
    }) => <a href={href}>{children}</a>;
    MockLink.displayName = "MockLink";
    return MockLink;
});

const mockUseRegisterReturn = jest.fn();
jest.mock("./Register.hooks", () => ({
    __esModule: true,
    default: (...args: unknown[]) => mockUseRegisterReturn(...args),
}));

describe("Register - Hooks", () => {
    let useRegister: typeof import("./Register.hooks").default;

    beforeAll(() => {
        useRegister = jest.requireActual("./Register.hooks").default;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        capturedRegisterOnSubmit = undefined;
    });

    it("should call register on form submission", async () => {
        mockRegister.mockResolvedValue(undefined);

        renderHook(() => useRegister());

        await act(async () => {
            await capturedRegisterOnSubmit!(
                {
                    firstName: "John",
                    lastName: "Doe",
                    email: "john@example.com",
                    password: "Pass123!",
                    confirmPassword: "Pass123!",
                    agreeTerms: true,
                },
                { setSubmitting: jest.fn() }
            );
        });

        expect(mockRegister).toHaveBeenCalledWith({
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            password: "Pass123!",
        });
    });

    it("should call signIn on handleGoogleSignIn", async () => {
        mockSignIn.mockResolvedValue(undefined);

        const { result } = renderHook(() => useRegister());

        await act(async () => {
            await result.current.handleGoogleSignIn();
        });

        expect(mockSignIn).toHaveBeenCalledWith("google", {
            callbackUrl: "/",
        });
    });

    it("should toggle showPassword", () => {
        const { result } = renderHook(() => useRegister());

        expect(result.current.showPassword).toBe(false);

        act(() => {
            result.current.handleClickShowPassword();
        });

        expect(result.current.showPassword).toBe(true);
    });
});

describe("Register - UI", () => {
    const buildMockReturn = (overrides: Record<string, unknown> = {}) => ({
        formik: {
            values: {
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
                agreeTerms: false,
            },
            touched: {} as Record<string, boolean>,
            errors: {} as Record<string, string>,
            handleSubmit: jest.fn(),
            handleChange: jest.fn(),
            handleBlur: jest.fn(),
            isSubmitting: false,
            ...(overrides.formik as Record<string, unknown> || {}),
        },
        showPassword: false,
        handleClickShowPassword: jest.fn(),
        handleGoogleSignIn: jest.fn(),
        isLoading: false,
        isGoogleLoading: false,
        ...overrides,
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseRegisterReturn.mockReturnValue(buildMockReturn());
    });

    it("should render loading state", () => {
        mockUseRegisterReturn.mockReturnValue(
            buildMockReturn({ isLoading: true })
        );

        render(<Register />);
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("should match snapshot", () => {
        const { asFragment } = render(<Register />);
        expect(asFragment()).toMatchSnapshot();
    });

    it("should show Google loading state", () => {
        mockUseRegisterReturn.mockReturnValue(
            buildMockReturn({ isGoogleLoading: true })
        );

        render(<Register />);
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
});
