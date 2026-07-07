import React, { useMemo } from "react";
import dayjs from "dayjs";
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
    TextField,
} from "@mui/material";
import { OrderDialogProps, OrderStatus } from "@/types/index";

function validTargets(current: OrderStatus): OrderStatus[] {
    if (current === "Delivered" || current === "Cancelled") return [];
    if (current === "Processing") return ["Shipped", "Delivered", "Cancelled"];
    if (current === "Shipped") return ["Delivered", "Cancelled"];
    return [];
}

const OrderDialog: React.FC<OrderDialogProps> = ({
    open,
    order,
    onClose,
    onUpdateStatus,
    onOrderChange,
    isLoading,
}) => {
    const currentStatus = useMemo(
        () => (order.status as OrderStatus) || "Processing",
        [order.status],
    );

    const targets = useMemo(() => validTargets(currentStatus), [currentStatus]);
    const selectedStatus = (order.status as OrderStatus) || "Processing";

    const timestampLabel = useMemo(() => {
        if (selectedStatus === "Shipped") return "Shipped At";
        if (selectedStatus === "Delivered") return "Delivered At";
        if (selectedStatus === "Cancelled") return "Cancelled At";
        return null;
    }, [selectedStatus]);

    const timestampValue = useMemo(() => {
        if (selectedStatus === "Processing") return null;
        return dayjs().format("MMMM D, YYYY h:mm A");
    }, [selectedStatus]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 3 }}>
                    Order ID: {order.id}
                    <br />
                    Customer: {order.userName}
                    <br />
                    Current Status: <strong>{currentStatus}</strong>
                </DialogContentText>
                {targets.length > 0 ? (
                    <>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>New Status</InputLabel>
                            <Select
                                value={
                                    targets.includes(selectedStatus)
                                        ? selectedStatus
                                        : targets[0]
                                }
                                label="New Status"
                                onChange={(e) =>
                                    onOrderChange({
                                        ...order,
                                        status: e.target.value as OrderStatus,
                                    })
                                }
                            >
                                {targets.map((s) => (
                                    <MenuItem key={s} value={s}>
                                        {s}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {timestampLabel && timestampValue && (
                            <TextField
                                fullWidth
                                disabled
                                label={timestampLabel}
                                value={timestampValue}
                                size="small"
                            />
                        )}
                    </>
                ) : (
                    <DialogContentText color="text.secondary">
                        This order is in a terminal state (
                        <strong>{currentStatus}</strong>) and cannot be changed
                        further.
                    </DialogContentText>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                {targets.length > 0 && (
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        onClick={() =>
                            onUpdateStatus(
                                targets.includes(selectedStatus)
                                    ? selectedStatus
                                    : targets[0],
                            )
                        }
                    >
                        {isLoading ? "Updating..." : "Update Status"}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default OrderDialog;
