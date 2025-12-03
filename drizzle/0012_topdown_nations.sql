-- 0012_topdown_nations.sql
-- トップダウン国（内政）機能のマイグレーション

-- =====================================================
-- 国レベルマスターデータ更新
-- =====================================================
INSERT INTO nation_levels (id, name) VALUES
  ('Group', 'Group'),
  ('Community', 'Community'),
  ('State', 'State'),
  ('Nation', 'Nation')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- トップダウン国基本情報テーブル
-- =====================================================
CREATE TABLE IF NOT EXISTS topdown_nations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  founder_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  founder_organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  scale_level INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active',

  -- 簡易ルール設定
  rule_penalty_holder TEXT DEFAULT 'forbidden',
  rule_yellow_card_limit INTEGER DEFAULT 0,
  rule_red_card_limit INTEGER DEFAULT 0,
  rule_trust_days_required INTEGER DEFAULT 0,
  rule_min_members INTEGER DEFAULT 1,
  rule_goal_match BOOLEAN DEFAULT FALSE,

  -- 税率設定
  market_tax_rate INTEGER DEFAULT 5,
  residency_fee INTEGER DEFAULT 0,

  -- 統計情報
  total_population INTEGER DEFAULT 0,
  resident_org_count INTEGER DEFAULT 0,
  visitor_org_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_topdown_nations_founder ON topdown_nations(founder_profile_id);
CREATE INDEX IF NOT EXISTS idx_topdown_nations_status ON topdown_nations(status);
CREATE INDEX IF NOT EXISTS idx_topdown_nations_scale_level ON topdown_nations(scale_level);

