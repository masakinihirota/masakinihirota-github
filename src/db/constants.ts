export enum NationLevel {
  Group = "Group",          // Lv1: 10人まで, 1ブロック
  Community = "Community",  // Lv2: 150人まで, 4ブロック
  Village = "Village",      // Lv3: 1,000人まで, 16ブロック
  Town = "Town",            // Lv4: 5,000人まで, 36ブロック
  City = "City",            // Lv5: 20,000人まで, 64ブロック
  Metropolis = "Metropolis",// Lv6: 100,000人まで, 100ブロック
  State = "State",          // Lv7: 500,000人まで, 225ブロック
  Nation = "Nation",        // Lv8: 2,000,000人まで, 400ブロック
}

// 規模レベルごとの設定
export const NATION_LEVEL_CONFIG = {
  [NationLevel.Group]: { level: 1, maxPopulation: 10, maxBlocks: 1 },
  [NationLevel.Community]: { level: 2, maxPopulation: 150, maxBlocks: 4 },
  [NationLevel.Village]: { level: 3, maxPopulation: 1000, maxBlocks: 16 },
  [NationLevel.Town]: { level: 4, maxPopulation: 5000, maxBlocks: 36 },
  [NationLevel.City]: { level: 5, maxPopulation: 20000, maxBlocks: 64 },
  [NationLevel.Metropolis]: { level: 6, maxPopulation: 100000, maxBlocks: 100 },
  [NationLevel.State]: { level: 7, maxPopulation: 500000, maxBlocks: 225 },
  [NationLevel.Nation]: { level: 8, maxPopulation: 2000000, maxBlocks: 400 },
} as const

// 国の状態
export enum NationStatus {
  Active = "active",
  Suspended = "suspended",
  Archived = "archived",
}

// 銀行口座所有者タイプ
export enum BankAccountOwnerType {
  Nation = "nation",        // 国庫
  Organization = "organization", // 組織
}

// 銀行取引タイプ
export enum BankTransactionType {
  Deposit = "deposit",       // 預入
  Withdrawal = "withdrawal", // 引出
  Transfer = "transfer",     // 振込
  Fee = "fee",               // 手数料
  Tax = "tax",               // 税金
  Loan = "loan",             // ローン
  LoanRepayment = "loan_repayment", // ローン返済
  MaintenanceFee = "maintenance_fee", // 維持費
}

// マーケット投稿ステータス
export enum MarketPostStatus {
  Open = "open",
  Closed = "closed",
  Completed = "completed",
}

// 国参加タイプ
export enum NationMembershipType {
  Resident = "resident", // 常駐
  Visitor = "visitor",   // 入国（一時参加）
}

// 簡易ルール: ペナルティ保持者
export enum PenaltyHolderRule {
  Forbidden = "forbidden", // 入国禁止
  Allowed = "allowed",     // 許可
}

// 簡易ルール: イエローカード上限
export enum YellowCardLimit {
  Zero = 0,
  One = 1,
  Two = 2,
  Three = 3,
  Five = 5,
  Ten = 10,
  Unlimited = -1,
}

// 簡易ルール: 信頼継続日数
export enum TrustDaysRequired {
  Zero = 0,
  Thirty = 30,
  Sixty = 60,
  Hundred = 100,
  HundredEighty = 180,
  ThreeSixtyFive = 365,
}

// マップブロックステータス
export enum MapBlockStatus {
  Occupied = "occupied",   // 占有中
  Reserved = "reserved",   // 予約済
  Special = "special",     // システム用（中央など）
}

export enum OrganizationRole {
  Leader = "leader",
  SubLeader = "sub_leader",
  Member = "member",
}

export enum SystemRole {
  SuperAdmin = "R1",
  Admin = "R2",
  UserSupport = "R3",
  Developer = "R4",
  Tester = "R5",
  Accountant = "R6",
  GeneralUser = "R7",
}

export enum NationRole {
  King = "king",
  Minister = "minister",
  Citizen = "citizen",
}

export enum WorkCategory {
  Book = "Book",
  Movie = "Movie",
  Game = "Game",
  Music = "Music",
}

export enum ValueCategory {
  Life = "life",
  Work = "work",
  Love = "love",
  Hobby = "hobby",
  Uncategorized = "Uncategorized",
}
