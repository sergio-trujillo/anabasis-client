type PatternStatus = 'complete' | 'active' | 'pending' | 'locked'

type I18nString = { en: string; es: string }

interface SidebarPatternRaw {
  slug: string
  title: I18nString
  status: PatternStatus
}

interface SidebarLevelRaw {
  level: number
  name: I18nString
  icon: string
  patterns: SidebarPatternRaw[]
}

interface TrackSidebarDataRaw {
  levels: SidebarLevelRaw[]
  total: number
  solved: number
}

// Resolved types (flat strings for components)
export interface SidebarPattern {
  slug: string
  title: string
  status: PatternStatus
}

export interface SidebarLevel {
  level: number
  name: string
  icon: string
  patterns: SidebarPattern[]
}

export interface TrackSidebarData {
  levels: SidebarLevel[]
  total: number
  solved: number
}

function t(s: I18nString): I18nString { return s }

const rawData: Record<string, TrackSidebarDataRaw> = {
  // ── Java Language ──────────────────────────────────────
  'java-language': {
    total: 50,
    solved: 0,
    levels: [
      {
        level: 1,
        name: t({ en: 'Syntax Basics', es: 'Fundamentos de Sintaxis' }),
        icon: 'book-open',
        patterns: [
          { slug: 'variables-types', title: t({ en: 'Variables & Types', es: 'Variables y Tipos' }), status: 'pending' },
          { slug: 'control-flow', title: t({ en: 'Control Flow', es: 'Flujo de Control' }), status: 'pending' },
          { slug: 'methods', title: t({ en: 'Methods', es: 'Métodos' }), status: 'pending' },
          { slug: 'arrays-strings', title: t({ en: 'Arrays & Strings', es: 'Arrays y Strings' }), status: 'pending' },
        ],
      },
      {
        level: 2,
        name: t({ en: 'Object-Oriented', es: 'Orientado a Objetos' }),
        icon: 'boxes',
        patterns: [
          { slug: 'classes-objects', title: t({ en: 'Classes & Objects', es: 'Clases y Objetos' }), status: 'pending' },
          { slug: 'inheritance', title: t({ en: 'Inheritance & Polymorphism', es: 'Herencia y Polimorfismo' }), status: 'pending' },
          { slug: 'interfaces-abstract', title: t({ en: 'Interfaces & Abstract Classes', es: 'Interfaces y Clases Abstractas' }), status: 'pending' },
          { slug: 'encapsulation', title: t({ en: 'Encapsulation & Access', es: 'Encapsulamiento y Acceso' }), status: 'pending' },
        ],
      },
      {
        level: 3,
        name: t({ en: 'Collections & Generics', es: 'Colecciones y Genéricos' }),
        icon: 'layers',
        patterns: [
          { slug: 'collections-framework', title: t({ en: 'Collections Framework', es: 'Framework de Colecciones' }), status: 'pending' },
          { slug: 'generics', title: t({ en: 'Generics', es: 'Genéricos' }), status: 'pending' },
          { slug: 'iterators-comparable', title: t({ en: 'Iterators & Comparable', es: 'Iteradores y Comparable' }), status: 'pending' },
        ],
      },
      {
        level: 4,
        name: t({ en: 'Modern Java', es: 'Java Moderno' }),
        icon: 'sparkles',
        patterns: [
          { slug: 'lambdas', title: t({ en: 'Lambdas & Functional Interfaces', es: 'Lambdas e Interfaces Funcionales' }), status: 'pending' },
          { slug: 'streams', title: t({ en: 'Streams API', es: 'API de Streams' }), status: 'pending' },
          { slug: 'optionals', title: t({ en: 'Optionals & Records', es: 'Optionals y Records' }), status: 'pending' },
          { slug: 'exceptions', title: t({ en: 'Exception Handling', es: 'Manejo de Excepciones' }), status: 'pending' },
        ],
      },
    ],
  },

  // ── Data Structures ────────────────────────────────────
  'data-structures': {
    total: 40,
    solved: 0,
    levels: [
      {
        level: 1,
        name: t({ en: 'Linear Structures', es: 'Estructuras Lineales' }),
        icon: 'rows-3',
        patterns: [
          { slug: 'arrays', title: t({ en: 'Arrays & ArrayList', es: 'Arrays y ArrayList' }), status: 'pending' },
          { slug: 'linked-lists', title: t({ en: 'Linked Lists', es: 'Listas Enlazadas' }), status: 'pending' },
          { slug: 'stacks', title: t({ en: 'Stacks', es: 'Pilas' }), status: 'pending' },
          { slug: 'queues', title: t({ en: 'Queues & Deques', es: 'Colas y Deques' }), status: 'pending' },
        ],
      },
      {
        level: 2,
        name: t({ en: 'Hash-Based', es: 'Basadas en Hash' }),
        icon: 'hash',
        patterns: [
          { slug: 'hash-maps', title: t({ en: 'HashMap & HashSet', es: 'HashMap y HashSet' }), status: 'pending' },
          { slug: 'tree-maps', title: t({ en: 'TreeMap & TreeSet', es: 'TreeMap y TreeSet' }), status: 'pending' },
        ],
      },
      {
        level: 3,
        name: t({ en: 'Trees', es: 'Árboles' }),
        icon: 'git-fork',
        patterns: [
          { slug: 'binary-trees', title: t({ en: 'Binary Trees', es: 'Árboles Binarios' }), status: 'pending' },
          { slug: 'bst', title: t({ en: 'Binary Search Trees', es: 'Árboles Binarios de Búsqueda' }), status: 'pending' },
          { slug: 'heaps', title: t({ en: 'Heaps & Priority Queues', es: 'Heaps y Colas de Prioridad' }), status: 'pending' },
          { slug: 'tries', title: t({ en: 'Tries', es: 'Tries' }), status: 'pending' },
        ],
      },
      {
        level: 4,
        name: t({ en: 'Graphs', es: 'Grafos' }),
        icon: 'waypoints',
        patterns: [
          { slug: 'graph-representation', title: t({ en: 'Graph Representation', es: 'Representación de Grafos' }), status: 'pending' },
          { slug: 'graph-traversal', title: t({ en: 'BFS & DFS', es: 'BFS y DFS' }), status: 'pending' },
          { slug: 'weighted-graphs', title: t({ en: 'Weighted Graphs', es: 'Grafos con Pesos' }), status: 'pending' },
        ],
      },
    ],
  },

  // ── Standard Library ───────────────────────────────────
  'standard-library': {
    total: 24,
    solved: 0,
    levels: [
      {
        level: 1,
        name: t({ en: 'String Internals', es: 'Internos de String' }),
        icon: 'type',
        patterns: [
          { slug: 'charAt-length', title: t({ en: 'charAt & length', es: 'charAt y length' }), status: 'pending' },
          { slug: 'indexOf-lastIndexOf', title: t({ en: 'indexOf & lastIndexOf', es: 'indexOf y lastIndexOf' }), status: 'pending' },
          { slug: 'substring', title: t({ en: 'substring', es: 'substring' }), status: 'pending' },
          { slug: 'contains-startsWith', title: t({ en: 'contains / startsWith / endsWith', es: 'contains / startsWith / endsWith' }), status: 'pending' },
          { slug: 'trim-strip-replace', title: t({ en: 'trim / strip / replace', es: 'trim / strip / replace' }), status: 'pending' },
          { slug: 'split-join', title: t({ en: 'split & join', es: 'split y join' }), status: 'pending' },
          { slug: 'compareTo-equals', title: t({ en: 'compareTo & equals', es: 'compareTo y equals' }), status: 'pending' },
          { slug: 'toCharArray-valueOf', title: t({ en: 'toCharArray / valueOf / format', es: 'toCharArray / valueOf / format' }), status: 'pending' },
        ],
      },
      {
        level: 2,
        name: t({ en: 'Math Internals', es: 'Internos de Math' }),
        icon: 'calculator',
        patterns: [
          { slug: 'abs-min-max', title: t({ en: 'abs / min / max / signum', es: 'abs / min / max / signum' }), status: 'pending' },
          { slug: 'pow-sqrt', title: t({ en: 'pow & sqrt', es: 'pow y sqrt' }), status: 'pending' },
          { slug: 'floor-ceil-round', title: t({ en: 'floor / ceil / round', es: 'floor / ceil / round' }), status: 'pending' },
          { slug: 'parseInt-toString', title: t({ en: 'parseInt & toString', es: 'parseInt y toString' }), status: 'pending' },
          { slug: 'random', title: t({ en: 'random & Fisher-Yates', es: 'random y Fisher-Yates' }), status: 'pending' },
        ],
      },
      {
        level: 3,
        name: t({ en: 'Array & List Internals', es: 'Internos de Array y List' }),
        icon: 'list',
        patterns: [
          { slug: 'arraylist-add-remove', title: t({ en: 'ArrayList add / remove / get', es: 'ArrayList add / remove / get' }), status: 'pending' },
          { slug: 'arraylist-search-sort', title: t({ en: 'ArrayList contains / indexOf / sort', es: 'ArrayList contains / indexOf / sort' }), status: 'pending' },
          { slug: 'arrays-sort', title: t({ en: 'Arrays.sort — Dual-Pivot Quicksort', es: 'Arrays.sort — Quicksort Dual-Pivot' }), status: 'pending' },
          { slug: 'arrays-binarySearch', title: t({ en: 'Arrays.binarySearch', es: 'Arrays.binarySearch' }), status: 'pending' },
          { slug: 'arrays-copyOf-fill', title: t({ en: 'Arrays.copyOf / fill / equals', es: 'Arrays.copyOf / fill / equals' }), status: 'pending' },
        ],
      },
      {
        level: 4,
        name: t({ en: 'Map & Set Internals', es: 'Internos de Map y Set' }),
        icon: 'hash',
        patterns: [
          { slug: 'hashmap-put-get', title: t({ en: 'HashMap put & get', es: 'HashMap put y get' }), status: 'pending' },
          { slug: 'hashmap-resize', title: t({ en: 'HashMap resize & rehash', es: 'HashMap resize y rehash' }), status: 'pending' },
          { slug: 'hashmap-collision', title: t({ en: 'HashMap collision handling', es: 'HashMap manejo de colisiones' }), status: 'pending' },
          { slug: 'hashset-internals', title: t({ en: 'HashSet internals', es: 'Internos de HashSet' }), status: 'pending' },
          { slug: 'treemap-treeset', title: t({ en: 'TreeMap & TreeSet', es: 'TreeMap y TreeSet' }), status: 'pending' },
          { slug: 'linkedhashmap', title: t({ en: 'LinkedHashMap & LinkedHashSet', es: 'LinkedHashMap y LinkedHashSet' }), status: 'pending' },
        ],
      },
    ],
  },

  // ── Java Tricky Syntax ─────────────────────────────────
  'java-tricky-syntax': {
    total: 23,
    solved: 0,
    levels: [
      {
        level: 1,
        name: t({ en: 'Types & Comparisons', es: 'Tipos y Comparaciones' }),
        icon: 'scale',
        patterns: [
          { slug: 'equality-traps', title: t({ en: '== vs .equals()', es: '== vs .equals()' }), status: 'pending' },
          { slug: 'autoboxing-unboxing', title: t({ en: 'Autoboxing / Unboxing', es: 'Autoboxing / Unboxing' }), status: 'pending' },
          { slug: 'casting-overflow', title: t({ en: 'Casting & Overflow', es: 'Casting y Overflow' }), status: 'pending' },
          { slug: 'char-arithmetic', title: t({ en: 'char Arithmetic', es: 'Aritmética de char' }), status: 'pending' },
          { slug: 'null-gotchas', title: t({ en: 'Null Gotchas', es: 'Trampas de Null' }), status: 'pending' },
        ],
      },
      {
        level: 2,
        name: t({ en: 'Collections Tricky', es: 'Trampas de Colecciones' }),
        icon: 'layers',
        patterns: [
          { slug: 'array-of-collections', title: t({ en: 'Arrays of Collections', es: 'Arrays de Colecciones' }), status: 'pending' },
          { slug: 'map-tricks', title: t({ en: 'Map Tricks', es: 'Trucos de Map' }), status: 'pending' },
          { slug: 'deque-stack-queue', title: t({ en: 'Deque as Stack & Queue', es: 'Deque como Pila y Cola' }), status: 'pending' },
          { slug: 'priorityqueue-tricky', title: t({ en: 'PriorityQueue Tricky', es: 'PriorityQueue Trampas' }), status: 'pending' },
          { slug: 'list-of-vs-aslist', title: t({ en: 'List.of() vs Arrays.asList()', es: 'List.of() vs Arrays.asList()' }), status: 'pending' },
        ],
      },
      {
        level: 3,
        name: t({ en: 'Strings & Arrays Tricky', es: 'Trampas de Strings y Arrays' }),
        icon: 'text-cursor',
        patterns: [
          { slug: 'string-method-traps', title: t({ en: 'String Method Traps', es: 'Trampas de Métodos de String' }), status: 'pending' },
          { slug: 'arrays-utility-traps', title: t({ en: 'Arrays Utility Traps', es: 'Trampas de Arrays Utility' }), status: 'pending' },
          { slug: 'collections-utility-traps', title: t({ en: 'Collections Utility Traps', es: 'Trampas de Collections Utility' }), status: 'pending' },
          { slug: 'matrices-traps', title: t({ en: '2D Array Traps', es: 'Trampas de Arrays 2D' }), status: 'pending' },
          { slug: 'type-conversions', title: t({ en: 'Type Conversions', es: 'Conversiones de Tipo' }), status: 'pending' },
          { slug: 'character-methods', title: t({ en: 'Character Methods', es: 'Métodos de Character' }), status: 'pending' },
        ],
      },
      {
        level: 4,
        name: t({ en: 'Control Flow & Syntax', es: 'Control de Flujo y Sintaxis' }),
        icon: 'terminal',
        patterns: [
          { slug: 'enhanced-for-traps', title: t({ en: 'Enhanced For Traps', es: 'Trampas del For Mejorado' }), status: 'pending' },
          { slug: 'lambda-comparator-traps', title: t({ en: 'Lambda & Comparator Traps', es: 'Trampas de Lambda y Comparator' }), status: 'pending' },
          { slug: 'var-records-modern', title: t({ en: 'var, Records & Modern Java', es: 'var, Records y Java Moderno' }), status: 'pending' },
          { slug: 'bit-manipulation', title: t({ en: 'Bit Manipulation Tricks', es: 'Trucos de Manipulación de Bits' }), status: 'pending' },
          { slug: 'numeric-tricks', title: t({ en: 'Numeric Tricks', es: 'Trucos Numéricos' }), status: 'pending' },
          { slug: 'multiple-return-values', title: t({ en: 'Multiple Return Values', es: 'Valores de Retorno Múltiples' }), status: 'pending' },
          { slug: 'labeled-break-ternary', title: t({ en: 'Labeled Break & Ternary', es: 'Break con Label y Ternario' }), status: 'pending' },
        ],
      },
    ],
  },

  // ── Big O Notation ─────────────────────────────────────
  'big-o': {
    total: 24,
    solved: 0,
    levels: [
      {
        level: 1,
        name: t({ en: 'First Steps', es: 'Primeros Pasos' }),
        icon: 'footprints',
        patterns: [
          { slug: 'fundamentals', title: t({ en: 'What is Big O?', es: '¿Qué es Big O?' }), status: 'pending' },
          { slug: 'constant-linear', title: t({ en: 'O(1) and O(n)', es: 'O(1) y O(n)' }), status: 'pending' },
          { slug: 'quadratic', title: t({ en: 'O(n²) and Nested Loops', es: 'O(n²) y Ciclos Anidados' }), status: 'pending' },
        ],
      },
      {
        level: 2,
        name: t({ en: 'Growth Curves', es: 'Curvas de Crecimiento' }),
        icon: 'trending-up',
        patterns: [
          { slug: 'logarithmic', title: t({ en: 'O(log n) — Halving', es: 'O(log n) — División' }), status: 'pending' },
          { slug: 'linearithmic', title: t({ en: 'O(n log n) — Sorting', es: 'O(n log n) — Ordenamiento' }), status: 'pending' },
          { slug: 'exponential', title: t({ en: 'O(2ⁿ) and O(n!)', es: 'O(2ⁿ) y O(n!)' }), status: 'pending' },
        ],
      },
      {
        level: 3,
        name: t({ en: 'Memory & Recursion', es: 'Memoria y Recursión' }),
        icon: 'cpu',
        patterns: [
          { slug: 'space-complexity', title: t({ en: 'Space Complexity', es: 'Complejidad Espacial' }), status: 'pending' },
          { slug: 'recursive-analysis', title: t({ en: 'Analyzing Recursion', es: 'Análisis de Recursión' }), status: 'pending' },
          { slug: 'amortized', title: t({ en: 'Amortized Analysis', es: 'Análisis Amortizado' }), status: 'pending' },
        ],
      },
      {
        level: 4,
        name: t({ en: 'Apply & Optimize', es: 'Aplicar y Optimizar' }),
        icon: 'target',
        patterns: [
          { slug: 'best-worst-average', title: t({ en: 'Best / Worst / Average', es: 'Mejor / Peor / Promedio' }), status: 'pending' },
          { slug: 'identify-complexity', title: t({ en: 'Identify the Complexity', es: 'Identificar Complejidad' }), status: 'pending' },
          { slug: 'optimize', title: t({ en: 'Optimize: Reduce Big O', es: 'Optimizar: Reducir Big O' }), status: 'pending' },
        ],
      },
    ],
  },

  // ── Functional Programming ─────────────────────────────
  'functional-programming': {
    total: 13,
    solved: 0,
    levels: [
      {
        level: 1,
        name: t({ en: 'Foundations', es: 'Fundamentos' }),
        icon: 'function-square',
        patterns: [
          { slug: 'lambda-expressions', title: t({ en: 'Lambda Expressions', es: 'Expresiones Lambda' }), status: 'pending' },
          { slug: 'functional-interfaces', title: t({ en: 'Functional Interfaces', es: 'Interfaces Funcionales' }), status: 'pending' },
          { slug: 'method-references', title: t({ en: 'Method References', es: 'Referencias a Métodos' }), status: 'pending' },
          { slug: 'function-composition', title: t({ en: 'Function Composition', es: 'Composición de Funciones' }), status: 'pending' },
        ],
      },
      {
        level: 2,
        name: t({ en: 'Streams', es: 'Streams' }),
        icon: 'waves',
        patterns: [
          { slug: 'stream-creation', title: t({ en: 'Creating Streams', es: 'Crear Streams' }), status: 'pending' },
          { slug: 'intermediate-operations', title: t({ en: 'Intermediate Operations', es: 'Operaciones Intermedias' }), status: 'pending' },
          { slug: 'terminal-operations', title: t({ en: 'Terminal Operations', es: 'Operaciones Terminales' }), status: 'pending' },
          { slug: 'collectors', title: t({ en: 'Collectors', es: 'Collectors' }), status: 'pending' },
        ],
      },
      {
        level: 3,
        name: t({ en: 'Advanced FP', es: 'FP Avanzada' }),
        icon: 'sparkles',
        patterns: [
          { slug: 'optional-deep-dive', title: t({ en: 'Optional Deep Dive', es: 'Optional a Fondo' }), status: 'pending' },
          { slug: 'primitive-streams', title: t({ en: 'Primitive Streams', es: 'Streams Primitivos' }), status: 'pending' },
          { slug: 'parallel-streams', title: t({ en: 'Parallel Streams', es: 'Streams Paralelos' }), status: 'pending' },
          { slug: 'functional-patterns', title: t({ en: 'Functional Patterns', es: 'Patrones Funcionales' }), status: 'pending' },
          { slug: 'comparator-functional', title: t({ en: 'Functional Comparators', es: 'Comparadores Funcionales' }), status: 'pending' },
        ],
      },
    ],
  },

  // ── Clean Code & Refactoring ────────────────────────────
  'clean-code': {
    total: 22,
    solved: 0,
    levels: [
      {
        level: 1,
        name: t({ en: 'Readability', es: 'Legibilidad' }),
        icon: 'eye',
        patterns: [
          { slug: 'naming', title: t({ en: 'Naming — The Art of Naming', es: 'Naming — El Arte de Nombrar' }), status: 'pending' },
          { slug: 'functions', title: t({ en: 'Functions — Small & Purposeful', es: 'Funciones — Pequeñas y con Propósito' }), status: 'pending' },
          { slug: 'comments', title: t({ en: 'Comments — When Yes and When No', es: 'Comentarios — Cuándo Sí y Cuándo No' }), status: 'pending' },
          { slug: 'formatting', title: t({ en: 'Formatting & Code Organization', es: 'Formateo y Organización de Código' }), status: 'pending' },
          { slug: 'magic-numbers', title: t({ en: 'Magic Numbers & Constants', es: 'Números Mágicos y Constantes' }), status: 'pending' },
        ],
      },
      {
        level: 2,
        name: t({ en: 'Structure', es: 'Estructura' }),
        icon: 'blocks',
        patterns: [
          { slug: 'single-responsibility', title: t({ en: 'Single Responsibility Principle', es: 'Principio de Responsabilidad Única' }), status: 'pending' },
          { slug: 'dry-vs-premature', title: t({ en: 'DRY vs Premature Abstraction', es: 'DRY vs Abstracción Prematura' }), status: 'pending' },
          { slug: 'encapsulation-hiding', title: t({ en: 'Encapsulation & Information Hiding', es: 'Encapsulamiento y Ocultamiento' }), status: 'pending' },
          { slug: 'error-handling', title: t({ en: 'Error Handling — Clean Errors', es: 'Manejo de Errores — Errores Limpios' }), status: 'pending' },
          { slug: 'immutability-side-effects', title: t({ en: 'Immutability & Side Effects', es: 'Inmutabilidad y Efectos Secundarios' }), status: 'pending' },
        ],
      },
      {
        level: 3,
        name: t({ en: 'Code Smells & Refactoring', es: 'Code Smells y Refactoring' }),
        icon: 'bug',
        patterns: [
          { slug: 'extract-method', title: t({ en: 'Long Method → Extract Method', es: 'Método Largo → Extraer Método' }), status: 'pending' },
          { slug: 'replace-conditional-polymorphism', title: t({ en: 'Replace Conditional with Polymorphism', es: 'Reemplazar Condicional con Polimorfismo' }), status: 'pending' },
          { slug: 'feature-envy', title: t({ en: 'Feature Envy & Misplaced Responsibility', es: 'Feature Envy y Responsabilidad Mal Ubicada' }), status: 'pending' },
          { slug: 'primitive-obsession', title: t({ en: 'Primitive Obsession → Value Objects', es: 'Obsesión por Primitivos → Value Objects' }), status: 'pending' },
          { slug: 'data-clumps', title: t({ en: 'Data Clumps & Parameter Objects', es: 'Data Clumps y Objetos Parámetro' }), status: 'pending' },
        ],
      },
      {
        level: 4,
        name: t({ en: 'Design Patterns for Clean Code', es: 'Patrones de Diseño para Código Limpio' }),
        icon: 'sparkles',
        patterns: [
          { slug: 'strategy-pattern', title: t({ en: 'Strategy Pattern', es: 'Patrón Strategy' }), status: 'pending' },
          { slug: 'template-method-pattern', title: t({ en: 'Template Method', es: 'Template Method' }), status: 'pending' },
          { slug: 'decorator-composition', title: t({ en: 'Decorator & Composition', es: 'Decorator y Composición' }), status: 'pending' },
          { slug: 'dependency-injection', title: t({ en: 'Dependency Injection', es: 'Inyección de Dependencias' }), status: 'pending' },
        ],
      },
      {
        level: 5,
        name: t({ en: 'Judgment', es: 'Criterio' }),
        icon: 'scale',
        patterns: [
          { slug: 'yagni', title: t({ en: 'YAGNI — You Ain\'t Gonna Need It', es: 'YAGNI — No Lo Vas a Necesitar' }), status: 'pending' },
          { slug: 'legacy-code', title: t({ en: 'Working with Legacy Code', es: 'Trabajar con Código Legacy' }), status: 'pending' },
          { slug: 'trade-offs', title: t({ en: 'Trade-offs — No Perfect Solution', es: 'Trade-offs — No Hay Solución Perfecta' }), status: 'pending' },
        ],
      },
    ],
  },

  // ── Java Patterns ──────────────────────────────────────
  'java-patterns': {
    total: 95,
    solved: 2,
    levels: [
      {
        level: 1,
        name: t({ en: 'Array Essentials', es: 'Fundamentos de Arrays' }),
        icon: 'rows-3',
        patterns: [
          { slug: 'prefix-sum', title: t({ en: 'Prefix Sum', es: 'Suma de Prefijos' }), status: 'complete' },
          { slug: 'two-pointers', title: t({ en: 'Two Pointers', es: 'Dos Punteros' }), status: 'active' },
          { slug: 'sliding-window', title: t({ en: 'Sliding Window', es: 'Ventana Deslizante' }), status: 'pending' },
          { slug: 'fast-slow-pointers', title: t({ en: 'Fast & Slow Pointers', es: 'Punteros Rápido y Lento' }), status: 'pending' },
        ],
      },
      {
        level: 2,
        name: t({ en: 'Stacks, Lists & Intervals', es: 'Pilas, Listas e Intervalos' }),
        icon: 'layers',
        patterns: [
          { slug: 'linked-list-reversal', title: t({ en: 'Linked List Reversal', es: 'Invertir Lista Enlazada' }), status: 'pending' },
          { slug: 'monotonic-stack', title: t({ en: 'Monotonic Stack', es: 'Pila Monótona' }), status: 'pending' },
          { slug: 'cyclic-sort', title: t({ en: 'Cyclic Sort', es: 'Ordenamiento Cíclico' }), status: 'pending' },
          { slug: 'overlapping-intervals', title: t({ en: 'Overlapping Intervals', es: 'Intervalos Superpuestos' }), status: 'pending' },
        ],
      },
      {
        level: 3,
        name: t({ en: 'Search & Selection', es: 'Búsqueda y Selección' }),
        icon: 'search',
        patterns: [
          { slug: 'modified-binary-search', title: t({ en: 'Modified Binary Search', es: 'Búsqueda Binaria Modificada' }), status: 'pending' },
          { slug: 'top-k-elements', title: t({ en: 'Top K Elements', es: 'Top K Elementos' }), status: 'pending' },
          { slug: 'two-heaps', title: t({ en: 'Two Heaps', es: 'Dos Heaps' }), status: 'pending' },
          { slug: 'k-way-merge', title: t({ en: 'K-Way Merge', es: 'Merge de K Vías' }), status: 'pending' },
        ],
      },
      {
        level: 4,
        name: t({ en: 'Tree Patterns', es: 'Patrones de Árboles' }),
        icon: 'git-fork',
        patterns: [
          { slug: 'binary-tree-traversal', title: t({ en: 'Binary Tree Traversal', es: 'Recorrido de Árbol Binario' }), status: 'pending' },
          { slug: 'tree-dfs', title: t({ en: 'Tree DFS', es: 'DFS en Árboles' }), status: 'pending' },
          { slug: 'tree-bfs', title: t({ en: 'Tree BFS', es: 'BFS en Árboles' }), status: 'pending' },
        ],
      },
      {
        level: 5,
        name: t({ en: 'Graphs & Matrices', es: 'Grafos y Matrices' }),
        icon: 'waypoints',
        patterns: [
          { slug: 'matrix-traversal', title: t({ en: 'Matrix Traversal', es: 'Recorrido de Matrices' }), status: 'pending' },
          { slug: 'island-pattern', title: t({ en: 'Island Pattern', es: 'Patrón de Islas' }), status: 'pending' },
          { slug: 'topological-sort', title: t({ en: 'Topological Sort', es: 'Orden Topológico' }), status: 'pending' },
        ],
      },
      {
        level: 6,
        name: t({ en: 'Combinatorics & Bits', es: 'Combinatoria y Bits' }),
        icon: 'shuffle',
        patterns: [
          { slug: 'subsets', title: t({ en: 'Subsets', es: 'Subconjuntos' }), status: 'pending' },
          { slug: 'backtracking', title: t({ en: 'Backtracking', es: 'Backtracking' }), status: 'pending' },
          { slug: 'bitwise-xor', title: t({ en: 'Bitwise XOR', es: 'XOR a Nivel de Bits' }), status: 'pending' },
        ],
      },
      {
        level: 7,
        name: t({ en: 'Dynamic Programming', es: 'Programación Dinámica' }),
        icon: 'trophy',
        patterns: [
          { slug: 'dynamic-programming', title: t({ en: 'Dynamic Programming', es: 'Programación Dinámica' }), status: 'pending' },
          { slug: 'knapsack-01', title: t({ en: '0/1 Knapsack', es: 'Mochila 0/1' }), status: 'pending' },
        ],
      },
    ],
  },

  // ── Algorithms ─────────────────────────────────────────
  algorithms: {
    total: 40,
    solved: 0,
    levels: [
      {
        level: 1,
        name: t({ en: 'Sorting & Searching', es: 'Ordenamiento y Búsqueda' }),
        icon: 'arrow-up-down',
        patterns: [
          { slug: 'sorting', title: t({ en: 'Sorting Algorithms', es: 'Algoritmos de Ordenamiento' }), status: 'pending' },
          { slug: 'searching', title: t({ en: 'Searching Algorithms', es: 'Algoritmos de Búsqueda' }), status: 'pending' },
          { slug: 'recursion', title: t({ en: 'Recursion & Call Stack', es: 'Recursión y Pila de Llamadas' }), status: 'pending' },
        ],
      },
      {
        level: 2,
        name: t({ en: 'Strategy Patterns', es: 'Patrones de Estrategia' }),
        icon: 'sword',
        patterns: [
          { slug: 'divide-conquer', title: t({ en: 'Divide & Conquer', es: 'Dividir y Conquistar' }), status: 'pending' },
          { slug: 'greedy', title: t({ en: 'Greedy Algorithms', es: 'Algoritmos Voraces' }), status: 'pending' },
        ],
      },
      {
        level: 3,
        name: t({ en: 'Graph Traversal', es: 'Recorrido de Grafos' }),
        icon: 'waypoints',
        patterns: [
          { slug: 'graph', title: t({ en: 'Graph Fundamentals', es: 'Fundamentos de Grafos' }), status: 'pending' },
          { slug: 'shortest-path', title: t({ en: 'Shortest Path (Dijkstra)', es: 'Camino Más Corto (Dijkstra)' }), status: 'pending' },
          { slug: 'minimum-spanning', title: t({ en: 'Minimum Spanning Tree', es: 'Árbol de Expansión Mínima' }), status: 'pending' },
        ],
      },
      {
        level: 4,
        name: t({ en: 'Advanced Techniques', es: 'Técnicas Avanzadas' }),
        icon: 'brain',
        patterns: [
          { slug: 'dynamic-prog', title: t({ en: 'Dynamic Programming', es: 'Programación Dinámica' }), status: 'pending' },
          { slug: 'string-algorithms', title: t({ en: 'String Algorithms', es: 'Algoritmos de Cadenas' }), status: 'pending' },
        ],
      },
    ],
  },

  // ── Concurrency ────────────────────────────────────────
  concurrency: {
    total: 15,
    solved: 0,
    levels: [
      {
        level: 1,
        name: t({ en: 'Thread Basics', es: 'Fundamentos de Threads' }),
        icon: 'cable',
        patterns: [
          { slug: 'thread-creation', title: t({ en: 'Creating Threads', es: 'Crear Threads' }), status: 'pending' },
          { slug: 'thread-coordination', title: t({ en: 'Thread Coordination', es: 'Coordinación de Threads' }), status: 'pending' },
          { slug: 'shared-state-problems', title: t({ en: 'Shared State Problems', es: 'Problemas de Estado Compartido' }), status: 'pending' },
        ],
      },
      {
        level: 2,
        name: t({ en: 'Synchronization', es: 'Sincronización' }),
        icon: 'lock',
        patterns: [
          { slug: 'synchronized-keyword', title: t({ en: 'synchronized', es: 'synchronized' }), status: 'pending' },
          { slug: 'volatile-keyword', title: t({ en: 'volatile', es: 'volatile' }), status: 'pending' },
          { slug: 'wait-notify', title: t({ en: 'wait / notify / notifyAll', es: 'wait / notify / notifyAll' }), status: 'pending' },
          { slug: 'deadlocks', title: t({ en: 'Deadlocks', es: 'Deadlocks' }), status: 'pending' },
        ],
      },
      {
        level: 3,
        name: t({ en: 'java.util.concurrent', es: 'java.util.concurrent' }),
        icon: 'blocks',
        patterns: [
          { slug: 'locks', title: t({ en: 'Locks', es: 'Locks' }), status: 'pending' },
          { slug: 'atomic-variables', title: t({ en: 'Atomic Variables', es: 'Variables Atómicas' }), status: 'pending' },
          { slug: 'concurrent-collections', title: t({ en: 'Concurrent Collections', es: 'Colecciones Concurrentes' }), status: 'pending' },
          { slug: 'synchronizers', title: t({ en: 'Synchronizers', es: 'Sincronizadores' }), status: 'pending' },
        ],
      },
      {
        level: 4,
        name: t({ en: 'Executors & Async', es: 'Executors y Async' }),
        icon: 'zap',
        patterns: [
          { slug: 'thread-pools', title: t({ en: 'Thread Pools', es: 'Pools de Threads' }), status: 'pending' },
          { slug: 'future-callable', title: t({ en: 'Future & Callable', es: 'Future y Callable' }), status: 'pending' },
          { slug: 'completable-future', title: t({ en: 'CompletableFuture', es: 'CompletableFuture' }), status: 'pending' },
          { slug: 'classic-problems', title: t({ en: 'Classic Concurrency Problems', es: 'Problemas Clásicos de Concurrencia' }), status: 'pending' },
        ],
      },
    ],
  },

  // ── Classic AI ─────────────────────────────────────────
  'classic-ai': {
    total: 21,
    solved: 0,
    levels: [
      {
        level: 1,
        name: t({ en: 'Uninformed Search', es: 'Búsqueda No Informada' }),
        icon: 'search',
        patterns: [
          { slug: 'intelligent-agents', title: t({ en: 'Intelligent Agents', es: 'Agentes Inteligentes' }), status: 'pending' },
          { slug: 'bfs-search', title: t({ en: 'Breadth-First Search', es: 'Búsqueda en Anchura' }), status: 'pending' },
          { slug: 'dfs-search', title: t({ en: 'Depth-First Search', es: 'Búsqueda en Profundidad' }), status: 'pending' },
          { slug: 'uniform-cost-search', title: t({ en: 'Uniform Cost Search', es: 'Búsqueda de Costo Uniforme' }), status: 'pending' },
          { slug: 'iterative-deepening', title: t({ en: 'Iterative Deepening', es: 'Profundización Iterativa' }), status: 'pending' },
          { slug: 'bidirectional-search', title: t({ en: 'Bidirectional Search', es: 'Búsqueda Bidireccional' }), status: 'pending' },
        ],
      },
      {
        level: 2,
        name: t({ en: 'Informed Search', es: 'Búsqueda Informada' }),
        icon: 'compass',
        patterns: [
          { slug: 'greedy-best-first', title: t({ en: 'Greedy Best-First Search', es: 'Búsqueda Greedy Best-First' }), status: 'pending' },
          { slug: 'a-star', title: t({ en: 'A* Search', es: 'Búsqueda A*' }), status: 'pending' },
          { slug: 'ida-star', title: t({ en: 'IDA*', es: 'IDA*' }), status: 'pending' },
          { slug: 'heuristic-design', title: t({ en: 'Heuristic Design', es: 'Diseño de Heurísticas' }), status: 'pending' },
        ],
      },
      {
        level: 3,
        name: t({ en: 'Adversarial Search', es: 'Búsqueda Adversarial' }),
        icon: 'swords',
        patterns: [
          { slug: 'minimax', title: t({ en: 'Minimax', es: 'Minimax' }), status: 'pending' },
          { slug: 'alpha-beta-pruning', title: t({ en: 'Alpha-Beta Pruning', es: 'Poda Alpha-Beta' }), status: 'pending' },
          { slug: 'evaluation-functions', title: t({ en: 'Evaluation Functions', es: 'Funciones de Evaluación' }), status: 'pending' },
          { slug: 'mcts', title: t({ en: 'Monte Carlo Tree Search', es: 'Monte Carlo Tree Search' }), status: 'pending' },
        ],
      },
      {
        level: 4,
        name: t({ en: 'Constraint Satisfaction', es: 'Satisfacción de Restricciones' }),
        icon: 'puzzle',
        patterns: [
          { slug: 'csp-formulation', title: t({ en: 'CSP Formulation', es: 'Formulación CSP' }), status: 'pending' },
          { slug: 'backtracking-csp', title: t({ en: 'Backtracking with CSP', es: 'Backtracking con CSP' }), status: 'pending' },
          { slug: 'arc-consistency', title: t({ en: 'Arc Consistency — AC-3', es: 'Consistencia de Arco — AC-3' }), status: 'pending' },
        ],
      },
      {
        level: 5,
        name: t({ en: 'Optimization', es: 'Optimización' }),
        icon: 'trending-up',
        patterns: [
          { slug: 'hill-climbing', title: t({ en: 'Hill Climbing', es: 'Hill Climbing' }), status: 'pending' },
          { slug: 'simulated-annealing', title: t({ en: 'Simulated Annealing', es: 'Recocido Simulado' }), status: 'pending' },
          { slug: 'genetic-algorithms', title: t({ en: 'Genetic Algorithms', es: 'Algoritmos Genéticos' }), status: 'pending' },
          { slug: 'probabilistic-reasoning', title: t({ en: 'Probabilistic Reasoning', es: 'Razonamiento Probabilístico' }), status: 'pending' },
        ],
      },
    ],
  },

  // ── Design Patterns ────────────────────────────────────
  'design-patterns': {
    total: 21,
    solved: 0,
    levels: [
      {
        level: 1,
        name: t({ en: 'Creational', es: 'Creacionales' }),
        icon: 'plus-circle',
        patterns: [
          { slug: 'singleton', title: t({ en: 'Singleton', es: 'Singleton' }), status: 'pending' },
          { slug: 'factory-method', title: t({ en: 'Factory Method', es: 'Factory Method' }), status: 'pending' },
          { slug: 'abstract-factory', title: t({ en: 'Abstract Factory', es: 'Abstract Factory' }), status: 'pending' },
          { slug: 'builder', title: t({ en: 'Builder', es: 'Builder' }), status: 'pending' },
          { slug: 'prototype', title: t({ en: 'Prototype', es: 'Prototype' }), status: 'pending' },
        ],
      },
      {
        level: 2,
        name: t({ en: 'Structural Basics', es: 'Estructurales Básicos' }),
        icon: 'building',
        patterns: [
          { slug: 'adapter', title: t({ en: 'Adapter', es: 'Adapter' }), status: 'pending' },
          { slug: 'decorator', title: t({ en: 'Decorator', es: 'Decorator' }), status: 'pending' },
          { slug: 'facade', title: t({ en: 'Facade', es: 'Facade' }), status: 'pending' },
          { slug: 'proxy', title: t({ en: 'Proxy', es: 'Proxy' }), status: 'pending' },
        ],
      },
      {
        level: 3,
        name: t({ en: 'Structural Advanced', es: 'Estructurales Avanzados' }),
        icon: 'building-2',
        patterns: [
          { slug: 'composite', title: t({ en: 'Composite', es: 'Composite' }), status: 'pending' },
          { slug: 'bridge', title: t({ en: 'Bridge', es: 'Bridge' }), status: 'pending' },
          { slug: 'flyweight', title: t({ en: 'Flyweight', es: 'Flyweight' }), status: 'pending' },
        ],
      },
      {
        level: 4,
        name: t({ en: 'Behavioral Basics', es: 'Comportamentales Básicos' }),
        icon: 'play',
        patterns: [
          { slug: 'strategy', title: t({ en: 'Strategy', es: 'Strategy' }), status: 'pending' },
          { slug: 'observer', title: t({ en: 'Observer', es: 'Observer' }), status: 'pending' },
          { slug: 'command', title: t({ en: 'Command', es: 'Command' }), status: 'pending' },
          { slug: 'template-method', title: t({ en: 'Template Method', es: 'Template Method' }), status: 'pending' },
        ],
      },
      {
        level: 5,
        name: t({ en: 'Behavioral Advanced', es: 'Comportamentales Avanzados' }),
        icon: 'activity',
        patterns: [
          { slug: 'state', title: t({ en: 'State', es: 'State' }), status: 'pending' },
          { slug: 'iterator', title: t({ en: 'Iterator', es: 'Iterator' }), status: 'pending' },
          { slug: 'chain-of-responsibility', title: t({ en: 'Chain of Responsibility', es: 'Chain of Responsibility' }), status: 'pending' },
          { slug: 'mediator', title: t({ en: 'Mediator', es: 'Mediator' }), status: 'pending' },
          { slug: 'visitor', title: t({ en: 'Visitor', es: 'Visitor' }), status: 'pending' },
        ],
      },
    ],
  },
}

/** Resolve sidebar data to the given language */
export function getTrackSidebarData(lang: 'en' | 'es'): Record<string, TrackSidebarData> {
  const resolved: Record<string, TrackSidebarData> = {}
  for (const [key, track] of Object.entries(rawData)) {
    resolved[key] = {
      total: track.total,
      solved: track.solved,
      levels: track.levels.map((level) => ({
        level: level.level,
        name: level.name[lang],
        icon: level.icon,
        patterns: level.patterns.map((p) => ({
          slug: p.slug,
          title: p.title[lang],
          status: p.status,
        })),
      })),
    }
  }
  return resolved
}

// Backwards compat — default to English
export const trackSidebarData = getTrackSidebarData('en')
