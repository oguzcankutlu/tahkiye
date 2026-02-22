import { createClient } from "@/utils/supabase/server"
import { VideoGrid, VideoWithTopic } from "./VideoGrid"
import Link from "next/link"

export const revalidate = 0 // Force dynamic rendering so new videos appear immediately

export default async function VideolarPage() {
    const supabase = await createClient()

    // Fetch all videos from Supabase
    const { data: rawVideos, error } = await supabase
        .from('videos')
        .select(`
            id, title, video_url, duration, thumbnail_url,
            topic:topics ( id, title, slug )
        `)
        .order('created_at', { ascending: false })

    const videos = (rawVideos || []) as VideoWithTopic[]

    if (error) {
        return (
            <div className="flex-1 p-6 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg mt-6 bg-secondary/10">
                Videolar yüklenirken bir hata oluştu.
            </div>
        )
    }

    if (!videos || videos.length === 0) {
        return (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg mt-6 bg-secondary/10">
                <p>Henüz bu platforma video yüklenmemiş.</p>
                <Link href="/" className="mt-4 text-primary font-medium hover:underline">Ana Sayfaya Dön</Link>
            </div>
        )
    }

    return (
        <div className="flex-1 pt-6 pb-20 w-full">
            {/* Premium Header Bölümü */}
            <div className="relative mb-12 rounded-2xl overflow-hidden bg-gradient-to-br from-secondary/50 via-background to-background border border-border/50 p-8 sm:p-12 shadow-sm">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <svg className="w-64 h-64 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4 border border-primary/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Tahkiye Video Kütüphanesi
                    </div>
                </div>
            </div>

            {/* Client-side Video Grid Yapısı */}
            <VideoGrid videos={videos} />

            {/* Pagination / Daha Fazla Yükle */}
            <div className="mt-12 flex justify-center">
                <button className="px-6 py-2.5 rounded-full border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary transition-colors focus:ring-2 focus:ring-primary focus:outline-none">
                    Daha Fazla Video Yükle
                </button>
            </div>
        </div>
    )
}
