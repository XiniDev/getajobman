export type Profile = {
  id: string; 
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  preferred_name: string | null;
  created_at: string; 
  updated_at: string;
};

export type Job = {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  job_url: string;
  job_description: string | null;
  created_at: string;
  updated_at: string;
};
