/**
 * HONO API Route Handler for Next.js App Router
 * @description HONOアプリケーションをNext.js App Routerで動作させるためのキャッチオールルート
 *
 * このファイルは /api/v1/[[...route]] にマッチし、
 * 全てのAPIリクエストをHONOにルーティングします。
 */

import { handle } from 'hono/vercel'
import { honoApp } from '@/lib/hono/app'

// Next.jsのランタイムをNode.jsに設定（Postgresを使用するため）
export const runtime = 'nodejs'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

// HONOアプリをハンドラーにエクスポート
export const GET = handle(honoApp)
export const POST = handle(honoApp)
export const PUT = handle(honoApp)
export const PATCH = handle(honoApp)
export const DELETE = handle(honoApp)
export const OPTIONS = handle(honoApp)
