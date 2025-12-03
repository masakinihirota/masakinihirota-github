/**
 * トップダウン国ロジック関数のユニットテスト
 * 設計書: 0130-03-国の内政テスト計画書.md
 */

import { describe, it, expect } from "vitest"
import {
  calculateScaleLevel,
  getMaxBlocksForLevel,
  checkOrganizationEligibility,
  checkSufficientBalance,
  calculateLoanLimit,
  calculateMarketTax,
  isAdjacentBlock,
  calculateRemainingBlocks,
  calculateReEntryDate,
  canReEnter,
  calculateNextRotationDate,
  calculateRequiredMediators,
  isValidBlockCoordinate,
  RE_ENTRY_RESTRICTION_DAYS,
  MEDIATOR_ROTATION_DAYS,
} from "./topdown.logic"
import { NationLevel, NATION_LEVEL_CONFIG } from "@/db/constants"

// =====================================================
// calculateScaleLevel テスト
// =====================================================
describe("calculateScaleLevel", () => {
  it("人口に応じて適切なレベルを返す", () => {
    // NATION_LEVEL_CONFIGに基づいてテスト
    // 小さい人口からテスト
    const result = calculateScaleLevel(5)
    expect(typeof result).toBe("string")
  })

  it("最大レベルはNation", () => {
    const result = calculateScaleLevel(1000000)
    expect(result).toBe(NationLevel.Nation)
  })

  it("負の人口でもエラーにならない", () => {
    const result = calculateScaleLevel(-1)
    expect(typeof result).toBe("string")
  })
})

// =====================================================
// getMaxBlocksForLevel テスト
// =====================================================
describe("getMaxBlocksForLevel", () => {
  it("レベル番号から最大ブロック数を取得", () => {
    // レベル1 (Group)
    const result = getMaxBlocksForLevel(1)
    expect(typeof result).toBe("number")
    expect(result).toBeGreaterThanOrEqual(1)
  })

  it("不明なレベルは1を返す", () => {
    expect(getMaxBlocksForLevel(999)).toBe(1)
  })
})

// =====================================================
// checkOrganizationEligibility テスト
// =====================================================
describe("checkOrganizationEligibility", () => {
  const defaultOrganization = {
    memberCount: 10,
    yellowCardCount: 0,
    redCardCount: 0,
    trustDays: 100,
    hasPenalty: false,
    goal: "technology",
  }

  const defaultRules = {
    rulePenaltyHolder: "allowed" as const,
    ruleYellowCardLimit: 3,
    ruleRedCardLimit: 1,
    ruleTrustDaysRequired: 30,
    ruleMinMembers: 5,
    ruleGoalMatch: false,
    nationGoal: "technology",
  }

  it("条件を満たす場合は適格", () => {
    const result = checkOrganizationEligibility(defaultOrganization, defaultRules)
    expect(result.isEligible).toBe(true)
  })

  it("ペナルティ保持者が禁止の場合は不適格", () => {
    const rules = { ...defaultRules, rulePenaltyHolder: "forbidden" as const }
    const org = { ...defaultOrganization, hasPenalty: true }
    const result = checkOrganizationEligibility(org, rules)
    expect(result.isEligible).toBe(false)
    expect(result.reason).toContain("ペナルティ")
  })

  it("イエローカード上限超過で不適格", () => {
    const org = { ...defaultOrganization, yellowCardCount: 5 }
    const result = checkOrganizationEligibility(org, defaultRules)
    expect(result.isEligible).toBe(false)
    expect(result.reason).toContain("イエローカード")
  })

  it("レッドカード上限超過で不適格", () => {
    const org = { ...defaultOrganization, redCardCount: 5 }
    const result = checkOrganizationEligibility(org, defaultRules)
    expect(result.isEligible).toBe(false)
    expect(result.reason).toContain("レッドカード")
  })

  it("信頼継続日数不足で不適格", () => {
    const org = { ...defaultOrganization, trustDays: 10 }
    const result = checkOrganizationEligibility(org, defaultRules)
    expect(result.isEligible).toBe(false)
    expect(result.reason).toContain("信頼継続日数")
  })

  it("メンバー数不足で不適格", () => {
    const org = { ...defaultOrganization, memberCount: 2 }
    const result = checkOrganizationEligibility(org, defaultRules)
    expect(result.isEligible).toBe(false)
    expect(result.reason).toContain("メンバー数")
  })

  it("目的不一致で不適格（目的一致が必要な場合）", () => {
    const rules = { ...defaultRules, ruleGoalMatch: true, nationGoal: "education" }
    const result = checkOrganizationEligibility(defaultOrganization, rules)
    expect(result.isEligible).toBe(false)
    expect(result.reason).toContain("目的")
  })
})

