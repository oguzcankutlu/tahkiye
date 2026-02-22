"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useActionState } from 'react'
import { signup } from "@/app/auth/actions/auth-actions"

// Turkish cities sorted by population (approximate order for major ones, rest typical)
const CITIES = [
    "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Konya", "Adana", "Şanlıurfa", "Gaziantep", "Kocaeli",
    "Mersin", "Diyarbakır", "Hatay", "Manisa", "Kayseri", "Samsun", "Balıkesir", "Kahramanmaraş", "Van", "Aydın",
    "Tekirdağ", "Sakarya", "Denizli", "Muğla", "Eskişehir", "Mardin", "Trabzon", "Malatya", "Ordu", "Erzurum",
    "Afyonkarahisar", "Sivas", "Adıyaman", "Tokat", "Zonguldak", "Elazığ", "Batman", "Kütahya", "Çorum", "Osmaniye",
    "Çanakkale", "Şırnak", "Giresun", "Isparta", "Ağrı", "Yozgat", "Muş", "Edirne", "Aksaray", "Kastamonu",
    "Düzce", "Uşak", "Kırklareli", "Niğde", "Bitlis", "Rize", "Amasya", "Siirt", "Bolu", "Nevşehir",
    "Kars", "Hakkâri", "Kırıkkale", "Bingöl", "Burdur", "Karaman", "Karabük", "Yalova", "Kırşehir", "Erzincan",
    "Bilecik", "Sinop", "Iğdır", "Bartın", "Çankırı", "Artvin", "Gümüşhane", "Kilis", "Ardahan", "Tunceli", "Bayburt"
];

const initialState: { error: string | null } = {
    error: null,
}

export default function RegisterPage() {
    const [state, formAction] = useActionState(signup, initialState)

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight">Kayıt Ol</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Zaten hesabınız var mı?{' '}
                        <Link href="/login" className="font-medium text-primary hover:underline">
                            Giriş Yap
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" action={formAction}>
                    {state?.error && (
                        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                            {state.error}
                        </div>
                    )}
                    <div className="space-y-4">
                        {/* Kullanıcı Adı */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-muted-foreground mb-1">
                                Kullanıcı Adı
                            </label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                required
                                placeholder="benzersiz_bir_ad"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                                Email Adresi
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="ornek@email.com"
                            />
                        </div>

                        {/* Şehir Seçimi */}
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-muted-foreground mb-1">
                                Yaşadığınız İl
                            </label>
                            <select
                                id="city"
                                name="city"
                                defaultValue=""
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="" disabled>Şehir Seçiniz</option>
                                {CITIES.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {/* Şifre */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1">
                                Şifre
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="Güçlü bir şifre seçin"
                            />
                        </div>
                        <div>
                            <label htmlFor="password-confirm" className="block text-sm font-medium text-muted-foreground mb-1">
                                Şifre Tekrar
                            </label>
                            <Input
                                id="password-confirm"
                                name="confirmPassword"
                                type="password"
                                required
                                placeholder="Şifrenizi tekrar girin"
                            />
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-muted-foreground mb-4">
                            Kayıt olarak <Link href="/rules" className="underline">kullanıcı sözleşmesini</Link> kabul etmiş olursunuz.
                        </p>
                        <Button className="w-full" type="submit">
                            Kayıt Ol
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
