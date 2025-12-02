'use server'

import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { rootAccounts, rootAccountPoints, pointTransactions } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export async function createRootAccount(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const displayName = formData.get('displayName') as string
  const location = formData.get('location') as string
  const motherTongue = formData.get('motherTongue') as string
  const generation = formData.get('generation') as string
  const isAdsEnabled = formData.get('isAdsEnabled') === 'on'

  if (!displayName) {
    throw new Error('Display name is required')
  }

  // Check if root account already exists
  const existing = await db.query.rootAccounts.findFirst({
    where: eq(rootAccounts.userId, user.id)
  })

  if (existing) {
    return { success: false, message: 'Root account already exists' }
  }

  // Transaction to create root account and initial points
  await db.transaction(async (tx) => {
    const [newRootAccount] = await tx.insert(rootAccounts).values({
      userId: user.id,
      displayName,
      location,
      motherTongue,
      generation,
      isAdsEnabled,
      tutorialStep: 1, // Step 1 completed
    }).returning()

    // Initial Bonus: 3000pt
    const initialPoints = 3000
    await tx.insert(rootAccountPoints).values({
      rootAccountId: newRootAccount.id,
      balance: initialPoints,
    })

    await tx.insert(pointTransactions).values({
      rootAccountId: newRootAccount.id,
      delta: initialPoints,
      reason: 'Initial Bonus',
      relatedEntity: 'system',
    })
  })

  redirect('/dashboard') // Or wherever the user should go next
}

export async function getRootAccount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  return await db.query.rootAccounts.findFirst({
    where: eq(rootAccounts.userId, user.id)
  })
}

export async function resetRootAccount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // Delete root account (cascades to profiles, etc.)
  await db.delete(rootAccounts).where(eq(rootAccounts.userId, user.id))

  redirect('/onboarding')
}
