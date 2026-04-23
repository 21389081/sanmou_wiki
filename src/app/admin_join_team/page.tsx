'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Loader2, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getGeneralImage, getTacticImage } from '@/lib/supabase/storage';

const ADMIN_PASSWORD = 'vincentchen11610';

type AdminGeneral = {
    gid: number;
    name: string;
    avatar: string;
    originalAvatar?: string;
};

type AdminTactic = {
    tid: number;
    name: string;
    icon: string;
};

type AdminMemberData = {
    general_name: string;
    general_img: string;
    skill_1: string;
    skill_2: string;
    soldier_type: string;
    soldier_skills: string;
    book_1: string;
    book_2: string;
    book_3: string;
    equip_point: string;
    equip_stats: string;
    horse_stats: string;
    plus_points: string;
};

export default function AdminJoinTeamPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [generals, setGenerals] = useState<AdminGeneral[]>([]);
    const [tactics, setTactics] = useState<AdminTactic[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [teamName, setTeamName] = useState('');
    const [tier, setTier] = useState('');
    const [formation, setFormation] = useState('');
    const [season, setSeason] = useState('');
    const [note, setNote] = useState('');

    const [members, setMembers] = useState<AdminMemberData[]>([
        { general_name: '', general_img: '', skill_1: '', skill_2: '', soldier_type: '', soldier_skills: '', book_1: '', book_2: '', book_3: '', equip_point: '', equip_stats: '', horse_stats: '', plus_points: '' },
        { general_name: '', general_img: '', skill_1: '', skill_2: '', soldier_type: '', soldier_skills: '', book_1: '', book_2: '', book_3: '', equip_point: '', equip_stats: '', horse_stats: '', plus_points: '' },
        { general_name: '', general_img: '', skill_1: '', skill_2: '', soldier_type: '', soldier_skills: '', book_1: '', book_2: '', book_3: '', equip_point: '', equip_stats: '', horse_stats: '', plus_points: '' },
    ]);

    const [generalSearch, setGeneralSearch] = useState('');
    const [tacticSearch, setTacticSearch] = useState('');
    const [activeDropdown, setActiveDropdown] = useState<{ index: number; field: string } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            const [{ data: g }, { data: t }] = await Promise.all([
                supabase.from('generals_info').select('gid, name, avatar'),
                supabase.from('tactics_info').select('tid, name, icon'),
            ]);

            setGenerals(
                (g || [])
                    .map((i) => ({
                        ...i,
                        avatar: getGeneralImage(i.avatar),
                        originalAvatar: i.avatar,
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name))
            );

            setTactics(
                (t || []).map((i) => ({
                    ...i,
                    icon: getTacticImage(i.icon),
                })).sort((a, b) => a.name.localeCompare(b.name))
            );

            setLoading(false);
        };
        fetchData();
    }, []);

    const filteredGenerals = generalSearch
        ? generals.filter((g) => g.name.includes(generalSearch))
        : generals;

    const filteredTactics = tacticSearch
        ? tactics.filter((t) => t.name.includes(tacticSearch))
        : tactics;

    const updateMember = (index: number, field: keyof AdminMemberData, value: string) => {
        setMembers((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleSubmit = async () => {
        if (!teamName || !tier || !formation || !season) {
            setError('請填寫必填欄位（隊伍名稱、評級、陣營、賽季）');
            return;
        }

        const hasValidMember = members.some((m) => m.general_name);
        if (!hasValidMember) {
            setError('請至少填寫一位武將');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const supabase = createClient();

            const { data: teamData, error: teamError } = await supabase
                .from('teams_info')
                .insert({ team_name: teamName, tier, formation, season, note: note || null })
                .select()
                .single();

            if (teamError) throw teamError;

            const teamId = teamData.team_id;

            const memberInserts = members
                .filter((m) => m.general_name)
                .map((m, idx) => {
                    const general = generals.find((g) => g.name === m.general_name);
                    const imgValue = m.general_img || general?.avatar || null;
                    return {
                        team_id: teamId,
                        position: idx + 1,
                        general_img: imgValue,
                        general_name: m.general_name,
                        skill_1: m.skill_1 || null,
                        skill_2: m.skill_2 || null,
                        soldier_type: m.soldier_type || null,
                        soldier_skills: m.soldier_skills || null,
                        book_1: m.book_1 || null,
                        book_2: m.book_2 || null,
                        book_3: m.book_3 || null,
                        equip_point: m.equip_point || null,
                        equip_stats: m.equip_stats || null,
                        horse_stats: m.horse_stats || null,
                        plus_points: m.plus_points || null,
                    };
                });

            if (memberInserts.length > 0) {
                const { error: memberError } = await supabase
                    .from('team_members')
                    .insert(memberInserts);

                if (memberError) throw memberError;
            }

            setSuccess(true);
        } catch (err) {
            console.error('Failed to create team:', err);
            setError('提交失敗，請稍後重試');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordSubmit = () => {
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
        } else {
            setPasswordError(true);
            setPassword('');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='glass p-8 rounded-2xl border border-white/5 max-w-sm w-full'>
                    <div className='flex justify-center mb-6'>
                        <div className='w-16 h-16 bg-accent-gold/10 rounded-full flex items-center justify-center'>
                            <Lock size={32} className='text-accent-gold' />
                        </div>
                    </div>
                    <h1 className='text-xl font-serif text-center mb-2'>管理員驗證</h1>
                    <p className='text-foreground-muted text-sm text-center mb-6'>請輸入密碼以繼續</p>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError(false);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                        placeholder='輸入密碼'
                        className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold/50 mb-4'
                    />
                    {passwordError && (
                        <p className='text-red-400 text-sm text-center mb-4'>密碼錯誤，請重試</p>
                    )}
                    <button
                        onClick={handlePasswordSubmit}
                        className='w-full py-2 bg-accent-gold text-background font-medium rounded-lg hover:bg-accent-gold/90 transition-colors'
                    >
                        確認
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='animate-spin w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full' />
            </div>
        );
    }

    return (
        <div className='py-8'>
            <header className='mb-8'>
                <h1 className='text-3xl font-serif mb-2'>新增陣容</h1>
                <p className='text-foreground-muted'>手動輸入陣容資料至資料庫</p>
            </header>

            {success ? (
                <div className='glass p-8 rounded-2xl border border-accent-gold/30 text-center'>
                    <div className='text-accent-gold text-xl mb-4'>新增成功！</div>
                    <button
                        onClick={() => window.location.reload()}
                        className='px-6 py-2 bg-accent-gold text-background rounded-lg hover:bg-accent-gold/90 transition-colors'
                    >
                        繼續新增
                    </button>
                </div>
            ) : (
                <div className='space-y-8'>
                    {/* Basic Info */}
                    <div className='glass p-6 rounded-2xl border-white/5'>
                        <h2 className='text-lg font-medium mb-4'>基本資料</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm text-foreground-muted mb-1'>
                                    隊伍名稱 *
                                </label>
                                <input
                                    type='text'
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold/50'
                                />
                            </div>
                            <div>
                                <label className='block text-sm text-foreground-muted mb-1'>
                                    評級 (Tier) *
                                </label>
                                <input
                                    type='text'
                                    value={tier}
                                    onChange={(e) => setTier(e.target.value)}
                                    placeholder='例如：T0、T1、SS...'
                                    className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold/50'
                                />
                            </div>
                            <div>
                                <label className='block text-sm text-foreground-muted mb-1'>
                                    陣型 *
                                </label>
                                <input
                                    type='text'
                                    value={formation}
                                    onChange={(e) => setFormation(e.target.value)}
                                    placeholder='，例如：魚鱗、鶴翼...'
                                    className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold/50'
                                />
                            </div>
                            <div>
                                <label className='block text-sm text-foreground-muted mb-1'>
                                    賽季 *
                                </label>
                                <select
                                    value={season}
                                    onChange={(e) => setSeason(e.target.value)}
                                    className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold/50'
                                >
                                    <option value=''>請選擇</option>
                                    <option value='S1'>S1</option>
                                    <option value='S2'>S2</option>
                                    <option value='S3'>S3</option>
                                    <option value='S4'>S4</option>
                                    <option value='S5'>S5</option>
                                    <option value='S6'>S6</option>
                                    <option value='S7'>S7</option>
                                </select>
                            </div>
                            <div className='md:col-span-2'>
                                <label className='block text-sm text-foreground-muted mb-1'>備註</label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows={2}
                                    className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold/50 resize-none'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Members */}
                    {members.map((member, index) => (
                        <div key={index} className='glass p-6 rounded-2xl border-white/5'>
                            <h2 className='text-lg font-medium mb-4 text-accent-gold'>
                                武將 {index + 1}
                            </h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='relative'>
                                    <label className='block text-sm text-foreground-muted mb-1'>武將</label>
                                    <input
                                        type='text'
                                        value={member.general_name}
                                        onChange={(e) => {
                                            updateMember(index, 'general_name', e.target.value);
                                            setGeneralSearch(e.target.value);
                                            setActiveDropdown({ index, field: 'general' });
                                        }}
                                        onFocus={() => {
                                            setGeneralSearch(member.general_name);
                                            setActiveDropdown({ index, field: 'general' });
                                        }}
                                        onBlur={() => setTimeout(() => setActiveDropdown(null), 200)}
                                        placeholder='搜尋武將...'
                                        className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold/50'
                                    />
                                    {activeDropdown?.index === index && activeDropdown?.field === 'general' && filteredGenerals.length > 0 && (
                                        <div className='absolute z-10 w-full mt-1 max-h-48 overflow-y-auto bg-surface border border-white/10 rounded-lg shadow-lg'>
                                            {filteredGenerals.slice(0, 10).map((g) => (
                                                <div
                                                    key={g.gid}
                                                    onMouseDown={() => {
                                                        updateMember(index, 'general_name', g.name);
                                                        updateMember(index, 'general_img', g.originalAvatar || '');
                                                        setActiveDropdown(null);
                                                    }}
                                                    className='flex items-center gap-2 px-3 py-2 hover:bg-white/5 cursor-pointer'
                                                >
                                                    <div className='relative w-8 h-8 rounded overflow-hidden bg-white/5 flex-shrink-0'>
                                                        {g.avatar && (
                                                            <Image
                                                                src={g.avatar}
                                                                alt={g.name}
                                                                fill
                                                                sizes='32px'
                                                                className='object-cover'
                                                            />
                                                        )}
                                                    </div>
                                                    <span className='text-sm'>{g.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className='block text-sm text-foreground-muted mb-1'>武將圖片</label>
                                    <input
                                        type='text'
                                        value={member.general_img}
                                        onChange={(e) => updateMember(index, 'general_img', e.target.value)}
                                        placeholder='general_xxx.png'
                                        className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold/50'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm text-foreground-muted mb-1'>戰法一</label>
                                    <input
                                        type='text'
                                        value={member.skill_1}
                                        onChange={(e) => {
                                            updateMember(index, 'skill_1', e.target.value);
                                            setTacticSearch(e.target.value);
                                            setActiveDropdown({ index, field: 'skill_1' });
                                        }}
                                        onFocus={() => {
                                            setTacticSearch(member.skill_1);
                                            setActiveDropdown({ index, field: 'skill_1' });
                                        }}
                                        onBlur={() => setTimeout(() => setActiveDropdown(null), 200)}
                                        placeholder='搜尋戰法...'
                                        className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold/50'
                                    />
                                    {activeDropdown?.index === index && activeDropdown?.field === 'skill_1' && filteredTactics.length > 0 && (
                                        <div className='absolute z-10 w-full mt-1 max-h-48 overflow-y-auto bg-surface border border-white/10 rounded-lg shadow-lg'>
                                            {filteredTactics.slice(0, 10).map((t) => (
                                                <div
                                                    key={t.tid}
                                                    onMouseDown={() => {
                                                        updateMember(index, 'skill_1', t.name);
                                                        setActiveDropdown(null);
                                                    }}
                                                    className='flex items-center gap-2 px-3 py-2 hover:bg-white/5 cursor-pointer'
                                                >
                                                    <div className='relative w-8 h-8 rounded overflow-hidden bg-white/5 flex-shrink-0'>
                                                        {t.icon && (
                                                            <Image
                                                                src={t.icon}
                                                                alt={t.name}
                                                                fill
                                                                sizes='32px'
                                                                className='object-cover'
                                                            />
                                                        )}
                                                    </div>
                                                    <span className='text-sm'>{t.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className='block text-sm text-foreground-muted mb-1'>戰法二</label>
                                    <input
                                        type='text'
                                        value={member.skill_2}
                                        onChange={(e) => {
                                            updateMember(index, 'skill_2', e.target.value);
                                            setTacticSearch(e.target.value);
                                            setActiveDropdown({ index, field: 'skill_2' });
                                        }}
                                        onFocus={() => {
                                            setTacticSearch(member.skill_2);
                                            setActiveDropdown({ index, field: 'skill_2' });
                                        }}
                                        onBlur={() => setTimeout(() => setActiveDropdown(null), 200)}
                                        placeholder='搜尋戰法...'
                                        className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold/50'
                                    />
                                    {activeDropdown?.index === index && activeDropdown?.field === 'skill_2' && filteredTactics.length > 0 && (
                                        <div className='absolute z-10 w-full mt-1 max-h-48 overflow-y-auto bg-surface border border-white/10 rounded-lg shadow-lg'>
                                            {filteredTactics.slice(0, 10).map((t) => (
                                                <div
                                                    key={t.tid}
                                                    onMouseDown={() => {
                                                        updateMember(index, 'skill_2', t.name);
                                                        setActiveDropdown(null);
                                                    }}
                                                    className='flex items-center gap-2 px-3 py-2 hover:bg-white/5 cursor-pointer'
                                                >
                                                    <div className='relative w-8 h-8 rounded overflow-hidden bg-white/5 flex-shrink-0'>
                                                        {t.icon && (
                                                            <Image
                                                                src={t.icon}
                                                                alt={t.name}
                                                                fill
                                                                sizes='32px'
                                                                className='object-cover'
                                                            />
                                                        )}
                                                    </div>
                                                    <span className='text-sm'>{t.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className='block text-sm text-foreground-muted mb-1'>兵種</label>
                                    <input
                                        type='text'
                                        value={member.soldier_type}
                                        onChange={(e) => updateMember(index, 'soldier_type', e.target.value)}
                                        placeholder='兵種'
                                        className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold/50'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm text-foreground-muted mb-1'>專精</label>
                                    <input
                                        type='text'
                                        value={member.soldier_skills}
                                        onChange={(e) => updateMember(index, 'soldier_skills', e.target.value)}
                                        placeholder='專精'
                                        className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold/50'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm text-foreground-muted mb-1'>兵書一</label>
                                    <input
                                        type='text'
                                        value={member.book_1}
                                        onChange={(e) => updateMember(index, 'book_1', e.target.value)}
                                        placeholder='兵書一'
                                        className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold/50'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm text-foreground-muted mb-1'>兵書二</label>
                                    <input
                                        type='text'
                                        value={member.book_2}
                                        onChange={(e) => updateMember(index, 'book_2', e.target.value)}
                                        placeholder='兵書二'
                                        className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold/50'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm text-foreground-muted mb-1'>兵書三</label>
                                    <input
                                        type='text'
                                        value={member.book_3}
                                        onChange={(e) => updateMember(index, 'book_3', e.target.value)}
                                        placeholder='兵書三'
                                        className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold/50'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm text-foreground-muted mb-1'>裝備屬性</label>
                                    <input
                                        type='text'
                                        value={member.equip_point}
                                        onChange={(e) => updateMember(index, 'equip_point', e.target.value)}
                                        placeholder='裝備屬性'
                                        className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold/50'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm text-foreground-muted mb-1'>裝備特效</label>
                                    <input
                                        type='text'
                                        value={member.equip_stats}
                                        onChange={(e) => updateMember(index, 'equip_stats', e.target.value)}
                                        placeholder='裝備特效'
                                        className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold/50'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm text-foreground-muted mb-1'>坐騎</label>
                                    <input
                                        type='text'
                                        value={member.horse_stats}
                                        onChange={(e) => updateMember(index, 'horse_stats', e.target.value)}
                                        placeholder='坐騎'
                                        className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold/50'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm text-foreground-muted mb-1'>加點</label>
                                    <input
                                        type='text'
                                        value={member.plus_points}
                                        onChange={(e) => updateMember(index, 'plus_points', e.target.value)}
                                        placeholder='加點'
                                        className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold/50'
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Error */}
                    {error && (
                        <div className='p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400'>
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className='w-full py-3 bg-accent-gold text-background font-medium rounded-lg hover:bg-accent-gold/90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2'
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={18} className='animate-spin' />
                                提交中...
                            </>
                        ) : (
                            <>
                                <Plus size={18} />
                                新增陣容
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}