'use server'

import { createClient } from '@/utils/supabase/server'

export async function getLatestEntries() {
    const supabase = await createClient()
    if (!supabase) return []
    const { data, error } = await supabase
        .from('entries')
        .select(`
      *,
      topics (*),
      profiles (*)
    `)
        .order('created_at', { ascending: false })
        .limit(10)

    if (error) {
        console.error('Error fetching entries:', error)
        return []
    }

    return data
}
