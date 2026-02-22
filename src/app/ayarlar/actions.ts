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

    const full_name = formData.get('full_name') as string
    const avatar_url = formData.get('avatar_url') as string
    const bio = formData.get('bio') as string

    // 2. Profil Güncelleme
    const { error } = await supabase
        .from('profiles')
        .update({
            full_name,
            avatar_url,
            // Eğer Supabase tablonda 'bio' kolonu yoksa, bu satırı sil veya veritabanına ekle.
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
