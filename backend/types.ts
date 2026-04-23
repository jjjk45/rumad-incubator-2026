export type EmailActionType =
  | 'signup'
  | 'magiclink'
  | 'recovery'
  | 'invite'
  | 'email_change'
  | string

export interface SupabaseUser {
  id?: string
  email: string
  new_email?: string
}

export interface SupabaseEmailData {
  token?: string
  token_hash?: string
  redirect_to?: string
  email_action_type?: EmailActionType
  site_url?: string
  token_new?: string
  token_hash_new?: string
}

export interface SupabaseSendEmailHookPayload {
  user: SupabaseUser
  email_data: SupabaseEmailData
}