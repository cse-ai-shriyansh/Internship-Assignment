--Section1
create table leads(
    id UUID primary key default gen_random_uuid(),
    tenant_id UUID not null,
    owner_id UUID,-- here we are not adding NOT NULL constraint because lead can be unassigned
    stage varchar(50),--We can add not null here but not now cuz it is optional
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()   
);

--createing index for leads table
create index idx_leads_owner_stage_created_at on leads(owner_id, stage, created_at desc);

--creating  applications table
create table applications(
    id UUID primary key default gen_random_uuid(),
    tenant_id UUID not null,
    lead_id UUID not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    constraint fk_applications_lead foreign key(lead_id) references leads(id) on delete cascade
);
--creating index for applications table
create index idx_applications_lead_id on applications(lead_id);

--creating tasks table 
create table tasks(
    id UUID primary key default gen_random_uuid (),
    tenant_id UUID not null,
    related_id UUID not null,-- this can be  application id
    type varchar(50) not null,-- allowed: call, email, review
    due_at timestamp with time zone,    
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    constraint fk_tasks_applications foreign key(related_id) references applications(id) on delete cascade,
    constraint chk_task_due_at_valid check (due_at >=created_at),
    constraint chk_task_type_enum check (type in ('call', 'email', 'review') )


);
--creating index for tasks table
create index idx_taskas_due_at on tasks( due_at);