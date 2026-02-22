import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { GirdiItem } from "@/components/GirdiItem"
import { AdSection } from "@/components/AdSection"

interface ArticleWithAuthor {
    id: string
    title: string
    content: string
    created_at: string
    author_id: string
    author: { username: string; full_name: string | null; avatar_url: string | null } | { username: string; full_name: string | null; avatar_url: string | null }[] | null
}

export default async function TopicPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const resolvedParams = await params
    const slug = resolvedParams.slug

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

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
    const { data: rawArticles } = await supabase
        .from("articles")
        .select(`
            id, title, content, created_at, author_id, related_links, related_videos, upvotes, downvotes,
            author:profiles ( username, full_name, avatar_url )
        `)
        .eq('topic_id', topic.id)
        .order('created_at', { ascending: false })

    const articles = (rawArticles || []) as ArticleWithAuthor[]


    return (
        <div className="w-full pb-20">
            {/* Top Ad in Topic */}
            <AdSection position="top" className="mb-8" />

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
                <div className="mt-4">
                    <Link
                        href={`/yaz?topic_id=${topic.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                        + Yeni Girdi Ekle
                    </Link>
                </div>
            </div>

            {/* Articles List */}
            <div className="space-y-8">
                {(!articles || articles.length === 0) ? (
                    <div className="p-8 border border-dashed border-border rounded-lg text-center bg-secondary/10">
                        <p className="text-muted-foreground">Bu konu başlığı altında henüz bir girdi bulunmuyor.</p>
                        <Link href={`/yaz?topic_id=${topic.id}`} className="mt-4 inline-block text-primary font-medium hover:underline">
                            İlk yazan sen ol
                        </Link>
                    </div>
                ) : (
                    articles.map((article, index) => (
                        <GirdiItem
                            key={article.id}
                            girdi={article as any}
                            currentUserId={user?.id}
                            index={index}
                            totalCount={articles.length}
                        />
                    ))
                )}
            </div>

            {/* Bottom Ad in Topic */}
            <div className="mt-12">
                <AdSection position="bottom" className="mb-8" />
            </div>
        </div>
    )
}
