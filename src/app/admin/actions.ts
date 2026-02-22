"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function createTopic(formData: FormData) {
    const supabase = await createClient()

    // 1. Yetki Kontrolü
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Yetkisiz erişim.' }

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string

    if (!title || !slug) return { error: 'Başlık ve Slug zorunludur.' }

    const { error } = await supabase
        .from('topics')
        .insert({ title, slug, description })

    if (error) {
        console.error("Konu ekleme hatası:", error.message)
        return { error: error.message }
    }

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
}

export async function createVideo(formData: FormData) {
    const supabase = await createClient()

    // 1. Yetki Kontrolü
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Yetkisiz erişim.' }

    const title = formData.get('title') as string
    const topic_id = formData.get('topic_id') as string // UUID
    const video_url = formData.get('video_url') as string
    const duration = formData.get('duration') as string
    const thumbnail_url = formData.get('thumbnail_url') as string

    if (!title || !topic_id || !video_url) return { error: 'Başlık, Konu ve URL zorunludur.' }

    const { error } = await supabase
        .from('videos')
        .insert({
            title,
            topic_id,
            video_url,
            duration,
            thumbnail_url: thumbnail_url || 'bg-secondary'
        })

    if (error) {
        console.error("Video ekleme hatası:", error.message)
        return { error: error.message }
    }

    revalidatePath('/admin')
    revalidatePath('/videolar')
    return { success: true }
}
