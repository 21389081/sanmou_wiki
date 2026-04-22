import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '狀態一覽 | 三謀資料庫',
    description: '《三國：謀定天下》增益、減益狀態與特殊效果說明，涵蓋功能性增益、控制狀態、布陣狀態、特殊傷害類型完整整理。',
    keywords: [
        '三國謀定天下狀態',
        '狀態一覽',
        '三謀Buff',
        '謀定天下增益',
        '謀定天下減益',
        '控制狀態',
    ],
    authors: [{ name: '三謀資料庫' }],
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: '狀態一覽 | 三謀資料庫',
        description: '《三國：謀定天下》增益與減益狀態說明整理。',
        url: 'https://sanmou-wiki.vercel.app/buffs',
        siteName: '三謀資料庫',
        locale: 'zh_TW',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: '狀態一覽 | 三謀資料庫',
        description: '《三國：謀定天下》增益與減益狀態說明整理。',
    },
    themeColor: '#1a1a2e',
    alternates: {
        canonical: 'https://sanmou-wiki.vercel.app/buffs',
    },
};