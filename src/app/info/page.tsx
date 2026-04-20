'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Info, Globe, MessageSquare, Video, User, ExternalLink } from 'lucide-react';

interface LinkCardProps {
    title: string;
    description: string;
    href: string;
    icon: React.ElementType;
    external?: boolean;
    color: string;
}

function LinkCard({ title, description, href, icon: Icon, external, color }: LinkCardProps) {
    const content = (
        <motion.div
            whileHover={{ y: -5 }}
            className={`p-6 rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-accent-gold/30 hover:bg-accent-gold/5`}
        >
            <div className={`mb-4 ${color}`}>
                <Icon size={28} />
            </div>
            <h3 className='text-xl font-serif mb-2 flex items-center gap-2'>
                {title}
                {external && <ExternalLink size={14} className='opacity-50' />}
            </h3>
            <p className='text-foreground-muted leading-relaxed'>{description}</p>
        </motion.div>
    );

    if (external) {
        return (
            <a href={href} target='_blank' rel='noopener noreferrer' className='block'>
                {content}
            </a>
        );
    }

    return (
        <Link href={href} className='block'>
            {content}
        </Link>
    );
}

export default function InfoPage() {
    return (
        <div className='py-12 md:py-20 max-w-4xl mx-auto px-4'>
            <header className='mb-12 text-center'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className='mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-qun/10 text-qun border border-qun/20'
                >
                    <Info size={32} />
                </motion.div>
                <h1 className='text-4xl font-serif mb-4 text-accent-gold'>關於本站</h1>
                <p className='text-foreground-muted text-lg max-w-2xl mx-auto'>
                    本資料庫是一個非官方的《三國：謀定天下》武將與戰法資料查詢網站，旨在幫助玩家快速查找武將屬性、戰法效果與陣容搭配，未來還會更新其他功能，敬請期待。
                </p>
            </header>

            <section className='mb-12'>
                <h2 className='text-2xl font-serif mb-6 flex items-center gap-2'>
                    <Globe size={24} className='text-accent-gold' />
                    相關連結
                </h2>
                <div className='grid gap-6 md:grid-cols-2'>
                    <LinkCard
                        title='台港澳新馬服官網'
                        description='《三國：謀定天下》台港澳服官方網站。'
                        href='https://newslg.biligames.com/index/'
                        icon={Globe}
                        external
                        color='text-accent-gold'
                    />
                    <LinkCard
                        title='陸服官網'
                        description='《三國：謀定天下》陸服官方網站。'
                        href='https://game.bilibili.com/nslg/gw/'
                        icon={Globe}
                        external
                        color='text-red-400'
                    />
                    <LinkCard
                        title='官方攻略站'
                        description='官方攻略資訊站。'
                        href='https://newslg.biligames.com/gameguide/h5/#/'
                        icon={MessageSquare}
                        external
                        color='text-blue-400'
                    />
                    <LinkCard
                        title='官方 Discord 伺服器'
                        description='內有官方工作人員以及各路好手，可以得到第一手資料。'
                        href='https://discord.gg/G9XT7fRZ'
                        icon={MessageSquare}
                        external
                        color='text-indigo-400'
                    />
                    <LinkCard
                        title='官方 Line 群'
                        description='內有官方工作人員以及各路好手，可以得到第一手資料。'
                        href='https://line.me/ti/g2/Q6rRJ1NOsnLfD_E6Mz0edIuCoyfzeS42h5yu4Q?utm_source=invitation&utm_medium=link_copy&utm_campaign=default'
                        icon={MessageSquare}
                        external
                        color='text-green-500'
                    />
                    <LinkCard
                        title='官方 FB 社團'
                        description='內有官方工作人員以及各路好手，可以得到第一手資料。'
                        href='https://www.facebook.com/share/g/1Ch4hGGmMH/'
                        icon={MessageSquare}
                        external
                        color='text-blue-500'
                    />
                    <LinkCard
                        title='官方 Bilibili'
                        description='官方 Bilibili 頻道，台港澳區玩家也可以預習預習（笑）。'
                        href='https://space.bilibili.com/3493265273785301?spm_id_from=333.337.0.0'
                        icon={Video}
                        external
                        color='text-pink-400'
                    />
                </div>
            </section>

            <section className='mb-12'>
                <h2 className='text-2xl font-serif mb-6 flex items-center gap-2'>
                    <Globe size={24} className='text-accent-gold' />
                    相關網站
                </h2>
                <div className='grid gap-6 md:grid-cols-2'>
                    <LinkCard
                        title='三謀助手'
                        description='別的玩家製作的網站，也是我製作本站的靈感來源，內有許多實用功能，歡迎過去逛逛。'
                        href='https://www.sgmdtx.com/'
                        icon={Globe}
                        external
                        color='text-green-400'
                    />
                </div>
            </section>

            <section className='mb-12'>
                <h2 className='text-2xl font-serif mb-6 flex items-center gap-2'>
                    <Video size={24} className='text-accent-gold' />
                    主播相關頻道
                </h2>
                <div className='p-12 glass rounded-2xl border-white/5 text-center'>
                    <p className='text-2xl font-serif text-accent-gold'>廣告位招租中~</p>
                </div>
            </section>

            <section className='mb-12'>
                <h2 className='text-2xl font-serif mb-6 flex items-center gap-2'>
                    <User size={24} className='text-accent-gold' />
                    個人連結
                </h2>
                <div className='grid gap-6 md:grid-cols-2'>
                    <LinkCard
                        title='阿祐小舖官方Line帳號'
                        description='開荒控號需求或是單純來聊聊天都可以~'
                        href='https://lin.ee/Uk2HqRE'
                        icon={MessageSquare}
                        external
                        color='text-green-500'
                    />
                </div>
            </section>

            <div className='mt-16 p-8 glass rounded-2xl border-white/5 text-center'>
                <p className='text-foreground-muted text-sm'>
                    本網站為粉絲製作的非官方作品，僅供學習與交流使用。
                    <br />
                    遊戲內容歸屬於杭州浮云网络科技有限公司與浙江华娱网络科技有限公司。
                </p>
            </div>
        </div>
    );
}
