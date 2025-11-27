import React, { useState } from 'react'
import { createProfileAction } from './CreateProfileForm.fetch'

export function CreateProfileForm() {
    const [name, setName] = useState('')
    const [error, setError] = useState<string | null>(null)

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
        await createProfileAction({}, formData)
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="profile-name">Profile Name</label>
            <input id="profile-name" aria-label="Profile Name" value={name} onChange={(e) => setName(e.target.value)} />
            {error && <div role="alert">{error}</div>}
            <button type="submit">Create Profile</button>
        </form>
    )
}

export default CreateProfileForm
