'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground space-y-4">
                    <h2 className="text-2xl font-bold text-primary">Bir şeyler yanlış gitti!</h2>
                    <p className="text-muted-foreground">Global bir hata oluştu.</p>
                    <button
                        className="px-4 py-2 bg-primary text-black font-bold rounded hover:bg-primary/90"
                        onClick={() => reset()}
                    >
                        Tekrar Dene
                    </button>
                </div>
            </body>
        </html>
    )
}
