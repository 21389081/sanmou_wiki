'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Home, Users, Sword, Info, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: '首頁', href: '/', icon: Home },
    { name: '武將圖鑑', href: '/generals', icon: Users },
    { name: '戰法圖鑑', href: '/tactics', icon: Sword },
    {
        name: '新手攻略',
        href: 'https://newslg.biligames.com/gameguide/h5/#/',
        icon: Info,
        external: true,
    },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [prevPathname, setPrevPathname] = useState(pathname);

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
                    <div className='relative group hidden sm:block'>
                        <Search
                            className='absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-accent-gold transition-colors'
                            size={16}
                        />
                        <input
                            type='text'
                            placeholder='搜尋武將、戰法...'
                            className='bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-accent-gold/50 focus:bg-white/10 transition-all w-48 lg:w-64'
                        />
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
                        <div className='relative mb-6'>
                            <Search
                                className='absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted'
                                size={16}
                            />
                            <input
                                type='text'
                                placeholder='搜尋武將或戰法...'
                                className='w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-accent-gold/50'
                            />
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
