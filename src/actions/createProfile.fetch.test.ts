import { describe, it, expect } from 'vitest'

// RED phase tests for createProfile Server Action
// These tests expect the Server Action to enforce validation and authentication.

describe('createProfile (Server Action) - RED tests', () => {
  it('throws ValidationError when name is empty', async () => {
    // Arrange
    // NOTE: createProfile implementation will be added later (GREEN). Import now to drive RED.
    const { createProfile } = await import('@/actions/createProfile.fetch')

    // Act + Assert
    await expect(
      // minimal payload with empty name
      createProfile({ rootAccountId: 'root_1', name: '', role: 'member', type: 'self' })
    ).rejects.toMatchObject({ code: 400, name: 'ValidationError' })
  })

  it('throws UnauthorizedError when called by an unauthenticated user', async () => {
    const { createProfile } = await import('@/actions/createProfile.fetch')

    // Simulate unauthenticated call - implementation should check session/context
    await expect(
      createProfile({ rootAccountId: 'root_1', name: 'Alice', role: 'member', type: 'self' }, { session: undefined })
    ).rejects.toMatchObject({ code: 401, name: 'UnauthorizedError' })
  })
})
