export const FORMATIONS = [
    '一字陣',
    '偃月陣',
    '方圓陣',
    '箕形陣',
    '鉤形陣',
    '錐形陣',
    '雁形陣',
    '魚鱗陣',
] as const;

export type GeneralOption = {
    gid: number;
    name: string;
    avatar: string;
};

export type TacticOption = {
    tid: number;
    name: string;
};

export type TeamMemberDraft = {
    position: number;
    generalName: string;
    skill1: string;
    skill1Alt: string;
    skill2: string;
    skill2Alt: string;
    soldierType: string;
    soldierSkills: string;
    book1: string;
    book2: string;
    book3: string;
    equipPoint: string;
    plusPoints: string;
};

export type TeamDraft = {
    teamName: string;
    tier: string;
    formation: string;
    season: string;
    members: TeamMemberDraft[];
};

export type ActionResult = {
    success: boolean;
    message: string;
    teamId?: number;
};
