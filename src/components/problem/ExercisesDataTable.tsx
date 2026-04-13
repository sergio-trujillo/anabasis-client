// TanStack data table for section exercises. Mirrors Praxema's
// ProblemsDataTable feature set — search, difficulty filters, sort by
// difficulty/type/title, paginated footer — adapted to Anabasis' schema
// (`ExerciseListItem` from `trpc.exercises.list`).

import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  SearchIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { bilingual } from '@/lib/i18n'

export type ExerciseRow = {
  id: string
  type: 'mcq' | 'code' | 'open-prompt' | 'interviewer-chat'
  section: string
  title: { en: string; es?: string | null }
  difficulty?: string
}

interface Props {
  companySlug: string
  exercises: ExerciseRow[]
}

const TYPE_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  mcq: 'default',
  code: 'secondary',
  'open-prompt': 'outline',
  'interviewer-chat': 'default',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'bg-green-500/10 text-green-500 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  hard: 'bg-red-500/10 text-red-500 border-red-500/20',
}

const DIFF_ORDER: Record<string, number> = { easy: 0, medium: 1, hard: 2 }

function SortIcon({ sorted }: { sorted: false | 'asc' | 'desc' }) {
  if (sorted === 'asc') return <ArrowUpIcon className="size-3" />
  if (sorted === 'desc') return <ArrowDownIcon className="size-3" />
  return <ArrowUpDownIcon className="size-3 opacity-30" />
}

export function ExercisesDataTable({ companySlug, exercises }: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'en' | 'es'

  const [sorting, setSorting] = useState<SortingState>([{ id: 'difficulty', desc: false }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([])

  const columns = useMemo<ColumnDef<ExerciseRow>[]>(
    () => [
      {
        id: 'index',
        header: '#',
        size: 48,
        cell: ({ row }) => (
          <span className="text-xs font-mono text-muted-foreground">
            {row.index + 1}
          </span>
        ),
        enableSorting: false,
      },
      {
        id: 'title',
        accessorFn: (row) => bilingual(row.title),
        header: t('section.tableTitle', { defaultValue: 'Title' }),
        cell: ({ row }) => (
          <Link
            to={`/${companySlug}/exercise/${row.original.id}`}
            className="text-sm font-medium hover:text-primary transition-colors block truncate"
          >
            {bilingual(row.original.title)}
          </Link>
        ),
      },
      {
        id: 'type',
        accessorFn: (row) => row.type,
        header: t('section.tableType', { defaultValue: 'Type' }),
        size: 130,
        cell: ({ getValue }) => {
          const typ = getValue<ExerciseRow['type']>()
          return (
            <Badge variant={TYPE_VARIANT[typ] ?? 'default'} className="text-[10px]">
              {t(`exercise.types.${typ}`, { defaultValue: typ })}
            </Badge>
          )
        },
      },
      {
        id: 'difficulty',
        accessorFn: (row) => row.difficulty ?? '',
        header: t('section.tableDifficulty', { defaultValue: 'Difficulty' }),
        size: 110,
        sortingFn: (a, b) => {
          const da = DIFF_ORDER[a.original.difficulty ?? ''] ?? 99
          const db = DIFF_ORDER[b.original.difficulty ?? ''] ?? 99
          return da - db
        },
        cell: ({ row }) => {
          const d = row.original.difficulty
          if (!d) return <span className="text-muted-foreground text-xs">—</span>
          return (
            <Badge variant="outline" className={`text-[10px] ${DIFFICULTY_COLORS[d] ?? ''}`}>
              {d}
            </Badge>
          )
        },
        filterFn: (row, _id, filterValue: string[]) => {
          if (!filterValue.length) return true
          return filterValue.includes(row.original.difficulty ?? '')
        },
      },
      {
        id: 'open',
        header: '',
        size: 40,
        enableSorting: false,
        cell: ({ row }) => (
          <Link
            to={`/${companySlug}/exercise/${row.original.id}`}
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ChevronRightIcon className="size-4" />
          </Link>
        ),
      },
    ],
    [companySlug, t],
  )

  const table = useReactTable({
    data: exercises,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
    globalFilterFn: (row, _id, filterValue: string) => {
      const needle = filterValue.toLowerCase()
      const title = bilingual(row.original.title).toLowerCase()
      const es = (row.original.title.es ?? '').toLowerCase()
      return (
        title.includes(needle) ||
        es.includes(needle) ||
        row.original.id.toLowerCase().includes(needle)
      )
    },
  })

  const toggleDifficulty = (diff: string) => {
    const next = difficultyFilter.includes(diff)
      ? difficultyFilter.filter((d) => d !== diff)
      : [...difficultyFilter, diff]
    setDifficultyFilter(next)
    table.getColumn('difficulty')?.setFilterValue(next.length ? next : undefined)
  }

  const visible = table.getFilteredRowModel().rows
  const countBy = (d: string) =>
    visible.filter((r) => r.original.difficulty === d).length

  return (
    <div className="flex flex-col gap-3">
      {/* Stats strip */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">
          {visible.length} {t('section.exercises', { defaultValue: 'exercises' })}
        </span>
        {(['easy', 'medium', 'hard'] as const).map((d) => {
          const n = countBy(d)
          if (n === 0) return null
          return (
            <Badge
              key={d}
              variant="outline"
              className={`text-[10px] ${DIFFICULTY_COLORS[d]}`}
            >
              {n} {d}
            </Badge>
          )
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-[360px]">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('section.search', {
              defaultValue:
                lang === 'es' ? 'Buscar ejercicios…' : 'Search exercises…',
            })}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-8 w-full rounded-md border border-border bg-card pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div className="flex gap-1">
          {(['easy', 'medium', 'hard'] as const).map((diff) => (
            <Button
              key={diff}
              variant={difficultyFilter.includes(diff) ? 'default' : 'outline'}
              size="sm"
              className={`h-7 px-2.5 text-[10px] ${
                difficultyFilter.includes(diff)
                  ? diff === 'easy'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : diff === 'medium'
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  : ''
              }`}
              onClick={() => toggleDifficulty(diff)}
            >
              {diff}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden bg-card">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b bg-muted/30">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="h-9 px-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        type="button"
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <SortIcon sorted={header.column.getIsSorted()} />
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  {t('section.noResults', {
                    defaultValue:
                      lang === 'es'
                        ? 'Ningún ejercicio coincide con los filtros.'
                        : 'No exercises match your filters.',
                  })}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b last:border-0 transition-colors hover:bg-muted/40"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground">
            {t('section.rowsPerPage', { defaultValue: 'Rows' })}:
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="h-7 rounded-md border border-border bg-card px-2 text-[10px] text-foreground outline-none"
          >
            {[10, 15, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground mr-2">
            {t('section.page', { defaultValue: 'Page' })}{' '}
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeftIcon className="size-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="size-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="size-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRightIcon className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
