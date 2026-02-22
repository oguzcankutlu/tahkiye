import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) return NextResponse.json({ title: '' });

    try {
        const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`, {
            next: { revalidate: 3600 } // Cache for 1 hour to prevent spamming
        });

        if (!res.ok) {
            return NextResponse.json({ title: '' });
        }

        const data = await res.json();

        // If the service doesn't support the URL, it returns an error field or empty title
        if (data.error || !data.title) {
            return NextResponse.json({ title: '' });
        }

        return NextResponse.json({ title: data.title });
    } catch {
        return NextResponse.json({ title: '' });
    }
}
