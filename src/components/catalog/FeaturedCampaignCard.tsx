import { ArrowRightIcon, ClockIcon, ShuffleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import { Shine } from "@/components/animate-ui/primitives/effects/shine";
import { GradientText } from "@/components/animate-ui/primitives/texts/gradient";
import { BorderBeam } from "@/components/ui/border-beam";
import { buttonVariants } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import { cn } from "@/lib/utils";
import { QuickLaunchLink } from "./QuickLaunchLink";
import type { Company } from "./types";

export function FeaturedCampaignCard({ company }: { company: Company }) {
	const { t } = useTranslation();
	const accent = company.accentColor ?? "var(--primary)";

	return (
		<Fade delay={0.18}>
			<section
				className="space-y-3"
				aria-labelledby="featured-campaign-heading"
			>
				<h2
					id="featured-campaign-heading"
					className="text-xs uppercase tracking-wider text-muted-foreground"
				>
					{t("catalog.featured")}
				</h2>

				<MagicCard className="relative overflow-hidden p-0">
					<BorderBeam
						size={240}
						duration={10}
						colorFrom={accent}
						colorTo="var(--chart-2)"
					/>

					<div className="grid grid-cols-1 md:grid-cols-5 gap-0">
						<div className="md:col-span-3 p-8 relative">
							<Shine
								enable
								duration={2400}
								loop
								loopDelay={6000}
								color={accent}
								opacity={0.25}
							>
								<div className="space-y-5">
									<div className="flex items-center gap-2">
										<span
											className="inline-flex size-2 rounded-full animate-pulse"
											style={{ backgroundColor: accent }}
										/>
										<span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
											{t("catalog.featuredEyebrow")}
										</span>
									</div>

									<h3 className="font-heading text-4xl font-bold tracking-tight">
										<GradientText
											text={company.name}
											gradient={`linear-gradient(90deg, ${accent} 0%, var(--chart-2) 60%, ${accent} 100%)`}
										/>
									</h3>

									<p className="text-base text-muted-foreground leading-relaxed max-w-lg">
										{company.tagline}
									</p>

									<Link
										to={`/${company.slug}`}
										className={cn(
											buttonVariants({ variant: "default", size: "lg" }),
											"group/cta gap-2",
										)}
										style={{ backgroundColor: accent }}
									>
										{t("catalog.launchCampaign")}
										<ArrowRightIcon className="size-4 transition-transform group-hover/cta:translate-x-0.5" />
									</Link>
								</div>
							</Shine>
						</div>

						<div className="md:col-span-2 p-6 md:border-l border-t md:border-t-0 border-border/50 bg-muted/20 space-y-3">
							<div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
								{t("catalog.quickLaunch")}
							</div>

							<QuickLaunchLink
								to={`/${company.slug}/mock-power-day`}
								icon={ClockIcon}
								label={t("catalog.mockPowerDay")}
								accent={accent}
								primary
							/>
							<QuickLaunchLink
								to={`/${company.slug}/mock-gca`}
								icon={ClockIcon}
								label={t("catalog.mockGca")}
								accent={accent}
							/>
							<QuickLaunchLink
								to={`/${company.slug}/practice`}
								icon={ShuffleIcon}
								label={t("nav.practice")}
								accent={accent}
							/>
						</div>
					</div>
				</MagicCard>
			</section>
		</Fade>
	);
}
