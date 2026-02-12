export const MOCK_USERS = [
    { id: 1, username: "antigravity", role: "yonetici", createdAt: "2023-01-01", isVerified: true, stats: { applause: 1250, hiss: 12 } },
    { id: 2, username: "caylak_uye", role: "caylak", createdAt: "2026-02-10", isVerified: false, stats: { applause: 5, hiss: 0 } },
    { id: 3, username: "tecrubeli_yazar", role: "yazar", createdAt: "2024-05-15", isVerified: true, stats: { applause: 890, hiss: 45 } },
];

export const MOCK_CATEGORIES = [
    { id: 1, name: "Genel", slug: "genel" },
    { id: 2, name: "Siyaset", slug: "siyaset" },
    { id: 3, name: "Spor", slug: "spor" },
    { id: 4, name: "Teknoloji", slug: "teknoloji" },
    { id: 5, name: "Eğlence", slug: "eglence" },
    { id: 6, name: "İlişkiler", slug: "iliskiler" },
];

export const MOCK_TOPICS = [
    { id: 1, title: "tahkiye sözlük", categoryId: 1, createdAt: "2026-02-01" },
    { id: 2, title: "yapay zeka", categoryId: 4, createdAt: "2026-02-05" },
    { id: 3, title: "2026 dünya kupası", categoryId: 3, createdAt: "2026-02-08" },
];

export const MOCK_ENTRIES = [
    { id: 1, topicId: 1, content: "yeni nesil, minimalist sözlük projesi.", author: MOCK_USERS[0], createdAt: "2026-02-01T10:00:00Z", reactions: { applause: 45, hiss: 2 } },
    { id: 2, topicId: 1, content: "arayüzü oldukça sade ve hızlı.", author: MOCK_USERS[2], createdAt: "2026-02-01T11:30:00Z", reactions: { applause: 12, hiss: 0 } },
    { id: 3, topicId: 2, content: "geleceği değiştirecek teknoloji.", author: MOCK_USERS[0], createdAt: "2026-02-05T09:15:00Z", reactions: { applause: 156, hiss: 5 } },
    { id: 4, topicId: 1, content: "sarı siyah tema göz yormuyor, beğendim.", author: MOCK_USERS[1], createdAt: "2026-02-11T14:20:00Z", reactions: { applause: 3, hiss: 0 } },
];