// =====================================================
// checkSufficientBalance テスト
// =====================================================
describe("checkSufficientBalance", () => {
  it("残高が十分な場合はtrue", () => {
    expect(checkSufficientBalance(1000, 500)).toBe(true)
    expect(checkSufficientBalance(500, 500)).toBe(true)
  })

  it("残高が不足している場合はfalse", () => {
    expect(checkSufficientBalance(400, 500)).toBe(false)
    expect(checkSufficientBalance(0, 1)).toBe(false)
  })

  it("0の場合", () => {
    expect(checkSufficientBalance(0, 0)).toBe(true)
  })
})

// =====================================================
// calculateLoanLimit テスト
// =====================================================
describe("calculateLoanLimit", () => {
  it("残高・メンバー数・信用スコアからローン限度額を計算", () => {
    // baseLimit = 100 * 2 = 200
    // memberBonus = 10 * 100 = 1000
    // trustBonus = 100 * 10 = 1000
    // total = 200 + 1000 + 1000 = 2200
    const result = calculateLoanLimit(100, 10, 100)
    expect(result).toBe(2200)
  })

  it("残高0でもメンバーボーナスで借入可能", () => {
    // baseLimit = 0
    // memberBonus = 5 * 100 = 500
    // trustBonus = 100 * 10 = 1000
    // total = 500 + 1000 = 1500
    const result = calculateLoanLimit(0, 5, 100)
    expect(result).toBe(1500)
  })

  it("信用スコアのデフォルト値は100", () => {
    const result = calculateLoanLimit(100, 10)
    // baseLimit = 200, memberBonus = 1000, trustBonus = 1000
    expect(result).toBe(2200)
  })
})

// =====================================================
// calculateMarketTax テスト
// =====================================================
describe("calculateMarketTax", () => {
  it("取引額と税率から手数料を計算", () => {
    expect(calculateMarketTax(1000, 5)).toBe(50)
    expect(calculateMarketTax(500, 10)).toBe(50)
    expect(calculateMarketTax(2000, 2)).toBe(40)
  })

  it("税率が0の場合は0", () => {
    expect(calculateMarketTax(1000, 0)).toBe(0)
  })

  it("取引額が0の場合は0", () => {
    expect(calculateMarketTax(0, 10)).toBe(0)
  })

  it("結果は整数（切り捨て）", () => {
    expect(calculateMarketTax(100, 3)).toBe(3) // 3.0 → 3
    expect(calculateMarketTax(99, 5)).toBe(4) // 4.95 → 4
  })
})

// =====================================================
// isAdjacentBlock テスト
// =====================================================
describe("isAdjacentBlock", () => {
  it("既存ブロックに隣接している場合はtrue", () => {
    const existingBlocks = [{ x: 5, y: 5 }]
    // 上
    expect(isAdjacentBlock(existingBlocks, 5, 4)).toBe(true)
    // 下
    expect(isAdjacentBlock(existingBlocks, 5, 6)).toBe(true)
    // 左
    expect(isAdjacentBlock(existingBlocks, 4, 5)).toBe(true)
    // 右
    expect(isAdjacentBlock(existingBlocks, 6, 5)).toBe(true)
  })

  it("斜めは隣接していない", () => {
    const existingBlocks = [{ x: 5, y: 5 }]
    expect(isAdjacentBlock(existingBlocks, 4, 4)).toBe(false)
    expect(isAdjacentBlock(existingBlocks, 6, 6)).toBe(false)
  })

  it("既存ブロックが空の場合は任意の位置でtrue", () => {
    expect(isAdjacentBlock([], 50, 50)).toBe(true)
    expect(isAdjacentBlock([], 0, 0)).toBe(true)
  })

  it("複数の既存ブロックのいずれかに隣接していればtrue", () => {
    const existingBlocks = [
      { x: 5, y: 5 },
      { x: 10, y: 10 },
    ]
    expect(isAdjacentBlock(existingBlocks, 5, 4)).toBe(true)
    expect(isAdjacentBlock(existingBlocks, 10, 11)).toBe(true)
    expect(isAdjacentBlock(existingBlocks, 7, 7)).toBe(false)
  })
})

