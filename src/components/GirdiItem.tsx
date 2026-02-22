"use client"

import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import { useState, useTransition } from "react"
import Link from "next/link"
import { updateArticle } from "@/app/yaz/actions"
import { useVideo } from "@/components/VideoProvider"
import { Button } from "./ui/button"
import { PlusCircle, Pencil, X, Check, Trash2 } from "lucide-react"

interface RelatedLink { title: string; url: string }

interface Girdi {
    id: string
    content: string
    created_at: string
    related_links?: string | RelatedLink[]
    related_videos?: string | RelatedLink[]
    author: { username: string; full_name: string | null } | { username: string; full_name: string | null }[] | null
}

import { Share2, Copy, MessageCircle, Facebook, Send } from "lucide-react"
import { voteArticle } from "@/app/actions/entry-actions"

export function GirdiItem({
    girdi,
    currentUserId,
    index,
    totalCount
}: {
    girdi: any // Girdi interface update below
    currentUserId?: string
    index: number
    totalCount: number
}) {
    const { playVideo } = useVideo() // Added this line
    const [isEditing, setIsEditing] = useState(false)
    const [content, setContent] = useState(girdi.content)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const [showShare, setShowShare] = useState(false)
    const [isVoting, setIsVoting] = useState(false)

    // Parse initial links/videos
    const initialLinks = typeof girdi.related_links === 'string' ? JSON.parse(girdi.related_links || '[]') : (girdi.related_links || [])
    const initialVideos = typeof girdi.related_videos === 'string' ? JSON.parse(girdi.related_videos || '[]') : (girdi.related_videos || [])

    const [links, setLinks] = useState<RelatedLink[]>(initialLinks)
    const [videos, setVideos] = useState<RelatedLink[]>(initialVideos)

    const author = Array.isArray(girdi.author) ? girdi.author[0] : girdi.author
    const authorName = author?.full_name || author?.username || "Anonim"
    const authorUsername = author?.username
    const isOwner = currentUserId === (author as any)?.id || currentUserId === (girdi as any).author_id

    const initialLetter = authorName.charAt(0).toUpperCase()
    const formattedDate = new Date(girdi.created_at).toLocaleDateString("tr-TR", {
        day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
    })

    // Action handlers for dynamic fields
    const addLink = () => setLinks([...links, { title: "", url: "" }])
    const removeLink = (i: number) => setLinks(links.filter((_, idx) => idx !== i))
    const updateLinkField = (i: number, f: keyof RelatedLink, v: string) => setLinks(links.map((link, idx) => idx === i ? { ...link, [f]: v } : link))

    const addVideo = () => setVideos([...videos, { title: "", url: "" }])
    const removeVideo = (i: number) => setVideos(videos.filter((_, idx) => idx !== i))
    const updateVideoField = (i: number, f: keyof RelatedLink, v: string) => setVideos(videos.map((vid, idx) => idx === i ? { ...vid, [f]: v } : vid))

    async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        const formData = new FormData(e.currentTarget)
        const validLinks = links.filter(l => l.url.trim())
        const validVideos = videos.filter(v => v.url.trim())
        formData.set('related_links', JSON.stringify(validLinks))
        formData.set('related_videos', JSON.stringify(validVideos))

        startTransition(async () => {
            const result = await updateArticle(null, formData)
            if (result.success) {
                setIsEditing(false)
            } else {
                setError(result.error || "Bir hata oluştu")
            }
        })
    }

    const handleVote = async (type: 'up' | 'down') => {
        if (!currentUserId) {
            alert("Oy vermek için giriş yapmalısınız.")
            return
        }
        setIsVoting(true)
        const res = await voteArticle(girdi.id, type)
        if (res.error) alert(res.error)
        setIsVoting(false)
    }

    const shareLink = typeof window !== 'undefined' ? `${window.location.origin}/article/${girdi.id}` : ""

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink)
        alert("Link kopyalandı!")
        setShowShare(false)
    }

    const upvotes = girdi.upvotes || 0
    const downvotes = girdi.downvotes || 0

    return (
        <article className="relative pl-6 sm:pl-10 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary/20 hover:before:bg-primary transition-all">
            {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-4 bg-secondary/5 p-4 rounded-lg border border-border/40">
                    <input type="hidden" name="id" value={girdi.id} />

                    <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">İçerik</label>
                        <textarea
                            name="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full min-h-[150px] p-3 rounded-md border border-input bg-background/50 text-sm focus:ring-2 focus:ring-primary outline-none resize-y"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">İlgili Bağlantılar</label>
                            <button type="button" onClick={addLink} className="text-[10px] text-primary hover:underline flex items-center gap-1">
                                <PlusCircle className="h-3 w-3" /> Ekle
                            </button>
                        </div>
                        {links.map((link, i) => (
                            <div key={i} className="flex gap-2">
                                <input placeholder="Başlık" value={link.title} onChange={e => updateLinkField(i, 'title', e.target.value)} className="flex-1 h-8 text-[11px] bg-background px-2 border border-border rounded" />
                                <input placeholder="URL" value={link.url} onChange={e => updateLinkField(i, 'url', e.target.value)} className="flex-[2] h-8 text-[11px] bg-background px-2 border border-border rounded" />
                                <button type="button" onClick={() => removeLink(i)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="h-4 w-4" /></button>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Video Bağlantıları</label>
                            <button type="button" onClick={addVideo} className="text-[10px] text-primary hover:underline flex items-center gap-1">
                                <PlusCircle className="h-3 w-3" /> Ekle
                            </button>
                        </div>
                        {videos.map((vid, i) => (
                            <div key={i} className="flex gap-2">
                                <input placeholder="Video Başlığı" value={vid.title} onChange={e => updateVideoField(i, 'title', e.target.value)} className="flex-1 h-8 text-[11px] bg-background px-2 border border-border rounded" />
                                <input placeholder="Video URL" value={vid.url} onChange={e => updateVideoField(i, 'url', e.target.value)} className="flex-[2] h-8 text-[11px] bg-background px-2 border border-border rounded" />
                                <button type="button" onClick={() => removeVideo(i)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="h-4 w-4" /></button>
                            </div>
                        ))}
                    </div>

                    {error && <p className="text-xs text-destructive font-bold">{error}</p>}

                    <div className="flex items-center gap-2 pt-2">
                        <Button type="submit" size="sm" disabled={isPending} className="h-8 gap-1.5 ring-offset-background">
                            {isPending ? "..." : <><Check className="h-3.5 w-3.5" /> Değişiklikleri Kaydet</>}
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={() => { setIsEditing(false); setContent(girdi.content); setLinks(initialLinks); setVideos(initialVideos); }} className="h-8 gap-1.5">
                            <X className="h-3.5 w-3.5" /> Vazgeç
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="mb-3">
                    <div className="text-foreground leading-relaxed whitespace-pre-wrap mb-4">
                        {content}
                    </div>

                    {links.length > 0 && links.some(l => l.url) && (
                        <div className="mt-4 p-3 bg-secondary/20 rounded-lg border border-border/40">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-2">İlgili Bağlantılar</label>
                            <div className="flex flex-wrap gap-2">
                                {links.filter(l => l.url).map((l, i) => (
                                    <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline bg-background/50 px-2 py-1 rounded border border-border/40 flex items-center gap-1.5" title={l.title || l.url}>
                                        <span className="truncate max-w-[200px]">{l.title || "Bağlantı"}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {videos.length > 0 && videos.some(v => v.url) && (
                        <div className="mt-4 p-3 bg-secondary/20 rounded-lg border border-border/40">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-2">Videolar</label>
                            <div className="flex flex-col gap-2">
                                {videos.filter(v => v.url).map((v, i) => (
                                    <button type="button" key={`video-${i}`} onClick={() => playVideo(v.url, v.title)} className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2 group w-fit text-left" title={v.title || v.url}>
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 ml-0.5"><path d="M8 5v14l11-7z" /></svg>
                                        </div>
                                        <span className="underline-offset-4 group-hover:underline line-clamp-1">{v.title || "Video Bağlantısı"}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/10">
                <div className="flex items-center gap-4">
                    {/* Voting */}
                    <div className="flex items-center gap-4 bg-secondary/10 px-3 py-1.5 rounded-full border border-border/30">
                        <button
                            onClick={() => handleVote('up')}
                            disabled={isVoting}
                            className="flex items-center gap-1.5 group"
                        >
                            <span className="text-base group-hover:scale-125 transition-transform grayscale group-hover:grayscale-0">👏</span>
                            <span className="text-xs font-bold text-muted-foreground group-hover:text-primary tabular-nums">{upvotes}</span>
                        </button>
                        <div className="w-px h-3 bg-border/40" />
                        <button
                            onClick={() => handleVote('down')}
                            disabled={isVoting}
                            className="flex items-center gap-1.5 group"
                        >
                            <span className="text-base group-hover:scale-125 transition-transform grayscale group-hover:grayscale-0">👎</span>
                            <span className="text-xs font-bold text-muted-foreground group-hover:text-destructive tabular-nums">{downvotes}</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-tight">
                        <span>{formattedDate}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Share Button with Popover */}
                    <div className="relative">
                        <button
                            onClick={() => setShowShare(!showShare)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-secondary/50 hover:bg-secondary text-foreground transition-all border border-border/40"
                        >
                            <Share2 className="h-3.5 w-3.5" /> Paylaş
                        </button>

                        {showShare && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowShare(false)} />
                                <div className="absolute bottom-full right-0 mb-2 w-48 bg-card border border-border/80 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
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

                    {/* Ownership / Edit / Profile */}
                    <div className="flex items-center gap-2 pl-2 border-l border-border/20">
                        {isOwner ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all"
                            >
                                <Pencil className="h-3.5 w-3.5" /> Düzenle
                            </button>
                        ) : (
                            <Link href={`/profile/${authorUsername}`} className="flex items-center gap-2 group">
                                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-border group-hover:border-primary transition-colors">
                                    {initialLetter}
                                </div>
                                <span className="text-xs font-bold text-foreground/70 group-hover:text-primary transition-colors">{authorName}</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </article>
    )
}
