'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Check, Users, Sword, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { getGeneralImage, getTacticImage } from '@/lib/supabase/storage';
import { fetchFilterOptions, fetchFilteredTeams } from './actions';
import { Team } from '@/lib/api';
import TeamCard from '@/components/team-card';

type General = {
    gid: number;
    name: string;
    avatar: string;
    rarity: string;
    camp: string;
};

type Tactic = {
    tid: number;
    name: string;
    icon: string;
    rarity: string;
};

const rarityOrder: Record<string, number> = {
    橙: 0,
    紫: 1,
    藍: 2,
};

const campOrder: Record<string, number> = {
    魏: 0,
    蜀: 1,
    吳: 2,
    群: 3,
};

export default function BuilderPage() {
    const [generals, setGenerals] = useState<General[]>([]);
    const [tactics, setTactics] = useState<Tactic[]>([]);
    const [selectedGenerals, setSelectedGenerals] = useState<string[]>([]);
    const [selectedTactics, setSelectedTactics] = useState<string[]>([]);
    const [generalSearch, setGeneralSearch] = useState('');
    const [tacticSearch, setTacticSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // 新增過濾器與結果狀態
    const [tiers, setTiers] = useState<string[]>([]);
    const [seasons, setSeasons] = useState<string[]>([]);
    const [selectedTier, setSelectedTier] = useState('全部');
    const [selectedSeason, setSelectedSeason] = useState('全部');
    const [teams, setTeams] = useState<Team[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            const [{ data: g }, { data: t }, options] = await Promise.all([
                supabase.from('generals_info').select('gid, name, avatar, rarity, camp'),
                supabase.from('tactics_info').select('tid, name, icon, rarity'),
                fetchFilterOptions(),
            ]);

            setGenerals(
                (g || [])
                    .map((i) => ({
                        ...i,
                        avatar: getGeneralImage(i.avatar),
                        rarity: i.rarity === 'orange' ? '橙' : i.rarity === 'purple' ? '紫' : '藍',
                    }))
                    .sort((a, b) => {
                        const rarityDiff = (rarityOrder[a.rarity] ?? 99) - (rarityOrder[b.rarity] ?? 99);
                        if (rarityDiff !== 0) return rarityDiff;
                        return (campOrder[a.camp] ?? 99) - (campOrder[b.camp] ?? 99);
                    }),
            );

            setTactics(
                (t || [])
                    .map((i) => ({
                        ...i,
                        icon: getTacticImage(i.icon),
                        rarity: i.rarity === 'orange' ? '橙' : i.rarity === 'purple' ? '紫' : '藍',
                    }))
                    .sort((a, b) => (rarityOrder[a.rarity] ?? 99) - (rarityOrder[b.rarity] ?? 99)),
            );

            setTiers(['全部', ...options.tiers]);
            setSeasons(['全部', ...options.seasons]);
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

    const handleGeneralToggle = (name: string) => {
        setSelectedGenerals((prev) =>
            prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        );
    };

    const handleTacticToggle = (name: string) => {
        setSelectedTactics((prev) =>
            prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        );
    };

    const handleSelectAllGenerals = () => {
        const filteredNames = filteredGenerals.map((g) => g.name);
        const allSelected = filteredNames.every((n) => selectedGenerals.includes(n));
        if (allSelected) {
            setSelectedGenerals((prev) => prev.filter((n) => !filteredNames.includes(n)));
        } else {
            setSelectedGenerals((prev) => Array.from(new Set([...prev, ...filteredNames])));
        }
    };

    const handleSelectAllTactics = () => {
        const filteredNames = filteredTactics.map((t) => t.name);
        const allSelected = filteredNames.every((n) => selectedTactics.includes(n));
        if (allSelected) {
            setSelectedTactics((prev) => prev.filter((n) => !filteredNames.includes(n)));
        } else {
            setSelectedTactics((prev) => Array.from(new Set([...prev, ...filteredNames])));
        }
    };

    const handleSearch = async () => {
        setIsSearching(true);
        try {
            const results = await fetchFilteredTeams({
                generals: selectedGenerals,
                tactics: selectedTactics,
                tier: selectedTier,
                season: selectedSeason,
            });
            setTeams(results);
            setHasSearched(true);
        } catch (error) {
            console.error('Failed to fetch teams', error);
        } finally {
            setIsSearching(false);
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='animate-spin w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full' />
            </div>
        );
    }

    // 將回傳陣容依 Tier 分群
    const groupedTeams = teams.reduce((acc, team) => {
        const tier = team.tier || '無評級';
        if (!acc[tier]) acc[tier] = [];
        acc[tier].push(team);
        return acc;
    }, {} as Record<string, Team[]>);

    return (
        <div className='py-8'>
            <header className='mb-8'>
                <h1 className='text-3xl font-serif mb-2'>配將助手</h1>
                <p className='text-foreground-muted'>
                    選擇您擁有的武將和戰法，找出最適合您的陣容。
                </p>
            </header>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6'>
                {/* Generals Selection */}
                <div className='glass p-6 rounded-2xl border-white/5'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center gap-2'>
                            <Users size={18} className='text-accent-gold' />
                            <h2 className='text-lg font-medium'>已擁有武將</h2>
                            <span className='text-xs text-foreground-muted'>
                                ({selectedGenerals.length} 勾選)
                            </span>
                        </div>
                        <button
                            onClick={handleSelectAllGenerals}
                            className='text-xs text-accent-gold hover:text-accent-gold/80 transition-colors'
                        >
                            全選 / 取消全選
                        </button>
                    </div>
                    <input
                        type='text'
                        placeholder='搜尋武將...'
                        value={generalSearch}
                        onChange={(e) => setGeneralSearch(e.target.value)}
                        className='w-full mb-3 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm placeholder:text-foreground-muted focus:outline-none focus:border-accent-gold/50'
                    />
                    <div className='max-h-80 overflow-y-auto space-y-1 pr-2 custom-scrollbar'>
                        {filteredGenerals.map((g) => (
                            <label
                                key={g.gid}
                                className='flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors'
                            >
                                <input
                                    type='checkbox'
                                    checked={selectedGenerals.includes(g.name)}
                                    onChange={() => handleGeneralToggle(g.name)}
                                    className='sr-only'
                                />
                                <div
                                    className={cn(
                                        'w-5 h-5 rounded border flex items-center justify-center transition-all',
                                        selectedGenerals.includes(g.name)
                                            ? 'bg-accent-gold border-accent-gold'
                                            : 'border-white/30'
                                    )}
                                >
                                    {selectedGenerals.includes(g.name) && (
                                        <Check size={14} className='text-background' />
                                    )}
                                </div>
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
                                <span
                                    className={cn(
                                        'text-xs ml-auto',
                                        g.rarity === '橙' && 'text-orange-400',
                                        g.rarity === '紫' && 'text-purple-400',
                                        g.rarity === '藍' && 'text-blue-400'
                                    )}
                                >
                                    {g.camp}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Tactics Selection */}
                <div className='glass p-6 rounded-2xl border-white/5'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center gap-2'>
                            <Sword size={18} className='text-accent-gold' />
                            <h2 className='text-lg font-medium'>已擁有戰法</h2>
                            <span className='text-xs text-foreground-muted'>
                                ({selectedTactics.length} 勾選)
                            </span>
                        </div>
                        <button
                            onClick={handleSelectAllTactics}
                            className='text-xs text-accent-gold hover:text-accent-gold/80 transition-colors'
                        >
                            全選 / 取消全選
                        </button>
                    </div>
                    <input
                        type='text'
                        placeholder='搜尋戰法...'
                        value={tacticSearch}
                        onChange={(e) => setTacticSearch(e.target.value)}
                        className='w-full mb-3 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm placeholder:text-foreground-muted focus:outline-none focus:border-accent-gold/50'
                    />
                    <div className='max-h-80 overflow-y-auto space-y-1 pr-2 custom-scrollbar'>
                        {filteredTactics.map((t) => (
                            <label
                                key={t.tid}
                                className='flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors'
                            >
                                <input
                                    type='checkbox'
                                    checked={selectedTactics.includes(t.name)}
                                    onChange={() => handleTacticToggle(t.name)}
                                    className='sr-only'
                                />
                                <div
                                    className={cn(
                                        'w-5 h-5 rounded border flex items-center justify-center transition-all',
                                        selectedTactics.includes(t.name)
                                            ? 'bg-accent-gold border-accent-gold'
                                            : 'border-white/30'
                                    )}
                                >
                                    {selectedTactics.includes(t.name) && (
                                        <Check size={14} className='text-background' />
                                    )}
                                </div>
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
                                <span
                                    className={cn(
                                        'text-xs ml-auto',
                                        t.rarity === '橙' && 'text-orange-400',
                                        t.rarity === '紫' && 'text-purple-400',
                                        t.rarity === '藍' && 'text-blue-400'
                                    )}
                                >
                                    {t.rarity}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Query Toolbar */}
            <div className='glass p-4 rounded-xl border-white/5 flex flex-col md:flex-row gap-4 items-end mb-8'>
                <div className='flex-1 w-full'>
                    <label className='block text-xs text-foreground-muted mb-1'>評級 (Tier)</label>
                    <select
                        value={selectedTier}
                        onChange={(e) => setSelectedTier(e.target.value)}
                        className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-accent-gold/50'
                    >
                        {tiers.map((tier) => (
                            <option key={tier} value={tier} className='bg-background text-foreground'>
                                {tier}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='flex-1 w-full'>
                    <label className='block text-xs text-foreground-muted mb-1'>賽季 (Season)</label>
                    <select
                        value={selectedSeason}
                        onChange={(e) => setSelectedSeason(e.target.value)}
                        className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-accent-gold/50'
                    >
                        {seasons.map((season) => (
                            <option key={season} value={season} className='bg-background text-foreground'>
                                {season}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className='w-full md:w-auto px-8 py-2 bg-accent-gold text-background font-medium rounded-lg hover:bg-accent-gold/90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2'
                >
                    {isSearching ? <Loader2 size={18} className='animate-spin' /> : <Search size={18} />}
                    開始查詢陣容
                </button>
            </div>

            {/* Results Display */}
            {hasSearched && (
                <div className='space-y-8'>
                    {Object.keys(groupedTeams).length === 0 ? (
                        <div className='text-center py-12 text-foreground-muted'>
                            喔不，找不到符合條件的陣容，請嘗試減少過濾條件。
                        </div>
                    ) : (
                        tiers
                            .filter((tier) => groupedTeams[tier])
                            .map((tier) => (
                                <div key={tier} className='space-y-4'>
                                    <h2 className='text-xl font-serif text-accent-gold'>
                                        {tier}
                                    </h2>
                                    <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
                                        {groupedTeams[tier].map((team) => (
                                            <TeamCard key={team.team_id} team={team} />
                                        ))}
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            )}
        </div>
    );
}