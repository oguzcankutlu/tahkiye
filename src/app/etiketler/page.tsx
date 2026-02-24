import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Tag as TagIcon, Hash } from "lucide-react"

export const dynamic = 'force-dynamic'

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

type TagDisplayData = {
    id: string
    name: string
    slug: string
    count: number
}

export default async function EtiketlerPage() {
    const supabase = await createClient()

    // 1. Verileri Çek: Tüm konu-etiket ilişkilerini ve bağlı oldukları etiketleri al
    const { data: topicTagsRes, error } = await supabase
        .from('topic_tags')
        .select(`
            topic_id,
            tag_id,
            tags (id, name, type, slug)
        `)

    if (error) {
        console.error("Etiketler sayfasında hata:", error.message)
        return (
            <div className="flex flex-col min-h-screen bg-background text-foreground py-12 px-4 items-center">
                <p className="text-destructive">Etiket verileri yüklenirken bir hata oluştu.</p>
            </div>
        )
    }

    // Supabase'den gelen veriyi güvenli tiple
    const relations = (topicTagsRes || []) as unknown as { topic_id: string, tags: SupabaseTag }[]

    // Sadece "general" (genel konu) etiketlerini filtrele
    const generalRelations = relations.filter(r => r.tags?.type === 'general')

    // 2. Etiket Kullanım Sayılarını Hesapla
    const tagMap = new Map<string, TagDisplayData>()

    for (const rel of generalRelations) {
        const t = rel.tags
        if (!tagMap.has(t.id)) {
            tagMap.set(t.id, {
                id: t.id,
                name: t.name,
                slug: t.slug,
                count: 0
            })
        }
        tagMap.get(t.id)!.count += 1
    }

    // Haritayı diziye çevir
    const tagsArray = Array.from(tagMap.values())

    // 3. Sıralama: Kullanım sayısına göre büyükten küçüğe (DESC), eşitse isme göre
    tagsArray.sort((a, b) => {
        if (b.count !== a.count) {
            return b.count - a.count
        }
        return a.name.localeCompare(b.name, 'tr')
    })

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <main className="flex-1 flex justify-center py-6 px-4 md:px-0">
                <div className="w-full max-w-[800px] flex flex-col gap-6">

                    {/* HEADINGS */}
                    <div className="bg-card/40 border border-border/40 rounded-xl p-6 md:p-10 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <Hash className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-black mb-3 tracking-tight">Etiketler Dizini</h1>
                        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                            Tahkiye platformundaki kavramsal yoğunluğun haritası. Etiketler, konular içerisindeki geçme sıklığına göre çoktan aza doğru listelenmiştir.
                        </p>
                    </div>

                    {/* CONTENT/TAGS CLOUD */}
                    <div className="bg-card/20 border border-border/20 rounded-xl p-6 md:p-10 min-h-[400px]">
                        {tagsArray.length === 0 ? (
                            <div className="text-center text-muted-foreground italic py-12">
                                Sistemde henüz genel konu etiketi bulunamadı.
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-x-4 gap-y-5 justify-center md:justify-start">
                                {tagsArray.map(tag => (
                                    <Link
                                        key={tag.id}
                                        href={`/arama?tag=${tag.slug}`}
                                        target="_blank"
                                        className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-base font-medium text-muted-foreground border-b-2 border-transparent hover:border-primary hover:text-foreground transition-all duration-200"
                                    >
                                        <Hash className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:text-primary transition-opacity" />
                                        <span>{tag.name}</span>
                                        <span className="text-xs font-semibold text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded ml-0.5">
                                            {tag.count}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    )
}
