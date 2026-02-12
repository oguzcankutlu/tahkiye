"use client"

import { useParams } from "next/navigation"
import { MOCK_USERS, MOCK_ENTRIES } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
    const params = useParams()
    const username = params.username as string
    const user = MOCK_USERS.find(u => u.username === username) || {
        username: username,
        role: "UNKNOWN",
        isVerified: false,
        joinDate: "2026-01-01",
        stats: { applause: 0, hiss: 0 }
    }

    const userEntries = MOCK_ENTRIES.filter(e => e.author.username === username)

    return (
        <div className="container py-6">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Info */}
                <div className="w-full md:w-1/4 space-y-6">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 text-center">
                        <div className="mx-auto h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary mb-4">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <h1 className="text-xl font-bold mb-1">@{user.username}</h1>
                        <div className="flex justify-center gap-2 mb-4">
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                {user.role}
                            </span>
                            {user.isVerified && (
                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500/10 text-green-500 hover:bg-green-500/20">
                                    Onaylı
                                </span>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-6 border-t border-b py-4">
                            <div className="text-center">
                                <div className="text-lg font-bold text-green-600">{user.stats.applause}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider">Alkış</div>
                            </div>
                            <div className="text-center border-l">
                                <div className="text-lg font-bold text-red-600">{user.stats.hiss}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider">Yuhalama</div>
                            </div>
                        </div>

                        <div className="text-sm text-muted-foreground mb-6">
                            Katılma Tarihi: 01.01.2026
                        </div>
                        <div className="space-y-2">
                            <Button className="w-full">Mesaj Gönder</Button>
                            <Button variant="outline" className="w-full">Takip Et</Button>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="w-full md:w-3/4">
                    <Tabs defaultValue="entries" className="w-full">
                        <TabsList className="w-full justify-start">
                            <TabsTrigger value="entries">Entry'ler ({userEntries.length})</TabsTrigger>
                            <TabsTrigger value="saved">Kaydedilenler</TabsTrigger>
                            <TabsTrigger value="stats">İstatistikler</TabsTrigger>
                        </TabsList>
                        <TabsContent value="entries" className="mt-6 space-y-4">
                            {userEntries.length > 0 ? (
                                userEntries.map(entry => (
                                    <div key={entry.id} className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                                        <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{entry.content}</p>
                                        <div className="text-xs text-muted-foreground flex justify-between items-center pt-2 border-t">
                                            <span>{entry.createdAt.split('T')[0].split('-').reverse().join('.')}</span>
                                            <div className="flex gap-3">
                                                <span className="text-green-600 font-medium">+{entry.reactions?.applause || 0}</span>
                                                <span className="text-red-500 font-medium">-{entry.reactions?.hiss || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                                    Henüz entry girilmemiş.
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="saved">
                            <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                                Kaydedilen içerik bulunamadı.
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
