import { createClient } from './supabase/server';
import {
    getGeneralImage,
    getTacticImage,
    getGeneralTacticImage,
    getTeamGeneralImage,
} from './supabase/storage';

const rarityMap: Record<string, string> = {
    orange: '橙',
    purple: '紫',
    blue: '藍',
};

export type General = {
    gid: number;
    name: string;
    avatar: string;
    rarity: '橙' | '紫' | '藍';
    camp: '魏' | '蜀' | '吳' | '群';
    soldier_type: string;
    strength: string;
    intelligence: string;
    leadership: string;
    initiative: string;
    tactic_name: string;
    tactic_icon: string;
    tactic_type: string;
    tactic_trait: string;
    tactic_chance: string;
    tactic_effect_base: string;
    tactic_effect_max: string;
    season: string;
    fate_id_1: number | null;
    fate_id_2: number | null;
    fate_id_3: number | null;
    fate_id_4: number | null;
};

export type Fate = {
    fid: number;
    name: string;
    members: string | null;
    effect: string;
};

export type Tactic = {
    tid: number;
    name: string;
    icon: string;
    rarity: '橙' | '紫' | '藍';
    type: string;
    soldier_type: string;
    trait: string;
    chance: string;
    effect_base: string;
    effect_max: string;
    season: string;
};

export async function getGenerals(): Promise<General[]> {
    const supabase = await createClient();

    const { data, error } = await supabase.from('generals_info').select('*');

    if (error) {
        throw new Error(error.message);
    }

    return (data || []).map((g) => ({
        ...g,
        rarity: rarityMap[g.rarity as keyof typeof rarityMap] as '橙' | '紫' | '藍',
        avatar: getGeneralImage(g.avatar),
    }));
}

export async function getTactics(): Promise<Tactic[]> {
    const supabase = await createClient();

    const { data, error } = await supabase.from('tactics_info').select('*');

    if (error) {
        throw new Error(error.message);
    }

    return (data || []).map((t) => ({
        ...t,
        rarity: rarityMap[t.rarity as keyof typeof rarityMap] as '橙' | '紫' | '藍',
        icon: getTacticImage(t.icon),
    }));
}

export async function getGeneralByName(name: string): Promise<General | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('generals_info')
        .select('*')
        .eq('name', name)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw new Error(error.message);
    }

    return {
        ...data,
        rarity: rarityMap[data.rarity as keyof typeof rarityMap] as '橙' | '紫' | '藍',
        avatar: getGeneralImage(data.avatar),
        tactic_icon: getGeneralTacticImage(data.tactic_icon),
    };
}

export async function getFatesByIds(ids: (number | null)[]): Promise<Fate[]> {
    const validIds = ids.filter((id): id is number => id !== null && id !== undefined);
    if (validIds.length === 0) return [];

    const supabase = await createClient();

    const { data, error } = await supabase.from('fate_info').select('*').in('fid', validIds);

    if (error) {
        throw new Error(error.message);
    }

    return data || [];
}

export async function getTacticByName(name: string): Promise<Tactic | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('tactics_info')
        .select('*')
        .eq('name', name)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(error.message);
    }

    return {
        ...data,
        rarity: rarityMap[data.rarity as keyof typeof rarityMap] as '橙' | '紫' | '藍',
        icon: getTacticImage(data.icon),
    };
}

export type TeamMember = {
    members_id: number;
    team_id: number;
    position: number;
    general_img: string;
    general_name: string;
    skill_1: string;
    skill_1_alt: string;
    skill_2: string;
    skill_2_alt: string;
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

export type Team = {
    team_id: number;
    team_name: string;
    tier: string;
    formation: string;
    season: string;
    note: string | null;
    members: TeamMember[];
};

export type TeamFilters = {
    generals?: string[];
    tactics?: string[];
    season?: string;
    tier?: string;
};

const tierOrder: Record<string, number> = {
    T0: 0,
    'T0.5': 1,
    'T0.3': 2,
    T1: 3,
    'T1.5': 4,
    T2: 5,
    'T2.5': 6,
    T3: 7,
};

export async function getTeams(filters?: TeamFilters): Promise<Team[]> {
    const supabase = await createClient();

    const teamQuery = supabase.from('teams_info').select('*');
    const { data: teams, error: teamsError } = await teamQuery;

    if (teamsError) {
        throw new Error(teamsError.message);
    }

    if (!teams || teams.length === 0) {
        return [];
    }

    const teamIds = teams.map((t) => t.team_id).filter((id) => id != null);
    if (teamIds.length === 0) {
        return teams.map((t) => ({ ...t, members: [] }));
    }
    const { data: members, error: membersError } = await supabase
        .from('team_members')
        .select('*')
        .in('team_id', teamIds)
        .order('position');

    if (membersError) {
        throw new Error(membersError.message);
    }

    const membersMap = new Map<number, TeamMember[]>();
    (members || []).forEach((m) => {
        if (m.members_id == null) return;
        const list = membersMap.get(m.team_id) || [];
        if (list.some((existing) => existing.members_id === m.members_id)) return;
        list.push({
            ...m,
            general_img: m.general_img ? getTeamGeneralImage(m.general_img) : '',
        });
        membersMap.set(m.team_id, list);
    });

    const seenTeamIds = new Set<number>();
    let result = teams
        .map((t) => ({
            ...t,
            members: membersMap.get(t.team_id) || [],
        }))
        .filter((t) => {
            if (t.team_id == null || seenTeamIds.has(t.team_id)) return false;
            seenTeamIds.add(t.team_id);
            return true;
        });

    if (filters?.season && filters.season !== '全部') {
        result = result.filter((t) => t.season === filters.season);
    }

    if (filters?.tier && filters.tier !== '全部') {
        result = result.filter((t) => t.tier === filters.tier);
    }

    if (filters?.generals && filters.generals.length > 0) {
        result = result.filter((t) =>
            t.members.some((m: TeamMember) => filters.generals!.includes(m.general_name)),
        );
    }

    if (filters?.tactics && filters.tactics.length > 0) {
        result = result.filter((t) =>
            t.members.some(
                (m: TeamMember) =>
                    filters.tactics!.includes(m.skill_1) || filters.tactics!.includes(m.skill_2),
            ),
        );
    }

    result.sort((a, b) => {
        const orderA = tierOrder[a.tier] ?? 99;
        const orderB = tierOrder[b.tier] ?? 99;
        return orderA - orderB;
    });

    return result;
}
