"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, FileText, Video, Tag, PlusCircle, Trash2, LogOut, LayoutGrid } from "lucide-react"
import {
    createTopic, deleteTopic,
    createCategory, deleteCategory,
    createVideo, deleteVideo,
    deleteArticle, deleteProfile,
    createAd, deleteAd, toggleAd
} from "./actions"

type Tab = 'users' | 'categories' | 'topics' | 'videos' | 'articles' | 'ads'

interface Category { id: string; title: string; slug: string; created_at: string }
interface Topic { id: string; title: string; slug: string; category_id?: string | null; created_at: string }
interface Video { id: string; title: string; video_url: string; duration?: string | null; created_at: string }
interface Article { id: string; title: string; created_at: string; author_id: string; topic_id: string }
interface Profile { id: string; username: string; full_name: string | null; avatar_url: string | null; created_at: string }
interface Ad { id: string; title: string; image_url?: string | null; link_url?: string | null; position: string; is_active: boolean; created_at: string }

interface Props {
    categories: Category[]
    topics: Topic[]
    videos: Video[]
    articles: Article[]
    profiles: Profile[]
    ads: Ad[]
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" })
}

export default function AdminDashboardClient({ categories, topics, videos, articles, profiles, ads }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('users')

    const [catError, setCatError] = useState<string | null>(null)
    const [catSuccess, setCatSuccess] = useState(false)
    const [isCatPending, startCatTransition] = useTransition()

    const [topicError, setTopicError] = useState<string | null>(null)
    const [topicSuccess, setTopicSuccess] = useState(false)
    const [isTopicPending, startTopicTransition] = useTransition()

    const [videoError, setVideoError] = useState<string | null>(null)
    const [videoSuccess, setVideoSuccess] = useState(false)
    const [isVideoPending, startVideoTransition] = useTransition()

    const [isPending, startTransition] = useTransition()

    function handleCategorySubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        setCatError(null); setCatSuccess(false)
        startCatTransition(async () => {
            const result = await createCategory(formData)
            if (result?.error) setCatError(result.error)
            else { setCatSuccess(true); (e.target as HTMLFormElement).reset() }
        })
    }

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
        { key: 'categories', label: 'Kategoriler', icon: <LayoutGrid className="h-4 w-4" />, count: categories.length },
        { key: 'topics', label: 'Konular', icon: <Tag className="h-4 w-4" />, count: topics.length },
        { key: 'videos', label: 'Videolar', icon: <Video className="h-4 w-4" />, count: videos.length },
        { key: 'articles', label: 'Girdiler', icon: <FileText className="h-4 w-4" />, count: articles.length },
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
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary/60 text-muted-foreground mb-4 border-b border-border/10 pb-4"
                    >
                        <LogOut className="h-4 w-4 rotate-180" /> Siteye Dön
                    </Link>
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
            </aside>

            {/* Main */}
            <main className="flex-1 p-6 overflow-y-auto">

                <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-xs text-muted-foreground italic">
                        <span className="font-bold text-primary">Not:</span> Yaptığınız değişiklikler (Kategori, Reklam vb.) anlık olarak sisteme kaydedilir. Eğer sitede hemen göremiyorsanız lütfen 30 saniye sonra sayfayı yenileyiniz.
                    </p>
                </div>

                {/* === ÜYELER === */}
                {activeTab === 'users' && (
                    <div className="space-y-6 max-w-5xl">
                        <h1 className="text-xl font-bold border-b border-border/40 pb-3">Üye Yönetimi ({profiles.length})</h1>
                        <div className="border border-border/40 rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground bg-secondary/30 border-b border-border/40 uppercase">
                                    <tr>
                                        <th className="px-4 py-3">Üye</th>
                                        <th className="px-4 py-3">Tarih</th>
                                        <th className="px-4 py-3 text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {profiles.map(p => (
                                        <tr key={p.id} className="border-b border-border/20 last:border-0 hover:bg-secondary/10">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-foreground">@{p.username}</div>
                                                <div className="text-xs text-muted-foreground">{p.full_name}</div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{formatDate(p.created_at)}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => handleDelete(deleteProfile, p.id, `Profil silinsin mi? @${p.username}`)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* === KATEGORİLER === */}
                {activeTab === 'categories' && (
                    <div className="space-y-6 max-w-4xl">
                        <h1 className="text-xl font-bold border-b border-border/40 pb-3">Kategori Yönetimi</h1>
                        <div className="p-5 border border-border/40 rounded-xl bg-card">
                            <h2 className="text-base font-bold flex items-center gap-2 mb-4"><PlusCircle className="h-4 w-4 text-primary" />Yeni Kategori</h2>
                            <form onSubmit={handleCategorySubmit} className="space-y-3">
                                {catError && <p className="text-sm text-destructive">{catError}</p>}
                                {catSuccess && <p className="text-sm text-green-500">Kategori eklendi.</p>}
                                <div className="grid grid-cols-2 gap-3">
                                    <Input name="title" required placeholder="Başlık (örn: Bilim)" />
                                    <Input name="slug" required placeholder="Slug (örn: bilim)" />
                                </div>
                                <div className="flex justify-end"><Button type="submit" disabled={isCatPending}>{isCatPending ? "Ekleniyor..." : "Ekle"}</Button></div>
                            </form>
                        </div>

                        <div className="border border-border/40 rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-secondary/30 border-b border-border/40 uppercase text-xs text-muted-foreground">
                                    <tr><th className="px-4 py-3">Kategori</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3 text-right">İşlem</th></tr>
                                </thead>
                                <tbody>
                                    {categories.map(c => (
                                        <tr key={c.id} className="border-b border-border/20 last:border-0 hover:bg-secondary/10">
                                            <td className="px-4 py-3 font-medium">{c.title}</td>
                                            <td className="px-4 py-3 text-muted-foreground text-xs">{c.slug}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => handleDelete(deleteCategory, c.id, `Kategori silinsin mi? ${c.title}`)} className="p-1.5 text-destructive hover:bg-destructive/10">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* === KONULAR === */}
                {activeTab === 'topics' && (
                    <div className="space-y-6 max-w-4xl">
                        <h1 className="text-xl font-bold border-b border-border/40 pb-3">Konu Yönetimi</h1>
                        <div className="p-5 border border-border/40 rounded-xl bg-card">
                            <h2 className="text-base font-bold flex items-center gap-2 mb-4"><PlusCircle className="h-4 w-4 text-primary" />Yeni Konu</h2>
                            <form onSubmit={handleTopicSubmit} className="space-y-3">
                                {topicError && <p className="text-sm text-destructive">{topicError}</p>}
                                {topicSuccess && <p className="text-sm text-green-500">Konu eklendi.</p>}
                                <div className="grid grid-cols-2 gap-3">
                                    <Input name="title" required placeholder="Başlık (örn: Antigravity)" />
                                    <Input name="slug" required placeholder="Slug (örn: antigravity)" />
                                </div>
                                <select name="category_id" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                                    <option value="">Kategori Seçin (Opsiyonel)</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                </select>
                                <div className="flex justify-end"><Button type="submit" disabled={isTopicPending}>{isTopicPending ? "Ekleniyor..." : "Konu Ekle"}</Button></div>
                            </form>
                        </div>

                        <div className="border border-border/40 rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-secondary/30 border-b border-border/40 text-xs uppercase text-muted-foreground">
                                    <tr><th className="px-4 py-3">Konu</th><th className="px-4 py-3">Kategori</th><th className="px-4 py-3 text-right">İşlem</th></tr>
                                </thead>
                                <tbody>
                                    {topics.map(t => (
                                        <tr key={t.id} className="border-b border-border/20 hover:bg-secondary/10">
                                            <td className="px-4 py-3 font-medium">{t.title}</td>
                                            <td className="px-4 py-3 text-muted-foreground text-xs">
                                                {categories.find(c => c.id === t.category_id)?.title || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => handleDelete(deleteTopic, t.id, `Konu silinsin mi? ${t.title}`)} className="p-1.5 text-destructive hover:bg-destructive/10">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* === VİDEOLAR === */}
                {activeTab === 'videos' && (
                    <div className="space-y-6 max-w-5xl">
                        <h1 className="text-xl font-bold border-b border-border/40 pb-3">Video Yönetimi</h1>
                        <div className="border border-border/40 rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-secondary/30 border-b border-border/40 uppercase text-xs text-muted-foreground">
                                    <tr><th className="px-4 py-3">Video</th><th className="px-4 py-3">Tarih</th><th className="px-4 py-3 text-right">İşlem</th></tr>
                                </thead>
                                <tbody>
                                    {videos.map(v => (
                                        <tr key={v.id} className="border-b border-border/20 last:border-0 hover:bg-secondary/10">
                                            <td className="px-4 py-3">
                                                <div className="font-medium truncate max-w-md">{v.title}</div>
                                                <div className="text-xs text-muted-foreground truncate max-w-md">{v.video_url}</div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{formatDate(v.created_at)}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => handleDelete(deleteVideo, v.id, `Video silinsin mi?` + v.title)} className="p-1.5 text-destructive hover:bg-destructive/10">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* === GİRDİLER (Articles) === */}
                {activeTab === 'articles' && (
                    <div className="space-y-6 max-w-5xl">
                        <h1 className="text-xl font-bold border-b border-border/40 pb-3">Girdi Yönetimi ({articles.length})</h1>
                        <div className="border border-border/40 rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-secondary/30 border-b border-border/40 text-xs uppercase text-muted-foreground">
                                    <tr><th className="px-4 py-3">Girdi Özeti</th><th className="px-4 py-3">Konu</th><th className="px-4 py-3 text-right">İşlem</th></tr>
                                </thead>
                                <tbody>
                                    {articles.map(a => (
                                        <tr key={a.id} className="border-b border-border/20 hover:bg-secondary/10">
                                            <td className="px-4 py-3 font-medium max-w-md truncate">{a.title}</td>
                                            <td className="px-4 py-3 text-muted-foreground text-xs">
                                                {topics.find(t => t.id === a.topic_id)?.title || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => handleDelete(deleteArticle, a.id, `Girdi silinsin mi?`)} className="p-1.5 text-destructive hover:bg-destructive/10">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* === REKLAMLAR === */}
                {activeTab === 'ads' && (
                    <div className="space-y-6 max-w-5xl">
                        <h1 className="text-xl font-bold border-b border-border/40 pb-3">Reklam Yönetimi</h1>
                        <div className="p-5 border border-border/40 rounded-xl bg-card">
                            <h2 className="text-base font-bold flex items-center gap-2 mb-4"><PlusCircle className="h-4 w-4 text-primary" />Yeni Reklam</h2>
                            <form onSubmit={handleAdSubmit} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <Input name="title" required placeholder="Reklam Başlığı" />
                                    <select name="position" defaultValue="sidebar" className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                                        <option value="sidebar">Yan Menü</option>
                                        <option value="content">İçerik Arası</option>
                                        <option value="top">Sayfa Üstü (Top)</option>
                                        <option value="bottom">Sayfa Altı (Bottom)</option>
                                    </select>
                                </div>
                                <Input name="image_url" placeholder="Görsel URL" />
                                <Input name="link_url" placeholder="Yönlendirme URL" />
                                <div className="flex justify-end"><Button type="submit" disabled={isAdPending}>Reklam Ekle</Button></div>
                            </form>
                        </div>

                        <div className="border border-border/40 rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-secondary/30 border-b border-border/40 text-xs uppercase text-muted-foreground">
                                    <tr><th className="px-4 py-3">Reklam</th><th className="px-4 py-3">Durum</th><th className="px-4 py-3 text-right">İşlem</th></tr>
                                </thead>
                                <tbody>
                                    {ads.map(ad => (
                                        <tr key={ad.id} className="border-b border-border/20 hover:bg-secondary/10">
                                            <td className="px-4 py-3 font-medium">{ad.title}</td>
                                            <td className="px-4 py-3">
                                                <button onClick={() => handleToggleAd(ad.id, ad.is_active)} className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ad.is_active ? 'bg-green-500/15 text-green-600' : 'bg-secondary text-muted-foreground'}`}>
                                                    {ad.is_active ? 'Aktif' : 'Pasif'}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => handleDelete(deleteAd, ad.id, `Reklam silinsin mi?`)} className="p-1.5 text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
