import { UseAdminDashboardReturn } from '@/types/admin';
import { TabValue } from '@/types/index';
import { useCallback, useState } from 'react';

export const useAdminDashboard = (): UseAdminDashboardReturn => {
  const [activeTab, setActiveTab] = useState<TabValue>(TabValue.PRODUCTS);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, newValue: TabValue) => {
      setActiveTab(newValue);
      setSearchQuery('');
    },
    []
  );

  return {
    activeTab,
    searchQuery,
    setSearchQuery,
    handleTabChange,
  };
};