// =====================================================
// calculateRemainingBlocks テスト
// =====================================================
describe("calculateRemainingBlocks", () => {
  it("残りブロック数を正しく計算", () => {
    // レベルによって結果が異なる
    const result = calculateRemainingBlocks(3, 1)
    expect(typeof result).toBe("number")
    expect(result).toBeGreaterThanOrEqual(0)
  })

  it("上限に達している場合は0", () => {
    // getMaxBlocksForLevelが返す値を超える場合
    const result = calculateRemainingBlocks(9999, 1)
    expect(result).toBe(0)
  })
})

// =====================================================
// isValidBlockCoordinate テスト
// =====================================================
describe("isValidBlockCoordinate", () => {
  it("有効な座標はtrue", () => {
    expect(isValidBlockCoordinate(0, 0)).toBe(true)
    expect(isValidBlockCoordinate(50, 50)).toBe(true)
    expect(isValidBlockCoordinate(99, 99)).toBe(true)
  })

  it("負の座標は無効", () => {
    expect(isValidBlockCoordinate(-1, 0)).toBe(false)
    expect(isValidBlockCoordinate(0, -1)).toBe(false)
  })

  it("範囲外の座標は無効", () => {
    expect(isValidBlockCoordinate(100, 0)).toBe(false)
    expect(isValidBlockCoordinate(0, 100)).toBe(false)
  })

  it("カスタムサイズ指定", () => {
    expect(isValidBlockCoordinate(49, 49, 50, 50)).toBe(true)
    expect(isValidBlockCoordinate(50, 50, 50, 50)).toBe(false)
  })
})

// =====================================================
// calculateReEntryDate テスト
// =====================================================
describe("calculateReEntryDate", () => {
  it("イエローカードは30日後", () => {
    const penaltyDate = new Date("2024-01-01T00:00:00Z")
    const result = calculateReEntryDate(penaltyDate, "yellowCard")
    expect(result).not.toBeNull()
    expect(result!.getFullYear()).toBe(2024)
    expect(result!.getMonth()).toBe(0) // 1月
    expect(result!.getDate()).toBe(31)
  })

  it("レッドカードは90日後", () => {
    const penaltyDate = new Date("2024-01-01T00:00:00Z")
    const result = calculateReEntryDate(penaltyDate, "redCard")
    expect(result).not.toBeNull()
    expect(result!.getFullYear()).toBe(2024)
    expect(result!.getMonth()).toBe(2) // 3月
  })

  it("脱退は180日後", () => {
    const penaltyDate = new Date("2024-01-01T00:00:00Z")
    const result = calculateReEntryDate(penaltyDate, "leave")
    expect(result).not.toBeNull()
    expect(result!.getFullYear()).toBe(2024)
    expect(result!.getMonth()).toBe(5) // 6月
  })

  it("anotherDimensionは永久禁止（null）", () => {
    const penaltyDate = new Date("2024-01-01T00:00:00Z")
    const result = calculateReEntryDate(penaltyDate, "anotherDimension")
    expect(result).toBeNull()
  })
})

// =====================================================
// canReEnter テスト
// =====================================================
describe("canReEnter", () => {
  it("制限期間が過ぎていればtrue", () => {
    const penaltyDate = new Date("2024-01-01")
    const currentDate = new Date("2024-06-01")
    expect(canReEnter(penaltyDate, "yellowCard", currentDate)).toBe(true)
  })

  it("制限期間内はfalse", () => {
    const penaltyDate = new Date("2024-01-01")
    const currentDate = new Date("2024-01-15")
    expect(canReEnter(penaltyDate, "yellowCard", currentDate)).toBe(false)
  })

  it("anotherDimensionは常にfalse", () => {
    const penaltyDate = new Date("2020-01-01")
    const currentDate = new Date("2030-01-01")
    expect(canReEnter(penaltyDate, "anotherDimension", currentDate)).toBe(false)
  })
})

