import { createClient } from "@/utils/supabase/server"
import AdminDashboardClient from "./AdminDashboard"
import AdminLoginGate from "./AdminLoginGate"

export default async function AdminPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <AdminLoginGate />
    }

    const [topicsRes, videosRes, articlesRes, profilesRes, adsRes] = await Promise.all([
        supabase.from('topics').select('id, title, slug, description, created_at').order('created_at', { ascending: false }),
        supabase.from('videos').select('id, title, video_url, duration, created_at').order('created_at', { ascending: false }),
        supabase.from('articles').select('id, title, created_at, author_id, topic_id').order('created_at', { ascending: false }),
        supabase.from('profiles').select('id, username, full_name, avatar_url, created_at').order('created_at', { ascending: false }),
        supabase.from('ads').select('id, title, image_url, link_url, position, is_active, created_at').order('created_at', { ascending: false }),
    ])

    return (
        <AdminDashboardClient
            topics={topicsRes.data || []}
            videos={videosRes.data || []}
            articles={articlesRes.data || []}
            profiles={profilesRes.data || []}
            ads={adsRes.data || []}
        />
    )
}
