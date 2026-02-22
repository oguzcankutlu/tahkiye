"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateProfile } from "./actions"

interface Profile {
    username: string
    full_name: string | null
    avatar_url: string | null
    bio?: string | null
}

export function SettingsForm({ profile }: { profile: Profile }) {
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [isPending, startTransition] = useTransition()

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        setError(null)
        setSuccess(false)
        startTransition(async () => {
            const result = await updateProfile(null, formData)
            if (result?.error) setError(result.error)
            else setSuccess(true)
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            {error && (
                <div className="p-4 rounded-md bg-destructive/15 text-destructive font-medium border border-destructive/30">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 rounded-md bg-green-500/15 text-green-600 dark:text-green-400 font-medium border border-green-500/30">
                    Profil başarıyla güncellendi!
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                    Kullanıcı Adı (Değiştirilemez)
                </label>
                <Input
                    value={profile.username}
                    readOnly
                    disabled
                    className="bg-secondary/50 text-muted-foreground cursor-not-allowed"
                />
            </div>

            <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-muted-foreground mb-1.5">
                    Görünen Ad (Ad Soyad)
                </label>
                <Input
                    id="full_name"
                    name="full_name"
                    defaultValue={profile.full_name || ""}
                    placeholder="Örn: Ahmet Erdem"
                />
            </div>

            <div>
                <label htmlFor="avatar_url" className="block text-sm font-medium text-muted-foreground mb-1.5">
                    Profil Fotoğrafı URL
                </label>
                <Input
                    id="avatar_url"
                    name="avatar_url"
                    defaultValue={profile.avatar_url || ""}
                    placeholder="https://..."
                />
            </div>

            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-muted-foreground mb-1.5">
                    Biyografi
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    defaultValue={profile.bio || ""}
                    className="w-full flex min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                    placeholder="Kendinizden biraz bahsedin..."
                />
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </Button>
            </div>
        </form>
    )
}
