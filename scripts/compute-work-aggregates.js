const postgres = require('postgres')

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'

async function main() {
    const sql = postgres(connectionString)
    try {
        console.log('Computing work aggregates...')

        const rows = await sql`
      SELECT
        work_id,
        COUNT(*)::int as total_ratings,
        SUM( (CASE WHEN tier=1 THEN 100 WHEN tier=2 THEN 50 WHEN tier=3 THEN 20 WHEN status='not_for_me' THEN -10 ELSE 5 END) + COALESCE(claps,0) * 1 + (CASE WHEN liked THEN 10 ELSE 0 END) ) as total_score,
        SUM(COALESCE(claps,0))::int as claps_total,
        SUM(CASE WHEN liked THEN 1 ELSE 0 END)::int as likes_count,
        SUM(CASE WHEN tier=1 THEN 1 ELSE 0 END)::int as tier1_count,
        SUM(CASE WHEN tier=2 THEN 1 ELSE 0 END)::int as tier2_count,
        SUM(CASE WHEN tier=3 THEN 1 ELSE 0 END)::int as tier3_count,
        SUM(CASE WHEN tier IS NULL AND status!='not_for_me' THEN 1 ELSE 0 END)::int as normal_count,
        SUM(CASE WHEN status='not_for_me' THEN 1 ELSE 0 END)::int as not_for_me_count
      FROM profile_works
      GROUP BY work_id
    `

        for (const r of rows) {
            const avg_score = Number(r.total_score) / Number(r.total_ratings)
            await sql`
        INSERT INTO work_aggregates (work_id, avg_score, total_ratings, total_score, claps_total, likes_count, tier1_count, tier2_count, tier3_count, normal_count, not_for_me_count, last_scored_at)
        VALUES (${r.work_id}, ${avg_score}, ${r.total_ratings}, ${r.total_score}, ${r.claps_total}, ${r.likes_count}, ${r.tier1_count}, ${r.tier2_count}, ${r.tier3_count}, ${r.normal_count}, ${r.not_for_me_count}, now())
        ON CONFLICT (work_id) DO UPDATE SET avg_score = EXCLUDED.avg_score, total_ratings = EXCLUDED.total_ratings, total_score = EXCLUDED.total_score, claps_total = EXCLUDED.claps_total, likes_count = EXCLUDED.likes_count, tier1_count = EXCLUDED.tier1_count, tier2_count = EXCLUDED.tier2_count, tier3_count = EXCLUDED.tier3_count, normal_count = EXCLUDED.normal_count, not_for_me_count = EXCLUDED.not_for_me_count, last_scored_at = now();
      `
        }

        console.log('Aggregates computed for', rows.length, 'works')
    } catch (err) {
        console.error('Failed to compute aggregates', err)
        process.exit(1)
    } finally {
        await sql.end()
    }
}

if (require.main === module) {
    main()
}

module.exports = main
