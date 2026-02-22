"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { User, Settings, LogOut, ChevronDown, ShieldCheck } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

interface Profile {
    username: string
    full_name: string | null
    avatar_url: string | null
}

export function UserMenu() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('username, full_name, avatar_url')
                    .eq('id', user.id)
                    .single()
                setProfile(data)
            }
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    async function handleLogout() {
        const supabase = createClient()
        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    if (loading) {
        return <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
    }

    if (!profile) {
        return (
            <Link
                href="/login"
                className="p-2 text-primary hover:text-primary/80 hover:bg-secondary/40 rounded-md transition-colors flex items-center justify-center"
                aria-label="Giriş Yap"
            >
                <User className="h-5 w-5" />
            </Link>
        )
    }

    const initial = (profile.full_name || profile.username || '?').charAt(0).toUpperCase()

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-secondary/60 transition-colors"
                aria-label="Kullanıcı Menüsü"
            >
                {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={initial} className="w-7 h-7 rounded-full object-cover border border-border" />
                ) : (
                    <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold border border-primary/30">
                        {initial}
                    </div>
                )}
                <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 origin-top-right">
                    <div className="px-4 py-3 border-b border-border/60">
                        <p className="text-sm font-semibold text-foreground truncate">{profile.full_name || profile.username}</p>
                        <p className="text-xs text-muted-foreground truncate">@{profile.username}</p>
                    </div>
                    <div className="p-1">
                        <Link
                            href={`/profile/${profile.username}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-secondary/60 transition-colors"
                        >
                            <User className="h-4 w-4 text-muted-foreground" />
                            Profilim
                        </Link>
                        <Link
                            href="/yaz"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-secondary/60 transition-colors"
                        >
                            <span className="h-4 w-4 text-muted-foreground text-base leading-none font-bold">✍</span>
                            Yeni Makale
                        </Link>
                        <Link
                            href="/ayarlar"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-secondary/60 transition-colors"
                        >
                            <Settings className="h-4 w-4 text-muted-foreground" />
                            Ayarlar
                        </Link>
                        <Link
                            href="/admin"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-secondary/60 transition-colors"
                        >
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                            Yönetici Paneli
                        </Link>
                    </div>
                    <div className="p-1 border-t border-border/60">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Çıkış Yap
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
