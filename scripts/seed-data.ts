
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials missing')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
    console.log('🌱 Seeding database...')

    // 1. Get Categories (already inserted by schema.sql)
    const { data: categories } = await supabase.from('categories').select('id')
    if (!categories || categories.length === 0) {
        console.error('No categories found. Run schema.sql first.')
        return
    }

    // 2. Create a Dummy User (if not exists)
    // Note: We can't easily create auth users via client API without admin rights or signing up.
    // For seeding public tables, we need a user_id.
    // Let's check if we have any profile, if not, we can't seed topics linked to a user properly
    // unless we fake a UUID or use a real one.
    // Ideally, the user should have signed up by now as tested in previous step.

    const { data: profiles } = await supabase.from('profiles').select('id').limit(1)

    let userId = profiles?.[0]?.id

    if (!userId) {
        console.log('No users found. Please sign up on the website first to generate a user.')
        // Fallback: we cannot insert related data without a user.
        return
    }

    console.log(`Using user ID: ${userId} for content creation.`)

    // 3. Insert Topics
    const topicsData = [
        { title: 'yapay zeka dünyayı ele geçirecek mi', slug: 'yapay-zeka-dunyayi-ele-gecirecek-mi', category_id: categories[0].id, user_id: userId },
        { title: '2026 dünya kupası', slug: '2026-dunya-kupasi', category_id: categories[2].id, user_id: userId },
        { title: 'en iyi yazılım dilleri', slug: 'en-iyi-yazilim-dilleri', category_id: categories[3].id, user_id: userId },
        { title: 'evde kahve demleme yöntemleri', slug: 'evde-kahve-demleme-yontemleri', category_id: categories[4].id, user_id: userId },
        { title: 'türkiye ekonomisinin geleceği', slug: 'turkiye-ekonomisinin-gelecegi', category_id: categories[0].id, user_id: userId },
    ]

    for (const t of topicsData) {
        const { data: topic, error } = await supabase.from('topics').upsert(t, { onConflict: 'slug' }).select().single()
        if (error) console.error('Topic error:', error.message)
        else {
            // 4. Insert Entries for this topic
            await supabase.from('entries').insert([
                { content: 'bence evet, ama yavaş yavaş olacak.', topic_id: topic.id, user_id: userId },
                { content: 'hayır, sadece yardımcı olacak.', topic_id: topic.id, user_id: userId },
                { content: 'bkz: terminatör', topic_id: topic.id, user_id: userId }
            ])
        }
    }

    console.log('✅ Seeding completed!')
}

seed()
