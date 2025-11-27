import React, { useState } from 'react'
import { createProfileAction } from './CreateProfileForm.fetch'
import { WorkSearch } from '@/components/works/WorkSearch/WorkSearch'
import { upsertProfileWorkAction } from '@/components/profile/ProfileWorkForm/ProfileWorkForm.fetch'

export function CreateProfileForm() {
    const [name, setName] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [selectedWorks, setSelectedWorks] = useState<Array<{ id: string; title: string; tier?: number | null; claps?: number; liked?: boolean; status?: string }>>([])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)

        if (!name || name.trim().length === 0) {
            setError('name is required')
            return
        }

        // Create FormData like other components do
        const formData = new FormData()
        formData.append('name', name.trim())
        formData.append('role', 'member')
        formData.append('type', 'self')

        // Call server action wrapper — in tests this will be mocked
        const result = await createProfileAction({}, formData)

        // if profile created, attach selected works
        const profileId = result?.data?.profileId
        if (profileId && selectedWorks.length > 0) {
            for (const w of selectedWorks) {
                const fd = new FormData()
                fd.append('profileId', profileId)
                fd.append('workId', w.id)
                fd.append('status', w.status ?? 'now')
                fd.append('tier', w.tier?.toString() ?? '')
                fd.append('claps', (w.claps ?? 0).toString())
                fd.append('liked', w.liked ? 'true' : 'false')
                await upsertProfileWorkAction({}, fd)
            }
        }
    }

    function addWork(w: { id: string; title: string }) {
        if (selectedWorks.find((s) => s.id === w.id)) return
        setSelectedWorks((s) => [...s, { id: w.id, title: w.title, tier: null, claps: 0, liked: false }])
    }

    function removeWork(id: string) {
        setSelectedWorks((s) => s.filter((x) => x.id !== id))
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="profile-name">Profile Name</label>
            <input id="profile-name" aria-label="Profile Name" value={name} onChange={(e) => setName(e.target.value)} />
            {error && <div role="alert">{error}</div>}
            <div style={{ marginTop: 20 }}>
                <h3>Add works to this profile</h3>
                <WorkSearch onSelect={addWork} />

                <ul>
                    {selectedWorks.map((w) => (
                        <li key={w.id}>
                            <strong>{w.title}</strong>
                            <label>Tier
                                <select value={w.tier ?? ''} onChange={(e) => setSelectedWorks((s) => s.map((x) => x.id === w.id ? { ...x, tier: e.target.value ? parseInt(e.target.value, 10) : null } : x))}>
                                    <option value="">-</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </label>
                            <label>Claps
                                <input type="number" value={w.claps ?? 0} onChange={(e) => setSelectedWorks((s) => s.map((x) => x.id === w.id ? { ...x, claps: Number(e.target.value) } : x))} />
                            </label>
                            <label>
                                <input type="checkbox" checked={w.liked ?? false} onChange={(e) => setSelectedWorks((s) => s.map((x) => x.id === w.id ? { ...x, liked: e.target.checked } : x))} /> Liked
                            </label>
                            <button type="button" onClick={() => removeWork(w.id)}>Remove</button>
                        </li>
                    ))}
                </ul>

                <button type="submit">Create Profile</button>
            </div>
        </form>
    )
}

export default CreateProfileForm
