drop policy if exists "Enable insert for authenticated users only" on public.teams_info;
drop policy if exists "Enable insert for authenticated users only" on public.team_members;

revoke insert, update, delete on table public.teams_info from anon, authenticated;
revoke insert, update, delete on table public.team_members from anon, authenticated;

grant select, insert on table public.teams_info to service_role;
grant select, insert on table public.team_members to service_role;

create unique index if not exists teams_info_season_team_name_unique
    on public.teams_info (upper(btrim(season)), btrim(team_name));

create or replace function public.admin_create_team(
    p_team_name text,
    p_tier text,
    p_formation text,
    p_season text,
    p_members jsonb
)
returns bigint
language plpgsql
security invoker
set search_path = ''
as $$
declare
    new_team_id bigint;
    member_count integer;
    distinct_position_count integer;
    distinct_general_count integer;
    tactic_count integer;
    distinct_tactic_count integer;
begin
    p_team_name := btrim(p_team_name);
    p_tier := upper(btrim(p_tier));
    p_formation := btrim(p_formation);
    p_season := upper(btrim(p_season));

    if p_team_name = '' or char_length(p_team_name) > 60 then
        raise exception 'invalid team name';
    end if;
    if p_tier !~ '^T[0-9]+([.][0-9]+)?$' then
        raise exception 'invalid tier';
    end if;
    if p_season !~ '^S[0-9]+$' then
        raise exception 'invalid season';
    end if;
    if p_formation not in ('一字陣', '偃月陣', '方圓陣', '箕形陣', '鉤形陣', '錐形陣', '雁形陣', '魚鱗陣') then
        raise exception 'invalid formation';
    end if;
    if jsonb_typeof(p_members) is distinct from 'array' then
        raise exception 'members must be an array';
    end if;

    select count(*), count(distinct m.position), count(distinct btrim(m."generalName"))
    into member_count, distinct_position_count, distinct_general_count
    from jsonb_to_recordset(p_members) as m(
        position bigint,
        "generalName" text,
        "skill1" text,
        "skill1Alt" text,
        "skill2" text,
        "skill2Alt" text,
        "soldierType" text,
        "soldierSkills" text,
        "book1" text,
        "book2" text,
        "book3" text,
        "equipPoint" text,
        "plusPoints" text
    );

    if member_count <> 3 or distinct_position_count <> 3 or distinct_general_count <> 3 then
        raise exception 'a complete team requires three unique members';
    end if;

    if exists (
        select 1
        from jsonb_to_recordset(p_members) as m(
            position bigint,
            "generalName" text,
            "skill1" text,
            "skill1Alt" text,
            "skill2" text,
            "skill2Alt" text,
            "soldierType" text,
            "soldierSkills" text,
            "book1" text,
            "book2" text,
            "book3" text,
            "equipPoint" text,
            "plusPoints" text
        )
        where m.position not between 1 and 3
           or nullif(btrim(m."generalName"), '') is null
           or nullif(btrim(m."skill1"), '') is null
           or nullif(btrim(m."skill2"), '') is null
           or nullif(btrim(m."soldierType"), '') is null
           or nullif(btrim(m."book1"), '') is null
           or nullif(btrim(m."book2"), '') is null
           or nullif(btrim(m."book3"), '') is null
           or nullif(btrim(m."equipPoint"), '') is null
           or nullif(btrim(m."plusPoints"), '') is null
    ) then
        raise exception 'required member field is missing';
    end if;

    if exists (
        select 1
        from jsonb_to_recordset(p_members) as m("generalName" text)
        where not exists (
            select 1
            from public.generals_info g
            where g.name = btrim(m."generalName")
              and nullif(btrim(g.avatar), '') is not null
        )
    ) then
        raise exception 'invalid general';
    end if;

    with selected_tactics as (
        select nullif(btrim(t.skill), '') as skill
        from jsonb_to_recordset(p_members) as m(
            "skill1" text,
            "skill1Alt" text,
            "skill2" text,
            "skill2Alt" text
        )
        cross join lateral (
            values (m."skill1"), (m."skill1Alt"), (m."skill2"), (m."skill2Alt")
        ) as t(skill)
    )
    select count(skill), count(distinct skill)
    into tactic_count, distinct_tactic_count
    from selected_tactics
    where skill is not null;

    if tactic_count <> distinct_tactic_count then
        raise exception 'duplicate tactic';
    end if;

    if exists (
        with selected_tactics as (
            select nullif(btrim(t.skill), '') as skill
            from jsonb_to_recordset(p_members) as m(
                "skill1" text,
                "skill1Alt" text,
                "skill2" text,
                "skill2Alt" text
            )
            cross join lateral (
                values (m."skill1"), (m."skill1Alt"), (m."skill2"), (m."skill2Alt")
            ) as t(skill)
        )
        select 1
        from selected_tactics selected
        where selected.skill is not null
          and not exists (
              select 1 from public.tactics_info tactic where tactic.name = selected.skill
          )
    ) then
        raise exception 'invalid tactic';
    end if;

    if exists (
        select 1
        from public.teams_info team
        where upper(btrim(team.season)) = p_season
          and btrim(team.team_name) = p_team_name
    ) then
        raise exception 'duplicate team';
    end if;

    insert into public.teams_info (team_name, tier, formation, season)
    values (p_team_name, p_tier, p_formation, p_season)
    returning team_id into new_team_id;

    insert into public.team_members (
        team_id,
        position,
        general_img,
        general_name,
        skill_1,
        skill_1_alt,
        skill_2,
        skill_2_alt,
        soldier_type,
        soldier_skills,
        book_1,
        book_2,
        book_3,
        equip_point,
        plus_points
    )
    select
        new_team_id,
        m.position,
        g.avatar,
        btrim(m."generalName"),
        btrim(m."skill1"),
        nullif(btrim(m."skill1Alt"), ''),
        btrim(m."skill2"),
        nullif(btrim(m."skill2Alt"), ''),
        btrim(m."soldierType"),
        nullif(btrim(m."soldierSkills"), ''),
        btrim(m."book1"),
        btrim(m."book2"),
        btrim(m."book3"),
        btrim(m."equipPoint"),
        btrim(m."plusPoints")
    from jsonb_to_recordset(p_members) as m(
        position bigint,
        "generalName" text,
        "skill1" text,
        "skill1Alt" text,
        "skill2" text,
        "skill2Alt" text,
        "soldierType" text,
        "soldierSkills" text,
        "book1" text,
        "book2" text,
        "book3" text,
        "equipPoint" text,
        "plusPoints" text
    )
    join public.generals_info g on g.name = btrim(m."generalName")
    order by m.position;

    return new_team_id;
end;
$$;

revoke execute on function public.admin_create_team(text, text, text, text, jsonb)
    from public, anon, authenticated;
grant execute on function public.admin_create_team(text, text, text, text, jsonb)
    to service_role;

notify pgrst, 'reload schema';
