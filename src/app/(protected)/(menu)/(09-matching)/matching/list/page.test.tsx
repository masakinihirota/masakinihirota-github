/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import MatchingListPage from './page'

// next/link をモック
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('MatchingListPage', () => {
  it('ページタイトルが表示される', () => {
    render(<MatchingListPage />)
    expect(screen.getByText('手動マッチング')).toBeInTheDocument()
  })

  it('検索条件セクションが表示される', () => {
    render(<MatchingListPage />)
    expect(screen.getByText('検索条件')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('名前やスキルで検索...')).toBeInTheDocument()
  })

  it('スキルフィルターボタンが表示される', () => {
    render(<MatchingListPage />)
    // スキルフィルターセクションが存在することを確認
    expect(screen.getByText('スキルフィルター:')).toBeInTheDocument()
    // フィルターボタンとして「開発」が存在（タグには「開発」はないので一意）
    const filterButtons = screen.getAllByRole('button')
    // 「翻訳」はフィルターのみにある
    expect(screen.getByText('翻訳')).toBeInTheDocument()
    expect(screen.getByText('マーケティング')).toBeInTheDocument()
  })

  it('候補者一覧が表示される', () => {
    render(<MatchingListPage />)
    expect(screen.getByText(/候補者一覧/)).toBeInTheDocument()
  })

  it('候補者カードが表示される', () => {
    render(<MatchingListPage />)
    expect(screen.getByText('クリエイターA')).toBeInTheDocument()
    expect(screen.getByText('エンジニアB')).toBeInTheDocument()
    expect(screen.getByText('ライターC')).toBeInTheDocument()
    expect(screen.getByText('プロジェクトマネージャーD')).toBeInTheDocument()
  })

  it('マッチング申請ボタンが候補者ごとに表示される', () => {
    render(<MatchingListPage />)
    const matchButtons = screen.getAllByRole('button', { name: /マッチング申請/ })
    expect(matchButtons).toHaveLength(4)
  })

  it('プロフィールリンクが候補者ごとに表示される', () => {
    render(<MatchingListPage />)
    const profileLinks = screen.getAllByRole('link', { name: /プロフィール/ })
    expect(profileLinks).toHaveLength(4)
  })

  it('ページネーションボタンが表示される', () => {
    render(<MatchingListPage />)
    expect(screen.getByText('前へ')).toBeInTheDocument()
    expect(screen.getByText('次へ')).toBeInTheDocument()
  })

  it('戻るボタンが/matchingへのリンクになっている', () => {
    render(<MatchingListPage />)
    const backLink = screen.getByRole('link', { name: '' })
    expect(backLink).toHaveAttribute('href', '/matching')
  })
})
