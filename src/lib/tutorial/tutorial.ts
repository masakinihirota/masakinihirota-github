/**
 * @file チュートリアル導線ロジック
 * @description Task 12.1: チュートリアル導線の実装
 *
 * チュートリアル詳細設計書に基づく実装:
 * - ステータス管理 (not_started, in_progress, completed, skipped)
 * - ステップ進捗管理 (Lv0→Lv3)
 * - ルート選択 (org, nation, both, skip)
 * - 機能解放判定
 */

/**
 * チュートリアルステータス
 */
export const TutorialStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  SKIPPED: 'skipped',
} as const

export type TutorialStatusType = typeof TutorialStatus[keyof typeof TutorialStatus]

/**
 * チュートリアルルート
 */
export const TutorialRoute = {
  ORGANIZATION: 'org',
  NATION: 'nation',
  BOTH: 'both',
  SKIP: 'skip',
} as const

export type TutorialRouteType = typeof TutorialRoute[keyof typeof TutorialRoute]

/**
 * チュートリアルステップの定義
 */
export interface TutorialStep {
  id: string
  title: string
  description: string
  requiredLevel: number
  grantedLevel: number
  points: number
  href: string
  duration: string
  route?: TutorialRouteType | null // null = 全ルート共通
}

/**
 * 機能解放レベルの定義
 */
const FEATURE_UNLOCK_LEVELS: Record<string, number> = {
  home: 1,
  profiles: 1,
  matching: 3,
  organizations: 3,
  works: 3,
  values: 4,
  nations: 5,
}

/**
 * チュートリアルステップ定義
 * 詳細設計書 Section 2 に基づく
 */
export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'login',
    title: 'ログイン完了',
    description: '認証プロバイダ経由でログイン',
    requiredLevel: 0,
    grantedLevel: 1,
    points: 300,
    href: '/login',
    duration: '1分',
    route: null,
  },
  {
    id: 'profile_creation',
    title: 'プロフィール作成',
    description: 'ニックネーム、アイコン等の基本情報入力',
    requiredLevel: 1,
    grantedLevel: 2,
    points: 300,
    href: '/user-profiles',
    duration: '5分',
    route: null,
  },
  {
    id: 'route_selection',
    title: 'ルート選択',
    description: '王様AIと対話してルートを選択',
    requiredLevel: 2,
    grantedLevel: 2,
    points: 0,
    href: '/tutorial/route-selection',
    duration: '2分',
    route: null,
  },
  {
    id: 'create_organization',
    title: '一人組織結成',
    description: '自分の組織を作成する',
    requiredLevel: 2,
    grantedLevel: 3,
    points: 500,
    href: '/groups/new',
    duration: '5分',
    route: TutorialRoute.ORGANIZATION,
  },
  {
    id: 'set_vision',
    title: 'ビジョン設定',
    description: '組織のビジョンを設定する',
    requiredLevel: 3,
    grantedLevel: 3,
    points: 100,
    href: '/groups',
    duration: '5分',
    route: TutorialRoute.ORGANIZATION,
  },
  {
    id: 'join_nation',
    title: 'はじまりの国へ移動',
    description: '国へ参加して挨拶する',
    requiredLevel: 2,
    grantedLevel: 3,
    points: 500,
    href: '/nations',
    duration: '5分',
    route: TutorialRoute.NATION,
  },
]

/**
 * チュートリアル進捗情報
 */
export interface TutorialProgress {
  percentage: number
  currentLevel: number
  completedSteps: number
  totalSteps: number
  nextStep: TutorialStep | null
}

/**
 * チュートリアル報酬計算結果
 */
export interface TutorialRewards {
  totalPoints: number
  currentLevel: number
  skipBonus: number
}

/**
 * ルート説明
 */
export interface RouteDescription {
  title: string
  description: string
  icon: string
}

/**
 * チュートリアル進捗を取得
 */
export function getTutorialProgress(
  tutorialStep: number,
  status: TutorialStatusType
): TutorialProgress {
  // 完了またはスキップの場合は100%
  if (status === TutorialStatus.COMPLETED || status === TutorialStatus.SKIPPED) {
    return {
      percentage: 100,
      currentLevel: tutorialStep >= 2 ? 3 : tutorialStep,
      completedSteps: TUTORIAL_STEPS.length,
      totalSteps: TUTORIAL_STEPS.length,
      nextStep: null,
    }
  }

  // 進捗計算
  const completedSteps = Math.min(tutorialStep, TUTORIAL_STEPS.length)
  const percentage = Math.round((completedSteps / TUTORIAL_STEPS.length) * 100)
  const currentLevel = getLevelForStep(tutorialStep)
  const nextStep = getNextStep(tutorialStep, status)

  return {
    percentage,
    currentLevel,
    completedSteps,
    totalSteps: TUTORIAL_STEPS.length,
    nextStep,
  }
}

/**
 * ステップからレベルを取得
 */
