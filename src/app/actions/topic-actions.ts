'use server'

import { createClient } from '@/utils/supabase/server'

export async function getCategories() {
    const supabase = await createClient()
    if (!supabase) return []
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('title', { ascending: true })

    if (error) {
        console.error('Error fetching categories:', error)
        return []
    }

    return data
}

export async function getTopics(categoryId?: number) {
    const supabase = await createClient()
    if (!supabase) return []
    let query = supabase
        .from('topics')
        .select(`
      *,
      entries (count)
    `)
        .order('created_at', { ascending: false })
        .limit(20)

    if (categoryId) {
        query = query.contains('category_ids', [categoryId])
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching topics:', error)
        return []
    }

    return data
}
