'use client';

import { motion } from 'motion/react';
import { Sparkles, Target, Swords, Shield } from 'lucide-react';

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

const mountEffects: BuffItem[] = [
    { name: '聰慧', effect: '受到謀略傷害降低3%' },
    { name: '照影', effect: '造成傷害提升2%' },
    { name: '靈心', effect: '會心和奇謀傷害提升5%' },
    { name: '稅目', effect: '會心和奇謀幾率提升2%' },
    { name: '碎巖', effect: '破甲和看破提升2%' },
    { name: '靈巧', effect: '規避率提升2%' },
    { name: '神速', effect: '先攻提升6點' },
    { name: '赤燄', effect: '受到謀略傷害降低4%（稀有）' },
    { name: '驚弦', effect: '先攻提升8點（稀有）' },
    { name: '傲骨', effect: '會心和奇謀傷害提升6%（稀有）' },
    { name: '掣電', effect: '破甲和看破提升3%（稀有）' },
    { name: '流火', effect: '會心和奇謀幾率提升3%（稀有）' },
    { name: '狂意', effect: '造成傷害提升3%（稀有）' },
    { name: '困龍', effect: '規避率提升3%（稀有）' },
    { name: '盪寇', effect: '對賊寇造成傷害提升8%' },
    { name: '摧城', effect: '對城池守軍造成傷害提升7%' },
    { name: '破虜', effect: '對土地守軍造成傷害提升7%' },
];

const mountSpecialSkills: BuffItem[] = [
    { name: '掠水', effect: '戰鬥第2回合，對敵軍隨機單體施加洪水狀態，持續2回合' },
    { name: '渡火', effect: '戰鬥第2回合，使友軍隨機單體施加火攻狀態，持續2回合' },
    { name: '嘶風', effect: '戰鬥第2回合，對敵軍隨機單體施加風暴狀態，持續2回合' },
    { name: '救主', effect: '首次受到超過當前兵力10%的傷害後，提升20點統率，持續2回合' },
    { name: '奔襲', effect: '戰鬥首回合，首次普通攻擊後產生先攻值100%的逃兵' },
    { name: '疾馳', effect: '戰鬥開始時，提升10點先攻，持續2回合' },
    { name: '穿雲', effect: '戰鬥第2回合，破甲和看破提升5%，持續2回合' },
    { name: '游龍', effect: '戰鬥第2回合，驅散友軍單體隨機1種負面狀態' },
    { name: '萬象', effect: '戰鬥第2回合，使友軍隨機單體全屬性提升2%，持續2回合' },
    { name: '君臨', effect: '戰鬥第2回合，使友軍隨機單體造成傷害提升6%，持續2回合' },
];

const equipmentEffects: BuffItem[] = [
    { name: '打磨', effect: '造成兵刀傷害提升3%' },
    { name: '斷虹', effect: '破甲和看破提升2%' },
    { name: '神鋒', effect: '普通攻擊傷害提升5%' },
    { name: '決機', effect: '主動戰法傷害提升3%' },
    { name: '窮堵', effect: '追擊戰法傷害提升3%' },
    { name: '癒合', effect: '受到治療效果提升4%' },
    { name: '堅甲', effect: '受到兵刃傷害降低3%' },
    { name: '鐵壁', effect: '受到傷害降低2%' },
    { name: '肅靜', effect: '受到追擊戰法傷害降低5%' },
    { name: '鎮定', effect: '受到主動戰法傷害降低5%' },
    { name: '不屈', effect: '受到普通攻擊傷害降低8%' },
    { name: '靈光', effect: '造成謀略傷害提升3%' },
    { name: '勵車', effect: '倒戈和攻心提升3%' },
    { name: '守拙', effect: '統率提升6點' },
    { name: '克己', effect: '會心和奇謀幾率提升2%' },
    { name: '守心', effect: '會心和奇謀傷害提升4%' },
    { name: '蕩寇', effect: '對賊寇造成傷害提升8%' },
    { name: '摧城', effect: '對城池守軍造成傷害提升7%' },
    { name: '破虜', effect: '對土地守軍造成傷害提升7%' },
];