// =====================================================
// calculateNextRotationDate テスト
// =====================================================
describe("calculateNextRotationDate", () => {
  it("現在日から18日後を返す", () => {
    const startDate = new Date("2024-01-01T00:00:00Z")
    const result = calculateNextRotationDate(startDate)
    expect(result.getDate()).toBe(19) // 1日 + 18日 = 19日
    expect(result.getMonth()).toBe(0) // 1月
  })
})

// =====================================================
// calculateRequiredMediators テスト
// =====================================================
describe("calculateRequiredMediators", () => {
  it("メンバー数の8%を返す", () => {
    expect(calculateRequiredMediators(100)).toBe(8)
    expect(calculateRequiredMediators(50)).toBe(4)
    expect(calculateRequiredMediators(25)).toBe(2)
  })

  it("最低1人", () => {
    expect(calculateRequiredMediators(1)).toBe(1)
    expect(calculateRequiredMediators(0)).toBe(1)
  })

  it("切り上げで計算", () => {
    expect(calculateRequiredMediators(30)).toBe(3) // 2.4 → 3
  })
})

// =====================================================
// 定数テスト
// =====================================================
describe("Constants", () => {
  it("RE_ENTRY_RESTRICTION_DAYS が正しく定義されている", () => {
    expect(RE_ENTRY_RESTRICTION_DAYS.yellowCard).toBe(30)
    expect(RE_ENTRY_RESTRICTION_DAYS.redCard).toBe(90)
    expect(RE_ENTRY_RESTRICTION_DAYS.leave).toBe(180)
    expect(RE_ENTRY_RESTRICTION_DAYS.anotherDimension).toBe(Infinity)
  })

  it("MEDIATOR_ROTATION_DAYS が18日", () => {
    expect(MEDIATOR_ROTATION_DAYS).toBe(18)
  })
})

// =====================================================
// Task 9.1: 月次維持費・常駐料金徴収ロジック テスト
// =====================================================
import {
  calculateMonthlyMaintenanceFee,
  calculateResidencyFee,
  calculateFeeCollectionResult,
  determineNationStatusAfterCollection,
  GRACE_PERIOD_DAYS,
} from "./topdown.logic"

describe("calculateMonthlyMaintenanceFee", () => {
  it("規模レベル1の基本維持費を計算する", () => {
    const result = calculateMonthlyMaintenanceFee(1, 1)
    expect(result).toBe(100) // レベル1の基本維持費
  })

  it("規模レベルに応じて維持費が増加する", () => {
    const level1Fee = calculateMonthlyMaintenanceFee(1, 1)
    const level3Fee = calculateMonthlyMaintenanceFee(3, 1)
    expect(level3Fee).toBeGreaterThan(level1Fee)
  })

  it("常駐組織数に応じて維持費が増加する", () => {
    const feeWith1Org = calculateMonthlyMaintenanceFee(1, 1)
    const feeWith5Orgs = calculateMonthlyMaintenanceFee(1, 5)
    expect(feeWith5Orgs).toBeGreaterThan(feeWith1Org)
  })
})

describe("calculateResidencyFee", () => {
  it("基本常駐料金を計算する", () => {
    const result = calculateResidencyFee(100, 1)
    expect(result).toBe(100) // baseRate * months
  })

  it("月数に応じて料金が増加する", () => {
    const fee1Month = calculateResidencyFee(100, 1)
    const fee3Months = calculateResidencyFee(100, 3)
    expect(fee3Months).toBe(fee1Month * 3)
  })

  it("基本料金が0の場合は常駐料金なし", () => {
    const result = calculateResidencyFee(0, 1)
    expect(result).toBe(0)
  })
})

describe("calculateFeeCollectionResult", () => {
  it("残高が十分な場合は全額徴収成功", () => {
    const result = calculateFeeCollectionResult(1000, 500)
    expect(result.collected).toBe(500)
    expect(result.shortfall).toBe(0)
    expect(result.success).toBe(true)
  })

  it("残高不足の場合は部分徴収", () => {
    const result = calculateFeeCollectionResult(300, 500)
    expect(result.collected).toBe(300)
    expect(result.shortfall).toBe(200)
    expect(result.success).toBe(false)
  })

  it("残高0の場合は徴収失敗", () => {
    const result = calculateFeeCollectionResult(0, 500)
    expect(result.collected).toBe(0)
    expect(result.shortfall).toBe(500)
    expect(result.success).toBe(false)
  })
})

