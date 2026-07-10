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
      .eq('user_email', session.user.email)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const orders = (data || []).map((order: Record<string, unknown>) => ({
      ...order,
      userName: order.user_email,
      createdAt: order.created_at,
    }));

    return res.status(200).json(orders);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    cart,
    total,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    shipping_address,
  }: {
    cart: CartItem[];
    total: number;
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    shipping_address: Address;
  } = req.body;

  if (!cart || !Array.isArray(cart) || cart.length === 0 || !total) {
    return res.status(400).json({ error: 'Invalid cart or total' });
  }

  if (!shipping_address) {
    return res.status(400).json({ error: 'Shipping address is required' });
  }

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment verification data' });
  }

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ error: 'Payment verification failed' });
  }

  try {
    const ids = cart.map((item) => item.id);
    const { data: products, error: fetchError } = await supabase
      .from('fruitsellerproducts')
      .select('*')
      .in('id', ids);

    if (fetchError || !products) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    for (const item of cart) {
      const product = products.find((p) => p.id === item.id);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.id} not found` });
      }
      if (product.quantity < item.quantity) {
        return res
          .status(400)
          .json({ error: `Insufficient stock for ${product.name}` });
      }
    }

    const orderItems = cart.map((item) => {
      const product = products.find((p) => p.id === item.id);
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
        user_email: session.user.email,
        items: orderItems,
        total,
        created_at: new Date().toISOString(),
        payment_id: razorpay_payment_id,
        razorpay_order_id,
        shipping_address,
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
      const product = products.find((p) => p.id === item.id)!;
      const newQuantity = product.quantity - item.quantity;
      const { error: updateError } = await supabase
        .from('fruitsellerproducts')
        .update({ quantity: newQuantity })
        .eq('id', item.id);

      if (updateError) {
        await compensate(order.id, products, decremented);
        return res
          .status(500)
          .json({ error: `Failed to update stock for ${product.name}` });
      }

      decremented.add(item.id);
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
    const product = products.find((p) => p.id === id);
    if (!product) continue;
    await supabase
      .from('fruitsellerproducts')
      .update({ quantity: product.quantity })
      .eq('id', id);
  }

  await supabase.from('orders').delete().eq('id', orderId);
}
