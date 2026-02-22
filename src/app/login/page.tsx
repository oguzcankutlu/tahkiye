"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useActionState } from 'react'
import { login } from "@/app/auth/actions/auth-actions"

const initialState: { error: string | null } = {
    error: null,
}

export default function LoginPage() {
    const [state, formAction] = useActionState(login, initialState)

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight">
                        Giriş Yap
                    </h2>
                </div>

                <form className="mt-8 space-y-6" action={formAction}>
                    {state?.error && (
                        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                            {state.error}
                        </div>
                    )}
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email Adresi</label>
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="Email Adresi"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Şifre</label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                placeholder="Şifre"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                                Beni Hatırla
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link href="#" className="font-medium text-primary hover:underline">
                                Şifremi Unuttum
                            </Link>
                        </div>
                    </div>

                    <div>
                        <Button className="w-full" type="submit">
                            Giriş Yap
                        </Button>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-sm text-muted-foreground">
                            Hesabınız yok mu?{' '}
                            <Link href="/register" className="font-medium text-primary hover:underline">
                                Kayıt Ol
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
