"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Users, FileText, CheckCircle, XCircle, AlertTriangle, TrendingUp, BarChart } from "lucide-react"
import { useState } from "react"

export default function AdminDashboard() {
    const [activeView, setActiveView] = useState("overview")

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-muted/20 hidden md:block">
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-6 text-primary">Yönetim Paneli</h2>
                    <nav className="space-y-2">
                        <Button
                            variant={activeView === "overview" ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveView("overview")}
                        >
                            <TrendingUp className="mr-2 h-4 w-4" /> Genel Bakış
                        </Button>
                        <Button
                            variant={activeView === "users" ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveView("users")}
                        >
                            <Users className="mr-2 h-4 w-4" /> Kullanıcılar
                        </Button>
                        <Button
                            variant={activeView === "content" ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveView("content")}
                        >
                            <FileText className="mr-2 h-4 w-4" /> İçerik Onayı
                        </Button>
                        <Button
                            variant={activeView === "ads" ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveView("ads")}
                        >
                            <BarChart className="mr-2 h-4 w-4" /> Reklam Yönetimi
                        </Button>
                        <Button
                            variant={activeView === "complaints" ? "secondary" : "ghost"}
                            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setActiveView("complaints")}
                        >
                            <AlertTriangle className="mr-2 h-4 w-4" /> Şikayetler (5)
                        </Button>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-8">
                    {activeView === "overview" && "Gösterge Paneli"}
                    {activeView === "users" && "Kullanıcı Yönetimi"}
                    {activeView === "content" && "İçerik Onay Sırası"}
                    {activeView === "ads" && "Reklam Kampanyaları"}
                    {activeView === "complaints" && "Şikayet Bildirimleri"}
                </h1>

                {activeView === "overview" && (
                    <>
                        {/* Stats Grid */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">1,248</div>
                                    <p className="text-xs text-muted-foreground">+12 bu hafta</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Toplam Entry</CardTitle>
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">45,231</div>
                                    <p className="text-xs text-muted-foreground">+540 bugün</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Bekleyen Onay</CardTitle>
                                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">24</div>
                                    <p className="text-xs text-muted-foreground">Yazar başvurusu</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Aktif Reklam</CardTitle>
                                    <BarChart className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">2</div>
                                    <p className="text-xs text-muted-foreground">Gösterim: 15.4K</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity & Management */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Son Aktiviteler</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="flex items-center">
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">kullanici_{i}</p>
                                                    <p className="text-sm text-muted-foreground">yeni bir entry girdi #'konu'</p>
                                                </div>
                                                <div className="ml-auto font-medium text-xs text-muted-foreground">19:0{i}</div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Management Tabs */}
                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>Hızlı Yönetim</CardTitle>
                                    <CardDescription>Onay bekleyen içerikler ve kullanıcılar</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Tabs defaultValue="ads" className="w-full">
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
                                            <TabsTrigger value="ads">Reklamlar</TabsTrigger>
                                            <TabsTrigger value="categories">Kategoriler</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="users">
                                            <div className="space-y-4 mt-4">
                                                <div className="flex items-center justify-between p-2 border rounded">
                                                    <span className="text-sm">çaylak_123</span>
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="outline" className="h-7"><CheckCircle className="h-3 w-3" /></Button>
                                                        <Button size="sm" variant="destructive" className="h-7"><XCircle className="h-3 w-3" /></Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="ads">
                                            <div className="space-y-4 mt-4">
                                                <div className="p-3 border rounded bg-muted/10">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="font-semibold text-sm">Üst Banner (Yatay)</span>
                                                        <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">Aktif</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mb-2">Hedef: https://ornek-site.com/kampanya1</p>
                                                    <div className="bg-muted h-8 w-full rounded flex items-center justify-center text-[10px]">Görsel Önizleme</div>
                                                </div>
                                                <Button size="sm" className="w-full mt-2">Yeni Reklam Ekle</Button>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="categories">
                                            <div className="space-y-4 mt-4">
                                                <div className="flex gap-2">
                                                    <input className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" placeholder="Yeni Kategori Adı" />
                                                    <Button size="sm">Ekle</Button>
                                                </div>
                                                <div className="space-y-2">
                                                    {["Genel", "Siyaset", "Spor", "Teknoloji"].map((cat, i) => (
                                                        <div key={i} className="flex items-center justify-between p-2 border rounded bg-card">
                                                            <span className="text-sm font-medium">{cat}</span>
                                                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive">
                                                                <XCircle className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}

                {/* Content Views */}
                {activeView === "users" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Kullanıcı Yönetimi</CardTitle>
                            <CardDescription>Sistemdeki tüm kayıtlı kullanıcılar.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <div className="grid grid-cols-5 bg-muted/50 p-3 text-sm font-medium border-b">
                                    <div className="col-span-1">ID</div>
                                    <div className="col-span-1">Kullanıcı Adı</div>
                                    <div className="col-span-1">Rol</div>
                                    <div className="col-span-1">Onay Durumu</div>
                                    <div className="col-span-1 text-right">İşlemler</div>
                                </div>
                                {
                                    /* Hardcoded mock data for demonstration */
                                }
                                {[
                                    { id: 1, username: "antigravity", role: "yonetici", isVerified: true },
                                    { id: 2, username: "caylak_uye", role: "caylak", isVerified: false },
                                    { id: 3, username: "tecrubeli_yazar", role: "yazar", isVerified: true },
                                ].map((user) => (
                                    <div key={user.id} className="grid grid-cols-5 p-3 text-sm border-b last:border-0 items-center">
                                        <div className="col-span-1 text-muted-foreground">#{user.id}</div>
                                        <div className="col-span-1 font-medium text-primary">@{user.username}</div>
                                        <div className="col-span-1 capitalize">{user.role}</div>
                                        <div className="col-span-1">
                                            {user.isVerified ? (
                                                <span className="flex items-center text-green-600 gap-1 text-xs bg-green-100 px-2 py-1 rounded-full w-fit">
                                                    <CheckCircle className="h-3 w-3" /> Onaylı
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-muted-foreground gap-1 text-xs bg-secondary px-2 py-1 rounded-full w-fit">
                                                    Bekliyor
                                                </span>
                                            )}
                                        </div>
                                        <div className="col-span-1 text-right flex justify-end gap-2">
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><FileText className="h-4 w-4" /></Button>
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive"><XCircle className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
                {activeView === "content" && (
                    <div className="p-10 text-center border-2 border-dashed rounded-lg text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-bold">İçerik Onay Modülü</h3>
                        <p>Şikayet edilen veya onay bekleyen entryler burada listelenecek.</p>
                    </div>
                )}
                {activeView === "ads" && (
                    <div className="p-10 text-center border-2 border-dashed rounded-lg text-muted-foreground">
                        <BarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-bold">Reklam Yönetim Modülü</h3>
                        <p>Kampanya oluşturma, banner yükleme ve istatistik ekranları.</p>
                    </div>
                )}
                {activeView === "complaints" && (
                    <div className="p-10 text-center border-2 border-dashed rounded-lg text-destructive/50 text-destructive">
                        <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-bold">Şikayet Yönetimi</h3>
                        <p>Kullanıcı şikayetleri ve moderasyon aksiyonları.</p>
                    </div>
                )}
            </main>
        </div>
    )
}
