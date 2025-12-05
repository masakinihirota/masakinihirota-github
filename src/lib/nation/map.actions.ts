'use server'

/**
 * 国マップ Server Actions
 * 設計書: 0134-02-国のマップ設計書.md
 */

import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import {
  mapBlocks,
  mapSettings,
  topdownNations,
} from '@/db/schema'
import { eq, and, gte, lte, sql } from 'drizzle-orm'
import {
  isAdjacentBlock,
  isValidBlockCoordinate,
  calculateRemainingBlocks,
  getMaxBlocksForLevel,
} from './topdown.logic'

// =====================================================
// 型定義
// =====================================================

export interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface MapBlockInfo {
  id: string
  x: number
  y: number
  nationId: string | null
  nationName?: string
  status: string
}

export interface MapViewport {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export interface MapClusterInfo {
  x: number
  y: number
  width: number
  height: number
  nationCount: number
  totalPopulation: number
  dominantNationId?: string
  dominantNationName?: string
}

export interface MapSettingsInfo {
  worldWidth: number
  worldHeight: number
  fogRadius: number
  centerX: number
  centerY: number
}

// =====================================================
// マップデータ取得 Actions
// =====================================================

/**
 * マップ設定取得
 */
export async function getMapSettings(): Promise<ActionResult<MapSettingsInfo>> {
  try {
    const settings = await db.select().from(mapSettings)

    const settingsMap: Record<string, unknown> = {}
    for (const s of settings) {
      settingsMap[s.key] = s.value
    }

    return {
      success: true,
      data: {
        worldWidth: Number(settingsMap['world_width']) || 100,
        worldHeight: Number(settingsMap['world_height']) || 100,
        fogRadius: Number(settingsMap['fog_radius']) || 50,
        centerX: Number(settingsMap['center_x']) || 50,
        centerY: Number(settingsMap['center_y']) || 50,
      },
    }
  } catch (error) {
    console.error('マップ設定取得エラー:', error)
    return { success: false, error: 'マップ設定の取得に失敗しました' }
  }
}

/**
 * マップブロック取得（詳細ビュー）
 * 指定したビューポート内のブロックを取得
 */
export async function getMapBlocks(
  viewport: MapViewport
): Promise<ActionResult<MapBlockInfo[]>> {
  try {
    const blocks = await db
      .select({
        block: mapBlocks,
        nation: topdownNations,
      })
      .from(mapBlocks)
      .leftJoin(topdownNations, eq(mapBlocks.nationId, topdownNations.id))
      .where(
        and(
          gte(mapBlocks.x, viewport.minX),
          lte(mapBlocks.x, viewport.maxX),
          gte(mapBlocks.y, viewport.minY),
          lte(mapBlocks.y, viewport.maxY)
        )
      )

    return {
      success: true,
      data: blocks.map((b) => ({
        id: b.block.id,
        x: b.block.x,
        y: b.block.y,
        nationId: b.block.nationId,
        nationName: b.nation?.name,
        status: b.block.status,
      })),
    }
  } catch (error) {
    console.error('マップブロック取得エラー:', error)
    return { success: false, error: 'マップブロックの取得に失敗しました' }
  }
}

/**
 * マップクラスタ取得（広域ビュー）
 * 低ズーム時にエリアごとの統計を返す
 */
export async function getMapClusters(
  viewport: MapViewport,
  clusterSize: number = 10
): Promise<ActionResult<MapClusterInfo[]>> {
  try {
    // クラスタリング: clusterSize x clusterSize のグリッドで集計
    const clusters: MapClusterInfo[] = []

    for (let x = viewport.minX; x <= viewport.maxX; x += clusterSize) {
      for (let y = viewport.minY; y <= viewport.maxY; y += clusterSize) {
        const clusterMaxX = Math.min(x + clusterSize - 1, viewport.maxX)
        const clusterMaxY = Math.min(y + clusterSize - 1, viewport.maxY)

        // このクラスタ内のブロック数と国数を集計
        const clusterBlocks = await db
          .select({
            nationId: mapBlocks.nationId,
            nationName: topdownNations.name,
            population: topdownNations.totalPopulation,
          })
          .from(mapBlocks)
          .leftJoin(topdownNations, eq(mapBlocks.nationId, topdownNations.id))
          .where(
            and(
              gte(mapBlocks.x, x),
              lte(mapBlocks.x, clusterMaxX),
              gte(mapBlocks.y, y),
              lte(mapBlocks.y, clusterMaxY)
            )
          )

        if (clusterBlocks.length > 0) {
          // 国ごとに集計
          const nationStats: Record<string, { name: string; blockCount: number; population: number }> = {}
          let totalPopulation = 0

          for (const block of clusterBlocks) {
            if (block.nationId) {
              if (!nationStats[block.nationId]) {
                nationStats[block.nationId] = {
                  name: block.nationName || '',
                  blockCount: 0,
                  population: block.population || 0,
                }
              }
              nationStats[block.nationId].blockCount++
              totalPopulation += block.population || 0
            }
          }

          // 最大勢力を特定
          let dominantNationId: string | undefined
          let dominantNationName: string | undefined
          let maxBlocks = 0

          for (const [nationId, stats] of Object.entries(nationStats)) {
            if (stats.blockCount > maxBlocks) {
              maxBlocks = stats.blockCount
              dominantNationId = nationId
              dominantNationName = stats.name
            }
          }

          clusters.push({
            x,
            y,
            width: clusterMaxX - x + 1,
            height: clusterMaxY - y + 1,
            nationCount: Object.keys(nationStats).length,
            totalPopulation,
            dominantNationId,
            dominantNationName,
          })
        }
      }
    }

    return { success: true, data: clusters }
  } catch (error) {
    console.error('マップクラスタ取得エラー:', error)
    return { success: false, error: 'マップクラスタの取得に失敗しました' }
  }
}

/**
 * 国の領土取得
 */
export async function getNationTerritory(
  nationId: string
): Promise<ActionResult<MapBlockInfo[]>> {
  try {
    const blocks = await db
      .select()
      .from(mapBlocks)
      .where(eq(mapBlocks.nationId, nationId))

    return {
      success: true,
      data: blocks.map((b) => ({
        id: b.id,
        x: b.x,
        y: b.y,
        nationId: b.nationId,
        status: b.status,
      })),
    }
  } catch (error) {
    console.error('国領土取得エラー:', error)
    return { success: false, error: '国領土の取得に失敗しました' }
  }
}

// =====================================================
// 領土管理 Actions
// =====================================================

/**
 * 領土拡張（ブロック獲得）
 */
export async function acquireBlock(
  nationId: string,
  x: number,
  y: number
): Promise<ActionResult<{ blockId: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  try {
    // マップ設定取得
    const settingsResult = await getMapSettings()
    if (!settingsResult.success || !settingsResult.data) {
      return { success: false, error: 'マップ設定の取得に失敗しました' }
    }

    // 座標の有効性チェック
    if (!isValidBlockCoordinate(x, y, settingsResult.data.worldWidth, settingsResult.data.worldHeight)) {
      return { success: false, error: '無効な座標です' }
    }

    // 国情報取得
    const nation = await db.query.topdownNations.findFirst({
      where: eq(topdownNations.id, nationId),
    })

    if (!nation) {
      return { success: false, error: '国が見つかりません' }
    }

    // TODO: 権限チェック（建国者のみ）

    // 現在の領土取得
    const currentBlocks = await db
      .select()
      .from(mapBlocks)
      .where(eq(mapBlocks.nationId, nationId))

    // 拡張可能なブロック数チェック
    const remainingBlocks = calculateRemainingBlocks(currentBlocks.length, nation.scaleLevel)
    if (remainingBlocks <= 0) {
      return { success: false, error: '領土拡張の上限に達しています' }
    }

    // 隣接チェック（最初のブロック以外）
    if (currentBlocks.length > 0) {
      const isAdjacent = isAdjacentBlock(
        currentBlocks.map((b) => ({ x: b.x, y: b.y })),
        x,
        y
      )
      if (!isAdjacent) {
        return { success: false, error: '既存の領土に隣接していません' }
      }
    }

    // 座標が空いているかチェック
    const existingBlock = await db.query.mapBlocks.findFirst({
      where: and(eq(mapBlocks.x, x), eq(mapBlocks.y, y)),
    })

    if (existingBlock) {
      return { success: false, error: 'この座標は既に使用されています' }
    }

    // ブロック作成
    const [newBlock] = await db
      .insert(mapBlocks)
      .values({
        x,
        y,
        nationId,
        status: 'occupied',
      })
      .returning()

    return {
      success: true,
      data: { blockId: newBlock.id },
    }
  } catch (error) {
    console.error('領土獲得エラー:', error)
    return { success: false, error: '領土の獲得に失敗しました' }
  }
}

/**
 * 領土放棄（ブロック解放）
 */
export async function releaseBlock(
  nationId: string,
  blockId: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  try {
    const block = await db.query.mapBlocks.findFirst({
      where: and(eq(mapBlocks.id, blockId), eq(mapBlocks.nationId, nationId)),
    })

    if (!block) {
      return { success: false, error: 'ブロックが見つかりません' }
    }

    // 現在の領土数チェック（最低1ブロックは維持）
    const currentBlocks = await db
      .select()
      .from(mapBlocks)
      .where(eq(mapBlocks.nationId, nationId))

    if (currentBlocks.length <= 1) {
      return { success: false, error: '最後のブロックは放棄できません' }
    }

    // ブロック解放（nationIdをnullに）
    await db
      .update(mapBlocks)
      .set({ nationId: null, status: 'occupied' })
      .where(eq(mapBlocks.id, blockId))

    return { success: true }
  } catch (error) {
    console.error('領土放棄エラー:', error)
    return { success: false, error: '領土の放棄に失敗しました' }
  }
}

/**
 * 空きブロック検索
 * 指定した座標周辺の空きブロックを検索
 */
export async function findAvailableBlocks(
  centerX: number,
  centerY: number,
  radius: number = 5
): Promise<ActionResult<Array<{ x: number; y: number }>>> {
  try {
    const settingsResult = await getMapSettings()
    if (!settingsResult.success || !settingsResult.data) {
      return { success: false, error: 'マップ設定の取得に失敗しました' }
    }

    const { worldWidth, worldHeight } = settingsResult.data

    // 範囲内の占有ブロックを取得
    const minX = Math.max(0, centerX - radius)
    const maxX = Math.min(worldWidth - 1, centerX + radius)
    const minY = Math.max(0, centerY - radius)
    const maxY = Math.min(worldHeight - 1, centerY + radius)

    const occupiedBlocks = await db
      .select({ x: mapBlocks.x, y: mapBlocks.y })
      .from(mapBlocks)
      .where(
        and(
          gte(mapBlocks.x, minX),
          lte(mapBlocks.x, maxX),
          gte(mapBlocks.y, minY),
          lte(mapBlocks.y, maxY)
        )
      )

    const occupiedSet = new Set(occupiedBlocks.map((b) => `${b.x},${b.y}`))

    // 空きブロックをリストアップ
    const availableBlocks: Array<{ x: number; y: number }> = []
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        if (!occupiedSet.has(`${x},${y}`)) {
          availableBlocks.push({ x, y })
        }
      }
    }

    // 中心からの距離でソート
    availableBlocks.sort((a, b) => {
      const distA = Math.abs(a.x - centerX) + Math.abs(a.y - centerY)
      const distB = Math.abs(b.x - centerX) + Math.abs(b.y - centerY)
      return distA - distB
    })

    return { success: true, data: availableBlocks.slice(0, 50) } // 最大50件
  } catch (error) {
    console.error('空きブロック検索エラー:', error)
    return { success: false, error: '空きブロックの検索に失敗しました' }
  }
}
