// Company landing — the campaign-level view.
// Route: /:companySlug.
//
// Active Capital One redirects to the docs-style overview layout.
// Coming-soon companies render a simple hero + loop listing.

import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import { CompanyHero } from "@/components/company/CompanyHero";
import { LoopTabs } from "@/components/company/CompanyLoopSection";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";

export function CompanyPage() {
	const { t: _t } = useTranslation();
	const { companySlug = "" } = useParams();
	const companyQuery = trpc.companies.get.useQuery({ slug: companySlug });

	if (companyQuery.isPending) {
		return (
			<div className="flex-1 overflow-y-auto">
				<div className="p-2 w-full space-y-4">
					<Skeleton className="h-10 w-80" />
					<Skeleton className="h-4 w-96" />
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
						{[1, 2].map((i) => (
							<Skeleton key={i} className="h-60 rounded-xl" />
						))}
					</div>
				</div>
			</div>
		);
	}

	if (companyQuery.error || !companyQuery.data) {
		return (
			<div className="flex-1 overflow-y-auto">
				<div className="p-2 w-full">
					<p className="text-destructive">
						{companyQuery.error?.message ?? "Company not found"}
					</p>
				</div>
			</div>
		);
	}

	// tRPC type inference is temporarily degraded while legacy Praxema pages
	// (ProblemPage, LessonPage, etc.) still reference types that collide with
	// the Anabasis AppRouter. Cast narrowly until Fase 5 finishes removing them.
	const { company, loop } = companyQuery.data as {
		company: {
			slug: string;
			name: string;
			status: "active" | "coming-soon";
			tagline: string;
			accentColor?: string;
		};
		loop: {
			displayName: string;
			phases: Array<{
				id: string;
				name: string;
				description: string;
				sections: Array<{ id: string; name: string; kind: string }>;
			}>;
		} | null;
	};
	const isActive = company.status === "active";

	if (isActive && company.slug === "capital-one") {
		return <Navigate to={`/${companySlug}/overview/company`} replace />;
	}

	return (
		<div className="flex-1 overflow-y-auto">
			<div className="relative min-h-[calc(100vh-3.5rem)]">
				<AnimatedGridPattern
					numSquares={36}
					maxOpacity={0.06}
					duration={3}
					className="absolute inset-0 -z-10 [mask-image:radial-gradient(700px_circle_at_top,white,transparent)]"
				/>
				<div className="relative p-2 w-full space-y-8">
					<Fade>
						<CompanyHero company={company} isActive={isActive} />
					</Fade>
					{loop && loop.phases.length > 0 && (
						<Fade delay={0.25}>
							<LoopTabs companySlug={companySlug} phases={loop.phases} />
						</Fade>
					)}
				</div>
			</div>
		</div>
	);
}
