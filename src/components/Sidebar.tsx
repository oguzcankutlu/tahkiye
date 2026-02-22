"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { ChevronDown, ChevronRight, PlusCircle } from "lucide-react"

interface Article {
    id: string
    title: string
}

interface Category {
    id: string
    title: string
    slug: string
    articles: Article[]
}

export function Sidebar({ className = "" }: { className?: string }) {
    const [categories, setCategories] = useState<Category[]>([])
    const [openCats, setOpenCats] = useState<Set<string>>(new Set())
    const pathname = usePathname()

    useEffect(() => {
        const supabase = createClient()
        // Fetch categories with their articles
        supabase.from('topics').select('id, title, slug').order('title').then(async ({ data: topics }) => {
            if (!topics) return
            // For each topic, fetch its articles
            const withArticles = await Promise.all(
                topics.map(async (topic) => {
                    const { data: articles } = await supabase
                        .from('articles')
                        .select('id, title')
                        .eq('topic_id', topic.id)
                        .order('created_at', { ascending: false })
                        .limit(20)
                    return { ...topic, articles: articles || [] }
                })
            )
            setCategories(withArticles)
            // Auto-open the category whose slug matches the current path
            const activeSlug = withArticles.find(c => pathname === `/topic/${c.slug}`)?.id
            if (activeSlug) setOpenCats(new Set([activeSlug]))
        })
    }, [pathname])

    function toggle(id: string) {
        setOpenCats(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    return (
        <div className={`flex flex-col h-full bg-background border-r border-border/40 w-[300px] shrink-0 ${className}`}>

            {/* Başlık */}
            <div className="p-4 border-b border-border/40 flex items-center justify-between">
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Kategoriler</h2>
            </div>

            {/* Akordeon Kategori Listesi */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {categories.length === 0 && (
                    <p className="px-4 py-10 text-center text-sm text-muted-foreground">Henüz kategori yok.</p>
                )}
                {categories.map((cat) => {
                    const isOpen = openCats.has(cat.id)
                    const isCatActive = pathname === `/topic/${cat.slug}`
                    return (
                        <div key={cat.id} className="border-b border-border/20 last:border-0">
                            {/* Category Header */}
                            <button
                                onClick={() => toggle(cat.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors group ${isCatActive ? 'text-primary bg-primary/10' : 'hover:bg-secondary/50 text-foreground'}`}
                            >
                                <span className="truncate text-left pr-2">{cat.title}</span>
                                <div className="flex items-center gap-2 shrink-0">
                                    {cat.articles.length > 0 && (
                                        <span className="text-xs text-muted-foreground">{cat.articles.length}</span>
                                    )}
                                    {isOpen
                                        ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                        : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                    }
                                </div>
                            </button>

                            {/* Articles under this category */}
                            {isOpen && (
                                <div className="bg-secondary/10">
                                    {cat.articles.map(art => (
                                        <Link
                                            key={art.id}
                                            href={`/article/${art.id}`}
                                            className={`flex items-center gap-2 pl-7 pr-4 py-2 text-sm transition-colors ${pathname === `/article/${art.id}` ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'}`}
                                        >
                                            <span className="w-1 h-1 rounded-full bg-border shrink-0" />
                                            <span className="truncate">{art.title}</span>
                                        </Link>
                                    ))}
                                    <Link
                                        href={`/yaz?topic_id=${cat.id}`}
                                        className="flex items-center gap-2 pl-7 pr-4 py-2 text-xs text-primary/70 hover:text-primary transition-colors hover:bg-primary/5"
                                    >
                                        <PlusCircle className="h-3.5 w-3.5 shrink-0" />
                                        Yeni Girdi Ekle
                                    </Link>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
