import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createUser(email, password) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true
  })

  if (error) {
    console.error('Error creating user:', error.message)
  } else {
    console.log('User created successfully:', data.user.email)
    console.log('User ID:', data.user.id)
  }
}

// Ambil argument dari command line
const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.log('Usage: node scripts/create-supabase-user.mjs <email> <password>')
  process.exit(1)
}

createUser(email, password)
