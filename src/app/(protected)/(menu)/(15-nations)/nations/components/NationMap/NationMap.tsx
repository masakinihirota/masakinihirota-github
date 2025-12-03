"use client"

/**
 * 国マップコンポーネント（2Dグリッド）
 * 設計書: 0134-02-国のマップ設計書.md
 */

import { useState, useCallback, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, ZoomOut, Home, Grid, Layers } from "lucide-react"

// =====================================================
// 型定義
// =====================================================

export interface MapBlockData {
  id: string
  x: number
  y: number
  nationId: string | null
  nationName?: string
  status: string
}

export interface MapClusterData {
  x: number
  y: number
  width: number
  height: number
  nationCount: number
  totalPopulation: number
  dominantNationId?: string
  dominantNationName?: string
}

export interface NationMapProps {
  blocks?: MapBlockData[]
  clusters?: MapClusterData[]
  worldWidth?: number
  worldHeight?: number
  centerX?: number
  centerY?: number
  onBlockClick?: (x: number, y: number, block?: MapBlockData) => void
  onNationClick?: (nationId: string) => void
  selectedNationId?: string
  isEditing?: boolean
  editableBlocks?: Array<{ x: number; y: number }>
}

// =====================================================
// 定数
// =====================================================

const MIN_ZOOM = 0.5
const MAX_ZOOM = 4
const DEFAULT_BLOCK_SIZE = 20 // ピクセル
const CLUSTER_THRESHOLD_ZOOM = 1.0 // このズーム以下でクラスタ表示

