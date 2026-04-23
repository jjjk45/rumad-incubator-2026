import { Router, Request, Response } from 'express'
import { Webhook } from 'standardwebhooks'
import { sendPrimaryEmail, sendEmailChangeEmails } from '../sendEmailHook'
import type { SupabaseSendEmailHookPayload } from '../types'

const router = Router()

function getHookSecret(): string {
  const secret = process.env.SEND_EMAIL_HOOK_SECRET
  if (!secret) {
    throw new Error('Missing SEND_EMAIL_HOOK_SECRET')
  }
  return secret.replace('v1,whsec_', '')
}

router.post('/', async (req: Request, res: Response) => {
  try {
    if (typeof req.body !== 'string') {
      return res.status(400).json({ error: 'Expected raw text body' })
    }

    const webhook = new Webhook(getHookSecret())

    const headers = Object.fromEntries(
      Object.entries(req.headers).map(([k, v]) => [k, String(v)])
    )

    const payload = webhook.verify(
      req.body,
      headers
    ) as SupabaseSendEmailHookPayload

    const actionType = payload.email_data.email_action_type ?? 'signup'

    if (actionType === 'email_change') {
      await sendEmailChangeEmails(payload)
    } else {
      await sendPrimaryEmail(payload)
    }

    return res.status(200).json({})
  } catch (error) {
    console.error('Email hook error:', error)
    const message =
      error instanceof Error ? error.message : 'Unknown hook error'

    return res.status(401).json({
      error: { message },
    })
  }
})

export default router