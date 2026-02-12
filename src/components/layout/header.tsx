"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, Search, User, MessageSquare, Bell } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { TopicList } from "@/components/topics/topic-list"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type User as SupabaseUser } from "@supabase/supabase-js"
import { logout } from "@/app/auth/actions/auth-actions"

interface HeaderProps {
    user: SupabaseUser | null
}

export function Header({ user }: HeaderProps) {
    const { setTheme, theme } = useTheme()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm border-primary/20">
            <div className="container h-14 flex items-center justify-between px-4 max-w-7xl mx-auto">

                {/* Mobile Menu & Logo */}
                <div className="flex items-center gap-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <button className="md:hidden p-1 text-muted-foreground hover:text-primary transition-colors">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Menüyü Aç</span>
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[80vw] sm:w-[350px] p-0 flex flex-col">
                            <div className="p-4 border-b bg-background sticky top-0 z-10 flex justify-between items-center">
                                <span className="font-bold text-xl tracking-tight text-primary bg-primary/10 px-2 py-1 rounded">tahkiye</span>
                            </div>
                            <div className="p-4 flex-1 overflow-y-auto">
                                <TopicList className="flex" />
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="flex items-center">
                        {/* Logo with Yellow Theme */}
                        <div className="bg-primary text-black font-black text-2xl tracking-tighter px-2 py-0.5 rounded-sm transform -rotate-2 hover:rotate-0 transition-transform duration-200">
                            tahkiye
                        </div>
                    </Link>
                </div>

                {/* Search Bar (Centered) */}
                <div className="hidden md:flex flex-1 max-w-xl mx-8">
                    <div className="relative w-full group">
                        <input
                            type="text"
                            placeholder="konu, #girdi, @yazar"
                            className="w-full h-10 rounded-md border-2 border-input bg-secondary/30 px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus:border-primary focus:ring-0 placeholder:text-muted-foreground"
                        />
                        <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-primary">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-1 md:gap-3">

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>

                    {user ? (
                        <>
                            <Link href="/messages">
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hidden md:flex" title="Mesajlar">
                                    <MessageSquare className="h-5 w-5" />
                                </Button>
                            </Link>

                            {/* Notifications Popover */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary relative" title="Bildirimler">
                                        <Bell className="h-5 w-5" />
                                        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background animate-pulse" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-0" align="end">
                                    <div className="p-4 border-b font-semibold flex justify-between items-center bg-muted/20">
                                        <span>Bildirimler</span>
                                        <span className="text-xs text-primary cursor-pointer hover:underline">Tümünü Oku</span>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="p-3 border-b last:border-0 hover:bg-muted/50 cursor-pointer flex gap-3 items-start transition-colors">
                                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-0.5">
                                                    <Bell className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm">
                                                        <Link href={`/profile/kullanici_${i}`} className="font-bold hover:underline">
                                                            kullanici_{i}
                                                        </Link>
                                                        <span> girdini favoriledi.</span>
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">2 dakika önce</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <Link href={`/profile/${user.user_metadata.username || 'user'}`}>
                                <Button variant="ghost" size="icon">
                                    <User className="h-5 w-5" />
                                </Button>
                            </Link>

                            <form action={logout}>
                                <Button variant="ghost" size="sm" className="hidden md:flex font-bold hover:bg-destructive/10 hover:text-destructive">
                                    çıkış
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="hidden md:flex font-bold">
                                    giriş
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className="hidden md:flex font-bold bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4">
                                    kayıt ol
                                </Button>
                            </Link>
                        </>
                    )}

                    <Link href="/profile/antigravity" className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
