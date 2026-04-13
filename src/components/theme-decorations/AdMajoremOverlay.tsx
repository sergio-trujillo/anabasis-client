import { useTheme } from '@/components/theme-provider'

/** Inverted pentagram — mathematically perfect {5/2} star polygon inside double circle.
 *  Center (100,100), outer circle r=95, inner circle r=88, star r=90.
 *  Vertices at 72° intervals, rotated 180° (one vertex points down). */
function Pentagram({ size, className }: { size: number; className?: string }) {
  const cx = 100, cy = 100, r = 90
  const pts = Array.from({ length: 5 }, (_, i) => {
    const angle = (Math.PI / 2) + (i * 2 * Math.PI) / 5
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const
  })
  const starOrder = [0, 2, 4, 1, 3]
  const starPoints = starOrder.map(i => `${pts[i][0].toFixed(2)},${pts[i][1].toFixed(2)}`).join(' ')

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" className={className} fill="none">
      <circle cx={cx} cy={cy} r="95" stroke="currentColor" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="88" stroke="currentColor" strokeWidth="0.6" />
      <polygon points={starPoints} stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

/** Inverted cross */
function InvertedCross({ size, className }: { size: number; className?: string }) {
  const w = size
  const h = size * 1.8
  return (
    <svg width={w} height={h} viewBox="0 0 20 36" className={className} fill="none">
      {/* Vertical bar */}
      <rect x="8.5" y="0" width="3" height="36" fill="currentColor" />
      {/* Horizontal bar — positioned lower (inverted) */}
      <rect x="2" y="22" width="16" height="3" fill="currentColor" />
    </svg>
  )
}

/** Seal of Solomon / hexagram with circle */
function SigilSeal({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1" />
      {/* Upward triangle */}
      <polygon points="50,12 88,72 12,72" stroke="currentColor" strokeWidth="1" />
      {/* Downward triangle */}
      <polygon points="50,88 12,28 88,28" stroke="currentColor" strokeWidth="1" />
      <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  )
}

/**
 * Full-screen overlay of occult symbols for the Ad Majorem theme.
 * Fixed position, pointer-events-none, renders above everything.
 * Only mounts when theme is "ad-majorem".
 */
export function AdMajoremOverlay() {
  const { theme } = useTheme()
  if (theme !== 'ad-majorem') return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Large pentagram — bottom right */}
      <Pentagram
        size={340}
        className="absolute -bottom-16 -right-16 text-[#5C0000] opacity-[0.06]"
      />

      {/* Smaller pentagram — top left, rotated */}
      <Pentagram
        size={180}
        className="absolute -top-10 -left-10 text-[#5C0000] opacity-[0.04] rotate-12"
      />

      {/* Inverted cross — top right area */}
      <InvertedCross
        size={16}
        className="absolute top-20 right-24 text-[#5C0000] opacity-[0.08]"
      />

      {/* Second inverted cross — left side */}
      <InvertedCross
        size={12}
        className="absolute top-[40%] left-6 text-[#5C0000] opacity-[0.05] -rotate-6"
      />

      {/* Sigil seal — center-right area */}
      <SigilSeal
        size={60}
        className="absolute top-[30%] right-8 text-[#5C0000] opacity-[0.04]"
      />

      {/* Small sigil — bottom left */}
      <SigilSeal
        size={40}
        className="absolute bottom-24 left-16 text-[#5C0000] opacity-[0.05] rotate-45"
      />

      {/* Blood drip line — left edge */}
      <div
        className="absolute left-0 top-0 w-[2px] h-full"
        style={{
          background: 'linear-gradient(to bottom, #5C000050 0%, #3D000030 20%, transparent 50%, #5C000020 80%, transparent 100%)',
        }}
      />

      {/* Blood drip line — right of sidebar area (~256px) */}
      <div
        className="absolute top-0 h-full w-[1px]"
        style={{
          left: 256,
          background: 'linear-gradient(to bottom, #5C000060 0%, #3D000040 15%, transparent 45%, #5C000015 75%, transparent 100%)',
        }}
      />
    </div>
  )
}
