import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AppLayout } from '@/components/AppLayout'
import { VideoProvider } from '@/components/VideoProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tahkiye.tr - Nitelikli Bilgi Ağı',
  description: 'Öğrenim akışı sağlayan sözlük ve dijital bilgi ağı.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <VideoProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </VideoProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
