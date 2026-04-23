"use server";

import { createClient } from '@/lib/supabase/server';
import { getTeams, TeamFilters, Team, parseTierOrder } from '@/lib/api';

export async function fetchFilterOptions() {
    const supabase = await createClient();
    const { data: teams, error } = await supabase.from('teams_info').select('tier, season');

    if (error) {
        throw new Error(error.message);
    }

    const uniqueTiers = Array.from(new Set((teams || []).map((t) => t.tier).filter(Boolean)));
    const uniqueSeasons = Array.from(new Set((teams || []).map((t) => t.season).filter(Boolean)));

    return {
        tiers: uniqueTiers.sort((a, b) => parseTierOrder(a) - parseTierOrder(b)),
        seasons: uniqueSeasons.sort(),
    };
}

export async function fetchFilteredTeams(filters?: TeamFilters): Promise<Team[]> {
    return await getTeams(filters);
}
