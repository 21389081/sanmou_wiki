import { createClient } from '../supabase/server';
import { getTeamGeneralImage } from '../supabase/storage';
import type { Team, TeamFilters, TeamMember } from './types';

export function parseTierOrder(tier: string): number {
    const match = tier.match(/^T(\d+(\.\d+)?)$/);
    if (!match) return 99;
    const parsed = parseFloat(match[1]);
    return isNaN(parsed) ? 99 : parsed;
}

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

    const parseSeasonOrder = (season: string | null): number => {
        if (!season) return 99;
        const match = season.match(/^S(\d+)$/);
        return match ? parseInt(match[1], 10) : 99;
    };

    result.sort((a, b) => {
        const seasonA = parseSeasonOrder(a.season);
        const seasonB = parseSeasonOrder(b.season);
        if (seasonA !== seasonB) return seasonA - seasonB;

        const orderA = parseTierOrder(a.tier);
        const orderB = parseTierOrder(b.tier);
        return orderA - orderB;
    });

    return result;
}
