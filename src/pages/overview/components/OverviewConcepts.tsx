import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { OverviewSection } from "./OverviewSection";
import { PaperBulletList } from "./PaperHelpers";

type ConceptItem = {
	term: string;
	definition: string;
	why: string;
	example: string;
	signals?: string[];
	pitfalls?: string[];
};

export function OverviewConcepts({
	header,
	sub,
	items,
	labels,
}: {
	header: string;
	sub: string;
	items: ConceptItem[];
	labels: {
		definition: string;
		whyMatters: string;
		inPractice: string;
		signals: string;
		pitfalls: string;
	};
}) {
	const { t } = useTranslation();
	const [searchParams, setSearchParams] = useSearchParams();
	const paramC = Number(searchParams.get("c"));
	const safeIdx =
		Number.isInteger(paramC) && paramC >= 1 && paramC <= items.length
			? paramC - 1
			: 0;
	const current = items[safeIdx];
	if (!current) return null;

	const goTo = (i: number) => {
		const next = new URLSearchParams(searchParams);
		next.set("c", String(i + 1));
		setSearchParams(next, { replace: false });
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const prev = safeIdx > 0 ? items[safeIdx - 1] : null;
	const next = safeIdx < items.length - 1 ? items[safeIdx + 1] : null;

	return (
		<OverviewSection header={header} sub={sub}>
			<div className="mx-auto max-w-6xl space-y-10 py-4">
				<ConceptTOC
					items={items}
					activeIdx={safeIdx}
					onSelect={goTo}
					tocLabel={t("overviewLabels.conceptTOC", {
						defaultValue: "Contents",
					})}
				/>

				<article className="space-y-7">
					<header className="space-y-3">
						<div className="flex items-center gap-3">
							<span className="font-mono text-xs text-muted-foreground/70 tabular-nums tracking-wider">
								§ {String(safeIdx + 1).padStart(2, "0")}
							</span>
							<Separator orientation="vertical" className="h-3.5" />
							<span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 font-semibold">
								{labels.definition}
							</span>
							<span className="ml-auto font-mono text-[10px] text-muted-foreground/60 tabular-nums">
								{String(safeIdx + 1).padStart(2, "0")} /{" "}
								{String(items.length).padStart(2, "0")}
							</span>
						</div>
						<h3 className="font-heading text-3xl font-semibold tracking-tight leading-tight">
							{current.term}
						</h3>
					</header>

					<p className="text-[15px] leading-[1.9] text-foreground/90">
						{current.definition}
					</p>

					<blockquote className="border-l-2 border-border pl-6 py-1 space-y-2">
						<div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
							{labels.whyMatters}
						</div>
						<p className="text-[15px] leading-[1.9] text-muted-foreground">
							{current.why}
						</p>
					</blockquote>

					<Card className="bg-muted/30 shadow-none">
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<div className="text-[10px] uppercase tracking-[0.22em] text-primary/90 font-semibold">
									{labels.inPractice}
								</div>
								<p className="text-[15px] leading-[1.9] italic text-foreground/85">
									{current.example}
								</p>
							</div>

							{current.signals && current.signals.length > 0 && (
								<PaperBulletList
									label={labels.signals}
									tone="emerald"
									items={current.signals}
								/>
							)}

							{current.pitfalls && current.pitfalls.length > 0 && (
								<PaperBulletList
									label={labels.pitfalls}
									tone="amber"
									items={current.pitfalls}
								/>
							)}
						</CardContent>
					</Card>
				</article>

				<ConceptPrevNext
					prev={prev}
					next={next}
					onPrev={() => goTo(safeIdx - 1)}
					onNext={() => goTo(safeIdx + 1)}
					labels={{
						prev: t("prevNext.previous", { defaultValue: "Previous" }),
						next: t("prevNext.next", { defaultValue: "Next" }),
					}}
				/>
			</div>
		</OverviewSection>
	);
}

function ConceptTOC({
	items,
	activeIdx,
	onSelect,
	tocLabel,
}: {
	items: Array<{ term: string }>;
	activeIdx: number;
	onSelect: (i: number) => void;
	tocLabel: string;
}) {
	return (
		<nav
			aria-label={tocLabel}
			className="rounded-lg border border-border/60 bg-card/40 p-3"
		>
			<div className="mb-2 flex items-center gap-2 px-1">
				<span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 font-semibold">
					{tocLabel}
				</span>
			</div>
			<ol className="space-y-0.5">
				{items.map((it, i) => {
					const isActive = i === activeIdx;
					return (
						<li key={it.term}>
							<button
								type="button"
								onClick={() => onSelect(i)}
								aria-current={isActive ? "page" : undefined}
								className={cn(
									"w-full flex items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
									isActive
										? "bg-muted text-foreground font-medium"
										: "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
								)}
							>
								<span className="font-mono text-[10px] tabular-nums text-muted-foreground/60 shrink-0">
									§ {String(i + 1).padStart(2, "0")}
								</span>
								<span className="truncate">{it.term}</span>
							</button>
						</li>
					);
				})}
			</ol>
		</nav>
	);
}

function ConceptPrevNext({
	prev,
	next,
	onPrev,
	onNext,
	labels,
}: {
	prev: { term: string } | null;
	next: { term: string } | null;
	onPrev: () => void;
	onNext: () => void;
	labels: { prev: string; next: string };
}) {
	if (!prev && !next) return null;
	return (
		<nav className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-6 border-t border-border/60">
			{prev ? (
				<button
					type="button"
					onClick={onPrev}
					className="group flex items-center gap-4 rounded-lg border border-border/60 bg-card/40 p-4 text-left transition-all hover:border-border hover:bg-card"
				>
					<ArrowLeftIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors group-hover:-translate-x-0.5" />
					<div className="min-w-0 flex-1">
						<div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 font-semibold">
							{labels.prev}
						</div>
						<div className="mt-1 font-heading text-sm font-semibold truncate">
							{prev.term}
						</div>
					</div>
				</button>
			) : (
				<div aria-hidden />
			)}
			{next ? (
				<button
					type="button"
					onClick={onNext}
					className="group flex items-center gap-4 rounded-lg border border-border/60 bg-card/40 p-4 text-right transition-all hover:border-border hover:bg-card md:col-start-2 md:flex-row-reverse"
				>
					<ArrowRightIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors group-hover:translate-x-0.5" />
					<div className="min-w-0 flex-1">
						<div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 font-semibold">
							{labels.next}
						</div>
						<div className="mt-1 font-heading text-sm font-semibold truncate">
							{next.term}
						</div>
					</div>
				</button>
			) : (
				<div aria-hidden />
			)}
		</nav>
	);
}
