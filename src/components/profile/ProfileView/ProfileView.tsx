import React from 'react'

type User = {
  id: string
  name?: string
  displayName?: string
}

export function ProfileView({ user }: { user: User }) {
  return (
    <div>
      <h2>{user.displayName ?? user.name ?? 'Unnamed'}</h2>
    </div>
  )
}

export default ProfileView
