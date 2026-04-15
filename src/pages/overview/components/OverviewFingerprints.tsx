import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
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
	return (
		<OverviewSection header={header}>
			<div className="rounded-xl border bg-card/60 backdrop-blur-sm overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[240px]">{columns.category}</TableHead>
							<TableHead>{columns.signal}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.map((r) => (
							<TableRow key={r.category}>
								<TableCell className="font-medium">{r.category}</TableCell>
								<TableCell className="text-sm text-muted-foreground leading-relaxed">
									{r.signal}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</OverviewSection>
	);
}
