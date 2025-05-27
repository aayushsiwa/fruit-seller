import React from "react";
import {
    Box,
    Typography,
    IconButton,
    TextField,
    InputAdornment,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Divider,
    Avatar,
} from "@mui/material";
import {
    FiHome,
    FiPackage,
    FiShoppingCart,
    FiShield,
    FiLogOut,
    FiSearch,
    FiX,
} from "react-icons/fi";
import { signIn } from "next-auth/react";
import { Badge } from "@mui/material";
import { DrawerContentProps } from "@/types";

export const DrawerContent: React.FC<DrawerContentProps> = ({
    user,
    searchQuery,
    getCartItemCount,
    isAdmin,
    setSearchQuery,
    handleDrawerToggle,
    handleSearch,
    handleNavigation,
    handleLogout,
}) => {
    return (
        <Box sx={{ width: 280 }} role="presentation">
            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: (theme) =>
                        `1px solid ${theme.palette.divider}`,
                }}
            >
                <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: 700 }}
                >
                    Fruit Seller
                </Typography>
                <IconButton onClick={handleDrawerToggle} edge="end">
                    <FiX />
                </IconButton>
            </Box>

            {user && (
                <Box
                    sx={{
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        borderBottom: (theme) =>
                            `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Avatar
                        src={user.image || ""}
                        alt={user.name || "User"}
                        sx={{ width: 40, height: 40, mr: 2 }}
                    />
                    <Box>
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold" }}
                        >
                            {user.name || "User"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {user.email}
                        </Typography>
                    </Box>
                </Box>
            )}

            <Box sx={{ p: 2 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FiSearch size={18} />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 2 },
                    }}
                />
            </Box>

            <List sx={{ pt: 0 }}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => handleNavigation("/")}
                        sx={{ py: 1.5 }}
                    >
                        <ListItemIcon>
                            <FiHome size={20} />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => handleNavigation("/products")}
                        sx={{ py: 1.5 }}
                    >
                        <ListItemIcon>
                            <FiPackage size={20} />
                        </ListItemIcon>
                        <ListItemText primary="Products" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => handleNavigation("/cart")}
                        sx={{ py: 1.5 }}
                    >
                        <ListItemIcon>
                            <Badge
                                badgeContent={getCartItemCount()}
                                color="primary"
                            >
                                <FiShoppingCart size={20} />
                            </Badge>
                        </ListItemIcon>
                        <ListItemText primary="Cart" />
                    </ListItemButton>
                </ListItem>
                <Divider sx={{ my: 1 }} />

                {!user ? (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => signIn("email")}
                                sx={{
                                    py: 1.5,
                                    color: (theme) =>
                                        theme.palette.primary.main,
                                }}
                            >
                                <ListItemText primary="Login with Email" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => signIn("google")}
                                sx={{
                                    py: 1.5,
                                    color: (theme) =>
                                        theme.palette.primary.main,
                                }}
                            >
                                <ListItemText primary="Login with Google" />
                            </ListItemButton>
                        </ListItem>
                    </>
                ) : (
                    <>
                        {isAdmin && (
                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={() => handleNavigation("/admin")}
                                    sx={{ py: 1.5 }}
                                >
                                    <ListItemIcon>
                                        <FiShield size={20} />
                                    </ListItemIcon>
                                    <ListItemText primary="Admin Dashboard" />
                                </ListItemButton>
                            </ListItem>
                        )}
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={handleLogout}
                                sx={{ py: 1.5 }}
                            >
                                <ListItemIcon>
                                    <FiLogOut size={20} />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );
};