const equipmentSpecialSkills: BuffItem[] = [
    { name: '無雙', effect: '方天畫戟專屬特技，呂布裝備時自帶戰法發動率提升15%，成功發動後失效' },
    {
        name: '武聖',
        effect: '青龍偃月刀專屬特技，關羽裝備時，戰鬥首回合，自帶戰法發動率提升8%同時免疫技窮',
    },
    {
        name: '仁德',
        effect: '雌雄雙股劍專屬特技，劉備裝備時，戰鬥開始時，我軍隨機兩人全屬性提升3%',
    },
    {
        name: '奸雄',
        effect: '青釭劍專屬特技，曹操裝備時，戰鬥首回合，使敵軍隨機兩人最高屬性降低8%，持續2回合',
    },
    { name: '風華', effect: '孔雀羽扇專屬特技，周瑜裝備時，奇謀幾率提升10%' },
    { name: '謀定', effect: '戰鬥第7回合，會心和奇謀幾率提升12%，持續至戰鬥結束' },
    { name: '神威', effect: '累計造成兵刃傷害後，提高自身1點武力，最多疊加10次，持續至戰鬥結束' },
    { name: '奪志', effect: '造成謀略傷害後，有30%的概率降低目標6點統率，持續1回合' },
    { name: '神射', effect: '戰鬥第4回合，自身獲得必中狀態，持續1回合' },
    { name: '藏鋒', effect: '戰鬥第5回合，對敵方兵力最低造成30%兵刃傷害' },
    { name: '扶危', effect: '戰鬥第4回合，倒戈和攻心提升9%，持續2回合' },
    { name: '先御', effect: '戰鬥第2回合，自身獲得1層抵禦' },
    { name: '護衛', effect: '戰鬥第3回合，嘲諷敵軍隨機單體，持續1回合' },
    { name: '意志', effect: '戰鬥第4回合，自身獲得清醒狀態，持續1回合' },
    { name: '無畏', effect: '戰鬥第2回合，自身免疫繳械狀態，持續1回合' },
    { name: '集智', effect: '戰鬥第3回合，自身免疫技窮狀態，持續1回合' },
    { name: '靜心', effect: '戰鬥首回合，自身免疫混亂狀態，持續1回合' },
    { name: '援救', effect: '戰鬥第2回合，恢復友軍隨機單體兵力（治療率35%）' },
    { name: '說術', effect: '戰鬥第6回合，對敵軍隨機單體施加繳械或技窮，持續1回合' },
    { name: '非攻', effect: '戰鬥第2回合，使敵軍隨機單體會心和奇謀傷害降低10%，持續2回合' },
];

export default function StatsPage() {
    return (
        <div className='py-12 md:py-20 max-w-5xl mx-auto px-4'>
            <header className='mb-12 text-center'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className='mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-qun/10 text-qun border border-qun/20'
                >
                    <Shield size={32} />
                </motion.div>
                <h1 className='text-4xl font-serif mb-4 text-accent-gold'>詞條一覽</h1>
                <p className='text-foreground-muted text-lg max-w-2xl mx-auto'>
                    遊戲中的裝備、馬匹的特效與特技一覽。
                </p>
            </header>

            <section className='mb-16'>
                <h2 className='text-3xl font-serif mb-8 flex items-center gap-3'>
                    <Sparkles size={32} className='text-accent-gold' />
                    坐騎特效
                </h2>
                <div className='grid gap-4 md:grid-cols-2'>
                    {mountEffects.map((item) => (
                        <BuffCard key={item.name} item={item} />
                    ))}
                </div>
            </section>

            <section className='mb-16'>
                <h2 className='text-3xl font-serif mb-8 flex items-center gap-3'>
                    <Target size={32} className='text-accent-gold' />
                    坐騎特技
                </h2>
                <div className='grid gap-4 md:grid-cols-2'>
                    {mountSpecialSkills.map((item) => (
                        <BuffCard key={item.name} item={item} />
                    ))}
                </div>
            </section>

            <section className='mb-16'>
                <h2 className='text-3xl font-serif mb-8 flex items-center gap-3'>
                    <Sparkles size={32} className='text-accent-gold' />
                    裝備特效
                </h2>
                <div className='grid gap-4 md:grid-cols-2'>
                    {equipmentEffects.map((item) => (
                        <BuffCard key={item.name} item={item} />
                    ))}
                </div>
            </section>

            <section>
                <h2 className='text-3xl font-serif mb-8 flex items-center gap-3'>
                    <Target size={32} className='text-accent-gold' />
                    裝備特技
                </h2>
                <div className='grid gap-4 md:grid-cols-2'>
                    {equipmentSpecialSkills.map((item) => (
                        <BuffCard key={item.name} item={item} />
                    ))}
                </div>
            </section>
        </div>
    );
}
