import { useThemeSwitch } from '@/src/ThemeProvider';
import { SessionUser } from '@/types/index';
import {
  Avatar,
  Box,
  Collapse,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { Badge } from '@mui/material';
import React from 'react';
import {
  FiChevronDown,
  FiChevronUp,
  FiHome,
  FiLogIn,
  FiLogOut,
  FiMonitor,
  FiMoon,
  FiPackage,
  FiSearch,
  FiShield,
  FiShoppingCart,
  FiSun,
  FiX,
} from 'react-icons/fi';

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
  const { themeMode, setThemeMode } = useThemeSwitch();
  const [themeCollapseOpen, setThemeCollapseOpen] = React.useState(false);

  return (
    <Box sx={{ width: 280 }} role="presentation">
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
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
            display: 'flex',
            alignItems: 'center',
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Avatar
            src={user.image || ''}
            alt={user.name || 'User'}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {user.name || 'User'}
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
            onClick={() => handleNavigation('/')}
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
            onClick={() => handleNavigation('/products')}
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
            onClick={() => handleNavigation('/cart')}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon>
              <Badge badgeContent={getCartItemCount()} color="primary">
                <FiShoppingCart size={20} />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Cart" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setThemeCollapseOpen(!themeCollapseOpen)}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon>
              {themeMode === 'light' && <FiSun size={20} />}
              {themeMode === 'dark' && <FiMoon size={20} />}
              {themeMode === 'system' && <FiMonitor size={20} />}
            </ListItemIcon>
            <ListItemText primary={`Theme`} />
            {themeCollapseOpen ? <FiChevronUp /> : <FiChevronDown />}
          </ListItemButton>
        </ListItem>
        <Collapse in={themeCollapseOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <ListItemButton
              selected={themeMode === 'light'}
              onClick={() => setThemeMode('light')}
              sx={{ py: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <FiSun size={18} />
              </ListItemIcon>
              <ListItemText primary="Light" />
            </ListItemButton>
            <ListItemButton
              selected={themeMode === 'dark'}
              onClick={() => setThemeMode('dark')}
              sx={{ py: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <FiMoon size={18} />
              </ListItemIcon>
              <ListItemText primary="Dark" />
            </ListItemButton>
            <ListItemButton
              selected={themeMode === 'system'}
              onClick={() => setThemeMode('system')}
              sx={{ py: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <FiMonitor size={18} />
              </ListItemIcon>
              <ListItemText primary="System" />
            </ListItemButton>
          </List>
        </Collapse>

        <Divider sx={{ my: 1 }} />

        {isAdmin && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/admin')}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon>
                <FiShield size={20} />
              </ListItemIcon>
              <ListItemText primary="Admin Dashboard" />
            </ListItemButton>
          </ListItem>
        )}
        {user && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <FiLogOut size={20} />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
        {!user && (
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigation('/login')}
                sx={{ py: 1.5 }}
              >
                <ListItemIcon>
                  <FiLogIn size={20} />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );
};

export interface DrawerContentProps {
  user: SessionUser['user'] | undefined;
  searchQuery: string;
  getCartItemCount: () => number;
  isAdmin: boolean;
  setSearchQuery: (value: string) => void;
  handleDrawerToggle: () => void;
  handleSearch: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleNavigation: (path: string) => void;
  handleLogout: () => void;
}
