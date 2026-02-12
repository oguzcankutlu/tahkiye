import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
            <h1 className="text-6xl font-black text-primary">404</h1>
            <h2 className="text-2xl font-bold">Sayfa Bulunamadı</h2>
            <p className="text-muted-foreground max-w-md">
                Aradığınız konu silinmiş, taşınmış veya hiç var olmamış olabilir.
            </p>
            <Link href="/">
                <Button className="font-bold mt-4">Anasayfaya Dön</Button>
            </Link>
        </div>
    )
}
