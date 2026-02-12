"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { getCategories, getTopics } from "@/app/actions/topic-actions"

// Types
interface Category {
    id: number
    name: string
    slug: string
}

interface Topic {
    id: number
    title: string
    slug: string
    entries: { count: number }[]
}

export function TopicList({ className }: { className?: string }) {
    const [categories, setCategories] = useState<Category[]>([])
    const [topics, setTopics] = useState<Topic[]>([])
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)

    const ITEMS_PER_PAGE = 15

    // Fetch Initial Data
    useEffect(() => {
        const init = async () => {
            const cats = await getCategories()
            setCategories(cats)
            if (cats.length > 0) setSelectedCategory(cats[0])

            // Initial load with all topics or first category
            const t = await getTopics()
            setTopics(t as any) // Type casting for simple join result
            setIsLoading(false)
        }
        init()
    }, [])

    // Refresh topics when category changes
    useEffect(() => {
        const fetchTopics = async () => {
            setIsLoading(true)
            const t = await getTopics(selectedCategory?.id)
            setTopics(t as any)
            setIsLoading(false)
            setCurrentPage(1)
        }
        if (selectedCategory) fetchTopics()
    }, [selectedCategory])

    const totalPages = Math.ceil(topics.length / ITEMS_PER_PAGE)
    const currentTopics = topics.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    if (isLoading) {
        return <div className={cn("hidden md:flex flex-col w-full h-full p-4 text-sm text-muted-foreground", className)}>yükleniyor...</div>
    }

    return (
        <div className={cn("hidden md:flex flex-col w-full h-full", className)}>

            {/* Category Selector */}
            <div className="mb-4 px-2">
                <div className="border border-primary rounded-sm p-1 bg-primary/5">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between font-bold flex items-center px-2 hover:bg-primary/10 h-8">
                                <span className="truncate">{selectedCategory?.name || 'Tümü'}</span>
                                <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-1" align="start">
                            <div className="grid gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="justify-start font-normal"
                                    onClick={() => setSelectedCategory(null)}
                                >
                                    Tümü
                                </Button>
                                {categories.map((cat) => (
                                    <Button
                                        key={cat.id}
                                        variant="ghost"
                                        size="sm"
                                        className={`justify-start font-normal ${selectedCategory?.id === cat.id ? 'bg-primary/20 font-bold' : ''}`}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        {cat.name}
                                    </Button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="flex items-center justify-between px-2 mb-2">
                <h3 className="font-bold text-sm text-foreground/80">bugün</h3>
                <button
                    onClick={() => window.location.reload()}
                    className="text-xs text-muted-foreground hover:underline"
                >
                    yenile
                </button>
            </div>
            <ul className="space-y-0.5 flex-1">
                {currentTopics.map((topic) => (
                    <li key={topic.id}>
                        <Link
                            href={`/topic/${topic.id}`}
                            className="flex items-start justify-between group px-2 py-1 hover:bg-muted/50 transition-colors text-[14px] leading-tight"
                        >
                            <span className="text-foreground group-hover:text-primary transition-colors">{topic.title}</span>
                            <span className="text-[10px] text-muted-foreground ml-2 mt-0.5">
                                {topic.entries?.[0]?.count || 0}
                            </span>
                        </Link>
                    </li>
                ))}
                {currentTopics.length === 0 && (
                    <li className="px-2 py-1 text-sm text-muted-foreground">henüz konu yok.</li>
                )}
            </ul>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center px-2 mt-4 text-xs">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="text-muted-foreground hover:text-primary disabled:opacity-50"
                    >
                        &lt; önceki
                    </button>
                    <span className="text-muted-foreground">{currentPage} / {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="text-muted-foreground hover:text-primary disabled:opacity-50"
                    >
                        sonraki &gt;
                    </button>
                </div>
            )}

            <button className="text-left text-xs pl-2 mt-2 text-muted-foreground hover:underline">
                tüm konular &gt;
            </button>
        </div>
    )
}
