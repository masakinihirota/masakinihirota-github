/**
 * @file チュートリアル導線ロジックのユニットテスト
 * @description Task 12.1: チュートリアル導線の実装
 *
 * チュートリアル詳細設計書に基づく実装:
 * - ステータス管理 (not_started, in_progress, completed, skipped)
 * - ステップ進捗管理 (Lv0→Lv3)
 * - ルート選択 (org, nation, both, skip)
 * - 機能解放判定
 */
import { describe, it, expect } from 'vitest'
import {
  TutorialStatus,
  TutorialRoute,
  TutorialStep,
  TUTORIAL_STEPS,
  getTutorialProgress,
  canSkipTutorial,
  getNextStep,
  isStepCompleted,
  calculateTutorialRewards,
  isFeatureUnlocked,
  getFeatureUnlockLevel,
  shouldShowTutorialPrompt,
  getTutorialRouteDescription,
  getMenuItemState,
  getMenuUnlockTip,
  MENU_UNLOCK_CONFIG,
  isNewlyUnlocked,
} from './tutorial'

describe('Tutorial Logic', () => {
  describe('TutorialStatus', () => {
    it('should have correct status values', () => {
      expect(TutorialStatus.NOT_STARTED).toBe('not_started')
      expect(TutorialStatus.IN_PROGRESS).toBe('in_progress')
      expect(TutorialStatus.COMPLETED).toBe('completed')
      expect(TutorialStatus.SKIPPED).toBe('skipped')
    })
  })

  describe('TutorialRoute', () => {
    it('should have correct route values', () => {
      expect(TutorialRoute.ORGANIZATION).toBe('org')
      expect(TutorialRoute.NATION).toBe('nation')
      expect(TutorialRoute.BOTH).toBe('both')
      expect(TutorialRoute.SKIP).toBe('skip')
    })
  })

  describe('TUTORIAL_STEPS', () => {
    it('should contain all required steps', () => {
      expect(TUTORIAL_STEPS.length).toBeGreaterThanOrEqual(6)
    })

    it('should have login step as first step', () => {
      const loginStep = TUTORIAL_STEPS[0]
      expect(loginStep.id).toBe('login')
      expect(loginStep.requiredLevel).toBe(0)
      expect(loginStep.grantedLevel).toBe(1)
      expect(loginStep.points).toBe(300)
    })

    it('should have profile creation step as second step', () => {
      const profileStep = TUTORIAL_STEPS[1]
      expect(profileStep.id).toBe('profile_creation')
      expect(profileStep.requiredLevel).toBe(1)
      expect(profileStep.grantedLevel).toBe(2)
      expect(profileStep.points).toBe(300)
    })

    it('should have route selection step', () => {
      const routeStep = TUTORIAL_STEPS.find(s => s.id === 'route_selection')
      expect(routeStep).toBeDefined()
      expect(routeStep?.requiredLevel).toBe(2)
    })
  })

  describe('getTutorialProgress', () => {
    it('should return 0% for not started', () => {
      const progress = getTutorialProgress(0, TutorialStatus.NOT_STARTED)
      expect(progress.percentage).toBe(0)
      expect(progress.currentLevel).toBe(0)
      expect(progress.completedSteps).toBe(0)
    })

    it('should return correct progress for step 1', () => {
      const progress = getTutorialProgress(1, TutorialStatus.IN_PROGRESS)
      expect(progress.percentage).toBeGreaterThan(0)
      expect(progress.currentLevel).toBe(1)
      expect(progress.completedSteps).toBe(1)
    })

    it('should return 100% for completed', () => {
      const progress = getTutorialProgress(6, TutorialStatus.COMPLETED)
      expect(progress.percentage).toBe(100)
      expect(progress.completedSteps).toBe(TUTORIAL_STEPS.length)
    })

    it('should return 100% for skipped', () => {
      const progress = getTutorialProgress(2, TutorialStatus.SKIPPED)
      expect(progress.percentage).toBe(100)
    })
  })

  describe('canSkipTutorial', () => {
    it('should not allow skip at level 0', () => {
      expect(canSkipTutorial(0)).toBe(false)
    })

    it('should not allow skip at level 1', () => {
      expect(canSkipTutorial(1)).toBe(false)
    })

    it('should allow skip at level 2 (after profile creation)', () => {
      expect(canSkipTutorial(2)).toBe(true)
    })
  })

  describe('getNextStep', () => {
    it('should return login step for new user', () => {
      const nextStep = getNextStep(0, TutorialStatus.NOT_STARTED)
      expect(nextStep?.id).toBe('login')
    })

    it('should return profile step after login', () => {
      const nextStep = getNextStep(1, TutorialStatus.IN_PROGRESS)
      expect(nextStep?.id).toBe('profile_creation')
    })

    it('should return route selection after profile', () => {
      const nextStep = getNextStep(2, TutorialStatus.IN_PROGRESS)
      expect(nextStep?.id).toBe('route_selection')
    })

    it('should return null for completed tutorial', () => {
      const nextStep = getNextStep(6, TutorialStatus.COMPLETED)
      expect(nextStep).toBeNull()
    })

    it('should return null for skipped tutorial', () => {
      const nextStep = getNextStep(2, TutorialStatus.SKIPPED)
      expect(nextStep).toBeNull()
    })
  })

  describe('isStepCompleted', () => {
    it('should return true for completed steps', () => {
      expect(isStepCompleted('login', 1)).toBe(true)
      expect(isStepCompleted('profile_creation', 2)).toBe(true)
    })

    it('should return false for uncompleted steps', () => {
      expect(isStepCompleted('profile_creation', 1)).toBe(false)
      expect(isStepCompleted('route_selection', 2)).toBe(false)
    })
  })

  describe('calculateTutorialRewards', () => {
    it('should return 0 for step 0', () => {
      const rewards = calculateTutorialRewards(0)
      expect(rewards.totalPoints).toBe(0)
      expect(rewards.currentLevel).toBe(0)
    })

    it('should return 300 points for step 1', () => {
      const rewards = calculateTutorialRewards(1)
      expect(rewards.totalPoints).toBe(300)
      expect(rewards.currentLevel).toBe(1)
    })

    it('should return 600 points for step 2', () => {
      const rewards = calculateTutorialRewards(2)
      expect(rewards.totalPoints).toBe(600)
      expect(rewards.currentLevel).toBe(2)
    })

    it('should calculate skip bonus correctly', () => {
      const rewards = calculateTutorialRewards(2, TutorialRoute.SKIP)
      expect(rewards.skipBonus).toBe(500)
      expect(rewards.totalPoints).toBe(1100) // 600 + 500
    })
  })

  describe('isFeatureUnlocked', () => {
    it('should unlock home at level 1', () => {
      expect(isFeatureUnlocked('home', 1)).toBe(true)
      expect(isFeatureUnlocked('home', 0)).toBe(false)
    })

    it('should unlock profiles at level 1', () => {
      expect(isFeatureUnlocked('profiles', 1)).toBe(true)
    })

    it('should unlock matching at level 3', () => {
      expect(isFeatureUnlocked('matching', 3)).toBe(true)
      expect(isFeatureUnlocked('matching', 2)).toBe(false)
    })

    it('should unlock organizations at level 3', () => {
      expect(isFeatureUnlocked('organizations', 3)).toBe(true)
      expect(isFeatureUnlocked('organizations', 2)).toBe(false)
    })

    it('should unlock works at level 3', () => {
      expect(isFeatureUnlocked('works', 3)).toBe(true)
      expect(isFeatureUnlocked('works', 2)).toBe(false)
    })
  })

  describe('getFeatureUnlockLevel', () => {
    it('should return correct unlock levels', () => {
      expect(getFeatureUnlockLevel('home')).toBe(1)
      expect(getFeatureUnlockLevel('profiles')).toBe(1)
      expect(getFeatureUnlockLevel('matching')).toBe(3)
      expect(getFeatureUnlockLevel('organizations')).toBe(3)
      expect(getFeatureUnlockLevel('works')).toBe(3)
      expect(getFeatureUnlockLevel('values')).toBe(4)
      expect(getFeatureUnlockLevel('nations')).toBe(5)
    })
  })

  describe('shouldShowTutorialPrompt', () => {
    it('should show prompt for not started', () => {
      expect(shouldShowTutorialPrompt(TutorialStatus.NOT_STARTED, 0)).toBe(true)
    })

    it('should show prompt for in progress with low level', () => {
      expect(shouldShowTutorialPrompt(TutorialStatus.IN_PROGRESS, 1)).toBe(true)
    })

    it('should not show prompt for completed', () => {
      expect(shouldShowTutorialPrompt(TutorialStatus.COMPLETED, 3)).toBe(false)
    })

    it('should not show prompt for skipped', () => {
      expect(shouldShowTutorialPrompt(TutorialStatus.SKIPPED, 2)).toBe(false)
    })
  })

  describe('getTutorialRouteDescription', () => {
    it('should return correct description for org route', () => {
      const desc = getTutorialRouteDescription(TutorialRoute.ORGANIZATION)
      expect(desc.title).toContain('組織')
      expect(desc.icon).toBe('🏰')
    })

    it('should return correct description for nation route', () => {
      const desc = getTutorialRouteDescription(TutorialRoute.NATION)
      expect(desc.title).toContain('仲間')
      expect(desc.icon).toBe('🗺️')
    })

    it('should return correct description for both route', () => {
      const desc = getTutorialRouteDescription(TutorialRoute.BOTH)
      expect(desc.title).toContain('両方')
      expect(desc.icon).toBe('⚔️')
    })

    it('should return correct description for skip route', () => {
      const desc = getTutorialRouteDescription(TutorialRoute.SKIP)
      expect(desc.title).toContain('自由')
      expect(desc.icon).toBe('🕊️')
    })
  })

  // Task 12.4: Lv制UIへの統合
  describe('getMenuItemState (2段階解放)', () => {
    it('should return hidden for skills at level 1', () => {
      expect(getMenuItemState('skills', 1)).toBe('hidden')
    })

    it('should return grayed for matching at level 1', () => {
      expect(getMenuItemState('matching', 1)).toBe('grayed')
    })

    it('should return unlocked for matching at level 3', () => {
      expect(getMenuItemState('matching', 3)).toBe('unlocked')
    })

    it('should return always_visible for home at any level', () => {
      expect(getMenuItemState('home', 0)).toBe('unlocked')
      expect(getMenuItemState('home', 1)).toBe('unlocked')
    })

    it('should return grayed for nations at level 3', () => {
      expect(getMenuItemState('nations', 3)).toBe('grayed')
    })

    it('should return unlocked for nations at level 10', () => {
      expect(getMenuItemState('nations', 10)).toBe('unlocked')
    })
  })

  describe('getMenuUnlockTip', () => {
    it('should return tip for matching', () => {
      const tip = getMenuUnlockTip('matching')
      expect(tip).toContain('Lv3')
    })

    it('should return tip for nations', () => {
      const tip = getMenuUnlockTip('nations')
      expect(tip).toContain('Lv10')
    })

    it('should return empty for always unlocked features', () => {
      expect(getMenuUnlockTip('home')).toBe('')
    })
  })

  describe('MENU_UNLOCK_CONFIG', () => {
    it('should define unlock levels for all menu items', () => {
      expect(MENU_UNLOCK_CONFIG).toBeDefined()
      expect(MENU_UNLOCK_CONFIG.matching).toBeDefined()
      expect(MENU_UNLOCK_CONFIG.matching.grayLevel).toBe(1)
      expect(MENU_UNLOCK_CONFIG.matching.unlockLevel).toBe(3)
    })

    it('should have correct config for nations (upper level feature)', () => {
      expect(MENU_UNLOCK_CONFIG.nations.grayLevel).toBe(3)
      expect(MENU_UNLOCK_CONFIG.nations.unlockLevel).toBe(10)
    })

    it('should have correct config for skills (upper feature)', () => {
      expect(MENU_UNLOCK_CONFIG.skills.grayLevel).toBe(10)
      expect(MENU_UNLOCK_CONFIG.skills.unlockLevel).toBe(12)
    })
  })

  describe('isNewlyUnlocked', () => {
    it('should return true when level just reached unlock level', () => {
      expect(isNewlyUnlocked('matching', 3, 2)).toBe(true)
    })

    it('should return false when level was already above unlock level', () => {
      expect(isNewlyUnlocked('matching', 4, 3)).toBe(false)
    })

    it('should return false when level not yet at unlock level', () => {
      expect(isNewlyUnlocked('matching', 2, 1)).toBe(false)
    })
  })
})
