import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '戰法圖鑑 | 三謀資料庫',
    description: '《三國：謀定天下》戰法完整圖鑑，收錄所有戰法卡面、初級效果與滿級效果，可依稀有度進行篩選查詢。',
    keywords: [
        '三國謀定天下戰法',
        '戰法圖鑑',
        '三謀戰法大全',
        '謀定天下戰法效果',
        '戰法推薦',
    ],
    authors: [{ name: '三謀資料庫' }],
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: '戰法圖鑑 | 三謀資料庫',
        description: '《三國：謀定天下》戰法完整圖鑑，支援稀有度篩選。',
        url: 'https://sanmou-wiki.vercel.app/tactics',
        siteName: '三謀資料庫',
        locale: 'zh_TW',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: '戰法圖鑑 | 三謀資料庫',
        description: '《三國：謀定天下》戰法完整圖鑑，支援稀有度篩選。',
    },
    themeColor: '#1a1a2e',
    alternates: {
        canonical: 'https://sanmou-wiki.vercel.app/tactics',
    },
};