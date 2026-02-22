"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { updateArticle } from "@/app/yaz/actions"
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

export function GirdiItem({
    girdi,
    currentUserId,
    index,
    totalCount
}: {
    girdi: Girdi
    currentUserId?: string
    index: number
    totalCount: number
}) {
    const [isEditing, setIsEditing] = useState(false)
    const [content, setContent] = useState(girdi.content)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

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

        // Filter out empty links/videos before sending
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

                    {/* Related Links Edit */}
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

                    {/* Related Videos Edit */}
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

                    {/* Render Links and Videos if exist */}
                    {links.length > 0 && links.some(l => l.url) && (
                        <div className="mt-4 p-3 bg-secondary/20 rounded-lg border border-border/40">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-2">İlgili Bağlantılar</label>
                            <div className="flex flex-wrap gap-2">
                                {links.filter(l => l.url).map((l, i) => (
                                    <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline bg-background/50 px-2 py-1 rounded border border-border/40">
                                        {l.title || "Bağlantı"}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border/10">
                <div className="flex items-center gap-2">
                    <Link href={`/profile/${authorUsername}`} className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-border">
                        {initialLetter}
                    </Link>
                    <Link href={`/profile/${authorUsername}`} className="text-xs font-bold text-primary hover:underline">{authorName}</Link>
                    <span className="text-muted-foreground/30 text-xs">•</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-tighter font-semibold">{formattedDate}</span>

                    {isOwner && !isEditing && (
                        <>
                            <span className="text-muted-foreground/30 text-xs">•</span>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <Pencil className="h-2.5 w-2.5" /> Düzenle
                            </button>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <Link href={`/article/${girdi.id}`} className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors">#{(totalCount - index).toString().padStart(2, '0')}</Link>
                </div>
            </div>
        </article>
    )
}
