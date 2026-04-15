import { useTranslation } from "react-i18next";
import { GradientText } from "@/components/animate-ui/primitives/texts/gradient";
import { BorderBeam } from "@/components/ui/border-beam";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Separator } from "@/components/ui/separator";

export function CompanyHero({
	company,
	isActive,
}: {
	company: {
		slug: string;
		name: string;
		status: "active" | "coming-soon";
		tagline: string;
		accentColor?: string;
	};
	isActive: boolean;
}) {
	const { t } = useTranslation();
	const accent = company.accentColor ?? "var(--primary)";

	const stats = [
		{ label: "Exercises live", value: 461 },
		{ label: "GCA modules", value: 4 },
		{ label: "Power Day rounds", value: 4 },
		{ label: "Mock scenarios", value: 20 },
	];

	return (
		<header className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-8 md:p-10">
			{isActive && (
				<BorderBeam
					size={260}
					duration={12}
					colorFrom={accent}
					colorTo="var(--chart-2)"
				/>
			)}

			<div className="space-y-3 max-w-3xl">
				<div className="flex items-center gap-2">
					<span
						className="inline-flex size-2 rounded-full animate-pulse"
						style={{
							backgroundColor: isActive ? accent : "var(--muted-foreground)",
						}}
					/>
					<span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
						{isActive
							? t("catalog.featuredEyebrow", { defaultValue: "Now running" })
							: t("catalog.soon", { defaultValue: "Coming soon" })}
					</span>
				</div>

				<h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight leading-tight">
					<GradientText
						text={company.name}
						gradient={`linear-gradient(90deg, ${accent} 0%, var(--chart-2) 50%, ${accent} 100%)`}
					/>
				</h1>
				<p className="text-base text-muted-foreground leading-relaxed">
					{company.tagline}
				</p>
			</div>

			{isActive && (
				<>
					<Separator className="my-6" />
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{stats.map((s) => (
							<div key={s.label} className="space-y-0.5">
								<div className="text-2xl md:text-3xl font-bold font-heading tabular-nums">
									<NumberTicker value={s.value} />
								</div>
								<div className="text-[10px] uppercase tracking-wider text-muted-foreground">
									{s.label}
								</div>
							</div>
						))}
					</div>
				</>
			)}
		</header>
	);
}
