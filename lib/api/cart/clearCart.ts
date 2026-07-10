import axios from 'axios';

export const clearCartAPI = async (): Promise<void> => {
  await axios.delete('/api/cart/clear');
};
