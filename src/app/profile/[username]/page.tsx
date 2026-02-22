import { Share2, BookmarkPlus } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"

interface ArticleWithTopic {
    id: string
    title: string
    content: string
    created_at: string
    read_time: number
    topic: { id: string; title: string; slug: string } | { id: string; title: string; slug: string }[] | null
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const resolvedParams = await params
    const decodedUsername = decodeURIComponent(resolvedParams.username)

    const supabase = await createClient()

    // 1. Fetch the Profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', decodedUsername)
        .single()

    if (profileError || !profile) {
        return notFound()
    }

    // 2. Fetch all Articles published by this Profile
    const { data: rawArticles } = await supabase
        .from('articles')
        .select(`
            id, title, content, created_at, read_time,
            topic:topics ( id, title, slug )
        `)
        .eq('author_id', profile.id)
        .order('created_at', { ascending: false })

    const articles = (rawArticles || []) as ArticleWithTopic[]

    const totalArticles = articles?.length || 0
    const totalReadsMock = Math.floor(Math.random() * 5000) + 1200 // Mocking views for now

    const displayName = profile.full_name || profile.username
    const initialLetter = displayName.charAt(0).toUpperCase()

    // Fallback bio since we haven't added bio to DB officially, or if it's empty
    const bioText = '"Sadeleşmek, daha azına sahip olmak değil, daha fazla yer açmaktır." Teknoloji, felsefe ve edebiyat üzerine karalamalar...'

    return (
        <div className="w-full pb-20">

            {/* Profil Başlığı */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12 border-b border-border/40 pb-8 pt-4">
                <div className="w-24 h-24 rounded-full bg-secondary overflow-hidden border-2 border-primary/20 flex items-center justify-center font-bold text-muted-foreground text-2xl shrink-0">
                    {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                        <span>{initialLetter}</span>
                    )}
                </div>
                <div className="text-center sm:text-left flex-1">
                    <h1 className="text-3xl font-bold text-foreground">
                        {displayName}
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-lg">
                        {bioText}
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-6 mt-5 text-sm font-medium">
                        <div className="flex flex-col items-center sm:items-start">
                            <span className="text-foreground text-lg">{totalArticles}</span>
                            <span className="text-muted-foreground text-xs uppercase tracking-wider">Girdi</span>
                        </div>
                        <div className="flex flex-col items-center sm:items-start">
                            <span className="text-foreground text-lg">{(totalReadsMock / 1000).toFixed(1)}k</span>
                            <span className="text-muted-foreground text-xs uppercase tracking-wider">Okunma</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight text-foreground border-b border-border/30 pb-2 inline-block">
                    Tüm Girdileri
                </h2>
            </div>

            {/* Girdi Listesi (Kronolojik) */}
            <div className="space-y-10">
                {(!articles || articles.length === 0) ? (
                    <div className="p-8 border border-dashed border-border rounded-lg text-center bg-secondary/10">
                        <p className="text-muted-foreground">Bu yazar henüz bir girdi yayınlamamış.</p>
                    </div>
                ) : (
                    articles.map(article => {
                        const topicTitle = Array.isArray(article.topic) ? article.topic[0]?.title : article.topic?.title
                        const topicSlug = Array.isArray(article.topic) ? article.topic[0]?.slug : article.topic?.slug

                        const formattedDate = new Date(article.created_at).toLocaleDateString("tr-TR", {
                            day: "2-digit", month: "long", year: "numeric"
                        })

                        const contentSnippet = article.content.length > 300
                            ? article.content.substring(0, 300) + '...'
                            : article.content

                        return (
                            <article key={article.id} className="space-y-4 pb-10 border-b border-border/20 last:border-0">
                                <Link href={`/article/${article.id}`} className="group block">
                                    <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h3>
                                </Link>

                                <div className="flex items-center gap-3 py-1">
                                    <Link href={`/topic/${topicSlug}`} className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded hover:bg-primary hover:text-primary-foreground transition-colors">
                                        {topicTitle}
                                    </Link>
                                    <span className="text-muted-foreground/50">•</span>
                                    <span className="text-xs text-muted-foreground font-medium">
                                        {article.read_time} dk okuma
                                    </span>
                                </div>

                                <div className="prose prose-neutral dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-base">
                                    <p>{contentSnippet}</p>
                                </div>

                                <div className="flex items-center justify-between pt-4 mt-2">
                                    <span className="text-xs text-muted-foreground font-medium">
                                        Yayınlandı: {formattedDate}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/50 rounded-md hover:bg-secondary/50 hover:text-primary transition-colors">
                                            <BookmarkPlus className="h-4 w-4" />
                                            Kaydet
                                        </button>
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/50 rounded-md hover:bg-secondary/50 hover:text-primary transition-colors">
                                            <Share2 className="h-4 w-4" />
                                            Paylaş
                                        </button>
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
