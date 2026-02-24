"use client"

import { useState } from "react"
import { Share2, Pencil, MessageCircle, Facebook, Send, Copy } from "lucide-react"
import Link from "next/link"
import { voteArticle } from "@/app/actions/entry-actions"
import { ViewTracker } from "@/components/ViewTracker"

interface ArticleWithTopic {
    id: string
    title: string
    content: string
    created_at: string
    read_time: number
    views?: number
    upvotes?: number
    downvotes?: number
    topic: { id: string; title: string; slug: string } | { id: string; title: string; slug: string }[] | null
}

export default function ProfileClient({
    profile,
    articles,
    currentUserId
}: {
    profile: any
    articles: ArticleWithTopic[]
    currentUserId?: string
}) {
    const [showShareId, setShowShareId] = useState<string | null>(null)
    const [isVoting, setIsVoting] = useState(false)

    const displayName = profile.full_name || profile.username
    const initialLetter = displayName.charAt(0).toUpperCase()
    const totalArticles = articles?.length || 0
    const totalReadsMock = Math.floor(Math.random() * 5000) + 1200

    const renderBioWithLinks = (text: string) => {
        if (!text) return <span className="italic text-muted-foreground/60">Yazar henüz bir biyografi eklememiş.</span>
        const urlRegex = /(https?:\/\/[^\s]+)/g
        const parts = text.split(urlRegex)
        return parts.map((part, i) => {
            if (part.match(urlRegex)) {
                return (
                    <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                        {part}
                    </a>
                )
            }
            return part
        })
    }

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
                    <div className="text-muted-foreground mt-3 max-w-lg text-sm leading-relaxed whitespace-pre-wrap">
                        {renderBioWithLinks(profile.bio || "")}
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-6 mt-6 text-sm font-medium">
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

            {/* Girdi Listesi */}
            <div className="space-y-10">
                {(!articles || articles.length === 0) ? (
                    <div className="p-8 border border-dashed border-border rounded-lg text-center bg-secondary/10">
                        <p className="text-muted-foreground">Bu yazar henüz bir girdi yayınlamamış.</p>
                    </div>
                ) : (
                    articles.map(article => {
                        const topic = Array.isArray(article.topic) ? article.topic[0] : article.topic
                        const topicTitle = topic?.title
                        const topicSlug = topic?.slug
                        const formattedDate = new Date(article.created_at).toLocaleDateString("tr-TR", {
                            month: "long", year: "numeric"
                        })
                        const contentSnippet = article.content.length > 300
                            ? article.content.substring(0, 300) + '...'
                            : article.content

                        const shareLink = getShareLink(article.id)

                        return (
                            <ViewTracker key={article.id} articleId={article.id}>
                                <article className="space-y-4 pb-10 border-b border-border/20 last:border-0 relative">
                                    <Link href={`/article/${article.id}`} className="group block">
                                        <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                                            {article.title}
                                        </h3>
                                    </Link>

                                    <div className="flex items-center gap-3 py-1">
                                        <Link href={`/konu/${topicSlug}`} className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded hover:bg-primary hover:text-primary-foreground transition-colors">
                                            {topicTitle}
                                        </Link>

                                    </div>

                                    <div className="prose prose-neutral dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-base">
                                        <p>{contentSnippet}</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-2 border-t border-border/10">
                                        <div className="flex items-center gap-6 text-xs font-bold text-muted-foreground">
                                            <button
                                                onClick={() => handleVote(article.id, 'up')}
                                                disabled={isVoting}
                                                className="flex items-center gap-2 hover:text-primary transition-colors group"
                                            >
                                                <span className="text-xl group-hover:scale-125 transition-transform grayscale group-hover:grayscale-0">👏</span>
                                                <span className="tabular-nums">{article.upvotes || 0}</span>
                                            </button>
                                            <button
                                                onClick={() => handleVote(article.id, 'down')}
                                                disabled={isVoting}
                                                className="flex items-center gap-2 hover:text-destructive transition-colors group"
                                            >
                                                <span className="text-xl group-hover:scale-125 transition-transform grayscale group-hover:grayscale-0">👎</span>
                                                <span className="tabular-nums">{article.downvotes || 0}</span>
                                            </button>
                                            <div className="flex items-center gap-1.5 border-l border-border/50 pl-4 text-muted-foreground/80 hover:text-muted-foreground transition-colors ml-2">
                                                <span className="text-lg">👁️</span>
                                                <span className="tabular-nums">{article.views || 0}</span>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground/60 uppercase font-medium ml-2 border-l border-border/50 pl-4 h-4 flex items-center">
                                                {formattedDate}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {/* Share Popover */}
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowShareId(showShareId === article.id ? null : article.id)}
                                                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold border border-border/50 rounded-lg hover:bg-secondary/50 hover:text-primary transition-all"
                                                >
                                                    <Share2 className="h-4 w-4" />
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

                                            {currentUserId === profile.id && (
                                                <Link
                                                    href={`/yaz?edit_id=${article.id}`}
                                                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold border border-primary/30 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all font-bold"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    Düzenle
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            </ViewTracker>
                        )
                    })
                )}
            </div>
        </div>
    )
}
