import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import {
  TimerIcon,
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
  ChevronDownIcon,
} from 'lucide-react'

const PRESETS = [5, 10, 15, 20, 30, 45, 60] as const

type TimerState = 'idle' | 'running' | 'paused'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function InterviewTimer() {
  const { t } = useTranslation()
  const [duration, setDuration] = useState(30)
  const [remaining, setRemaining] = useState(30 * 60)
  const [state, setState] = useState<TimerState>('idle')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            setState('idle')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [state])

  const handleStart = () => setState('running')
  const handlePause = () => setState('paused')
  const handleReset = () => {
    setState('idle')
    setRemaining(duration * 60)
  }
  const handleSelectDuration = (mins: number) => {
    setDuration(mins)
    setRemaining(mins * 60)
    setState('idle')
  }

  const isActive = state !== 'idle'
  const warningLevel =
    remaining <= 60 ? 'critical' : remaining <= 300 ? 'warning' : 'normal'

  const timeColor =
    warningLevel === 'critical'
      ? 'text-red-500'
      : warningLevel === 'warning'
        ? 'text-yellow-500'
        : isActive
          ? 'text-foreground'
          : 'text-muted-foreground'

  return (
    <div className="flex items-center gap-1">
      <TimerIcon className={`size-3.5 ${timeColor}`} />

      {isActive ? (
        <>
          <span
            className={`font-mono text-xs tabular-nums ${timeColor} ${warningLevel === 'critical' ? 'animate-pulse' : ''}`}
          >
            {formatTime(remaining)}
          </span>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={state === 'running' ? handlePause : handleStart}
                />
              }
            >
              {state === 'running' ? (
                <PauseIcon className="size-3" />
              ) : (
                <PlayIcon className="size-3" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              {state === 'running' ? t('tooltip.pause', 'Pause') : t('tooltip.resume', 'Resume')}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={handleReset}
                />
              }
            >
              <RotateCcwIcon className="size-3" />
            </TooltipTrigger>
            <TooltipContent>{t('tooltip.resetTimer', 'Reset timer')}</TooltipContent>
          </Tooltip>
        </>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-0.5 rounded-md px-1.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            {duration} min
            <ChevronDownIcon className="size-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            {PRESETS.map((mins) => (
              <DropdownMenuItem
                key={mins}
                className={duration === mins ? 'font-semibold text-primary' : ''}
                onClick={() => handleSelectDuration(mins)}
              >
                {mins} min
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {!isActive && (
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-6"
                onClick={handleStart}
              />
            }
          >
            <PlayIcon className="size-3" />
          </TooltipTrigger>
          <TooltipContent>{t('tooltip.startTimer', 'Start interview timer')}</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
