import {
  AlertCircleIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  LoaderIcon,
  TerminalIcon,
  XCircleIcon,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface TestResult {
  name: string
  displayName: string
  status: string
  message?: string
  expected?: string
  actual?: string
}

interface RunResult {
  success: boolean
  compilationError?: string
  testResults: TestResult[]
  totalTests: number
  passedTests: number
  failedTests: number
  timeMs: number
  stdout?: string
}

interface OutputPanelProps {
  result: RunResult | null
  isRunning: boolean
  onGoToLine?: (line: number, col?: number) => void
}

// Parse "Solution.java:5: error: missing return statement" into clickable parts
function parseCompilationError(error: string, onGoToLine?: (line: number, col?: number) => void) {
  const lines = error.split('\n')

  return lines.map((line, i) => {
    // Match: Solution.java:LINE: error: MESSAGE
    const match = line.match(/^(\w+\.java):(\d+):\s*(.*)$/)
    if (match && match[1] === 'Solution.java' && onGoToLine) {
      const lineNum = parseInt(match[2])
      const rest = match[3]
      return (
        <span key={i}>
          <button
            className="text-primary underline underline-offset-2 hover:text-primary/80"
            onClick={() => onGoToLine(lineNum)}
          >
            Solution.java:{lineNum}
          </button>
          : {rest}
          {'\n'}
        </span>
      )
    }
    // Match: column indicator line (^)
    if (/^\s*\^/.test(line)) {
      return <span key={i} className="text-yellow-500">{line}{'\n'}</span>
    }
    return <span key={i}>{line}{'\n'}</span>
  })
}

// Parse stack traces to highlight user code lines
function parseRuntimeError(message: string, onGoToLine?: (line: number, col?: number) => void) {
  const lines = message.split('\n')

  return lines.map((line, i) => {
    // Match: at Solution.methodName(Solution.java:LINE)
    const stackMatch = line.match(/at\s+\w+\.\w+\(Solution\.java:(\d+)\)/)
    if (stackMatch && onGoToLine) {
      const lineNum = parseInt(stackMatch[1])
      const beforeLink = line.substring(0, line.indexOf('Solution.java'))
      return (
        <span key={i}>
          {beforeLink}
          <button
            className="text-primary underline underline-offset-2 hover:text-primary/80"
            onClick={() => onGoToLine(lineNum)}
          >
            Solution.java:{lineNum}
          </button>
          ){'\n'}
        </span>
      )
    }
    // Highlight exception name
    if (/^(java\.\w+\.\w+Exception|java\.\w+\.\w+Error)/.test(line.trim())) {
      return <span key={i} className="text-destructive font-medium">{line}{'\n'}</span>
    }
    return <span key={i} className="text-muted-foreground">{line}{'\n'}</span>
  })
}

