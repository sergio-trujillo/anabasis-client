import { AppLayout } from '@/components/layout/AppLayout'
import { AppRoutes } from './router'
import { AdMajoremOverlay } from '@/components/theme-decorations/AdMajoremOverlay'

export function App() {
  return (
    <>
      <AdMajoremOverlay />
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </>
  )
}

export default App
