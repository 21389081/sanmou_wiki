import { createClient } from '../supabase/server';
import type { Fate } from './types';

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
