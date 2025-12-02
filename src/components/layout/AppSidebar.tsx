"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  User,
  Search,
  Heart,
  Flag,
  Users,
  Briefcase,
  Lightbulb,
  Wrench,
  ChevronRight,
  List,
  Link2,
  Grid,
  Trophy,
  Medal,
  Star,
  GraduationCap,
  Settings,
  CreditCard,
  UserCircle,
  MoreHorizontal,
  LogOut,
  UserPlus,
  ChevronsUpDown,
  type LucideIcon,
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/Sidebar"
import routesManifest from "@/config/routes.manifest.json"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

/**
 * 左サイドメニュー要件定義書に基づくメニュー構成
 *
 * 上側:
 * - masakinihirota (ブランド)
 * - ホーム
 * - プロフィール
 * - マッチング(自動/手動)
 * - おすすめ
 * - 検索 (第2メニュー - 集団系)
 * - 国(トップダウン方式)
 * - グループ(ボトムアップ方式)
 * - 作品 (第3メニュー - 登録系)
 * - 価値観
 * - スキル
 * - もっと見る (折りたたみ)
 *   - リスト
 *   - チェーン
 *   - マンダラチャート
 *   - 実績
 *   - アチーブメント
 *   - 成果
 *   - チュートリアル
 *
 * 下側 (フッター):
 * - 設定
 * - プライシング
 * - ルートアカウント
 */

// --- Manifest-driven menus ---
// Helper: small icon map for known routes; fallback to List icon
export const ICON_MAP: Record<string, LucideIcon> = {
  // core
  "/": Home,
  "/matching": Heart,
  "/user-profiles": User,
  "/profiles": User,

  // community / org
  "/groups": Users,
  "/nations": Flag,

  // discovery / works
  "/search": Search,
  "/recommendations": Star,
  "/works": Briefcase,

  // features
  "/values": Lightbulb,
  "/skills": Wrench,
  "/lists": List,
  "/chains": Link2,
  "/mandala": Grid,

  // progress / gamification
  "/achievements": Trophy,
  "/badges": Medal,

  // misc
  "/notifications": Star,
  "/tutorial": GraduationCap,
  "/results": Star,

  // account / billing
  "/settings": Settings,
  "/pricing": CreditCard,
  "/root-accounts": UserCircle,

  // public footer
  "/help": GraduationCap,
  "/about": Star,
  "/contact": Star,
  "/privacy": Star,
  "/terms": Star,
  "/home": Home,
  "/onboarding": GraduationCap,
  "/onboarding/guest": GraduationCap,
  "/register": UserPlus,
  "/oasis": Lightbulb,
  "/messages": User,
  "/activity": Star,
}

type RouteEntry = {
  path: string
  label: string
  order: number
  visibleInMenu?: boolean
  authRequired?: boolean
  group?: string
}

// Normalize a manifest route path into the sidebar URL used in this app
// Policy: routes.manifest.json is canonical. Return the manifest path as the sidebar URL
export const toSidebarUrl = (manifestPath: string) => {
  if (!manifestPath) return "/"
  // Use manifest path directly — keep '/' as root
  return manifestPath === "/" ? "/" : manifestPath
}

// Get icon for manifest route (fallback is List)
export const iconFor = (manifestPath: string): LucideIcon => {
  const key = manifestPath === "/" ? "/" : manifestPath
  return ICON_MAP[key] ?? List
}

// Build groups from manifest
const manifestRoutes: RouteEntry[] = (routesManifest as RouteEntry[])

const mainMenuItems = manifestRoutes
  .filter((r) => r.visibleInMenu && r.group === "main")
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  .map((r) => ({ title: r.label, url: toSidebarUrl(r.path), icon: iconFor(r.path) }))

const featureMenuItems = manifestRoutes
  .filter((r) => r.visibleInMenu && r.group === "feature")
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  .map((r) => ({ title: r.label, url: toSidebarUrl(r.path), icon: iconFor(r.path) }))

const moreMenuItems = manifestRoutes
  .filter((r) => r.visibleInMenu && r.group === "more")
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  .map((r) => ({ title: r.label, url: toSidebarUrl(r.path), icon: iconFor(r.path) }))

const footerMenuItems = manifestRoutes
  .filter((r) => r.visibleInMenu && r.group === "footer")
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  .map((r) => ({ title: r.label, url: toSidebarUrl(r.path), icon: iconFor(r.path) }))

// (footerMenuItems is built from the manifest above)

// ユーザー情報（モック）
const mockUser = {
  name: "masakinihirota",
  email: "@masakinihirota",
  avatar: "/avatars/masakinihirota.jpg",
}

// ナビゲーション項目コンポーネント
function NavItem({
  item,
  isActive,
}: {
  item: { title: string; url: string; icon: LucideIcon }
  isActive: boolean
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
      >
        <Link href={item.url} aria-current={isActive ? "page" : undefined}>
          <item.icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

// メインナビゲーショングループ
function NavGroup({
  label,
  items,
  currentPath,
}: {
  label?: string
  items: { title: string; url: string; icon: LucideIcon }[]
  currentPath: string
}) {
  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => (
          <NavItem
            key={item.url}
            item={item}
            isActive={currentPath === item.url || currentPath.startsWith(item.url + "/")}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

// 「もっと見る」折りたたみセクション
function NavMore({
  items,
  currentPath,
}: {
  items: { title: string; url: string; icon: LucideIcon }[]
  currentPath: string
}) {
  const hasActiveItem = items.some(
    (item) => currentPath === item.url || currentPath.startsWith(item.url + "/")
  )

  return (
    <SidebarGroup>
      <SidebarMenu>
        <Collapsible
          asChild
          defaultOpen={hasActiveItem}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip="もっと見る">
                <MoreHorizontal />
                <span>もっと見る</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {items.map((item) => {
                  const isActive =
                    currentPath === item.url ||
                    currentPath.startsWith(item.url + "/")
                  return (
                    <SidebarMenuSubItem key={item.url}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive}
                      >
                        <Link
                          href={item.url}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}

// ユーザーメニュー
function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/home/root-accounts">
                  <UserPlus className="mr-2 h-4 w-4" />
                  既存のアカウントを追加
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {footerMenuItems.map((item) => (
                <DropdownMenuItem key={item.url} asChild>
                  <Link href={item.url}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login">
                <LogOut className="mr-2 h-4 w-4" />
                ログアウト
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

// メインのサイドバーコンポーネント
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* ヘッダー: ブランド名 */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/home">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg font-bold">
                  M
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">masakinihirota</span>
                  <span className="truncate text-xs text-muted-foreground">VNS Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* コンテンツ: メインナビゲーション */}
      <SidebarContent>
        {/* メインメニュー */}
        <NavGroup items={mainMenuItems} currentPath={pathname} />

        {/* feature / grouped menu (manifest-driven) */}
        {featureMenuItems.length > 0 && (
          <NavGroup label="機能" items={featureMenuItems} currentPath={pathname} />
        )}

        {/* もっと見る */}
        <NavMore items={moreMenuItems} currentPath={pathname} />
      </SidebarContent>

      {/* フッター: ユーザーメニュー（画面左下に固定） */}
      <SidebarFooter>
        <NavUser user={mockUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
