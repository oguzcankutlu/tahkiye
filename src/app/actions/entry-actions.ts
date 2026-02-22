"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function voteArticle(articleId: string, type: 'up' | 'down') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Oy vermek için giriş yapmalısınız." }
    }

    // 1. Yazıyı ve mevcut oyları/seçmenleri al
    const { data: article, error: fetchError } = await supabase
        .from('articles')
        .select('upvotes, downvotes, voters')
        .eq('id', articleId)
        .single()

    if (fetchError || !article) {
        return { error: "Yazı bulunamadı." }
    }

    const voters = article.voters || []

    // 2. Kullanıcı daha önce oy vermiş mi kontrol et
    if (voters.includes(user.id)) {
        return { error: "Bu yazıya zaten oy verdiniz." }
    }

    // 3. Oyları güncelle
    const updates: any = {
        voters: [...voters, user.id]
    }

    if (type === 'up') {
        updates.upvotes = (article.upvotes || 0) + 1
    } else {
        updates.downvotes = (article.downvotes || 0) + 1
    }

    const { error: updateError } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', articleId)

    if (updateError) {
        return { error: "Oy kaydedilirken hata oluştu: " + updateError.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}
