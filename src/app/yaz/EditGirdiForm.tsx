"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { updateArticle } from "./actions"
import { PlusCircle, Trash2 } from "lucide-react"

interface RelatedLink { title: string; url: string }
interface EditArticle {
    id: string
    title: string
    content: string
    topic: { id: string; title: string }
    related_links?: RelatedLink[]
    related_videos?: RelatedLink[]
}

export function EditGirdiForm({ article }: { article: EditArticle }) {
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const parseLinks = (val: any): RelatedLink[] => {
        if (!val) return [{ title: "", url: "" }]
        const arr = typeof val === 'string' ? JSON.parse(val) : val
        return arr.length > 0 ? arr : [{ title: "", url: "" }]
    }

    const [relatedLinks, setRelatedLinks] = useState<RelatedLink[]>(parseLinks(article.related_links))
    const [relatedVideos, setRelatedVideos] = useState<RelatedLink[]>(parseLinks(article.related_videos))

    function addLink() { setRelatedLinks(prev => [...prev, { title: "", url: "" }]) }
    function removeLink(i: number) { setRelatedLinks(prev => prev.filter((_, idx) => idx !== i)) }
    function updateLink(i: number, field: keyof RelatedLink, value: string) {
        setRelatedLinks(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l))
    }

    function addVideo() { setRelatedVideos(prev => [...prev, { title: "", url: "" }]) }
    function removeVideo(i: number) { setRelatedVideos(prev => prev.filter((_, idx) => idx !== i)) }
    function updateVideo(i: number, field: keyof RelatedLink, value: string) {
        setRelatedVideos(prev => prev.map((v, idx) => idx === i ? { ...v, [field]: value } : v))
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const validLinks = relatedLinks.filter(l => l.url.trim())
        const validVideos = relatedVideos.filter(v => v.url.trim())
        formData.set('related_links', JSON.stringify(validLinks))
        formData.set('related_videos', JSON.stringify(validVideos))
        setError(null)
        startTransition(async () => {
            const result = await updateArticle(null, formData)
            if (result?.error) setError(result.error)
            else window.location.href = `/article/${article.id}`
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-7">
            {error && (
                <div className="p-4 rounded-md bg-destructive/15 text-destructive font-medium border border-destructive/30">
                    {error}
                </div>
            )}

            <input type="hidden" name="id" value={article.id} />

            {/* Konu bilgisi */}
            <div className="p-3 rounded-lg border border-border/40 bg-secondary/20 flex items-center gap-3">
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Konu:</span>
                <span className="text-sm font-semibold">{article.topic?.title}</span>
            </div>

            {/* Başlık */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-muted-foreground mb-1.5">
                    Girdi Başlığı *
                </label>
                <input
                    id="title"
                    name="title"
                    defaultValue={article.title}
                    className="w-full flex h-12 rounded-md border border-input bg-background/50 px-4 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Başlık..."
                    required
                />
            </div>

            {/* İçerik */}
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-muted-foreground mb-1.5">
                    Girdi *
                </label>
                <textarea
                    id="content"
                    name="content"
                    defaultValue={article.content}
                    className="w-full flex min-h-[400px] rounded-md border border-input bg-background/50 px-4 py-3 text-base leading-relaxed ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                    placeholder="Düşüncelerini özgürce yaz..."
                    required
                />
            </div>

            {/* Video Linkleri */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-muted-foreground">Video Linkleri</label>
                    <button type="button" onClick={addVideo} className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <PlusCircle className="h-3.5 w-3.5" /> Video Ekle
                    </button>
                </div>
                <div className="space-y-2">
                    {relatedVideos.map((video, i) => (
                        <div key={i} className="flex gap-2 items-center">
                            <input type="text" value={video.title} onChange={e => updateVideo(i, 'title', e.target.value)} placeholder="Video Başlığı" className="flex-1 h-9 rounded-md border border-input bg-background/50 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                            <input type="url" value={video.url} onChange={e => updateVideo(i, 'url', e.target.value)} placeholder="https://youtube.com/..." className="flex-1 h-9 rounded-md border border-input bg-background/50 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                            {relatedVideos.length > 1 && (
                                <button type="button" onClick={() => removeVideo(i)} className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* İlgili Linkler */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-muted-foreground">İlgili Linkler</label>
                    <button type="button" onClick={addLink} className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <PlusCircle className="h-3.5 w-3.5" /> Link Ekle
                    </button>
                </div>
                <div className="space-y-2">
                    {relatedLinks.map((link, i) => (
                        <div key={i} className="flex gap-2 items-center">
                            <input type="text" value={link.title} onChange={e => updateLink(i, 'title', e.target.value)} placeholder="Başlık" className="flex-1 h-9 rounded-md border border-input bg-background/50 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                            <input type="url" value={link.url} onChange={e => updateLink(i, 'url', e.target.value)} placeholder="https://..." className="flex-1 h-9 rounded-md border border-input bg-background/50 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                            {relatedLinks.length > 1 && (
                                <button type="button" onClick={() => removeLink(i)} className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border/40">
                <Button type="submit" disabled={isPending} className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-11 text-base font-semibold">
                    {isPending ? "Kaydediliyor..." : "Kaydet"}
                </Button>
            </div>
        </form>
    )
}
