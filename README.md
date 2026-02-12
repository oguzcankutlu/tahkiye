This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

1. Projeyi GitHub'a push edin ve Vercel ile bağlayın.
2. **Zorunlu:** Vercel Dashboard → Settings → Environment Variables'a şunları ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL` — Supabase proje URL'iniz
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key
3. `.env.example` dosyasındaki placeholder'ları kendi Supabase değerlerinizle değiştirin.
4. Supabase'de `scripts/schema.sql` ile veritabanı tablolarını oluşturun.

Ortam değişkenleri ayarlanmadan uygulama çalışır ama giriş/veri işlemleri devre dışı kalır.
