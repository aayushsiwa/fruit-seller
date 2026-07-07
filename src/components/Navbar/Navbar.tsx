import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Drawer,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { alpha } from "@mui/material";
import { useNavbar } from "@/hooks/useNavbar";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { ProfileMenu } from "./ProfileMenu";
import { DrawerContent } from "./DrawerContent";

export const Navbar: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const router = useRouter();
    const {
        user,
        isScrolled,
        anchorEl,
        drawerOpen,
        searchQuery,
        getCartItemCount,
        isAdmin,
        setSearchQuery,
        handleProfileMenuOpen,
        handleMenuClose,
        handleDrawerToggle,
        handleLogout,
        handleSearch,
        handleNavigation,
    } = useNavbar();

    return (
        <>
            <AppBar
                position="sticky"
                color="default"
                elevation={isScrolled ? 2 : 0}
                sx={{
                    bgcolor: isScrolled ? "background.paper" : "transparent",
                    transition: "all 0.3s ease",
                    backdropFilter: isScrolled ? "blur(10px)" : "none",
                    borderBottom: isScrolled
                        ? "none"
                        : `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ py: isSmall ? 1 : 0.5 }}>
                        {isMobile ? (
                            <>
                                <MobileNav
                                    user={user}
                                    router={router}
                                    handleDrawerToggle={handleDrawerToggle}
                                />
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        color: "primary.main",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        fontSize: {
                                            xs: "1.1rem",
                                            sm: "1.25rem",
                                        },
                                    }}
                                    onClick={() => router.push("/")}
                                >
                                    Fruit Seller
                                </Typography>
                            </>
                        ) : (
                            <>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        color: "primary.main",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        fontSize: {
                                            xs: "1.1rem",
                                            sm: "1.25rem",
                                        },
                                    }}
                                    onClick={() => router.push("/")}
                                >
                                    Fruit Seller
                                </Typography>
                                <DesktopNav
                                    user={user}
                                    router={router}
                                    searchQuery={searchQuery}
                                    getCartItemCount={getCartItemCount}
                                    setSearchQuery={setSearchQuery}
                                    handleSearch={handleSearch}
                                    handleProfileMenuOpen={
                                        handleProfileMenuOpen
                                    }
                                />
                            </>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            <ProfileMenu
                user={user}
                anchorEl={anchorEl}
                isAdmin={isAdmin}
                handleMenuClose={handleMenuClose}
                handleNavigation={handleNavigation}
                handleLogout={handleLogout}
            />

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                PaperProps={{
                    sx: {
                        borderRadius: "0 16px 16px 0",
                        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
                    },
                }}
            >
                <DrawerContent
                    user={user}
                    searchQuery={searchQuery}
                    getCartItemCount={getCartItemCount}
                    isAdmin={isAdmin}
                    setSearchQuery={setSearchQuery}
                    handleDrawerToggle={handleDrawerToggle}
                    handleSearch={handleSearch}
                    handleNavigation={handleNavigation}
                    handleLogout={handleLogout}
                />
            </Drawer>
        </>
    );
};

export default Navbar;
