import { supabase } from '@/lib/supabase';
import { Address, CartItem } from '@/types/index';
import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import Nextauth from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await getServerSession(req, res, Nextauth.authOptions)) as {
    user?: { email?: string };
  } | null;
  if (!session || !session.user || !session.user.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('userEmail', session.user.email)
      .order('createdAt', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const orders = (data || []).map((order: Record<string, unknown>) => ({
      ...order,
      userName: order.userEmail,
    }));

    return res.status(200).json(orders);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    cart,
    total,
    razorpayPaymentID,
    razorpayOrderID,
    razorpaySignature,
    shippingAddress,
  }: {
    cart: CartItem[];
    total: number;
    razorpayPaymentID: string;
    razorpayOrderID: string;
    razorpaySignature: string;
    shippingAddress: Address;
  } = req.body;

  if (!cart || !Array.isArray(cart) || cart.length === 0 || !total) {
    return res.status(400).json({ error: 'Invalid cart or total' });
  }

  if (!shippingAddress) {
    return res.status(400).json({ error: 'Shipping address is required' });
  }

  if (!razorpayPaymentID || !razorpayOrderID || !razorpaySignature) {
    return res.status(400).json({ error: 'Missing payment verification data' });
  }

  const body = razorpayOrderID + '|' + razorpayPaymentID;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    return res.status(400).json({ error: 'Payment verification failed' });
  }

  try {
    const ids = cart.map((item) => item.productID);
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .in('ID', ids);

    if (fetchError || !products) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    for (const item of cart) {
      const product = products.find((p) => p.ID === item.productID);
      if (!product) {
        return res
          .status(400)
          .json({ error: `Product ${item.productID} not found` });
      }
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ error: `Insufficient stock for ${product.name}` });
      }
    }

    const orderItems = cart.map((item) => {
      const product = products.find((p) => p.ID === item.productID);
      return {
        quantity: item.quantity,
        product,
      };
    });

    // Insert the order first so stock is only ever decremented after the
    // order is committed. If the insert fails, stock is left untouched.
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        userEmail: session.user.email,
        items: orderItems,
        total,
        paymentID: razorpayPaymentID,
        razorpayOrderID: razorpayOrderID,
        shippingAddress: shippingAddress,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order insert error:', orderError);
      return res.status(500).json({
        error: 'Failed to create order',
        details: orderError.message,
      });
    }
    if (!order) {
      return res.status(500).json({ error: 'Order creation returned no data' });
    }

    // Decrement stock only after the order exists. Track every successful
    // update so we can compensate (restore stock + delete order) if a later
    // update fails, keeping the two operations consistent.
    const decremented = new Set<string>();

    for (const item of cart) {
      const product = products.find((p) => p.ID === item.productID)!;
      const newStock = product.stock - item.quantity;
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('ID', item.productID);

      if (updateError) {
        await compensate(order.ID, products, decremented);
        return res
          .status(500)
          .json({ error: `Failed to update stock for ${product.name}` });
      }

      decremented.add(item.productID);
    }

    return res.status(200).json({ order });
  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Roll back a partially-completed order: restore stock for products that were
// already decremented, then delete the order so the two operations stay
// consistent when stock update fails after the order was inserted.
async function compensate(
  orderId: string,
  products: Record<string, unknown>[],
  decremented: Set<string>
) {
  const ids = Array.from(decremented);
  for (const id of ids) {
    const product = products.find((p) => p.ID === id);
    if (!product) continue;
    await supabase
      .from('products')
      .update({ stock: product.stock })
      .eq('ID', id);
  }

  await supabase.from('orders').delete().eq('ID', orderId);
}
