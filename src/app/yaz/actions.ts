"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function submitArticle(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // 1. Yetki Kontrolü
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Girdi yayınlamak için giriş yapmalısınız.' }
    }

    // 2. Kullanıcının profil id'sini bul
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

    if (!profile) {
        return { error: 'Profiliniz bulunamadı. Lütfen yöneticinizle iletişime geçin.' }
    }

    // 3. Form verilerini al
    const title = formData.get('title') as string
    const topic_id = formData.get('topic_id') as string // UUID
    const content = formData.get('content') as string

    if (!title || !topic_id || !content) {
        return { error: 'Lütfen tüm alanları doldurun.' }
    }

    // Okuma süresini kabaca hesapla (200 kelime / dakika)
    const wordCount = content.trim().split(/\s+/).length
    const read_time = Math.max(1, Math.ceil(wordCount / 200))

    // 4. Supabase'e Girdiyi Ekle
    const { data: newArticle, error } = await supabase
        .from('articles')
        .insert({
            author_id: profile.id,
            topic_id,
            title,
            content,
            read_time
        })
        .select('id')
        .single()

    if (error) {
        console.error("Yazı ekleme hatası:", error.message)
        return { error: 'Makale yayınlanırken bir hata oluştu: ' + error.message }
    }

    // 5. Başarılı ise makalenin sayfasına yönlendir
    if (newArticle?.id) {
        redirect(`/article/${newArticle.id}`)
    }

    return { error: 'Bilinmeyen bir hata oluştu.' }
}
