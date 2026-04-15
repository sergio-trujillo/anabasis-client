import type { ReactNode } from "react";

export function OverviewSection({
	header,
	sub,
	children,
}: {
	header: string;
	sub?: string;
	children: ReactNode;
}) {
	return (
		<section className="space-y-3">
			<div className="space-y-1">
				<h3 className="text-xs uppercase tracking-wider text-muted-foreground">
					{header}
				</h3>
				{sub && <p className="text-xs text-muted-foreground/80 ">{sub}</p>}
			</div>
			{children}
		</section>
	);
}
