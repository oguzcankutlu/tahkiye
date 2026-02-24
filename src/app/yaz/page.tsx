import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ArticleForm } from "./ArticleForm"
import { EditGirdiForm } from "./EditGirdiForm"

export default async function YazPage({ searchParams }: { searchParams: Promise<{ topic_id?: string; edit_id?: string }> }) {
    const supabase = await createClient()
    const params = await searchParams

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect('/login')

    // Edit mode: Fetch the existing article
    if (params.edit_id) {
        const { data: article, error } = await supabase
            .from('articles')
            .select(`
                id, title, content, related_links, related_videos,
                topic:topics ( id, title )
            `)
            .eq('id', params.edit_id)
            .single()

        if (error || !article) redirect('/yaz')

        // Auth check: only the author can edit
        const { data: ownerCheck } = await supabase
            .from('articles')
            .select('author_id')
            .eq('id', params.edit_id)
            .single()

        if (!ownerCheck || ownerCheck.author_id !== user.id) redirect('/')

        return (
            <div className="w-full pb-20">
                <div className="mb-8 border-b border-border/40 pb-6">
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                        Girdiyi Düzenle
                    </h1>
                    <p className="mt-2 text-muted-foreground text-sm max-w-2xl">
                        Mevcut girdinizi düzenleyin ve kaydedin.
                    </p>
                </div>
                <div className="max-w-4xl mx-auto">
                    <EditGirdiForm article={article as any} />
                </div>
            </div>
        )
    }

    // Create mode
    const { data: categories } = await supabase
        .from('categories')
        .select('id, title')
        .order('title', { ascending: true })

    const { data: topics } = await supabase
        .from('topics')
        .select('id, title')
        .order('title', { ascending: true })

    return (
        <div className="w-full pb-20">
            <div className="mb-8 border-b border-border/40 pb-6">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                    Yeni Konu Aç
                </h1>
                <p className="mt-2 text-muted-foreground text-sm max-w-2xl">
                    Yeni bir başlık açın veya mevcut bir konuya girdi girin. Videolarınız otomatik olarak video sayfamıza da eklenecektir.
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                <ArticleForm
                    topics={topics || []}
                    categories={categories || []}
                    preselectedTopicId={params.topic_id}
                />
            </div>
        </div>
    )
}
