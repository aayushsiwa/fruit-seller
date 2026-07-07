import { supabase } from '@/lib/supabase';
import { CartItem } from '@/types/index';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import Razorpay from 'razorpay';

import { authOptions } from '../auth/[...nextauth]';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = (await getServerSession(req, res, authOptions)) as {
    user?: { email?: string };
  } | null;
  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { cart, total }: { cart: CartItem[]; total: number } = req.body;

  if (!cart || !Array.isArray(cart) || cart.length === 0 || !total) {
    return res.status(400).json({ error: 'Invalid cart or total' });
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

    const amountInPaise = Math.round(total * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: { user_email: session.user.email },
    });

    return res.status(200).json({
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Payment init error:', error);
    return res.status(500).json({ error: 'Failed to initiate payment' });
  }
}
