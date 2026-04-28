import path from 'path'
import dotenv from 'dotenv'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL)
  console.log(
    'SUPABASE_SERVICE_ROLE_KEY exists:',
    !!process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  throw new Error('Missing Supabase env vars')
}

const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default supabase