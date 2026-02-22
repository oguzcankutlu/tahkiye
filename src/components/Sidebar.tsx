"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { PlusCircle, ChevronDown } from "lucide-react"

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
}

export function Sidebar({ className = "" }: { className?: string }) {
    const [categories, setCategories] = useState<Category[]>([])
    const [konular, setKonular] = useState<Konu[]>([])
    const [selectedCat, setSelectedCat] = useState<string>("all")
    const pathname = usePathname()

    useEffect(() => {
        const supabase = createClient()

        // Fetch categories
        supabase.from('categories').select('id, title, slug').order('title').then(({ data }) => {
            if (data) setCategories(data)
        })

        // Fetch konular with entry count
        supabase
            .from('topics')
            .select('id, title, slug, category_id, created_at')
            .order('created_at', { ascending: false }) // Temporary sort until trigger adds last_entry_at
            .then(async ({ data: topics }) => {
                if (!topics) return

                // Get article counts and last entry dates for all topics
                const { data: articlesData } = await supabase
                    .from('articles')
                    .select('topic_id, created_at')

                const countMap: Record<string, number> = {}
                const lastEntryMap: Record<string, string> = {}

                articlesData?.forEach(a => {
                    countMap[a.topic_id] = (countMap[a.topic_id] || 0) + 1
                    // Update last entry date if newer
                    if (!lastEntryMap[a.topic_id] || a.created_at > lastEntryMap[a.topic_id]) {
                        lastEntryMap[a.topic_id] = a.created_at
                    }
                })

                const sortedTopics = topics.map(t => ({
                    ...t,
                    entryCount: countMap[t.id] || 0,
                    lastActivity: lastEntryMap[t.id] || t.created_at
                })).sort((a, b) => b.lastActivity.localeCompare(a.lastActivity))

                setKonular(sortedTopics)
            })
    }, [pathname])

    const filtered = selectedCat === "all"
        ? konular
        : konular.filter(k => k.category_id === selectedCat)

    return (
        <div className={`flex flex-col h-full bg-background border-r border-border/40 w-[280px] shrink-0 ${className}`}>

            {/* Kategori Filtresi */}
            <div className="p-3 border-b border-border/40">
                <div className="relative">
                    <select
                        value={selectedCat}
                        onChange={e => setSelectedCat(e.target.value)}
                        className="w-full appearance-none h-9 rounded-md border border-border bg-secondary/30 px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                    >
                        <option value="all">Tüm Kategoriler</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                </div>
            </div>

            {/* Konular Listesi */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {filtered.length === 0 && (
                    <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                        {selectedCat === "all" ? "Henüz konu yok." : "Bu kategoride konu yok."}
                    </p>
                )}
                {filtered.map((konu, index) => {
                    const isActive = pathname === `/topic/${konu.slug}`
                    return (
                        <Link
                            key={konu.id}
                            href={`/topic/${konu.slug}`}
                            className={`flex items-center justify-between px-4 py-2.5 border-b border-border/10 transition-colors group hover:bg-secondary/40 ${isActive ? 'bg-primary/10 border-l-2 border-l-primary' : ''}`}
                        >
                            <span className={`text-sm truncate pr-2 ${isActive ? 'text-primary font-semibold' : 'text-foreground/80 group-hover:text-foreground'}`}>
                                <span className="mr-1.5 opacity-50 tabular-nums">{index + 1}.</span>
                                {konu.title}
                            </span>
                            <span className="text-xs text-muted-foreground shrink-0">
                                ({konu.entryCount})
                            </span>
                        </Link>
                    )
                })}
            </div>

            {/* Yeni Konu Butonu */}
            <div className="p-3 border-t border-border/40">
                <Link
                    href="/yaz"
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium transition-colors"
                >
                    <PlusCircle className="h-4 w-4" />
                    Yeni Konu Aç
                </Link>
            </div>
        </div>
    )
}
