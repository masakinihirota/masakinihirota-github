-- 0005_add_user_features.sql
-- Add additional tables and alter existing tables to support:
--  - profile-level work ratings/status (tier/state/claps)
--  - extended works metadata (authors, release_year, genres, URLs, approved)
--  - points ledger / transactions (root_account_points, point_transactions)
--  - penalties table
--  - achievements master + mapping
--  - skills master + profile_skills
--  - follows + match_history

-- 1) extend profile_works
ALTER TABLE profile_works
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'now', -- 'now'/'life'/'future'
  ADD COLUMN IF NOT EXISTS tier smallint,
  ADD COLUMN IF NOT EXISTS claps integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS liked boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

-- 2) extend works
ALTER TABLE works
  ADD COLUMN IF NOT EXISTS authors jsonb,
  ADD COLUMN IF NOT EXISTS release_year integer,
  ADD COLUMN IF NOT EXISTS genres jsonb,
  ADD COLUMN IF NOT EXISTS intro_url text,
  ADD COLUMN IF NOT EXISTS affiliate_url text,
  ADD COLUMN IF NOT EXISTS size text,
  ADD COLUMN IF NOT EXISTS approved boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS created_by uuid;

ALTER TABLE works
  ADD CONSTRAINT works_created_by_root_account_fk FOREIGN KEY (created_by) REFERENCES public.root_accounts(id) ON DELETE SET NULL;

-- 3) points ledger tables
CREATE TABLE IF NOT EXISTS root_account_points (
  root_account_id uuid PRIMARY KEY REFERENCES public.root_accounts(id) ON DELETE CASCADE,
  balance bigint NOT NULL DEFAULT 0,
  last_updated timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS point_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  root_account_id uuid REFERENCES public.root_accounts(id) ON DELETE CASCADE,
  delta bigint NOT NULL,
  reason text,
  related_entity text,
  related_id uuid,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_point_transactions_root_account_id ON point_transactions(root_account_id);

-- 4) penalties
CREATE TABLE IF NOT EXISTS penalties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  root_account_id uuid REFERENCES public.root_accounts(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  description text,
  applied_by uuid,
  applied_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone NULL
);

CREATE INDEX IF NOT EXISTS idx_penalties_root_account_id ON penalties(root_account_id);

-- 5) achievements
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  points bigint DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS root_account_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  root_account_id uuid REFERENCES public.root_accounts(id) ON DELETE CASCADE,
  achievement_id uuid REFERENCES public.achievements(id) ON DELETE CASCADE,
  awarded_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_root_account_achievements_root_account_id ON root_account_achievements(root_account_id);

-- 6) skills
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text
);

CREATE TABLE IF NOT EXISTS profile_skills (
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  level smallint DEFAULT 0,
  PRIMARY KEY(profile_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_profile_skills_skill_id ON profile_skills(skill_id);

-- 7) follows
CREATE TABLE IF NOT EXISTS follows (
  follower_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (follower_profile_id, target_profile_id)
);

-- 8) match history
CREATE TABLE IF NOT EXISTS match_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  matched_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score numeric,
  matched_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_match_history_profile_id ON match_history(profile_id);

-- minor: ensure default categories exist (idempotent)
INSERT INTO value_categories (id, name) VALUES ('Uncategorized','Uncategorized') ON CONFLICT (id) DO NOTHING;
