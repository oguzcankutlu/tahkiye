"use client"

import { TopicList } from "@/components/topics/topic-list";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Share2, ThumbsUp, ThumbsDown, Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { getLatestEntries } from "@/app/actions/entry-actions";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface Entry {
  id: number
  content: string
  created_at: string
  topics: {
    id: number
    title: string
    slug: string
  }
  profiles: {
    username: string
  }
}

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEntries = async () => {
      const data = await getLatestEntries()
      setEntries(data as any)
      setLoading(false)
    }
    fetchEntries()
  }, [])

  return (
    <div className="flex gap-4">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[240px] shrink-0 border-r pr-4 min-h-[calc(100vh-4rem)]">
        <TopicList />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Horizontal Ad Banner */}
        <div className="w-full h-[90px] bg-muted/30 mb-6 flex items-center justify-center text-xs text-muted-foreground border border-dashed rounded-md">
          reklam alanı (yatay)
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4 font-serif">bugün</h1>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-muted/20 animate-pulse rounded-md" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {entries.map((entry) => (
                <div key={entry.id} className="group relative">
                  <Link href={`/topic/${entry.topics?.id}`} className="block">
                    <h2 className="text-xl font-bold mb-2 cursor-pointer text-primary hover:underline">
                      {entry.topics?.title || "Konu Başlığı"}
                    </h2>
                  </Link>
                  <div className="text-[15px] leading-relaxed mb-3 text-foreground/90 whitespace-pre-wrap">
                    {entry.content}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 pt-4 border-t border-border/40">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 px-2 flex gap-1 hover:text-green-600 hover:bg-green-50">
                        <ChevronUp className="h-4 w-4" />
                        <span>0</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2 flex gap-1 hover:text-red-600 hover:bg-red-50">
                        <ChevronDown className="h-4 w-4" />
                        <span>0</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-primary">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-primary">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href={`/profile/${entry.profiles?.username}`} className="hover:underline cursor-pointer font-medium">
                        @{entry.profiles?.username || 'yazar'}
                      </Link>
                      <span className="opacity-70">
                        {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true, locale: tr })}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border mt-6 w-full" />
                </div>
              ))}
            </div>
          )}

          {!loading && entries.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              Henüz hiç girdi yok. İlkini sen yaz!
            </div>
          )}

        </div>

        <div className="flex justify-center my-8">
          <Button variant="outline" className="w-full md:w-auto">daha fazla göster</Button>
        </div>

        {/* Bottom Ad Banner */}
        <div className="w-full h-[90px] bg-muted/30 mb-8 flex items-center justify-center text-xs text-muted-foreground border border-dashed rounded-md">
          reklam alanı (alt)
        </div>
      </div>
    </div>
  );
}
