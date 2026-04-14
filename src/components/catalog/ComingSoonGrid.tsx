import { LockIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import {
	Tilt,
	TiltContent,
} from "@/components/animate-ui/primitives/effects/tilt";
import { Badge } from "@/components/ui/badge";
import { MagicCard } from "@/components/ui/magic-card";
import type { Company } from "./types";

export function ComingSoonGrid({ companies }: { companies: Company[] }) {
	const { t } = useTranslation();
	return (
		<Fade delay={0.26}>
			<section className="space-y-3" aria-labelledby="coming-soon-heading">
				<div className="flex items-baseline justify-between">
					<h2
						id="coming-soon-heading"
						className="text-xs uppercase tracking-wider text-muted-foreground"
					>
						{t("catalog.comingSoonHeader")}
					</h2>
					<span className="text-[11px] text-muted-foreground/70">
						{t("catalog.lockedHint")}
					</span>
				</div>

				<ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
					{companies.map((company, i) => (
						<li key={company.slug}>
							<Fade delay={0.3 + i * 0.04}>
								<Tilt maxTilt={6}>
									<TiltContent>
										<ComingSoonCard company={company} />
									</TiltContent>
								</Tilt>
							</Fade>
						</li>
					))}
				</ul>
			</section>
		</Fade>
	);
}

function ComingSoonCard({ company }: { company: Company }) {
	const { t } = useTranslation();
	const accent = company.accentColor ?? "var(--primary)";
	return (
		<MagicCard
			aria-disabled="true"
			aria-label={`${company.name} — ${t("catalog.soon")}`}
			className="h-full p-4 relative overflow-hidden opacity-80 hover:opacity-100 transition-opacity"
		>
			<div
				className="absolute inset-x-0 top-0 h-0.5"
				style={{ backgroundColor: accent, opacity: 0.5 }}
			/>
			<div className="flex items-start justify-between gap-2 mb-3">
				<h3 className="font-heading text-sm font-semibold truncate">
					{company.name}
				</h3>
				<Badge variant="outline" className="gap-1 text-[10px] px-1.5">
					<LockIcon className="size-2.5" />
					{t("catalog.soon")}
				</Badge>
			</div>
			<p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
				{company.tagline}
			</p>
		</MagicCard>
	);
}
