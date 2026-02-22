"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { submitArticle } from "./actions"
import { PlusCircle, Trash2 } from "lucide-react"

interface Topic { id: string; title: string }
interface Category { id: string; title: string }
interface RelatedLink { title: string; url: string }

export function ArticleForm({
    topics,
    categories = [],
    preselectedTopicId,
}: {
    topics: Topic[]
    categories?: Category[]
    preselectedTopicId?: string
}) {
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    // Mode: 'new_topic' = create konu + first girdi, 'add_entry' = add to existing konu
    const mode = preselectedTopicId ? 'add_entry' : 'new_topic'

    const [relatedLinks, setRelatedLinks] = useState<RelatedLink[]>([{ title: "", url: "" }])
    const [relatedVideos, setRelatedVideos] = useState<RelatedLink[]>([{ title: "", url: "" }])

    function addLink() { setRelatedLinks(prev => [...prev, { title: "", url: "" }]) }
    function removeLink(i: number) { setRelatedLinks(prev => prev.filter((_, idx) => idx !== i)) }
    function updateLink(i: number, field: keyof RelatedLink, value: string) {
        setRelatedLinks(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l))
    }

    function addVideo() { setRelatedVideos(prev => [...prev, { title: "", url: "" }]) }
    function removeVideo(i: number) { setRelatedVideos(prev => prev.filter((_, idx) => idx !== i)) }
    function updateVideo(i: number, field: keyof RelatedLink, value: string) {
        setRelatedVideos(prev => prev.map((v, idx) => idx === i ? { ...v, [field]: value } : v))

        if (field === 'url' && value.includes('http')) {
            fetch(`/api/video-info?url=${encodeURIComponent(value)}`)
                .then(res => res.json())
                .then(data => {
                    if (data?.title) {
                        setRelatedVideos(prev => {
                            const next = [...prev]
                            if (!next[i].title) next[i].title = data.title;
                            return next;
                        })
                    }
                })
                .catch(() => { })
        }
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
            const result = await submitArticle(null, formData)
            if (result?.error) setError(result.error)
        })
    }

    const preselectedTopic = topics.find(t => t.id === preselectedTopicId)

    return (
        <form onSubmit={handleSubmit} className="space-y-7">
            {error && (
                <div className="p-4 rounded-md bg-destructive/15 text-destructive font-medium border border-destructive/30">
                    {error}
                </div>
            )}

            {mode === 'new_topic' ? (
                <>
                    {/* Yeni Konu Modu */}
                    <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-4">
                        <p className="text-xs font-bold text-primary uppercase tracking-widest">Yeni Konu Açıyorsun</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="new_topic_title" className="block text-sm font-medium text-muted-foreground mb-1.5">
                                    Konu Başlığı *
                                </label>
                                <input
                                    id="new_topic_title"
                                    name="new_topic_title"
                                    className="w-full flex h-12 rounded-md border border-input bg-background/50 px-4 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Örn: Antigravity teorisi"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="category_id" className="block text-sm font-medium text-muted-foreground mb-1.5">
                                    Kategori
                                </label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    defaultValue=""
                                    className="w-full flex h-12 rounded-md border border-input bg-background/50 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="">Kategori Seçin (İsteğe Bağlı)</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* YENİ: Tür ve Tarihsellik Alanları */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-primary/10 pt-4">
                            <div>
                                <label htmlFor="type" className="block text-xs font-bold text-muted-foreground/60 uppercase mb-1.5">
                                    Tür (Opsiyonel)
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    defaultValue="general"
                                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="general">Genel</option>
                                    <option value="person">Kişi</option>
                                    <option value="work">Eser</option>
                                    <option value="concept">Kavram</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="era" className="block text-xs font-bold text-muted-foreground/60 uppercase mb-1.5">
                                    Tarih / Dönem
                                </label>
                                <input
                                    id="era"
                                    name="era"
                                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Örn: 1957, M.Ö. 400"
                                />
                            </div>

                            <div>
                                <label htmlFor="era_year" className="block text-xs font-bold text-muted-foreground/60 uppercase mb-1.5">
                                    Yıl (Sıralama için)
                                </label>
                                <input
                                    id="era_year"
                                    name="era_year"
                                    type="number"
                                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Örn: 1957, -400"
                                />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                // Mevcut konuya girdi ekleme modu
                <div className="p-3 rounded-lg border border-border/40 bg-secondary/20 flex items-center gap-3">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Konu:</span>
                    <span className="text-sm font-semibold">{preselectedTopic?.title || 'Seçili Konu'}</span>
                    <input type="hidden" name="topic_id" value={preselectedTopicId} />
                </div>
            )}

            {/* Girdi İçeriği */}
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-muted-foreground mb-1.5">
                    Girdi *
                </label>
                <textarea
                    id="content"
                    name="content"
                    className="w-full flex min-h-[400px] rounded-md border border-input bg-background/50 px-4 py-3 text-base leading-relaxed ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                    placeholder="Düşüncelerini özgürce yaz..."
                    required
                />
            </div>

            {/* Video Linkleri */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-muted-foreground">
                        Video Linkleri
                        <span className="text-xs font-normal ml-2">(İsteğe bağlı — otomatik videolar sayfasına eklenir)</span>
                    </label>
                    <button type="button" onClick={addVideo} className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <PlusCircle className="h-3.5 w-3.5" /> Video Ekle
                    </button>
                </div>
                <div className="space-y-2">
                    {relatedVideos.map((video, i) => (
                        <div key={i} className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={video.title}
                                onChange={e => updateVideo(i, 'title', e.target.value)}
                                placeholder="Video Başlığı (örn: Fragman)"
                                className="flex-1 h-9 rounded-md border border-input bg-background/50 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <input
                                type="url"
                                value={video.url}
                                onChange={e => updateVideo(i, 'url', e.target.value)}
                                placeholder="https://youtube.com/..."
                                className="flex-1 h-9 rounded-md border border-input bg-background/50 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
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
                                placeholder="Başlık"
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
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-11 text-base font-semibold"
                >
                    {isPending ? "Yayınlanıyor..." : mode === 'new_topic' ? "Konuyu Aç & Girdiyi Yayınla" : "Girdiyi Yayınla"}
                </Button>
            </div>
        </form>
    )
}
