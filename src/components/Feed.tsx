import { Share2, BookmarkPlus } from "lucide-react"
import { Accordion } from "./Accordion"
import Link from "next/link"

interface Author {
    id: string
    username: string
    full_name: string | null
    avatar_url: string | null
}

interface Topic {
    id: string
    title: string
    slug: string
}

interface Article {
    id: string
    title: string
    content: string
    read_time: number
    created_at: string
    author: Author
    topic: Topic
}

interface FeedProps {
    article: Article
    relatedArticles: { id: string; title: string }[]
}

export function Feed({ article, relatedArticles }: FeedProps) {
    const formattedDate = new Date(article.created_at).toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    })

    const initialLetter = article.author?.full_name
        ? article.author.full_name.charAt(0).toUpperCase()
        : article.author?.username.charAt(0).toUpperCase() || 'A'

    const displayName = article.author?.full_name || article.author?.username || 'Bilinmeyen Yazar'

    return (
        <div className="w-full pb-20">
            {/* Üst Reklam Alanı Placeholder */}
            <div className="w-full h-24 bg-secondary/30 rounded-lg border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm mb-8">
                Reklam Alanı (Üst)
            </div>

            <article className="space-y-6">
                {/* Başlık */}
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                    {article.title}
                </h1>

                {/* Etiketler (Tags) */}
                <div className="flex flex-wrap gap-2">
                    <Link href={`/topic/${article.topic?.slug}`} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors">
                        {article.topic?.title}
                    </Link>
                </div>

                {/* Yazar Bilgisi */}
                <div className="flex items-center gap-3 py-2">
                    <Link href={`/profile/${article.author?.username}`} className="w-10 h-10 rounded-full bg-secondary overflow-hidden border border-border flex items-center justify-center font-bold text-muted-foreground hover:border-primary transition-colors cursor-pointer text-sm">
                        {initialLetter}
                    </Link>
                    <div>
                        <Link href={`/profile/${article.author?.username}`} className="font-medium text-sm text-foreground hover:underline hover:text-primary transition-colors cursor-pointer">
                            {displayName}
                        </Link>
                    </div>
                </div>

                {/* Girdi Metni */}
                <div className="prose prose-neutral dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6">
                    <p>{article.content}</p>
                </div>

                {/* İlgili İçerikler */}
                {relatedArticles.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-4 my-8">
                        <Accordion title={`İlgili İçerikler (${relatedArticles.length})`}>
                            <ul className="space-y-2">
                                {relatedArticles.map((rel) => (
                                    <li key={rel.id} className="group">
                                        <Link
                                            href={`/article/${rel.id}`}
                                            className="flex items-center gap-2 group-hover:text-primary transition-colors text-sm"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                                            {rel.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Accordion>
                    </div>
                )}

                {/* Aksiyon Barı ve Tarih */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/40 mt-8">
                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground w-full sm:w-auto">
                        <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors">
                            <span className="text-base">👏</span>
                            <span>{Math.floor(Math.random() * 500) + 50}</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-destructive transition-colors">
                            <span className="text-base">👎</span>
                            <span>{Math.floor(Math.random() * 20) + 1}</span>
                        </button>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                        <span className="text-[11px] text-muted-foreground/70 hidden sm:block">
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
                </div>
            </article>

            {/* Alt Reklam Alanı Placeholder */}
            <div className="w-full h-24 bg-secondary/30 rounded-lg border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm mt-12 mb-8">
                Reklam Alanı (Alt)
            </div>
        </div>
    )
}
