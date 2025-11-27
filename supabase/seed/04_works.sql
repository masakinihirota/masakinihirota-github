-- 04_works.sql
-- Insert sample works / content catalog

INSERT INTO public.works (id, title, category_id, description, authors, release_year, genres, intro_url, affiliate_url, size, approved)
VALUES
 ('30000000-0000-0000-0000-000000000001','最初に読んだ本','Book','物語の短い小説です。', '[{"name":"著者A"}]'::jsonb, 2020, '["フィクション","ファンタジー"]'::jsonb, 'https://example.com/book1','', 'short', true),
 ('30000000-0000-0000-0000-000000000002','インディーゲーム','Game','楽しいインディーゲームです。', '[{"name":"開発スタジオ"}]'::jsonb, 2023, '["インディー","アドベンチャー"]'::jsonb, 'https://example.com/game', '', 'medium', true)
ON CONFLICT (id) DO NOTHING;

-- Additional canonical works (migrated from Drizzle/TS seeds)
INSERT INTO public.works (id, title, category_id, description, authors, release_year, genres, intro_url, affiliate_url, size, approved)
VALUES
 ('30000000-0000-0000-0000-000000000003','走れメロス','novel','太宰治の代表作（短編）','[{"name":"太宰治"}]'::jsonb, 1940, '[]'::jsonb, '', '', 'short', true),
 ('30000000-0000-0000-0000-000000000004','銀河鉄道の夜','novel','宮沢賢治の幻想的な物語','[{"name":"宮沢賢治"}]'::jsonb, 1934, '[]'::jsonb, '', '', 'short', true),
 ('30000000-0000-0000-0000-000000000005','桃太郎','other','昔話の定番','[{"name":"不明"}]'::jsonb, NULL, '[]'::jsonb, '', '', 'short', true),
 ('30000000-0000-0000-0000-000000000006','葬送のフリーレン','manga','魔王討伐後の物語','[{"name":"作者不詳"}]'::jsonb, NULL, '[]'::jsonb, '', '', 'medium', true),
 ('30000000-0000-0000-0000-000000000007','ONE PIECE','manga','海賊王を目指す冒険譚','[{"name":"尾田栄一郎"}]'::jsonb, NULL, '[]'::jsonb, '', '', 'long', true),
 ('30000000-0000-0000-0000-000000000008','ELDEN RING','game','オープンワールドアクションRPG','[{"name":"FromSoftware"}]'::jsonb, 2022, '[]'::jsonb, '', '', 'large', true),
 ('30000000-0000-0000-0000-000000000009','Inception','movie','夢の中でアイデアを植え付ける','[{"name":"Christopher Nolan"}]'::jsonb, 2010, '[]'::jsonb, '', '', 'feature', true)
ON CONFLICT (id) DO NOTHING;
