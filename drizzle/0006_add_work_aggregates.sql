-- 0006_add_work_aggregates.sql
CREATE TABLE IF NOT EXISTS public.work_aggregates (
  work_id uuid PRIMARY KEY,
  avg_score numeric,
  total_ratings integer DEFAULT 0,
  total_score numeric DEFAULT 0,
  claps_total integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  tier1_count integer DEFAULT 0,
  tier2_count integer DEFAULT 0,
  tier3_count integer DEFAULT 0,
  normal_count integer DEFAULT 0,
  not_for_me_count integer DEFAULT 0,
  computed_rank integer,
  last_scored_at timestamptz DEFAULT now()
);

-- index for queries
CREATE INDEX IF NOT EXISTS idx_work_aggregates_avg_score ON public.work_aggregates (avg_score DESC);
