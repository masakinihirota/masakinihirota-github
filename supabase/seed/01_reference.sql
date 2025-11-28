-- 01_reference.sql
-- Reference/master data: categories, roles, nation levels

-- Work categories used across the application (keep ids consistent with code/tests)
INSERT INTO work_categories (id, name) VALUES
  ('novel','小説'),
  ('manga','漫画'),
  ('anime','アニメ'),
  ('movie','映画'),
  ('game','ゲーム'),
  ('drama','ドラマ'),
  ('book','書籍'),
  ('music','音楽'),
  ('other','その他')
ON CONFLICT (id) DO NOTHING;

-- Value categories (IDs follow app conventions used in tests and code)
INSERT INTO value_categories (id, name) VALUES
  ('life','人生観'),
  ('work','仕事観'),
  ('love','恋愛観'),
  ('social','対人観'),
  ('hobby','趣味')
ON CONFLICT (id) DO NOTHING;

INSERT INTO organization_roles (id, name) VALUES
  ('leader','リーダー'),
  ('member','メンバー')
ON CONFLICT (id) DO NOTHING;

INSERT INTO nation_levels (id, name) VALUES
  ('Village','村'),
  ('Town','町')
ON CONFLICT (id) DO NOTHING;

-- Value definitions (seed common values used in tests and app UI)
INSERT INTO public.value_definitions (id, content, category_id)
VALUES
  (gen_random_uuid(), '家族', 'life'),
  (gen_random_uuid(), 'お金', 'life'),
  (gen_random_uuid(), '自由', 'life'),
  (gen_random_uuid(), '挑戦', 'life'),
  (gen_random_uuid(), '安定', 'life'),
  (gen_random_uuid(), '給与', 'work'),
  (gen_random_uuid(), 'やりがい', 'work'),
  (gen_random_uuid(), '人間関係', 'work'),
  (gen_random_uuid(), '成長', 'work'),
  (gen_random_uuid(), 'ワークライフバランス', 'work'),
  (gen_random_uuid(), '誠実さ', 'love'),
  (gen_random_uuid(), 'ユーモア', 'love'),
  (gen_random_uuid(), '経済力', 'love'),
  (gen_random_uuid(), '外見', 'love'),
  (gen_random_uuid(), '価値観の一致', 'love'),
  (gen_random_uuid(), 'インドア', 'hobby'),
  (gen_random_uuid(), 'アウトドア', 'hobby'),
  (gen_random_uuid(), '創作活動', 'hobby'),
  (gen_random_uuid(), 'スポーツ', 'hobby'),
  (gen_random_uuid(), '旅行', 'hobby'),
  (gen_random_uuid(), '信頼', 'love'),
  (gen_random_uuid(), '礼儀', 'social'),
  (gen_random_uuid(), '共感', 'social')
ON CONFLICT DO NOTHING;
