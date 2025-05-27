import React from "react";
import {
    Menu,
    MenuItem,
    Box,
    Avatar,
    Typography,
    Divider,
    ListItemIcon,
    Fade,
} from "@mui/material";
import { FiUser, FiHeart, FiPackage, FiShield, FiLogOut } from "react-icons/fi";
import { ProfileMenuProps } from "@/types";

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
    user,
    anchorEl,
    isAdmin,
    handleMenuClose,
    handleNavigation,
    handleLogout,
}) => {
    return (
        <Menu
            anchorEl={anchorEl}
            id="primary-account-menu"
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            TransitionComponent={Fade}
            PaperProps={{
                elevation: 3,
                sx: {
                    borderRadius: 2,
                    minWidth: 180,
                    mt: 1,
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                    "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                    },
                },
            }}
        >
            {user && (
                <Box
                    sx={{
                        px: 2,
                        py: 1.5,
                        display: "flex",
                        alignItems: "center",
                        borderBottom: (theme) =>
                            `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Avatar
                        src={user.image || ""}
                        alt={user.name || "User"}
                        sx={{ width: 32, height: 32, mr: 1.5 }}
                    />
                    <Box>
                        <Typography
                            variant="subtitle2"
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
            <MenuItem
                onClick={() => {
                    handleMenuClose();
                    handleNavigation("/profile");
                }}
                sx={{ py: 1.5 }}
            >
                <ListItemIcon>
                    <FiUser size={18} />
                </ListItemIcon>
                Profile
            </MenuItem>
            <MenuItem
                onClick={() => {
                    handleMenuClose();
                    handleNavigation("/favorites");
                }}
                sx={{ py: 1.5 }}
            >
                <ListItemIcon>
                    <FiHeart size={18} />
                </ListItemIcon>
                Favorites
            </MenuItem>
            <MenuItem
                onClick={() => {
                    handleMenuClose();
                    handleNavigation("/orders");
                }}
                sx={{ py: 1.5 }}
            >
                <ListItemIcon>
                    <FiPackage size={18} />
                </ListItemIcon>
                My Orders
            </MenuItem>
            {isAdmin && (
                <MenuItem
                    onClick={() => {
                        handleMenuClose();
                        handleNavigation("/admin");
                    }}
                    sx={{ py: 1.5 }}
                >
                    <ListItemIcon>
                        <FiShield size={18} />
                    </ListItemIcon>
                    Admin Dashboard
                </MenuItem>
            )}
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                <ListItemIcon>
                    <FiLogOut size={18} />
                </ListItemIcon>
                Logout
            </MenuItem>
        </Menu>
    );
};
