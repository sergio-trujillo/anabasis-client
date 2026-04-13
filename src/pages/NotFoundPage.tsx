import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { MapPinOffIcon, HomeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm text-center space-y-4">
        <MapPinOffIcon className="mx-auto size-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold tracking-tight">
          {t('notFound.title', 'Page not found')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('notFound.description', "The page you're looking for doesn't exist or has been moved.")}
        </p>
        <Link to="/">
          <Button className="gap-2">
            <HomeIcon className="size-4" />
            {t('notFound.goHome', 'Back to Dashboard')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
