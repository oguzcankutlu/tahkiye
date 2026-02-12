"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Send, MoreVertical, Plus } from "lucide-react"
import Link from "next/link"

// Mock Conversations
const CONVERSATIONS = [
    { id: 1, user: "caylak_uye", lastMessage: "abi o başlığı silesin...", time: "14:30", unread: 2 },
    { id: 2, user: "tecrubeli_yazar", lastMessage: "haklısın, düzelttim.", time: "dün", unread: 0 },
    { id: 3, user: "moderator_1", lastMessage: "uyarı aldınız.", time: "2 gün", unread: 0 },
]

export default function MessagesPage() {
    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] rounded-lg overflow-hidden bg-card border shadow-sm">
            {/* Sidebar List */}
            <div className="w-full md:w-80 border-r flex flex-col bg-background">
                <div className="p-4 border-b">
                    <h2 className="font-bold mb-4 text-primary">Mesajlar</h2>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Kullanıcı ara..." className="pl-8 bg-secondary/20" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {CONVERSATIONS.map((chat) => (
                        <div key={chat.id} className={`p-4 border-b hover:bg-primary/5 cursor-pointer transition-colors ${chat.id === 1 ? 'bg-primary/10' : ''}`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-sm">@{chat.user}</span>
                                <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-muted-foreground truncate w-4/5">{chat.lastMessage}</p>
                                {chat.unread > 0 && (
                                    <span className="bg-primary text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                        {chat.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area - Desktop */}
            <div className="hidden md:flex flex-1 flex-col bg-background">
                {/* Chat Header */}
                <div className="h-16 border-b flex items-center justify-between px-6 bg-muted/10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-lg">
                            A
                        </div>
                        <div>
                            <h3 className="font-bold">antigravity</h3>
                            <span className="text-xs text-green-600 flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-green-600"></span> Çevrimiçi
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Link href="/profile/antigravity">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                                Profile Git
                            </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                            Engelle
                        </Button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-muted/5">
                    <div className="flex justify-start">
                        <div className="bg-white border max-w-[70%] rounded-lg p-3 text-sm shadow-sm">
                            selam, naber? o başlığı silesin var mı?
                            <span className="block text-[10px] opacity-50 mt-1 text-right">14:28</span>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="bg-primary text-black max-w-[70%] rounded-lg p-3 text-sm shadow-sm font-medium">
                            hangi başlık? link atar mısın?
                            <span className="block text-[10px] opacity-70 mt-1 text-right">14:29</span>
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="bg-white border max-w-[70%] rounded-lg p-3 text-sm shadow-sm">
                            abi işte şu "tahkiye sözlük" başlığı. çok fazla entry girilmiş, yetişemiyoruz okumaya.
                            <span className="block text-[10px] opacity-50 mt-1 text-right">14:30</span>
                        </div>
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-background">
                    <div className="flex gap-2">
                        <Input placeholder="Bir mesaj yazın..." className="flex-1 border-2 focus-visible:ring-0 focus-visible:border-primary" />
                        <Button size="icon" className="bg-primary text-black hover:bg-primary/90"><Send className="h-4 w-4" /></Button>
                    </div>
                </div>
            </div>

            {/* Mobile Placeholder for detail view */}
            <div className="md:hidden flex-1 flex items-center justify-center p-4 text-center text-muted-foreground bg-muted/5">
                <p className="text-sm">Sohbeti görüntülemek için bir kişi seçin.</p>
            </div>
        </div>
    )
}
