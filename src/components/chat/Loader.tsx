// "Interviewer is typing…" indicator — token-based.

export function Loader() {
  return (
    <div className="flex w-full justify-start">
      <div className="rounded-2xl bg-card border border-border px-4 py-3">
        <div className="flex gap-1.5">
          <Dot delay="0ms" />
          <Dot delay="150ms" />
          <Dot delay="300ms" />
        </div>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full bg-muted-foreground animate-pulse"
      style={{ animationDelay: delay }}
    />
  );
}
