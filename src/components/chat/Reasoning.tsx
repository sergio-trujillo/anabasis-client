// Collapsible reasoning / eval block — token-based, uses shadcn Badge.

import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export function Reasoning({
  score,
  title,
  children,
}: {
  score: number;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  // Score-tone via classnames so dark/light themes both render correctly.
  const tone =
    score >= 85
      ? "bg-chart-2/20 text-chart-2 border-chart-2/40"
      : score >= 70
        ? "bg-chart-3/20 text-chart-3 border-chart-3/40"
        : "bg-destructive/20 text-destructive border-destructive/40";

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 w-full text-left"
      >
        <Badge variant="outline" className={tone}>
          {score}/100
        </Badge>
        <span className="text-sm text-foreground">{title}</span>
        <ChevronRightIcon
          className={`ml-auto size-4 text-muted-foreground transition-transform ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>
      {open && <div className="mt-3 pl-1 text-sm text-foreground space-y-2">{children}</div>}
    </div>
  );
}
