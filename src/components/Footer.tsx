import Link from "next/link"

export function Footer() {
    return (
        <footer className="w-full border-t border-border/40 py-6 mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <span>
                    © 2026{' '}
                    <a href="https://www.brandcore.tr" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium">
                        BrandCore
                    </a>
                </span>
                <div className="flex items-center gap-4">
                    <Link href="/zaman-tuneli" className="hover:text-primary transition-colors">
                        Zaman Tüneli
                    </Link>
                    <Link href="/etiketler" className="hover:text-primary transition-colors">
                        Etiketler
                    </Link>
                    <Link href="/videolar" className="hover:text-primary transition-colors">
                        Videolar
                    </Link>
                    <Link href="/hakkimizda" className="hover:text-primary transition-colors">
                        Hakkımızda
                    </Link>
                    <Link href="/gizlilik" className="hover:text-primary transition-colors">
                        Gizlilik Politikası
                    </Link>
                </div>
            </div>
        </footer>
    )
}
