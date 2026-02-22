import { Feed } from "@/components/Feed"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"

export default async function Home() {
  const supabase = await createClient()

  // Fetch the latest article along with its topic and author details
  const { data: latestArticle, error } = await supabase
    .from("articles")
    .select(`
      *,
      topic:topics ( id, title, slug ),
      author:profiles ( id, username, full_name, avatar_url )
    `)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !latestArticle) {
    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching latest article:", error.message)
    }
    return (
      <div className="w-full h-40 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg mt-8">
        Henüz içerik bulunmuyor.
      </div>
    )
  }

  // Fetch some related articles for the topic (excluding the current one)
  const { data: relatedArticles } = await supabase
    .from("articles")
    .select('id, title')
    .eq('topic_id', latestArticle.topic_id)
    .neq('id', latestArticle.id)
    .limit(3)

  return <Feed article={latestArticle as any} relatedArticles={relatedArticles || []} />
}
