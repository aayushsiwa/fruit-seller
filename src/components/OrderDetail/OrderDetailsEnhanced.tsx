import { currency, defaultImage } from '@/constants/index';
import { OrderDetailsProps } from '@/src/components/Success/OrderDetails';
import { OrderItem } from '@/types/index';
import {
  Box,
  Divider,
  IconButton,
  Link,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Tooltip,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion } from 'framer-motion';
import Image from 'next/image';
import NextLink from 'next/link';
import { useCallback, useState } from 'react';
import { FiCheck, FiCopy } from 'react-icons/fi';

dayjs.extend(relativeTime);

function CopyId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [id]);

  return (
    <Tooltip title={copied ? 'Copied!' : 'Copy'} placement="top">
      <IconButton
        size="small"
        onClick={handleCopy}
        sx={{ ml: 0.5, verticalAlign: 'middle' }}
      >
        <FiCopy size={14} />
      </IconButton>
    </Tooltip>
  );
}

const steps = ['Placed', 'Shipped', 'Delivered'];

function isShipped(status: string): boolean {
  return status === 'SHIPPED' || status === 'DELIVERED';
}

function isDelivered(status: string): boolean {
  return status === 'DELIVERED';
}

export const OrderDetailsEnhanced: React.FC<OrderDetailsProps> = ({
  order,
}) => {
  const isCancelled = order.status === 'CANCELLED';

  function stepTooltip(index: number): string {
    const stepDone =
      index === 0 ||
      (index === 1 && isShipped(order.status)) ||
      (index === 2 && isDelivered(order.status));
    if (index === 0) {
      return `Placed ${dayjs(order.createdAt).fromNow()}`;
    }
    if (index === 1) {
      if (!stepDone) return 'Yet to be shipped';
      if (order.shippedAt) {
        return `Shipped ${dayjs(order.shippedAt).fromNow()}`;
      }
      return 'Shipped';
    }
    if (index === 2) {
      if (!stepDone) return 'Yet to be delivered';
      if (order.deliveredAt) {
        return `Delivered ${dayjs(order.deliveredAt).fromNow()}`;
      }
      return 'Delivered';
    }
    return steps[index];
  }

  function activeStep(): number {
    if (isDelivered(order.status)) return 3;
    if (isShipped(order.status)) return 2;
    return 1;
  }

  function isStepCompleted(index: number): boolean {
    if (index === 0) return true;
    if (index === 1) return isShipped(order.status);
    if (index === 2) return isDelivered(order.status);
    return false;
  }

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, borderRadius: 2, maxWidth: 600, mx: 'auto', mt: 4 }}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Order #{order.ID.slice(0, 8)}
        </Typography>
        <CopyId id={order.ID} />
      </Box>

      {!isCancelled && (
        <Stepper activeStep={activeStep()} sx={{ mb: 3, mt: 1 }}>
          {steps.map((label, index) => {
            const completed = isStepCompleted(index);
            return (
              <Step key={label} completed={completed}>
                <Tooltip title={stepTooltip(index)}>
                  <StepLabel
                    StepIconComponent={
                      completed
                        ? () => (
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: 'success.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <FiCheck size={14} color="#fff" />
                            </Box>
                          )
                        : () => (
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                border: '2px solid',
                                borderColor: 'grey.300',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Box
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  bgcolor: 'grey.300',
                                }}
                              />
                            </Box>
                          )
                    }
                    sx={{
                      '& .MuiStepLabel-label': {
                        color: completed ? 'text.primary' : 'grey.400',
                        opacity: completed ? 1 : 0.5,
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Tooltip>
              </Step>
            );
          })}
        </Stepper>
      )}

      {isCancelled && (
        <Box
          sx={{
            textAlign: 'center',
            mb: 2,
            p: 1.5,
            bgcolor: 'error.light',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" fontWeight={600} color="error.dark">
            Order Cancelled
            {order.cancelledAt && ` ${dayjs(order.cancelledAt).fromNow()}`}
          </Typography>
        </Box>
      )}

      {order.paymentID && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Payment ID: <strong>{order.paymentID.slice(0, 16)}...</strong>
          </Typography>
          <CopyId id={order.paymentID} />
        </Box>
      )}
      {order.razorpayOrderID && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Razorpay Order ID: <strong>{order.razorpayOrderID}</strong>
          </Typography>
          <CopyId id={order.razorpayOrderID} />
        </Box>
      )}

      {order.shippingAddress && (
        <Box sx={{ mt: 2, textAlign: 'left' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Shipping Address
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {order.shippingAddress.street}
          </Typography>
          {order.shippingAddress.street2 && (
            <Typography variant="body2" color="text.secondary">
              {order.shippingAddress.street2}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
            {order.shippingAddress.postalCode}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {order.shippingAddress.country}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 0.5 }}
          >
            Phone: {order.shippingAddress.phone}
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
        Items
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr' },
          gap: 2,
        }}
      >
        {order.items.map((item: OrderItem) => {
          const product = item.product;
          if (!product) return null;
          const price = product.discount
            ? product.price * (1 - product.discount / 100)
            : product.price;
          return (
            <NextLink
              key={product.ID}
              href={`/products/${product.ID}`}
              passHref
              legacyBehavior
            >
              <Link
                underline="none"
                color="inherit"
                sx={{
                  display: 'block',
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 2 },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    src={product.images?.[0]?.url || defaultImage}
                    alt={product.name}
                    width={60}
                    height={60}
                    style={{
                      objectFit: 'cover',
                      borderRadius: 4,
                      marginRight: 16,
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {item.quantity}
                    </Typography>
                    {product.discount > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Discount: {product.discount}% (Now {currency}
                        {price.toFixed(2)} each)
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="subtitle2">
                    {currency}
                    {(price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              </Link>
            </NextLink>
          );
        })}
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Total
        </Typography>
        <Typography
          variant="subtitle1"
          color="primary"
          sx={{ fontWeight: 700 }}
        >
          {currency}
          {order.total.toFixed(2)}
        </Typography>
      </Box>
    </Paper>
  );
};
