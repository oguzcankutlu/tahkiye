"use client"

import { useState, KeyboardEvent, useRef } from "react"
import { X, Plus } from "lucide-react"

interface TagInputProps {
    value: string[]
    onChange: (tags: string[]) => void
    placeholder?: string
    label: string
    name: string
    id?: string
}

export function TagInput({ value, onChange, placeholder = "Etiket ekle...", label, name, id }: TagInputProps) {
    const [inputValue, setInputValue] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addTag()
        } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
            removeTag(value.length - 1)
        }
    }

    const addTag = () => {
        const trimmed = inputValue.trim().replace(/^,|,$/g, '')
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed])
        }
        setInputValue("")
    }

    const removeTag = (index: number) => {
        onChange(value.filter((_, i) => i !== index))
    }

    const handleBlur = () => {
        addTag()
    }

    return (
        <div className="w-full">
            <label htmlFor={id} className="block text-xs font-bold text-muted-foreground/60 uppercase mb-1.5">
                {label}
            </label>
            <input type="hidden" name={name} value={JSON.stringify(value)} />

            <div
                className="w-full flex flex-wrap items-center min-h-[48px] p-2 rounded-md border border-input bg-background/50 focus-within:ring-2 focus-within:ring-ring focus-within:border-primary transition-all cursor-text"
                onClick={() => inputRef.current?.focus()}
            >
                {value.map((tag, i) => (
                    <span
                        key={i}
                        className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-semibold mr-2 mb-1 mt-1 break-all"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeTag(i); }}
                            className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-sm hover:bg-background/20"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    id={id}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    placeholder={value.length === 0 ? placeholder : ""}
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 italic">
                Etiketi eklemek için Enter veya virgül (,) tuşuna basın.
            </p>
        </div>
    )
}
