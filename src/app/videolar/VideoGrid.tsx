"use client"

import { Play } from "lucide-react"
import Link from "next/link"
import { useVideo } from "@/components/VideoProvider"
import { getYouTubeId } from "@/lib/utils"

export interface VideoWithTopic {
    id: string
    title: string
    video_url: string
    duration: string | null
    thumbnail_url: string | null
    topic: { id: string; title: string, slug: string } | { id: string; title: string, slug: string }[] | null
}

export function VideoGrid({ videos }: { videos: VideoWithTopic[] }) {
    const { playVideo } = useVideo()

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => {
                const topicTitle = Array.isArray(video.topic) ? video.topic[0]?.title : video.topic?.title
                const topicSlug = Array.isArray(video.topic) ? video.topic[0]?.slug : video.topic?.slug

                return (
                    <div key={video.id} id={`video-${video.id}`} className="group flex flex-col gap-3">
                        <button type="button" onClick={() => playVideo(video.video_url, video.title)} className="block cursor-pointer text-left w-full">
                            {/* Thumbnail Container */}
                            <div className={`w-full aspect-video rounded-xl overflow-hidden ${video.thumbnail_url || 'bg-secondary'} relative border border-border/50 group-hover:border-primary transition-colors shadow-sm`}>
                                {getYouTubeId(video.video_url) ? (
                                    <img
                                        src={`https://img.youtube.com/vi/${getYouTubeId(video.video_url)}/mqdefault.jpg`}
                                        alt={video.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                ) : video.thumbnail_url ? (
                                    <img src={video.thumbnail_url} alt={video.title} className="absolute inset-0 w-full h-full object-cover" />
                                ) : null}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10">
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
                            <div className="mt-3">
                                <h3 className="text-base font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                    {video.title}
                                </h3>
                                <div className="text-xs text-muted-foreground/80 mt-1">Tahkiye Medya</div>
                            </div>
                        </button>

                        <div className="mt-auto">
                            {topicSlug ? (
                                <Link href={`/konu/${topicSlug}`} className="inline-flex items-center text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors line-clamp-1 w-max max-w-full">
                                    {topicTitle}
                                </Link>
                            ) : (
                                <span className="inline-flex items-center text-xs font-semibold text-primary/60 bg-primary/5 px-2 py-0.5 rounded-md line-clamp-1 w-max max-w-full">
                                    Girdi Videosu
                                </span>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
