"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, Star } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { TopicList } from "@/components/topics/topic-list"
import { type User as SupabaseUser } from "@supabase/supabase-js"

interface HeaderProps {
    user: SupabaseUser | null
}

export function Header({ user }: HeaderProps) {
    const { setTheme, theme } = useTheme()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm border-primary/20">
            <div className="container h-16 flex items-center justify-between px-4 max-w-7xl mx-auto">

                {/* Mobile Menu & Logo */}
                <div className="flex items-center gap-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <button className="md:hidden p-1 text-muted-foreground hover:text-primary transition-colors">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Menüyü Aç</span>
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[80vw] sm:w-[350px] p-0 flex flex-col">
                            <div className="p-4 border-b bg-background sticky top-0 z-10 flex justify-between items-center">
                                <span className="font-bold text-xl tracking-tight text-primary flex items-center gap-1">
                                    Tahkiye.tr <Star className="h-5 w-5 fill-primary" />
                                </span>
                            </div>
                            <div className="p-4 flex-1 overflow-y-auto">
                                <TopicList className="flex" />
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="font-black text-2xl tracking-tighter text-foreground group-hover:text-primary transition-colors">
                            Tahkiye.tr
                        </span>
                        <Star className="h-6 w-6 text-primary fill-primary transform group-hover:rotate-45 transition-transform duration-300" />
                    </Link>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary rounded-full"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Tema değiştir</span>
                    </Button>

                    <Link href="/login">
                        <Button variant="ghost" className="font-semibold text-foreground/80 hover:text-foreground">
                            Giriş Yap
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button className="font-bold bg-primary text-primary-foreground hover:bg-primary/90 px-6">
                            Kayıt Ol
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
