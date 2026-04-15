// Individual chapter page for /:companySlug/overview/:topic/:page.
// Dispatches to the matching render block, then shows Prev/Next.

import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import { ChapterContent } from "./ChapterContent";
import {
	type Chapter,
	type ChapterSlug,
	chaptersFor,
	type OverviewTopic,
} from "./chapters";
import { PrevNextNav } from "./PrevNextNav";

export function OverviewSubPage() {
	const { companySlug = "", topic = "power-day", page } = useParams();
	const safeTopic: OverviewTopic =
		topic === "gca" || topic === "power-day" || topic === "company"
			? topic
			: "power-day";
	const chapters = chaptersFor(safeTopic);
	const baseTo = `/${companySlug}/overview/${safeTopic}`;
	const { t } = useTranslation();

	const current: Chapter | undefined = chapters.find(
		(c) => c.slug === (page as ChapterSlug),
	);

	if (!current) {
		// Unknown page under a valid topic → redirect to the topic landing.
		return <Navigate to={baseTo} replace />;
	}

	return (
		<>
			<Fade>
				<header className="space-y-2 pb-4 border-b border-border/60">
					<h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">
						{t(current.titleKey)}
					</h1>
					<p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
						{t(current.blurbKey)}
					</p>
				</header>
			</Fade>

			<Fade delay={0.08}>
				<div>
					<ChapterContent
						topic={safeTopic}
						slug={current.slug}
						companySlug={companySlug}
					/>
				</div>
			</Fade>

			<Fade delay={0.14}>
				<PrevNextNav
					chapters={chapters}
					currentSlug={current.slug}
					baseTo={baseTo}
				/>
			</Fade>
		</>
	);
}
