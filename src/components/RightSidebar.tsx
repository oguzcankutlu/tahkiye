"use client"

import { Play } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

interface Video {
    id: string
    title: string
    video_url: string
    duration: string | null
    thumbnail_url: string | null
    topic: {
        id: string
        title: string
    } | {
        id: string
        title: string
    }[]
}

export function RightSidebar() {
    const [videos, setVideos] = useState<Video[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchVideos = async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('videos')
                .select(`
                    id, title, video_url, duration, thumbnail_url,
                    topic:topics ( id, title )
                `)
                .order('created_at', { ascending: false })
                .limit(5)

            if (data && !error) {
                setVideos(data)
            }
            setIsLoading(false)
        }

        fetchVideos()
    }, [])

    return (
        <div className="flex flex-col h-full shrink-0">

            <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="font-bold text-foreground">Videolar</h2>
                <Link
                    href="/videolar"
                    className="text-xs font-semibold text-primary hover:text-primary/80 hover:underline transition-colors block"
                >
                    Tümünü Gör →
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-2 space-y-5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {isLoading ? (
                    <div className="text-sm text-muted-foreground animate-pulse text-center mt-10">
                        Videolar yükleniyor...
                    </div>
                ) : videos.length === 0 ? (
                    <div className="text-sm text-muted-foreground text-center mt-10 border border-dashed border-border p-4 rounded-md bg-secondary/20">
                        Henüz video eklenmemiş.
                    </div>
                ) : videos.map((video) => (
                    <div key={video.id} className="group flex flex-col gap-2">
                        <Link href={`/videolar#video-${video.id}`} className="block cursor-pointer">
                            <div className={`w-full aspect-video rounded-md overflow-hidden ${video.thumbnail_url || 'bg-secondary'} relative border border-border/50 group-hover:border-primary/50 transition-colors`}>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Play className="h-8 w-8 text-white drop-shadow-md" fill="currentColor" />
                                </div>
                                {video.duration && (
                                    <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                                        {video.duration}
                                    </div>
                                )}
                            </div>
                            <h3 className="mt-2 text-sm font-medium text-foreground/90 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                {video.title}
                            </h3>
                        </Link>

                        <div className="mt-auto">
                            <Link href={`/topic/${Array.isArray(video.topic) ? video.topic[0]?.id : video.topic?.id}`} className="text-xs font-medium text-primary hover:underline line-clamp-1">
                                Konu: {Array.isArray(video.topic) ? video.topic[0]?.title : video.topic?.title}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-border/40 flex items-center justify-center gap-1 mt-auto">
                <button className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <button className="h-8 w-8 rounded text-sm font-medium bg-primary text-primary-foreground">
                    1
                </button>
                <button className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
                </button>
            </div>

        </div>
    )
}
