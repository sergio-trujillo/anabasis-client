import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SectionCta } from "../lib";

export function OverviewCtas({ ctas }: { ctas: SectionCta[] }) {
	return (
		<div className="flex flex-wrap gap-2">
			{ctas.map((cta) => (
				<Link
					key={cta.to}
					to={cta.to}
					className={cn(
						buttonVariants({ variant: cta.variant, size: "lg" }),
						"gap-2",
					)}
				>
					<cta.icon className="size-4" />
					{cta.label}
					<ArrowRightIcon className="size-4" />
				</Link>
			))}
		</div>
	);
}
