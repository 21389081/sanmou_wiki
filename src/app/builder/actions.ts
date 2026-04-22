"use server";

import { createClient } from '@/lib/supabase/server';
import { getTeams, TeamFilters, Team } from '@/lib/api';

export async function fetchFilterOptions() {
    const supabase = await createClient();
    const { data: teams, error } = await supabase.from('teams_info').select('tier, season');

    if (error) {
        throw new Error(error.message);
    }

    const uniqueTiers = Array.from(new Set((teams || []).map((t) => t.tier).filter(Boolean)));
    const uniqueSeasons = Array.from(new Set((teams || []).map((t) => t.season).filter(Boolean)));

    // Tier 自定義排序
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

    return {
        tiers: uniqueTiers.sort((a, b) => (tierOrder[a] ?? 99) - (tierOrder[b] ?? 99)),
        seasons: uniqueSeasons.sort(),
    };
}

export async function fetchFilteredTeams(filters?: TeamFilters): Promise<Team[]> {
    return await getTeams(filters);
}
