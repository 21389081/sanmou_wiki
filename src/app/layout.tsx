import type { Metadata } from 'next';
import { Noto_Serif_TC, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar';
import LayoutTransition from '@/components/layout-transition';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const notoSerif = Noto_Serif_TC({
    weight: ['400', '700', '900'],
    subsets: ['latin'],
    variable: '--font-serif',
});

export const metadata: Metadata = {
    title: {
        default: '三謀資料庫',
        template: '%s',
    },
    description: '《三國：謀定天下》武將圖鑑、戰法資料與深度攻略資料庫。',
    keywords: ['三國：謀定天下', '三謀', '武將', '戰法', '配將', '攻略'],
    authors: [{ name: '三謀資料庫' }],
    icons: {
        icon: '/mou_icon-removebg.png',
        apple: '/mou_icon-removebg.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='zh-TW' className={`${inter.variable} ${notoSerif.variable}`}>
            <body className='antialiased min-h-screen flex flex-col text-foreground selection:bg-accent-gold/30 selection:text-accent-gold'>
                <Navbar />
                <main className='pt-20 px-4 max-w-7xl mx-auto flex-grow w-full overflow-hidden'>
                    <LayoutTransition>{children}</LayoutTransition>
                </main>
                <footer className='py-8 border-t border-white/5 text-center text-foreground-muted text-sm px-4'>
                    <p>Copyright © 2026 三謀數據庫</p>
                </footer>
            </body>
        </html>
    );
}
