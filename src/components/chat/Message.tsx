// Chat message bubble — uses semantic tokens so it adapts to all themes.

import { cn } from "@/lib/utils";

type Role = "interviewer" | "candidate";

export function Message({ role, children }: { role: Role; children: React.ReactNode }) {
  const isInterviewer = role === "interviewer";
  return (
    <div className={cn("flex w-full", isInterviewer ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap font-mono",
          isInterviewer
            ? "bg-card border border-border text-card-foreground"
            : "bg-primary text-primary-foreground",
        )}
      >
        {children}
      </div>
    </div>
  );
}
