-- 04_works.sql
-- Insert sample works / content catalog

INSERT INTO public.works (id, title, category_id, description, authors, release_year, genres, intro_url, affiliate_url, size, approved)
VALUES
 ('30000000-0000-0000-0000-000000000001','最初に読んだ本','Book','物語の短い小説です。', '[{"name":"著者A"}]'::jsonb, 2020, '["フィクション","ファンタジー"]'::jsonb, 'https://example.com/book1','', 'short', true),
 ('30000000-0000-0000-0000-000000000002','インディーゲーム','Game','楽しいインディーゲームです。', '[{"name":"開発スタジオ"}]'::jsonb, 2023, '["インディー","アドベンチャー"]'::jsonb, 'https://example.com/game', '', 'medium', true)
ON CONFLICT (id) DO NOTHING;
