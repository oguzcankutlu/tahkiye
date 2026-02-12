"use client"

import Link from "next/link"
import { Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer() {
    return (
        <footer className="w-full border-t py-6 md:py-8 mt-auto bg-background">
            <div className="container px-4 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">

                {/* Left Side: Copyright */}
                <div className="text-sm text-muted-foreground text-center md:text-left">
                    &copy; {new Date().getFullYear()} Tahkiye Sözlük. Tüm hakları saklıdır.
                </div>

                {/* Right Side: Links & Socials */}
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                    <Link href="/agreements" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                        Kullanıcı Sözleşmesi
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <Twitter className="h-4 w-4" />
                            <span className="sr-only">Twitter</span>
                        </Link>
                        <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <Linkedin className="h-4 w-4" />
                            <span className="sr-only">LinkedIn</span>
                        </Link>
                        <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <Instagram className="h-4 w-4" />
                            <span className="sr-only">Instagram</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
