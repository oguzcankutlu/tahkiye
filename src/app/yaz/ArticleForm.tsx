"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { submitArticle } from "./actions"
import { PlusCircle, Trash2 } from "lucide-react"

interface Topic { id: string; title: string }
interface Video { id: string; title: string }

interface RelatedLink { title: string; url: string }

export function ArticleForm({
    topics,
    videos = [],
    preselectedTopicId,
}: {
    topics: Topic[]
    videos?: Video[]
    preselectedTopicId?: string
}) {
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    // Related links state
    const [relatedLinks, setRelatedLinks] = useState<RelatedLink[]>([{ title: "", url: "" }])
    // Selected related videos
    const [selectedVideos, setSelectedVideos] = useState<string[]>([])

    function addLink() { setRelatedLinks(prev => [...prev, { title: "", url: "" }]) }
    function removeLink(i: number) { setRelatedLinks(prev => prev.filter((_, idx) => idx !== i)) }
    function updateLink(i: number, field: keyof RelatedLink, value: string) {
        setRelatedLinks(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l))
    }

    function toggleVideo(id: string) {
        setSelectedVideos(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id])
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        // Add related links and videos as JSON
        const validLinks = relatedLinks.filter(l => l.url.trim())
        formData.set('related_links', JSON.stringify(validLinks))
        formData.set('related_videos', JSON.stringify(selectedVideos))
        setError(null)
        startTransition(async () => {
            const result = await submitArticle(null, formData)
            if (result?.error) setError(result.error)
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="p-4 rounded-md bg-destructive/15 text-destructive font-medium border border-destructive/30">
                    {error}
                </div>
            )}

            {/* Başlık */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-muted-foreground mb-1.5">
                    Girdi Başlığı *
                </label>
                <input
                    id="title"
                    name="title"
                    className="w-full flex h-12 rounded-md border border-input bg-background/50 px-4 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="İlgi çekici bir başlık girin..."
                    required
                />
            </div>

            {/* Kategori Seçimi */}
            <div>
                <label htmlFor="topic_id" className="block text-sm font-medium text-muted-foreground mb-1.5">
                    Kategori *
                </label>
                <select
                    id="topic_id"
                    name="topic_id"
                    defaultValue={preselectedTopicId || ""}
                    className="w-full flex h-11 rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                >
                    <option value="" disabled>Kategori Seçiniz</option>
                    {topics.map(t => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                </select>
            </div>

            {/* İçerik */}
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-muted-foreground mb-1.5">
                    Girdi Metni *
                </label>
                <textarea
                    id="content"
                    name="content"
                    className="w-full flex min-h-[400px] rounded-md border border-input bg-background/50 px-4 py-3 text-base leading-relaxed ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                    placeholder="Düşüncelerinizi özgürce yazın..."
                    required
                />
            </div>

            {/* İlgili Videolar */}
            {videos.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                        İlgili Videolar
                        <span className="text-xs font-normal ml-2">(İsteğe bağlı)</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-input rounded-md p-2 bg-background/30">
                        {videos.map(v => (
                            <label key={v.id} className="flex items-center gap-2.5 p-2 rounded-md hover:bg-secondary/50 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    checked={selectedVideos.includes(v.id)}
                                    onChange={() => toggleVideo(v.id)}
                                    className="rounded border-input accent-primary"
                                />
                                <span className="text-sm truncate">{v.title}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* İlgili Linkler */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-muted-foreground">
                        İlgili Linkler
                        <span className="text-xs font-normal ml-2">(İsteğe bağlı)</span>
                    </label>
                    <button type="button" onClick={addLink} className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <PlusCircle className="h-3.5 w-3.5" /> Link Ekle
                    </button>
                </div>
                <div className="space-y-2">
                    {relatedLinks.map((link, i) => (
                        <div key={i} className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={link.title}
                                onChange={e => updateLink(i, 'title', e.target.value)}
                                placeholder="Link başlığı"
                                className="flex-1 h-9 rounded-md border border-input bg-background/50 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <input
                                type="url"
                                value={link.url}
                                onChange={e => updateLink(i, 'url', e.target.value)}
                                placeholder="https://..."
                                className="flex-1 h-9 rounded-md border border-input bg-background/50 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
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
                <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-2 h-11 text-base font-semibold"
                >
                    {isPending ? "Yayınlanıyor..." : "Girdiyi Yayınla"}
                </Button>
            </div>
        </form>
    )
}
