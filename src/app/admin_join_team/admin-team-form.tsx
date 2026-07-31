'use client';

import { FormEvent, useMemo, useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import {
    AlertCircle,
    CheckCircle2,
    ClipboardCheck,
    FilePlus2,
    Loader2,
    LogOut,
    ScrollText,
    ShieldCheck,
    Sparkles,
    Swords,
    UserRound,
    X,
} from 'lucide-react';
import { getGeneralImage } from '@/lib/supabase/storage';
import { createTeamAction, logoutAdminAction } from './actions';
import SearchSelect, { type SearchOption } from './search-select';
import {
    FORMATIONS,
    type GeneralOption,
    type TacticOption,
    type TeamDraft,
    type TeamMemberDraft,
} from './types';

type AdminTeamFormProps = {
    generals: GeneralOption[];
    tactics: TacticOption[];
    tiers: string[];
    seasons: string[];
};

type EditableMemberField = Exclude<keyof TeamMemberDraft, 'position'>;

const POSITION_LABELS = ['壹號位', '貳號位', '參號位'];

function createEmptyMember(position: number): TeamMemberDraft {
    return {
        position,
        generalName: '',
        skill1: '',
        skill1Alt: '',
        skill2: '',
        skill2Alt: '',
        soldierType: '',
        soldierSkills: '',
        book1: '',
        book2: '',
        book3: '',
        equipPoint: '',
        plusPoints: '',
    };
}

function createEmptyDraft(): TeamDraft {
    return {
        teamName: '',
        tier: '',
        formation: '',
        season: '',
        members: [createEmptyMember(1), createEmptyMember(2), createEmptyMember(3)],
    };
}

function validateDraft(draft: TeamDraft, generals: Set<string>, tactics: Set<string>): string[] {
    const errors: string[] = [];
    if (!draft.teamName.trim()) errors.push('請填寫陣容名稱。');
    if (!/^S\d+$/i.test(draft.season.trim())) errors.push('賽季格式須為 S1、S2 等形式。');
    if (!/^T\d+(?:\.\d+)?$/i.test(draft.tier.trim())) errors.push('Tier 格式須為 T0、T0.5 等形式。');
    if (!FORMATIONS.includes(draft.formation as (typeof FORMATIONS)[number])) errors.push('請選擇陣型。');

    draft.members.forEach((member, index) => {
        const label = POSITION_LABELS[index];
        const missingSelections: string[] = [];
        const missingDetails: string[] = [];

        if (!member.generalName || !generals.has(member.generalName)) missingSelections.push('武將');
        if (!member.skill1 || !tactics.has(member.skill1)) missingSelections.push('戰法一');
        if (!member.skill2 || !tactics.has(member.skill2)) missingSelections.push('戰法二');
        if (missingSelections.length > 0) errors.push(`${label}尚未選擇有效的${missingSelections.join('、')}。`);

        if (member.skill1Alt && !tactics.has(member.skill1Alt)) errors.push(`${label}的戰法一備選無效。`);
        if (member.skill2Alt && !tactics.has(member.skill2Alt)) errors.push(`${label}的戰法二備選無效。`);

        if (!member.soldierType.trim()) missingDetails.push('兵種');
        if (!member.book1.trim() || !member.book2.trim() || !member.book3.trim()) missingDetails.push('三項兵書');
        if (!member.equipPoint.trim()) missingDetails.push('裝備屬性');
        if (!member.plusPoints.trim()) missingDetails.push('加點');
        if (missingDetails.length > 0) errors.push(`${label}尚未填寫${missingDetails.join('、')}。`);
    });

    const selectedGenerals = draft.members.map((member) => member.generalName).filter(Boolean);
    if (new Set(selectedGenerals).size !== selectedGenerals.length) errors.push('三個位置不可選擇重複武將。');

    const selectedTactics = draft.members
        .flatMap((member) => [member.skill1, member.skill1Alt, member.skill2, member.skill2Alt])
        .filter(Boolean);
    if (new Set(selectedTactics).size !== selectedTactics.length) errors.push('主要與備選戰法不可重複。');

    return errors;
}

function TextField({
    id,
    label,
    value,
    onChange,
    placeholder,
    optional = false,
    maxLength = 120,
    list,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    optional?: boolean;
    maxLength?: number;
    list?: string;
}) {
    return (
        <div>
            <label htmlFor={id} className='mb-1.5 flex items-center gap-2 text-xs text-foreground-muted'>
                {label}
                {optional && <span className='text-[10px] text-foreground-muted/60'>選填</span>}
            </label>
            <input
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                maxLength={maxLength}
                list={list}
                required={!optional}
                className='w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none transition placeholder:text-foreground-muted/45 focus:border-accent-gold/55 focus:ring-2 focus:ring-accent-gold/10'
            />
        </div>
    );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
    if (!value) return null;
    return (
        <div className='grid grid-cols-[5rem_1fr] gap-3 border-t border-white/7 py-2 text-xs'>
            <span className='text-foreground-muted'>{label}</span>
            <span className='whitespace-pre-wrap text-right'>{value}</span>
        </div>
    );
}

export default function AdminTeamForm({ generals, tactics, tiers, seasons }: AdminTeamFormProps) {
    const router = useRouter();
    const [draft, setDraft] = useState<TeamDraft>(createEmptyDraft);
    const [errors, setErrors] = useState<string[]>([]);
    const [submissionError, setSubmissionError] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [createdTeam, setCreatedTeam] = useState<{ id: number; name: string } | null>(null);
    const [isSubmitting, startSubmitTransition] = useTransition();
    const [isLoggingOut, startLogoutTransition] = useTransition();

    const generalNames = useMemo(() => new Set(generals.map((general) => general.name)), [generals]);
    const tacticNames = useMemo(() => new Set(tactics.map((tactic) => tactic.name)), [tactics]);
    const generalOptions = useMemo<SearchOption[]>(
        () => generals.map((general) => ({ value: general.name, label: general.name })),
        [generals],
    );
    const tacticOptions = useMemo<SearchOption[]>(
        () => tactics.map((tactic) => ({ value: tactic.name, label: tactic.name })),
        [tactics],
    );
    const generalByName = useMemo(
        () => new Map(generals.map((general) => [general.name, general])),
        [generals],
    );

    const selectedGenerals = draft.members.map((member) => member.generalName).filter(Boolean);
    const selectedTactics = draft.members
        .flatMap((member) => [member.skill1, member.skill1Alt, member.skill2, member.skill2Alt])
        .filter(Boolean);

    const updateBase = (field: 'teamName' | 'tier' | 'formation' | 'season', value: string) => {
        setDraft((current) => ({ ...current, [field]: value }));
        setCreatedTeam(null);
    };

    const updateMember = (index: number, field: EditableMemberField, value: string) => {
        setDraft((current) => ({
            ...current,
            members: current.members.map((member, memberIndex) =>
                memberIndex === index ? { ...member, [field]: value } : member,
            ),
        }));
        setCreatedTeam(null);
    };

    const openPreview = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmissionError('');
        const nextErrors = validateDraft(draft, generalNames, tacticNames);
        setErrors(nextErrors);
        if (nextErrors.length > 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setPreviewOpen(true);
    };

    const confirmCreate = () => {
        setSubmissionError('');
        startSubmitTransition(async () => {
            const result = await createTeamAction(draft);
            if (!result.success || !result.teamId) {
                setSubmissionError(result.message);
                if (result.message.includes('登入已逾時')) {
                    setPreviewOpen(false);
                    router.refresh();
                }
                return;
            }

            setCreatedTeam({ id: result.teamId, name: draft.teamName.trim() });
            setDraft(createEmptyDraft());
            setErrors([]);
            setPreviewOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    const handleLogout = () => {
        startLogoutTransition(async () => {
            await logoutAdminAction();
            router.refresh();
        });
    };

    return (
        <div className='relative pb-24 pt-7'>
            <div className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 overflow-hidden'>
                <div className='absolute left-1/2 top-0 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-accent-gold/6 blur-3xl' />
                <div className='absolute inset-x-0 top-28 h-px bg-gradient-to-r from-transparent via-accent-gold/20 to-transparent' />
            </div>

            <header className='mb-8 flex flex-col gap-5 border-b border-white/8 pb-7 sm:flex-row sm:items-end sm:justify-between'>
                <div>
                    <div className='mb-3 flex items-center gap-2 text-xs tracking-[0.26em] text-accent-gold'>
                        <ScrollText size={15} aria-hidden='true' />
                        內務府 · 配將卷宗
                    </div>
                    <h1 className='text-3xl font-serif sm:text-4xl'>新增陣容</h1>
                    <p className='mt-3 max-w-2xl text-sm leading-6 text-foreground-muted'>
                        建立完整三人陣容。所有資料會先整理成預覽卷宗，確認後才一次寫入資料庫。
                    </p>
                </div>
                <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-3 py-1.5 text-xs text-emerald-300'>
                        <ShieldCheck size={14} aria-hidden='true' />
                        管理員已驗證
                    </div>
                    <button
                        type='button'
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className='flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-foreground-muted transition hover:border-white/20 hover:text-foreground disabled:opacity-50'
                    >
                        {isLoggingOut ? <Loader2 size={14} className='animate-spin' /> : <LogOut size={14} />}
                        登出
                    </button>
                </div>
            </header>

            <AnimatePresence mode='wait'>
                {createdTeam && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className='mb-6 flex flex-col gap-4 rounded-xl border border-emerald-400/25 bg-emerald-400/8 p-4 sm:flex-row sm:items-center sm:justify-between'
                        role='status'
                    >
                        <div className='flex items-start gap-3'>
                            <CheckCircle2 className='mt-0.5 shrink-0 text-emerald-300' size={19} />
                            <div>
                                <p className='font-medium text-emerald-200'>「{createdTeam.name}」已完成入庫</p>
                                <p className='mt-1 text-xs text-foreground-muted'>陣容編號 #{createdTeam.id}，配將助手已可讀取此資料。</p>
                            </div>
                        </div>
                        <button
                            type='button'
                            onClick={() => setCreatedTeam(null)}
                            className='text-left text-xs text-emerald-200 underline decoration-emerald-300/40 underline-offset-4'
                        >
                            繼續新增
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {errors.length > 0 && (
                <div className='mb-6 rounded-xl border border-red-400/25 bg-red-400/7 p-4' role='alert'>
                    <div className='mb-2 flex items-center gap-2 font-medium text-red-200'>
                        <AlertCircle size={17} />
                        卷宗尚未完整
                    </div>
                    <ul className='grid gap-1 pl-6 text-sm text-red-100/80 sm:grid-cols-2'>
                        {errors.map((error) => <li key={error} className='list-disc'>{error}</li>)}
                    </ul>
                </div>
            )}

            <form onSubmit={openPreview} className='space-y-7' noValidate>
                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='glass relative rounded-2xl p-5 sm:p-6'
                    aria-labelledby='team-basics-title'
                >
                    <div className='absolute left-0 top-6 h-9 w-1 rounded-r bg-accent-gold' />
                    <div className='mb-5 flex items-center justify-between'>
                        <div>
                            <p className='text-[10px] tracking-[0.24em] text-accent-gold/70'>卷宗之一</p>
                            <h2 id='team-basics-title' className='mt-1 text-xl font-serif'>陣容基本資料</h2>
                        </div>
                        <FilePlus2 size={21} className='text-accent-gold/70' aria-hidden='true' />
                    </div>
                    <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
                        <TextField
                            id='team-name'
                            label='陣容名稱'
                            value={draft.teamName}
                            onChange={(value) => updateBase('teamName', value)}
                            placeholder='例如：紅顏弓'
                            maxLength={60}
                        />
                        <TextField
                            id='season'
                            label='賽季'
                            value={draft.season}
                            onChange={(value) => updateBase('season', value.toUpperCase())}
                            placeholder='選擇或輸入 S4'
                            maxLength={10}
                            list='season-options'
                        />
                        <TextField
                            id='tier'
                            label='Tier'
                            value={draft.tier}
                            onChange={(value) => updateBase('tier', value.toUpperCase())}
                            placeholder='選擇或輸入 T0.5'
                            maxLength={10}
                            list='tier-options'
                        />
                        <div>
                            <label htmlFor='formation' className='mb-1.5 block text-xs text-foreground-muted'>陣型</label>
                            <select
                                id='formation'
                                value={draft.formation}
                                onChange={(event) => updateBase('formation', event.target.value)}
                                required
                                className='w-full rounded-lg border border-white/10 bg-[#141414] px-3 py-2.5 text-sm outline-none transition focus:border-accent-gold/55 focus:ring-2 focus:ring-accent-gold/10'
                            >
                                <option value=''>選擇陣型</option>
                                {FORMATIONS.map((formation) => <option key={formation} value={formation}>{formation}</option>)}
                            </select>
                        </div>
                    </div>
                    <datalist id='season-options'>{seasons.map((season) => <option key={season} value={season} />)}</datalist>
                    <datalist id='tier-options'>{tiers.map((tier) => <option key={tier} value={tier} />)}</datalist>
                    <p className='mt-4 text-xs text-foreground-muted'>賽季與 Tier 可輸入新值；格式分別為 S＋數字、T＋整數或小數。</p>
                </motion.section>

                <section aria-labelledby='members-title'>
                    <div className='mb-4 flex items-end justify-between gap-4'>
                        <div>
                            <p className='text-[10px] tracking-[0.24em] text-accent-gold/70'>卷宗之二</p>
                            <h2 id='members-title' className='mt-1 text-xl font-serif'>三名武將配置</h2>
                        </div>
                        <p className='hidden text-xs text-foreground-muted sm:block'>標示「選填」以外皆須完整填寫</p>
                    </div>

                    <div className='grid gap-5 xl:grid-cols-3'>
                        {draft.members.map((member, index) => {
                            const selectedGeneral = generalByName.get(member.generalName);
                            const tacticDisabled = (current: string) => selectedTactics.filter((name) => name !== current);
                            return (
                                <motion.article
                                    key={member.position}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.06 * index }}
                                    className='relative rounded-2xl border border-white/10 bg-surface/80 p-4 shadow-xl shadow-black/15 sm:p-5'
                                >
                                    <div className='mb-5 flex items-center gap-3 border-b border-white/8 pb-4'>
                                        <div className='relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-accent-gold/20 bg-accent-gold/6'>
                                            {selectedGeneral ? (
                                                <Image
                                                    src={getGeneralImage(selectedGeneral.avatar)}
                                                    alt={selectedGeneral.name}
                                                    fill
                                                    sizes='48px'
                                                    className='object-cover'
                                                />
                                            ) : (
                                                <UserRound size={20} className='text-accent-gold/60' />
                                            )}
                                        </div>
                                        <div>
                                            <p className='text-[10px] tracking-[0.2em] text-accent-gold/70'>POSITION {index + 1}</p>
                                            <h3 className='mt-0.5 text-lg font-serif'>{POSITION_LABELS[index]}</h3>
                                        </div>
                                    </div>

                                    <div className='space-y-4'>
                                        <SearchSelect
                                            id={`general-${index}`}
                                            label='武將'
                                            value={member.generalName}
                                            options={generalOptions}
                                            onChange={(value) => updateMember(index, 'generalName', value)}
                                            placeholder='搜尋武將姓名'
                                            disabledValues={selectedGenerals.filter((name) => name !== member.generalName)}
                                        />

                                        <div className='rounded-xl border border-white/7 bg-black/10 p-3.5'>
                                            <div className='mb-3 flex items-center gap-2 text-xs text-accent-gold/80'>
                                                <Swords size={14} />
                                                戰法配置
                                            </div>
                                            <div className='space-y-3'>
                                                <SearchSelect id={`skill-1-${index}`} label='戰法一' value={member.skill1} options={tacticOptions} onChange={(value) => updateMember(index, 'skill1', value)} placeholder='搜尋主要戰法' disabledValues={tacticDisabled(member.skill1)} />
                                                <SearchSelect id={`skill-1-alt-${index}`} label='戰法一備選' value={member.skill1Alt} options={tacticOptions} onChange={(value) => updateMember(index, 'skill1Alt', value)} placeholder='搜尋備選戰法' disabledValues={tacticDisabled(member.skill1Alt)} optional />
                                                <SearchSelect id={`skill-2-${index}`} label='戰法二' value={member.skill2} options={tacticOptions} onChange={(value) => updateMember(index, 'skill2', value)} placeholder='搜尋主要戰法' disabledValues={tacticDisabled(member.skill2)} />
                                                <SearchSelect id={`skill-2-alt-${index}`} label='戰法二備選' value={member.skill2Alt} options={tacticOptions} onChange={(value) => updateMember(index, 'skill2Alt', value)} placeholder='搜尋備選戰法' disabledValues={tacticDisabled(member.skill2Alt)} optional />
                                            </div>
                                        </div>

                                        <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2'>
                                            <TextField id={`soldier-type-${index}`} label='兵種' value={member.soldierType} onChange={(value) => updateMember(index, 'soldierType', value)} placeholder='自由填寫兵種' maxLength={80} />
                                            <TextField id={`soldier-skills-${index}`} label='專精' value={member.soldierSkills} onChange={(value) => updateMember(index, 'soldierSkills', value)} placeholder='兵種專精說明' optional maxLength={200} />
                                            <TextField id={`book-1-${index}`} label='兵書一' value={member.book1} onChange={(value) => updateMember(index, 'book1', value)} placeholder='填寫兵書' maxLength={100} />
                                            <TextField id={`book-2-${index}`} label='兵書二' value={member.book2} onChange={(value) => updateMember(index, 'book2', value)} placeholder='填寫兵書' maxLength={100} />
                                            <TextField id={`book-3-${index}`} label='兵書三' value={member.book3} onChange={(value) => updateMember(index, 'book3', value)} placeholder='填寫兵書' maxLength={100} />
                                            <TextField id={`equip-${index}`} label='裝備屬性' value={member.equipPoint} onChange={(value) => updateMember(index, 'equipPoint', value)} placeholder='例如：智統' maxLength={120} />
                                        </div>
                                        <TextField id={`plus-points-${index}`} label='加點' value={member.plusPoints} onChange={(value) => updateMember(index, 'plusPoints', value)} placeholder='例如：略點速度後全智' maxLength={120} />
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                </section>

                <div className='sticky bottom-4 z-20 rounded-2xl border border-accent-gold/20 bg-[#111]/90 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl sm:flex sm:items-center sm:justify-between sm:px-5'>
                    <div className='mb-3 flex items-center gap-2 text-xs text-foreground-muted sm:mb-0'>
                        <Sparkles size={15} className='text-accent-gold' />
                        送出前會先檢查資料並產生完整預覽
                    </div>
                    <button
                        type='submit'
                        className='flex w-full items-center justify-center gap-2 rounded-xl bg-accent-gold px-6 py-3 font-medium text-background transition hover:bg-accent-gold/90 sm:w-auto'
                    >
                        <ClipboardCheck size={18} />
                        檢查並預覽
                    </button>
                </div>
            </form>

            <AnimatePresence>
                {previewOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:p-8'
                        role='dialog'
                        aria-modal='true'
                        aria-labelledby='preview-title'
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            className='my-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-accent-gold/25 bg-[#151515] shadow-2xl shadow-black'
                        >
                            <div className='flex items-start justify-between border-b border-white/10 bg-gradient-to-r from-accent-gold/8 to-transparent p-5 sm:p-7'>
                                <div>
                                    <p className='text-[10px] tracking-[0.25em] text-accent-gold'>最終覆核</p>
                                    <h2 id='preview-title' className='mt-1 text-2xl font-serif'>陣容入庫預覽</h2>
                                    <p className='mt-2 text-sm text-foreground-muted'>確認後四筆資料會以同一筆交易寫入。</p>
                                </div>
                                <button type='button' onClick={() => setPreviewOpen(false)} className='flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-foreground-muted hover:bg-white/5 hover:text-foreground' aria-label='關閉預覽'>
                                    <X size={17} />
                                </button>
                            </div>

                            <div className='p-5 sm:p-7'>
                                <div className='mb-6 grid gap-3 rounded-xl border border-white/8 bg-black/15 p-4 sm:grid-cols-4'>
                                    <PreviewRow label='陣容' value={draft.teamName} />
                                    <PreviewRow label='賽季' value={draft.season.toUpperCase()} />
                                    <PreviewRow label='Tier' value={draft.tier.toUpperCase()} />
                                    <PreviewRow label='陣型' value={draft.formation} />
                                </div>

                                <div className='grid gap-4 lg:grid-cols-3'>
                                    {draft.members.map((member, index) => {
                                        const general = generalByName.get(member.generalName);
                                        return (
                                            <div key={member.position} className='rounded-xl border border-white/10 bg-white/[0.025] p-4'>
                                                <div className='mb-4 flex items-center gap-3'>
                                                    <div className='relative h-12 w-12 overflow-hidden rounded-lg bg-white/5'>
                                                        {general && <Image src={getGeneralImage(general.avatar)} alt={general.name} fill sizes='48px' className='object-cover' />}
                                                    </div>
                                                    <div>
                                                        <p className='text-[10px] text-accent-gold/70'>{POSITION_LABELS[index]}</p>
                                                        <h3 className='font-serif'>{member.generalName}</h3>
                                                    </div>
                                                </div>
                                                <PreviewRow label='戰法一' value={member.skill1} />
                                                <PreviewRow label='備選一' value={member.skill1Alt} />
                                                <PreviewRow label='戰法二' value={member.skill2} />
                                                <PreviewRow label='備選二' value={member.skill2Alt} />
                                                <PreviewRow label='兵種' value={member.soldierType} />
                                                <PreviewRow label='專精' value={member.soldierSkills} />
                                                <PreviewRow label='兵書一' value={member.book1} />
                                                <PreviewRow label='兵書二' value={member.book2} />
                                                <PreviewRow label='兵書三' value={member.book3} />
                                                <PreviewRow label='裝備屬性' value={member.equipPoint} />
                                                <PreviewRow label='加點' value={member.plusPoints} />
                                            </div>
                                        );
                                    })}
                                </div>

                                {submissionError && (
                                    <div className='mt-5 flex items-start gap-2 rounded-lg border border-red-400/20 bg-red-400/7 p-3 text-sm text-red-200' role='alert'>
                                        <AlertCircle size={16} className='mt-0.5 shrink-0' />
                                        {submissionError}
                                    </div>
                                )}
                            </div>

                            <div className='flex flex-col-reverse gap-3 border-t border-white/10 p-5 sm:flex-row sm:justify-end sm:p-6'>
                                <button type='button' onClick={() => setPreviewOpen(false)} disabled={isSubmitting} className='rounded-xl border border-white/10 px-5 py-2.5 text-sm transition hover:bg-white/5 disabled:opacity-50'>返回修改</button>
                                <button type='button' onClick={confirmCreate} disabled={isSubmitting} className='flex items-center justify-center gap-2 rounded-xl bg-accent-gold px-6 py-2.5 font-medium text-background transition hover:bg-accent-gold/90 disabled:opacity-50'>
                                    {isSubmitting ? <Loader2 size={17} className='animate-spin' /> : <CheckCircle2 size={17} />}
                                    {isSubmitting ? '正在入庫' : '確認新增陣容'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
