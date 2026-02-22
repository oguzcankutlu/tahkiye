"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { submitArticle } from "./actions"

interface Topic {
    id: string
    title: string
}

export function ArticleForm({ topics }: { topics: Topic[] }) {
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        setError(null)
        startTransition(async () => {
            const result = await submitArticle(null, formData)
            if (result?.error) setError(result.error)
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 rounded-md bg-destructive/15 text-destructive font-medium border border-destructive/30">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-muted-foreground mb-1.5">
                    Makale Başlığı
                </label>
                <input
                    id="title"
                    name="title"
                    className="w-full flex h-12 rounded-md border border-input bg-background/50 px-4 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="İlgi çekici bir başlık girin..."
                    required
                />
            </div>

            <div>
                <label htmlFor="topic_id" className="block text-sm font-medium text-muted-foreground mb-1.5">
                    Konu
                </label>
                <select
                    id="topic_id"
                    name="topic_id"
                    defaultValue=""
                    className="w-full flex h-11 rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                >
                    <option value="" disabled>Kategori / Konu Seçiniz</option>
                    {topics.map(t => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                </select>
                <p className="text-xs text-muted-foreground mt-2">
                    Makaleniz seçtiğiniz bu ana konu başlığı altında sergilenecektir.
                </p>
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-muted-foreground mb-1.5">
                    Girdi Metni
                </label>
                <textarea
                    id="content"
                    name="content"
                    className="w-full flex min-h-[400px] rounded-md border border-input bg-background/50 px-4 py-3 text-base leading-relaxed ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                    placeholder="Düşüncelerinizi buraya özgürce, dilediğiniz uzunlukta yazın..."
                    required
                />
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-2 h-11 text-base font-semibold"
                >
                    {isPending ? "Yayınlanıyor..." : "Yayınla"}
                </Button>
            </div>
        </form>
    )
}
