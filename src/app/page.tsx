'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Users, Sword, Info, ScrollText, ChevronRight, Search } from 'lucide-react';
import PageTransition from '@/components/page-transition';
import { generalsData, tacticsData } from '@/lib/data';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const tools = [
    {
        title: '武將圖鑑',
        description: '收錄全系列武將立繪、屬性與推薦戰法。',
        href: '/generals',
        icon: Users,
        color: 'bg-wei',
        delay: 0.1,
    },
    {
        title: '戰法圖鑑',
        description: '全面解析各類戰法效果，助你組建最強隊伍。',
        href: '/tactics',
        icon: Sword,
        color: 'bg-shu',
        delay: 0.2,
    },
    {
        title: '遊戲攻略',
        description: '從新手入門到深度配將，掌握謀定天下的關鍵。',
        href: 'https://newslg.biligames.com/gameguide/h5/#/',
        icon: ScrollText,
        color: 'bg-wu',
        delay: 0.3,
    },
    {
        title: '系統說明',
        description: '詳細拆解遊戲機制、職業特性與賽季規律。',
        href: '/info',
        icon: Info,
        color: 'bg-qun',
        delay: 0.4,
    },
];

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const filteredGenerals = searchTerm
        ? generalsData.filter((g) => g.name.includes(searchTerm)).slice(0, 3)
        : [];

    const filteredTactics = searchTerm
        ? tacticsData.filter((t) => t.name.includes(searchTerm)).slice(0, 3)
        : [];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <PageTransition>
            <div className='py-12 md:py-20 flex flex-col items-center'>
                {/* Simple Header */}
                <div className='text-center mb-16 px-4'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className='mb-4 inline-block px-3 py-1 bg-accent-gold/10 border border-accent-gold/20 rounded-full text-accent-gold text-xs uppercase tracking-[0.2em]'
                    >
                        S3 賽季即將來臨
                    </motion.div>
                    <h1 className='text-4xl md:text-5xl font-serif mb-4 text-accent-gold  leading-tight'>
                        三謀<span className='text-foreground'>資料庫</span>
                    </h1>
                    <p className='text-foreground-muted max-w-xl mx-auto text-lg'>
                        開始今日的三謀大學習。
                    </p>
                </div>

                {/* Navigation Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl px-4'>
                    {tools.map((tool) => (
                        <Link key={tool.href} href={tool.href} className='block group'>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: tool.delay, duration: 0.3 }}
                                whileHover={{ y: -20 }}
                                className='h-full glass rounded-xl p-8 group-hover:bg-white/5 group-hover:border-accent-gold/30 flex flex-col'
                            >
                                <div
                                    className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-6 text-white bg-opacity-80`}
                                >
                                    <tool.icon size={24} />
                                </div>
                                <h3 className='text-xl font-serif mb-3 group-hover:text-accent-gold transition-colors'>
                                    {tool.title}
                                </h3>
                                <p className='text-foreground-muted text-sm leading-relaxed mb-6 grow'>
                                    {tool.description}
                                </p>
                                <div className='flex items-center text-accent-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 transition-transform'>
                                    立即進入 <ChevronRight size={16} className='ml-1' />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Quick Search Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className='mt-24 w-full max-w-4xl px-4 py-8 rounded-2xl glass border-dashed border-white/10 flex flex-col md:flex-row items-center justify-between gap-6'
                >
                    <div className='flex-1'>
                        <h4 className='text-lg font-serif mb-1'>快速查詢</h4>
                        <p className='text-foreground-muted text-sm'>
                            輸入武將或戰法名稱，直接獲取核心數值。
                        </p>
                    </div>
                    <div className='flex-1 w-full relative' ref={searchRef}>
                        <div className='relative'>
                            <input
                                type='text'
                                placeholder='例如：諸葛亮、奇正相生...'
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowResults(true);
                                }}
                                onFocus={() => setShowResults(true)}
                                className='w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:border-accent-gold/50 text-sm'
                            />
                            <Search
                                className='absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted'
                                size={16}
                            />
                        </div>

                        {/* Results Dropdown */}
                        {showResults && searchTerm && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='absolute top-full left-0 right-0 mt-2 p-3 bg-surface border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden'
                            >
                                {filteredGenerals.length === 0 && filteredTactics.length === 0 ? (
                                    <div className='py-4 text-center text-xs text-foreground-muted'>
                                        未找到相關結果
                                    </div>
                                ) : (
                                    <div className='space-y-3'>
                                        {filteredGenerals.length > 0 && (
                                            <div>
                                                <div className='text-[10px] font-bold text-accent-gold uppercase tracking-widest px-2 mb-1'>
                                                    武將
                                                </div>
                                                {filteredGenerals.map((g) => (
                                                    <Link
                                                        key={g.name}
                                                        href={`/generals/${encodeURIComponent(g.name)}`}
                                                        className='flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-lg transition-colors group'
                                                    >
                                                        <div className='relative w-8 h-8 rounded border border-white/10 overflow-hidden bg-white/5'>
                                                            <Image
                                                                src={g.image}
                                                                alt={g.name}
                                                                fill
                                                                sizes='40px'
                                                                className='object-cover'
                                                            />
                                                        </div>
                                                        <span className='text-sm font-medium group-hover:text-accent-gold transition-colors'>
                                                            {g.name}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                        {filteredTactics.length > 0 && (
                                            <div>
                                                <div className='text-[10px] font-bold text-accent-gold uppercase tracking-widest px-2 mb-1'>
                                                    戰法
                                                </div>
                                                {filteredTactics.map((t) => (
                                                    <Link
                                                        key={t.name}
                                                        href={`/tactics/${encodeURIComponent(t.name)}`}
                                                        className='flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-lg transition-colors group'
                                                    >
                                                        <div className='w-8 h-8 rounded border border-white/10 bg-white/10 flex items-center justify-center font-serif font-black text-[10px] text-accent-gold'>
                                                            {t.rank}
                                                        </div>
                                                        <span className='text-sm font-medium group-hover:text-accent-gold transition-colors'>
                                                            {t.name}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
