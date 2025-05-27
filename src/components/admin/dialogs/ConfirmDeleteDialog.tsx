import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";
import { ItemType, User, ConfirmDeleteDialogProps } from "@/types";

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
    open,
    onClose,
    onConfirm,
    isLoading,
    entity,
    entityType,
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete the {entityType}
                    {entityType === "product"
                        ? (entity as ItemType).name
                        : `${(entity as User).firstName} ${
                              (entity as User).lastName
                          }`}
                    ? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={onConfirm}
                    color="error"
                    variant="contained"
                    disabled={isLoading}
                >
                    {isLoading ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDeleteDialog;
