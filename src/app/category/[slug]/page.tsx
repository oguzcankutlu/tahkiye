import Link from "next/link"

const MOCK_TOPICS = [
    { id: 201, title: "Dijital detoks neden işe yaramıyor?", date: "22.02.2026", author: "Zeynep T." },
    { id: 202, title: "Odaklanma süremiz neden bu kadar azaldı?", date: "20.02.2026", author: "Cem K." },
    { id: 203, title: "Sürekli bağlı olmanın getirdiği yorgunluk", date: "15.02.2026", author: "Ahmet Erdem" },
    { id: 204, title: "Fomo: Kaçırma Korkusu üzerine notlar", date: "10.02.2026", author: "Deniz Y." },
]

export default function CategoryPage({ params }: { params: { slug: string } }) {
    // Mock title formatting from slug
    const decodedSlug = decodeURIComponent(params.slug).replace(/-/g, ' ')
    const categoryTitle = decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1)

    return (
        <div className="w-full pb-20">
            <div className="mb-8 border-b border-border/40 pb-6">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Kategori: <span className="text-primary">{categoryTitle}</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                    Bu kategorideki son güncel başlıklar
                </p>
            </div>

            <div className="space-y-4">
                {MOCK_TOPICS.map(topic => (
                    <Link
                        key={topic.id}
                        href={`/topic/${topic.id}`}
                        className="block p-4 rounded-lg border border-border/50 bg-secondary/10 hover:bg-secondary/30 transition-colors group"
                    >
                        <h2 className="text-lg font-medium group-hover:text-primary transition-colors">
                            {topic.title}
                        </h2>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                Yazar: <span className="text-foreground">{topic.author}</span>
                            </span>
                            <span>{topic.date}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
