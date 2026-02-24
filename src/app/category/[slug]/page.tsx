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

            {/* UI Control Bar (Filters & Sort) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-secondary/5 p-3 rounded-xl border border-border/40">
                {/* Tür Filtreleri */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-hide">
                    <FilterLink active={!activeType || activeType === 'all'} label="Tümü" value="all" slug={slug} currentSort={activeSort} />
                    <FilterLink active={activeType === 'person'} label="Kişiler" value="person" slug={slug} currentSort={activeSort} />
                    <FilterLink active={activeType === 'work'} label="Eserler" value="work" slug={slug} currentSort={activeSort} />
                    <FilterLink active={activeType === 'concept'} label="Kavramlar" value="concept" slug={slug} currentSort={activeSort} />
                </div>

                {/* Sıralama */}
                <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40 w-full sm:w-auto overflow-x-auto">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/60 mr-1 whitespace-nowrap">Sırala:</span>
                    <SortButton active={!activeSort || activeSort === 'activity'} label="Güncel" value="activity" icon={Activity} slug={slug} currentType={activeType} />
                    <SortButton active={activeSort === 'chronological'} label="Kronolojik" value="chronological" icon={Calendar} slug={slug} currentType={activeType} />
                </div>
            </div>

            {/* Topics List */}
            <div className={`space-y-6 relative ${isTimelineView ? 'pl-8' : ''}`}>
                {/* Timeline Vertical Line */}
                {isTimelineView && topics && topics.length > 0 && (
                    <div className="absolute left-3 top-2 bottom-6 w-0.5 bg-gradient-to-b from-primary/60 via-primary/20 to-transparent" />
                )}

                {!topics || topics.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-border/40 rounded-2xl">
                        <p className="text-muted-foreground">Bu filtreye uygun konu bulunamadı.</p>
                        <Link href={`/category/${slug}`} className="text-primary text-sm hover:underline mt-2 inline-block">Filtreleri Temizle</Link>
                    </div>
                ) : (
                    topics.map(topic => {
                        const config = TYPE_CONFIG[topic.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.general
                        const Icon = config.icon

                        return (
                            <Link
                                key={topic.id}
                                href={`/topic/${topic.slug}`}
                                className="group block relative"
                            >
                                {/* Timeline Dot */}
                                {isTimelineView && (
                                    <div className="absolute -left-[25px] top-6 w-3 h-3 rounded-full bg-background border-2 border-primary shadow-[0_0_8px_rgba(234,179,8,0.4)] z-10" />
                                )}

                                <div className="p-5 rounded-2xl border border-border/50 bg-secondary/5 hover:bg-secondary/10 transition-all hover:border-primary/30 shadow-sm hover:shadow-md">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-2">
                                            {/* Era Badge & Type */}
                                            <div className="flex items-center gap-2">
                                                {topic.era && (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wide border border-primary/20">
                                                        <Calendar className="h-3 w-3" />
                                                        {topic.era}
                                                    </span>
                                                )}
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${config.color} opacity-80`}>
                                                    <Icon className="h-3 w-3" />
                                                    {config.label}
                                                </span>
                                            </div>

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
