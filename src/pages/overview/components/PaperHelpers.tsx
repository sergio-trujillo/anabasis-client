import { cn } from "@/lib/utils";

export function PaperBulletList({
	label,
	items,
	tone,
}: {
	label: string;
	items: string[];
	tone: "emerald" | "amber" | "rose" | "primary";
}) {
	const dot =
		tone === "emerald"
			? "bg-emerald-500/70"
			: tone === "amber"
				? "bg-amber-500/70"
				: tone === "rose"
					? "bg-rose-500/70"
					: "bg-primary/70";
	const labelColor =
		tone === "emerald"
			? "text-emerald-600/90"
			: tone === "amber"
				? "text-amber-600/90"
				: tone === "rose"
					? "text-rose-600/90"
					: "text-primary/90";
	return (
		<div className="space-y-2">
			<div
				className={cn(
					"text-[10px] uppercase tracking-[0.22em] font-semibold",
					labelColor,
				)}
			>
				{label}
			</div>
			<ul className="space-y-2">
				{items.map((it, i) => (
					<li
						key={i}
						className="flex gap-3 text-[14px] leading-[1.8] text-foreground/85"
					>
						<span
							aria-hidden
							className={cn("mt-2 size-1.5 shrink-0 rounded-full", dot)}
						/>
						<span>{it}</span>
					</li>
				))}
			</ul>
		</div>
	);
}

export function PaperSceneBreak() {
	return (
		<div
			aria-hidden
			className="pt-6 text-center font-mono text-xs tracking-[0.5em] text-muted-foreground/40 select-none"
		>
			§ § §
		</div>
	);
}
