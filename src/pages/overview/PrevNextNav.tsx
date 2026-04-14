import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import type { Chapter } from "./chapters";

type Props = {
	chapters: Chapter[];
	currentSlug: string;
	baseTo: string;
};

export function PrevNextNav({ chapters, currentSlug, baseTo }: Props) {
	const { t } = useTranslation();
	const idx = chapters.findIndex((c) => c.slug === currentSlug);
	if (idx === -1) return null;

	const prev = idx > 0 ? chapters[idx - 1] : null;
	const next = idx < chapters.length - 1 ? chapters[idx + 1] : null;

	if (!prev && !next) return null;

	return (
		<nav
			aria-label={t("prevNext.nav", { defaultValue: "Chapter navigation" })}
			className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-3 pt-8 border-t border-border/60"
		>
			{prev ? (
				<ChapterLink chapter={prev} to={`${baseTo}/${prev.slug}`} side="prev" />
			) : (
				<div aria-hidden />
			)}
			{next ? (
				<ChapterLink chapter={next} to={`${baseTo}/${next.slug}`} side="next" />
			) : (
				<div aria-hidden />
			)}
		</nav>
	);
}

function ChapterLink({
	chapter,
	to,
	side,
}: {
	chapter: Chapter;
	to: string;
	side: "prev" | "next";
}) {
	const { t } = useTranslation();
	return (
		<Link
			to={to}
			className={cn(
				"group flex items-center gap-4 rounded-lg border border-border/60 bg-card/40 p-4 transition-all",
				"hover:border-border hover:bg-card",
				side === "next" && "md:col-start-2 md:text-right md:flex-row-reverse",
			)}
		>
			{side === "prev" ? (
				<ArrowLeftIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors group-hover:-translate-x-0.5" />
			) : (
				<ArrowRightIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors group-hover:translate-x-0.5" />
			)}
			<div className="min-w-0 flex-1">
				<div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 font-semibold">
					{side === "prev"
						? t("prevNext.previous", { defaultValue: "Previous" })
						: t("prevNext.next", { defaultValue: "Next" })}
				</div>
				<div className="mt-1 font-heading text-sm font-semibold truncate">
					{t(chapter.titleKey)}
				</div>
			</div>
		</Link>
	);
}
