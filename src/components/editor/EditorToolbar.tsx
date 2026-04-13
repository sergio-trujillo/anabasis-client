import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'
import {
  RotateCcwIcon,
  PlayIcon,
  SendIcon,
  LoaderIcon,
  CheckIcon,
  WrapTextIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { InterviewTimer } from './InterviewTimer'

interface EditorToolbarProps {
  onReset?: () => void
  onRun?: () => void
  onSubmit?: () => void
  onFormat?: () => void
  isRunning?: boolean
  saveStatus?: 'idle' | 'saving' | 'saved'
}

export function EditorToolbar({ onReset, onRun, onSubmit, onFormat, isRunning = false, saveStatus = 'idle' }: EditorToolbarProps) {
  const { t } = useTranslation()

  return (
    <TooltipProvider>
      <div className="flex h-9 shrink-0 items-center justify-between border-b px-2 sm:px-4">
        {/* Left: language label + timer */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground">Java</span>
          <InterviewTimer />
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-1.5">
          {saveStatus === 'saving' && (
            <LoaderIcon className="size-3.5 text-muted-foreground animate-spin" />
          )}
          {saveStatus === 'saved' && (
            <CheckIcon className="size-3.5 text-green-500" />
          )}

          <Tooltip>
            <TooltipTrigger
              render={<Button variant="ghost" size="sm" onClick={onFormat} className="hidden sm:inline-flex" />}
            >
              <WrapTextIcon className="size-3" />
              <span className="hidden md:inline">{t('editor.format', 'Format')}</span>
            </TooltipTrigger>
            <TooltipContent>{t('tooltip.format', 'Format code')}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={<Button variant="ghost" size="sm" onClick={onReset} className="hidden sm:inline-flex" />}
            >
              <RotateCcwIcon className="size-3" />
              <span className="hidden md:inline">{t('problem.reset')}</span>
            </TooltipTrigger>
            <TooltipContent>{t('tooltip.reset', 'Reset to starter code')}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRun}
                  disabled={isRunning}
                />
              }
            >
              <PlayIcon className="size-3" />
              <span className="hidden md:inline">{t('problem.run')}</span>
            </TooltipTrigger>
            <TooltipContent>{t('tooltip.run', 'Run against test cases')} (Ctrl+Enter)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="default"
                  size="sm"
                  onClick={onSubmit}
                  disabled={isRunning}
                  className="bg-green-600 text-white hover:bg-green-700"
                />
              }
            >
              <SendIcon className="size-3" />
              <span className="hidden md:inline">{t('problem.submit')}</span>
            </TooltipTrigger>
            <TooltipContent>{t('tooltip.submit', 'Submit solution')} (Ctrl+Shift+Enter)</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
