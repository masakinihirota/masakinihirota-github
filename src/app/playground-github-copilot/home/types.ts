export type RootAccountRow = {
  id: string
  display_name: string
  icon?: string
  location?: string
  native_language?: string
  birth_generation?: string
  points?: number
}

export type ProfileRow = {
  id: string
  name: string
  icon?: string
  purpose?: string
}

export type AchievementRow = { id: string; title: string; description?: string; icon?: string }
