"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function createTopic(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Yetkisiz erişim.' }

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string

    if (!title || !slug) return { error: 'Başlık ve Slug zorunludur.' }

    const { error } = await supabase.from('topics').insert({ title, slug, description })
    if (error) return { error: error.message }

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
}

export async function deleteTopic(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Yetkisiz erişim.' }

    const id = formData.get('id') as string
    const { error } = await supabase.from('topics').delete().eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
}

export async function createVideo(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Yetkisiz erişim.' }

    const title = formData.get('title') as string
    const topic_id = formData.get('topic_id') as string
    const video_url = formData.get('video_url') as string
    const duration = formData.get('duration') as string

    if (!title || !topic_id || !video_url) return { error: 'Başlık, Konu ve URL zorunludur.' }

    const { error } = await supabase.from('videos').insert({ title, topic_id, video_url, duration, thumbnail_url: 'bg-secondary' })
    if (error) return { error: error.message }

    revalidatePath('/admin')
    revalidatePath('/videolar')
    return { success: true }
}

export async function deleteVideo(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Yetkisiz erişim.' }

    const id = formData.get('id') as string
    const { error } = await supabase.from('videos').delete().eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/admin')
    revalidatePath('/videolar')
    return { success: true }
}

export async function deleteArticle(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Yetkisiz erişim.' }

    const id = formData.get('id') as string
    const { error } = await supabase.from('articles').delete().eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
}

export async function deleteProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Yetkisiz erişim.' }

    const id = formData.get('id') as string
    // Sadece profili siliyoruz — Supabase auth kullanıcısı ayrı silmek gerekir
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/admin')
    return { success: true }
}
