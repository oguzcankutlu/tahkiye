"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { PlusCircle, ChevronDown, Hash } from "lucide-react"

interface Category {
    id: string
    title: string
    slug: string
}

interface Konu {
    id: string
    title: string
    slug: string
    category_ids: string[] | null
    entryCount: number
    lastActivity: string
}

export function Sidebar({ className = "" }: { className?: string }) {
    const [categories, setCategories] = useState<Category[]>([])
    const [konular, setKonular] = useState<Konu[]>([])
    const [selectedCat, setSelectedCat] = useState<string>("all")
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const ITEMS_PER_PAGE = 50
    const pathname = usePathname()

    useEffect(() => { setPage(1) }, [selectedCat])

    useEffect(() => {
        const fetchSidebarData = async () => {
            const supabase = createClient()
            setLoading(true)

            try {
                // 1. Kategorileri Getir (Filtreleme için)
                const { data: cats } = await supabase.from('categories').select('id, title, slug').order('title')
                if (cats) setCategories(cats)

                // 2. Konuları Getir
                // Not: category_id kolonu henüz eklenmemiş olabilir, bu yüzden hata kontrolü yapıyoruz
                const { data: topics, error: topicsError } = await supabase
                    .from('topics')
                    .select('id, title, slug, category_ids, created_at')
                    .order('created_at', { ascending: false })

                if (topicsError) {
                    console.error("Konu çekme hatası (SQL eksik olabilir):", topicsError.message)
                    // Yedek: category_id olmadan tekrar dene (SQL henüz çalıştırılmadıysa)
                    const { data: fallbackTopics } = await supabase
                        .from('topics')
                        .select('id, title, slug, created_at')
                        .order('created_at', { ascending: false })

                    if (fallbackTopics) {
                        processTopics(fallbackTopics as any, supabase)
                    } else {
                        setLoading(false)
                    }
                } else if (topics) {
                    processTopics(topics, supabase)
                }
            } catch (err) {
                console.error("Sidebar yükleme hatası:", err)
                setLoading(false)
            }
        }

        const processTopics = async (topics: any[], supabase: any) => {
            // Her konu için girdi sayılarını ve son aktiviteyi bul
            const { data: articlesData } = await supabase
                .from('articles')
                .select('topic_id, created_at')

            const countMap: Record<string, number> = {}
            const lastEntryMap: Record<string, string> = {}

            articlesData?.forEach((a: any) => {
                countMap[a.topic_id] = (countMap[a.topic_id] || 0) + 1
                if (!lastEntryMap[a.topic_id] || a.created_at > lastEntryMap[a.topic_id]) {
                    lastEntryMap[a.topic_id] = a.created_at
                }
            })

            const processed = topics.map(t => ({
                ...t,
                entryCount: countMap[t.id] || 0,
                lastActivity: lastEntryMap[t.id] || t.created_at
            })).sort((a, b) => b.lastActivity.localeCompare(a.lastActivity))

            setKonular(processed)
            setLoading(false)
        }

        fetchSidebarData()
    }, [pathname])

    const filtered = selectedCat === "all"
        ? konular
        : konular.filter(k => k.category_ids?.includes(selectedCat))

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    return (
        <div className={`flex flex-col h-full bg-background border-r border-border/40 w-[280px] shrink-0 overflow-hidden ${className}`}>

            {/* 3. KATEGORİ DROPDOWN MANTIĞI (FİLTRELEME) */}
            <div className="p-4 border-b border-border/40 bg-card/30">
                <div className="relative group">
                    <select
                        value={selectedCat}
                        onChange={e => setSelectedCat(e.target.value)}
                        className="w-full appearance-none h-10 rounded-lg border border-border bg-secondary/20 pl-10 pr-10 text-xs font-bold uppercase tracking-tighter focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer transition-all hover:bg-secondary/40"
                    >
                        <option value="all">Tüm Kategoriler</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                        ))}
                    </select>
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                </div>
            </div>

            {/* 1. LİSTELENECEK VERİ: KONULAR (Sıralama: Güncelden Eskiye) */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                {loading ? (
                    <div className="p-8 space-y-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-4 bg-muted animate-pulse rounded w-3/4" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-sm text-muted-foreground">Henüz konu başlığı bulunmuyor.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/5">
                        {paginated.map((konu, index) => {
                            const isActive = pathname === `/konu/${konu.slug}`
                            const displayIndex = (page - 1) * ITEMS_PER_PAGE + index + 1
                            return (
                                <Link
                                    key={konu.id}
                                    href={`/konu/${konu.slug}`}
                                    className={`flex items-center justify-between px-4 py-3.5 transition-all group hover:bg-secondary/30 relative ${isActive ? 'bg-primary/5' : ''}`}
                                >
                                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(234,179,8,0.5)]" />}

                                    {/* 2. GİRDİ SAYISI (ENTRY COUNT) GÖSTERİMİ */}
                                    <div className="flex items-start gap-2 mr-2">
                                        <span className="text-[10px] font-bold text-muted-foreground/40 tabular-nums mt-0.5 w-4 hidden sm:inline-block">
                                            {displayIndex}.
                                        </span>
                                        <span className={`text-sm leading-tight transition-colors ${isActive ? 'text-primary font-bold' : 'text-foreground/85 group-hover:text-foreground'}`}>
                                            {konu.title}
                                        </span>
                                    </div>
                                    <span className={`text-[11px] font-bold tabular-nums shrink-0 transition-opacity ${isActive ? 'text-primary' : 'text-muted-foreground/60 group-hover:opacity-100'}`}>
                                        ({konu.entryCount})
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 p-3 border-t border-border/40 bg-card/30">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-secondary disabled:opacity-30 text-xs font-bold text-muted-foreground transition-colors"
                    >
                        &lt;
                    </button>

                    <span className="text-xs font-semibold text-muted-foreground min-w-[3ch] text-center">
                        {page}
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-secondary disabled:opacity-30 text-xs font-bold text-muted-foreground transition-colors"
                    >
                        &gt;
                    </button>
                </div>
            )}
        </div>
    )
}
