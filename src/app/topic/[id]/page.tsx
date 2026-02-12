"use client"

import { useParams } from "next/navigation"
import { MOCK_TOPICS, MOCK_ENTRIES } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { TopicList } from "@/components/topics/topic-list"
import { ChevronUp, ChevronDown, Share2, ThumbsUp, ThumbsDown, Bookmark } from "lucide-react"
import { EntryEditor } from "@/components/entry/entry-editor"
import Link from "next/link" // Import Link

export default function TopicPage() {
    const params = useParams()
    const topicId = Number(params.id)
    const topic = MOCK_TOPICS.find((t) => t.id === topicId)

    const entries = MOCK_ENTRIES.filter(e => e.topicId === topicId).length > 0
        ? MOCK_ENTRIES.filter(e => e.topicId === topicId)
        : MOCK_ENTRIES

    if (!topic) {
        return <div className="p-8 text-center text-muted-foreground">başlık bulunamadı.</div>
    }

    const handleShare = (entryId: number) => {
        const url = `${window.location.origin}/topic/${topicId}#entry-${entryId}`
        navigator.clipboard.writeText(url)
        alert("Girdi linki kopyalandı!")
    }

    return (
        <div className="flex gap-4">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-[240px] shrink-0 border-r pr-4 min-h-[calc(100vh-4rem)]">
                <TopicList />
            </div>

            <div className="flex-1 min-w-0">
                {/* Horizontal Ad Banner */}
                <div className="w-full h-[90px] bg-muted/30 mb-6 flex items-center justify-center text-xs text-muted-foreground border border-dashed border-primary/20 rounded-md">
                    reklam alanı (yatay)
                </div>

                <header className="mb-6 flex flex-col gap-4">
                    <div className="flex items-baseline justify-between">
                        <h1 className="text-2xl font-bold text-primary font-serif cursor-pointer hover:underline">
                            {topic.title}
                        </h1>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8">girdi yaz</Button>
                            <Button variant="ghost" size="sm" className="h-8 md:hidden">takip et</Button>
                        </div>
                    </div>
                </header>

                {/* Entry Input Area (New) */}
                <div className="mb-8 hidden md:block">
                    <EntryEditor />
                </div>

                <div className="space-y-6">
                    {/* Mock Media Entry Example */}
                    <div className="relative group border p-4 rounded-md bg-card shadow-sm border-primary/20">
                        <div className="text-xs text-primary font-bold mb-2 flex items-center gap-2">
                            <span className="bg-primary/20 px-2 py-0.5 rounded">Görsel İçerik</span>
                        </div>
                        <p className="text-[15px] leading-relaxed mb-3 text-foreground/90 whitespace-pre-wrap">
                            arkadaşlar sitenin yeni tasarımı efsane olmuş. özellikle sarı siyah uyumu çok iyi. şöyle bir şey:
                        </p>
                        <div className="my-4 rounded-lg overflow-hidden border">
                            <div className="bg-muted h-[300px] w-full flex items-center justify-center text-muted-foreground">
                                [Örnek Görsel / Video Player Alanı]
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-4 border-t border-border/40">
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" className="h-8 px-2 flex gap-1 hover:text-green-600 hover:bg-green-50">
                                    <ThumbsUp className="h-4 w-4" />
                                    <span>245</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 px-2 flex gap-1 hover:text-red-600 hover:bg-red-50">
                                    <ThumbsDown className="h-4 w-4" />
                                    <span>3</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-primary">
                                    <Bookmark className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:text-primary"
                                    onClick={() => handleShare(999)}
                                >
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link href="/profile/tasarimci_uye" className="hover:underline cursor-pointer">
                                    @tasarimci_uye
                                </Link>
                                <span className="hover:underline cursor-pointer">bugün</span>
                                <div className="flex gap-1 ml-2">
                                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-transparent hover:text-primary">
                                        <ChevronUp className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-transparent hover:text-destructive">
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {entries.map((entry) => (
                        <div key={entry.id} id={`entry-${entry.id}`} className="relative group">
                            <p className="text-[15px] leading-relaxed mb-3 text-foreground/90 whitespace-pre-wrap">
                                {entry.content}
                            </p>

                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-4 border-t border-border/40">
                                {/* Interaction Buttons */}
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="sm" className="h-8 px-2 flex gap-1 hover:text-green-600 hover:bg-green-50">
                                        <ThumbsUp className="h-4 w-4" />
                                        <span>{entry.reactions?.applause || 0}</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-2 flex gap-1 hover:text-red-600 hover:bg-red-50">
                                        <ThumbsDown className="h-4 w-4" />
                                        <span>{entry.reactions?.hiss || 0}</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-primary">
                                        <Bookmark className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:text-primary"
                                        onClick={() => handleShare(entry.id)}
                                    >
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Link href={`/profile/${entry.author.username}`} className="hover:underline cursor-pointer font-medium">
                                        @{entry.author.username}
                                    </Link>
                                    <span className="hover:underline cursor-pointer opacity-70">{new Date(entry.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="h-px bg-border mt-6 w-full opacity-50" />
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center mt-8 pt-4 border-t">
                    <Button variant="ghost" disabled>&lt; önceki</Button>
                    <div className="flex gap-1">
                        {[1, 2, 3].map(p => (
                            <Button key={p} variant={p === 1 ? "default" : "ghost"} size="sm" className="h-8 w-8 p-0">
                                {p}
                            </Button>
                        ))}
                    </div>
                    <Button variant="ghost">sonraki &gt;</Button>
                </div>

                {/* Bottom Ad Banner */}
                <div className="w-full h-[90px] bg-muted/30 mt-8 mb-8 flex items-center justify-center text-xs text-muted-foreground border border-dashed border-primary/20 rounded-md">
                    reklam alanı (alt)
                </div>
            </div>
        </div>
    )
}
