import * as Yup from "yup";

export const registerSchema = Yup.object({
    firstName: Yup.string()
        .required("First name is required")
        .min(2, "First name must be at least 2 characters")
        .matches(/^[a-zA-Z]+$/, "First name can only contain letters")
        .trim(),
    lastName: Yup.string()
        .required("Last name is required")
        .min(2, "Last name must be at least 2 characters")
        .matches(/^[a-zA-Z]+$/, "Last name can only contain letters")
        .trim(),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required")
        .trim()
        .lowercase(),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must be at least 8 characters, include uppercase, lowercase, a number, a special character (@$!%*?&), and contain no spaces or unsafe characters"
        ),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    agreeTerms: Yup.boolean().oneOf(
        [true],
        "You must accept the terms and conditions"
    ),
});

export const registerInitialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
};
