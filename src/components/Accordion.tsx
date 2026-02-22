"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

interface AccordionProps {
    title: string
    children: React.ReactNode
    className?: string
}

export function Accordion({ title, children, className = "" }: AccordionProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div className={`border border-border/50 rounded-lg overflow-hidden flex-1 ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-secondary/20 hover:bg-secondary/40 transition-colors text-sm font-medium"
            >
                <span className="text-foreground/90">{title}</span>
                <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="px-4 py-3 bg-background border-t border-border/50 text-sm text-foreground/80 space-y-2">
                    {children}
                </div>
            )}
        </div>
    )
}
