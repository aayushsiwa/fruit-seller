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
import { UserDialogProps } from "@/types";

const UserDialog: React.FC<UserDialogProps> = ({
    open,
    user,
    onClose,
    onSave,
    isLoading,
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{user.id ? "Edit User" : "Add New User"}</DialogTitle>
            <form onSubmit={onSave}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="firstName"
                                label="First Name"
                                defaultValue={user.firstName}
                                fullWidth
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="lastName"
                                label="Last Name"
                                defaultValue={user.lastName}
                                fullWidth
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="email"
                                label="Email"
                                type="email"
                                defaultValue={user.email}
                                fullWidth
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Role</InputLabel>
                                <Select
                                    name="role"
                                    defaultValue={user.role}
                                    label="Role"
                                    required
                                >
                                    <MenuItem value="buyer">Buyer</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                    <MenuItem value="seller">Seller</MenuItem>
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
                            : user.email
                            ? "Update"
                            : "Create"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default UserDialog;
