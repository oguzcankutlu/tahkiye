
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase URL or Key is missing in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
    console.log('Testing connection to:', supabaseUrl)
    // Try to fetch a non-existent table just to check authentication/connection
    // A 404 or specific error means connection worked but table missing.
    // A connection error means network/auth failed.
    // Better: Try to sign in anonymously if enabled, or just list users if admin (we are not admin).
    // Safest check: Just checks if we can reach the server.

    try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1)

        if (error) {
            console.log('Connection established but query failed (expected if table not exists):', error.message)
            // Check if error message implies auth failure
            if (error.message.includes('JWT') || error.code === 'PGRST301') {
                console.error('Authentication Error: Invalid API Key.')
            } else {
                console.log('Success: Reached Supabase.')
            }
        } else {
            console.log('Success: Connection established and query successful.')
        }
    } catch (err) {
        console.error('Unexpected error:', err)
    }
}

testConnection()
