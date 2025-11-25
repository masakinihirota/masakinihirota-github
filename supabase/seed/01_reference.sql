-- 01_reference.sql
-- Reference/master data: categories, roles, nation levels

INSERT INTO work_categories (id, name) VALUES
  ('Book','書籍'),
  ('Movie','映画'),
  ('Game','ゲーム')
ON CONFLICT (id) DO NOTHING;

INSERT INTO value_categories (id, name) VALUES
  ('Personal','個人'),
  ('Social','社会'),
  ('Professional','職業')
ON CONFLICT (id) DO NOTHING;

INSERT INTO organization_roles (id, name) VALUES
  ('leader','リーダー'),
  ('member','メンバー')
ON CONFLICT (id) DO NOTHING;

INSERT INTO nation_levels (id, name) VALUES
  ('Village','村'),
  ('Town','町')
ON CONFLICT (id) DO NOTHING;
