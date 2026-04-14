import { useTranslation } from "react-i18next";
import { CatalogHero } from "@/components/catalog/CatalogHero";
import { CatalogLoadingState } from "@/components/catalog/CatalogLoadingState";
import { CatalogStatsRow } from "@/components/catalog/CatalogStatsRow";
import { ComingSoonGrid } from "@/components/catalog/ComingSoonGrid";
import { FeaturedCampaignCard } from "@/components/catalog/FeaturedCampaignCard";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { trpc } from "@/lib/trpc";

export function CatalogPage() {
	const { t } = useTranslation();
	const { data, isPending, error } = trpc.companies.list.useQuery();

	const companies = data ?? [];
	const active = companies.filter((c) => c.status === "active");
	const soon = companies.filter((c) => c.status === "coming-soon");
	const featured = active[0];

	return (
		<div className="flex-1 overflow-y-auto">
			<div className="relative min-h-[calc(100vh-3.5rem)]">
				<AnimatedGridPattern
					numSquares={36}
					maxOpacity={0.07}
					duration={3}
					className="absolute inset-0 -z-10 [mask-image:radial-gradient(700px_circle_at_top,white,transparent)]"
				/>

				<div className="relative p-2 w-full space-y-8">
					<CatalogHero />

					{isPending ? (
						<CatalogLoadingState />
					) : error ? (
						<p className="text-destructive text-sm" role="alert">
							{t("catalog.errorLoading")}: {error.message}
						</p>
					) : (
						<>
							<CatalogStatsRow
								active={active.length}
								soon={soon.length}
								total={companies.length}
							/>

							{featured && <FeaturedCampaignCard company={featured} />}

							{soon.length > 0 && <ComingSoonGrid companies={soon} />}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
