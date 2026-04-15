import type { useTranslation } from "react-i18next";

export type Section = { id: string; name: string; kind: string };

export type Phase = {
	id: string;
	name: string;
	description: string;
	sections: Section[];
};

export type JourneyStep = {
	step: string;
	duration: string;
	what: string;
	evaluated: string;
};

export type DistinctiveItem = { title: string; body: string };

export type PlanItem = {
	title: string;
	subtitle: string;
	body: string;
	to: "mock-power-day" | "mock-gca" | "practice";
	cta: string;
};

export function tArray<T>(
	t: ReturnType<typeof useTranslation>["t"],
	key: string,
): T[] {
	return t(key, { returnObjects: true }) as unknown as T[];
}
