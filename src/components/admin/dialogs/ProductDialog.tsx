import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { ProductDialogProps } from "@/types";

const ProductDialog: React.FC<ProductDialogProps> = ({
    open,
    product,
    onClose,
    onSave,
    isLoading,
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {product.id ? "Edit Product" : "Add New Product"}
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
                                defaultValue={product.description || ""}
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
                                inputProps={{ min: 0, step: "0.01" }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    defaultValue={product.category || ""}
                                    label="Category"
                                    required
                                >
                                    <MenuItem value="Berries">Berries</MenuItem>
                                    <MenuItem value="Citrus">Citrus</MenuItem>
                                    <MenuItem value="Tropical">
                                        Tropical
                                    </MenuItem>
                                    <MenuItem value="Stone Fruits">
                                        Stone Fruits
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="quantity"
                                label="Quantity"
                                type="number"
                                defaultValue={product.quantity || 0}
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
                            <TextField
                                name="image"
                                label="Image URL"
                                defaultValue={product.image}
                                fullWidth
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Seasonal</InputLabel>
                                <Select
                                    name="is_seasonal"
                                    defaultValue={
                                        product.isSeasonal ? "true" : "false"
                                    }
                                    label="Seasonal"
                                    required
                                >
                                    <MenuItem value="true">Yes</MenuItem>
                                    <MenuItem value="false">No</MenuItem>
                                </Select>
                            </FormControl>
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
                        {isLoading
                            ? "Saving..."
                            : product.id
                            ? "Update"
                            : "Create"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ProductDialog;
