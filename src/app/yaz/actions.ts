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
    const category_ids_str = formData.get('category_ids') as string // array JSON
    const category_ids = category_ids_str ? JSON.parse(category_ids_str) : []
    const content = formData.get('content') as string
    const related_videos = formData.get('related_videos') as string || '[]'
    const related_links = formData.get('related_links') as string || '[]'

    // Tag Arrays
    const generalTagsStr = formData.get('general_tags') as string
    const dateTagsStr = formData.get('date_tags') as string
    const generalTags: string[] = generalTagsStr ? JSON.parse(generalTagsStr) : []
    const dateTags: string[] = dateTagsStr ? JSON.parse(dateTagsStr) : []

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
                    category_ids: category_ids
                })
                .select('id')
                .single()

            if (topicError) {
                console.error("Konu oluşturma hatası:", topicError.message)
                return { error: 'Yeni konu oluşturulurken hata: ' + topicError.message }
            }
            topic_id = newTopic.id
        }

        // --- Etiket İşlemleri ---
        const allTags = [
            ...generalTags.map(t => ({ name: t, type: 'general', slug: slugify(t) })),
            ...dateTags.map(t => ({ name: t, type: 'date', slug: slugify(t) }))
        ]

        if (allTags.length > 0) {
            // 1. Veritabanındaki Mevcut Etiketleri Bul
            const slugs = allTags.map(t => t.slug)
            const { data: existingDbTags } = await supabase
                .from('tags')
                .select('id, slug')
                .in('slug', slugs)

            const existingSlugs = new Set((existingDbTags || []).map(t => t.slug))
            const tagsToInsert = allTags.filter(t => !existingSlugs.has(t.slug))

            // 2. Yeni Etiketleri Ekle
            let allTagIds: string[] = (existingDbTags || []).map(t => t.id)
            if (tagsToInsert.length > 0) {
                const { data: newDbTags } = await supabase
                    .from('tags')
                    .insert(tagsToInsert)
                    .select('id')
                if (newDbTags) {
                    allTagIds = [...allTagIds, ...newDbTags.map(t => t.id)]
                }
            }

            // 3. Konuyu Etiketlerle Eşleştir (topic_tags)
            if (allTagIds.length > 0) {
                const topicTagsData = allTagIds.map(tag_id => ({ topic_id, tag_id }))
                await supabase.from('topic_tags').insert(topicTagsData)
            }
        }
    }

    // Okuma süresini kabaca hesapla
    const wordCount = content.trim().split(/\s+/).length
    const read_time = Math.max(1, Math.ceil(wordCount / 200))

    // 5. Supabase'e Girdiyi Ekle
    const linksArray = JSON.parse(related_links)

    const { data: newArticle, error } = await supabase
        .from('articles')
        .insert({
            author_id: profile.id,
            topic_id,
            title: new_topic_title || "", // Use new title if provided, or empty for entries
            content,
            read_time,
            related_links: linksArray,
            related_videos: videosArray,
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
    const title = formData.get('title') as string || ''
    const related_links = formData.get('related_links') as string || '[]'
    const related_videos = formData.get('related_videos') as string || '[]'

    if (!id || !content) return { error: 'Eksik bilgi.' }

    // Yetki kontrolü (Yazar mı?)
    const { data: article } = await supabase.from('articles').select('author_id, topic_id').eq('id', id).single()
    if (!article || article.author_id !== user.id) return { error: 'Bu girdi üzerinde düzenleme yetkiniz yok.' }

    const videosArray = JSON.parse(related_videos)
    const linksArray = JSON.parse(related_links)
    const firstVideoUrl = videosArray[0]?.url || ""

    const { error } = await supabase
        .from('articles')
        .update({
            title,
            content,
            related_links: linksArray,
            related_videos: videosArray,
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
