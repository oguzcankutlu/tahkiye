"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

function slugify(text: string) {
    const trMap: Record<string, string> = {
        'ç': 'c', 'ğ': 'g', 'ş': 's', 'ü': 'u', 'ı': 'i', 'ö': 'o',
        'Ç': 'C', 'Ğ': 'G', 'Ş': 'S', 'Ü': 'U', 'İ': 'I', 'Ö': 'O'
    }
    for (let key in trMap) {
        text = text.replace(new RegExp(key, 'g'), trMap[key])
    }
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
}

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
        return { error: 'Profiliniz bulunamadı.' }
    }

    // 3. Form verilerini al
    let topic_id = formData.get('topic_id') as string // UUID if adding to existing
    const new_topic_title = formData.get('new_topic_title') as string
    const category_id = formData.get('category_id') as string // UUID if provided
    const content = formData.get('content') as string
    const related_videos = formData.get('related_videos') as string || '[]'
    const related_links = formData.get('related_links') as string || '[]'

    // IA Fields
    const type = formData.get('type') as string || 'general'
    const era = formData.get('era') as string
    const era_year_str = formData.get('era_year') as string
    const era_year = era_year_str ? parseInt(era_year_str) : null

    // Validation
    if ((!topic_id && !new_topic_title) || !content) {
        return { error: 'Lütfen konu başlığını ve girdi metnini doldurun.' }
    }

    const videosArray = JSON.parse(related_videos)
    const firstVideoUrl = videosArray[0]?.url || ""

    // 4. Eğer Yeni Konu ise önce Konuyu Oluştur
    if (new_topic_title && !topic_id) {
        const slug = slugify(new_topic_title)

        // Check if topic with this slug already exists to prevent errors
        const { data: existingTopic } = await supabase
            .from('topics')
            .select('id')
            .eq('slug', slug)
            .single()

        if (existingTopic) {
            topic_id = existingTopic.id
        } else {
            const { data: newTopic, error: topicError } = await supabase
                .from('topics')
                .insert({
                    title: new_topic_title,
                    slug: slug,
                    category_id: category_id || null,
                    type: type,
                    era: era || null,
                    era_year: era_year
                })
                .select('id')
                .single()

            if (topicError) {
                console.error("Konu oluşturma hatası:", topicError.message)
                return { error: 'Yeni konu oluşturulurken hata: ' + topicError.message }
            }
            topic_id = newTopic.id
        }
    }

    // Okuma süresini kabaca hesapla
    const wordCount = content.trim().split(/\s+/).length
    const read_time = Math.max(1, Math.ceil(wordCount / 200))

    // 5. Supabase'e Girdiyi Ekle
    const { data: newArticle, error } = await supabase
        .from('articles')
        .insert({
            author_id: profile.id,
            topic_id,
            title: new_topic_title || "", // Use new title if provided, or empty for entries (topic title is the source of truth)
            content,
            read_time,
            related_links,
            video_url: firstVideoUrl,
        })
        .select('id')
        .single()

    if (error) {
        console.error("Girdi ekleme hatası:", error.message)
        return { error: 'Girdi yayınlanırken bir hata oluştu: ' + error.message }
    }

    // 6. Çoklu Videoları Kaydet
    if (videosArray.length > 0) {
        const videosToInsert = videosArray.map((v: any) => ({
            title: v.title || new_topic_title || "Yeni Video",
            video_url: v.url,
            thumbnail_url: "",
            category: "Girdi Videosu",
            topic_id: topic_id
        }))

        const { error: videoError } = await supabase
            .from('videos')
            .insert(videosToInsert)

        if (videoError) console.error("Video toplu ekleme hatası:", videoError.message)
    }

    // 7. Başarılı ise yönlendir
    revalidatePath('/', 'layout')
    revalidatePath('/videolar')
    revalidatePath('/admin')

    // Determine redirect path
    if (newArticle?.id) {
        redirect(`/article/${newArticle.id}`)
    }

    return { error: 'Bilinmeyen bir hata oluştu.' }
}

export async function updateArticle(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Giriş yapmanız gerekiyor.' }

    const id = formData.get('id') as string
    const content = formData.get('content') as string
    const related_links = formData.get('related_links') as string || '[]'
    const related_videos = formData.get('related_videos') as string || '[]'

    if (!id || !content) return { error: 'Eksik bilgi.' }

    // Yetki kontrolü (Yazar mı?)
    const { data: article } = await supabase.from('articles').select('author_id, topic_id').eq('id', id).single()
    if (!article || article.author_id !== user.id) return { error: 'Bu girdi üzerinde düzenleme yetkiniz yok.' }

    const videosArray = JSON.parse(related_videos)
    const firstVideoUrl = videosArray[0]?.url || ""

    const { error } = await supabase
        .from('articles')
        .update({
            content,
            related_links,
            related_videos,
            video_url: firstVideoUrl
        })
        .eq('id', id)

    if (error) return { error: error.message }

    // Videoları Global Kütüphaneye de Ekle (Sadece Girdi Güncellenirse)
    if (videosArray.length > 0) {
        // Zaten var olan videoları tekrar eklememek için URL'leri kontrol et
        const extractedUrls = videosArray.map((v: any) => v.url)
        const { data: existingVideos } = await supabase
            .from('videos')
            .select('video_url')
            .in('video_url', extractedUrls)

        const existingUrls = existingVideos?.map(v => v.video_url) || []

        const newVideosToInsert = videosArray
            .filter((v: any) => !existingUrls.includes(v.url))
            .map((v: any) => ({
                title: v.title || "Yeni Girdi Videosu",
                video_url: v.url,
                thumbnail_url: "",
                category: "Girdi Videosu",
                topic_id: article.topic_id
            }))

        if (newVideosToInsert.length > 0) {
            const { error: videoError } = await supabase
                .from('videos')
                .insert(newVideosToInsert)

            if (videoError) console.error("Video güncelleme/ekleme hatası:", videoError.message)
        }
    }

    revalidatePath('/', 'layout')
    revalidatePath('/videolar', 'layout')
    return { success: true }
}