-- =====================================================
-- 国メンバーシップ（組織単位）
-- =====================================================
CREATE TABLE IF NOT EXISTS topdown_nation_memberships (
  nation_id UUID NOT NULL REFERENCES topdown_nations(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  membership_type TEXT NOT NULL DEFAULT 'visitor',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by UUID REFERENCES profiles(id),
  PRIMARY KEY (nation_id, organization_id)
);

CREATE INDEX IF NOT EXISTS idx_topdown_memberships_org_id ON topdown_nation_memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_topdown_memberships_type ON topdown_nation_memberships(membership_type);

-- =====================================================
-- 国銀行口座
-- =====================================================
CREATE TABLE IF NOT EXISTS nation_bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nation_id UUID NOT NULL REFERENCES topdown_nations(id) ON DELETE CASCADE,
  owner_type TEXT NOT NULL,
  owner_id UUID NOT NULL,
  balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bank_accounts_nation ON nation_bank_accounts(nation_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_owner ON nation_bank_accounts(owner_type, owner_id);

-- =====================================================
-- 銀行取引履歴
-- =====================================================
CREATE TABLE IF NOT EXISTS nation_bank_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES nation_bank_accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  related_account_id UUID REFERENCES nation_bank_accounts(id),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bank_transactions_account ON nation_bank_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_type ON nation_bank_transactions(type);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_created_at ON nation_bank_transactions(created_at);

-- =====================================================
-- ローン情報
-- =====================================================
CREATE TABLE IF NOT EXISTS nation_loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES nation_bank_accounts(id) ON DELETE CASCADE,
  principal_amount INTEGER NOT NULL,
  remaining_amount INTEGER NOT NULL,
  reason TEXT,
  approved_by UUID REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'active',
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loans_account ON nation_loans(account_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON nation_loans(status);

-- =====================================================
-- マーケット投稿
-- =====================================================
CREATE TABLE IF NOT EXISTS nation_market_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nation_id UUID NOT NULL REFERENCES topdown_nations(id) ON DELETE CASCADE,
  author_org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  author_profile_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  reward_amount INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open',
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_market_posts_nation ON nation_market_posts(nation_id);
CREATE INDEX IF NOT EXISTS idx_market_posts_author_org ON nation_market_posts(author_org_id);
CREATE INDEX IF NOT EXISTS idx_market_posts_status ON nation_market_posts(status);

-- =====================================================
-- マーケット応募
-- =====================================================
CREATE TABLE IF NOT EXISTS nation_market_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES nation_market_posts(id) ON DELETE CASCADE,
  applicant_org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  applicant_profile_id UUID NOT NULL REFERENCES profiles(id),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_applications_post ON nation_market_applications(post_id);
CREATE INDEX IF NOT EXISTS idx_market_applications_applicant ON nation_market_applications(applicant_org_id);

-- =====================================================
-- マーケット取引評価
-- =====================================================
CREATE TABLE IF NOT EXISTS nation_market_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES nation_market_posts(id) ON DELETE CASCADE,
  rater_profile_id UUID NOT NULL REFERENCES profiles(id),
  ratee_profile_id UUID NOT NULL REFERENCES profiles(id),
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_ratings_post ON nation_market_ratings(post_id);
CREATE INDEX IF NOT EXISTS idx_market_ratings_rater ON nation_market_ratings(rater_profile_id);

-- =====================================================
-- 調停者ローテーション
-- =====================================================
CREATE TABLE IF NOT EXISTS nation_mediators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nation_id UUID NOT NULL REFERENCES topdown_nations(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id),
  rotation_order INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mediators_nation ON nation_mediators(nation_id);
CREATE INDEX IF NOT EXISTS idx_mediators_active ON nation_mediators(is_active);

-- =====================================================
-- マップブロック（疎行列）
-- =====================================================
CREATE TABLE IF NOT EXISTS map_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  nation_id UUID REFERENCES topdown_nations(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'occupied',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (x, y)
);

CREATE INDEX IF NOT EXISTS idx_map_blocks_coord ON map_blocks(x, y);
CREATE INDEX IF NOT EXISTS idx_map_blocks_nation ON map_blocks(nation_id);

-- =====================================================
-- マップ設定
-- =====================================================
CREATE TABLE IF NOT EXISTS map_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- 初期マップ設定
INSERT INTO map_settings (key, value) VALUES
  ('world_width', '100'),
  ('world_height', '100'),
  ('fog_radius', '50'),
  ('center_x', '50'),
  ('center_y', '50')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- 国関連監査ログ
-- =====================================================
CREATE TABLE IF NOT EXISTS nation_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nation_id UUID REFERENCES topdown_nations(id) ON DELETE SET NULL,
  actor_profile_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  previous_value JSONB,
  new_value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_nation ON nation_audit_logs(nation_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON nation_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON nation_audit_logs(created_at);

-- =====================================================
-- RLS ポリシー（基本）
-- =====================================================

-- トップダウン国: 全ユーザー閲覧可、リーダーのみ更新
ALTER TABLE topdown_nations ENABLE ROW LEVEL SECURITY;

CREATE POLICY topdown_nations_select_all ON topdown_nations
  FOR SELECT USING (true);

CREATE POLICY topdown_nations_insert_leader ON topdown_nations
  FOR INSERT WITH CHECK (
    founder_profile_id IN (
      SELECT id FROM profiles WHERE root_account_id IN (
        SELECT id FROM root_accounts WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY topdown_nations_update_founder ON topdown_nations
  FOR UPDATE USING (
    founder_profile_id IN (
      SELECT id FROM profiles WHERE root_account_id IN (
        SELECT id FROM root_accounts WHERE user_id = auth.uid()
      )
    )
  );

-- 銀行口座: 所有者のみアクセス
ALTER TABLE nation_bank_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY bank_accounts_owner_access ON nation_bank_accounts
  FOR ALL USING (
    owner_id IN (
      SELECT id FROM organizations WHERE leader_profile_id IN (
        SELECT id FROM profiles WHERE root_account_id IN (
          SELECT id FROM root_accounts WHERE user_id = auth.uid()
        )
      )
    )
    OR
    owner_id IN (
      SELECT id FROM topdown_nations WHERE founder_profile_id IN (
        SELECT id FROM profiles WHERE root_account_id IN (
          SELECT id FROM root_accounts WHERE user_id = auth.uid()
        )
      )
    )
  );

-- マーケット投稿: 全ユーザー閲覧可、常駐組織のみ投稿
ALTER TABLE nation_market_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY market_posts_select_all ON nation_market_posts
  FOR SELECT USING (true);

CREATE POLICY market_posts_insert_resident ON nation_market_posts
  FOR INSERT WITH CHECK (
    author_org_id IN (
      SELECT organization_id FROM topdown_nation_memberships
      WHERE membership_type = 'resident'
    )
  );
