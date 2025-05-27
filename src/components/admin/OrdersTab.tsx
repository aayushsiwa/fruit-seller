import React from "react";
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Typography,
    CircularProgress,
    IconButton,
    Chip,
} from "@mui/material";
import { FiEdit2 } from "react-icons/fi";
import { Order, OrdersTabProps } from "@/types";

const OrdersTab: React.FC<OrdersTabProps> = ({
    orders,
    isLoading,
    error,
    onEditOrder,
}) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell align="center">Items</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                <CircularProgress />
                                <Typography>Loading orders...</Typography>
                            </TableCell>
                        </TableRow>
                    ) : error ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                <Typography color="error">
                                    Failed to load orders: {error}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (orders?.length ?? 0) > 0 ? (
                        (orders ?? []).map((order: Order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.userName}</TableCell>
                                <TableCell align="center">
                                    {order.items.length}
                                </TableCell>
                                <TableCell align="right">
                                    ₹{order.total.toFixed(2)}
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={order.status}
                                        color={
                                            order.status === "Delivered"
                                                ? "success"
                                                : order.status === "Shipped"
                                                ? "info"
                                                : order.status === "Processing"
                                                ? "warning"
                                                : order.status === "Cancelled"
                                                ? "error"
                                                : "default"
                                        }
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() => onEditOrder(order)}
                                    >
                                        <FiEdit2 />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                No orders found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default OrdersTab;
