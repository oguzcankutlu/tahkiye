import { Feed } from "@/components/Feed"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"

export default async function ArticlePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const resolvedParams = await params
    const id = resolvedParams.id

    const supabase = await createClient()

    // Fetch the specific article along with its topic and author details
    const { data: article, error } = await supabase
        .from("articles")
        .select(`
            *,
            topic:topics ( id, title, slug ),
            author:profiles ( id, username, full_name, avatar_url )
        `)
        .eq('id', id)
        .single()

    if (error || !article) {
        if (error && error.code !== 'PGRST116') {
            console.error("Error fetching article:", error.message)
        }
        return notFound()
    }

    // Fetch some related articles for the same topic (excluding the current one)
    const { data: relatedArticles } = await supabase
        .from("articles")
        .select('id, title')
        .eq('topic_id', article.topic_id)
        .neq('id', article.id)
        .limit(3)

    return <Feed article={article} relatedArticles={relatedArticles || []} />
}
