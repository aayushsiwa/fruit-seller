import {
    Box,
    Typography,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Checkbox,
    FormControlLabel,
    Paper,
    Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FilterOptionsProps } from "@/types";

export const FilterOptions: React.FC<FilterOptionsProps> = ({
    priceRange,
    setPriceRange,
    minPrice,
    maxPrice,
    category,
    setCategory,
    sortOption,
    setSortOption,
    inStockOnly,
    setInStockOnly,
    handleResetFilters,
    getFilterSummary,
    categories,
    sortOptions,
}) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
            }}
        >
            <Typography variant="h6" fontWeight={600} mb={2}>
                Filter Products
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box mb={3}>
                <Typography variant="subtitle2" fontWeight={500} mb={1}>
                    Price Range
                </Typography>
                <Slider
                    value={priceRange}
                    onChange={(_, v) =>
                        Array.isArray(v) && setPriceRange(v as [number, number])
                    }
                    valueLabelDisplay="auto"
                    min={minPrice}
                    max={maxPrice}
                />
                <Typography variant="caption" color="text.secondary">
                    Rs.{priceRange[0]} - Rs.{priceRange[1]}
                </Typography>
            </Box>

            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Category</InputLabel>
                <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                            {cat === "all" ? "All Categories" : cat}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                    value={sortOption}
                    label="Sort By"
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    {sortOptions.map(({ value, label }) => (
                        <MenuItem key={value} value={value}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControlLabel
                control={
                    <Checkbox
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                }
                label="In Stock Only"
                sx={{ mb: 3 }}
            />

            <Button
                variant={getFilterSummary().length ? "contained" : "outlined"}
                color="secondary"
                fullWidth
                onClick={handleResetFilters}
            >
                Reset Filters
            </Button>
        </Paper>
    );
};
