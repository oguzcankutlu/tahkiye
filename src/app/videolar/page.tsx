import { Play } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"

interface VideoWithTopic {
    id: string
    title: string
    video_url: string
    duration: string | null
    thumbnail_url: string | null
    topic: { id: string; title: string } | { id: string; title: string }[] | null
}

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

            {/* Video Grid Yapısı - Masaüstünde 3/4 kolona kadar esneyen Fluid Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => {
                    const topicTitle = Array.isArray(video.topic) ? video.topic[0]?.title : video.topic?.title
                    const topicId = Array.isArray(video.topic) ? video.topic[0]?.id : video.topic?.id

                    return (
                        <div key={video.id} id={`video-${video.id}`} className="group flex flex-col gap-3">
                            <Link href="#" className="block cursor-pointer">
                                {/* Thumbnail Container */}
                                <div className={`w-full aspect-video rounded-xl overflow-hidden ${video.thumbnail_url || 'bg-secondary'} relative border border-border/50 group-hover:border-primary transition-colors shadow-sm`}>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-primary/90 text-primary-foreground p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                            <Play className="h-6 w-6" fill="currentColor" />
                                        </div>
                                    </div>
                                    {video.duration && (
                                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded-md">
                                            {video.duration}
                                        </div>
                                    )}
                                </div>
                                {/* Video Info */}
                                <div className="mt-3 flex gap-3">
                                    <div className="w-9 h-9 shrink-0 rounded-full bg-secondary overflow-hidden border border-border flex items-center justify-center font-bold text-muted-foreground text-xs mt-0.5">
                                        T
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-base font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                            {video.title}
                                        </h3>
                                        <span className="text-xs text-muted-foreground/80 mt-1">Tahkiye Medya • 1.2 B Görüntülenme</span>
                                    </div>
                                </div>
                            </Link>

                            <div className="mt-auto pl-12">
                                <Link href={`/topic/${topicId}`} className="inline-flex items-center text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors line-clamp-1 w-max max-w-full">
                                    {topicTitle}
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Pagination / Daha Fazla Yükle */}
            <div className="mt-12 flex justify-center">
                <button className="px-6 py-2.5 rounded-full border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary transition-colors focus:ring-2 focus:ring-primary focus:outline-none">
                    Daha Fazla Video Yükle
                </button>
            </div>
        </div>
    )
}
