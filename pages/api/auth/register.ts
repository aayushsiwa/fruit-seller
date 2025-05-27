import { supabase } from '@/lib/supabase';
import { hashPassword } from '@/lib/auth';
import { generateJWT } from '@/lib/auth';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password, firstName, lastName, role } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const { data: existing, error: existingError } = await supabase
      .from('fruitsellerusers')
      .select('email')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    if (existingError && existingError.code !== 'PGRST116') {
      return res.status(500).json({ message: 'Error checking user', details: existingError });
    }

    const hashed = await hashPassword(password);

    const { error: insertError } = await supabase
      .from('fruitsellerusers')
      .insert({
        email,
        password: hashed,
        first_name:firstName,
        last_name:lastName,
        role: role || 'buyer',
      });

    if (insertError) {
      return res.status(500).json({ message: 'Failed to create user', insertError });
    }

    const token = await generateJWT(email, role);
    
    return res.status(201).json({ success: true, token: token, user: { email, firstName, lastName, role: role || "buyer" } });

    
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

