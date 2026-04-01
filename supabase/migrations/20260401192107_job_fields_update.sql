alter table "public"."jobs" add column "employment_type" text;

alter table "public"."jobs" add column "experience_level" text;

alter table "public"."jobs" add column "industry" text;

alter table "public"."jobs" add column "location" text;

alter table "public"."jobs" add column "required_tech_stack" text[] default '{}'::text[];

alter table "public"."jobs" add column "salary_range" text;

alter table "public"."jobs" add column "work_model" text;


