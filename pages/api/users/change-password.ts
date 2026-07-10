import { comparePassword, hashPassword } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '../auth/[...nextauth]';

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  if (!PASSWORD_REGEX.test(newPassword)) {
    return res.status(400).json({
      error:
        'New password must be at least 8 characters, include uppercase, lowercase, a number, and a special character (@$!%*?&)',
    });
  }

  const { data: user, error: fetchError } = await supabase
    .from('fruitsellerusers')
    .select('password')
    .eq('id', userId)
    .single();

  if (fetchError || !user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const isValid = await comparePassword(currentPassword, user.password);

  if (!isValid) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  const hashed = await hashPassword(newPassword);

  const { error: updateError } = await supabase
    .from('fruitsellerusers')
    .update({ password: hashed })
    .eq('id', userId);

  if (updateError) {
    return res.status(500).json({ error: 'Failed to update password' });
  }

  return res.status(200).json({ success: true });
}
