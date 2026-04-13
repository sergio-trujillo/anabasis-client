import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import React, { useEffect, useState } from "react"
import { codeToHtml } from "shiki"

export type CodeBlockProps = {
  children?: React.ReactNode
  className?: string
} & React.HTMLProps<HTMLDivElement>

function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  return (
    <div
      className={cn(
        "not-prose flex w-full flex-col overflow-clip border",
        "border-border bg-card text-card-foreground rounded-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export type CodeBlockCodeProps = {
  code: string
  language?: string
  theme?: string
  lineNumbers?: boolean
  className?: string
} & React.HTMLProps<HTMLDivElement>

const SHIKI_THEMES: Record<string, string> = {
  "lone-dusk-bro": "one-dark-pro",
  groovebox: "vitesse-dark",
  "just-my-type": "dracula",
  "404-not-found": "github-dark",
  "pastel-brujeria": "catppuccin-mocha",
  "lost-in-shibuya": "tokyo-night",
  frostbyte: "nord",
  "legit-ide": "github-light",
  "ad-majorem": "vitesse-dark",
  halloween: "dracula",
  "dia-de-muertos": "vitesse-dark",
  christmas: "one-dark-pro",
  friday13: "vitesse-dark",
}

/** Color replacements to tint code with seasonal theme colors.
 *  Keys are colors from the base Shiki theme, values are our themed colors. */
const COLOR_REPLACEMENTS: Record<string, Record<string, string>> = {
  // Halloween: dracula base → orange/purple/toxic green tints
  halloween: {
    '#ff79c6': '#ff6f00',   // pink keywords → orange
    '#bd93f9': '#9b30ff',   // purple → vivid purple
    '#50fa7b': '#39ff14',   // green → toxic green
    '#f1fa8c': '#ffab00',   // yellow → amber
    '#8be9fd': '#ff6f00',   // cyan → orange
    '#6272a4': '#8b8693',   // comments → muted purple
    '#282a36': '#0d0a12',   // background
  },
  // Cempasúchil: vitesse-dark base → gold/magenta/purple
  'dia-de-muertos': {
    '#4d9375': '#f59e0b',   // green → cempasúchil gold
    '#c98a7d': '#db2777',   // orange-brown → rosa mexicano
    '#80a665': '#f97316',   // green → warm orange
    '#b8a965': '#f59e0b',   // yellow → gold
    '#6394bf': '#7c3aed',   // blue → purple
    '#758575': '#c4a07e',   // comments → warm muted
    '#121212': '#1c0b20',   // background
  },
  // Christmas: one-dark-pro base → red/green/gold
  christmas: {
    '#61afef': '#22863a',   // blue → pine green
    '#c678dd': '#b91c1c',   // purple → cranberry red
    '#98c379': '#22863a',   // green stays green
    '#e5c07b': '#d4a72c',   // yellow → gold
    '#e06c75': '#b91c1c',   // red → cranberry
    '#56b6c2': '#22863a',   // cyan → green
    '#5c6370': '#80a080',   // comments → forest muted
    '#282c34': '#0f1a0f',   // background
  },
  // Ad Majorem: vitesse-dark base → blood red/cold grey/bone
  'ad-majorem': {
    '#4d9375': '#6B2020',   // green → muted hellfire strings
    '#c98a7d': '#8B0000',   // warm → blood red keywords
    '#80a665': '#8899AA',   // green → cold blue-grey types
    '#b8a965': '#705030',   // yellow → burnt umber numbers
    '#6394bf': '#C0C0C0',   // blue → ashen white functions
    '#cb7676': '#8B0000',   // red → blood red
    '#758575': '#3A3A3A',   // comments → barely visible whispers
    '#121212': '#0A0A0A',   // background → near-pure black
  },
  // Friday 13: vitesse-dark base → matrix green/red only
  friday13: {
    '#4d9375': '#00ff41',   // green → matrix green
    '#c98a7d': '#ff0033',   // warm → blood red
    '#80a665': '#00cc34',   // green → green
    '#b8a965': '#00ff41',   // yellow → green
    '#6394bf': '#00ff41',   // blue → green
    '#cb7676': '#ff0033',   // red → blood red
    '#758575': '#00993a',   // comments → dim green
    '#121212': '#050505',   // background
  },
}

function CodeBlockCode({
  code,
  language = "tsx",
  theme: themeProp,
  lineNumbers = false,
  className,
  ...props
}: CodeBlockCodeProps) {
  const { theme: appTheme } = useTheme()
  const resolvedTheme = themeProp ?? SHIKI_THEMES[appTheme] ?? "one-dark-pro"
  const colorReplacements = COLOR_REPLACEMENTS[appTheme]
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null)

  useEffect(() => {
    async function highlight() {
      if (!code) {
        setHighlightedHtml("<pre><code></code></pre>")
        return
      }

      const html = await codeToHtml(code, {
        lang: language,
        theme: resolvedTheme,
        colorReplacements: colorReplacements ? { [resolvedTheme]: colorReplacements } : undefined,
      })
      setHighlightedHtml(html)
    }
    highlight()
  }, [code, language, resolvedTheme, colorReplacements])

  const classNames = cn(
    "w-full overflow-x-auto text-[13px] [&>pre]:min-w-fit [&>pre]:px-4 [&>pre]:py-4",
    lineNumbers && "line-numbers",
    className
  )

  return highlightedHtml ? (
    <div
      className={classNames}
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      {...props}
    />
  ) : (
    <div className={classNames} {...props}>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}

export type CodeBlockGroupProps = React.HTMLAttributes<HTMLDivElement>

function CodeBlockGroup({
  children,
  className,
  ...props
}: CodeBlockGroupProps) {
  return (
    <div
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { CodeBlockGroup, CodeBlockCode, CodeBlock }
