import { SparklesIcon } from "lucide-react";
import type { ReactNode } from "react";
import { GradientText } from "@/components/animate-ui/primitives/texts/gradient";
import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { MagicCard } from "@/components/ui/magic-card";

export function OverviewShell({
	kicker,
	title,
	summary,
	children,
}: {
	kicker: string;
	title: string;
	summary: string;
	children: ReactNode;
}) {
	return (
		<div className="space-y-6">
			<MagicCard className="relative overflow-hidden p-8 md:p-10">
				<BorderBeam size={240} duration={12} />
				<div className="space-y-3 max-w-3xl">
					<Badge variant="outline" className="gap-1.5 rounded-full p-2">
						<SparklesIcon className="size-3 text-primary" />
						<span className="text-[11px] uppercase tracking-wider text-muted-foreground">
							{kicker}
						</span>
					</Badge>
					<h2 className="font-heading text-3xl font-bold tracking-tight">
						<GradientText
							text={title}
							gradient="linear-gradient(90deg, var(--primary) 0%, var(--chart-2) 50%, var(--chart-4) 100%)"
						/>
					</h2>
					<p className="text-base text-muted-foreground leading-relaxed">
						{summary}
					</p>
				</div>
			</MagicCard>
			{children}
		</div>
	);
}
