import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '武將圖鑑 | 三謀資料庫',
    description: '《三國：謀定天下》武將完整圖鑑，收錄各武將立繪、陣營、兵種、戰法、屬性與緣分，可依稀有度、陣營自由篩選。',
    keywords: [
        '三國謀定天下武將',
        '武將圖鑑',
        '三謀武將大全',
        '謀定天下武將立繪',
        '武將屬性',
        '武將緣分',
    ],
    authors: [{ name: '三謀資料庫' }],
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: '武將圖鑑 | 三謀資料庫',
        description: '《三國：謀定天下》武將完整圖鑑，支援稀有度、陣營篩選。',
        url: 'https://sanmou-wiki.vercel.app/generals',
        siteName: '三謀資料庫',
        locale: 'zh_TW',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: '武將圖鑑 | 三謀資料庫',
        description: '《三國：謀定天下》武將完整圖鑑，支援稀有度、陣營篩選。',
    },
    themeColor: '#1a1a2e',
    alternates: {
        canonical: 'https://sanmou-wiki.vercel.app/generals',
    },
};