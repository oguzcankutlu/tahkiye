"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

interface Ad {
    id: string
    title: string
    image_url: string | null
    link_url: string | null
    position: string
    is_active: boolean
}

export function AdSection({ position, className = "" }: { position: string; className?: string }) {
    const [ad, setAd] = useState<Ad | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAd = async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('ads')
                .select('*')
                .eq('position', position)
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            if (data && !error) {
                setAd(data)
            }
            setLoading(false)
        }
        fetchAd()
    }, [position])

    if (loading) return null
    if (!ad) {
        return (
            <div className={`w-full ${className}`}>
                <div className="w-full h-24 bg-secondary/30 rounded-lg border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
                    Reklam Alanı ({position === 'top' ? 'Üst' : position === 'bottom' ? 'Alt' : position})
                </div>
            </div>
        )
    }

    return (
        <div className={`w-full ${className}`}>
            <a
                href={ad.link_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full overflow-hidden rounded-lg border border-border/40 hover:border-primary/30 transition-all opacity-90 hover:opacity-100 shadow-sm"
            >
                {ad.image_url ? (
                    <div className="w-full bg-secondary/5 flex items-center justify-center">
                        <img
                            src={ad.image_url}
                            alt={ad.title}
                            className="w-full h-auto max-h-[250px] object-contain"
                        />
                    </div>
                ) : (
                    <div className="w-full h-16 bg-secondary/30 flex items-center justify-center text-xs text-muted-foreground font-medium italic">
                        {ad.title}
                    </div>
                )}
            </a>
            <div className="mt-1 flex justify-end">
                <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Sponsorlu</span>
            </div>
        </div>
    )
}
