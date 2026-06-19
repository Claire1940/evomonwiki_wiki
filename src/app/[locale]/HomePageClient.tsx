"use client";

import { useState, Suspense, lazy } from "react";
import {
  AlertTriangle,
  Apple,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Compass,
  Copy,
  Coins,
  Crosshair,
  Crown,
  Dumbbell,
  Droplet,
  Egg,
  ExternalLink,
  Flag,
  Flame,
  Gamepad2,
  Gem,
  Gift,
  Hand,
  Layers,
  Leaf,
  Lightbulb,
  Mountain,
  Play,
  RefreshCw,
  Repeat,
  Rocket,
  Settings,
  ShieldCheck,
  Shuffle,
  Skull,
  Sparkles,
  Star,
  Swords,
  Tags,
  Target,
  TrendingUp,
  Trophy,
  Users,
  UsersRound,
  Wrench,
  Youtube,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Module eyebrow label
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 md:mb-5
                     bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                     text-xs font-semibold text-[hsl(var(--nav-theme-light))] uppercase tracking-wider">
      {children}
    </span>
  );
}

// Module section heading
function SectionHead({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="text-center mb-8 md:mb-12 scroll-reveal">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight">
        {title}
      </h2>
      {intro && (
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
          {intro}
        </p>
      )}
    </div>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  void moduleLinkMap;
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://evomonwiki.wiki";

  // Module 2 (official links) icon map
  const officialIcons: Record<string, LucideIcon> = {
    Gamepad2,
    Users,
    Youtube,
    Play,
    Compass,
    Tags,
    Egg,
    UsersRound,
  };

  // Module 4 (starters) icon map
  const starterIcons: Record<string, LucideIcon> = {
    Leafbun: Leaf,
    Blazpup: Flame,
    Bubble: Droplet,
    "Early Team Formula": Users,
  };

  // Module 8 (hard content) category icon map
  const hardContentIcons: Record<string, LucideIcon> = {
    "Open World": Compass,
    "Boss Content": Skull,
    "Multiplayer PvE": Users,
    "Competitive Testing": Swords,
    "Battle Strategy": Zap,
    Mounts: Mountain,
    "Progression Route": TrendingUp,
  };

  // Tier list badge styles (S gold / A theme / B sky / C slate)
  const tierStyles: Record<string, string> = {
    S: "bg-amber-500/15 border-amber-500/40 text-amber-400",
    A: "bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]",
    B: "bg-sky-500/15 border-sky-500/40 text-sky-400",
    C: "bg-slate-500/15 border-slate-500/40 text-slate-400",
  };

  // Module 1 code icons (distinct per card)
  const codeIcons: LucideIcon[] = [Trophy, Coins, Zap, Gift];

  // Module 5 tier card icons (distinct per card, driven by en.json icon field)
  const tierCardIcons: Record<string, LucideIcon> = {
    Target,
    ShieldCheck,
    Layers,
    Crosshair,
    Rocket,
    Gem,
    Copy,
    Wrench,
  };

  // Module 6 catching item icons (distinct per item, driven by en.json icon field)
  const catchingIcons: Record<string, LucideIcon> = {
    Hand,
    Egg,
    Star,
    Shuffle,
    Repeat,
  };

  // Module 7 leveling step icons (distinct per step, driven by en.json icon field)
  const levelingStepIcons: Record<string, LucideIcon> = {
    RefreshCw,
    Crown,
    Apple,
    Dumbbell,
    ArrowUp,
    Flag,
  };

  // Accordion + clipboard state
  const [catchingExpanded, setCatchingExpanded] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  const copyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopiedCode(code);
    window.setTimeout(() => setCopiedCode(null), 1500);
  };

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Evomon Wiki",
        description:
          "Evomon Wiki covers codes, Evomon dex, tier lists, type charts, maps, dungeons, items, and beginner guides for the Roblox open-world monster-catching adventure.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Evomon - Open-World Monster-Catching RPG",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Evomon Wiki",
        alternateName: "Evomon",
        url: siteUrl,
        description:
          "Evomon Wiki resource hub for codes, Evomon dex, tier lists, type charts, maps, dungeons, and beginner guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Evomon Wiki - Open-World Monster-Catching RPG",
        },
        sameAs: [
          "https://www.roblox.com/games/134381727982611/Evomon",
          "https://www.roblox.com/communities/665060893/Evomon-Devs",
          "https://www.youtube.com/watch?v=uMMJ6h-PhcE",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Evomon",
        gamePlatform: ["PC", "Roblox"],
        applicationCategory: "Game",
        genre: ["Adventure", "RPG", "Monster-Catching", "Multiplayer"],
        numberOfPlayers: {
          minValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "0",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/134381727982611/Evomon",
        },
      },
      {
        "@type": "VideoObject",
        name: "Roblox Evomon Official Launch Trailer",
        description:
          "Official Roblox Evomon launch trailer — collect, train, and evolve 200+ Evomons, hunt Shiny and Sparkle variants, and battle in turn-based combat.",
        uploadDate: "2026-03-12",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/uMMJ6h-PhcE",
        url: "https://www.youtube.com/watch?v=uMMJ6h-PhcE",
      },
    ],
  };

  const m = t.modules;
  const sectionIds = [
    "evomon-codes",
    "evomon-official-links",
    "evomon-beginner-guide",
    "evomon-best-starter",
    "evomon-tier-list",
    "evomon-catching-guide",
    "evomon-leveling-guide",
    "evomon-hard-content",
  ];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("evomon-codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/134381727982611/Evomon"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                <Gamepad2 className="w-5 h-5" />
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 区域 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="uMMJ6h-PhcE"
              title="Roblox Evomon Official Launch Trailer"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = sectionIds[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Evomon Codes and Redeem Guide */}
      <section id="evomon-codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHead
            eyebrow={m.evomonCodes.eyebrow}
            title={m.evomonCodes.title}
            intro={m.evomonCodes.intro}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Code cards */}
            <div className="space-y-3 md:space-y-4">
              {m.evomonCodes.codes.map((c: any, i: number) => {
                const CodeIcon = codeIcons[i] || Gift;
                const copied = copiedCode === c.code;
                return (
                  <div
                    key={i}
                    className="p-4 md:p-5 bg-white/5 border border-border rounded-xl
                               hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-[hsl(var(--nav-theme)/0.15)] flex items-center justify-center flex-shrink-0">
                          <CodeIcon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                        </div>
                        <code className="font-mono text-base md:text-lg font-bold tracking-wide truncate">
                          {c.code}
                        </code>
                      </div>
                      <button
                        onClick={() => copyCode(c.code)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                                   bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                                   text-[hsl(var(--nav-theme-light))] hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors flex-shrink-0"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Gift className="w-3.5 h-3.5" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 font-medium">
                        {c.rewardType}
                      </span>
                    </div>
                    <p className="text-sm font-semibold mb-1">{c.reward}</p>
                    <p className="text-sm text-muted-foreground">{c.bestUse}</p>
                  </div>
                );
              })}
            </div>

            {/* Redeem steps + troubleshooting */}
            <div className="space-y-4">
              <div className="p-5 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold text-base md:text-lg">Redeem Steps</h3>
                </div>
                <ol className="space-y-3">
                  {m.evomonCodes.redeemSteps.map((step: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.4)] flex items-center justify-center text-xs font-bold text-[hsl(var(--nav-theme-light))]">
                        {i + 1}
                      </span>
                      <span className="text-sm text-muted-foreground pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-5 md:p-6 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-base md:text-lg">
                    {m.evomonCodes.troubleshooting.title}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {m.evomonCodes.troubleshooting.checks.map((chk: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{chk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Evomon Official Roblox Link and Game Info */}
      <section
        id="evomon-official-links"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHead
            eyebrow={m.evomonOfficialLinks.eyebrow}
            title={m.evomonOfficialLinks.title}
            intro={m.evomonOfficialLinks.intro}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {m.evomonOfficialLinks.items.map((item: any, i: number) => {
              const Icon = officialIcons[item.icon] || Gamepad2;
              return (
                <div
                  key={i}
                  className="p-5 bg-white/5 border border-border rounded-xl
                             hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors
                             flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="font-semibold text-sm md:text-base truncate">
                        {item.value}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">
                    {item.description}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--nav-theme-light))] hover:underline"
                    >
                      Open Link
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground/70">
                      <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))]" />
                      Official Info
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 3: Evomon Beginner Guide */}
      <section id="evomon-beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHead
            eyebrow={m.evomonBeginnerGuide.eyebrow}
            title={m.evomonBeginnerGuide.title}
            intro={m.evomonBeginnerGuide.intro}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {m.evomonBeginnerGuide.steps.map((step: any, i: number) => (
              <div
                key={i}
                className="flex gap-4 p-5 bg-white/5 border border-border rounded-xl
                           hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold mb-1.5">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                  <div className="flex items-start gap-2 text-sm">
                    <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{step.tip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Evomon Best Starter and Early Team Guide */}
      <section
        id="evomon-best-starter"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHead
            eyebrow={m.evomonBestStarter.eyebrow}
            title={m.evomonBestStarter.title}
            intro={m.evomonBestStarter.intro}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {m.evomonBestStarter.starters.map((s: any, i: number) => {
              const SIcon = starterIcons[s.name] || Users;
              return (
                <div
                  key={i}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl
                             hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-11 w-11 rounded-lg bg-[hsl(var(--nav-theme)/0.15)] flex items-center justify-center flex-shrink-0">
                      <SIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold leading-tight">{s.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                        {s.type}
                      </span>
                    </div>
                  </div>
                  <dl className="space-y-2.5 text-sm">
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground">Role</dt>
                      <dd className="text-foreground">{s.role}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground">Progression Value</dt>
                      <dd className="text-muted-foreground">{s.progressionValue}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground">Team Plan</dt>
                      <dd className="text-muted-foreground">{s.teamPlan}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground">Best For</dt>
                      <dd className="text-muted-foreground">{s.bestFor}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{s.avoid}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 5: 模块中部阅读停顿 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 5: Evomon Tier List and Team Building Guide */}
      <section id="evomon-tier-list" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHead
            eyebrow={m.evomonTierList.eyebrow}
            title={m.evomonTierList.title}
            intro={m.evomonTierList.intro}
          />
          <div className="space-y-4 md:space-y-5">
            {m.evomonTierList.tiers.map((tierGroup: any, gi: number) => (
              <div
                key={gi}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`h-12 w-12 rounded-lg border flex items-center justify-center text-xl font-black ${tierStyles[tierGroup.tier] || tierStyles.C}`}
                  >
                    {tierGroup.tier}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold">{tierGroup.label}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tierGroup.cards.map((card: any, ci: number) => {
                    const CardIcon = tierCardIcons[card.icon] || Target;
                    return (
                    <div
                      key={ci}
                      className="p-4 bg-white/5 border border-border rounded-lg
                                 hover:border-[hsl(var(--nav-theme)/0.4)] transition-colors"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.25)] flex items-center justify-center flex-shrink-0">
                          <CardIcon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                        </div>
                        <h4 className="font-bold">{card.name}</h4>
                      </div>
                      <p className="text-xs uppercase tracking-wider text-[hsl(var(--nav-theme-light))] mb-2">
                        {card.role}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {card.bestFor.map((bf: string, bi: number) => (
                          <span
                            key={bi}
                            className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-muted-foreground"
                          >
                            {bf}
                          </span>
                        ))}
                      </div>
                      {card.rankingBasis?.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-foreground/80 mb-1.5">Why ranked here</p>
                          <ul className="space-y-1">
                            {card.rankingBasis.map((rb: string, ri: number) => (
                              <li key={ri} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                                <span>{rb}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">{card.use}</p>
                    </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Evomon Shiny, Sparkle, Eggs, and Catching Guide */}
      <section
        id="evomon-catching-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHead
            eyebrow={m.evomonCatchingGuide.eyebrow}
            title={m.evomonCatchingGuide.title}
            intro={m.evomonCatchingGuide.intro}
          />
          <div className="max-w-3xl mx-auto space-y-3">
            {m.evomonCatchingGuide.items.map((item: any, i: number) => {
              const open = catchingExpanded === i;
              const ItemIcon = catchingIcons[item.icon] || Hand;
              return (
                <div
                  key={i}
                  className="border border-border rounded-xl overflow-hidden bg-white/5"
                >
                  <button
                    onClick={() => setCatchingExpanded(open ? null : i)}
                    className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold text-sm md:text-base flex items-center gap-2">
                      <span className="h-7 w-7 rounded-lg bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.25)] flex items-center justify-center flex-shrink-0">
                        <ItemIcon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                      </span>
                      {item.title}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open && (
                    <div className="px-4 md:px-5 pb-5">
                      <p className="font-medium text-[hsl(var(--nav-theme-light))] text-sm md:text-base mb-2">
                        {item.summary}
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">{item.content}</p>
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.25)]">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item.action}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 7: Evomon Leveling, Evolution, and EXP Fruit Guide */}
      <section id="evomon-leveling-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHead
            eyebrow={m.evomonLevelingGuide.eyebrow}
            title={m.evomonLevelingGuide.title}
            intro={m.evomonLevelingGuide.intro}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {m.evomonLevelingGuide.steps.map((step: any, i: number) => {
              const StepIcon = levelingStepIcons[step.icon] || RefreshCw;
              return (
              <div
                key={i}
                className="p-5 bg-white/5 border border-border rounded-xl
                           hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.4)] flex items-center justify-center flex-shrink-0">
                    <StepIcon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <h3 className="font-bold">
                    <span className="text-[hsl(var(--nav-theme-light))] mr-2">{i + 1}.</span>
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{step.action}</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{step.why}</span>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{step.avoid}</span>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 8: Evomon Dungeons, Boss Fights, PvP, and Mounts Guide */}
      <section
        id="evomon-hard-content"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHead
            eyebrow={m.evomonHardContent.eyebrow}
            title={m.evomonHardContent.title}
            intro={m.evomonHardContent.intro}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {m.evomonHardContent.items.map((item: any, i: number) => {
              const Icon = hardContentIcons[item.category] || Compass;
              return (
                <div
                  key={i}
                  className="p-5 bg-white/5 border border-border rounded-xl
                             hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors
                             flex flex-col"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    {item.when}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">{item.objective}</p>
                  <ul className="space-y-1.5 mb-3">
                    {item.tips.map((tip: string, ti: number) => (
                      <li key={ti} className="flex items-start gap-2 text-xs">
                        <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-auto pt-3 border-t border-border">
                    <span className="font-semibold text-[hsl(var(--nav-theme-light))]">Payoff: </span>
                    {item.payoff}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.roblox.com/games/134381727982611/Evomon"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxGame}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/communities/665060893/Evomon-Devs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxGroup}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=uMMJ6h-PhcE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href={locale === "en" ? "/about" : `/${locale}/about`}
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </a>
                </li>
                <li>
                  <a
                    href={locale === "en" ? "/privacy-policy" : `/${locale}/privacy-policy`}
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </a>
                </li>
                <li>
                  <a
                    href={locale === "en" ? "/terms-of-service" : `/${locale}/terms-of-service`}
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </a>
                </li>
                <li>
                  <a
                    href={locale === "en" ? "/copyright" : `/${locale}/copyright`}
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </a>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
