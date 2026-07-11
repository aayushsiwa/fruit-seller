import { generateResetToken } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

// Sliding log rate limit store
const rateLimitStore = new Map<string, number[]>();
const COOLDOWN_MS = 60 * 1000; // 60 seconds
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_REQUESTS = 5;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Rate limiting check
  const now = Date.now();
  const requestTimes = rateLimitStore.get(email) || [];
  const activeTimes = requestTimes.filter((time) => now - time < WINDOW_MS);

  // 1. Check 60-second cooldown between consecutive requests
  if (activeTimes.length > 0) {
    const lastRequest = activeTimes[activeTimes.length - 1];
    if (now - lastRequest < COOLDOWN_MS) {
      const secondsLeft = Math.ceil((COOLDOWN_MS - (now - lastRequest)) / 1000);
      return res.status(429).json({
        error: 'RateLimit',
        message: `Too many requests. Please wait ${secondsLeft}s before requesting again.`,
      });
    }
  }

  // 2. Check 24-hour request limit (max 5)
  if (activeTimes.length >= MAX_REQUESTS) {
    const oldestRequest = activeTimes[0];
    const msUntilExpiry = WINDOW_MS - (now - oldestRequest);
    const hoursLeft = Math.ceil(msUntilExpiry / (60 * 60 * 1000));
    return res.status(429).json({
      error: 'RateLimit',
      message: `Daily request limit reached. You can request again in approximately ${hoursLeft} hour(s).`,
    });
  }

  try {
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return res
        .status(404)
        .json({ message: 'No user found with this email address' });
    }

    // Record the request time in sliding window
    activeTimes.push(now);
    rateLimitStore.set(email, activeTimes);

    const token = await generateResetToken(email);

    // Determine host and full link
    const hostHeader = req.headers.host || 'localhost:3000';
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = `${protocol}://${hostHeader}`;
    const fullResetLink = `${host}/reset-password?token=${token}`;

    // Read and populate email template
    const templatePath = path.join(
      process.cwd(),
      'src/templates/emails/reset-password.html'
    );
    let htmlContent = '';
    try {
      htmlContent = fs.readFileSync(templatePath, 'utf8');
      htmlContent = htmlContent
        .replace(/\{\{resetLink\}\}/g, fullResetLink)
        .replace(/\{\{host\}\}/g, host);
    } catch (fsError) {
      console.error('Failed to read email template:', fsError);
      // Fallback HTML if template fails to load
      htmlContent = `<p>Please reset your password by clicking here: <a href="${fullResetLink}">Reset Password</a></p>`;
    }

    const emailSent = await sendEmail({
      to: email,
      subject: 'Reset your Fruit Seller password',
      text: `Please reset your password by clicking here: ${fullResetLink}`,
      html: htmlContent,
      fromName: 'Fruit Seller',
      fromAddress: 'no-reply@fruitseller.com',
    });

    if (!emailSent) {
      console.log('[Dev Mode] Password reset link:', fullResetLink);
    }

    const isDevOrTest =
      process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

    return res.status(200).json({
      success: true,
      emailSent,
      message: emailSent
        ? 'A password reset link has been sent to your email.'
        : 'Reset link generated successfully (Email delivery skipped/failed).',
      ...(isDevOrTest && !emailSent
        ? { resetLink: `/reset-password?token=${token}` }
        : {}),
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
