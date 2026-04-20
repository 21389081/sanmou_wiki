'use client';

import { motion } from 'motion/react';
import { Sparkles, Target, Swords, Zap } from 'lucide-react';

interface BuffItem {
    name: string;
    effect: string;
}

function BuffCard({ item }: { item: BuffItem }) {
    return (
        <div className='p-4 rounded-xl border border-white/10 bg-white/5 hover:border-accent-gold/30 hover:bg-accent-gold/5 transition-all duration-300'>
            <h3 className='text-lg font-serif mb-2 text-accent-gold'>{item.name}</h3>
            <p className='text-sm text-foreground-muted leading-relaxed'>{item.effect}</p>
        </div>
    );
}

const functionalBuffs: BuffItem[] = [
    { name: '清醒', effect: '免疫控制狀態' },
    { name: '抵禦', effect: '最多持有2層，受到傷害時，消耗1層抵禦使該次傷害降至70-90%' },
    { name: '必中', effect: '造成的傷害無法被規避' },
    { name: '破禦', effect: '造成的傷害無法被抵禦' },
    { name: '伏兵', effect: '戰鬥開始後前2回合可隱藏於我軍後排，不會被選中為目標' },
];

const normalBuffs: BuffItem[] = [
    { name: '會心', effect: '造成兵刃傷害時，有概率使該次傷害提升50%' },
    { name: '奇謀', effect: '造成謀略傷害時，有概率使該次傷害提升50%' },
    { name: '破甲', effect: '造成兵刃傷害時，無視目標部分統率' },
    { name: '看破', effect: '造成謀略傷害時，無視目標部分智力' },
    { name: '倒戈', effect: '造成兵刃傷害時，根據傷害恢復自身兵力' },
    { name: '攻心', effect: '造成謀略傷害時，根據傷害恢復自身兵力' },
    { name: '連擊', effect: '可額外進行1次普通攻擊' },
    {
        name: '反擊',
        effect: '受到普通攻擊後，有概率對攻擊方進行1次強力普通攻擊（不觸發追擊戰法，每回合最多反擊5次）',
    },
];

const layoutEffects: BuffItem[] = [
    { name: '布陣一', effect: '清醒' },
    { name: '布陣二', effect: '一層抵禦' },
    { name: '布陣三', effect: '謀略傷害提升8%' },
    { name: '布陣四', effect: '15%奇謀' },
    { name: '布陣五', effect: '攻心提升10%' },
    { name: '布陣六', effect: '統帥提升20點' },
    { name: '布陣七', effect: '智力提升20點' },
    { name: '布陣八', effect: '看破提升20%' },
];

const chessBuffs: BuffItem[] = [
    { name: '單前排陣型', effect: '我軍前排受到傷害降低12%（受智力影響），受擊率固定為85%' },
    {
        name: '雙前排陣型',
        effect: '我軍統率最低單體對前排造成傷害提升20%，每回合行動時對敵軍隨機1-2人造成160%傷害',
    },
    { name: '三前排陣型', effect: '每回合結束後我軍智力最高單體對敵軍全體造成60%謀略傷害' },
];

const specialDamageTypes: BuffItem[] = [
    { name: '逃兵', effect: '傷害值只受攻擊方屬性影響，可破除抵禦且無法被規避，不會觸發其他效果' },
    { name: '傳遞傷害', effect: '傷害值僅受原傷害值影響，無法多次傳遞' },
];

const nonControlStatus: BuffItem[] = [
    { name: '洪水', effect: '統率降低20點' },
    { name: '火攻', effect: '智力降低15點' },
    { name: '風暴', effect: '先攻降低30點' },
    { name: '畏懼', effect: '受到傷害提升10%' },
    { name: '妖術', effect: '會心和奇謀傷害降低15%' },
];

const controlStatus: BuffItem[] = [
    { name: '震懾', effect: '無法行動' },
    { name: '繳械', effect: '無法普通攻擊' },
    { name: '技窮', effect: '無法發動主動戰法' },
    { name: '混亂', effect: '普通攻擊、追擊戰法和主動戰法無差別選擇目標' },
    { name: '嘲諷', effect: '強制普通攻擊嘲諷施加者' },
    { name: '虛弱', effect: '造成的最終傷害降低70%' },
    { name: '斷糧', effect: '受到的恢復兵力效果降低70%' },
];

const generalDebuffs: BuffItem[] = [
    {
        name: '常規負面狀態',
        effect: '某些特殊戰法產生的負面狀態，包括但不限於：造成傷害降低、受到傷害提升和屬性降低等',
    },
];

