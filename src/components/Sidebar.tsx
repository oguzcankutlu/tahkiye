import Link from "next/link"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

const MOCK_TOPICS = [
    { id: 1, title: "Anlam arayışı", count: 42 },
    { id: 2, title: "Modern mimari eleştirisi", count: 18 },
    { id: 3, title: "Yapay zeka etiği", count: 156 },
    { id: 4, title: "Klasik Türk edebiyatı metinleri", count: 8 },
    { id: 5, title: "Zamanın görece algısı", count: 23 },
    { id: 6, title: "Kültürel yozlaşma", count: 94 },
    { id: 7, title: "Sokak lezzetleri tarihçesi", count: 5 },
    { id: 8, title: "Minimalizm yanılgısı", count: 37 },
    { id: 9, title: "Distopik gelecek senaryoları", count: 61 },
    { id: 10, title: "Sessizliğin müziği", count: 12 },
    { id: 11, title: "Nöroplastisite", count: 29 },
    { id: 12, title: "Büyük veri ve gizlilik", count: 110 },
    { id: 13, title: "Felsefi akımların çöküşü", count: 44 },
    { id: 14, title: "Bağımsız sinema önerileri", count: 76 },
    { id: 15, title: "Şiir çevirisinin zorlukları", count: 19 },
]

export function Sidebar({ className = "" }: { className?: string }) {
    return (
        <div className={`flex flex-col h-full bg-background border-r border-border/40 w-[300px] shrink-0 ${className}`}>

            {/* Kategori Seçici / Dropdown (Simüle edilmiş) */}
            <div className="p-4 border-b border-border/40">
                <button className="w-full flex items-center justify-between bg-secondary/50 hover:bg-secondary/80 text-secondary-foreground border border-border/50 rounded-md px-4 py-2 text-sm font-medium transition-colors">
                    <span>Kategori Seçin</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
            </div>

            {/* Konu Listesi */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                <ul className="space-y-1">
                    {MOCK_TOPICS.map((topic) => (
                        <li key={topic.id}>
                            <Link
                                href={`/topic/${topic.id}`}
                                className="flex items-center justify-between px-3 py-2 text-sm rounded-md text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors group"
                            >
                                <span className="truncate pr-2">{topic.title}</span>
                                <span className="text-xs text-muted-foreground group-hover:text-primary/70 transition-colors">
                                    {topic.count}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Sayfalama */}
            <div className="p-4 border-t border-border/40 flex items-center justify-center gap-1">
                <button className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="h-8 w-8 rounded text-sm font-medium bg-primary text-primary-foreground">
                    1
                </button>
                <button className="h-8 w-8 rounded text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                    2
                </button>
                <button className="h-8 w-8 rounded text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                    3
                </button>
                <span className="px-1 text-muted-foreground">...</span>
                <button className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

        </div>
    )
}
