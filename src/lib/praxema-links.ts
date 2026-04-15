// Praxema cross-links.
//
// Anabasis mentions pattern names (sliding window, BFS, DP, etc.). Praxema is
// the daily pattern gym where those patterns are taught and drilled. This
// file is the single source of truth that maps Anabasis pattern names to
// Praxema routes.
//
// Base URL is configurable via the VITE_PRAXEMA_URL env var. In local dev
// Praxema runs at http://localhost:5173 (Anabasis runs at :5174).

export const PRAXEMA_BASE: string =
	(import.meta.env.VITE_PRAXEMA_URL as string | undefined) ??
	"http://localhost:5173";

type PraxemaRef = { track: string; slug: string };

// Slugs validated against Praxema's src/lib/sidebar-data.ts. Keep the keys
// matching the exact `category` string used in Anabasis content so the
// lookup is `PRAXEMA_LINKS[row.category]`.
export const PRAXEMA_LINKS: Record<string, PraxemaRef | undefined> = {
	"Sliding window": { track: "java-patterns", slug: "sliding-window" },
	"Two pointers": { track: "java-patterns", slug: "two-pointers" },
	"Prefix sum": { track: "java-patterns", slug: "prefix-sum" },
	"Hashmap counting": { track: "data-structures", slug: "hash-maps" },
	"BFS on grid": { track: "java-patterns", slug: "matrix-traversal" },
	"DFS + backtracking": { track: "java-patterns", slug: "backtracking" },
	"Binary search on answer": {
		track: "java-patterns",
		slug: "modified-binary-search",
	},
	"Monotonic stack": { track: "java-patterns", slug: "monotonic-stack" },
	"Greedy by end-time": {
		track: "java-patterns",
		slug: "overlapping-intervals",
	},
	"1D DP": { track: "java-patterns", slug: "dynamic-programming" },
};

export function praxemaUrl(patternName: string): string | null {
	const m = PRAXEMA_LINKS[patternName];
	return m ? `${PRAXEMA_BASE}/track/${m.track}/pattern/${m.slug}` : null;
}
