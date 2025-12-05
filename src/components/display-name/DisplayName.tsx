/**
 * DisplayName コンポーネント
 *
 * 表示名システムに基づいて、ユーザーの表示名を視覚的に区別して表示する。
 *
 * 表示パターン:
 * - Blueネーム（認証済み実名）: オアシス色 + 認証アイコン
 * - 未認証実名: 通常色 + 詩的ID（半透明）
 * - ネットネーム: 通常色 + 詩的ID
 * - 匿名: 通常色のみ
 */

"use client";

import { cn } from "@/lib/utils";
import { DisplayNameType } from "@/db/constants";
import { CheckCircle2 } from "lucide-react";

/**
 * DisplayName コンポーネントの Props
 */
export interface DisplayNameProps {
  /** 表示する名前 */
  displayName: string;
  /** 表示名タイプ */
  type: DisplayNameType | string;
  /** 詩的ID（オプション） */
  poeticId?: string | null;
  /** 本人確認済みかどうか */
  isVerified?: boolean;
  /** サイズ */
  size?: "small" | "medium" | "large";
  /** 追加のクラス名 */
  className?: string;
}

/**
 * 表示名コンポーネント
 *
 * @example
 * ```tsx
 * // Blueネーム（認証済み実名）
 * <DisplayName
 *   displayName="山田太郎"
 *   type={DisplayNameType.BlueName}
 *   isVerified={true}
 * />
 *
 * // ネットネーム + 詩的ID
 * <DisplayName
 *   displayName="ツメニト"
 *   type={DisplayNameType.NetName}
 *   poeticId="銀の光を纏う影"
 * />
 * ```
 */
export function DisplayName({
  displayName,
  type,
  poeticId,
  isVerified = false,
  size = "medium",
  className,
}: DisplayNameProps) {
  // サイズに応じたクラス
  const sizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  // タイプに応じたスタイル
  const isBlueName = type === DisplayNameType.BlueName && isVerified;
  const isUnverifiedRealName = type === DisplayNameType.UnverifiedRealName;
  const showPoeticId =
    poeticId &&
    type !== DisplayNameType.BlueName &&
    type !== DisplayNameType.Anonymous;

  // 詩的IDの透明度
  const poeticIdOpacity = isUnverifiedRealName ? "opacity-50" : "";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1",
        sizeClasses[size],
        className
      )}
    >
      {/* 名前部分 */}
      <span
        className={cn(
          "font-medium",
          sizeClasses[size],
          isBlueName && "text-oasis"
        )}
      >
        {displayName}
      </span>

      {/* 認証済みアイコン（Blueネームのみ） */}
      {isBlueName && (
        <CheckCircle2
          data-testid="verified-icon"
          className="h-4 w-4 text-oasis"
          aria-label="認証済み"
        />
      )}

      {/* 詩的ID（未認証実名・ネットネームのみ） */}
      {showPoeticId && (
        <span
          className={cn(
            "text-muted-foreground",
            sizeClasses[size],
            poeticIdOpacity
          )}
        >
          @{poeticId}
        </span>
      )}
    </span>
  );
}
