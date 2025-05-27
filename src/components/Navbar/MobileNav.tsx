import React from "react";
import { IconButton, Button, Box } from "@mui/material";
import { FiMenu } from "react-icons/fi";
import { MobileNavProps } from "@/types";

export const MobileNav: React.FC<MobileNavProps> = ({
    user,
    router,
    handleDrawerToggle,
}) => {
    return (
        <>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
            >
                <FiMenu />
            </IconButton>

            {!user && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => router.push("/login")}
                        sx={{
                            ml: 1,
                            borderRadius: 2,
                            minWidth: "unset",
                            boxShadow: "none",
                            position: "absolute",
                            right: 0,
                            top: "25%",
                            "&:hover": {
                                boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                            },
                        }}
                    >
                        Login
                    </Button>
                </Box>
            )}
        </>
    );
};
