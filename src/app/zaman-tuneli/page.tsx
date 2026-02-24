import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Tag } from "lucide-react"

// Types matching Supabase tables
type SupabaseTopic = {
    id: string
    title: string
    slug: string
    category_ids: string[] | null
    custom_timeline_date: number | null
}

type SupabaseCategory = {
    id: string
    title: string
    slug: string
}

type SupabaseTag = {
    id: string
    name: string
    type: 'general' | 'date'
    slug: string
}

type TopicTagRelation = {
    topic_id: string
    tag_id: string
    tag: SupabaseTag
}

// Structured data for UI
type TimelineCardData = {
    topic_id: string
    title: string
    slug: string
    year: number
    categories: SupabaseCategory[]
    general_tags: SupabaseTag[]
}

export const dynamic = 'force-dynamic'

export default async function ZamanTuneli() {
    const supabase = await createClient()

    // 1. Fetch raw data
    const [topicsRes, categoriesRes, tagsRelationRes] = await Promise.all([
        supabase.from('topics').select('id, title, slug, category_ids, custom_timeline_date'),
        supabase.from('categories').select('id, title, slug'),
        supabase.from('topic_tags').select(`
            topic_id,
            tag_id,
            tags (id, name, type, slug)
        `)
    ])

    const topics: SupabaseTopic[] = topicsRes.data || []
    const categories: SupabaseCategory[] = categoriesRes.data || []
    // Cast safely handling Supabase's generated type quirk for joined tables
    const relations = (tagsRelationRes.data || []) as unknown as { topic_id: string, tags: SupabaseTag }[]

    // 2. Process data into cards
    const cards: TimelineCardData[] = []

    for (const topic of topics) {
        // Group tags for this topic
        const topicRelations = relations.filter(r => r.topic_id === topic.id)
        const dateTags = topicRelations.map(r => r.tags).filter(t => t?.type === 'date')
        const generalTags = topicRelations.map(r => r.tags).filter(t => t?.type === 'general')

        let computedYear: number | null = topic.custom_timeline_date

        if (computedYear === null && dateTags.length > 0) {
            // Extract earliest possible year from date_tags strings using regex
            const extractedYears: number[] = []
            for (const dt of dateTags) {
                const isBCE = dt.name.toLowerCase().includes('m.ö') || dt.name.toLowerCase().includes('mö')
                const nums = dt.name.match(/\d+/g)
                if (nums && nums.length > 0) {
                    let yearVal = parseInt(nums[0], 10)
                    // If tag says "18. Yüzyıl", translate century roughly to start year (e.g. 1700)
                    if (dt.name.toLowerCase().includes('yüzyıl') || dt.name.toLowerCase().includes('yy')) {
                        yearVal = (yearVal - 1) * 100
                    }
                    if (isBCE) yearVal = -Math.abs(yearVal)
                    extractedYears.push(yearVal)
                }
            }
            if (extractedYears.length > 0) {
                computedYear = Math.min(...extractedYears)
            }
        }

        // Only include in timeline if a year was bound
        if (computedYear !== null && !isNaN(computedYear)) {
            const topicCategories = categories.filter(c => topic.category_ids?.includes(c.id))
            cards.push({
                topic_id: topic.id,
                title: topic.title,
                slug: topic.slug,
                year: computedYear,
                categories: topicCategories,
                general_tags: generalTags
            })
        }
    }

    // 3. Sort by year descending (newest real-world history to oldest)
    cards.sort((a, b) => b.year - a.year)

    // 4. Group by Century (100-year blocks)
    // E.g. 1923 -> 1900. -400 -> -400
    const centuryGroups = new Map<number, TimelineCardData[]>()

    for (const card of cards) {
        let centuryBlock = Math.floor(card.year / 100) * 100
        if (!centuryGroups.has(centuryBlock)) {
            centuryGroups.set(centuryBlock, [])
        }
        centuryGroups.get(centuryBlock)!.push(card)
    }

    // Sort centuries DESC
    const sortedCenturies = Array.from(centuryGroups.keys()).sort((a, b) => b - a)

    // Helper for century header formatting
    function formatCenturyLabel(startYear: number) {
        if (startYear < 0) return `M.Ö. ${Math.abs(startYear)} - ${Math.abs(startYear) - 99}`
        return `${startYear} - ${startYear + 99}`
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <main className="flex-1 flex justify-center py-6 px-4 md:px-0">
                <div className="w-full max-w-[800px] flex gap-4 md:gap-8">

                    {/* TIMELINE CONTENT LIST */}
                    <div className="flex-1 max-w-[600px] bg-card/40 border border-border/40 rounded-xl overflow-hidden min-h-[500px] p-6 pt-12">
                        <div className="mb-10 text-center">
                            <h1 className="text-3xl font-black mb-2 tracking-tight">Zaman Tüneli</h1>
                            <p className="text-sm text-muted-foreground">İnsanlığın ve tahkiyenin izlerini kronolojik olarak keşfedin.</p>
                        </div>

                        {sortedCenturies.length === 0 ? (
                            <div className="text-center text-muted-foreground italic py-12">
                                Henüz tarih etiketine veya kronolojik bilgiye sahip konu bulunamadı.
                            </div>
                        ) : (
                            <div className="relative border-l-2 border-primary/20 ml-2 md:ml-6 space-y-16 pb-20">
                                {sortedCenturies.map(century => (
                                    <div key={century} className="relative">

                                        {/* Century Header Badge */}
                                        <div className="absolute -left-[54px] md:-left-[64px] top-0 bg-background border-2 border-primary text-primary px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap z-10 shadow-sm flex items-center justify-center min-w-[100px] md:min-w-[120px]">
                                            {formatCenturyLabel(century)}
                                        </div>

                                        <div className="pl-14 md:pl-20 pt-10 space-y-8">
                                            {centuryGroups.get(century)!.map(card => (
                                                <div key={card.topic_id} className="relative group">

                                                    {/* Event Node Dot */}
                                                    <div className="absolute -left-[63px] md:-left-[88px] top-3 w-4 h-4 rounded-full bg-secondary border-2 border-primary/50 group-hover:border-primary transition-colors z-10"></div>

                                                    {/* Card Content */}
                                                    <div className="bg-background border border-border/40 hover:border-border/80 rounded-lg p-5 transition-colors shadow-sm relative overflow-hidden">
                                                        {/* Subtle Background Year Watermark */}
                                                        <div className="absolute -right-4 -bottom-6 text-7xl font-black text-secondary/40 select-none z-0">
                                                            {card.year < 0 ? `MÖ ${Math.abs(card.year)}` : card.year}
                                                        </div>

                                                        <div className="relative z-10">
                                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                                <div className="flex flex-col">
                                                                    <span className="text-xl font-bold bg-primary/10 text-primary px-2 py-0.5 rounded w-max mb-2">
                                                                        {card.year < 0 ? `M.Ö. ${Math.abs(card.year)}` : card.year}
                                                                    </span>
                                                                    <Link
                                                                        href={`/konu/${card.slug}`}
                                                                        target="_blank"
                                                                        className="text-lg font-semibold text-foreground hover:text-primary transition-colors leading-tight mb-2"
                                                                    >
                                                                        {card.title}
                                                                    </Link>

                                                                    {card.categories.length > 0 && (
                                                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                                                            {card.categories.map(c => (
                                                                                <Link
                                                                                    key={c.id}
                                                                                    href={`/category/${c.slug}`}
                                                                                    target="_blank"
                                                                                    className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80 hover:text-foreground transition-colors bg-secondary/30 px-2 py-0.5 rounded border border-border/40 hover:border-border"
                                                                                >
                                                                                    {c.title}
                                                                                </Link>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {card.general_tags.length > 0 && (
                                                                <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-3 border-t border-border/20">
                                                                    {card.general_tags.map(t => (
                                                                        <Link
                                                                            key={t.id}
                                                                            href={`/arama?tag=${t.slug}`}
                                                                            target="_blank"
                                                                            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5"
                                                                        >
                                                                            <Tag className="w-3 h-3 opacity-50" />
                                                                            {t.name}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
