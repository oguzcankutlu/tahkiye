"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"

export default function AdminLoginGate() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            window.location.reload()
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
            <div className="w-full max-w-sm p-8 border border-border rounded-2xl bg-card shadow-xl space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Yönetici Girişi</h1>
                    <p className="text-sm text-muted-foreground mt-1">Admin paneline erişmek için giriş yapın.</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    {error && <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm">{error}</div>}
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">E-posta</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="admin@tahkiye.tr"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Şifre</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-10 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                    </button>
                </form>
            </div>
        </div>
    )
}
