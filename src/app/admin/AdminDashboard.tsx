"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, FileText, Video, Tag, PlusCircle, Trash2, LogOut } from "lucide-react"
import { createTopic, deleteTopic, createVideo, deleteVideo, deleteArticle, deleteProfile, createAd, deleteAd, toggleAd } from "./actions"

type Tab = 'users' | 'topics' | 'videos' | 'articles' | 'ads'

interface Topic { id: string; title: string; slug: string; description?: string | null; created_at: string }
interface Video { id: string; title: string; video_url: string; duration?: string | null; created_at: string }
interface Article { id: string; title: string; created_at: string; author_id: string; topic_id: string }
interface Profile { id: string; username: string; full_name: string | null; avatar_url: string | null; created_at: string }
interface Ad { id: string; title: string; image_url?: string | null; link_url?: string | null; position: string; is_active: boolean; created_at: string }

interface Props {
    topics: Topic[]
    videos: Video[]
    articles: Article[]
    profiles: Profile[]
    ads: Ad[]
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" })
}

export default function AdminDashboardClient({ topics, videos, articles, profiles, ads }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('users')

    const [topicError, setTopicError] = useState<string | null>(null)
    const [topicSuccess, setTopicSuccess] = useState(false)
    const [isTopicPending, startTopicTransition] = useTransition()

    const [videoError, setVideoError] = useState<string | null>(null)
    const [videoSuccess, setVideoSuccess] = useState(false)
    const [isVideoPending, startVideoTransition] = useTransition()

    const [isPending, startTransition] = useTransition()

    function handleTopicSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        setTopicError(null); setTopicSuccess(false)
        startTopicTransition(async () => {
            const result = await createTopic(formData)
            if (result?.error) setTopicError(result.error)
            else { setTopicSuccess(true); (e.target as HTMLFormElement).reset() }
        })
    }

    function handleVideoSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        setVideoError(null); setVideoSuccess(false)
        startVideoTransition(async () => {
            const result = await createVideo(formData)
            if (result?.error) setVideoError(result.error)
            else { setVideoSuccess(true); (e.target as HTMLFormElement).reset() }
        })
    }

    function handleDelete(action: (fd: FormData) => Promise<any>, id: string, confirmMsg: string) {
        if (!confirm(confirmMsg)) return
        const fd = new FormData(); fd.set('id', id)
        startTransition(() => action(fd))
    }

    const [adError, setAdError] = useState<string | null>(null)
    const [adSuccess, setAdSuccess] = useState(false)
    const [isAdPending, startAdTransition] = useTransition()

    function handleAdSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        setAdError(null); setAdSuccess(false)
        startAdTransition(async () => {
            const result = await createAd(formData)
            if (result?.error) setAdError(result.error)
            else { setAdSuccess(true); (e.target as HTMLFormElement).reset() }
        })
    }

    function handleToggleAd(id: string, is_active: boolean) {
        const fd = new FormData(); fd.set('id', id); fd.set('is_active', String(is_active))
        startTransition(async () => { await toggleAd(fd) })
    }

    const tabs: { key: Tab; label: string; icon: React.ReactNode; count: number }[] = [
        { key: 'users', label: 'Üyeler', icon: <Users className="h-4 w-4" />, count: profiles.length },
        { key: 'topics', label: 'Konular', icon: <Tag className="h-4 w-4" />, count: topics.length },
        { key: 'videos', label: 'Videolar', icon: <Video className="h-4 w-4" />, count: videos.length },
        { key: 'articles', label: 'Makaleler', icon: <FileText className="h-4 w-4" />, count: articles.length },
        { key: 'ads', label: 'Reklamlar', icon: <span className="text-sm">📢</span>, count: ads.length },
    ]

    return (
        <div className="flex min-h-[calc(100vh-64px)] w-full bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-56 border-r border-border/40 bg-secondary/10 flex flex-col shrink-0">
                <div className="h-14 flex items-center px-5 border-b border-border/40">
                    <span className="font-bold text-base tracking-tight">tahkiye <span className="text-primary text-xs font-normal">Yönetici</span></span>
                </div>
                <nav className="flex-1 p-3 flex flex-col gap-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center justify-between gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.key ? 'bg-primary/15 text-primary' : 'hover:bg-secondary/60 text-muted-foreground'}`}
                        >
                            <span className="flex items-center gap-2">{tab.icon}{tab.label}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>{tab.count}</span>
                        </button>
                    ))}
                </nav>
                <div className="p-3 border-t border-border/40 space-y-1">
                    <a href="/yaz" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary/60 text-muted-foreground transition-colors">
                        <PlusCircle className="h-4 w-4 text-primary" /> Yeni Makale
                    </a>
                    <form action="/api/auth/signout">
                        <button type="button" onClick={async () => { const { logout } = await import('../auth/actions/auth-actions'); await logout() }} className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 w-full transition-colors">
                            <LogOut className="h-4 w-4" /> Çıkış Yap
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 p-6 overflow-y-auto">

                {/* === ÜYELER === */}
                {activeTab === 'users' && (
                    <div className="space-y-6 max-w-5xl">
                        <h1 className="text-xl font-bold border-b border-border/40 pb-3">Üye Yönetimi <span className="text-sm font-normal text-muted-foreground">({profiles.length} üye)</span></h1>
                        <div className="border border-border/40 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="text-xs text-muted-foreground bg-secondary/30 border-b border-border/40 uppercase">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Kullanıcı Adı</th>
                                        <th className="px-4 py-3 text-left">Görünen Ad</th>
                                        <th className="px-4 py-3 text-left">Kayıt Tarihi</th>
                                        <th className="px-4 py-3 text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {profiles.map(p => (
                                        <tr key={p.id} className="border-b border-border/20 last:border-0 hover:bg-secondary/10">
                                            <td className="px-4 py-3 font-medium">@{p.username}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{p.full_name || '—'}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{formatDate(p.created_at)}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => handleDelete(deleteProfile, p.id, `"${p.username}" profilini silmek istediğine emin misin?`)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors" title="Sil">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {profiles.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Henüz üye yok.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* === KONULAR === */}
                {activeTab === 'topics' && (
                    <div className="space-y-6 max-w-4xl">
                        <h1 className="text-xl font-bold border-b border-border/40 pb-3">Konu Yönetimi</h1>

                        {/* Yeni Konu Ekle */}
                        <div className="p-5 border border-border/40 rounded-xl bg-card">
                            <h2 className="text-base font-bold flex items-center gap-2 mb-4"><PlusCircle className="h-4 w-4 text-primary" />Yeni Konu Ekle</h2>
                            <form onSubmit={handleTopicSubmit} className="space-y-3">
                                {topicError && <p className="text-sm text-destructive">{topicError}</p>}
                                {topicSuccess && <p className="text-sm text-green-500">Konu eklendi! Sayfayı yenile.</p>}
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="text-xs text-muted-foreground mb-1 block">Başlık</label><Input name="title" required placeholder="Psikoloji" className="bg-background" /></div>
                                    <div><label className="text-xs text-muted-foreground mb-1 block">Slug (URL)</label><Input name="slug" required placeholder="psikoloji" className="bg-background" /></div>
                                </div>
                                <div><label className="text-xs text-muted-foreground mb-1 block">Açıklama (opsiyonel)</label><Input name="description" placeholder="Bu konunun kısa açıklaması..." className="bg-background" /></div>
                                <div className="flex justify-end"><Button type="submit" disabled={isTopicPending} size="sm">{isTopicPending ? "Ekleniyor..." : "Konuyu Ekle"}</Button></div>
                            </form>
                        </div>

                        {/* Mevcut Konular */}
                        <div className="border border-border/40 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="text-xs text-muted-foreground bg-secondary/30 border-b border-border/40 uppercase">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Başlık</th>
                                        <th className="px-4 py-3 text-left">Slug</th>
                                        <th className="px-4 py-3 text-left">Tarih</th>
                                        <th className="px-4 py-3 text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topics.map(t => (
                                        <tr key={t.id} className="border-b border-border/20 last:border-0 hover:bg-secondary/10">
                                            <td className="px-4 py-3 font-medium">{t.title}</td>
                                            <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{t.slug}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{formatDate(t.created_at)}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => handleDelete(deleteTopic, t.id, `"${t.title}" konusunu silmek istediğine emin misin? İçindeki makaleler de etkilenebilir!`)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {topics.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Henüz konu yok.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* === VİDEOLAR === */}
                {activeTab === 'videos' && (
                    <div className="space-y-6 max-w-4xl">
                        <h1 className="text-xl font-bold border-b border-border/40 pb-3">Video Yönetimi</h1>

                        <div className="p-5 border border-border/40 rounded-xl bg-card">
                            <h2 className="text-base font-bold flex items-center gap-2 mb-4"><PlusCircle className="h-4 w-4 text-primary" />Yeni Video Ekle</h2>
                            <form onSubmit={handleVideoSubmit} className="space-y-3">
                                {videoError && <p className="text-sm text-destructive">{videoError}</p>}
                                {videoSuccess && <p className="text-sm text-green-500">Video eklendi! Sayfayı yenile.</p>}
                                <div><label className="text-xs text-muted-foreground mb-1 block">Video Başlığı</label><Input name="title" required placeholder="YouTube başlığı..." className="bg-background" /></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Konu</label>
                                        <select name="topic_id" required defaultValue="" className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                                            <option value="" disabled>Konu seçin...</option>
                                            {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                                        </select>
                                    </div>
                                    <div><label className="text-xs text-muted-foreground mb-1 block">Süre (ör: 14:20)</label><Input name="duration" placeholder="14:20" className="bg-background" /></div>
                                </div>
                                <div><label className="text-xs text-muted-foreground mb-1 block">YouTube URL</label><Input name="video_url" required placeholder="https://youtube.com/watch?v=..." className="bg-background" /></div>
                                <div className="flex justify-end"><Button type="submit" disabled={isVideoPending} size="sm">{isVideoPending ? "Ekleniyor..." : "Videoyu Ekle"}</Button></div>
                            </form>
                        </div>

                        <div className="border border-border/40 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="text-xs text-muted-foreground bg-secondary/30 border-b border-border/40 uppercase">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Başlık</th>
                                        <th className="px-4 py-3 text-left">Süre</th>
                                        <th className="px-4 py-3 text-left">Tarih</th>
                                        <th className="px-4 py-3 text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {videos.map(v => (
                                        <tr key={v.id} className="border-b border-border/20 last:border-0 hover:bg-secondary/10">
                                            <td className="px-4 py-3 font-medium max-w-xs truncate">{v.title}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{v.duration || '—'}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{formatDate(v.created_at)}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => handleDelete(deleteVideo, v.id, `"${v.title}" videosunu silmek istediğine emin misin?`)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {videos.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Henüz video yok.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* === MAKALELEr === */}
                {activeTab === 'articles' && (
                    <div className="space-y-6 max-w-5xl">
                        <h1 className="text-xl font-bold border-b border-border/40 pb-3">Makale Yönetimi <span className="text-sm font-normal text-muted-foreground">({articles.length} makale)</span></h1>
                        <div className="border border-border/40 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="text-xs text-muted-foreground bg-secondary/30 border-b border-border/40 uppercase">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Başlık</th>
                                        <th className="px-4 py-3 text-left">Tarih</th>
                                        <th className="px-4 py-3 text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {articles.map(a => (
                                        <tr key={a.id} className="border-b border-border/20 last:border-0 hover:bg-secondary/10">
                                            <td className="px-4 py-3 font-medium max-w-sm truncate">
                                                <a href={`/article/${a.id}`} target="_blank" className="hover:text-primary transition-colors">{a.title}</a>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{formatDate(a.created_at)}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => handleDelete(deleteArticle, a.id, `"${a.title}" makalesini silmek istediğine emin misin?`)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {articles.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">Henüz makale yok.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* === REKLAMLAR === */}
                {activeTab === 'ads' && (
                    <div className="space-y-6 max-w-4xl">
                        <h1 className="text-xl font-bold border-b border-border/40 pb-3">Reklam Yönetimi</h1>

                        <div className="p-5 border border-border/40 rounded-xl bg-card">
                            <h2 className="text-base font-bold flex items-center gap-2 mb-4"><PlusCircle className="h-4 w-4 text-primary" />Yeni Reklam Ekle</h2>
                            <form onSubmit={handleAdSubmit} className="space-y-3">
                                {adError && <p className="text-sm text-destructive">{adError}</p>}
                                {adSuccess && <p className="text-sm text-green-500">Reklam eklendi! Sayfayı yenile.</p>}
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="text-xs text-muted-foreground mb-1 block">Başlık *</label><Input name="title" required placeholder="Yaz Kampanyası" className="bg-background" /></div>
                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Konum</label>
                                        <select name="position" defaultValue="sidebar" className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                                            <option value="sidebar">Kenar Çubuğu</option>
                                            <option value="header">Üst Banner</option>
                                            <option value="footer">Alt Banner</option>
                                            <option value="content">İçerik Arası</option>
                                        </select>
                                    </div>
                                </div>
                                <div><label className="text-xs text-muted-foreground mb-1 block">Görsel URL</label><Input name="image_url" placeholder="https://..." className="bg-background" /></div>
                                <div><label className="text-xs text-muted-foreground mb-1 block">Bağlantı URL</label><Input name="link_url" placeholder="https://reklam-linki.com" className="bg-background" /></div>
                                <div className="flex justify-end"><Button type="submit" disabled={isAdPending} size="sm">{isAdPending ? "Ekleniyor..." : "Reklamı Ekle"}</Button></div>
                            </form>
                        </div>

                        <div className="border border-border/40 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="text-xs text-muted-foreground bg-secondary/30 border-b border-border/40 uppercase">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Başlık</th>
                                        <th className="px-4 py-3 text-left">Konum</th>
                                        <th className="px-4 py-3 text-left">Durum</th>
                                        <th className="px-4 py-3 text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ads.map(ad => (
                                        <tr key={ad.id} className="border-b border-border/20 last:border-0 hover:bg-secondary/10">
                                            <td className="px-4 py-3 font-medium max-w-xs truncate">{ad.title}</td>
                                            <td className="px-4 py-3 text-muted-foreground capitalize">{ad.position}</td>
                                            <td className="px-4 py-3">
                                                <button onClick={() => handleToggleAd(ad.id, ad.is_active)} className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ad.is_active ? 'bg-green-500/15 text-green-600' : 'bg-secondary text-muted-foreground'}`}>
                                                    {ad.is_active ? 'Aktif' : 'Pasif'}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => handleDelete(deleteAd, ad.id, `"${ad.title}" reklamını silmek istediğine emin misin?`)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {ads.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Henüz reklam yok.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </main>
        </div>
    )
}
