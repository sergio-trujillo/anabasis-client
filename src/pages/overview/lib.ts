import type { ClockIcon } from "lucide-react";
import type { useTranslation } from "react-i18next";

export type DeepItem = {
	title: string;
	body: string;
	pattern?: string;
	pacing?: string;
	trap?: string;
	evaluated?: string;
	pitfalls?: string[];
	signals?: string[];
	example?: string;
	playbook?: string[];
};

export type SectionCta = {
	to: string;
	label: string;
	icon: typeof ClockIcon;
	variant: "default" | "secondary" | "outline";
};

// i18next typing doesn't type `returnObjects: true`, so we pull arrays via
// this helper and cast — the JSON shape is authoritative.
export function tArray<T>(
	t: ReturnType<typeof useTranslation>["t"],
	key: string,
): T[] {
	return t(key, { returnObjects: true }) as unknown as T[];
}
