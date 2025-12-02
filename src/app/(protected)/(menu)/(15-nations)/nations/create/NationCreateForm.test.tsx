/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NationCreateForm } from './NationCreateForm'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

// Mock the action
vi.mock('@/actions/createNationForm.action', () => ({
  createNationFormAction: vi.fn(() => Promise.resolve({ success: true, nationId: 'nation-1' })),
}))

describe('NationCreateForm', () => {
  it('renders form fields correctly', () => {
    render(<NationCreateForm />)

    expect(screen.getByLabelText('国名')).toBeInTheDocument()
    expect(screen.getByLabelText('国の説明')).toBeInTheDocument()
    expect(screen.getByLabelText('国のタイプ')).toBeInTheDocument()
    expect(screen.getByLabelText('ビジョン')).toBeInTheDocument()
    expect(screen.getByLabelText('基本ルール')).toBeInTheDocument()
    expect(screen.getByLabelText('オアシス宣言に同意します')).toBeInTheDocument()
    expect(screen.getByLabelText('建国規約に同意します')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<NationCreateForm />)

    expect(screen.getByRole('button', { name: /建国申請を送信/i })).toBeInTheDocument()
  })

  it('renders cancel button', () => {
    render(<NationCreateForm />)

    expect(screen.getByRole('button', { name: /キャンセル/i })).toBeInTheDocument()
  })
})
