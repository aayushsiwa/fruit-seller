import { currency, defaultImage } from '@/constants';
import { CartItem, IProduct } from '@/types/index';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

export const CartItems: React.FC<CartItemsProps> = ({
  cart,
  products,
  handleQuantityChange,
  handleRemoveItem,
  isLoadingProducts,
  hasError,
}) => {
  if (isLoadingProducts) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography>Loading products...</Typography>
      </Box>
    );
  }

  if (hasError) {
    return (
      <Typography color="error" textAlign="center" sx={{ py: 4 }}>
        Failed to load some product details.
      </Typography>
    );
  }

  return (
    <AnimatePresence>
      <Box
        data-testid="cart-items"
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
          },
          gap: 2,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        {cart.map((item, index) => {
          const product = products[index];
          if (!product) return null;
          const price = product.discount
            ? product.price * (1 - product.discount / 100)
            : product.price;
          return (
            <Box
              key={item.productID}
              sx={{
                p: 2,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper',
              }}
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Image
                  src={product.images?.[0] || defaultImage}
                  alt={product.name}
                  width={80}
                  height={80}
                  style={{
                    objectFit: 'cover',
                    borderRadius: 4,
                    marginRight: 16,
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {currency}
                    {product.price.toFixed(2)} per kg
                  </Typography>
                  {product.discount > 0 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Discount: {product.discount}% (Now {currency}
                      {price.toFixed(2)} per kg)
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    Subtotal: {currency}
                    {(price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() =>
                      handleQuantityChange(
                        item.productID,
                        item.quantity - 1,
                        product.stock
                      )
                    }
                    disabled={item.quantity <= 1}
                    component={motion.div}
                    whileHover={{ scale: 1.1 }}
                    aria-label="Decrease quantity"
                  >
                    <FiMinus size={16} />
                  </IconButton>
                  <TextField
                    value={item.quantity}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value);
                      if (!isNaN(value)) {
                        handleQuantityChange(item.productID, value, product.stock);
                      }
                    }}
                    inputProps={{
                      min: 0,
                      style: { textAlign: 'center' },
                      'aria-label': 'Cart quantity',
                    }}
                    sx={{ width: 40, mx: 1 }}
                    size="small"
                  />
                  <IconButton
                    size="small"
                    onClick={() =>
                      handleQuantityChange(
                        item.productID,
                        item.quantity + 1,
                        product.stock
                      )
                    }
                    disabled={item.quantity >= product.stock}
                    component={motion.div}
                    whileHover={{ scale: 1.1 }}
                    aria-label="Increase quantity"
                  >
                    <FiPlus size={16} />
                  </IconButton>
                </Box>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveItem(item.productID)}
                  component={motion.div}
                  whileHover={{ scale: 1.1 }}
                  aria-label={`Remove ${product.name} from cart`}
                >
                  <FiTrash2 />
                </IconButton>
              </Box>
            </Box>
          );
        })}
      </Box>
    </AnimatePresence>
  );
};

export interface CartItemsProps {
  cart: CartItem[];
  products: (IProduct | undefined)[];
  handleQuantityChange: (
    id: string,
    newQuantity: number,
    maxQuantity: number
  ) => void;
  handleRemoveItem: (id: string) => void;
  isLoadingProducts: boolean;
  hasError: boolean;
}
