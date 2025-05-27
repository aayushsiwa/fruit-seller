import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { SnackbarContextType, SnackbarSeverity } from "@/types";

const SnackbarContext = createContext<SnackbarContextType | undefined>(
    undefined
);

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error("useSnackbar must be used within a SnackbarProvider");
    }
    return context;
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState<SnackbarSeverity>("success");

    const showSnackbar = (msg: string, sev: SnackbarSeverity = "success") => {
        setMessage(msg);
        setSeverity(sev);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    sx={{ width: "100%" }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};
