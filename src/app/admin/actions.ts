"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function createTopic(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Yetkisiz erişim.' }

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const category_ids_str = formData.get('category_ids') as string // array JSON
    const category_ids = category_ids_str ? JSON.parse(category_ids_str) : []
    const description = formData.get('description') as string

    if (!title || !slug) return { error: 'Başlık ve Slug zorunludur.' }

    const { error } = await supabase.from('topics').insert({
        title,
        slug,
        category_ids,
        description
    })
    if (error) return { error: error.message }

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
}

export async function updateTopic(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Yetkisiz erişim.' }

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const category_ids_str = formData.get('category_ids') as string
    const category_ids = category_ids_str ? JSON.parse(category_ids_str) : []
    const description = formData.get('description') as string

    if (!id || !title || !slug) return { error: 'ID, Başlık ve Slug zorunludur.' }

    const { error } = await supabase.from('topics').update({
        title,
        slug,
        category_ids,
        description
    }).eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/admin')
    revalidatePath(`/konu/${slug}`)
    revalidatePath('/')
    return { success: true }
}

export async function createCategory(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Yetkisiz erişim.' }

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string

    if (!title || !slug) return { error: 'Başlık ve Slug zorunludur.' }

    const { error } = await supabase.from('categories').insert({ title, slug })
    if (error) return { error: error.message }

    revalidatePath('/', 'layout')
    revalidatePath('/admin')
    return { success: true }
}

export async function deleteCategory(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Yetkisiz erişim.' }

    const id = formData.get('id') as string
    const { error } = await supabase.from('categories').delete().eq('id', id)
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

export async function toggleAdminStatus(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Yetkisiz erişim.' }

    const id = formData.get('id') as string
    const targetStatus = formData.get('is_admin') === 'true'

    const { error } = await supabase.from('profiles').update({ is_admin: targetStatus }).eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/admin')
    return { success: true }
}

export async function deleteUserForce(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Yetkisiz erişim.' }

    const id = formData.get('id') as string

    // Use Postgres RPC to force delete from auth.users (cascades to profiles)
    const { error } = await supabase.rpc('admin_delete_user', { target_user_id: id })
    if (error) return { error: error.message }

    revalidatePath('/admin')
    return { success: true }
}

export async function createAd(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Yetkisiz erişim.' }

    const title = formData.get('title') as string
    const image_url = formData.get('image_url') as string
    const link_url = formData.get('link_url') as string
    const position = formData.get('position') as string

    if (!title) return { error: 'Başlık zorunludur.' }

    const { error } = await supabase.from('ads').insert({ title, image_url, link_url, position, is_active: true })
    if (error) return { error: error.message }

    revalidatePath('/', 'layout')
    revalidatePath('/admin')
    return { success: true }
}

export async function deleteAd(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Yetkisiz erişim.' }

    const id = formData.get('id') as string
    const { error } = await supabase.from('ads').delete().eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/admin')
    return { success: true }
}

export async function toggleAd(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Yetkisiz erişim.' }

    const id = formData.get('id') as string
    const is_active = formData.get('is_active') === 'true'
    const { error } = await supabase.from('ads').update({ is_active: !is_active }).eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/admin')
    return { success: true }
}
