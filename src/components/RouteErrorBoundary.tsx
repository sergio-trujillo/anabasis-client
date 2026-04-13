import { Component, type ReactNode } from 'react'
import { Link } from 'react-router'
import {
  BugIcon,
  CoffeeIcon,
  FlameIcon,
  MonitorXIcon,
  ShieldAlertIcon,
  SkullIcon,
  SirenIcon,
  ZapIcon,
  BananaIcon,
  SearchXIcon,
  ServerCrashIcon,
  TrafficConeIcon,
} from 'lucide-react'

interface RouteErrorBoundaryProps {
  children: ReactNode
}

interface RouteErrorBoundaryState {
  error: Error | null
}

export class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[RouteErrorBoundary] Caught error:', error, info)
  }

  reset = () => {
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state

    if (error) {
      const variants = [
        { icon: <BugIcon className="size-10 text-destructive" />, msg: 'Un becario invisible está debuggeando esto con un print("aquí llegó").' },
        { icon: <CoffeeIcon className="size-10 text-amber-500" />, msg: 'El código necesita más café. Nosotros también.' },
        { icon: <FlameIcon className="size-10 text-orange-500" />, msg: 'Esto está fino. Literalmente en llamas, pero fino.' },
        { icon: <MonitorXIcon className="size-10 text-destructive" />, msg: 'La pantalla dice que no. El stack trace dice que tampoco.' },
        { icon: <ShieldAlertIcon className="size-10 text-yellow-500" />, msg: 'Nuestros hamsters de servidor tropezaron con un cable. Ya los estamos regañando.' },
        { icon: <SkullIcon className="size-10 text-muted-foreground" />, msg: 'Este componente vivió una vida plena. Murió haciendo lo que amaba: crashear.' },
        { icon: <SirenIcon className="size-10 text-red-500" />, msg: 'Alerta roja. Desplieguen a los patos de hule de emergencia.' },
        { icon: <ZapIcon className="size-10 text-yellow-400" />, msg: 'Algo explotó. No fuimos nosotros. Bueno, tal vez un poco.' },
        { icon: <BananaIcon className="size-10 text-yellow-500" />, msg: 'Un equipo de monos altamente capacitados ha sido despachado para resolver esto.' },
        { icon: <SearchXIcon className="size-10 text-blue-400" />, msg: 'Buscamos el bug. El bug nos encontró primero.' },
        { icon: <ServerCrashIcon className="size-10 text-violet-500" />, msg: 'El servidor dijo "ya no puedo más" y se fue a terapia.' },
        { icon: <TrafficConeIcon className="size-10 text-orange-400" />, msg: 'Zona en construcción. Culpa del intern. Siempre es culpa del intern.' },
      ]
      const variant = variants[Math.floor(Math.random() * variants.length)]

      return (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-md text-center space-y-4">
            {variant.icon}
            <h2 className="text-xl font-semibold text-destructive">Oops — algo se rompió</h2>
            <p className="text-sm text-muted-foreground italic">
              {variant.msg}
            </p>
            <p className="text-xs text-muted-foreground/60 break-words font-mono">
              {error.message}
            </p>
            <Link
              to="/"
              onClick={this.reset}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Huir al Dashboard
            </Link>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