describe("determineNationStatusAfterCollection", () => {
  it("徴収成功時は active を維持", () => {
    const result = determineNationStatusAfterCollection(true, 0, "active")
    expect(result.status).toBe("active")
    expect(result.gracePeriodEndDate).toBeNull()
  })

  it("初回徴収失敗時は猶予期間開始", () => {
    const result = determineNationStatusAfterCollection(false, 0, "active")
    expect(result.status).toBe("active")
    expect(result.gracePeriodEndDate).not.toBeNull()
  })

  it("猶予期間超過後も徴収失敗で suspended に移行", () => {
    const result = determineNationStatusAfterCollection(false, GRACE_PERIOD_DAYS + 1, "active")
    expect(result.status).toBe("suspended")
  })

  it("既に suspended の場合は維持", () => {
    const result = determineNationStatusAfterCollection(false, 60, "suspended")
    expect(result.status).toBe("suspended")
  })
})

// =====================================================
// Task 9.3: 調停者ローテーションロジック テスト
// =====================================================
import {
  shouldRotateMediator,
  getNextMediator,
  Mediator,
} from "./topdown.logic"

describe("calculateNextRotationDate", () => {
  it("18日後の日付を返す", () => {
    const startDate = new Date("2024-01-01")
    const result = calculateNextRotationDate(startDate)
    expect(result.getDate()).toBe(19) // 1日 + 18日 = 19日
  })

  it("月をまたぐ場合も正しく計算する", () => {
    const startDate = new Date("2024-01-20")
    const result = calculateNextRotationDate(startDate)
    expect(result.getMonth()).toBe(1) // 2月
    expect(result.getDate()).toBe(7) // 20日 + 18日 = 2月7日
  })
})

describe("shouldRotateMediator", () => {
  it("ローテーション期間経過前は false", () => {
    const lastRotation = new Date()
    lastRotation.setDate(lastRotation.getDate() - 10) // 10日前
    expect(shouldRotateMediator(lastRotation)).toBe(false)
  })

  it("ローテーション期間経過後は true", () => {
    const lastRotation = new Date()
    lastRotation.setDate(lastRotation.getDate() - MEDIATOR_ROTATION_DAYS) // 18日前
    expect(shouldRotateMediator(lastRotation)).toBe(true)
  })

  it("ローテーション期間を超過していても true", () => {
    const lastRotation = new Date()
    lastRotation.setDate(lastRotation.getDate() - 30) // 30日前
    expect(shouldRotateMediator(lastRotation)).toBe(true)
  })

  it("カスタム現在日付で判定できる", () => {
    const lastRotation = new Date("2024-01-01")
    const currentDate = new Date("2024-01-10") // 9日後
    expect(shouldRotateMediator(lastRotation, currentDate)).toBe(false)
  })
})

describe("getNextMediator", () => {
  const mediators: Mediator[] = [
    { id: "m1", rotationOrder: 1, isActive: true },
    { id: "m2", rotationOrder: 2, isActive: false },
    { id: "m3", rotationOrder: 3, isActive: false },
  ]

  it("現在の調停者の次を返す", () => {
    const result = getNextMediator(mediators, "m1")
    expect(result?.id).toBe("m2")
  })

  it("最後の調停者の次は最初に戻る", () => {
    const result = getNextMediator(mediators, "m3")
    expect(result?.id).toBe("m1")
  })

  it("調停者が見つからない場合は最初を返す", () => {
    const result = getNextMediator(mediators, "unknown")
    expect(result?.id).toBe("m1")
  })

  it("調停者リストが空の場合は null", () => {
    const result = getNextMediator([], "m1")
    expect(result).toBeNull()
  })

  it("調停者が1人の場合はその人を返す", () => {
    const singleMediator: Mediator[] = [{ id: "m1", rotationOrder: 1, isActive: true }]
    const result = getNextMediator(singleMediator, "m1")
    expect(result?.id).toBe("m1")
  })
})
