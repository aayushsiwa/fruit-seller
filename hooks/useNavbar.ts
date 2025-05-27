import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/src/contexts/CartContext";

export const useNavbar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const { getCartItemCount } = useCart() || { getCartItemCount: () => 0 };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProfileMenuOpen = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleDrawerToggle = useCallback(() => {
    setDrawerOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    signOut();
    handleMenuClose();
    setDrawerOpen(false);
  }, [handleMenuClose]);

  const handleSearch = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && searchQuery.trim()) {
        router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
        setDrawerOpen(false);
        setSearchQuery("");
      }
    },
    [router, searchQuery]
  );

  const handleNavigation = useCallback(
    (path: string) => {
      router.push(path);
      setDrawerOpen(false);
    },
    [router]
  );

  const isAdmin = user?.role === "admin";

  return {
    user,
    router,
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
  };
};