import { Router, Request, Response } from 'express';
import supabase from '../lib/supabase';

const router = Router();

const VALID_EMAIL_DOMAIN = '@scarletmail.rutgers.edu';

function isRutgersEmail(email: string) {
  return email.trim().toLowerCase().endsWith(VALID_EMAIL_DOMAIN);
}

// GET /users
router.get('/', async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('first_name', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

// POST /users
// Creates/updates profile, then sends OTP through Supabase Auth
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      first_name,
      last_name,
      email,
      university = 'Rutgers University',
      class_year,
    } = req.body;

    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!first_name || !last_name || !normalizedEmail || !class_year) {
      return res.status(400).json({
        error: 'first_name, last_name, email, and class_year are required',
      });
    }

    if (!isRutgersEmail(normalizedEmail)) {
      return res.status(400).json({
        error: 'Only @scarletmail.rutgers.edu emails are allowed',
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          first_name,
          last_name,
          email: normalizedEmail,
          university,
          class_year,
        },
        {
          onConflict: 'email',
        }
      )
      .select()
      .single();

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: true,
      },
    });

    if (otpError) {
      return res.status(500).json({ error: otpError.message });
    }

    return res.status(200).json({
      message: 'Profile saved and OTP sent',
      profile,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || 'Something went wrong',
    });
  }
});

// POST /users/verify-email
// Frontend verifies OTP with Supabase first, then calls this route with the access token
router.post('/verify-email', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { email } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    if (user.email?.toLowerCase() !== normalizedEmail) {
      return res.status(403).json({
        error: 'Token email does not match request email',
      });
    }

    const updateData: Record<string, any> = {};

    // Only keep this if your profiles table has this column.
    // If your table does not have is_verified, remove this line.
    updateData.is_verified = true;

    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('email', normalizedEmail)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    return res.status(200).json({
      message: 'Email verified',
      profile,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || 'Something went wrong',
    });
  }
});

export default router;