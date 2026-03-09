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

-- PROFILES table
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade primary key,
  first_name text,
  middle_name text,
  last_name text,
  preferred_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- JOBS table
create table public.jobs (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  company_name text not null,
  job_title text not null,
  job_url text not null,
  job_description text,
  
  -- The Status Model
  status text not null default 'saved' check (
    status in (
      'saved', 
      'drafting', 
      'applied', 
      'assessment', 
      'interviewing', 
      'offer', 
      'rejected', 
      'ghosted', 
      'withdrawn'
    )
  ),
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- RLS POLICIES (Security)
-- ==========================================

create policy "Users can view own profile" 
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" 
  on profiles for update using (auth.uid() = id);

create policy "Users can view own jobs" 
  on jobs for select using (auth.uid() = user_id);
create policy "Users can insert own jobs" 
  on jobs for insert with check (auth.uid() = user_id);
create policy "Users can update own jobs" 
  on jobs for update using (auth.uid() = user_id);
create policy "Users can delete own jobs" 
  on jobs for delete using (auth.uid() = user_id);

-- ==========================================
-- AUTOMATION
-- ==========================================

-- Automate Profile Creation Trigger
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();