/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ReportPage from './page'

// next/navigation をモック
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))

// next/link をモック
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('ReportPage', () => {
  it('ページタイトルが表示される', () => {
    render(<ReportPage />)
    expect(screen.getByText('ペナルティ報告')).toBeInTheDocument()
  })

  it('注意事項が表示される', () => {
    render(<ReportPage />)
    expect(screen.getByText('報告前にご確認ください')).toBeInTheDocument()
    expect(screen.getByText(/虚偽の報告は処分の対象/)).toBeInTheDocument()
  })

  it('違反種別の選択肢が表示される', () => {
    render(<ReportPage />)
    expect(screen.getByText('違反種別 *')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('報告対象フィールドが表示される', () => {
    render(<ReportPage />)
    expect(screen.getByText('報告対象（ユーザー名/コンテンツURL）*')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/user123/)).toBeInTheDocument()
  })

  it('詳細説明フィールドが表示される', () => {
    render(<ReportPage />)
    expect(screen.getByText('詳細説明 *')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/違反行為の詳細/)).toBeInTheDocument()
  })

  it('証拠URLフィールドが表示される', () => {
    render(<ReportPage />)
    expect(screen.getByText('証拠URL（任意）')).toBeInTheDocument()
  })

  it('緊急フラグのチェックボックスが表示される', () => {
    render(<ReportPage />)
    expect(screen.getByText(/緊急対応が必要/)).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('送信ボタンとキャンセルボタンが表示される', () => {
    render(<ReportPage />)
    expect(screen.getByRole('button', { name: '報告を送信' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'キャンセル' })).toBeInTheDocument()
  })

  it('戻るボタンがホームへのリンクになっている', () => {
    render(<ReportPage />)
    const links = screen.getAllByRole('link')
    const backLink = links.find(link => link.getAttribute('href') === '/')
    expect(backLink).toBeInTheDocument()
  })

  it('必須項目が未入力の場合にエラーが表示される', async () => {
    render(<ReportPage />)

    // 送信ボタンをクリック（必須項目未入力の状態）
    const submitButton = screen.getByRole('button', { name: '報告を送信' })
    fireEvent.click(submitButton)

    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText(/違反種別を選択してください|報告対象を入力してください|詳細説明を入力してください/)).toBeInTheDocument()
    })
  })
})
