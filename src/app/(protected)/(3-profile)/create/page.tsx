import React from 'react'
import { CreateProfileForm } from '@/components/profile/CreateProfileForm/CreateProfileForm'

export default function Page() {
    return (
        <div>
            <h1>Create Profile</h1>
            {/* client-side form to collect basic info and create profile */}
            <CreateProfileForm />
        </div>
    )
}
