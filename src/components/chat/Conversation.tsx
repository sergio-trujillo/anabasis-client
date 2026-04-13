// Auto-scrolling conversation container — token-based theme.

import { useEffect, useRef } from "react";

export function Conversation({
  children,
  length,
}: {
  children: React.ReactNode;
  length: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [length]);

  return (
    <div ref={ref} className="flex-1 overflow-y-auto px-4 py-6 space-y-3 scroll-smooth">
      {children}
    </div>
  );
}
