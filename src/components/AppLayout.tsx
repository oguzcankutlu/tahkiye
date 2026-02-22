"use client"

import * as React from "react"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import { X } from "lucide-react"

import { Footer } from "./Footer"

import { RightSidebar } from "./RightSidebar"
import { usePathname } from "next/navigation"

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    // Ekran boyutu değiştiğinde veya menü tıklandığında kaydırmayı engelleme
    React.useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [isMobileMenuOpen])

    // Admin sayfaları için özel izolasyon (ana layoutu atla)
    if (pathname?.startsWith('/admin')) {
        return <div className="flex flex-col flex-1 w-full">{children}</div>
    }

    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-1 min-h-screen">
            <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm xl:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <div
                        className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-background shadow-xl flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-border/40">
                            <span className="font-bold text-lg">Menü</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-md transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto pb-6">
                            <Sidebar className="w-full border-r-0 h-auto" />
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1 w-full flex gap-6 py-6">
                {/* Sol Sütun (w-1/4 veya max-w-xs) */}
                <aside className="hidden xl:block w-1/4 max-w-xs shrink-0">
                    <div className="sticky top-24 h-[calc(100vh-8rem)]">
                        <Sidebar />
                    </div>
                </aside>

                {/* Orta Sütun (w-2/4 veya flex-1) */}
                <div className="flex-1 min-w-0">
                    {children}
                </div>

                {/* Sağ Sütun (w-1/4 veya max-w-xs) - Video Listesi */}
                <aside className="hidden xl:block w-1/4 max-w-xs shrink-0">
                    <div className="sticky top-24 h-[calc(100vh-8rem)]">
                        <RightSidebar />
                    </div>
                </aside>
            </main>

            <Footer />
        </div>
    )
}
