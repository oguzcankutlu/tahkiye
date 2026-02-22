"use client"

import { useState, useActionState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link2, Users, FileText, Image, Layout, LogOut, PlusCircle } from "lucide-react"
import { createTopic, createVideo } from "./actions"

type Tab = 'users' | 'content' | 'ads' | 'pages'

interface Topic {
    id: string
    title: string
    slug: string
}

const initialState = { error: null as string | null, success: false }

// Mock verileri hala görsel olarak tutuyoruz ki site boş görünmesin, 
// CMS admini sonradan veritabanı okuyacak şekilde bunları geliştirebilir.
const MOCK_USERS = [
    { id: 1, username: 'ahmet-erdem', email: 'ahmet@test.com', status: 'pending', joined: '12.02.2026' },
]

export default function AdminDashboardClient({ topics }: { topics: Topic[] }) {
    const [activeTab, setActiveTab] = useState<Tab>('content') // Yeni İçerik eklemeyi öne çıkar

    const [topicState, topicAction, isTopicPending] = useActionState(async (state: typeof initialState, formData: FormData) => {
        const result = await createTopic(formData)
        return { error: result.error || null, success: result.success || false }
    }, initialState)

    const [videoState, videoAction, isVideoPending] = useActionState(async (state: typeof initialState, formData: FormData) => {
        const result = await createVideo(formData)
        return { error: result.error || null, success: result.success || false }
    }, initialState)

    // Alert clear
    useEffect(() => {
        if (topicState.success) alert("Konu başarıyla eklendi!")
        if (videoState.success) alert("Video başarıyla eklendi!")
    }, [topicState.success, videoState.success])

    return (
        <div className="flex min-h-[calc(100vh-64px)] w-full bg-background text-foreground">
            {/* Admin Sidebar */}
            <aside className="w-64 border-r border-border/40 bg-secondary/20 flex flex-col shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-border/40">
                    <span className="font-bold text-xl tracking-tight">tahkiye <span className="text-primary text-sm font-normal">CMS</span></span>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'content' ? 'bg-primary/20 text-primary' : 'hover:bg-secondary/50 text-muted-foreground'}`}
                    >
                        <FileText className="h-4 w-4" /> İçerik Yönetimi
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'users' ? 'bg-primary/20 text-primary' : 'hover:bg-secondary/50 text-muted-foreground'}`}
                    >
                        <Users className="h-4 w-4" /> Kullanıcılar
                    </button>
                    <button
                        onClick={() => setActiveTab('ads')}
                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'ads' ? 'bg-primary/20 text-primary' : 'hover:bg-secondary/50 text-muted-foreground'}`}
                    >
                        <Image className="h-4 w-4" /> Reklam Alanları
                    </button>
                    <button
                        onClick={() => setActiveTab('pages')}
                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'pages' ? 'bg-primary/20 text-primary' : 'hover:bg-secondary/50 text-muted-foreground'}`}
                    >
                        <Layout className="h-4 w-4" /> Sabit Sayfalar
                    </button>
                </nav>

                <div className="p-4 border-t border-border/40">
                    <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 w-full transition-colors">
                        <LogOut className="h-4 w-4" /> Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto">
                {activeTab === 'content' && (
                    <div className="space-y-10 max-w-4xl">
                        <div className="flex items-center justify-between border-b border-border/40 pb-4">
                            <h1 className="text-2xl font-bold tracking-tight">İçerik Yönetimi (CMS)</h1>
                        </div>

                        {/* Yeni Konu Ekle */}
                        <div className="p-6 border border-border/40 rounded-xl bg-card">
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                                <PlusCircle className="h-5 w-5 text-primary" />
                                Yeni Ana Konu Ekle
                            </h2>
                            <form action={topicAction} className="space-y-4">
                                {topicState.error && <p className="text-sm text-destructive">{topicState.error}</p>}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">Görünür Başlık</label>
                                        <Input name="title" required placeholder="Örn: Psikolojik Analizler" className="bg-background" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">URL (Slug)</label>
                                        <Input name="slug" required placeholder="orn-psikolojik-analizler" className="bg-background" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Kısa Açıklama (Opsiyonel)</label>
                                    <Input name="description" placeholder="Bu konunun ne hakkında olduğunu özetleyin." className="bg-background" />
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button type="submit" disabled={isTopicPending}>
                                        {isTopicPending ? "Ekleniyor..." : "Konuyu Kaydet"}
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Yeni Video Ekle */}
                        <div className="p-6 border border-border/40 rounded-xl bg-card">
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                                <PlusCircle className="h-5 w-5 text-primary" />
                                Yeni Video Ekle
                            </h2>
                            <form action={videoAction} className="space-y-4">
                                {videoState.error && <p className="text-sm text-destructive">{videoState.error}</p>}
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Video Başlığı</label>
                                    <Input name="title" required placeholder="YouTube'daki tam başlık..." className="bg-background" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">İlişkili Konu</label>
                                        <select
                                            name="topic_id"
                                            required
                                            defaultValue=""
                                            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        >
                                            <option value="" disabled>Konu seçin...</option>
                                            {topics.map(t => (
                                                <option key={t.id} value={t.id}>{t.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">Video Süresi</label>
                                        <Input name="duration" placeholder="Örn: 14:20" className="bg-background" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Video URL (Embed/YouTube)</label>
                                    <Input name="video_url" required placeholder="https://www.youtube.com/watch?v=..." className="bg-background" />
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button type="submit" disabled={isVideoPending}>
                                        {isVideoPending ? "Ekleniyor..." : "Videoyu Yayınla"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {/* Diğer tabları (pages, ads, users) şablon olarak bırakıyoruz. CMS genişledikçe bunlar da bağlanabilir.*/}
            </main>
        </div>
    )
}
