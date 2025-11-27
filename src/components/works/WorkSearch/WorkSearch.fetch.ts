"use client"

// Client-side wrapper for searching works. This intentionally does NOT
// import server-only modules. Instead it calls a server API route which
// performs the database search.
export async function searchWorksAction(_prevState: unknown, formData: FormData) {
  const q = formData.get('q')?.toString() ?? ''

  if (!q || q.trim().length === 0) {
    return { success: true, data: [] }
  }

  try {
    const res = await fetch('/api/search-works', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q }),
    })

    if (!res.ok) {
      const error = await res.text()
      return { success: false, error }
    }

    const payload = await res.json()
    return payload
  } catch (err) {
    return { success: false, error: err }
  }
}

export default searchWorksAction
