"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import ReactPlayer from "react-player"
// @ts-ignore
import { X, Loader2 } from "lucide-react"

const Player = ReactPlayer as any;

interface VideoContextType {
    playVideo: (url: string, title?: string) => void
    closeVideo: () => void
    isOpen: boolean
    currentVideoUrl: string | null
    currentVideoTitle: string | null
}

const VideoContext = createContext<VideoContextType | undefined>(undefined)

export function useVideo() {
    const context = useContext(VideoContext)
    if (!context) {
        throw new Error("useVideo must be used within a VideoProvider")
    }
    return context
}

export function VideoProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null)
    const [currentVideoTitle, setCurrentVideoTitle] = useState<string | null>(null)

    // Handle escape key to close modal
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeVideo()
        }
        if (isOpen) window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen])

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    const playVideo = (url: string, title?: string) => {
        setCurrentVideoUrl(url)
        setCurrentVideoTitle(title || "Video Oynatıcı")
        setIsOpen(true)
    }

    const closeVideo = () => {
        setIsOpen(false)
        // Delay clearing URL so modal exit animation plays correctly without snapping
        setTimeout(() => {
            setCurrentVideoUrl(null)
            setCurrentVideoTitle(null)
        }, 300)
    }

    return (
        <VideoContext.Provider value={{ playVideo, closeVideo, isOpen, currentVideoUrl, currentVideoTitle }}>
            {children}

            {/* Global Video Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                        onClick={closeVideo}
                    />

                    {/* Modal Content */}
                    <div className="relative z-10 w-full max-w-5xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-secondary/30">
                            <h3 className="font-semibold text-foreground line-clamp-1">{currentVideoTitle}</h3>
                            <button
                                onClick={closeVideo}
                                className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Video Container - 16:9 Aspect Ratio */}
                        <div className="relative w-full pb-[56.25%] bg-black">
                            <div className="absolute inset-0 flex items-center justify-center">
                                {currentVideoUrl && (
                                    <Player
                                        url={currentVideoUrl}
                                        width="100%"
                                        height="100%"
                                        controls
                                        playing={isOpen}
                                        className="absolute top-0 left-0"
                                        fallback={<div className="text-white animate-pulse">Yükleniyor...</div>}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </VideoContext.Provider>
    )
}
