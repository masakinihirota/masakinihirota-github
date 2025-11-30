"use client"

import React from 'react'

const LANGS = [
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' }
]

export default function LanguageToggle({ storageKey = 'ui:lang' }: { storageKey?: string }) {
  const [lang, setLang] = React.useState<string>(() => {
    try { return typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) ?? 'ja' : 'ja' } catch { return 'ja' }
  })

  React.useEffect(() => {
    try { window.localStorage.setItem(storageKey, lang) } catch { }
  }, [lang, storageKey])

  return (
    <select
      aria-label="言語切替"
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      className="text-sm px-2 py-1 rounded border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
    >
      {LANGS.map(l => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  )
}
