import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { OrderDialogProps } from "@/types";

const OrderDialog: React.FC<OrderDialogProps> = ({
    open,
    order,
    onClose,
    onUpdateStatus,
    onOrderChange,
    isLoading,
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 3 }}>
                    Order ID: {order.id}
                    <br />
                    Customer: {order.userName}
                    <br />
                    Current Status: {order.status}
                </DialogContentText>
                <FormControl fullWidth>
                    <InputLabel>New Status</InputLabel>
                    <Select
                        value={order.status || "Processing"}
                        label="New Status"
                        onChange={(e) =>
                            onOrderChange({ ...order, status: e.target.value })
                        }
                    >
                        <MenuItem value="Processing">Processing</MenuItem>
                        <MenuItem value="Shipped">Shipped</MenuItem>
                        <MenuItem value="Delivered">Delivered</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    onClick={() => onUpdateStatus(order.status || "Processing")}
                >
                    {isLoading ? "Updating..." : "Update Status"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderDialog;
