import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import AdminDashboardClient from "./AdminDashboard"

export default async function AdminPage() {
    const supabase = await createClient()

    // 1. Yetki Kontrolü
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        redirect('/login')
    }

    // Basit RLS veya Role check (Ek güvenlik: bu sayfaya sadece yetkili biri erişmeli)
    // Şimdilik sadece login olması admin panelini açıyor varsayıyoruz (Senaryo gereği)

    // 2. Konuları çek
    const { data: topics } = await supabase
        .from('topics')
        .select('id, title, slug')
        .order('title', { ascending: true })

    return <AdminDashboardClient topics={topics || []} />
}
