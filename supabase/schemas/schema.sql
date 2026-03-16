-- ==========================================
-- AUTO-ENABLE RLS FUNCTION & TRIGGER
-- ==========================================
CREATE OR REPLACE FUNCTION public.rls_auto_enable()
RETURNS EVENT_TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;

DROP EVENT TRIGGER IF EXISTS ensure_rls;
CREATE EVENT TRIGGER ensure_rls
ON ddl_command_end
WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
EXECUTE FUNCTION public.rls_auto_enable();

-- ==========================================
-- CORE TABLES
-- ==========================================

-- PROFILES
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade primary key,
  first_name text,
  middle_name text,
  last_name text,
  preferred_name text,
  
  -- Master CV Header Info
  phone_number text,
  location text,
  linkedin_url text,
  github_url text,
  portfolio_url text,
  professional_summary text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- JOBS (Tracked Applications)
create table public.jobs (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  company_name text not null,
  job_title text not null,
  job_url text not null,
  job_description text,
  
  status text not null default 'saved' check (
    status in (
      'saved', 'drafting', 'applied', 'assessment', 
      'interviewing', 'offer', 'rejected', 'ghosted', 'withdrawn'
    )
  ),
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- MASTER CV TABLES
-- ==========================================

-- WORK EXPERIENCE
create table public.cv_work_experience (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  company_name text not null,
  position_title text not null,
  location text,
  start_date text,
  end_date text,
  is_current boolean default false,
  description text,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- EDUCATION
create table public.cv_education (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  institution text not null,
  degree text,
  field_of_study text,
  start_date text,
  end_date text,
  grade text,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROJECTS
create table public.cv_projects (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_name text not null,
  description text,
  tech_stack text[] default '{}',
  project_url text,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SKILLS
create table public.cv_skills (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  category text not null,
  skills text[] not null default '{}',

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- RLS POLICIES (Security)
-- ==========================================

-- PROFILES
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- JOBS
create policy "Users can view own jobs" on jobs for select using (auth.uid() = user_id);
create policy "Users can insert own jobs" on jobs for insert with check (auth.uid() = user_id);
create policy "Users can update own jobs" on jobs for update using (auth.uid() = user_id);
create policy "Users can delete own jobs" on jobs for delete using (auth.uid() = user_id);

-- CV WORK EXPERIENCE
create policy "Users can view own work exp" on cv_work_experience for select using (auth.uid() = user_id);
create policy "Users can insert own work exp" on cv_work_experience for insert with check (auth.uid() = user_id);
create policy "Users can update own work exp" on cv_work_experience for update using (auth.uid() = user_id);
create policy "Users can delete own work exp" on cv_work_experience for delete using (auth.uid() = user_id);

-- CV EDUCATION
create policy "Users can view own education" on cv_education for select using (auth.uid() = user_id);
create policy "Users can insert own education" on cv_education for insert with check (auth.uid() = user_id);
create policy "Users can update own education" on cv_education for update using (auth.uid() = user_id);
create policy "Users can delete own education" on cv_education for delete using (auth.uid() = user_id);

-- CV PROJECTS
create policy "Users can view own projects" on cv_projects for select using (auth.uid() = user_id);
create policy "Users can insert own projects" on cv_projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on cv_projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on cv_projects for delete using (auth.uid() = user_id);

-- CV SKILLS
create policy "Users can view own skills" on cv_skills for select using (auth.uid() = user_id);
create policy "Users can insert own skills" on cv_skills for insert with check (auth.uid() = user_id);
create policy "Users can update own skills" on cv_skills for update using (auth.uid() = user_id);
create policy "Users can delete own skills" on cv_skills for delete using (auth.uid() = user_id);

-- ==========================================
-- AUTOMATION
-- ==========================================

-- Automate Profile Creation Trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
