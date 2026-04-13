import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme, BASE_THEMES, SEASONAL_THEMES, type ThemeName } from '@/components/theme-provider'
import {
  useUIStore,
  EDITOR_FONT_SIZES,
  EDITOR_FONT_FAMILIES,
  type EditorFontSize,
  type EditorFontFamilyId,
} from '@/store/ui-store'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { CodeBlockCode } from '@/components/ui/code-block'
import {
  GlobeIcon,
  PaletteIcon,
  TypeIcon,
  CaseSensitiveIcon,
  MapIcon,
  TimerIcon,
  SettingsIcon,
  CodeIcon,

  LayoutIcon,
  CoffeeIcon,
} from 'lucide-react'

interface SettingsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function SectionHeader({ icon: Icon, label }: { icon: typeof SettingsIcon; label: string }) {
  return (
    <div className="flex items-center gap-2 pb-1 pt-5 first:pt-0">
      <Icon className="size-3.5 text-primary" />
      <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">{label}</span>
    </div>
  )
}

function SettingRow({ icon: Icon, label, description, children }: { icon: typeof SettingsIcon; label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="py-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Icon className="size-4 text-muted-foreground" />
          <span className="text-sm">{label}</span>
        </div>
        <div className="flex items-center">{children}</div>
      </div>
      {description && (
        <p className="mt-1 pl-[26px] text-[10px] text-muted-foreground leading-relaxed">{description}</p>
      )}
    </div>
  )
}

