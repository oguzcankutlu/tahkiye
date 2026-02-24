import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { Calendar, Tag, User, Book, Lightbulb, SortAsc, Activity } from "lucide-react"

interface PageProps {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ type?: string; sort?: string }>
}

const TYPE_CONFIG = {
    general: { label: "Genel", icon: Tag, color: "text-muted-foreground" },
    person: { label: "Kişi", icon: User, color: "text-yellow-500" },
    work: { label: "Eser", icon: Book, color: "text-blue-500" },
    concept: { label: "Kavram", icon: Lightbulb, color: "text-purple-500" },
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
    const { slug } = await params
    const { type: activeType, sort: activeSort } = await searchParams

    const supabase = await createClient()

    // 1. Kategoriyi Bul
    const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!category) notFound()

    // 2. Konuları Çek
    let query = supabase
        .from('topics')
        .select(`
            *,
            articles(count)
        `)
        .contains('category_ids', [category.id])

    // Filtrele: Tür
    if (activeType && activeType !== 'all') {
        query = query.eq('type', activeType)
    }

    // Sırala
    if (activeSort === 'chronological') {
        query = query.order('era_year', { ascending: true, nullsFirst: false })
    } else {
        query = query.order('created_at', { ascending: false })
    }

    const { data: topics } = await query

    const isTimelineView = activeSort === 'chronological'

    return (
        <div className="w-full pb-20">
            {/* Header */}
            <div className="mb-8 border-b border-border/40 pb-6">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Kategori: <span className="text-primary">{category.title}</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                    {category.description || `${category.title} alanındaki derinlikli tartışmalar ve bilgiler.`}
                </p>
            </div>

            {/* Topics List */}
            <div className="space-y-6">
                {!topics || topics.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-border/40 rounded-2xl">
                        <p className="text-muted-foreground">Bu kategori altında henüz bir konu bulunmuyor.</p>
                        <Link href={`/yaz`} className="text-primary text-sm hover:underline mt-2 inline-block">İlk konuyu sen aç</Link>
                    </div>
                ) : (
                    topics.map(topic => {
                        return (
                            <Link
                                key={topic.id}
                                href={`/topic/${topic.slug}`}
                                className="group block relative"
                            >
                                <div className="p-5 rounded-2xl border border-border/50 bg-secondary/5 hover:bg-secondary/10 transition-all hover:border-primary/30 shadow-sm hover:shadow-md">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-2">
                                            <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                                                {topic.title}
                                            </h2>

                                            {topic.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {topic.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/10">
                                        <span className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                            {topic.articles?.[0]?.count || 0} Girdi
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-border/40" />
                                        <span className="text-[11px] text-muted-foreground">
                                            Son Aktivite: {new Date(topic.created_at).toLocaleDateString('tr-TR')}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                )}
            </div>
        </div>
    )
}

function FilterLink({ active, label, value, slug, currentSort }: { active: boolean; label: string; value: string; slug: string; currentSort?: string }) {
    const url = `/category/${slug}?type=${value}${currentSort ? `&sort=${currentSort}` : ''}`
    return (
        <Link
            href={url}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${active
                ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105'
                : 'bg-background hover:bg-secondary border-border/40 text-muted-foreground'
                }`}
        >
            {label}
        </Link>
    )
}

function SortButton({ active, label, value, icon: Icon, slug, currentType }: { active: boolean; label: string; value: string; icon: any; slug: string; currentType?: string }) {
    const url = `/category/${slug}?sort=${value}${currentType ? `&type=${currentType}` : ''}`
    return (
        <Link
            href={url}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${active
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'hover:bg-secondary text-muted-foreground'
                }`}
        >
            <Icon className="h-3.5 w-3.5" />
            {label}
        </Link>
    )
}
