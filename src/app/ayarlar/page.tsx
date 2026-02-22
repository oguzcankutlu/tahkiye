import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { SettingsForm } from "./SettingsForm"

export default async function SettingsPage() {
    const supabase = await createClient()

    // 1. Kullanıcıyı al
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        redirect('/login')
    }

    // 2. Profil bilgilerini çek
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile) {
        // Profil yoksa aslında saçma ama login sayfasına atabiliriz
        redirect('/login')
    }

    return (
        <div className="w-full pb-20">
            <div className="mb-8 border-b border-border/40 pb-6">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                    Profil Ayarları
                </h1>
                <p className="mt-2 text-muted-foreground text-sm max-w-2xl">
                    Sistemde görünecek profil adınızı, fotoğraf URL'nizi ve kendinizle ilgili kısa bilgileri buradan güncelleyebilirsiniz.
                </p>
            </div>

            <div className="max-w-4xl mx-auto pl-2">
                <SettingsForm profile={profile} />
            </div>
        </div>
    )
}
