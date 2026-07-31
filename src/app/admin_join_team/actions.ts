'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
    createAdminSession,
    destroyAdminSession,
    isAdminSessionValid,
    verifyAdminPassword,
} from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { FORMATIONS, type ActionResult, type TeamDraft, type TeamMemberDraft } from './types';

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function normalize(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
}

function getRequestKey(forwardedFor: string | null): string {
    return forwardedFor?.split(',')[0]?.trim() || 'unknown';
}

function validateText(value: string, label: string, maxLength: number, errors: string[]) {
    if (!value) errors.push(`${label}為必填欄位。`);
    if (value.length > maxLength) errors.push(`${label}不可超過 ${maxLength} 個字。`);
}

function normalizeMember(member: TeamMemberDraft, index: number): TeamMemberDraft {
    return {
        position: index + 1,
        generalName: normalize(member?.generalName),
        skill1: normalize(member?.skill1),
        skill1Alt: normalize(member?.skill1Alt),
        skill2: normalize(member?.skill2),
        skill2Alt: normalize(member?.skill2Alt),
        soldierType: normalize(member?.soldierType),
        soldierSkills: normalize(member?.soldierSkills),
        book1: normalize(member?.book1),
        book2: normalize(member?.book2),
        book3: normalize(member?.book3),
        equipPoint: normalize(member?.equipPoint),
        plusPoints: normalize(member?.plusPoints),
    };
}

function validateAndNormalizeDraft(input: TeamDraft): { draft?: TeamDraft; errors: string[] } {
    const errors: string[] = [];
    const members = Array.isArray(input?.members)
        ? input.members.slice(0, 3).map(normalizeMember)
        : [];
    const draft: TeamDraft = {
        teamName: normalize(input?.teamName),
        tier: normalize(input?.tier).toUpperCase(),
        formation: normalize(input?.formation),
        season: normalize(input?.season).toUpperCase(),
        members,
    };

    validateText(draft.teamName, '陣容名稱', 60, errors);
    validateText(draft.tier, 'Tier', 10, errors);
    validateText(draft.formation, '陣型', 20, errors);
    validateText(draft.season, '賽季', 10, errors);

    if (!/^T\d+(?:\.\d+)?$/.test(draft.tier)) errors.push('Tier 格式必須為 T0、T0.5 等形式。');
    if (!/^S\d+$/.test(draft.season)) errors.push('賽季格式必須為 S1、S2 等形式。');
    if (!FORMATIONS.includes(draft.formation as (typeof FORMATIONS)[number])) {
        errors.push('請選擇有效的陣型。');
    }
    if (members.length !== 3) errors.push('一組完整陣容必須包含三名武將。');

    members.forEach((member, index) => {
        const prefix = `第 ${index + 1} 名武將`;
        validateText(member.generalName, `${prefix}名稱`, 50, errors);
        validateText(member.skill1, `${prefix}戰法一`, 80, errors);
        validateText(member.skill2, `${prefix}戰法二`, 80, errors);
        validateText(member.soldierType, `${prefix}兵種`, 80, errors);
        validateText(member.book1, `${prefix}兵書一`, 100, errors);
        validateText(member.book2, `${prefix}兵書二`, 100, errors);
        validateText(member.book3, `${prefix}兵書三`, 100, errors);
        validateText(member.equipPoint, `${prefix}裝備屬性`, 120, errors);
        validateText(member.plusPoints, `${prefix}加點`, 120, errors);

        if (member.skill1Alt.length > 80 || member.skill2Alt.length > 80) {
            errors.push(`${prefix}的備選戰法不可超過 80 個字。`);
        }
        if (member.soldierSkills.length > 200) {
            errors.push(`${prefix}的專精不可超過 200 個字。`);
        }
    });

    const generals = members.map((member) => member.generalName).filter(Boolean);
    if (new Set(generals).size !== generals.length) errors.push('三個位置不可選擇重複武將。');

    const tactics = members
        .flatMap((member) => [member.skill1, member.skill1Alt, member.skill2, member.skill2Alt])
        .filter(Boolean);
    if (new Set(tactics).size !== tactics.length) errors.push('同一陣容內的主要與備選戰法不可重複。');

    return errors.length > 0 ? { errors } : { draft, errors };
}

export async function loginAdminAction(password: string): Promise<ActionResult> {
    const requestHeaders = await headers();
    const key = getRequestKey(requestHeaders.get('x-forwarded-for'));
    const now = Date.now();
    const attempt = loginAttempts.get(key);

    if (attempt && attempt.resetAt > now && attempt.count >= MAX_LOGIN_ATTEMPTS) {
        return { success: false, message: '嘗試次數過多，請於 15 分鐘後再試。' };
    }

    try {
        if (!verifyAdminPassword(password)) {
            const nextAttempt = attempt && attempt.resetAt > now
                ? { count: attempt.count + 1, resetAt: attempt.resetAt }
                : { count: 1, resetAt: now + LOGIN_WINDOW_MS };
            loginAttempts.set(key, nextAttempt);
            return { success: false, message: '密碼不正確。' };
        }

        loginAttempts.delete(key);
        await createAdminSession();
        return { success: true, message: '驗證成功。' };
    } catch {
        return { success: false, message: '管理員驗證尚未完成設定。' };
    }
}

export async function logoutAdminAction(): Promise<ActionResult> {
    await destroyAdminSession();
    return { success: true, message: '已安全登出。' };
}

export async function createTeamAction(input: TeamDraft): Promise<ActionResult> {
    if (!(await isAdminSessionValid())) {
        return { success: false, message: '登入已逾時，請重新輸入管理員密碼。' };
    }

    const { draft, errors } = validateAndNormalizeDraft(input);
    if (!draft) return { success: false, message: errors[0] || '請檢查表單內容。' };

    try {
        const supabase = createAdminClient();
        const { data, error } = await supabase.rpc('admin_create_team', {
            p_team_name: draft.teamName,
            p_tier: draft.tier,
            p_formation: draft.formation,
            p_season: draft.season,
            p_members: draft.members,
        });

        if (error) {
            if (error.code === '23505' || error.message.includes('duplicate team')) {
                return { success: false, message: '同一賽季已存在相同名稱的陣容。' };
            }
            if (error.message.includes('invalid general') || error.message.includes('invalid tactic')) {
                return { success: false, message: '武將或戰法資料已變更，請重新選擇後再送出。' };
            }
            return { success: false, message: '新增失敗，資料未寫入，請稍後再試。' };
        }

        revalidatePath('/builder');
        return { success: true, message: '陣容已新增。', teamId: Number(data) };
    } catch {
        return { success: false, message: '伺服器尚未完成管理員資料庫設定。' };
    }
}
