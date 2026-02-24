"use client"

import { useState } from "react"
import { Share2, BookmarkPlus, Pencil, MessageCircle, Facebook, Send, Copy } from "lucide-react"
import { Accordion } from "./Accordion"
import Link from "next/link"
import { voteArticle } from "@/app/actions/entry-actions"
import { useVideo } from "@/components/VideoProvider"
import { AdSection } from "./AdSection"

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
    views?: number
    upvotes?: number
    downvotes?: number
    related_links?: string | any[]
    related_videos?: string | any[]
}

interface FeedProps {
    article: Article
    relatedArticles: { id: string; title: string }[]
    currentUserId?: string
}

export function Feed({ article, relatedArticles, currentUserId }: FeedProps) {
    const { playVideo } = useVideo()
    const [voteState, setVoteState] = useState<{
        upvotes: number;
        downvotes: number;
        userVote: "up" | "down" | null;
    }>({
        upvotes: article.upvotes || 0,
        downvotes: article.downvotes || 0,
        userVote: null // This should be fetched from user's past votes if available
    })
    const [showShare, setShowShare] = useState(false)
    const [isVoting, setIsVoting] = useState(false)

    const formattedDate = new Date(article.created_at).toLocaleDateString("tr-TR", {
        month: "long",
        year: "numeric"
    })

    const initialLetter = article.author?.full_name
        ? article.author.full_name.charAt(0).toUpperCase()
        : article.author?.username?.charAt(0).toUpperCase() || 'A'

    const displayName = article.author?.full_name || article.author?.username || 'Bilinmeyen Yazar'
    const isOwner = currentUserId === article.author?.id

    const handleVote = async (type: 'up' | 'down') => {
        if (!currentUserId) {
            alert("Oy vermek için giriş yapmalısınız.")
            return
        }
        setIsVoting(true)
        const res = await voteArticle(article.id, type)
        if (res.error) alert(res.error)
        setIsVoting(false)
    }

    const shareLink = typeof window !== 'undefined' ? window.location.href : ""

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink)
        alert("Link kopyalandı!")
        setShowShare(false)
    }

    const initialLinks = typeof article.related_links === 'string' ? JSON.parse(article.related_links || '[]') : (article.related_links || [])
    const initialVideos = typeof article.related_videos === 'string' ? JSON.parse(article.related_videos || '[]') : (article.related_videos || [])

    return (
        <div className="w-full pb-20">
            {/* Üst Reklam Alanı Placeholder */}
            <AdSection position="top" className="mb-8" />

            <article className="space-y-6">
                {/* Başlık */}
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                    {article.title}
                </h1>

                {/* Etiketler (Tags) */}
                <div className="flex flex-wrap gap-2">
                    <Link href={`/konu/${article.topic?.slug}`} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors">
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
                    <p className="whitespace-pre-wrap">{article.content}</p>
                </div>

                {/* Linkler ve Videolar */}
                <div className="space-y-4 pt-2">
                    {initialLinks.length > 0 && initialLinks.some((l: any) => l.url) && (
                        <div className="p-4 bg-secondary/20 rounded-xl border border-border/40">
                            <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-3">İlgili Bağlantılar</label>
                            <div className="flex flex-wrap gap-2">
                                {initialLinks.filter((l: any) => l.url).map((l: any, i: number) => (
                                    <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline bg-background/50 px-3 py-1.5 rounded-md border border-border/40 flex items-center gap-2" title={l.title || l.url}>
                                        <span className="truncate max-w-[250px]">{l.title || "Bağlantı"}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {initialVideos.length > 0 && initialVideos.some((v: any) => v.url) && (
                        <div className="p-4 bg-secondary/20 rounded-xl border border-border/40">
                            <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-3">Videolar</label>
                            <div className="flex flex-col gap-3">
                                {initialVideos.filter((v: any) => v.url).map((v: any, i: number) => (
                                    <button type="button" key={`video-${i}`} onClick={() => playVideo(v.url, v.title)} className="text-base font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2.5 group w-fit text-left" title={v.title || v.url}>
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5"><path d="M8 5v14l11-7z" /></svg>
                                        </div>
                                        <span className="underline-offset-4 group-hover:underline line-clamp-2 leading-tight">{v.title || "Video Bağlantısı"}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
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
                    <div className="flex items-center gap-6 text-xs font-medium text-muted-foreground w-full sm:w-auto">
                        <button
                            onClick={() => handleVote('up')}
                            disabled={isVoting}
                            className="flex items-center gap-2 hover:text-primary transition-colors group"
                        >
                            <span className="text-xl group-hover:scale-125 transition-transform grayscale group-hover:grayscale-0">👏</span>
                            <span className="font-bold tabular-nums">{article.upvotes || 0}</span>
                        </button>
                        <button
                            onClick={() => handleVote('down')}
                            disabled={isVoting}
                            className="flex items-center gap-2 hover:text-destructive transition-colors group"
                        >
                            <span className="text-xl group-hover:scale-125 transition-transform grayscale group-hover:grayscale-0">👎</span>
                            <span className="font-bold tabular-nums">{article.downvotes || 0}</span>
                        </button>
                        <div className="flex items-center gap-1.5 ml-2 border-l border-border/50 pl-4 text-muted-foreground/80 hover:text-muted-foreground transition-colors">
                            <span className="text-lg">👁️</span>
                            <span className="font-bold tabular-nums">{article.views || 0}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                        <span className="text-[11px] text-muted-foreground/70 hidden sm:block">
                            Yayınlandı: {formattedDate}
                        </span>
                        <div className="flex items-center gap-3">
                            {/* Share Button */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowShare(!showShare)}
                                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold border border-border/50 rounded-lg bg-secondary/30 hover:bg-secondary hover:text-primary transition-all"
                                >
                                    <Share2 className="h-4 w-4" />
                                    Paylaş
                                </button>

                                {showShare && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowShare(false)} />
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
                                                <button onClick={copyToClipboard} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary text-xs font-medium transition-colors border-t border-border/40 mt-1">
                                                    <Copy className="h-4 w-4 text-muted-foreground" /> Linki Kopyala
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Edit Button for owner */}
                            {isOwner && (
                                <Link
                                    href={`/yaz?edit_id=${article.id}`}
                                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold border border-primary/30 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Düzenle
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </article>

            {/* Alt Reklam Alanı Placeholder */}
            <AdSection position="bottom" className="mt-12 mb-8" />
        </div>
    )
}
