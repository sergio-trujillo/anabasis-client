// Curated mock scenarios. 10 preset variants per mock type so the user
// can practice under different tactical framings without regenerating a
// blank random exam each time.
//
// The `id` is what ends up in the URL (/:companySlug/mock-gca/:mockId).
// `difficulty` tints the badge; `focus` tags surface what each scenario
// stress-tests. The server still composes the actual exercise pool at
// runtime — these scenarios are the user-facing curation layer.

export type MockDifficulty = 'easy' | 'medium' | 'hard'

export type MockScenario = {
  id: string
  name: string
  description: string
  difficulty: MockDifficulty
  focus: string[]
}

export const GCA_SCENARIOS: MockScenario[] = [
  {
    id: 'warmup-arrays',
    name: 'Warm-up · Arrays & Strings',
    description: 'Gentle entry. Two-pointers, frequency maps, and linear scans.',
    difficulty: 'easy',
    focus: ['arrays', 'strings', 'hashmap'],
  },
  {
    id: 'prefix-window',
    name: 'Prefix Sums & Sliding Windows',
    description: 'Range queries and contiguous-subarray patterns back-to-back.',
    difficulty: 'easy',
    focus: ['prefix-sum', 'sliding-window'],
  },
  {
    id: 'hash-heavy',
    name: 'Hashmap-Heavy Mix',
    description: 'Dedup, group-by, and count-pair problems chosen to hammer hashing.',
    difficulty: 'medium',
    focus: ['hashmap', 'counting'],
  },
  {
    id: 'sorting-search',
    name: 'Sorting + Binary Search',
    description: 'Comparators, insertion points, and binary-search-on-answer twists.',
    difficulty: 'medium',
    focus: ['binary-search', 'sorting'],
  },
  {
    id: 'greedy-interval',
    name: 'Greedy · Intervals & Schedules',
    description: 'Meeting rooms, activity selection, burst-balloon-style greedy proofs.',
    difficulty: 'medium',
    focus: ['greedy', 'intervals'],
  },
  {
    id: 'graph-traversal',
    name: 'Graph Traversal Drill',
    description: 'BFS, DFS, and grid-as-implicit-graph. One Dijkstra warm-up.',
    difficulty: 'medium',
    focus: ['bfs', 'dfs', 'graph'],
  },
  {
    id: 'stack-queue',
    name: 'Stack / Queue Patterns',
    description: 'Monotonic stacks, balanced-paren variants, and queue-based flows.',
    difficulty: 'medium',
    focus: ['stack', 'queue'],
  },
  {
    id: 'dp-1d',
    name: 'DP · 1D Classics',
    description: 'Climbing stairs, house-robber, LIS, word-break, coin-change.',
    difficulty: 'hard',
    focus: ['dp', 'recursion'],
  },
  {
    id: 'banking-day',
    name: 'Capital One · Banking Flavor',
    description: 'Ledger rollups, fraud clustering, running-balance queries.',
    difficulty: 'hard',
    focus: ['banking', 'prefix-sum', 'graph'],
  },
  {
    id: 'boss-mix',
    name: 'Boss Mix · Full Difficulty',
    description: 'One easy, one medium, two hard. Interview-day realism.',
    difficulty: 'hard',
    focus: ['mixed', 'timed'],
  },
]

export const POWER_DAY_SCENARIOS: MockScenario[] = [
  {
    id: 'vanilla-loop',
    name: 'Vanilla Power Day',
    description: '2× coding + 1 behavioral + 1 business case. Balanced baseline.',
    difficulty: 'medium',
    focus: ['coding', 'behavioral', 'case'],
  },
  {
    id: 'first-attempt',
    name: 'First Attempt · Gentle',
    description: 'Easier code rounds and friendlier interviewer personas.',
    difficulty: 'easy',
    focus: ['behavioral', 'warmup'],
  },
  {
    id: 'behavioral-heavy',
    name: 'Behavioral-Heavy',
    description: 'Behavioral round emphasizes Excellence + DTRT pet-peeves.',
    difficulty: 'medium',
    focus: ['behavioral', 'values'],
  },
  {
    id: 'case-heavy',
    name: 'Case-Heavy',
    description: 'Business case round biased toward unit economics + frameworks.',
    difficulty: 'hard',
    focus: ['case', 'quant'],
  },
  {
    id: 'sysdesign-banking',
    name: 'System Design · Banking',
    description: 'Round 2 locked to sys-design: card auth, fraud alerting, statements.',
    difficulty: 'hard',
    focus: ['sys-design', 'banking'],
  },
  {
    id: 'coding-focused',
    name: 'Coding-Focused',
    description: 'Both code rounds at medium-to-hard difficulty. Low chat weight.',
    difficulty: 'hard',
    focus: ['coding', 'algorithms'],
  },
  {
    id: 'values-probe',
    name: 'Values Probe',
    description: 'Behavioral + case interviewers poke at Succeed-Together and DTRT.',
    difficulty: 'medium',
    focus: ['behavioral', 'values'],
  },
  {
    id: 'tight-timing',
    name: 'Tight Timing',
    description: 'Same content, but the implicit per-round pacing is strict.',
    difficulty: 'hard',
    focus: ['timed', 'pacing'],
  },
  {
    id: 'recovery-mode',
    name: 'Recovery Mode',
    description: 'Deliberate curveball round 1 to practice resetting after a stumble.',
    difficulty: 'hard',
    focus: ['resilience', 'mixed'],
  },
  {
    id: 'boss-loop',
    name: 'Boss Loop · Interview Day',
    description: 'Maximum realism. Hard coding, deep behavioral, ambiguous case.',
    difficulty: 'hard',
    focus: ['mixed', 'realism'],
  },
]
