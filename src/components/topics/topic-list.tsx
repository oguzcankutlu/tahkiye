"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react"

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
    entriesCount: number
}

// Mock Data
const MOCK_CATEGORIES: Category[] = [
    { id: 1, name: "Gündem", slug: "gundem" },
    { id: 2, name: "Teknoloji", slug: "teknoloji" },
    { id: 3, name: "Bilim", slug: "bilim" },
    { id: 4, name: "Sanat", slug: "sanat" },
    { id: 5, name: "Spor", slug: "spor" },
    { id: 6, name: "Edebiyat", slug: "edebiyat" }
]

const MOCK_TOPICS: Topic[] = [
    { id: 1, title: "Next.js App Router performansı", slug: "nextjs-app-router", entriesCount: 142 },
    { id: 2, title: "Modern frontend mimarisi ve zorlukları", slug: "modern-frontend", entriesCount: 89 },
    { id: 3, title: "Yapay zeka araçlarının günlük yazılım süreçlerine etkisi", slug: "ai-in-software", entriesCount: 256 },
    { id: 4, title: "Tailwind CSS vs Vanilla CSS", slug: "tailwind-vs-vanilla", entriesCount: 45 },
    { id: 5, title: "Uzaktan çalışmanın psikolojik etkileri", slug: "remote-work", entriesCount: 312 },
    { id: 6, title: "TypeScript type inference yetenekleri", slug: "ts-inference", entriesCount: 67 },
    { id: 7, title: "Açık kaynak projelere katkı sağlamanın yolları", slug: "open-source", entriesCount: 120 },
    { id: 8, title: "Klasik müzik dinlerken kod yazmak", slug: "classic-music-coding", entriesCount: 34 },
    { id: 9, title: "Frontend state management 2026 yılı", slug: "state-management", entriesCount: 198 },
    { id: 10, title: "Sürdürülebilir yazılım geliştirme", slug: "sustainable-software", entriesCount: 56 },
    { id: 11, title: "Tarihin en ilginç bug'ları", slug: "interesting-bugs", entriesCount: 432 },
    { id: 12, title: "Minimalist yaşam felsefesi", slug: "minimalism", entriesCount: 78 },
    { id: 13, title: "Kahve tüketim alışkanlıklarımız", slug: "coffee-habits", entriesCount: 156 },
    { id: 14, title: "İyi bir API dokümantasyonu nasıl yazılır?", slug: "api-docs", entriesCount: 92 },
    { id: 15, title: "Web accessibility (a11y) standartları", slug: "web-a11y", entriesCount: 45 },
    { id: 16, title: "GraphQL'in REST API'ye üstünlükleri", slug: "graphql-vs-rest", entriesCount: 112 },
    { id: 17, title: "Okuduğunuz son teknik kitap", slug: "last-tech-book", entriesCount: 88 },
    { id: 18, title: "Monorepo mimarisinin avantajları", slug: "monorepo", entriesCount: 76 }
]

export function TopicList({ className }: { className?: string }) {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [currentPage, setCurrentPage] = useState(1)

    const ITEMS_PER_PAGE = 12

    const totalPages = Math.ceil(MOCK_TOPICS.length / ITEMS_PER_PAGE)
    const currentTopics = MOCK_TOPICS.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    return (
        <div className={cn("hidden md:flex flex-col w-full h-full pb-4", className)}>
            {/* Category Selector */}
            <div className="mb-4">
                <div className="border border-border rounded-md p-1 bg-background/50 backdrop-blur-sm">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between font-bold flex items-center px-3 hover:bg-muted/50 h-10 transition-colors">
                                <span className="truncate">{selectedCategory?.name || 'Kategori Seçin'}</span>
                                <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-1 border-border/50 shadow-lg" align="start">
                            <div className="grid gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="justify-start font-normal"
                                    onClick={() => setSelectedCategory(null)}
                                >
                                    Tümü
                                </Button>
                                {MOCK_CATEGORIES.map((cat) => (
                                    <Button
                                        key={cat.id}
                                        variant="ghost"
                                        size="sm"
                                        className={`justify-start font-normal ${selectedCategory?.id === cat.id ? 'bg-primary/20 text-primary font-bold' : ''}`}
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

            <div className="flex items-center justify-between px-2 mb-3">
                <h3 className="font-bold text-sm text-foreground/80 lowercase tracking-tight">
                    {selectedCategory ? `${selectedCategory.name} başlıkları` : "en son güncellenenler"}
                </h3>
            </div>

            {/* Topic List */}
            <ul className="space-y-0.5 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {currentTopics.map((topic) => (
                    <li key={topic.id}>
                        <Link
                            href={`/konu/${topic.id}`}
                            className="flex items-start justify-between group px-2 py-1.5 rounded-sm hover:bg-muted/60 transition-colors text-[14px] leading-snug"
                        >
                            <span className="text-foreground/90 group-hover:text-primary transition-colors line-clamp-2 pr-2">
                                {topic.title}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-sm group-hover:bg-primary/10 group-hover:text-primary transition-colors mt-0.5 shrink-0">
                                {topic.entriesCount}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-border/50 text-sm font-medium">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="text-muted-foreground hover:text-primary disabled:opacity-30 px-2 h-8"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Önceki
                    </Button>
                    <span className="text-muted-foreground/80 font-mono text-xs">
                        {currentPage} / {totalPages}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="text-muted-foreground hover:text-primary disabled:opacity-30 px-2 h-8"
                    >
                        Sonraki <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            )}
        </div>
    )
}
