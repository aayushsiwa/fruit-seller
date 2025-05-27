import React from "react";
import {
    Box,
    Button,
    IconButton,
    Tooltip,
    Avatar,
    Paper,
    TextField,
    InputAdornment,
    alpha,
} from "@mui/material";
import { FiShoppingCart, FiUser, FiSearch } from "react-icons/fi";
import { Badge } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DesktopNavProps } from "@/types";

export const DesktopNav: React.FC<DesktopNavProps> = ({
    user,
    router,
    searchQuery,
    getCartItemCount,
    setSearchQuery,
    handleSearch,
    handleProfileMenuOpen,
}) => {
    const theme = useTheme();

    return (
        <>
            <Box sx={{ display: "flex", ml: 4 }}>
                <Button
                    color="inherit"
                    onClick={() => router.push("/")}
                    sx={{
                        mx: 0.5,
                        borderRadius: 2,
                        "&:hover": {
                            backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.08
                            ),
                        },
                        ...(router.pathname === "/" && {
                            color: "primary.main",
                            fontWeight: 600,
                        }),
                    }}
                >
                    Home
                </Button>
                <Button
                    color="inherit"
                    onClick={() => router.push("/products")}
                    sx={{
                        mx: 0.5,
                        borderRadius: 2,
                        "&:hover": {
                            backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.08
                            ),
                        },
                        ...(router.pathname === "/products" && {
                            color: "primary.main",
                            fontWeight: 600,
                        }),
                    }}
                >
                    Products
                </Button>
            </Box>

            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    mx: { xs: 1, md: 4 },
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        display: "flex",
                        width: { xs: "100%", sm: "320px", md: "400px" },
                        borderRadius: 2,
                        p: "2px 4px",
                        alignItems: "center",
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        "&:hover": {
                            boxShadow: "0 1px 6px rgba(32, 33, 36, 0.12)",
                        },
                    }}
                >
                    <InputAdornment position="start" sx={{ pl: 1 }}>
                        <FiSearch
                            size={18}
                            color={theme.palette.text.secondary}
                        />
                    </InputAdornment>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                        }}
                        sx={{ ml: 1 }}
                    />
                </Paper>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Tooltip title="Shopping Cart">
                    <IconButton
                        color="inherit"
                        aria-label="cart"
                        onClick={() => router.push("/cart")}
                        sx={{
                            mx: 0.5,
                            "&:hover": {
                                backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.08
                                ),
                            },
                        }}
                    >
                        <Badge
                            badgeContent={getCartItemCount()}
                            color="primary"
                            sx={{
                                "& .MuiBadge-badge": {
                                    fontSize: "0.65rem",
                                    height: "18px",
                                    minWidth: "18px",
                                },
                            }}
                        >
                            <FiShoppingCart />
                        </Badge>
                    </IconButton>
                </Tooltip>

                {user ? (
                    <Tooltip title="Account">
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls="primary-account-menu"
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                            sx={{
                                ml: 0.5,
                                "&:hover": {
                                    backgroundColor: alpha(
                                        theme.palette.primary.main,
                                        0.08
                                    ),
                                },
                            }}
                        >
                            {user.image ? (
                                <Avatar
                                    src={user.image}
                                    alt={user.name || "User"}
                                    sx={{ width: 32, height: 32 }}
                                />
                            ) : (
                                <FiUser />
                            )}
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Box sx={{ display: "flex", ml: 1 }}>
                        <Button
                            color="inherit"
                            onClick={() => router.push("/login")}
                            sx={{
                                mr: 1,
                                borderRadius: 2,
                                "&:hover": {
                                    backgroundColor: alpha(
                                        theme.palette.primary.main,
                                        0.08
                                    ),
                                },
                            }}
                        >
                            Login
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => router.push("/register")}
                            sx={{
                                borderRadius: 2,
                                boxShadow: "none",
                                "&:hover": {
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                                },
                            }}
                        >
                            Register
                        </Button>
                    </Box>
                )}
            </Box>
        </>
    );
};
