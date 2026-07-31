select setval(
    pg_get_serial_sequence('public.teams_info', 'team_id'),
    coalesce((select max(team_id) from public.teams_info), 0) + 1,
    false
);

select setval(
    pg_get_serial_sequence('public.team_members', 'members_id'),
    coalesce((select max(members_id) from public.team_members), 0) + 1,
    false
);

create index if not exists team_members_team_id_idx
    on public.team_members (team_id);
