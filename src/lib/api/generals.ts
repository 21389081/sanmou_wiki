import { createClient } from '../supabase/server';
import { getGeneralImage, getGeneralTacticImage } from '../supabase/storage';
import { rarityMap } from './shared';
import type { General } from './types';

export async function getGenerals(): Promise<General[]> {
    const supabase = await createClient();

    const { data, error } = await supabase.from('generals_info').select('*');

    if (error) {
        throw new Error(error.message);
    }

    return (data || []).map((g) => ({
        ...g,
        rarity: rarityMap[g.rarity as keyof typeof rarityMap],
        avatar: getGeneralImage(g.avatar),
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
        if (error.code === 'PGRST116') return null;
        throw new Error(error.message);
    }

    return {
        ...data,
        rarity: rarityMap[data.rarity as keyof typeof rarityMap],
        avatar: getGeneralImage(data.avatar),
        tactic_icon: getGeneralTacticImage(data.tactic_icon),
    };
}
