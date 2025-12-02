/** @vitest-environment jsdom */
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { GlobalHeaderMenu } from './GlobalHeaderMenu'
import * as nextRouter from 'next/navigation'

vi.mock('next/navigation', async () => ({
    useRouter: () => ({ push: vi.fn() })
}))

describe('GlobalHeaderMenu', () => {
    it('navigates to /search?q=... when submitted', () => {
        const mockPush = vi.fn()
        // override mocked router
        vi.spyOn(nextRouter, 'useRouter').mockImplementation(() => ({ push: mockPush } as any))

        render(<GlobalHeaderMenu />)
        const input = screen.getByPlaceholderText(/作品を検索/)
        fireEvent.change(input, { target: { value: 'hello world' } })
        fireEvent.submit(input)

        expect(mockPush).toHaveBeenCalledWith('/search?q=hello+world')
    })

    it('renders quick results from fetch and shows link to detail', async () => {
        const mockPush = vi.fn()
        vi.spyOn(nextRouter, 'useRouter').mockImplementation(() => ({ push: mockPush } as any))

        global.fetch = vi.fn(async (url: string) => {
            return {
                ok: true,
                json: async () => ({ success: true, data: [{ id: 'w-1', title: 'Work 1', type: 'work' }] })
            } as any
        }) as any

        render(<GlobalHeaderMenu />)
        const input = screen.getByPlaceholderText(/作品を検索/)
        fireEvent.change(input, { target: { value: 'Work' } })

        // wait for the debounce + fetch
        await new Promise((r) => setTimeout(r, 300))

        expect(screen.getByText(/Work 1/)).toBeTruthy()
        expect(screen.getByText(/もっと詳しく検索/)).toBeTruthy()
    })
})
