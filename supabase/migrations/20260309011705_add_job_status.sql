alter table "public"."jobs" add column "status" text not null default 'saved'::text;

alter table "public"."jobs" add constraint "jobs_status_check" CHECK ((status = ANY (ARRAY['saved'::text, 'drafting'::text, 'applied'::text, 'assessment'::text, 'interviewing'::text, 'offer'::text, 'rejected'::text, 'ghosted'::text, 'withdrawn'::text]))) not valid;

alter table "public"."jobs" validate constraint "jobs_status_check";


