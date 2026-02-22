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
            topic:topics ( id, title )
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
            {/* Header Bölümü */}
            <div className="mb-8 border-b border-border/40 pb-6">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                    Video Kütüphanesi
                </h1>
                <p className="text-muted-foreground mt-2 text-sm max-w-2xl">
                    Varoluşsal sorgulamalar, minimalist yaşam pratikleri ve modernite eleştirileri üzerine hazırlanmış derinlemesine analiz videoları.
                </p>
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
