# OTP Launch Checklist

RU Thrift should use Supabase Auth email OTP with Supabase-managed SMTP delivery for launch.

## Supabase Auth Settings

- Authentication > Hooks: disable the Send Email hook for `send_email`.
- Authentication > Providers > Email: keep the Email provider enabled.
- Authentication > SMTP: enable custom SMTP with the same provider values used by the backend fallback:
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `MAIL_FROM`
- Authentication > Email Templates: confirm the OTP template includes the token variable and matches the configured OTP length.
- Authentication > Rate Limits: keep resend behavior conservative; the app blocks resend for 60 seconds.

## App Expectations

- `EXPO_PUBLIC_OTP_LENGTH` defaults to `6`, matching Supabase's documented OTP examples.
- Signup starts at `POST /users`, which creates or updates the profile and asks Supabase Auth to send the OTP.
- The frontend verifies the OTP with `supabase.auth.verifyOtp`.
- After Supabase returns a session, the frontend calls `POST /users/verify-email` with the bearer token so the backend marks `profiles.email_verified = true`.

## Fallback

The backend Nodemailer Send Email Hook route remains available at `/auth/send-email`, but it should not be the primary launch path because Supabase HTTP Auth Hooks must complete within 5 seconds.
