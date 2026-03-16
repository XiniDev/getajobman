
  create table "public"."cv_education" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "institution" text not null,
    "degree" text,
    "field_of_study" text,
    "start_date" text,
    "end_date" text,
    "grade" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."cv_education" enable row level security;


  create table "public"."cv_projects" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "project_name" text not null,
    "description" text,
    "tech_stack" text[] default '{}'::text[],
    "project_url" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."cv_projects" enable row level security;


  create table "public"."cv_skills" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "category" text not null,
    "skills" text[] not null default '{}'::text[],
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."cv_skills" enable row level security;


  create table "public"."cv_work_experience" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "company_name" text not null,
    "position_title" text not null,
    "location" text,
    "start_date" text,
    "end_date" text,
    "is_current" boolean default false,
    "description" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."cv_work_experience" enable row level security;

alter table "public"."profiles" add column "github_url" text;

alter table "public"."profiles" add column "linkedin_url" text;

alter table "public"."profiles" add column "location" text;

alter table "public"."profiles" add column "phone_number" text;

alter table "public"."profiles" add column "portfolio_url" text;

alter table "public"."profiles" add column "professional_summary" text;

CREATE UNIQUE INDEX cv_education_pkey ON public.cv_education USING btree (id);

CREATE UNIQUE INDEX cv_projects_pkey ON public.cv_projects USING btree (id);

CREATE UNIQUE INDEX cv_skills_pkey ON public.cv_skills USING btree (id);

CREATE UNIQUE INDEX cv_work_experience_pkey ON public.cv_work_experience USING btree (id);

alter table "public"."cv_education" add constraint "cv_education_pkey" PRIMARY KEY using index "cv_education_pkey";

alter table "public"."cv_projects" add constraint "cv_projects_pkey" PRIMARY KEY using index "cv_projects_pkey";

alter table "public"."cv_skills" add constraint "cv_skills_pkey" PRIMARY KEY using index "cv_skills_pkey";

alter table "public"."cv_work_experience" add constraint "cv_work_experience_pkey" PRIMARY KEY using index "cv_work_experience_pkey";

alter table "public"."cv_education" add constraint "cv_education_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."cv_education" validate constraint "cv_education_user_id_fkey";

alter table "public"."cv_projects" add constraint "cv_projects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."cv_projects" validate constraint "cv_projects_user_id_fkey";

alter table "public"."cv_skills" add constraint "cv_skills_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."cv_skills" validate constraint "cv_skills_user_id_fkey";

alter table "public"."cv_work_experience" add constraint "cv_work_experience_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."cv_work_experience" validate constraint "cv_work_experience_user_id_fkey";

grant delete on table "public"."cv_education" to "anon";

grant insert on table "public"."cv_education" to "anon";

grant references on table "public"."cv_education" to "anon";

grant select on table "public"."cv_education" to "anon";

grant trigger on table "public"."cv_education" to "anon";

grant truncate on table "public"."cv_education" to "anon";

grant update on table "public"."cv_education" to "anon";

grant delete on table "public"."cv_education" to "authenticated";

grant insert on table "public"."cv_education" to "authenticated";

grant references on table "public"."cv_education" to "authenticated";

grant select on table "public"."cv_education" to "authenticated";

grant trigger on table "public"."cv_education" to "authenticated";

grant truncate on table "public"."cv_education" to "authenticated";

grant update on table "public"."cv_education" to "authenticated";

grant delete on table "public"."cv_education" to "service_role";

grant insert on table "public"."cv_education" to "service_role";

grant references on table "public"."cv_education" to "service_role";

grant select on table "public"."cv_education" to "service_role";

grant trigger on table "public"."cv_education" to "service_role";

grant truncate on table "public"."cv_education" to "service_role";

grant update on table "public"."cv_education" to "service_role";

grant delete on table "public"."cv_projects" to "anon";

grant insert on table "public"."cv_projects" to "anon";

grant references on table "public"."cv_projects" to "anon";

grant select on table "public"."cv_projects" to "anon";

grant trigger on table "public"."cv_projects" to "anon";

grant truncate on table "public"."cv_projects" to "anon";

grant update on table "public"."cv_projects" to "anon";

