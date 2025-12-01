// Minimal stub for nation creation logic (will be refined under TDD)
export type CreateNationInput = {
  rootAccountPoints: number
  cost: number
}

// Stub implementation: currently always returns { success: true } so the RED test will fail
export function canCreateNation(input: CreateNationInput): { success: boolean; reason?: string } {
  // Minimal business logic (GREEN): require rootAccountPoints >= cost
  const { rootAccountPoints, cost } = input
  if (rootAccountPoints >= cost) return { success: true }
  return { success: false, reason: 'insufficient_points' }
}

export default canCreateNation
