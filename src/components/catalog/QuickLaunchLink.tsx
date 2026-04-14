import type { LucideIcon } from "lucide-react";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

type Props = {
	to: string;
	icon: LucideIcon;
	label: string;
	accent: string;
	primary?: boolean;
};

export function QuickLaunchLink({
	to,
	icon: Icon,
	label,
	accent,
	primary = false,
}: Props) {
	return (
		<Link
			to={to}
			className={cn(
				"group flex items-center gap-3 rounded-lg border px-3 py-3 text-sm transition-all",
				"hover:bg-background hover:border-border",
				primary
					? "border-primary/30 bg-background"
					: "border-border/40 bg-transparent",
			)}
		>
			<span
				className="flex size-8 items-center justify-center rounded-md ring-1 ring-border/60"
				style={{
					backgroundColor: primary ? `${accent}1A` : "transparent",
					color: primary ? accent : undefined,
				}}
			>
				<Icon className="size-4" />
			</span>
			<span className="flex-1 font-medium truncate">{label}</span>
			<ArrowRightIcon className="size-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
		</Link>
	);
}
