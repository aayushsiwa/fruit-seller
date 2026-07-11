import { currency } from '@/constants/index';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { OrderStatus } from '@/types/index';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion } from 'framer-motion';
import { FiChevronRight, FiPackage, FiShoppingBag } from 'react-icons/fi';

import { useOrdersPage } from './Orders.hooks';

dayjs.extend(relativeTime);

const statusConfig: Record<
  OrderStatus,
  { color: 'warning' | 'info' | 'success' | 'error'; border: string }
> = {
  PROCESSING: { color: 'warning', border: '#ed6c02' },
  PAID: { color: 'info', border: '#0288d1' },
  SHIPPED: { color: 'info', border: '#0288d1' },
  DELIVERED: { color: 'success', border: '#2e7d32' },
  CANCELLED: { color: 'error', border: '#d32f2f' },
};

export default function Orders() {
  const { orders, isLoading, error, handleViewOrder, handleContinueShopping } =
    useOrdersPage();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', p: 8, px: 2 }}>
          <FiPackage size={48} color="#999" />
          <Typography variant="h6" color="error" gutterBottom>
            Failed to load orders
          </Typography>
          <Typography color="text.secondary" paragraph>
            {error}
          </Typography>
          <Button variant="contained" onClick={handleContinueShopping}>
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, mt: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            My Orders
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', p: 8, px: 2 }}>
          <FiShoppingBag size={48} color="#999" />
          <Typography variant="h6" gutterBottom>
            No orders yet
          </Typography>
          <Typography color="text.secondary" paragraph>
            You haven&apos;t placed any orders yet.
          </Typography>
          <Button variant="contained" onClick={handleContinueShopping}>
            Start Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and track your orders
        </Typography>
      </Box>

      {orders.map((order, i) => {
        const cfg = statusConfig[order.status] || statusConfig.Processing;
        return (
          <motion.div
            key={order.ID}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Paper
              elevation={1}
              onClick={() => handleViewOrder(order.ID)}
              sx={{
                p: 2.5,
                mb: 2,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s, transform 0.2s',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  bgcolor: cfg.border,
                }}
              />
              <Box sx={{ pl: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      letterSpacing: '0.02em',
                    }}
                  >
                    Order #{order.ID.slice(0, 8)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={order.status}
                      size="small"
                      color={cfg.color}
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        borderRadius: 1,
                      }}
                    />
                    <FiChevronRight size={16} color="#999" />
                  </Box>
                </Box>
                <Divider sx={{ mb: 1.5 }} />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {dayjs(order.createdAt).fromNow()}
                    {order.deliveredAt
                      ? ` • Delivered ${dayjs(order.deliveredAt).fromNow()}`
                      : ` • ${order.items.length} item${order.items.length !== 1 ? 's' : ''}`}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {currency}
                    {order.total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        );
      })}
    </Container>
  );
}
