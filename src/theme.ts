import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#ff6b6b",
            light: "#ff9999",
            dark: "#cc5555",
            contrastText: "#fff",
        },
        secondary: {
            main: "#4ecdc4",
            light: "#7effff",
            dark: "#009b94",
            contrastText: "#000",
        },
        background: {
            default: "#f8f9fa",
            paper: "#ffffff",
        },
        error: {
            main: "#f44336",
        },
        warning: {
            main: "#ff9800",
        },
        info: {
            main: "#2196f3",
        },
        success: {
            main: "#4caf50",
        },
        text: {
            primary: "#333333",
            secondary: "#666666",
        },
    },
    typography: {
        fontFamily: [
            "Poppins",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
        ].join(","),
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 600,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 500,
        },
        h6: {
            fontWeight: 500,
        },
        button: {
            fontWeight: 600,
            textTransform: "none",
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
                    borderRadius: 12,
                },
            },
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#ff8787",
            light: "#ffb3b3",
            dark: "#cc4c4c",
            contrastText: "#fff",
        },
        secondary: {
            main: "#66d7d1",
            light: "#99e6e3",
            dark: "#33a6a0",
            contrastText: "#000",
        },
        background: {
            default: "#1a1a1a",
            paper: "#2a2a2a",
        },
        error: {
            main: "#ef5350",
        },
        warning: {
            main: "#ffa726",
        },
        info: {
            main: "#42a5f5",
        },
        success: {
            main: "#66bb6a",
        },
        text: {
            primary: "#e0e0e0",
            secondary: "#a0a0a0",
        },
    },
    typography: {
        fontFamily: [
            "Poppins",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
        ].join(","),
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 600,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 500,
        },
        h6: {
            fontWeight: 500,
        },
        button: {
            fontWeight: 600,
            textTransform: "none",
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "0px 2px 4px rgba(255, 255, 255, 0.1)",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                    borderRadius: 12,
                },
            },
        },
    },
});
