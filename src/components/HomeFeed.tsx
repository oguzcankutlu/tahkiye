"use client"

import { useState } from "react"
import { Share2, MessageCircle, Facebook, Send, Copy, Pencil } from "lucide-react"
import Link from "next/link"
import { voteArticle } from "@/app/actions/entry-actions"

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
    upvotes?: number
    downvotes?: number
    author: Author
    topic: Topic
}

export function HomeFeed({
    articles,
    currentUserId
}: {
    articles: Article[]
    currentUserId?: string
}) {
    const [showShareId, setShowShareId] = useState<string | null>(null)
    const [isVoting, setIsVoting] = useState(false)

    const handleVote = async (articleId: string, type: 'up' | 'down') => {
        if (!currentUserId) {
            alert("Oy vermek için giriş yapmalısınız.")
            return
        }
        setIsVoting(true)
        const res = await voteArticle(articleId, type)
        if (res.error) alert(res.error)
        setIsVoting(false)
    }

    const getShareLink = (id: string) => typeof window !== 'undefined' ? `${window.location.origin}/article/${id}` : ""

    const copyToClipboard = (id: string) => {
        navigator.clipboard.writeText(getShareLink(id))
        alert("Link kopyalandı!")
        setShowShareId(null)
    }

    if (!articles || articles.length === 0) {
        return (
            <div className="w-full pb-20 mt-8">
                <div className="p-8 border border-dashed border-border rounded-lg text-center bg-secondary/10">
                    <p className="text-muted-foreground">Sistemde henüz bir girdi bulunmuyor.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full pb-20 space-y-12 mt-6">
            <div className="border-b border-border/40 pb-4">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    En Çok Beğenilenler
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Platformdaki en dikkat çekici paylaşımlar.</p>
            </div>

            <div className="space-y-16">
                {articles.map((article, index) => {
                    const formattedDate = new Date(article.created_at).toLocaleDateString("tr-TR", {
                        month: "long", year: "numeric"
                    })

                    const snippet = article.content.length > 400
                        ? article.content.substring(0, 400) + '...'
                        : article.content

                    const displayName = article.author?.full_name || article.author?.username || "Anonim Yazar"
                    const initialLetter = displayName.charAt(0).toUpperCase()
                    const shareLink = getShareLink(article.id)

                    return (
                        <article key={article.id} className="relative group flex flex-col gap-4 border-b border-border/20 pb-12 last:border-0 last:pb-0">

                            {/* Ranking Num for Top 3 */}
                            {index < 3 && (
                                <div className="absolute -left-12 top-0 hidden md:flex w-8 h-8 rounded-full bg-primary/10 border border-primary/20 items-center justify-center font-black text-primary text-sm shadow-sm ring-4 ring-background">
                                    {index + 1}
                                </div>
                            )}

                            {/* Author Info */}
                            <div className="flex items-center gap-3">
                                <Link href={`/profile/${article.author.username}`} className="w-8 h-8 rounded-full bg-secondary overflow-hidden border border-border/50 shrink-0 flex justify-center items-center text-xs font-bold text-muted-foreground hover:ring-2 hover:ring-primary/40 transition-all">
                                    {article.author.avatar_url ? (
                                        <img src={article.author.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{initialLetter}</span>
                                    )}
                                </Link>
                                <div className="flex flex-col">
                                    <Link href={`/profile/${article.author.username}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                                        {displayName}
                                    </Link>
                                </div>
                            </div>

                            {/* Article Body */}
                            <div>
                                <Link href={`/article/${article.id}`} className="block">
                                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight mb-2">
                                        {article.title}
                                    </h2>
                                </Link>
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <Link href={`/konu/${article.topic?.slug}`} className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md text-[11px] font-bold uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-all">
                                        {article.topic?.title}
                                    </Link>
                                    <span className="text-muted-foreground/30">•</span>
                                    <span className="text-xs font-medium text-muted-foreground">{article.read_time} dk okuma</span>
                                </div>

                                <div className="prose prose-neutral dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-base text-muted-foreground">
                                    <p>{snippet}</p>
                                </div>

                                {article.content.length > 400 && (
                                    <div className="mt-3">
                                        <Link href={`/article/${article.id}`} className="text-sm font-semibold text-primary/80 hover:text-primary hover:underline underline-offset-4 transition-all">
                                            Devamını Oku &rarr;
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Actions Footer */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-2 border-t border-border/10">
                                <div className="flex items-center gap-5 text-xs font-bold text-muted-foreground">
                                    <button
                                        onClick={() => handleVote(article.id, 'up')}
                                        disabled={isVoting}
                                        className="flex items-center gap-1.5 hover:text-primary transition-colors hover:scale-105 active:scale-95"
                                    >
                                        <span className="text-lg grayscale hover:grayscale-0">👏</span>
                                        <span className="tabular-nums">{article.upvotes || 0}</span>
                                    </button>
                                    <button
                                        onClick={() => handleVote(article.id, 'down')}
                                        disabled={isVoting}
                                        className="flex items-center gap-1.5 hover:text-destructive transition-colors hover:scale-105 active:scale-95"
                                    >
                                        <span className="text-lg grayscale hover:grayscale-0">👎</span>
                                        <span className="tabular-nums">{article.downvotes || 0}</span>
                                    </button>
                                    <span className="text-[10px] text-muted-foreground/50 uppercase font-medium ml-2 border-l border-border/50 pl-4 h-4 flex items-center">
                                        {formattedDate}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowShareId(showShareId === article.id ? null : article.id)}
                                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold border border-border/50 rounded-lg hover:bg-secondary/50 hover:text-primary transition-all"
                                        >
                                            <Share2 className="h-3.5 w-3.5" />
                                            Paylaş
                                        </button>

                                        {showShareId === article.id && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setShowShareId(null)} />
                                                <div className="absolute bottom-full right-0 mb-3 w-48 bg-card border border-border/80 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                                                    <div className="grid grid-cols-1 gap-1">
                                                        <a href={`https://wa.me/?text=${encodeURIComponent(shareLink)}`} target="_blank" className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary text-xs font-medium transition-colors">
                                                            <MessageCircle className="h-4 w-4 text-green-500" /> WhatsApp
                                                        </a>
                                                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`} target="_blank" className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary text-xs font-medium transition-colors">
                                                            <Facebook className="h-4 w-4 text-blue-600" /> Facebook
                                                        </a>
                                                        <a href={`https://t.me/share/url?url=${encodeURIComponent(shareLink)}`} target="_blank" className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary text-xs font-medium transition-colors">
                                                            <Send className="h-4 w-4 text-sky-500" /> Telegram
                                                        </a>
                                                        <button onClick={() => copyToClipboard(article.id)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary text-xs font-medium transition-colors border-t border-border/40 mt-1">
                                                            <Copy className="h-4 w-4 text-muted-foreground" /> Linki Kopyala
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {currentUserId === article.author.id && (
                                        <Link
                                            href={`/yaz?edit_id=${article.id}`}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-primary/30 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                            Düzenle
                                        </Link>
                                    )}
                                </div>
                            </div>

                        </article>
                    )
                })}
            </div>
        </div>
    )
}
