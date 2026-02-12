'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <h2 className="text-2xl font-bold text-destructive">Bir şeyler ters gitti!</h2>
            <p className="text-muted-foreground text-sm max-w-md text-center">
                Uygulama çalışırken beklenmedik bir hata oluştu. Lütfen tekrar deneyin.
            </p>
            <div className="flex gap-4">
                <Button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                >
                    Tekrar Dene
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                    Anasayfa
                </Button>
            </div>
        </div>
    )
}
