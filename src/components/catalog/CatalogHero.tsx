import { SparklesIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Fade } from '@/components/animate-ui/primitives/effects/fade'
import { Shine } from '@/components/animate-ui/primitives/effects/shine'
import { GradientText } from '@/components/animate-ui/primitives/texts/gradient'
import { Badge } from '@/components/ui/badge'

export function CatalogHero() {
  const { t } = useTranslation()
  return (
    <Fade>
      <section className="space-y-4">
        <Badge variant="outline" className="gap-1.5 rounded-full p-2">
          <SparklesIcon className="size-3 text-primary" />
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {t('catalog.heroKicker')}
          </span>
        </Badge>

        <Shine
          enable
          duration={2800}
          loop
          loopDelay={4500}
          color="var(--primary)"
          opacity={0.35}
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-heading leading-[1.08] max-w-3xl">
            <GradientText
              text={t('catalog.heroHeadline')}
              gradient="linear-gradient(90deg, var(--primary) 0%, var(--chart-2) 40%, var(--chart-4) 80%, var(--primary) 100%)"
            />
          </h1>
        </Shine>

        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          {t('catalog.heroSubtitle')}
        </p>
      </section>
    </Fade>
  )
}
