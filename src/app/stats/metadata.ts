import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '詞條一覽 | 三謀資料庫',
    description: '《三國：謀定天下》裝備、馬匹特技與特效整理，包含坐騎特效、坐騎特技、裝備特效、裝備特技完整說明。',
    keywords: [
        '三國謀定天下詞條',
        '詞條一覽',
        '三謀特技',
        '裝備特技',
        '馬匹特效',
        '特技大全',
    ],
    authors: [{ name: '三謀資料庫' }],
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: '詞條一覽 | 三謀資料庫',
        description: '《三國：謀定天下》裝備與馬匹特技特效整理。',
        url: 'https://sanmou-wiki.vercel.app/stats',
        siteName: '三謀資料庫',
        locale: 'zh_TW',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: '詞條一覽 | 三謀資料庫',
        description: '《三國：謀定天下》裝備與馬匹特技特效整理。',
    },
    themeColor: '#1a1a2e',
    alternates: {
        canonical: 'https://sanmou-wiki.vercel.app/stats',
    },
};