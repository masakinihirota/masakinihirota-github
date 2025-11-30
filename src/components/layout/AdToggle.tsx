"use client"

import React, { useEffect, useState } from 'react'

export default function AdToggle({ storageKey = 'ui:ads' }: { storageKey?: string }) {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try {
      const v = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null
      return v === null ? true : v === '1'
    } catch { return true }
  })

  useEffect(() => {
    try { window.localStorage.setItem(storageKey, enabled ? '1' : '0') } catch { }
  }, [enabled, storageKey])

  return (
    <button
      aria-pressed={enabled}
      aria-label={enabled ? '広告を表示する' : '広告を非表示にする'}
      title={enabled ? '広告: 表示中' : '広告: オフ'}
      onClick={() => setEnabled(!enabled)}
      className={`text-sm px-2 py-1 rounded border ${enabled ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground'}`}
    >
      {enabled ? '広告: ON' : '広告: OFF'}
    </button>
  )
}
