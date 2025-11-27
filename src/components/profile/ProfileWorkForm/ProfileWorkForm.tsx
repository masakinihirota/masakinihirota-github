import React, { useState } from 'react'
import { upsertProfileWorkAction } from './ProfileWorkForm.fetch'

export function ProfileWorkForm({ profileId, workId }: { profileId: string; workId: string }) {
    const [status, setStatus] = useState('now')
    const [tier, setTier] = useState<number | null>(null)
    const [claps, setClaps] = useState(0)
    const [liked, setLiked] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const formData = new FormData()
        formData.append('profileId', profileId)
        formData.append('workId', workId)
        formData.append('status', status)
        formData.append('tier', tier?.toString() ?? '')
        formData.append('claps', claps.toString())
        formData.append('liked', liked ? 'true' : 'false')

        await upsertProfileWorkAction({}, formData)
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="now">Now</option>
                <option value="life">Life</option>
                <option value="future">Future</option>
            </select>

            <label>Tier</label>
            <select aria-label="Tier" value={tier ?? ''} onChange={(e) => setTier(e.target.value ? parseInt(e.target.value, 10) : null)}>
                <option value="">-</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
            </select>

            <label>Claps</label>
            <input aria-label="Claps" type="number" value={claps} onChange={(e) => setClaps(Number(e.target.value))} />

            <label>
                <input type="checkbox" checked={liked} onChange={(e) => setLiked(e.target.checked)} /> Liked
            </label>

            <button type="submit">Save</button>
        </form>
    )
}

export default ProfileWorkForm
