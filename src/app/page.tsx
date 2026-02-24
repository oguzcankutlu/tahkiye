import { HomeFeed } from "@/components/HomeFeed"
import { createClient } from "@/utils/supabase/server"

export default async function Home() {
  const supabase = await createClient()

  const [articlesRes, categoriesRes] = await Promise.all([
    supabase
      .from("articles")
      .select(`
        *,
        topic:topics ( id, title, slug, category_ids, topic_tags( tags( id, name, type, slug ) ) ),
        author:profiles ( id, username, full_name, avatar_url )
      `)
      .order('upvotes', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(10),
    supabase.from('categories').select('id, title, slug')
  ])

  const { data: rawArticles, error } = articlesRes
  const categories = categoriesRes.data || []

  if (error || !rawArticles || rawArticles.length === 0) {
    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching top articles:", error.message)
    }
    return (
      <div className="w-full h-40 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg mt-8">
        Henüz içerik bulunmuyor.
      </div>
    )
  }

  const { data: { user } } = await supabase.auth.getUser()

  return <HomeFeed articles={rawArticles as any[]} categories={categories} currentUserId={user?.id} />
}
