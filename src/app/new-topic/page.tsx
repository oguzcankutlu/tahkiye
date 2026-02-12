"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NewTopicPage() {
    return (
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Yeni Konu Aç</h1>

            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex-1">
                        <label htmlFor="title" className="block text-sm font-medium mb-2">Konu Başlığı</label>
                        <Input id="title" placeholder="Konu nedir? (örn: 2026 yılı simit fiyatları)" className="text-lg" />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium mb-2">Kategori (Opsiyonel)</label>
                        <select id="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="">Kategori Seçiniz</option>
                            <option value="1">Genel</option>
                            <option value="2">Siyaset</option>
                            <option value="3">Spor</option>
                            <option value="4">Teknoloji</option>
                        </select>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground">
                    Lütfen konu açmadan önce arama yapın.
                </p>

                <div>
                    <label className="block text-sm font-medium mb-2">İlk Girdi</label>
                    <Tabs defaultValue="edit" className="w-full">
                        <TabsList className="mb-2">
                            <TabsTrigger value="edit">Editör</TabsTrigger>
                            <TabsTrigger value="preview">Önizleme</TabsTrigger>
                        </TabsList>
                        <TabsContent value="edit">
                            <Textarea
                                placeholder="Fikriniz nedir? (bkz: örnek link) [görsel](url)"
                                className="min-h-[300px] font-mono text-base"
                            />
                            <div className="flex gap-2 mt-2">
                                <Button variant="outline" size="sm">Bkz</Button>
                                <Button variant="outline" size="sm">Görsel</Button>
                                <Button variant="outline" size="sm">Video</Button>
                                <Button variant="outline" size="sm">Spoiler</Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="preview">
                            <div className="min-h-[300px] p-4 border rounded-md bg-muted/10">
                                Önizleme alanı...
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="flex justify-end gap-4">
                    <Button variant="ghost">Vazgeç</Button>
                    <Button>Yayınla</Button>
                </div>
            </div>
        </div>
    )
}
