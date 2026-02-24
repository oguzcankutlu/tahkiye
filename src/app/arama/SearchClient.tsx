"use client"

import { useState } from "react"
import { Share2, Pencil, MessageCircle, Facebook, Send, Copy, Search } from "lucide-react"
import Link from "next/link"
import { voteArticle } from "@/app/actions/entry-actions"

interface SearchResult {
    id: string
    title: string
    content: string
    upvotes?: number
    downvotes?: number
    topic: { id: string; title: string; slug: string }
    author: { full_name: string | null; username: string }
}

export default function SearchClient({
    searchResults,
    query,
    tagLabel,
    currentUserId
}: {
    searchResults: SearchResult[]
    query: string
    tagLabel?: string
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

    return (
        <div className="w-full pb-20">
            <div className="mb-8 border-b border-border/40 pb-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
                    {tagLabel ? <span className="text-secondary-foreground text-4xl">#</span> : <Search className="h-8 w-8 text-primary" />}
                    {tagLabel ? tagLabel : "Arama Sonuçları"}
                </h1>
                <p className="mt-2 text-muted-foreground">
                    {tagLabel ? (
                        <>Bu etikete sahip tüm konu girdileri listeleniyor.</>
                    ) : query ? (
                        <><span className="font-semibold text-primary">"{query}"</span> için bulunan sonuçlar</>
                    ) : (
                        "Arama yapmak için bir kelime girin."
                    )}
                </p>
            </div>

            {query || tagLabel ? (
                <div className="space-y-6">
                    {searchResults.length > 0 ? (
                        searchResults.map((article) => {
                            const topic = article.topic
                            const author = article.author
                            const authorName = author?.full_name || author?.username

                            const contentSnippet = article.content.length > 200
                                ? article.content.substring(0, 200) + '...'
                                : article.content

                            const shareLink = getShareLink(article.id)

                            return (
                                <div key={article.id} className="p-6 border border-border/40 rounded-xl bg-secondary/10 hover:border-primary/50 transition-all group relative">
                                    <h3 className="text-xl font-bold text-foreground">
                                        <Link href={`/article/${article.id}`} className="hover:text-primary transition-colors">
                                            {article.title}
                                        </Link>
                                    </h3>
                                    <p className="mt-3 text-sm text-muted-foreground/90 leading-relaxed line-clamp-2">
                                        {contentSnippet}
                                    </p>

                                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/10">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-4 bg-secondary/20 px-3 py-1.5 rounded-full border border-border/30">
                                                <button
                                                    onClick={() => handleVote(article.id, 'up')}
                                                    disabled={isVoting}
                                                    className="flex items-center gap-1.5 group/vote"
                                                >
                                                    <span className="text-base group-hover/vote:scale-125 transition-transform grayscale group-hover/vote:grayscale-0">👏</span>
                                                    <span className="text-xs font-bold text-muted-foreground group-hover/vote:text-primary tabular-nums">{article.upvotes || 0}</span>
                                                </button>
                                                <div className="w-px h-3 bg-border/40" />
                                                <button
                                                    onClick={() => handleVote(article.id, 'down')}
                                                    disabled={isVoting}
                                                    className="flex items-center gap-1.5 group/vote"
                                                >
                                                    <span className="text-base group-hover/vote:scale-125 transition-transform grayscale group-hover/vote:grayscale-0">👎</span>
                                                    <span className="text-xs font-bold text-muted-foreground group-hover/vote:text-destructive tabular-nums">{article.downvotes || 0}</span>
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-2 text-[11px] font-medium">
                                                <Link href={`/konu/${topic?.slug}`} className="px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-bold uppercase tracking-tight">
                                                    {topic?.title}
                                                </Link>
                                                <span className="text-muted-foreground/30">•</span>
                                                <Link href={`/profile/${author?.username}`} className="text-muted-foreground hover:text-primary hover:underline transition-colors">{authorName}</Link>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {/* Share */}
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowShareId(showShareId === article.id ? null : article.id)}
                                                    className="p-2 rounded-lg bg-secondary/30 hover:bg-secondary text-muted-foreground hover:text-primary transition-all border border-border/40"
                                                    title="Paylaş"
                                                >
                                                    <Share2 className="h-4 w-4" />
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
                                        </div>
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
