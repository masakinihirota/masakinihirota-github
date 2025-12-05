/**
 * 詩的ID（二つ名）システム用の単語プール
 *
 * 形式: 【形容詞】+【色/質感】+【名詞】
 * 例: 「黒き闘の白い燭台」「銀の光を纏う影」「燃える星の守護者」
 */

// デフォルト（和風・ファンタジー混合）プール
export const DEFAULT_ADJECTIVES = [
  // 色・光関連
  "黒き",
  "白き",
  "紅き",
  "蒼き",
  "金色の",
  "銀の",
  "翠の",
  "紫の",
  "漆黒の",
  "純白の",
  // 状態・性質
  "燃える",
  "凍える",
  "眠れる",
  "目覚めし",
  "失われし",
  "甦りし",
  "秘められし",
  "解き放たれし",
  // 時間・空間
  "永遠の",
  "刹那の",
  "遥かなる",
  "儚き",
  "久遠の",
  "悠久の",
  // 感情・印象
  "静かなる",
  "激しき",
  "穏やかな",
  "荒ぶる",
  "優しき",
  "猛き",
] as const;

export const DEFAULT_QUALITIES = [
  // 光・闘
  "闇の",
  "光の",
  "輝きを持つ",
  "影を纏う",
  "煌めく",
  "薄明の",
  // 質感
  "鋼の",
  "絹の",
  "硝子の",
  "水晶の",
  "琥珀の",
  "翡翠の",
  // 自然現象
  "風を呼ぶ",
  "雷を纏う",
  "炎を宿す",
  "氷を抱く",
  "霧に包まれし",
  "星を数える",
  // 感覚
  "夢見る",
  "囁く",
  "奏でる",
  "紡ぐ",
  "刻む",
  "守りし",
] as const;

export const DEFAULT_NOUNS = [
  // 人物・役割
  "騎士",
  "守護者",
  "賢者",
  "預言者",
  "旅人",
  "歌い手",
  "語り部",
  "織り手",
  // 天体・自然
  "月",
  "星",
  "太陽",
  "彗星",
  "流星",
  "極光",
  // 器物・象徴
  "剣",
  "盾",
  "杯",
  "鏡",
  "燭台",
  "羅針盤",
  "砂時計",
  "天秤",
  // 生物・幻獣
  "鷹",
  "狼",
  "龍",
  "鳳凰",
  "獅子",
  "蝶",
  // 抽象
  "影",
  "夢",
  "誓い",
  "記憶",
  "契約",
  "軌跡",
] as const;

// 和風プール
export const JAPANESE_ADJECTIVES = [
  "朧なる",
  "儚き",
  "雅なる",
  "清らかなる",
  "麗しき",
  "幽玄の",
  "侘びし",
  "寂びし",
  "華やかなる",
  "凛とした",
  "艶やかなる",
  "朗らかなる",
] as const;

export const JAPANESE_QUALITIES = [
  "桜を纏う",
  "月影の",
  "露を宿す",
  "霞に包まれし",
  "紅葉を散らす",
  "雪花の",
  "風雅な",
  "雲間の",
  "薄紅の",
  "藍染めの",
  "金箔の",
  "漆の",
] as const;

export const JAPANESE_NOUNS = [
  "武士",
  "巫女",
  "陰陽師",
  "琴師",
  "狐",
  "鶴",
  "蛍",
  "扇",
  "簪",
  "屏風",
  "行燈",
  "風鈴",
  "花筏",
  "木霊",
  "天女",
  "社",
] as const;

// 西洋ファンタジープール
export const WESTERN_ADJECTIVES = [
  "Ancient",
  "Eternal",
  "Mystic",
  "Sacred",
  "Divine",
  "Celestial",
  "Arcane",
  "Noble",
  "Fallen",
  "Risen",
  "Blessed",
  "Cursed",
] as const;

export const WESTERN_QUALITIES = [
  "of the Void",
  "of Light",
  "Moonlit",
  "Starborn",
  "Frostbound",
  "Flameforged",
  "Stormcaller",
  "Shadowbound",
  "Crystalwoven",
  "Runecarved",
  "Spiritlinked",
  "Oathbound",
] as const;

export const WESTERN_NOUNS = [
  "Knight",
  "Guardian",
  "Sage",
  "Oracle",
  "Wanderer",
  "Bard",
  "Sentinel",
  "Champion",
  "Phoenix",
  "Dragon",
  "Griffin",
  "Sphinx",
  "Crown",
  "Scepter",
  "Chalice",
  "Tome",
] as const;

// SF風プール
export const SCIFI_ADJECTIVES = [
  "量子の",
  "次元を超えし",
  "銀河の",
  "虚空の",
  "時空を渡る",
  "電脳の",
  "機械仕掛けの",
  "光速の",
  "超新星の",
  "暗黒物質の",
  "零重力の",
  "並行世界の",
] as const;

export const SCIFI_QUALITIES = [
  "回路を持つ",
  "データを紡ぐ",
  "波動を操る",
  "粒子を従える",
  "光子を纏う",
  "重力を歪める",
  "時間を刻む",
  "空間を織る",
  "星間を翔ける",
  "深淵を覗く",
  "次元を繋ぐ",
  "宇宙を抱く",
] as const;

export const SCIFI_NOUNS = [
  "航海士",
  "探査者",
  "技師",
  "司令官",
  "観測者",
  "創造者",
  "機体",
  "衛星",
  "母艦",
  "彗星",
  "特異点",
  "事象地平線",
  "量子",
  "波動",
  "信号",
  "座標",
] as const;

// プール定義をエクスポート
export const POETIC_ID_POOLS = {
  default: {
    id: "default",
    name: "デフォルト",
    adjectives: DEFAULT_ADJECTIVES,
    qualities: DEFAULT_QUALITIES,
    nouns: DEFAULT_NOUNS,
  },
  japanese: {
    id: "japanese",
    name: "和風",
    adjectives: JAPANESE_ADJECTIVES,
    qualities: JAPANESE_QUALITIES,
    nouns: JAPANESE_NOUNS,
  },
  western: {
    id: "western",
    name: "西洋ファンタジー",
    adjectives: WESTERN_ADJECTIVES,
    qualities: WESTERN_QUALITIES,
    nouns: WESTERN_NOUNS,
  },
  sci_fi: {
    id: "sci_fi",
    name: "SF",
    adjectives: SCIFI_ADJECTIVES,
    qualities: SCIFI_QUALITIES,
    nouns: SCIFI_NOUNS,
  },
} as const;

export type PoeticIdPoolId = keyof typeof POETIC_ID_POOLS;