export function SettingsSheet({ open, onOpenChange }: SettingsSheetProps) {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const editorFontSize = useUIStore((s) => s.editorFontSize)
  const setEditorFontSize = useUIStore((s) => s.setEditorFontSize)
  const editorFontFamily = useUIStore((s) => s.editorFontFamily)
  const setEditorFontFamily = useUIStore((s) => s.setEditorFontFamily)
  const outputPosition = useUIStore((s) => s.outputPosition)
  const setOutputPosition = useUIStore((s) => s.setOutputPosition)
  const programmingLanguage = useUIStore((s) => s.programmingLanguage)
  const setProgrammingLanguage = useUIStore((s) => s.setProgrammingLanguage)
  const [minimapEnabled, setMinimapEnabled] = useState(false)

  const allThemes = [...Object.entries(BASE_THEMES), ...Object.entries(SEASONAL_THEMES)]
  const currentThemeLabel = allThemes.find(([k]) => k === theme)?.[1].label ?? theme

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[480px] sm:max-w-[480px]">
        <SheetHeader className="pb-2">
          <SheetTitle className="flex items-center gap-2">
            <SettingsIcon className="size-4" />
            {t('settings.title')}
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-1 overflow-y-auto px-6 pb-6">

          {/* ── Appearance ── */}
          <SectionHeader icon={PaletteIcon} label={t('settings.appearance', 'Appearance')} />

          <SettingRow icon={PaletteIcon} label={t('settings.theme')}>
            <Select
              value={theme}
              onValueChange={(value) => { if (value) setTheme(value as ThemeName) }}
            >
              <SelectTrigger className="w-[180px]">
                <span className="truncate">{currentThemeLabel}</span>
              </SelectTrigger>
              <SelectContent>
                {allThemes.map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingRow>

          {/* Theme code preview */}
          <div className="rounded-lg border bg-card p-3 mt-1">
            <CodeBlockCode
              code={`// Two Sum — find indices that add up to target
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[] { seen.get(complement), i };
        }
        seen.put(nums[i], i); // store value → index
    }
    throw new IllegalArgumentException("No solution");
}`}
              language="java"
              lineNumbers
            />
          </div>

          <SettingRow
            icon={GlobeIcon}
            label={t('settings.language')}
            description={t('help.language', 'Descriptions, solutions, and the entire UI in your language')}
          >
            <Select
              value={i18n.language}
              onValueChange={(value) => { if (value) i18n.changeLanguage(value) }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>

          {/* ── Editor ── */}
          <SectionHeader icon={CodeIcon} label={t('settings.editor')} />

          <SettingRow
            icon={CoffeeIcon}
            label={t('settings.programmingLanguage', 'Language')}
            description={t('help.progLang')}
          >
            <Select
              value={programmingLanguage}
              onValueChange={(value) => { if (value) setProgrammingLanguage(value as 'java' | 'python') }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="python" disabled>Python — soon</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>

          <SettingRow icon={CaseSensitiveIcon} label={t('settings.fontFamily')}>
            <Select
              value={editorFontFamily}
              onValueChange={(value) => { if (value) setEditorFontFamily(value as EditorFontFamilyId) }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EDITOR_FONT_FAMILIES.map(({ id, label }) => (
                  <SelectItem key={id} value={id}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingRow>

          <SettingRow icon={TypeIcon} label={t('settings.fontSize')}>
            <Select
              value={editorFontSize}
              onValueChange={(value) => { if (value) setEditorFontSize(Number(value) as EditorFontSize) }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EDITOR_FONT_SIZES.map((size) => (
                  <SelectItem key={size} value={size}>{size}px</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingRow>

          {/* Font preview */}
          <div
            className="overflow-hidden rounded-lg border bg-muted/30 p-3 mt-1"
            style={{
              fontSize: `${editorFontSize}px`,
              fontFamily: EDITOR_FONT_FAMILIES.find((f) => f.id === editorFontFamily)?.value ?? 'monospace',
              lineHeight: 1.6,
            }}
          >
            <div><span className="text-code-keyword">public</span> <span className="text-code-type">int</span>[]</div>
            <div>
              <span className="text-code-fn">twoSum</span>
              <span className="text-muted-foreground">(</span>
              <span className="text-code-type">int</span>[] nums
              <span className="text-muted-foreground">)</span> {'{'}
            </div>
            <div className="pl-[2em]">
              <span className="text-code-keyword">for</span> (<span className="text-code-type">int</span> i = <span className="text-code-number">0</span>; i {'<'} n; i++)
            </div>
            <div>{'}'}</div>
          </div>

          <SettingRow icon={MapIcon} label={t('settings.minimap')} description={t('help.minimap')}>
            <Switch checked={minimapEnabled} onCheckedChange={setMinimapEnabled} />
          </SettingRow>

          {/* ── Layout ── */}
          <SectionHeader icon={LayoutIcon} label={t('settings.layout', 'Layout')} />

          <SettingRow
            icon={LayoutIcon}
            label={t('settings.outputPosition', 'Output position')}
            description={t('help.outputLayout')}
          >
            <Select
              value={outputPosition}
              onValueChange={(value) => { if (value) setOutputPosition(value as 'bottom' | 'right') }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom">{t('settings.layoutBottom', 'Bottom')}</SelectItem>
                <SelectItem value="right">{t('settings.layoutRight', 'Right')}</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>

          <div className="overflow-hidden rounded-lg border bg-muted/30 p-3 mt-1">
            <div className={`flex gap-1.5 ${outputPosition === 'bottom' ? 'flex-col' : 'flex-row'}`} style={{ height: 56 }}>
              <div className="flex flex-1 items-center justify-center rounded border border-primary/30 bg-primary/5 text-[10px] text-primary">
                Editor
              </div>
              <div className={`flex items-center justify-center rounded border border-muted-foreground/30 bg-muted/50 text-[10px] text-muted-foreground ${outputPosition === 'bottom' ? 'h-4 shrink-0' : 'w-14 shrink-0'}`}>
                Output
              </div>
            </div>
          </div>

          {/* ── Execution ── */}
          <SectionHeader icon={TimerIcon} label={t('settings.execution')} />

          <SettingRow icon={TimerIcon} label={t('settings.timeout')} description={t('help.timeout', 'Maximum time allowed for code execution')}>
            <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-muted-foreground">10s</span>
          </SettingRow>
        </div>
      </SheetContent>
    </Sheet>
  )
}
