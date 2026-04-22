import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '關於本站 | 三謀資料庫',
    description: '三謀資料庫網站介紹，收錄官方連結、攻略資源與社群管道。本網站為非官方粉絲製作，僅供學習與交流使用。',
    keywords: [
        '三謀資料庫',
        '關於本站',
        '三國謀定天下',
        '謀定天下社群',
        '攻略資源',
    ],
    authors: [{ name: '三謀資料庫' }],
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: '關於本站 | 三謀資料庫',
        description: '三謀資料庫網站介紹，官方連結與社群資源。',
        url: 'https://sanmou-wiki.vercel.app/info',
        siteName: '三謀資料庫',
        locale: 'zh_TW',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: '關於本站 | 三謀資料庫',
        description: '三謀資料庫網站介紹，官方連結與社群資源。',
    },
    themeColor: '#1a1a2e',
    alternates: {
        canonical: 'https://sanmou-wiki.vercel.app/info',
    },
};