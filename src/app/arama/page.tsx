import { createClient } from "@/utils/supabase/server"
import SearchClient from "./SearchClient"

export default async function AramaPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParams
    const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : ''
    const tagQuery = typeof resolvedParams.tag === 'string' ? resolvedParams.tag : ''

    const supabase = await createClient()

    // Arama Sorgusu
    let searchResults: any[] = []

    let tagLabel = ""

    if (tagQuery) {
        // Tag query active: find topics with this tag slug via topic_tags -> tags, then fetch their articles
        const { data: tagRef } = await supabase.from('tags').select('id, name').eq('slug', tagQuery).single()
        if (tagRef) {
            tagLabel = tagRef.name
            const { data: pivot } = await supabase.from('topic_tags').select('topic_id').eq('tag_id', tagRef.id)
            if (pivot && pivot.length > 0) {
                const topicIds = pivot.map(p => p.topic_id)
                const { data } = await supabase
                    .from('articles')
                    .select(`
                        id, title, content, upvotes, downvotes,
                        topic:topics ( id, title, slug ),
                        author:profiles ( full_name, username )
                    `)
                    .in('topic_id', topicIds)
                    .order('created_at', { ascending: false })
                    .limit(20)

                searchResults = data || []
            }
        }
    } else if (query.trim()) {
        const { data } = await supabase
            .from('articles')
            .select(`
                id, title, content, upvotes, downvotes,
                topic:topics ( id, title, slug ),
                author:profiles ( full_name, username )
            `)
            .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
            .order('created_at', { ascending: false })
            .limit(20)

        searchResults = data || []
    }

    const { data: { user } } = await supabase.auth.getUser()

    return <SearchClient searchResults={searchResults} query={query} tagLabel={tagLabel} currentUserId={user?.id} />
}
