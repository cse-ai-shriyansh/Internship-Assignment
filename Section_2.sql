--Section 2
--Make remaining tables
create table if not exists teams (
    id UUID primary key default gen_random_uuid(),
    name text not null
);

create table if not exists user_teams (
    user_id UUID not null,
    team_id UUID not null references teams(id) on delete cascade,
    primary key (user_id, team_id)
);

--ENABLE ROW LEVEL SECURITY 
alter table leads enable row level security;

--##SELECTING POLICY##
--1.admin can read all leads
create policy "admins_can_read_all_leads"
    on leads 
    for select
    to authenticated
    using (
        auth.jwt()->>'role'='admin'
    );
--2. counselors can read leads assigned 
create policy "counselors_can_read_their_own_leads"
   on leads
   for select 
   to authenticated
   using(
    auth.jwt()->>'role' = 'counselor' 
    and owner_id= auth.uid()

   );
--3. counselors can read leads assigned to  their team
create policy "counselors_can_read_team_leads"
on leads
for SELECT 
to authenticated
using(
    auth.jwt()->>'role'='counselor'
    and owner_id in(
        select ut2.user_id
        from user_teams ut1
        join user_teams ut2 on ut1.team_id=ut2.team_id
        where ut1.user_id=auth.uid()
    )
);
--------------------------------------------------------------------------------------------------------------
--ADDING INSERT POLICY                                                                                       
--------------------------------------------------------------------------------------------------------------
--4. ADMIN CAN INSERT ANY LEADS
create policy "admins_can_insert_leads"
    on leads
    for insert
    to authenticated
    with check(
        auth.jwt()->>'role'='admin'
    );

    --5. COUNSELORS CAN INSERT LEADS(only if) ASSIGNED TO THEMSELVES
create policy "counselors_can_insert_own_leads"
    on leads
    for insert
    to authenticated
    with check(
        auth.jwt()->>'role'='counselor'
        and owner_id=auth.uid()
    );

