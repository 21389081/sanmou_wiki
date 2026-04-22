import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '配將助手 | 三謀資料庫',
    description: '《三國：謀定天下》智能配將工具，選擇您擁有的武將與戰法，快速找出最適合的頂級陣容配置與評級推薦。',
    keywords: [
        '三國謀定天下配將',
        '配將助手',
        '三謀配將',
        '謀定天下陣容',
        '陣容推薦',
        '配將攻略',
    ],
    authors: [{ name: '三謀資料庫' }],
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: '配將助手 | 三謀資料庫',
        description: '《三國：謀定天下》智能配將工具，快速找出最佳陣容配置。',
        url: 'https://sanmou-wiki.vercel.app/builder',
        siteName: '三謀資料庫',
        locale: 'zh_TW',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: '配將助手 | 三謀資料庫',
        description: '《三國：謀定天下》智能配將工具，快速找出最佳陣容配置。',
    },
    themeColor: '#1a1a2e',
    alternates: {
        canonical: 'https://sanmou-wiki.vercel.app/builder',
    },
};