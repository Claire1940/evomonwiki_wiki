import type { LucideIcon } from 'lucide-react'
import {
	Ticket,
	Gamepad2,
	BookOpen,
	MessageCircle,
	Trophy,
	Target,
	Star,
	Compass,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// Evomon 导航分类：与 content/{locale}/{type} 目录一一对应
// codes      兑换码与奖励
// roblox     Roblox 官方游戏信息
// guide      攻略（新手/升级/Boss/塔/任务）
// discord    Discord / Reddit 社区
// tier       强度排行与最佳队伍
// catching   捕捉 / 蛋 / 进化 / Shiny / Sparkle / Prismatic
// review     评测 / 预告 / 平台
// world      世界 / 坐骑 / 更新
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'codes', path: '/codes', icon: Ticket, isContentType: true },
	{ key: 'roblox', path: '/roblox', icon: Gamepad2, isContentType: true },
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'discord', path: '/discord', icon: MessageCircle, isContentType: true },
	{ key: 'tier', path: '/tier', icon: Trophy, isContentType: true },
	{ key: 'catching', path: '/catching', icon: Target, isContentType: true },
	{ key: 'review', path: '/review', icon: Star, isContentType: true },
	{ key: 'world', path: '/world', icon: Compass, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['codes', 'roblox', 'guide', 'discord', 'tier', 'catching', 'review', 'world']

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
