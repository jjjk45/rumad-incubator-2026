import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import type {
  SupabaseSendEmailHookPayload,
  EmailActionType,
} from './types'

let cachedTransporter: Transporter | null = null

function requiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function getTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter

  const host = requiredEnv('SMTP_HOST')
  const port = Number(requiredEnv('SMTP_PORT'))
  const user = requiredEnv('SMTP_USER')
  const pass = requiredEnv('SMTP_PASS')

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  })

  return cachedTransporter
}

export async function verifyTransporter(): Promise<void> {
  const transporter = getTransporter()
  await transporter.verify()
}

function buildSubject(actionType: EmailActionType): string {
  switch (actionType) {
    case 'signup':
      return 'Verify your email'
    case 'magiclink':
      return 'Your sign-in code'
    case 'recovery':
      return 'Your password reset code'
    case 'invite':
      return 'Your invitation code'
    case 'email_change':
      return 'Confirm your email change'
    default:
      return 'Your verification code'
  }
}

function buildHeading(actionType: EmailActionType): string {
  switch (actionType) {
    case 'signup':
      return 'Verify your email'
    case 'magiclink':
      return 'Sign in to your account'
    case 'recovery':
      return 'Reset your password'
    case 'invite':
      return 'You have been invited'
    case 'email_change':
      return 'Confirm your email change'
    default:
      return 'Verification code'
  }
}

function buildHtmlEmail(code: string, actionType: EmailActionType): string {
  const heading = buildHeading(actionType)

  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111827;">
      <h2 style="margin-bottom: 16px;">${heading}</h2>
      <p style="font-size: 16px; line-height: 1.6;">
        Use the code below to continue:
      </p>
      <div style="margin: 24px 0; padding: 16px; background: #f3f4f6; border-radius: 12px; text-align: center;">
        <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px;">${code}</span>
      </div>
      <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">
        This code will expire soon. If you did not request this, you can ignore this email.
      </p>
    </div>
  `
}

function buildTextEmail(code: string, actionType: EmailActionType): string {
  const heading = buildHeading(actionType)
  return `${heading}\n\nYour verification code is: ${code}\n\nThis code will expire soon. If you did not request this, you can ignore this email.`
}

export async function sendPrimaryEmail(
  payload: SupabaseSendEmailHookPayload
): Promise<void> {
  const transporter = getTransporter()
  const from = requiredEnv('MAIL_FROM')

  const userEmail = payload.user.email
  const actionType = payload.email_data.email_action_type ?? 'signup'
  const code = payload.email_data.token

  if (!userEmail || !code) {
    throw new Error('Missing recipient email or OTP token in hook payload.')
  }

  await transporter.sendMail({
    from,
    to: userEmail,
    subject: buildSubject(actionType),
    text: buildTextEmail(code, actionType),
    html: buildHtmlEmail(code, actionType),
  })
}

export async function sendEmailChangeEmails(
  payload: SupabaseSendEmailHookPayload
): Promise<void> {
  const transporter = getTransporter()
  const from = requiredEnv('MAIL_FROM')

  const currentEmail = payload.user.email
  const newEmail = payload.user.new_email

  const currentCode = payload.email_data.token
  const newEmailCode = payload.email_data.token_new

  if (!currentEmail || !newEmail) {
    throw new Error('Missing current or new email for email_change flow.')
  }

  if (currentCode && newEmailCode) {
    await transporter.sendMail({
      from,
      to: currentEmail,
      subject: 'Confirm email change',
      text: buildTextEmail(currentCode, 'email_change'),
      html: buildHtmlEmail(currentCode, 'email_change'),
    })

    await transporter.sendMail({
      from,
      to: newEmail,
      subject: 'Confirm your new email',
      text: buildTextEmail(newEmailCode, 'email_change'),
      html: buildHtmlEmail(newEmailCode, 'email_change'),
    })

    return
  }

  const singleCode = currentCode ?? newEmailCode
  if (!singleCode) {
    throw new Error('Missing OTP token for email_change flow.')
  }

  await transporter.sendMail({
    from,
    to: newEmail,
    subject: 'Confirm your new email',
    text: buildTextEmail(singleCode, 'email_change'),
    html: buildHtmlEmail(singleCode, 'email_change'),
  })
}