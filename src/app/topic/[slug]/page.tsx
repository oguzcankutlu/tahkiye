import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"

export default async function TopicPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const resolvedParams = await params
    const slug = resolvedParams.slug

    const supabase = await createClient()

    // 1. Fetch the topic by slug
    const { data: topic, error: topicError } = await supabase
        .from("topics")
        .select('*')
        .eq('slug', slug)
        .single()

    if (topicError || !topic) {
        return notFound()
    }

    // 2. Fetch all articles related to this topic
    const { data: articles, error: articlesError } = await supabase
        .from("articles")
        .select(`
            id, title, content, created_at, read_time,
            author:profiles ( username, full_name, avatar_url )
        `)
        .eq('topic_id', topic.id)
        .order('created_at', { ascending: false })

    return (
        <div className="w-full pb-20">
            {/* Header / Topic Info */}
            <div className="mb-8 border-b border-border/40 pb-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary font-bold text-sm uppercase tracking-wider">Konu</span>
                    <span className="text-muted-foreground/50">•</span>
                    <span className="text-muted-foreground text-sm">{articles?.length || 0} Girdi</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    {topic.title}
                </h1>
                {topic.description && (
                    <p className="mt-3 text-lg text-muted-foreground/90 max-w-3xl leading-relaxed">
                        {topic.description}
                    </p>
                )}
            </div>

            {/* Articles List */}
            <div className="space-y-6">
                {(!articles || articles.length === 0) ? (
                    <div className="p-8 border border-dashed border-border rounded-lg text-center bg-secondary/10">
                        <p className="text-muted-foreground">Bu konu başlığı altında henüz bir girdi bulunmuyor.</p>
                        <Link href="/yaz" className="mt-4 inline-block text-primary font-medium hover:underline">
                            İlk yazan sen ol
                        </Link>
                    </div>
                ) : (
                    articles.map((article) => {
                        const authorName = Array.isArray(article.author)
                            ? (article.author[0]?.full_name || article.author[0]?.username)
                            : (article.author?.full_name || article.author?.username)

                        const initialLetter = authorName ? authorName.charAt(0).toUpperCase() : 'A'

                        const formattedDate = new Date(article.created_at).toLocaleDateString("tr-TR", {
                            day: "2-digit", month: "long", year: "numeric"
                        })

                        // Snippet for list view
                        const contentSnippet = article.content.length > 200
                            ? article.content.substring(0, 200) + '...'
                            : article.content

                        return (
                            <article key={article.id} className="p-6 border border-border/40 rounded-xl bg-card hover:border-primary/50 hover:shadow-sm transition-all group">
                                <Link href={`/article/${article.id}`} className="block">
                                    <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-2">
                                        {article.title}
                                    </h2>
                                    <p className="text-muted-foreground/90 line-clamp-3 leading-relaxed text-sm">
                                        {contentSnippet}
                                    </p>
                                </Link>

                                <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-border">
                                            {initialLetter}
                                        </div>
                                        <span className="text-xs font-medium text-foreground">{authorName}</span>
                                        <span className="text-muted-foreground/50 text-xs">•</span>
                                        <span className="text-xs text-muted-foreground">{formattedDate}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                                        {article.read_time} dk okuma
                                    </div>
                                </div>
                            </article>
                        )
                    })
                )}
            </div>
        </div>
    )
}
