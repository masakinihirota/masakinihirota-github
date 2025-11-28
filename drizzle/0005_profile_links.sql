-- Migration: add profile_links table

CREATE TABLE IF NOT EXISTS public.profile_links (
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  url text NOT NULL,
  label text,
  type text,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (profile_id, url)
);

CREATE INDEX IF NOT EXISTS idx_profile_links_profile_id ON public.profile_links(profile_id);
