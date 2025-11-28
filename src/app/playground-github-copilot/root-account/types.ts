export type RootAccountRow = {
  id: string
  display_name: string
  icon?: string
  location?: string
  native_language?: string
  points?: number
}

export type ProfileRow = {
  id: string
  name: string
  icon?: string
  purpose?: string
  role?: string
}

export type TransactionRow = { id: string; title: string; amount: number }
