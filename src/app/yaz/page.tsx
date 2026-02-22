import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ArticleForm } from "./ArticleForm"

export default async function YazPage() {
    const supabase = await createClient()

    // 1. Check if user is logged in
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        // Redirect to login if not authenticated
        redirect('/login')
    }

    // 2. Fetch accessible topics for the dropdown
    const { data: topics } = await supabase
        .from('topics')
        .select('id, title')
        .order('title', { ascending: true })

    return (
        <div className="w-full pb-20">
            <div className="mb-8 border-b border-border/40 pb-6">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                    Yeni Makale Yaz
                </h1>
                <p className="mt-2 text-muted-foreground text-sm max-w-2xl">
                    Düşüncelerinizi paylaşın. Sistem yazınızı analiz edip, otomatik olarak okuma süresi atayacaktır.
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                <ArticleForm topics={topics || []} />
            </div>
        </div>
    )
}
