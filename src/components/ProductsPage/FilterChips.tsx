import { Box, Chip, Typography } from '@mui/material';
import { FiX } from 'react-icons/fi';

export const FilterChips: React.FC<FilterChipsProps> = ({
  getFilterSummary,
  setPriceRange,
  minPrice,
  maxPrice,
  setCategory,
  setSortOption,
  setInStockOnly,
}) => {
  const filters = getFilterSummary();

  if (!filters.length) return null;

  return (
    <Box data-testid="filter-chips">
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Active Filters:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {filters.map((filter, index) => (
          <Chip
            key={index}
            label={filter}
            size="small"
            sx={{
              bgcolor: 'primary.dark',
              color: 'white',
            }}
            deleteIcon={<FiX />}
            onDelete={() => {
              if (filter.startsWith('Price'))
                setPriceRange([minPrice, maxPrice]);
              else if (filter.startsWith('Category')) setCategory('all');
              else if (filter.startsWith('Sort')) setSortOption('none');
              else setInStockOnly(false);
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export interface FilterChipsProps {
  getFilterSummary: () => string[];
  setPriceRange: (range: [number, number]) => void;
  minPrice: number;
  maxPrice: number;
  setCategory: (category: string) => void;
  setSortOption: (option: string) => void;
  setInStockOnly: (value: boolean) => void;
}
