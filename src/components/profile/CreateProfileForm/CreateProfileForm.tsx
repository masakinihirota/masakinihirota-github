"use client"

import React, { useState } from 'react'
import { createProfileAction } from './CreateProfileForm.fetch'
import { WorkSearch } from '@/components/works/WorkSearch/WorkSearch'
import { upsertProfileWorkAction } from '@/components/profile/ProfileWorkForm/ProfileWorkForm.fetch'

export function CreateProfileForm() {
    const [name, setName] = useState('')
    const [role, setRole] = useState<'member' | 'leader'>('member')
    const [type, setType] = useState<'self' | 'organization'>('self')
    const [organizationName, setOrganizationName] = useState('')
    const [selectedValues, setSelectedValues] = useState<string[]>([])
    const [selectedSkills, setSelectedSkills] = useState<string[]>([])
    const [links, setLinks] = useState<Array<{ url: string; label?: string }>>([])
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
        formData.append('role', role)
        formData.append('type', type)
        if (role === 'leader') formData.append('organizationName', organizationName)
        if (selectedValues.length > 0) formData.append('values', JSON.stringify(selectedValues))
        if (selectedSkills.length > 0) formData.append('skills', JSON.stringify(selectedSkills))

        // attach links if present (ensure sent to server)
        if (links.length > 0) {
            formData.append(
                'links',
                JSON.stringify(
                    links
                        .filter(Boolean)
                        .map((l) => ({ url: l.url?.trim(), label: l.label?.trim() ? l.label.trim() : undefined }))
                )
            )
        }

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
        // links already sent as part of createProfileAction formData
    }

    function addWork(w: { id: string; title: string }) {
        if (selectedWorks.find((s) => s.id === w.id)) return
        setSelectedWorks((s) => [...s, { id: w.id, title: w.title, tier: null, claps: 0, liked: false }])
    }

    function removeWork(id: string) {
        setSelectedWorks((s) => s.filter((x) => x.id !== id))
    }

    function addContactLink() {
        setLinks((s) => [...s, { url: '', label: '' }])
    }

    function updateLink(index: number, patch: Partial<{ url: string; label?: string }>) {
        setLinks((s) => s.map((l, i) => (i === index ? { ...l, ...patch } : l)))
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="profile-name">Profile Name</label>
            <label htmlFor="profile-role">Role</label>
            <select id="profile-role" aria-label="Role" value={role} onChange={(e) => setRole(e.target.value as any)}>
                <option value="member">Member</option>
                <option value="leader">Leader</option>
            </select>

            <label htmlFor="profile-type">Type</label>
            <select id="profile-type" aria-label="Type" value={type} onChange={(e) => setType(e.target.value as any)}>
                <option value="self">Self</option>
                <option value="organization">Organization</option>
            </select>
            <input id="profile-name" aria-label="Profile Name" value={name} onChange={(e) => setName(e.target.value)} />
            {error && <div role="alert">{error}</div>}
            {role === 'leader' && (
                <div style={{ marginTop: 8 }}>
                    <label htmlFor="organization-name">Organization Name</label>
                    <input id="organization-name" aria-label="Organization Name" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} />
                </div>
            )}

            <div style={{ marginTop: 8 }}>
                <h4>Values</h4>
                <label>
                    <input type="checkbox" aria-label="Value A" checked={selectedValues.includes('v-a')} onChange={(e) => setSelectedValues((s) => e.target.checked ? [...s, 'v-a'] : s.filter(x => x !== 'v-a'))} /> Value A
                </label>
                <label>
                    <input type="checkbox" aria-label="Value B" checked={selectedValues.includes('v-b')} onChange={(e) => setSelectedValues((s) => e.target.checked ? [...s, 'v-b'] : s.filter(x => x !== 'v-b'))} /> Value B
                </label>
                <div style={{ marginTop: 8 }}>
                    <h4>Skills</h4>
                    <label>
                        <input type="checkbox" aria-label="Skill A" checked={selectedSkills.includes('s-a')} onChange={(e) => setSelectedSkills((s) => e.target.checked ? [...s, 's-a'] : s.filter(x => x !== 's-a'))} /> Skill A
                    </label>
                    <label>
                        <input type="checkbox" aria-label="Skill B" checked={selectedSkills.includes('s-b')} onChange={(e) => setSelectedSkills((s) => e.target.checked ? [...s, 's-b'] : s.filter(x => x !== 's-b'))} /> Skill B
                    </label>
                </div>
            </div>

            <div style={{ marginTop: 20 }}>
                <h3>Add works to this profile</h3>
                <WorkSearch onSelect={addWork} />

                <div style={{ marginTop: 12 }}>
                    <h4>Contact / External Links</h4>
                    <button type="button" onClick={addContactLink}>Add Link</button>
                    <ul>
                        {links.map((l, idx) => (
                            <li key={idx}>
                                <label>Link URL
                                    <input aria-label="Link URL" value={l.url} onChange={(e) => updateLink(idx, { url: e.target.value })} />
                                </label>
                                <label>Link Label
                                    <input aria-label="Link Label" value={l.label ?? ''} onChange={(e) => updateLink(idx, { label: e.target.value })} />
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>

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
