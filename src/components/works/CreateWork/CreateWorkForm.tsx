import React, { useState } from 'react'
import { createWorkAction } from './CreateWorkForm.fetch'
import MediaUploader from '../MediaUploader'

export function CreateWorkForm() {
    const [title, setTitle] = useState('')
    const [categoryId, setCategoryId] = useState('other')
    const [authors, setAuthors] = useState('')
    const [releaseYear, setReleaseYear] = useState('')
    const [size, setSize] = useState('')
    const [mediaUrl, setMediaUrl] = useState<string | undefined>()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData()
        formData.append('title', title)
        formData.append('categoryId', categoryId)
        formData.append('authors', authors)
        formData.append('releaseYear', releaseYear)
        formData.append('size', size)
        if (mediaUrl) formData.append('mediaUrl', mediaUrl)

        await createWorkAction({}, formData)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>
                <input aria-label="work-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
                <label>Category</label>
                <select aria-label="work-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                    <option value="novel">小説</option>
                    <option value="manga">漫画</option>
                    <option value="anime">アニメ</option>
                    <option value="movie">映画</option>
                    <option value="game">ゲーム</option>
                    <option value="music">音楽</option>
                    <option value="other">その他</option>
                </select>
            </div>

            <div>
                <label>Authors (comma separated)</label>
                <input aria-label="work-authors" value={authors} onChange={(e) => setAuthors(e.target.value)} />
            </div>

            <div>
                <label>Release Year</label>
                <input aria-label="work-year" type="number" value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} />
            </div>

            <div>
                <label>Size</label>
                <input aria-label="work-size" value={size} onChange={(e) => setSize(e.target.value)} />
            </div>

            <div>
                <label>Media</label>
                <MediaUploader onUploaded={(url) => setMediaUrl(url)} />
            </div>

            <button type="submit">Create Work</button>
        </form>
    )
}

export default CreateWorkForm