export default function BuffsPage() {
    return (
        <div className='py-12 md:py-20 max-w-5xl mx-auto px-4'>
            <header className='mb-12 text-center'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className='mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-qun/10 text-qun border border-qun/20'
                >
                    <Swords size={32} />
                </motion.div>
                <h1 className='text-4xl font-serif mb-4 text-accent-gold'>狀態一覽</h1>
                <p className='text-foreground-muted text-lg max-w-2xl mx-auto'>
                    遊戲中的增益、異常狀態、自帶戰法特殊狀態、特殊傷害類型一覽。
                </p>
            </header>

            <section className='mb-16'>
                <h2 className='text-3xl font-serif mb-8 flex items-center gap-3'>
                    <Sparkles size={32} className='text-accent-gold' />
                    增益狀態（Buff）
                </h2>

                <h3 className='text-xl font-serif mb-6 flex items-center gap-2 text-white/60'>
                    功能性增益狀態
                </h3>
                <div className='grid gap-4 md:grid-cols-2 mb-8'>
                    {functionalBuffs.map((item) => (
                        <BuffCard key={item.name} item={item} />
                    ))}
                </div>

                <h3 className='text-xl font-serif mb-6 flex items-center gap-2 text-white/60'>
                    常規增益狀態
                </h3>
                <div className='grid gap-4 md:grid-cols-2 mb-8'>
                    {normalBuffs.map((item) => (
                        <BuffCard key={item.name} item={item} />
                    ))}
                </div>

                <h3 className='text-xl font-serif mb-6 flex items-center gap-2 text-white/60'>
                    布陣狀態（司馬懿）
                </h3>
                <div className='grid gap-4 md:grid-cols-2 mb-8'>
                    {layoutEffects.map((item) => (
                        <BuffCard key={item.name} item={item} />
                    ))}
                </div>

                <h3 className='text-xl font-serif mb-6 flex items-center gap-2 text-white/60'>
                    棋局增益（SP 諸葛亮）
                </h3>
                <div className='grid gap-4 md:grid-cols-2 mb-8'>
                    {chessBuffs.map((item) => (
                        <BuffCard key={item.name} item={item} />
                    ))}
                </div>

                <h3 className='text-xl font-serif mb-6 flex items-center gap-2 text-white/60'>
                    其他增益狀態
                </h3>
                <div className='grid gap-4 md:grid-cols-2'>
                    <div className='p-4 rounded-xl border border-white/10 bg-white/5'>
                        <h3 className='text-lg font-serif mb-2 text-accent-gold'>特殊增益狀態</h3>
                        <p className='text-sm text-foreground-muted leading-relaxed'>
                            某些特殊戰法產生增益狀態，包括但不限於：造成傷害提升、受到傷害降低和屬性提升等
                        </p>
                    </div>
                </div>
            </section>

            <section className='mb-16'>
                <h2 className='text-3xl font-serif mb-8 flex items-center gap-3'>
                    <Zap size={32} className='text-accent-gold' />
                    特殊傷害類型
                </h2>
                <div className='grid gap-4 md:grid-cols-2'>
                    {specialDamageTypes.map((item) => (
                        <BuffCard key={item.name} item={item} />
                    ))}
                </div>
            </section>

            <section>
                <h2 className='text-3xl font-serif mb-8 flex items-center gap-3'>
                    <Target size={32} className='text-accent-gold' />
                    負面狀態
                </h2>

                <h3 className='text-xl font-serif mb-6 flex items-center gap-2 text-white/60'>
                    非控制狀態
                </h3>
                <div className='grid gap-4 md:grid-cols-2 mb-8'>
                    {nonControlStatus.map((item) => (
                        <BuffCard key={item.name} item={item} />
                    ))}
                </div>

                <h3 className='text-xl font-serif mb-6 flex items-center gap-2 text-white/60'>
                    控制狀態
                </h3>
                <div className='grid gap-4 md:grid-cols-2 mb-8'>
                    {controlStatus.map((item) => (
                        <BuffCard key={item.name} item={item} />
                    ))}
                </div>

                <h3 className='text-xl font-serif mb-6 flex items-center gap-2 text-white/60'>
                    其他負面狀態
                </h3>
                <div className='grid gap-4 md:grid-cols-2'>
                    {generalDebuffs.map((item) => (
                        <BuffCard key={item.name} item={item} />
                    ))}
                </div>
            </section>
        </div>
    );
}
