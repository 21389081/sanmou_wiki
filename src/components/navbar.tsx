'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Home, Users, Sword, Menu, X, ScrollText } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { getGeneralImage, getTacticImage } from '@/lib/supabase/storage';

type General = {
  gid: number;
  名稱: string;
  頭像: string;
};

type Tactic = {
  tid: number;
  戰法名稱: string;
  圖示: string;
  品質: string;
};

const navItems = [
    { name: '首頁', href: '/', icon: Home },
    { name: '武將圖鑑', href: '/generals', icon: Users },
    { name: '戰法圖鑑', href: '/tactics', icon: Sword },
    {
        name: '官方攻略站',
        href: 'https://newslg.biligames.com/gameguide/h5/#/',
        icon: ScrollText,
        external: true,
    },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [prevPathname, setPrevPathname] = useState(pathname);
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [generals, setGenerals] = useState<General[]>([]);
    const [tactics, setTactics] = useState<Tactic[]>([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            const [{ data: g }, { data: t }] = await Promise.all([
                supabase.from('generals_info').select('gid, 名稱, 頭像'),
                supabase.from('tactics_info').select('tid, 戰法名稱, 圖示, 品質'),
            ]);
            setGenerals((g || []).map(i => ({
                ...i,
                頭像: getGeneralImage(i.頭像),
            })));
            setTactics((t || []).map(i => ({
                ...i,
                圖示: getTacticImage(i.圖示),
                品質: i.品質 === 'orange' ? '橙' : i.品質 === 'purple' ? '紫' : '藍',
            })));
            setDataLoaded(true);
        };
        if (!dataLoaded) fetchData();
    }, [dataLoaded]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredGenerals = searchTerm
        ? generals.filter(g => g.名稱.includes(searchTerm)).slice(0, 3)
        : [];
    const filteredTactics = searchTerm
        ? tactics.filter(t => t.戰法名稱.includes(searchTerm)).slice(0, 3)
        : [];

    // Close menu when route changes - Using the recommended pattern for adjusting state based on props/hooks
    if (pathname !== prevPathname) {
        setPrevPathname(pathname);
        setIsOpen(false);
    }

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <nav className='fixed top-0 left-0 right-0 z-50 bg-background'>
            <div className='max-w-7xl mx-auto px-4 h-16 flex items-center justify-between relative z-50 bg-background'>
                <div className='flex items-center gap-8'>
                    <Link href='/' className='flex items-center gap-2 group'>
                        <div className='w-8 h-8 bg-accent-gold rounded-sm flex items-center justify-center text-background font-bold text-lg rotate-45 group-hover:rotate-0 transition-transform duration-500'>
                            <span className='-rotate-45 group-hover:rotate-0 transition-transform'>
                                謀
                            </span>
                        </div>
                        <span className='text-xl font-serif text-accent-gold'>三謀資料庫</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className='hidden md:flex items-center gap-1'>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const isExternal = item.href.startsWith('http');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    target={isExternal ? '_blank' : undefined}
                                    rel={isExternal ? 'noopener noreferrer' : undefined}
                                    className={cn(
                                        'px-4 py-2 rounded-md text-sm relative group flex items-center gap-2 transition-colors',
                                        isActive
                                            ? 'text-accent-gold'
                                            : 'text-foreground-muted hover:text-foreground',
                                    )}
                                >
                                    <item.icon size={16} />
                                    <span>{item.name}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId='nav-active'
                                            className='absolute bottom-0 left-0 right-0 h-0.5 bg-accent-gold'
                                            transition={{
                                                type: 'spring',
                                                bounce: 0.2,
                                                duration: 0.6,
                                            }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className='flex items-center gap-4'>
                    {/* Desktop Search */}
                    <div className='relative group hidden sm:block' ref={searchRef}>
                        <Search
                            className='absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-accent-gold transition-colors'
                            size={16}
                        />
                        <input
                            type='text'
                            placeholder='搜尋武將、戰法...'
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setShowResults(true); }}
                            onFocus={() => setShowResults(true)}
                            className='bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-accent-gold/50 focus:bg-white/10 transition-all w-48 lg:w-64'
                        />
                        {showResults && searchTerm && dataLoaded && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='absolute top-full left-0 right-0 mt-2 p-2 bg-surface border border-white/10 rounded-lg shadow-xl z-50'
                            >
                                {filteredGenerals.length === 0 && filteredTactics.length === 0 ? (
                                    <div className='py-2 text-center text-xs text-foreground-muted'>未找到</div>
                                ) : (
                                    <div className='space-y-1'>
                                        {filteredGenerals.slice(0, 2).map(g => (
                                            <Link key={g.gid} href={`/generals/${encodeURIComponent(g.名稱)}`} className='flex items-center gap-2 p-1.5 hover:bg-white/5 rounded'>
                                                <div className='relative w-6 h-6 rounded overflow-hidden bg-white/5'>
                                                    <Image src={g.頭像} alt={g.名稱} fill sizes="24px" className='object-cover' />
                                                </div>
                                                <span className='text-sm'>{g.名稱}</span>
                                            </Link>
                                        ))}
                                        {filteredTactics.slice(0, 2).map(t => (
                                            <Link key={t.tid} href={`/tactics/${encodeURIComponent(t.戰法名稱)}`} className='flex items-center gap-2 p-1.5 hover:bg-white/5 rounded'>
                                                <div className='relative w-6 h-6 rounded overflow-hidden bg-white/5'>
                                                    <Image src={t.圖示} alt={t.戰法名稱} fill sizes="24px" className='object-cover' />
                                                </div>
                                                <span className='text-sm'>{t.戰法名稱}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className='md:hidden text-foreground p-2 hover:bg-white/5 rounded-lg transition-colors relative z-50'
                        onClick={() => setIsOpen((prev) => !prev)}
                        aria-label='Toggle Menu'
                    >
                        <AnimatePresence mode='wait' initial={false}>
                            <motion.div
                                key={isOpen ? 'close' : 'menu'}
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 90 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </motion.div>
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className='absolute top-16 left-0 right-0 bg-background z-40 md:hidden flex flex-col p-6 shadow-2xl overflow-hidden'
                    >
                        {/* Mobile Search */}
                        <div className='relative mb-6' ref={searchRef}>
                            <Search
                                className='absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted'
                                size={16}
                            />
                            <input
                                type='text'
                                placeholder='搜尋武將或戰法...'
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setShowResults(true); }}
                                onFocus={() => setShowResults(true)}
                                className='w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-accent-gold/50'
                            />
                            {showResults && searchTerm && dataLoaded && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className='absolute top-full left-0 right-0 mt-2 p-2 bg-surface border border-white/10 rounded-lg shadow-xl z-50 max-h-60 overflow-auto'
                                >
                                    {filteredGenerals.length === 0 && filteredTactics.length === 0 ? (
                                        <div className='py-2 text-center text-xs text-foreground-muted'>未找到</div>
                                    ) : (
                                        <div className='space-y-1'>
                                            {filteredGenerals.slice(0, 3).map(g => (
                                                <Link key={g.gid} href={`/generals/${encodeURIComponent(g.名稱)}`} onClick={() => setIsOpen(false)} className='flex items-center gap-2 p-2 hover:bg-white/5 rounded'>
                                                    <div className='relative w-6 h-6 rounded overflow-hidden bg-white/5'>
<Image src={g.頭像} alt={g.名稱} fill sizes="24px" className='object-cover' />
                                                    </div>
                                                    <span className='text-sm'>{g.名稱}</span>
                                                </Link>
                                            ))}
                                            {filteredTactics.slice(0, 3).map(t => (
                                                <Link key={t.tid} href={`/tactics/${encodeURIComponent(t.戰法名稱)}`} onClick={() => setIsOpen(false)} className='flex items-center gap-2 p-2 hover:bg-white/5 rounded'>
                                                    <div className='relative w-6 h-6 rounded overflow-hidden bg-white/5'>
                                                        <Image src={t.圖示} alt={t.戰法名稱} fill sizes="24px" className='object-cover' />
                                                    </div>
                                                    <span className='text-sm'>{t.戰法名稱}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        {/* Mobile Nav Items */}
                        <div className='flex flex-col gap-2'>
                            {navItems.map((item, index) => {
                                const isActive = pathname === item.href;
                                const isExternal = item.href.startsWith('http');
                                return (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            href={item.href}
                                            target={isExternal ? '_blank' : undefined}
                                            rel={isExternal ? 'noopener noreferrer' : undefined}
                                            className={cn(
                                                'flex items-center gap-3 p-4 rounded-xl text-base transition-all border border-transparent',
                                                isActive
                                                    ? 'bg-accent-gold/10 text-accent-gold font-bold'
                                                    : 'bg-white/2 text-foreground-muted',
                                            )}
                                        >
                                            <item.icon size={20} />
                                            <span className='grow'>{item.name}</span>
                                            {isActive && (
                                                <div className='w-1.5 h-1.5 rounded-full bg-accent-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]' />
                                            )}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className='mt-8 text-center text-[10px] text-foreground-muted/30 uppercase tracking-[0.3em] font-medium'>
                            The Best Database For SLG
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
