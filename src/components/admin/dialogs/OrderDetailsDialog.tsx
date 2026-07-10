import { useGetAdminOrder } from '@/lib/api/admin/getAdminOrder';
import { OrderDetailsEnhanced } from '@/src/components/OrderDetail/OrderDetailsEnhanced';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Typography,
} from '@mui/material';
import React from 'react';

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  open,
  orderId,
  onClose,
}) => {
  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useGetAdminOrder(open ? orderId : undefined);

  return (
    <Dialog open={open} onClose={onClose} fullWidth scroll="paper">
      <DialogContent>
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 4,
            }}
          >
            <CircularProgress />
            <Typography sx={{ mt: 2 }} color="text.secondary">
              Loading order details...
            </Typography>
          </Box>
        ) : isError ? (
          <Typography color="error" sx={{ py: 2 }}>
            Failed to load order: {error instanceof Error ? error.message : ''}
          </Typography>
        ) : order ? (
          <Box sx={{ mt: -4 }}>
            <OrderDetailsEnhanced order={order} />
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;

export interface OrderDetailsDialogProps {
  open: boolean;
  orderId: string | undefined;
  onClose: () => void;
}
