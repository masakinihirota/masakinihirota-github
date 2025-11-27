"use client"

import React, { useState } from 'react'
import Image from 'next/image'

type Props = { onUploaded?: (url: string) => void }

export default function MediaUploader({ onUploaded }: Props) {
    const [progress, setProgress] = useState(0)
    const [preview, setPreview] = useState<string | null>(null)

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        // Minimal local preview (no real upload in tests)
        const url = URL.createObjectURL(file)
        setPreview(url)

        // Simulate upload progress and then invoke onUploaded with a placeholder url
        let p = 0
        const interval = setInterval(() => {
            p += 20
            setProgress(p)
            if (p >= 100) {
                clearInterval(interval)
                const uploadedUrl = `https://cdn.example.com/${file.name}`
                onUploaded?.(uploadedUrl)
            }
        }, 50)
    }

    return (
        <div>
            <input aria-label="media-file" type="file" onChange={handleFile} />
            {preview && <div style={{ maxWidth: 200 }}><Image src={preview} alt="preview" width={200} height={120} /></div>}
            <div>Progress: {progress}%</div>
        </div>
    )
}
