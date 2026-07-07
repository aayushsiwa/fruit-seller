import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import { theme, darkTheme } from "@/src/theme";
import { ThemeSwitchContextType, ThemeMode } from "@/types/index";

const ThemeSwitchContext = createContext<ThemeSwitchContextType>({
    isDarkMode: false,
    toggleTheme: () => {},
    themeMode: "system",
    setThemeMode: () => {},
});

export const useThemeSwitch = () => useContext(ThemeSwitchContext);

export const ThemeSwitchProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const [themeMode, setThemeModeState] = useState<ThemeMode>("system");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
        if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
            setThemeModeState(savedTheme);
        } else {
            setThemeModeState("system");
        }
    }, []);

    const isDarkMode = useMemo(() => {
        if (themeMode === "system") {
            return prefersDarkMode;
        }
        return themeMode === "dark";
    }, [themeMode, prefersDarkMode]);

    const setThemeMode = (mode: ThemeMode) => {
        setThemeModeState(mode);
        localStorage.setItem("theme", mode);
    };

    const toggleTheme = () => {
        const newMode = isDarkMode ? "light" : "dark";
        setThemeMode(newMode);
    };

    const selectedTheme = useMemo(
        () => (isDarkMode ? darkTheme : theme),
        [isDarkMode]
    );

    return (
        <ThemeSwitchContext.Provider value={{ isDarkMode, toggleTheme, themeMode, setThemeMode }}>
            <ThemeProvider theme={selectedTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeSwitchContext.Provider>
    );
};
