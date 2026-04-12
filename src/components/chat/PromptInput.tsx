// Prompt input — auto-resizing textarea + send button. Now uses shadcn
// Button + Textarea + theme tokens.

import { useState } from "react";
import { SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function PromptInput({
  onSubmit,
  disabled,
  placeholder,
}: {
  onSubmit: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  }

  return (
    <div className="border-t border-border bg-card/50 p-3">
      <div className="flex items-end gap-2">
        <Textarea
          rows={1}
          value={value}
          disabled={disabled}
          placeholder={placeholder ?? "Your response…"}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          className="min-h-[40px] max-h-[144px] resize-none"
        />
        <Button
          type="button"
          onClick={submit}
          disabled={disabled || !value.trim()}
          size="icon"
        >
          <SendIcon className="size-4" />
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1">
        Enter to send · Shift+Enter for newline
      </p>
    </div>
  );
}
