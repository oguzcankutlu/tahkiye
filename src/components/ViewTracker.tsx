"use client"

import { useEffect, useRef, useState } from "react"
import { incrementArticleViews } from "@/app/actions/entry-actions"

export function ViewTracker({ articleId, children }: { articleId: string, children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null)
    const [hasViewed, setHasViewed] = useState(false)

    useEffect(() => {
        if (!ref.current || hasViewed) return

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setHasViewed(true)
                // Yalnızca ekranda göründüğünde görüntülenmeyi (okunmayı) artırır
                incrementArticleViews(articleId).catch(console.error)
            }
        }, { threshold: 0.3 }) // Yüzde 30'u ekranda göründüğünde okundu sayar

        observer.observe(ref.current)

        return () => observer.disconnect()
    }, [hasViewed, articleId])

    return <div ref={ref} className="w-full">{children}</div>
}
