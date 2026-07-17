import axios from 'axios';

export const removeCartItemAPI = async (productId: string): Promise<void> => {
  await axios.delete('/api/cart', { params: { productID: productId } });
};
