import { ExternalLinkIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { praxemaUrl } from "@/lib/praxema-links";
import { OverviewSection } from "./OverviewSection";

export function OverviewFingerprints({
	header,
	rows,
	columns,
}: {
	header: string;
	rows: Array<{ category: string; signal: string }>;
	columns: { category: string; signal: string };
}) {
	const { t } = useTranslation();
	const hasAnyPraxemaLink = rows.some((r) => praxemaUrl(r.category) !== null);

	return (
		<OverviewSection header={header}>
			<div className="rounded-xl border bg-card/60 backdrop-blur-sm overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[240px]">{columns.category}</TableHead>
							<TableHead>{columns.signal}</TableHead>
							{hasAnyPraxemaLink && (
								<TableHead className="w-[160px] text-right">
									<span className="sr-only">
										{t("nav.practiceInPraxema", {
											defaultValue: "Practice in Praxema",
										})}
									</span>
								</TableHead>
							)}
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.map((r) => {
							const href = praxemaUrl(r.category);
							return (
								<TableRow key={r.category}>
									<TableCell className="font-medium">{r.category}</TableCell>
									<TableCell className="text-sm text-muted-foreground leading-relaxed">
										{r.signal}
									</TableCell>
									{hasAnyPraxemaLink && (
										<TableCell className="text-right">
											{href && (
												<a
													href={href}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
												>
													{t("nav.practiceInPraxema", {
														defaultValue: "Practice",
													})}
													<ExternalLinkIcon className="size-3" />
												</a>
											)}
										</TableCell>
									)}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</OverviewSection>
	);
}
