import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '三謀資料庫 | 武將圖鑑、戰法大全、配將助手',
    description:
        '《三國：謀定天下》非官方資料庫，收錄武將立繪屬性、戰法效果與頂級陣容推薦。提供快速查詢功能，助你掌握三謀大學習。',
    keywords: [
        '三國謀定天下',
        '三謀資料庫',
        '武將圖鑑',
        '戰法大全',
        '配將助手',
        '謀定天下攻略',
    ],
    authors: [{ name: '三謀資料庫' }],
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: '三謀資料庫 | 武將圖鑑、戰法大全、配將助手',
        description: '《三國：謀定天下》非官方資料庫，收錄武將立繪屬性、戰法效果與頂級陣容推薦。',
        url: 'https://sanmou-wiki.vercel.app',
        siteName: '三謀資料庫',
        locale: 'zh_TW',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: '三謀資料庫 | 武將圖鑑、戰法大全、配將助手',
        description: '《三國：謀定天下》非官方資料庫，收錄武將立繪屬性、戰法效果與頂級陣容推薦。',
    },
    themeColor: '#1a1a2e',
    alternates: {
        canonical: 'https://sanmou-wiki.vercel.app',
    },
};