import { createClient } from '../supabase/server';
import { getTacticImage } from '../supabase/storage';
import { rarityMap } from './shared';
import type { Tactic } from './types';

export async function getTactics(): Promise<Tactic[]> {
    const supabase = await createClient();

    const { data, error } = await supabase.from('tactics_info').select('*');

    if (error) {
        throw new Error(error.message);
    }

    return (data || []).map((t) => ({
        ...t,
        rarity: rarityMap[t.rarity as keyof typeof rarityMap],
        icon: getTacticImage(t.icon),
    }));
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
        rarity: rarityMap[data.rarity as keyof typeof rarityMap],
        icon: getTacticImage(data.icon),
    };
}
