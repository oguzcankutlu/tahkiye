import Link from "next/link"
import { ThemeToggle } from "./ThemeToggle"
import { Menu, PlaySquare, Search, Plus } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserMenu } from "./UserMenu"

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/arama?q=${encodeURIComponent(searchQuery.trim())}`)
            setIsSearchOpen(false)
            setSearchQuery("")
        }
    }
    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="w-full h-16 flex items-center justify-between px-2 sm:px-4">
                    <div className="flex items-center gap-1 sm:gap-4">
                        <button
                            className="xl:hidden p-2 -ml-2 text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                            onClick={onMenuClick}
                            aria-label="Open Menu"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        <Link href="/" className="flex items-center group">
                            <div className="border-2 border-primary bg-black px-3 py-1 rounded-sm transition-opacity group-hover:opacity-80">
                                <span className="font-bold text-lg tracking-tight text-white lowercase">tahkiye</span>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-3">
                        <Link
                            href="/yaz"
                            className="p-2 text-muted-foreground md:bg-primary/10 md:text-primary md:hover:bg-primary/20 hover:text-primary hover:bg-secondary/80 rounded-md transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
                            aria-label="Yeni Konu Aç"
                            title="Yeni Konu Aç"
                        >
                            <Plus className="h-5 w-5" />
                        </Link>

                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className={`p-2 rounded-md transition-colors flex items-center justify-center min-w-[44px] min-h-[44px] ${isSearchOpen ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'}`}
                            aria-label="Arama"
                        >
                            <Search className="h-5 w-5" />
                        </button>

                        <Link
                            href="/videolar"
                            className="flex flex-col sm:flex-row p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-md transition-colors items-center justify-center min-w-[44px] min-h-[44px]"
                            aria-label="Videolar"
                        >
                            <PlaySquare className="h-5 w-5" />
                        </Link>


                        <div className="h-6 w-px bg-border/50 mx-1 hidden sm:block" />

                        <UserMenu />
                    </div>
                </div>
            </header>

            {/* Arama Çubuğu */}
            {isSearchOpen && (
                <div className="absolute top-16 left-0 w-full bg-background border-b border-border/40 p-4 shadow-lg z-40 animate-in slide-in-from-top-2">
                    <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                autoFocus
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Konu, girdi veya yazar ara..."
                                className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-transparent text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                            />
                        </div>
                        <button
                            type="submit"
                            className="h-10 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                            Ara
                        </button>
                    </form>
                </div>
            )}
        </>
    )
}
