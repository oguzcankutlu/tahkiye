"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bold, Italic, Link, Image, Video, AlertTriangle as AlertHexagon, List, Quote } from "lucide-react"

export function EntryEditor() {
    return (
        <div className="border rounded-md bg-card shadow-sm">
            <div className="flex items-center gap-1 p-2 border-b bg-muted/20 overflow-x-auto">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background" title="Kalın">
                    <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background" title="İtalik">
                    <Italic className="h-4 w-4" />
                </Button>
                <div className="w-px h-4 bg-border mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background" title="Link (bkz)">
                    <Link className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background" title="Görsel Ekle">
                    <Image className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background" title="Video Ekle">
                    <Video className="h-4 w-4" />
                </Button>
                <div className="w-px h-4 bg-border mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background" title="Spoiler">
                    <AlertHexagon className="h-4 w-4" />
                </Button>
            </div>
            <div className="p-0">
                <Textarea
                    className="min-h-[150px] border-0 focus-visible:ring-0 resize-y p-4 text-[15px] leading-relaxed rounded-none"
                    placeholder="Girdinizi buraya yazın..."
                />
            </div>
            <div className="p-2 border-t flex justify-between items-center bg-muted/10">
                <span className="text-xs text-muted-foreground ml-2">Dikkat: Kurallara uyunuz.</span>
                <Button size="sm" className="font-bold">Yayınla</Button>
            </div>
        </div>
    )
}
