import { Markdown } from '@/components/ui/markdown'

const shadcnComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="scroll-m-16 text-3xl font-extrabold tracking-tight text-balance mt-5 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="scroll-m-16 border-b pb-1.5 text-xl font-semibold tracking-tight mt-6 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="scroll-m-16 text-lg font-semibold tracking-tight mt-5">
      {children}
    </h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="scroll-m-16 text-base font-semibold tracking-tight mt-4">
      {children}
    </h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="leading-6 [&:not(:first-child)]:mt-2.5">{children}</p>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="mt-3 border-l-2 border-primary/30 pl-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="my-2.5 ml-5 list-disc [&>li]:mt-1 leading-6">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="my-2.5 ml-5 list-decimal [&>li]:mt-1 leading-6">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li>{children}</li>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-4 w-full overflow-auto">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead>{children}</thead>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => (
    <tr className="m-0 border-t p-0 even:bg-muted/50">{children}</tr>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="border px-3 py-1.5 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="border px-3 py-1.5 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
      {children}
    </td>
  ),
  // code + pre are intentionally omitted — handled by base Markdown
  // component with CodeBlock + Shiki syntax highlighting
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  hr: () => <hr className="my-5 border-border" />,
}

interface ShadcnMarkdownProps {
  children: string
}

export function ShadcnMarkdown({ children }: ShadcnMarkdownProps) {
  return <Markdown components={shadcnComponents}>{children}</Markdown>
}
