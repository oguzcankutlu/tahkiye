import { createClient } from "@/utils/supabase/server"
import SearchClient from "./SearchClient"

export default async function AramaPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParams
    const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : ''

    const supabase = await createClient()

    // Arama Sorgusu
    let searchResults: any[] = []

    if (query.trim()) {
        const { data } = await supabase
            .from('articles')
            .select(`
                id, title, content, upvotes, downvotes,
                topic:topics ( id, title, slug ),
                author:profiles ( full_name, username )
            `)
            .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
            .limit(10)

        searchResults = data || []
    }

    const { data: { user } } = await supabase.auth.getUser()

    return <SearchClient searchResults={searchResults} query={query} currentUserId={user?.id} />
}
