import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ArticleForm } from "./ArticleForm"

export default async function YazPage({ searchParams }: { searchParams: Promise<{ topic_id?: string }> }) {
    const supabase = await createClient()
    const params = await searchParams

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect('/login')

    const { data: topics } = await supabase
        .from('topics')
        .select('id, title')
        .order('title', { ascending: true })

    const { data: videos } = await supabase
        .from('videos')
        .select('id, title')
        .order('title', { ascending: true })

    return (
        <div className="w-full pb-20">
            <div className="mb-8 border-b border-border/40 pb-6">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                    Yeni Girdi Yaz
                </h1>
                <p className="mt-2 text-muted-foreground text-sm max-w-2xl">
                    Düşüncelerinizi paylaşın. Sistem yazınızı analiz edip, otomatik olarak okuma süresi atayacaktır.
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                <ArticleForm topics={topics || []} videos={videos || []} preselectedTopicId={params.topic_id} />
            </div>
        </div>
    )
}
