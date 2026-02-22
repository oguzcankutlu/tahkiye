"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateProfile(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // 1. Yetki ve Kullanıcı Kontrolü
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Giriş yapmanız gerekiyor.' }
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

    if (!profile) {
        return { error: 'Profil bulunamadı.' }
    }

    const username = formData.get('username') as string
    const full_name = formData.get('full_name') as string
    const avatar_url = formData.get('avatar_url') as string
    const bio = formData.get('bio') as string

    if (username && username !== profile.username) {
        // Check uniqueness
        const { data: existing } = await supabase.from('profiles').select('id').eq('username', username).neq('id', user.id).single()
        if (existing) return { error: 'Bu kullanıcı adı zaten alınmış.' }
    }

    // 2. Profil Güncelleme
    const { error } = await supabase
        .from('profiles')
        .update({
            ...(username ? { username } : {}),
            full_name,
            avatar_url,
            ...(bio ? { bio } : {})
        })
        .eq('id', user.id)

    if (error) {
        console.error("Profil güncelleme hatası:", error.message)
        return { error: 'Profil güncellenirken bir hata oluştu: ' + error.message }
    }

    revalidatePath('/ayarlar')
    revalidatePath(`/profile/${profile.username}`)

    return { success: true }
}
