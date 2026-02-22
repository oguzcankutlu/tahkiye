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
    category_id: string | null
    entryCount: number
    lastActivity: string
}

export function Sidebar({ className = "" }: { className?: string }) {
    const [categories, setCategories] = useState<Category[]>([])
    const [konular, setKonular] = useState<Konu[]>([])
    const [selectedCat, setSelectedCat] = useState<string>("all")
    const [loading, setLoading] = useState(true)
    const pathname = usePathname()

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
                    .select('id, title, slug, category_id, created_at')
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
        : konular.filter(k => k.category_id === selectedCat)

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
                        {filtered.map((konu, index) => {
                            const isActive = pathname === `/topic/${konu.slug}`
                            return (
                                <Link
                                    key={konu.id}
                                    href={`/topic/${konu.slug}`}
                                    className={`flex items-center justify-between px-4 py-3.5 transition-all group hover:bg-secondary/30 relative ${isActive ? 'bg-primary/5' : ''}`}
                                >
                                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(234,179,8,0.5)]" />}

                                    {/* 2. GİRDİ SAYISI (ENTRY COUNT) GÖSTERİMİ */}
                                    <div className="flex items-start gap-2 mr-2">
                                        <span className="text-[10px] font-bold text-muted-foreground/40 tabular-nums mt-0.5 w-4 hidden sm:inline-block">
                                            {index + 1}.
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

            <div className="p-4 border-t border-border/40 bg-card/30">
                <Link
                    href="/yaz"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold uppercase tracking-widest transition-all shadow-sm hover:shadow-md"
                >
                    <PlusCircle className="h-4 w-4" />
                    Yeni Konu Aç
                </Link>
            </div>
        </div>
    )
}
