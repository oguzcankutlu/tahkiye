"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function voteArticle(articleId: string, type: 'up' | 'down') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Oy vermek için giriş yapmalısınız." }
    }

    // Use a secure RPC to bypass RLS UPDATE policy checking ownership
    const { error: rpcError } = await supabase.rpc('vote_for_article', {
        target_article_id: articleId,
        vote_type: type,
        user_id: user.id
    })

    if (rpcError) {
        return { error: "Oy kaydedilirken hata oluştu: " + rpcError.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}
