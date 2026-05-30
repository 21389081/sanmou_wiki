export type Rarity = '橙' | '紫' | '藍';

export type General = {
    gid: number;
    name: string;
    avatar: string;
    rarity: Rarity;
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
    rarity: Rarity;
    type: string;
    soldier_type: string;
    trait: string;
    chance: string;
    effect_base: string;
    effect_max: string;
    season: string;
};

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
    plus_points: string;
};

export type Team = {
    team_id: number;
    team_name: string;
    tier: string;
    formation: string;
    season: string;
    members: TeamMember[];
};

export type TeamFilters = {
    generals?: string[];
    tactics?: string[];
    season?: string;
    tier?: string;
};
