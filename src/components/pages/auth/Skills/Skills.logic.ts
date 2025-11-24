// Pure logic helpers for Skills component
export const formatSkillLevel = (level: number) => {
  if (level <= 0) return 'none'
  if (level <= 3) return 'beginner'
  if (level <= 6) return 'practiced'
  return 'expert'
}
