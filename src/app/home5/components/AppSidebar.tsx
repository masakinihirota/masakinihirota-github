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
} from "@/components/ui/sidebar"
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

// メインメニュー項目
const mainMenuItems = [
  { title: "ホーム", url: "/home5", icon: Home },
  { title: "プロフィール", url: "/home5/profiles", icon: User },
  { title: "マッチング", url: "/home5/matching", icon: Heart },
  { title: "おすすめ", url: "/home5/recommendations", icon: Star },
]

// 集団系メニュー（第2グループ）
const groupMenuItems = [
  { title: "検索", url: "/home5/search", icon: Search },
  { title: "国（トップダウン）", url: "/home5/nations", icon: Flag },
  { title: "グループ（ボトムアップ）", url: "/home5/groups", icon: Users },
]

// 登録系メニュー（第3グループ）
const registrationMenuItems = [
  { title: "作品", url: "/home5/works", icon: Briefcase },
  { title: "価値観", url: "/home5/values", icon: Lightbulb },
  { title: "スキル", url: "/home5/skills", icon: Wrench },
]

// もっと見るメニュー（折りたたみ）
const moreMenuItems = [
  { title: "リスト", url: "/home5/lists", icon: List },
  { title: "チェーン", url: "/home5/chain", icon: Link2 },
  { title: "マンダラチャート", url: "/home5/mandala", icon: Grid },
  { title: "実績", url: "/home5/achievements", icon: Trophy },
  { title: "アチーブメント", url: "/home5/badges", icon: Medal },
  { title: "成果", url: "/home5/results", icon: Star },
  { title: "チュートリアル", url: "/home5/tutorial", icon: GraduationCap },
]

// サイドバーフッターメニュー
const footerMenuItems = [
  { title: "設定", url: "/home5/settings", icon: Settings },
  { title: "プライシング", url: "/home5/pricing", icon: CreditCard },
  { title: "ルートアカウント", url: "/home5/root-accounts", icon: UserCircle },
]

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
                <Link href="/home5/root-accounts">
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
              <Link href="/home5">
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

        {/* 集団系メニュー */}
        <NavGroup label="集団" items={groupMenuItems} currentPath={pathname} />

        {/* 登録系メニュー */}
        <NavGroup label="登録" items={registrationMenuItems} currentPath={pathname} />

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