// 国ごとの色を生成
const getNationColor = (nationId: string | null): string => {
  if (!nationId) return "#e5e7eb" // 空き地: グレー
  // ハッシュから色を生成
  let hash = 0
  for (let i = 0; i < nationId.length; i++) {
    hash = nationId.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 60%, 50%)`
}

// =====================================================
// メインコンポーネント
// =====================================================

export function NationMap({
  blocks = [],
  clusters = [],
  worldWidth = 100,
  worldHeight = 100,
  centerX = 50,
  centerY = 50,
  onBlockClick,
  onNationClick,
  selectedNationId,
  isEditing = false,
  editableBlocks = [],
}: NationMapProps) {
  // 状態
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredBlock, setHoveredBlock] = useState<{ x: number; y: number } | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  // ブロックサイズ（ズームに応じて変化）
  const blockSize = DEFAULT_BLOCK_SIZE * zoom

  // 表示領域の計算
  const containerWidth = containerRef.current?.clientWidth ?? 800
  const containerHeight = containerRef.current?.clientHeight ?? 600
  const visibleBlocksX = Math.ceil(containerWidth / blockSize) + 2
  const visibleBlocksY = Math.ceil(containerHeight / blockSize) + 2

  // ズーム操作
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev * 1.2, MAX_ZOOM))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev / 1.2, MIN_ZOOM))
  }, [])

  const handleResetView = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  // ホイールでズーム
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom((prev) => Math.min(Math.max(prev * delta, MIN_ZOOM), MAX_ZOOM))
  }, [])

  // ドラッグ操作
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }, [pan])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // ブロッククリック
  const handleBlockClick = useCallback(
    (x: number, y: number) => {
      const block = blocks.find((b) => b.x === x && b.y === y)
      if (onBlockClick) {
        onBlockClick(x, y, block)
      }
      if (block?.nationId && onNationClick) {
        onNationClick(block.nationId)
      }
    },
    [blocks, onBlockClick, onNationClick]
  )

  // ブロックをマップに変換（高速検索用）
  const blockMap = new Map<string, MapBlockData>()
  blocks.forEach((block) => {
    blockMap.set(`${block.x},${block.y}`, block)
  })

  // 編集可能ブロックをSetに変換
  const editableSet = new Set(editableBlocks.map((b) => `${b.x},${b.y}`))

  // クラスタ表示かどうか
  const showClusters = zoom < CLUSTER_THRESHOLD_ZOOM && clusters.length > 0

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Grid className="h-5 w-5" />
            国マップ
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleResetView}>
              <Home className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Layers className="h-4 w-4" />
          <span>
            {showClusters ? "クラスタ表示" : "詳細表示"} |
            {blocks.length} ブロック |
            {worldWidth}x{worldHeight} グリッド
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div
          ref={containerRef}
          className="relative overflow-hidden bg-gray-100 dark:bg-gray-900"
          style={{ height: "500px", cursor: isDragging ? "grabbing" : "grab" }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* グリッド描画エリア */}
          <div
            className="absolute"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px)`,
              width: worldWidth * blockSize,
              height: worldHeight * blockSize,
            }}
          >
            {/* グリッド線（低ズーム時は非表示） */}
            {zoom >= 0.8 && (
              <svg
                className="absolute inset-0 pointer-events-none"
                style={{
                  width: worldWidth * blockSize,
                  height: worldHeight * blockSize,
                }}
              >
                {/* 縦線 */}
                {Array.from({ length: worldWidth + 1 }).map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * blockSize}
                    y1={0}
                    x2={i * blockSize}
                    y2={worldHeight * blockSize}
                    stroke="#ddd"
                    strokeWidth={0.5}
                  />
                ))}
                {/* 横線 */}
                {Array.from({ length: worldHeight + 1 }).map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1={0}
                    y1={i * blockSize}
                    x2={worldWidth * blockSize}
                    y2={i * blockSize}
                    stroke="#ddd"
                    strokeWidth={0.5}
                  />
                ))}
              </svg>
            )}

            {/* ブロック描画（詳細表示） */}
            {!showClusters &&
              blocks.map((block) => {
                const isSelected = block.nationId === selectedNationId
                const isEditable = editableSet.has(`${block.x},${block.y}`)
                const isHovered =
                  hoveredBlock?.x === block.x && hoveredBlock?.y === block.y

                return (
                  <div
                    key={block.id}
                    className={`absolute transition-all duration-100 ${
                      isEditable ? "cursor-pointer" : ""
                    }`}
                    style={{
                      left: block.x * blockSize,
                      top: block.y * blockSize,
                      width: blockSize - 1,
                      height: blockSize - 1,
                      backgroundColor: getNationColor(block.nationId),
                      opacity: isHovered ? 0.8 : 1,
                      border: isSelected
                        ? "2px solid #3b82f6"
                        : isEditable
                        ? "2px dashed #10b981"
                        : "none",
                      borderRadius: "2px",
                    }}
                    onClick={() => handleBlockClick(block.x, block.y)}
                    onMouseEnter={() => setHoveredBlock({ x: block.x, y: block.y })}
                    onMouseLeave={() => setHoveredBlock(null)}
                    title={block.nationName || `空き地 (${block.x}, ${block.y})`}
                  />
                )
              })}

            {/* 編集モード: 空きブロックの表示 */}
            {isEditing &&
              editableBlocks.map((block) => {
                const existing = blockMap.get(`${block.x},${block.y}`)
                if (existing) return null // 既存ブロックは上で描画済み

                return (
                  <div
                    key={`empty-${block.x}-${block.y}`}
                    className="absolute cursor-pointer hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                    style={{
                      left: block.x * blockSize,
                      top: block.y * blockSize,
                      width: blockSize - 1,
                      height: blockSize - 1,
                      border: "2px dashed #10b981",
                      borderRadius: "2px",
                      backgroundColor: "transparent",
                    }}
                    onClick={() => handleBlockClick(block.x, block.y)}
                    title={`空き地 (${block.x}, ${block.y}) - クリックで獲得`}
                  />
                )
              })}

            {/* クラスタ描画（広域表示） */}
            {showClusters &&
              clusters.map((cluster, index) => (
                <div
                  key={`cluster-${index}`}
                  className="absolute flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    left: cluster.x * blockSize,
                    top: cluster.y * blockSize,
                    width: cluster.width * blockSize,
                    height: cluster.height * blockSize,
                    backgroundColor: cluster.dominantNationId
                      ? getNationColor(cluster.dominantNationId)
                      : "#e5e7eb",
                    opacity: 0.7,
                    borderRadius: "4px",
                  }}
                  onClick={() =>
                    cluster.dominantNationId &&
                    onNationClick?.(cluster.dominantNationId)
                  }
                  title={`${cluster.nationCount} 国 | 人口: ${cluster.totalPopulation}`}
                >
                  <div className="text-white text-xs font-bold drop-shadow-md">
                    {cluster.nationCount > 0 && (
                      <>
                        <div>{cluster.nationCount}国</div>
                        <div>{cluster.totalPopulation.toLocaleString()}人</div>
                      </>
                    )}
                  </div>
                </div>
              ))}

            {/* 中心マーカー */}
            <div
              className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-md z-10"
              style={{
                left: centerX * blockSize - 6,
                top: centerY * blockSize - 6,
              }}
              title="マップ中央"
            />
          </div>

          {/* ホバー情報 */}
          {hoveredBlock && !showClusters && (
            <div className="absolute bottom-2 left-2 bg-background/90 p-2 rounded shadow text-sm">
              座標: ({hoveredBlock.x}, {hoveredBlock.y})
              {blockMap.get(`${hoveredBlock.x},${hoveredBlock.y}`)?.nationName && (
                <span className="ml-2 font-medium">
                  {blockMap.get(`${hoveredBlock.x},${hoveredBlock.y}`)?.nationName}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default NationMap
