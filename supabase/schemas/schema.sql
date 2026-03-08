-- PROFILES table
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade primary key,
  first_name text,
  last_name text,
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
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;

-- Create RLS Policies (Security)
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