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
import {
  FiUser,
  FiHeart,
  FiPackage,
  FiShield,
  FiLogOut,
  FiSun,
  FiMoon,
  FiMonitor,
  FiChevronRight,
  FiChevronDown,
} from "react-icons/fi";
import { ProfileMenuProps } from "@/types/index";
import { useThemeSwitch } from "@/src/ThemeProvider";
import { theme } from "@/src/theme";

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  user,
  anchorEl,
  isAdmin,
  handleMenuClose,
  handleNavigation,
  handleLogout,
}) => {
  const { themeMode, setThemeMode } = useThemeSwitch();
  const [themeMenuAnchorEl, setThemeMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const handleThemeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setThemeMenuAnchorEl(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setThemeMenuAnchorEl(null);
  };

  const handleParentClose = () => {
    handleThemeMenuClose();
    handleMenuClose();
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        id="primary-account-menu"
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleParentClose}
        TransitionComponent={Fade}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 220,
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
        {user ? (
          <>
            <Box
              sx={{
                px: 2,
                py: 1.5,
                display: "flex",
                alignItems: "center",
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Avatar
                src={user.image || ""}
                alt={user.name || "User"}
                sx={{ width: 32, height: 32, mr: 1.5 }}
              />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  {user.name || "User"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>

            <MenuItem
              onClick={() => {
                handleParentClose();
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
                handleParentClose();
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
                handleParentClose();
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
                  handleParentClose();
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
          </>
        ) : (
          <>
            <MenuItem
              onClick={() => {
                handleParentClose();
                handleNavigation("/login");
              }}
              sx={{ py: 1.5 }}
            >
              Login
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleParentClose();
                handleNavigation("/register");
              }}
              sx={{ py: 1.5, color: theme.palette.primary.main }}
            >
              Register
            </MenuItem>
          </>
        )}

        <Divider />

        <MenuItem
          onClick={handleThemeMenuOpen}
          sx={{ py: 1.5, display: "flex", justifyContent: "space-between" }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ListItemIcon>
              {themeMode === "light" && <FiSun size={18} />}
              {themeMode === "dark" && <FiMoon size={18} />}
              {themeMode === "system" && <FiMonitor size={18} />}
            </ListItemIcon>
            Theme
          </Box>
          {Boolean(themeMenuAnchorEl) ? (
            <FiChevronDown size={14} color="action.active" />
          ) : (
            <FiChevronRight size={14} color="action.active" />
          )}
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={themeMenuAnchorEl}
        id="theme-submenu"
        keepMounted
        open={Boolean(themeMenuAnchorEl)}
        onClose={handleThemeMenuClose}
        TransitionComponent={Fade}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 120,
            ml: 0.5,
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
          },
        }}
      >
        <MenuItem
          selected={themeMode === "light"}
          onClick={() => {
            setThemeMode("light");
            handleParentClose();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon>
            <FiSun size={16} />
          </ListItemIcon>
          Light
        </MenuItem>
        <MenuItem
          selected={themeMode === "dark"}
          onClick={() => {
            setThemeMode("dark");
            handleParentClose();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon>
            <FiMoon size={16} />
          </ListItemIcon>
          Dark
        </MenuItem>
        <MenuItem
          selected={themeMode === "system"}
          onClick={() => {
            setThemeMode("system");
            handleParentClose();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon>
            <FiMonitor size={16} />
          </ListItemIcon>
          System
        </MenuItem>
      </Menu>
    </>
  );
};