function getLevelForStep(step: number): number {
  if (step === 0) return 0
  if (step === 1) return 1
  if (step >= 2) return 2
  return 0
}

/**
 * チュートリアルをスキップ可能か判定
 */
export function canSkipTutorial(currentLevel: number): boolean {
  // プロフィール作成完了（Lv2）後にスキップ可能
  return currentLevel >= 2
}

/**
 * 次のステップを取得
 */
export function getNextStep(
  currentStep: number,
  status: TutorialStatusType,
  route?: TutorialRouteType
): TutorialStep | null {
  // 完了またはスキップの場合は次のステップなし
  if (status === TutorialStatus.COMPLETED || status === TutorialStatus.SKIPPED) {
    return null
  }

  // 共通ステップを優先
  const commonSteps = TUTORIAL_STEPS.filter(s => s.route === null)

  // 現在のレベルを取得
  const currentLevel = getLevelForStep(currentStep)

  // 次に実行可能なステップを探す
  for (const step of commonSteps) {
    if (step.requiredLevel === currentLevel && !isStepCompleted(step.id, currentStep)) {
      return step
    }
  }

  // ルート固有のステップを探す
  if (route && route !== TutorialRoute.SKIP) {
    const routeSteps = TUTORIAL_STEPS.filter(
      s => s.route === route || (route === TutorialRoute.BOTH && s.route !== null && s.route !== TutorialRoute.SKIP)
    )
    for (const step of routeSteps) {
      if (step.requiredLevel <= currentLevel && !isStepCompleted(step.id, currentStep)) {
        return step
      }
    }
  }

  return null
}

/**
 * ステップが完了しているか判定
 */
export function isStepCompleted(stepId: string, currentStep: number): boolean {
  const stepIndex = TUTORIAL_STEPS.findIndex(s => s.id === stepId)
  if (stepIndex === -1) return false

  // login は step >= 1 で完了
  if (stepId === 'login') return currentStep >= 1
  // profile_creation は step >= 2 で完了
  if (stepId === 'profile_creation') return currentStep >= 2
  // route_selection は step >= 3 で完了
  if (stepId === 'route_selection') return currentStep >= 3

  return currentStep > stepIndex
}

/**
 * チュートリアル報酬を計算
 */
export function calculateTutorialRewards(
  currentStep: number,
  route?: TutorialRouteType
): TutorialRewards {
  let totalPoints = 0
  let currentLevel = 0
  let skipBonus = 0

  // 各ステップの報酬を合計
  for (let i = 0; i < Math.min(currentStep, TUTORIAL_STEPS.length); i++) {
    const step = TUTORIAL_STEPS[i]
    // 共通ステップまたは選択ルートのステップのみ加算
    if (step.route === null || step.route === route) {
      totalPoints += step.points
      if (step.grantedLevel > currentLevel) {
        currentLevel = step.grantedLevel
      }
    }
  }

  // スキップボーナス
  if (route === TutorialRoute.SKIP) {
    skipBonus = 500
    totalPoints += skipBonus
    currentLevel = 3 // スキップ時はLv3に到達
  }

  return {
    totalPoints,
    currentLevel,
    skipBonus,
  }
}

/**
 * 機能が解放されているか判定
 */
export function isFeatureUnlocked(feature: string, currentLevel: number): boolean {
  const unlockLevel = FEATURE_UNLOCK_LEVELS[feature]
  if (unlockLevel === undefined) return true // 未定義の機能は常に解放
  return currentLevel >= unlockLevel
}

/**
 * 機能の解放レベルを取得
 */
export function getFeatureUnlockLevel(feature: string): number {
  return FEATURE_UNLOCK_LEVELS[feature] ?? 0
}

/**
 * チュートリアルプロンプトを表示すべきか判定
 */
export function shouldShowTutorialPrompt(
  status: TutorialStatusType,
  currentLevel: number
): boolean {
  // 完了またはスキップの場合は表示しない
  if (status === TutorialStatus.COMPLETED || status === TutorialStatus.SKIPPED) {
    return false
  }

  // Lv3未満の場合は表示
  return currentLevel < 3
}

/**
 * ルート説明を取得
 */
export function getTutorialRouteDescription(route: TutorialRouteType): RouteDescription {
  switch (route) {
    case TutorialRoute.ORGANIZATION:
      return {
        title: '組織を育てたい',
        description: '自分の組織を作り、ビジョンを設定してメンバーを募集',
        icon: '🏰',
      }
    case TutorialRoute.NATION:
      return {
        title: '仲間を探したい',
        description: 'はじまりの国へ移動して仲間と交流',
        icon: '🗺️',
      }
    case TutorialRoute.BOTH:
      return {
        title: '両方やりたい',
        description: '組織編と国編の両方を体験',
        icon: '⚔️',
      }
    case TutorialRoute.SKIP:
      return {
        title: '自由にさせて',
        description: 'チュートリアルをスキップして自由に行動',
        icon: '🕊️',
      }
  }
}
