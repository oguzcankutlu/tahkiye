"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { updateArticle } from "@/app/yaz/actions"
import { Button } from "./ui/button"
import { Pencil, X, Check } from "lucide-react"

interface Girdi {
    id: string
    content: string
    created_at: string
    author: { username: string; full_name: string | null } | { username: string; full_name: string | null }[] | null
}

export function GirdiItem({
    girdi,
    currentUserId,
    index,
    totalCount
}: {
    girdi: Girdi
    currentUserId?: string
    index: number
    totalCount: number
}) {
    const [isEditing, setIsEditing] = useState(false)
    const [content, setContent] = useState(girdi.content)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const author = Array.isArray(girdi.author) ? girdi.author[0] : girdi.author
    const authorName = author?.full_name || author?.username || "Anonim"
    const authorUsername = author?.username
    const isOwner = currentUserId === (author as any)?.id || currentUserId === (girdi as any).author_id

    const initialLetter = authorName.charAt(0).toUpperCase()
    const formattedDate = new Date(girdi.created_at).toLocaleDateString("tr-TR", {
        day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
    })

    async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        const formData = new FormData(e.currentTarget)

        startTransition(async () => {
            const result = await updateArticle(null, formData)
            if (result.success) {
                setIsEditing(false)
            } else {
                setError(result.error || "Bir hata oluştu")
            }
        })
    }

    return (
        <article className="relative pl-6 sm:pl-10 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary/20 hover:before:bg-primary transition-all">
            {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-3">
                    <input type="hidden" name="id" value={girdi.id} />
                    <textarea
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full min-h-[150px] p-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none resize-y"
                        required
                    />
                    {error && <p className="text-xs text-destructive">{error}</p>}
                    <div className="flex items-center gap-2">
                        <Button type="submit" size="sm" disabled={isPending} className="h-8 gap-1.5 ring-offset-background">
                            {isPending ? "..." : <><Check className="h-3.5 w-3.5" /> Kaydet</>}
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={() => { setIsEditing(false); setContent(girdi.content); }} className="h-8 gap-1.5">
                            <X className="h-3.5 w-3.5" /> Vazgeç
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="mb-3 text-foreground leading-relaxed whitespace-pre-wrap">
                    {content}
                </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border/10">
                <div className="flex items-center gap-2">
                    <Link href={`/profile/${authorUsername}`} className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-border">
                        {initialLetter}
                    </Link>
                    <Link href={`/profile/${authorUsername}`} className="text-xs font-bold text-primary hover:underline">{authorName}</Link>
                    <span className="text-muted-foreground/30 text-xs">•</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-tighter font-semibold">{formattedDate}</span>

                    {isOwner && !isEditing && (
                        <>
                            <span className="text-muted-foreground/30 text-xs">•</span>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <Pencil className="h-2.5 w-2.5" /> Düzenle
                            </button>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <Link href={`/article/${girdi.id}`} className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors">#{(totalCount - index).toString().padStart(2, '0')}</Link>
                </div>
            </div>
        </article>
    )
}
