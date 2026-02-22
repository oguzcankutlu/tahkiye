import Link from "next/link"
import { Search } from "lucide-react"
import { createClient } from "@/utils/supabase/server"

export default async function AramaPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParams
    const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : ''

    const supabase = await createClient()

    // Arama Sorgusu (İlgili Girdileri Başlık veya İçeriğe Göre Getir)
    let searchResults: any[] = []

    if (query.trim()) {
        const { data } = await supabase
            .from('articles')
            .select(`
                id, title, content,
                topic:topics ( id, title, slug ),
                author:profiles ( full_name, username )
            `)
            .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
            .limit(10)

        searchResults = data || []
    }

    return (
        <div className="w-full pb-20">
            <div className="mb-8 border-b border-border/40 pb-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
                    <Search className="h-8 w-8 text-primary" />
                    Arama Sonuçları
                </h1>
                <p className="mt-2 text-muted-foreground">
                    {query ? (
                        <><span className="font-semibold text-primary">"{query}"</span> için bulunan sonuçlar</>
                    ) : (
                        "Arama yapmak için bir kelime girin."
                    )}
                </p>
            </div>

            {query ? (
                <div className="space-y-6">
                    {searchResults.length > 0 ? (
                        searchResults.map((article) => {
                            const topicTitle = Array.isArray(article.topic) ? article.topic[0]?.title : article.topic?.title
                            const topicSlug = Array.isArray(article.topic) ? article.topic[0]?.slug : article.topic?.slug
                            const authorName = Array.isArray(article.author)
                                ? (article.author[0]?.full_name || article.author[0]?.username)
                                : (article.author?.full_name || article.author?.username)

                            // İçerik özetini (snippet) oluştur
                            const contentSnippet = article.content.length > 150
                                ? article.content.substring(0, 150) + '...'
                                : article.content

                            return (
                                <div key={article.id} className="p-6 border border-border/40 rounded-lg bg-secondary/10 hover:border-primary/50 transition-colors">
                                    <h3 className="text-lg font-bold text-foreground">
                                        <Link href={`/article/${article.id}`} className="hover:text-primary transition-colors">
                                            {article.title}
                                        </Link>
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                        {contentSnippet}
                                    </p>
                                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium">
                                        <Link href={`/topic/${topicSlug}`} className="px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                                            Konu: {topicTitle}
                                        </Link>
                                        <span className="text-muted-foreground/50">•</span>
                                        <span className="text-muted-foreground">Yazar: {authorName}</span>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="text-center py-12 text-muted-foreground flex flex-col items-center p-6 border border-dashed border-border rounded-lg bg-secondary/5">
                            <Search className="h-8 w-8 opacity-20 mb-3" />
                            <p>Aradığınız kelimeye uygun bir içerik bulunamadı.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
                    <Search className="h-12 w-12 opacity-20 mb-4" />
                    <p>Lütfen header arama çubuğundan spesifik bir terim girin.</p>
                </div>
            )}
        </div>
    )
}
