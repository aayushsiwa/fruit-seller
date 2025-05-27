import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import { theme, darkTheme } from "@/src/theme";
import { ThemeSwitchContextType } from "@/types";

const ThemeSwitchContext = createContext<ThemeSwitchContextType>({
    isDarkMode: false,
    toggleTheme: () => {},
});

export const useThemeSwitch = () => useContext(ThemeSwitchContext);

export const ThemeSwitchProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const [isDarkMode, setIsDarkMode] = useState(prefersDarkMode);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setIsDarkMode(savedTheme === "dark");
        } else {
            setIsDarkMode(prefersDarkMode);
        }
    }, [prefersDarkMode]);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");
    };

    const selectedTheme = useMemo(
        () => (isDarkMode ? darkTheme : theme),
        [isDarkMode]
    );

    return (
        <ThemeSwitchContext.Provider value={{ isDarkMode, toggleTheme }}>
            <ThemeProvider theme={selectedTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeSwitchContext.Provider>
    );
};
