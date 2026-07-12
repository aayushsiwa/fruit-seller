import { IProduct, ProductImage } from '@/types/index';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import React, { useCallback, useState } from 'react';

const MAX_IMAGES = 5;

const ProductDialog: React.FC<ProductDialogProps> = ({
  open,
  product,
  onClose,
  onSave,
  isLoading,
}) => {
  const initialImages = product.images?.length
    ? product.images.map((img) => ({ url: img.url, altText: img.altText }))
    : [{ url: '', altText: '' }];

  const [images, setImages] = useState<ProductImage[]>(initialImages);

  const handleImageChange = useCallback(
    (index: number, field: 'url' | 'altText', value: string) => {
      setImages((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
    },
    []
  );

  const handleAddImage = useCallback(() => {
    setImages((prev) => [...prev, { url: '', altText: '' }]);
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {product.ID ? 'Edit Product' : 'Add New Product'}
      </DialogTitle>
      <form onSubmit={onSave}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                defaultValue={product.name}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                multiline
                rows={3}
                defaultValue={product.description || ''}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Price"
                type="number"
                defaultValue={product.price}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  defaultValue={product.category || ''}
                  label="Category"
                  required
                >
                  <MenuItem value="Berries">Berries</MenuItem>
                  <MenuItem value="Citrus">Citrus</MenuItem>
                  <MenuItem value="Tropical">Tropical</MenuItem>
                  <MenuItem value="Stone Fruits">Stone Fruits</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="stock"
                label="Stock"
                type="number"
                defaultValue={product.stock || 0}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="discount"
                label="Discount (%)"
                type="number"
                defaultValue={product.discount || 0}
                fullWidth
                margin="normal"
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Seasonal</InputLabel>
                <Select
                  name="isSeasonal"
                  defaultValue={product.isSeasonal ? 'true' : 'false'}
                  label="Seasonal"
                  required
                >
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <InputLabel sx={{ mb: 1, mt: 1 }}>Images</InputLabel>
              {images.map((img, index) => (
                <Grid container spacing={1} key={index} sx={{ mb: 1 }}>
                  <Grid item xs={5}>
                    <TextField
                      name={`imageUrl-${index}`}
                      label="Image URL"
                      value={img.url}
                      onChange={(e) =>
                        handleImageChange(index, 'url', e.target.value)
                      }
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      name={`imageAlt-${index}`}
                      label="Alt Text"
                      value={img.altText}
                      onChange={(e) =>
                        handleImageChange(index, 'altText', e.target.value)
                      }
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {images.length > 1 && (
                      <IconButton
                        onClick={() => handleRemoveImage(index)}
                        size="small"
                        color="error"
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              ))}
              {images.length < MAX_IMAGES && (
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddImage}
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Add Image
                </Button>
              )}
              <input
                type="hidden"
                name="images"
                value={JSON.stringify(
                  images.filter((img) => img.url.trim() !== '')
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : product.ID ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductDialog;

export interface ProductDialogProps {
  open: boolean;
  product: Partial<IProduct>;
  onClose: () => void;
  onSave: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}
