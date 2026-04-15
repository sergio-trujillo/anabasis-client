import {
	BookOpenIcon,
	BotIcon,
	BracesIcon,
	BriefcaseIcon,
	FileCode2Icon,
	MessageSquareIcon,
	TimerIcon,
	UsersIcon,
} from "lucide-react";

export function iconForKind(kind: string) {
	switch (kind) {
		case "code":
			return FileCode2Icon;
		case "code+defense":
			return BracesIcon;
		case "timed":
		case "mock-loop":
			return TimerIcon;
		case "lesson+drills":
			return BookOpenIcon;
		case "interviewer-chat":
			return BotIcon;
		case "behavioral":
			return UsersIcon;
		case "business-case":
			return BriefcaseIcon;
		default:
			return MessageSquareIcon;
	}
}

export function kindLabel(kind: string): string {
	switch (kind) {
		case "code":
			return "Coding";
		case "code+defense":
			return "Coding + defense";
		case "timed":
			return "Timed exam";
		case "mock-loop":
			return "Mock loop";
		case "lesson+drills":
			return "Lesson + drills";
		case "interviewer-chat":
			return "Interviewer chat";
		case "behavioral":
			return "Behavioral";
		case "business-case":
			return "Business case";
		default:
			return kind;
	}
}

export function hrefForSection(
	companySlug: string,
	section: { id: string },
): string {
	if (section.id === "gca-mock") return `/${companySlug}/mock-gca`;
	if (section.id === "power-day-mock") return `/${companySlug}/mock-power-day`;
	if (section.id === "gca-overview") return `/${companySlug}/overview/gca`;
	if (section.id === "power-day-overview")
		return `/${companySlug}/overview/power-day`;
	return `/${companySlug}/section/${section.id}`;
}
