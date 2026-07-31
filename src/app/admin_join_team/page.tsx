import type { Metadata } from 'next';
import { isAdminSessionValid } from '@/lib/admin-auth';
import { createClient } from '@/lib/supabase/server';
import AdminLogin from './admin-login';
import AdminTeamForm from './admin-team-form';
import type { GeneralOption, TacticOption } from './types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: '陣容錄入 | 三謀資料庫',
    robots: {
        index: false,
        follow: false,
        nocache: true,
    },
};

function numericLabelOrder(prefix: string) {
    return (left: string, right: string) => {
        const leftValue = Number(left.slice(prefix.length));
        const rightValue = Number(right.slice(prefix.length));
        return leftValue - rightValue;
    };
}

export default async function AdminJoinTeamPage() {
    const authenticated = await isAdminSessionValid();
    if (!authenticated) return <AdminLogin />;

    const supabase = await createClient();
    const [generalsResult, tacticsResult, teamsResult] = await Promise.all([
        supabase.from('generals_info').select('gid, name, avatar').order('name'),
        supabase.from('tactics_info').select('tid, name').order('name'),
        supabase.from('teams_info').select('tier, season'),
    ]);

    if (generalsResult.error || tacticsResult.error || teamsResult.error) {
        throw new Error('Failed to load admin team form options.');
    }

    const generals = (generalsResult.data || []).filter(
        (general): general is GeneralOption =>
            typeof general.gid === 'number' && Boolean(general.name) && Boolean(general.avatar),
    );
    const tactics = (tacticsResult.data || []).filter(
        (tactic): tactic is TacticOption => typeof tactic.tid === 'number' && Boolean(tactic.name),
    );
    const tiers = Array.from(new Set((teamsResult.data || []).map((team) => team.tier).filter(Boolean)))
        .sort(numericLabelOrder('T'));
    const seasons = Array.from(new Set((teamsResult.data || []).map((team) => team.season).filter(Boolean)))
        .sort(numericLabelOrder('S'));

    return <AdminTeamForm generals={generals} tactics={tactics} tiers={tiers} seasons={seasons} />;
}