grant delete on table "public"."cv_projects" to "authenticated";

grant insert on table "public"."cv_projects" to "authenticated";

grant references on table "public"."cv_projects" to "authenticated";

grant select on table "public"."cv_projects" to "authenticated";

grant trigger on table "public"."cv_projects" to "authenticated";

grant truncate on table "public"."cv_projects" to "authenticated";

grant update on table "public"."cv_projects" to "authenticated";

grant delete on table "public"."cv_projects" to "service_role";

grant insert on table "public"."cv_projects" to "service_role";

grant references on table "public"."cv_projects" to "service_role";

grant select on table "public"."cv_projects" to "service_role";

grant trigger on table "public"."cv_projects" to "service_role";

grant truncate on table "public"."cv_projects" to "service_role";

grant update on table "public"."cv_projects" to "service_role";

grant delete on table "public"."cv_skills" to "anon";

grant insert on table "public"."cv_skills" to "anon";

grant references on table "public"."cv_skills" to "anon";

grant select on table "public"."cv_skills" to "anon";

grant trigger on table "public"."cv_skills" to "anon";

grant truncate on table "public"."cv_skills" to "anon";

grant update on table "public"."cv_skills" to "anon";

grant delete on table "public"."cv_skills" to "authenticated";

grant insert on table "public"."cv_skills" to "authenticated";

grant references on table "public"."cv_skills" to "authenticated";

grant select on table "public"."cv_skills" to "authenticated";

grant trigger on table "public"."cv_skills" to "authenticated";

grant truncate on table "public"."cv_skills" to "authenticated";

grant update on table "public"."cv_skills" to "authenticated";

grant delete on table "public"."cv_skills" to "service_role";

grant insert on table "public"."cv_skills" to "service_role";

grant references on table "public"."cv_skills" to "service_role";

grant select on table "public"."cv_skills" to "service_role";

grant trigger on table "public"."cv_skills" to "service_role";

grant truncate on table "public"."cv_skills" to "service_role";

grant update on table "public"."cv_skills" to "service_role";

grant delete on table "public"."cv_work_experience" to "anon";

grant insert on table "public"."cv_work_experience" to "anon";

grant references on table "public"."cv_work_experience" to "anon";

grant select on table "public"."cv_work_experience" to "anon";

grant trigger on table "public"."cv_work_experience" to "anon";

grant truncate on table "public"."cv_work_experience" to "anon";

grant update on table "public"."cv_work_experience" to "anon";

grant delete on table "public"."cv_work_experience" to "authenticated";

grant insert on table "public"."cv_work_experience" to "authenticated";

grant references on table "public"."cv_work_experience" to "authenticated";

grant select on table "public"."cv_work_experience" to "authenticated";

grant trigger on table "public"."cv_work_experience" to "authenticated";

grant truncate on table "public"."cv_work_experience" to "authenticated";

grant update on table "public"."cv_work_experience" to "authenticated";

grant delete on table "public"."cv_work_experience" to "service_role";

grant insert on table "public"."cv_work_experience" to "service_role";

grant references on table "public"."cv_work_experience" to "service_role";

grant select on table "public"."cv_work_experience" to "service_role";

grant trigger on table "public"."cv_work_experience" to "service_role";

grant truncate on table "public"."cv_work_experience" to "service_role";

grant update on table "public"."cv_work_experience" to "service_role";


  create policy "Users can delete own education"
  on "public"."cv_education"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert own education"
  on "public"."cv_education"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update own education"
  on "public"."cv_education"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own education"
  on "public"."cv_education"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can delete own projects"
  on "public"."cv_projects"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert own projects"
  on "public"."cv_projects"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update own projects"
  on "public"."cv_projects"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own projects"
  on "public"."cv_projects"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can delete own skills"
  on "public"."cv_skills"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert own skills"
  on "public"."cv_skills"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update own skills"
  on "public"."cv_skills"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own skills"
  on "public"."cv_skills"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can delete own work exp"
  on "public"."cv_work_experience"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert own work exp"
  on "public"."cv_work_experience"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update own work exp"
  on "public"."cv_work_experience"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own work exp"
  on "public"."cv_work_experience"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



