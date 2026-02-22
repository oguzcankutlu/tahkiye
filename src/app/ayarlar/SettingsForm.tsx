"use client"

import { useActionState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateProfile } from "./actions"

interface Profile {
    username: string
    full_name: string | null
    avatar_url: string | null
    bio?: string | null
}

const initialState = { error: null as string | null, success: false }

export function SettingsForm({ profile }: { profile: Profile }) {
    const [state, formAction, isPending] = useActionState(async (prevState: typeof initialState, formData: FormData) => {
        const result = await updateProfile(prevState, formData)
        return { error: result.error || null, success: result.success || false }
    }, initialState)

    useEffect(() => {
        if (state.success) {
            alert("Profil başarıyla güncellendi!")
        }
    }, [state.success])

    return (
        <form action={formAction} className="space-y-6 max-w-2xl">
            {state.error && (
                <div className="p-4 rounded-md bg-destructive/15 text-destructive font-medium border border-destructive/30">
                    {state.error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                    Kullanıcı Adı (Okunabilir Değil, Değiştirilemez)
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
                    Profil Fotoğrafı URL (Avatar)
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
                    Biyografi (Hakkında)
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    defaultValue={profile.bio || ""}
                    className="w-full flex min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                    placeholder="Kendinizden veya ilgi alanlarınızdan biraz bahsedin..."
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