function TestResultItem({ test, onGoToLine }: { test: TestResult; onGoToLine?: (line: number, col?: number) => void }) {
  const { t } = useTranslation()
  const isFailed = test.status !== 'passed'
  const [expanded, setExpanded] = useState(isFailed)
  const hasDetails = test.message || (test.expected && test.actual)

  return (
    <div className="rounded-md border px-3 py-2 text-xs">
      <button
        className="flex w-full items-center gap-2 text-left"
        onClick={() => hasDetails && setExpanded(!expanded)}
      >
        {test.status === 'passed' ? (
          <CheckCircleIcon className="size-3.5 text-green-500 shrink-0" />
        ) : test.status === 'error' ? (
          <AlertCircleIcon className="size-3.5 text-yellow-500 shrink-0" />
        ) : (
          <XCircleIcon className="size-3.5 text-destructive shrink-0" />
        )}
        <span className="font-medium flex-1">{test.displayName}</span>
        {hasDetails && (
          <ChevronRightIcon
            className={`size-3 text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
          />
        )}
      </button>

      {expanded && hasDetails && (
        <div className="mt-2 pl-5.5">
          {test.expected && test.actual && (
            <div className="space-y-1 mb-1.5">
              <div className="flex gap-2">
                <span className="text-muted-foreground w-16 shrink-0">{t('output.expected')}:</span>
                <code className="rounded bg-green-500/10 px-1.5 py-0.5 text-green-500">{test.expected}</code>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground w-16 shrink-0">{t('output.actual')}:</span>
                <code className="rounded bg-destructive/10 px-1.5 py-0.5 text-destructive">{test.actual}</code>
              </div>
            </div>
          )}
          {test.message && !test.expected && (
            <pre className="whitespace-pre-wrap text-muted-foreground">
              {test.message.includes('Solution.java')
                ? parseRuntimeError(test.message, onGoToLine)
                : test.message}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}

export function OutputPanel({ result, isRunning, onGoToLine }: OutputPanelProps) {
  const { t } = useTranslation()

  if (isRunning) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
        <LoaderIcon className="size-4 animate-spin" />
        {t('output.running')}
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
        <TerminalIcon className="size-4" />
        {t('output.idle')}
      </div>
    )
  }

  if (result.compilationError) {
    return (
      <div className="h-full overflow-auto p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-destructive">
          <AlertCircleIcon className="size-4" />
          {t('output.compilationError')}
        </div>
        <pre className="whitespace-pre-wrap rounded-md bg-muted/50 p-3 font-mono text-xs text-destructive">
          {parseCompilationError(result.compilationError, onGoToLine)}
        </pre>
        {result.stdout && <ConsoleBlock stdout={result.stdout} />}
      </div>
    )
  }

  const hasStdout = !!(result.stdout && result.stdout.length > 0)

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <Tabs defaultValue="tests" className="flex flex-col h-full">
        <TabsList className="mx-4 mt-3 w-fit">
          <TabsTrigger value="tests" className="text-xs">
            {t('output.testsTab', { defaultValue: 'Tests' })}
            <span className="ml-1.5 text-muted-foreground tabular-nums">
              {result.passedTests}/{result.totalTests}
            </span>
          </TabsTrigger>
          <TabsTrigger value="console" className="text-xs" disabled={!hasStdout}>
            {t('output.consoleTab', { defaultValue: 'Console' })}
            {hasStdout && (
              <span className="ml-1.5 size-1.5 rounded-full bg-primary inline-block" />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="flex-1 overflow-auto px-4 pb-4 mt-2">
          <div
            className={`mb-3 flex items-center gap-2 text-sm font-medium ${result.success ? 'text-green-500' : 'text-destructive'}`}
          >
            {result.success ? (
              <CheckCircleIcon className="size-4" />
            ) : (
              <XCircleIcon className="size-4" />
            )}
            {result.success
              ? t('output.allPassed')
              : t('output.testsFailed', { count: result.failedTests })}
            <span className="text-xs text-muted-foreground">
              ({result.passedTests}/{result.totalTests} {t('output.passed')},{' '}
              {result.timeMs}ms)
            </span>
          </div>

          <div className="space-y-1.5">
            {result.testResults.map((test) => (
              <TestResultItem key={test.name} test={test} onGoToLine={onGoToLine} />
            ))}
          </div>
        </TabsContent>

        <TabsContent
          value="console"
          className="flex-1 overflow-auto px-4 pb-4 mt-2"
        >
          {hasStdout ? (
            <pre className="whitespace-pre-wrap rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed">
              {result.stdout}
            </pre>
          ) : (
            <div className="flex h-full items-center justify-center gap-2 text-xs text-muted-foreground">
              <TerminalIcon className="size-3.5" />
              {t('output.consoleEmpty', {
                defaultValue: 'No stdout — add System.out.println to see output.',
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ConsoleBlock({ stdout }: { stdout: string }) {
  const { t } = useTranslation()
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <TerminalIcon className="size-3.5" />
        {t('output.consoleTab', { defaultValue: 'Console' })}
      </div>
      <pre className="whitespace-pre-wrap rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed">
        {stdout}
      </pre>
    </div>
  )
}
