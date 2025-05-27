import { useState, useCallback } from "react";
import { TabValue } from "@/types";

export const useAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabValue>(TabValue.PRODUCTS);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: TabValue) => {
    setActiveTab(newValue);
    setSearchQuery("");
  }, []);

  return {
    activeTab,
    searchQuery,
    setSearchQuery,
    handleTabChange,
  };
};