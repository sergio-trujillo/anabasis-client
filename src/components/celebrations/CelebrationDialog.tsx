import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Particles, ParticlesEffect } from '@/components/animate-ui/primitives/effects/particles'
import { Shine } from '@/components/animate-ui/primitives/effects/shine'
import { GradientText } from '@/components/animate-ui/primitives/texts/gradient'
import { ArrowUpIcon, TrophyIcon, SparklesIcon } from 'lucide-react'

type CelebrationEvent =
  | { type: 'levelUp'; level: number; levelName: string }
  | { type: 'badge'; name: string; description: string }

interface CelebrationDialogProps {
  events: CelebrationEvent[]
  onDone: () => void
}

export function CelebrationDialog({ events, onDone }: CelebrationDialogProps) {
  const [index, setIndex] = useState(0)

  const current = events[index]
  if (!current) return null

  const isLast = index >= events.length - 1

  const handleNext = () => {
    if (isLast) {
      onDone()
    } else {
      setIndex((i) => i + 1)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onDone() }}>
      <DialogContent showCloseButton={false} className="sm:max-w-sm overflow-hidden">
        <AnimatePresence mode="wait">
          {current.type === 'levelUp' && (
            <LevelUpContent
              key={`level-${current.level}`}
              level={current.level}
              levelName={current.levelName}
              onNext={handleNext}
              isLast={isLast}
            />
          )}
          {current.type === 'badge' && (
            <BadgeContent
              key={`badge-${current.name}`}
              name={current.name}
              description={current.description}
              onNext={handleNext}
              isLast={isLast}
            />
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

function LevelUpContent({
  level,
  levelName,
  onNext,
  isLast,
}: {
  level: number
  levelName: string
  onNext: () => void
  isLast: boolean
}) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <DialogHeader className="items-center">
        <Particles className="mb-2">
          <motion.div
            className="flex size-20 items-center justify-center rounded-2xl bg-primary/10"
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ArrowUpIcon className="size-10 text-primary" />
          </motion.div>
          <ParticlesEffect
            side="top"
            count={8}
            radius={60}
            spread={360}
            duration={1}
            delay={0.2}
            className="size-2 rounded-full bg-primary"
          />
          <ParticlesEffect
            side="bottom"
            count={6}
            radius={50}
            spread={360}
            duration={1.2}
            delay={0.3}
            className="size-1.5 rounded-full bg-yellow-400"
          />
        </Particles>

        <DialogTitle className="text-center text-lg">
          {t('celebration.levelUp', 'Level Up!')}
        </DialogTitle>
        <DialogDescription className="text-center">
          <span className="block text-3xl font-bold">
            <GradientText
              text={`${t('common.level')} ${level}`}
              gradient="linear-gradient(90deg, #3b82f6, #a855f7, #ec4899)"
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
          </span>
          <span className="mt-1 block text-sm text-muted-foreground">{levelName}</span>
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="mt-6 sm:justify-center">
        <Button onClick={onNext}>
          {isLast
            ? t('celebration.continue', 'Continue coding')
            : t('common.continue')}
        </Button>
      </DialogFooter>
    </motion.div>
  )
}

function BadgeContent({
  name,
  description,
  onNext,
  isLast,
}: {
  name: string
  description: string
  onNext: () => void
  isLast: boolean
}) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <DialogHeader className="items-center">
        <Shine delay={0.3} duration={1.5}>
          <motion.div
            className="mb-2 flex size-20 items-center justify-center rounded-2xl bg-yellow-500/10"
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ perspective: 600 }}
          >
            <TrophyIcon className="size-10 text-yellow-500" />
          </motion.div>
        </Shine>

        <DialogTitle className="text-center text-lg">
          <SparklesIcon className="mr-1 inline size-4 text-yellow-500" />
          {name}
        </DialogTitle>
        <DialogDescription className="text-center">
          {description}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="mt-6 sm:justify-center">
        <Button onClick={onNext}>
          {isLast
            ? t('celebration.continue', 'Continue coding')
            : t('common.continue')}
        </Button>
      </DialogFooter>
    </motion.div>
  )
}

export type { CelebrationEvent }
