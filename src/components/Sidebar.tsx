"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

interface Category {
    id: string
    title: string
    slug: string
}

export function Sidebar({ className = "" }: { className?: string }) {
    const [categories, setCategories] = useState<Category[]>([])
    const pathname = usePathname()

    useEffect(() => {
        const supabase = createClient()
        supabase.from('topics').select('id, title, slug').order('title').then(({ data }) => {
            if (data) setCategories(data)
        })
    }, [])

    return (
        <div className={`flex flex-col h-full bg-background border-r border-border/40 w-[300px] shrink-0 ${className}`}>

            {/* Başlık */}
            <div className="p-4 border-b border-border/40">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Kategoriler</h2>
            </div>

            {/* Kategori Listesi */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                <ul className="space-y-1">
                    {categories.length === 0 && (
                        <li className="px-3 py-8 text-center text-sm text-muted-foreground">
                            Henüz kategori yok.
                        </li>
                    )}
                    {categories.map((cat) => {
                        const isActive = pathname === `/topic/${cat.slug}`
                        return (
                            <li key={cat.id}>
                                <Link
                                    href={`/topic/${cat.slug}`}
                                    className={`flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors group ${isActive
                                            ? 'bg-primary/15 text-primary font-medium'
                                            : 'text-foreground/80 hover:text-primary hover:bg-primary/10'
                                        }`}
                                >
                                    <span className="truncate pr-2">{cat.title}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>

        </div>
    )
}
