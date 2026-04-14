import { Skeleton } from "@/components/ui/skeleton";

export function CatalogLoadingState() {
	return (
		<div className="space-y-8" aria-busy="true" aria-live="polite">
			<div className="grid grid-cols-3 gap-4">
				{[0, 1, 2].map((i) => (
					<Skeleton key={i} className="h-20 rounded-xl" />
				))}
			</div>
			<Skeleton className="h-56 rounded-xl" />
			<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
				{[0, 1, 2, 3, 4].map((i) => (
					<Skeleton key={i} className="h-24 rounded-xl" />
				))}
			</div>
		</div>
	);
}
