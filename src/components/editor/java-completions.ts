import type { languages, editor, IRange } from 'monaco-editor'

type Monaco = typeof import('monaco-editor')

const JAVA_KEYWORDS = [
  'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
  'class', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends',
  'final', 'finally', 'float', 'for', 'if', 'implements', 'import',
  'instanceof', 'int', 'interface', 'long', 'new', 'null', 'package',
  'private', 'protected', 'public', 'return', 'short', 'static', 'super',
  'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try',
  'void', 'volatile', 'while', 'var', 'yield', 'record', 'sealed', 'permits',
]

const JAVA_TYPES = [
  'String', 'Integer', 'Long', 'Double', 'Float', 'Boolean', 'Character',
  'Byte', 'Short', 'Object', 'Number', 'Math', 'System',
  'List', 'ArrayList', 'LinkedList',
  'Map', 'HashMap', 'TreeMap', 'LinkedHashMap',
  'Set', 'HashSet', 'TreeSet', 'LinkedHashSet',
  'Queue', 'PriorityQueue', 'Deque', 'ArrayDeque',
  'Stack', 'Vector',
  'Arrays', 'Collections',
  'Optional', 'Stream', 'Collectors',
  'StringBuilder', 'StringBuffer',
  'Comparable', 'Comparator', 'Iterator', 'Iterable',
  'Objects', 'Random',
  'IntStream', 'LongStream', 'DoubleStream',
]

interface SnippetDef {
  label: string
  insertText: string
  detail: string
}

const JAVA_SNIPPETS: SnippetDef[] = [
  { label: 'for', detail: 'for loop', insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t$0\n}' },
  { label: 'fore', detail: 'enhanced for loop', insertText: 'for (${1:Type} ${2:item} : ${3:collection}) {\n\t$0\n}' },
  { label: 'while', detail: 'while loop', insertText: 'while (${1:condition}) {\n\t$0\n}' },
  { label: 'ifelse', detail: 'if-else statement', insertText: 'if (${1:condition}) {\n\t$2\n} else {\n\t$0\n}' },
  { label: 'trycatch', detail: 'try-catch block', insertText: 'try {\n\t$1\n} catch (${2:Exception} ${3:e}) {\n\t$0\n}' },
  { label: 'sout', detail: 'System.out.println', insertText: 'System.out.println(${1});' },
  { label: 'main', detail: 'public static void main', insertText: 'public static void main(String[] args) {\n\t$0\n}' },
  { label: 'pub', detail: 'public method', insertText: 'public ${1:void} ${2:methodName}(${3}) {\n\t$0\n}' },
  { label: 'priv', detail: 'private method', insertText: 'private ${1:void} ${2:methodName}(${3}) {\n\t$0\n}' },
  { label: 'newlist', detail: 'new ArrayList<>', insertText: 'List<${1:Integer}> ${2:list} = new ArrayList<>();' },
  { label: 'newmap', detail: 'new HashMap<>', insertText: 'Map<${1:String}, ${2:Integer}> ${3:map} = new HashMap<>();' },
  { label: 'newset', detail: 'new HashSet<>', insertText: 'Set<${1:Integer}> ${2:set} = new HashSet<>();' },
  { label: 'newqueue', detail: 'new LinkedList<> (Queue)', insertText: 'Queue<${1:Integer}> ${2:queue} = new LinkedList<>();' },
  { label: 'newstack', detail: 'new ArrayDeque<> (Stack)', insertText: 'Deque<${1:Integer}> ${2:stack} = new ArrayDeque<>();' },
  { label: 'newpq', detail: 'new PriorityQueue<>', insertText: 'PriorityQueue<${1:Integer}> ${2:pq} = new PriorityQueue<>();' },
  { label: 'swap', detail: 'swap two elements', insertText: 'int ${1:temp} = ${2:arr}[${3:i}];\n${2:arr}[${3:i}] = ${2:arr}[${4:j}];\n${2:arr}[${4:j}] = ${1:temp};' },
  { label: 'twoptr', detail: 'two pointer template', insertText: 'int left = 0, right = ${1:nums}.length - 1;\nwhile (left < right) {\n\t$0\n\tleft++;\n\tright--;\n}' },
  { label: 'slidwin', detail: 'sliding window template', insertText: 'int left = 0;\nfor (int right = 0; right < ${1:nums}.length; right++) {\n\t$0\n\twhile (${2:/* shrink condition */}) {\n\t\tleft++;\n\t}\n}' },
  { label: 'binsearch', detail: 'binary search template', insertText: 'int left = 0, right = ${1:nums}.length - 1;\nwhile (left <= right) {\n\tint mid = left + (right - left) / 2;\n\tif (${1:nums}[mid] == ${2:target}) {\n\t\treturn mid;\n\t} else if (${1:nums}[mid] < ${2:target}) {\n\t\tleft = mid + 1;\n\t} else {\n\t\tright = mid - 1;\n\t}\n}\nreturn -1;' },
  // Method reference snippets (::)
  { label: 'Integer::parseInt', detail: 'method ref — parse String to int', insertText: 'Integer::parseInt' },
  { label: 'Integer::valueOf', detail: 'method ref — String to Integer', insertText: 'Integer::valueOf' },
  { label: 'Integer::compare', detail: 'method ref — compare ints', insertText: 'Integer::compare' },
  { label: 'Integer::sum', detail: 'method ref — sum two ints', insertText: 'Integer::sum' },
  { label: 'Integer::max', detail: 'method ref — max of two ints', insertText: 'Integer::max' },
  { label: 'Integer::min', detail: 'method ref — min of two ints', insertText: 'Integer::min' },
  { label: 'String::valueOf', detail: 'method ref — obj to String', insertText: 'String::valueOf' },
  { label: 'String::length', detail: 'method ref — string length', insertText: 'String::length' },
  { label: 'String::toLowerCase', detail: 'method ref — to lowercase', insertText: 'String::toLowerCase' },
  { label: 'String::toUpperCase', detail: 'method ref — to uppercase', insertText: 'String::toUpperCase' },
  { label: 'String::trim', detail: 'method ref — trim whitespace', insertText: 'String::trim' },
  { label: 'String::isEmpty', detail: 'method ref — check empty', insertText: 'String::isEmpty' },
  { label: 'String::charAt', detail: 'method ref — get char at index', insertText: 'String::charAt' },
  { label: 'String::toCharArray', detail: 'method ref — to char[]', insertText: 'String::toCharArray' },
  { label: 'Math::abs', detail: 'method ref — absolute value', insertText: 'Math::abs' },
  { label: 'Math::max', detail: 'method ref — max', insertText: 'Math::max' },
  { label: 'Math::min', detail: 'method ref — min', insertText: 'Math::min' },
  { label: 'System.out::println', detail: 'method ref — print line', insertText: 'System.out::println' },
  { label: 'Character::isDigit', detail: 'method ref — check digit', insertText: 'Character::isDigit' },
  { label: 'Character::isLetter', detail: 'method ref — check letter', insertText: 'Character::isLetter' },
  { label: 'Character::toLowerCase', detail: 'method ref — to lowercase char', insertText: 'Character::toLowerCase' },
  { label: 'Character::isLetterOrDigit', detail: 'method ref — check alphanumeric', insertText: 'Character::isLetterOrDigit' },
  { label: 'Objects::nonNull', detail: 'method ref — null check', insertText: 'Objects::nonNull' },
  { label: 'Objects::isNull', detail: 'method ref — is null', insertText: 'Objects::isNull' },
  // Lambda snippets
  { label: 'lambda', detail: 'lambda expression', insertText: '(${1:a}, ${2:b}) -> ${3:a + b}' },
  { label: 'comparatorlambda', detail: 'comparator lambda', insertText: '(a, b) -> ${1:a - b}' },
  { label: 'streamsort', detail: 'stream sort collect', insertText: '.stream().sorted(${1:Comparator.comparingInt(${2:x -> x})}).collect(Collectors.toList())' },
  { label: 'streamfilter', detail: 'stream filter collect', insertText: '.stream().filter(${1:x -> x > 0}).collect(Collectors.toList())' },
  { label: 'streammap', detail: 'stream map collect', insertText: '.stream().map(${1:x -> x * 2}).collect(Collectors.toList())' },
  { label: 'streamtomap', detail: 'stream to map', insertText: '.stream().collect(Collectors.toMap(${1:k -> k}, ${2:v -> v}))' },
  { label: 'streamgroupby', detail: 'stream groupingBy', insertText: '.stream().collect(Collectors.groupingBy(${1:classifier}))' },
  { label: 'streamjoin', detail: 'stream joining', insertText: '.stream().map(String::valueOf).collect(Collectors.joining(${1:", "}))' },
  { label: 'streamsum', detail: 'stream mapToInt sum', insertText: '.stream().mapToInt(${1:Integer::intValue}).sum()' },
  { label: 'intrange', detail: 'IntStream.range for loop', insertText: 'IntStream.range(${1:0}, ${2:n}).forEach(${3:i} -> {\n\t$0\n});' },
  { label: 'intrangearr', detail: 'IntStream.range to array', insertText: 'IntStream.range(${1:0}, ${2:n}).toArray()' },
]

// ── Method completions by type (triggered after dot) ──

interface MethodDef {
  label: string
  insertText: string
  detail: string
  documentation?: string
}

// Methods available on instances (e.g. list.add(), map.get())
const INSTANCE_METHODS: Record<string, MethodDef[]> = {
  // String
  String: [
    { label: 'length', insertText: 'length()', detail: 'int', documentation: 'Returns the length of this string' },
    { label: 'charAt', insertText: 'charAt(${1:index})', detail: 'char', documentation: 'Returns the char at the specified index' },
    { label: 'substring', insertText: 'substring(${1:beginIndex}, ${2:endIndex})', detail: 'String' },
    { label: 'indexOf', insertText: 'indexOf(${1:str})', detail: 'int' },
    { label: 'lastIndexOf', insertText: 'lastIndexOf(${1:str})', detail: 'int' },
    { label: 'contains', insertText: 'contains(${1:s})', detail: 'boolean' },
    { label: 'startsWith', insertText: 'startsWith(${1:prefix})', detail: 'boolean' },
    { label: 'endsWith', insertText: 'endsWith(${1:suffix})', detail: 'boolean' },
    { label: 'equals', insertText: 'equals(${1:other})', detail: 'boolean' },
    { label: 'equalsIgnoreCase', insertText: 'equalsIgnoreCase(${1:other})', detail: 'boolean' },
    { label: 'compareTo', insertText: 'compareTo(${1:other})', detail: 'int' },
    { label: 'isEmpty', insertText: 'isEmpty()', detail: 'boolean' },
    { label: 'isBlank', insertText: 'isBlank()', detail: 'boolean' },
    { label: 'trim', insertText: 'trim()', detail: 'String' },
    { label: 'strip', insertText: 'strip()', detail: 'String' },
    { label: 'toLowerCase', insertText: 'toLowerCase()', detail: 'String' },
    { label: 'toUpperCase', insertText: 'toUpperCase()', detail: 'String' },
    { label: 'replace', insertText: 'replace(${1:old}, ${2:new})', detail: 'String' },
    { label: 'replaceAll', insertText: 'replaceAll(${1:regex}, ${2:replacement})', detail: 'String' },
    { label: 'split', insertText: 'split(${1:regex})', detail: 'String[]' },
    { label: 'toCharArray', insertText: 'toCharArray()', detail: 'char[]' },
    { label: 'matches', insertText: 'matches(${1:regex})', detail: 'boolean' },
  ],

  // List / ArrayList / LinkedList
  List: [
    { label: 'add', insertText: 'add(${1:element})', detail: 'boolean' },
    { label: 'add', insertText: 'add(${1:index}, ${2:element})', detail: 'void — add at index' },
    { label: 'get', insertText: 'get(${1:index})', detail: 'E' },
    { label: 'set', insertText: 'set(${1:index}, ${2:element})', detail: 'E' },
    { label: 'remove', insertText: 'remove(${1:index})', detail: 'E' },
    { label: 'size', insertText: 'size()', detail: 'int' },
    { label: 'isEmpty', insertText: 'isEmpty()', detail: 'boolean' },
    { label: 'contains', insertText: 'contains(${1:o})', detail: 'boolean' },
    { label: 'indexOf', insertText: 'indexOf(${1:o})', detail: 'int' },
    { label: 'lastIndexOf', insertText: 'lastIndexOf(${1:o})', detail: 'int' },
    { label: 'clear', insertText: 'clear()', detail: 'void' },
    { label: 'toArray', insertText: 'toArray()', detail: 'Object[]' },
    { label: 'subList', insertText: 'subList(${1:from}, ${2:to})', detail: 'List<E>' },
    { label: 'sort', insertText: 'sort(${1:comparator})', detail: 'void' },
    { label: 'iterator', insertText: 'iterator()', detail: 'Iterator<E>' },
    { label: 'stream', insertText: 'stream()', detail: 'Stream<E>' },
    { label: 'addAll', insertText: 'addAll(${1:collection})', detail: 'boolean' },
    { label: 'containsAll', insertText: 'containsAll(${1:collection})', detail: 'boolean' },
    { label: 'forEach', insertText: 'forEach(${1:action})', detail: 'void' },
  ],

  // Map / HashMap / TreeMap
  Map: [
    { label: 'put', insertText: 'put(${1:key}, ${2:value})', detail: 'V' },
    { label: 'get', insertText: 'get(${1:key})', detail: 'V' },
    { label: 'getOrDefault', insertText: 'getOrDefault(${1:key}, ${2:defaultValue})', detail: 'V' },
    { label: 'containsKey', insertText: 'containsKey(${1:key})', detail: 'boolean' },
    { label: 'containsValue', insertText: 'containsValue(${1:value})', detail: 'boolean' },
    { label: 'remove', insertText: 'remove(${1:key})', detail: 'V' },
    { label: 'size', insertText: 'size()', detail: 'int' },
    { label: 'isEmpty', insertText: 'isEmpty()', detail: 'boolean' },
    { label: 'clear', insertText: 'clear()', detail: 'void' },
    { label: 'keySet', insertText: 'keySet()', detail: 'Set<K>' },
    { label: 'values', insertText: 'values()', detail: 'Collection<V>' },
    { label: 'entrySet', insertText: 'entrySet()', detail: 'Set<Map.Entry<K,V>>' },
    { label: 'putIfAbsent', insertText: 'putIfAbsent(${1:key}, ${2:value})', detail: 'V' },
    { label: 'merge', insertText: 'merge(${1:key}, ${2:value}, ${3:(a, b) -> a + b})', detail: 'V' },
    { label: 'computeIfAbsent', insertText: 'computeIfAbsent(${1:key}, ${2:k -> new ArrayList<>()})', detail: 'V' },
    { label: 'forEach', insertText: 'forEach((${1:k}, ${2:v}) -> ${3})', detail: 'void' },
    { label: 'replace', insertText: 'replace(${1:key}, ${2:value})', detail: 'V' },
  ],

  // Set / HashSet / TreeSet
  Set: [
    { label: 'add', insertText: 'add(${1:element})', detail: 'boolean' },
    { label: 'remove', insertText: 'remove(${1:o})', detail: 'boolean' },
    { label: 'contains', insertText: 'contains(${1:o})', detail: 'boolean' },
    { label: 'size', insertText: 'size()', detail: 'int' },
    { label: 'isEmpty', insertText: 'isEmpty()', detail: 'boolean' },
    { label: 'clear', insertText: 'clear()', detail: 'void' },
    { label: 'iterator', insertText: 'iterator()', detail: 'Iterator<E>' },
    { label: 'stream', insertText: 'stream()', detail: 'Stream<E>' },
    { label: 'toArray', insertText: 'toArray()', detail: 'Object[]' },
    { label: 'addAll', insertText: 'addAll(${1:collection})', detail: 'boolean' },
    { label: 'retainAll', insertText: 'retainAll(${1:collection})', detail: 'boolean' },
    { label: 'removeAll', insertText: 'removeAll(${1:collection})', detail: 'boolean' },
    { label: 'forEach', insertText: 'forEach(${1:action})', detail: 'void' },
  ],

  // Queue / PriorityQueue
  Queue: [
    { label: 'offer', insertText: 'offer(${1:element})', detail: 'boolean' },
    { label: 'poll', insertText: 'poll()', detail: 'E' },
    { label: 'peek', insertText: 'peek()', detail: 'E' },
    { label: 'add', insertText: 'add(${1:element})', detail: 'boolean' },
    { label: 'remove', insertText: 'remove()', detail: 'E' },
    { label: 'element', insertText: 'element()', detail: 'E' },
    { label: 'size', insertText: 'size()', detail: 'int' },
    { label: 'isEmpty', insertText: 'isEmpty()', detail: 'boolean' },
    { label: 'contains', insertText: 'contains(${1:o})', detail: 'boolean' },
    { label: 'clear', insertText: 'clear()', detail: 'void' },
  ],

  // Deque / ArrayDeque (used as stack too)
  Deque: [
    { label: 'push', insertText: 'push(${1:element})', detail: 'void — stack push' },
    { label: 'pop', insertText: 'pop()', detail: 'E — stack pop' },
    { label: 'peek', insertText: 'peek()', detail: 'E — stack peek' },
    { label: 'offerFirst', insertText: 'offerFirst(${1:element})', detail: 'boolean' },
    { label: 'offerLast', insertText: 'offerLast(${1:element})', detail: 'boolean' },
    { label: 'pollFirst', insertText: 'pollFirst()', detail: 'E' },
    { label: 'pollLast', insertText: 'pollLast()', detail: 'E' },
    { label: 'peekFirst', insertText: 'peekFirst()', detail: 'E' },
    { label: 'peekLast', insertText: 'peekLast()', detail: 'E' },
    { label: 'size', insertText: 'size()', detail: 'int' },
    { label: 'isEmpty', insertText: 'isEmpty()', detail: 'boolean' },
    { label: 'offer', insertText: 'offer(${1:element})', detail: 'boolean' },
    { label: 'poll', insertText: 'poll()', detail: 'E' },
  ],

  // StringBuilder
  StringBuilder: [
    { label: 'append', insertText: 'append(${1:str})', detail: 'StringBuilder' },
    { label: 'insert', insertText: 'insert(${1:offset}, ${2:str})', detail: 'StringBuilder' },
    { label: 'delete', insertText: 'delete(${1:start}, ${2:end})', detail: 'StringBuilder' },
    { label: 'deleteCharAt', insertText: 'deleteCharAt(${1:index})', detail: 'StringBuilder' },
    { label: 'replace', insertText: 'replace(${1:start}, ${2:end}, ${3:str})', detail: 'StringBuilder' },
    { label: 'reverse', insertText: 'reverse()', detail: 'StringBuilder' },
    { label: 'toString', insertText: 'toString()', detail: 'String' },
    { label: 'length', insertText: 'length()', detail: 'int' },
    { label: 'charAt', insertText: 'charAt(${1:index})', detail: 'char' },
    { label: 'setCharAt', insertText: 'setCharAt(${1:index}, ${2:ch})', detail: 'void' },
    { label: 'substring', insertText: 'substring(${1:start}, ${2:end})', detail: 'String' },
  ],

  // Optional
  Optional: [
    { label: 'isPresent', insertText: 'isPresent()', detail: 'boolean' },
    { label: 'isEmpty', insertText: 'isEmpty()', detail: 'boolean' },
    { label: 'get', insertText: 'get()', detail: 'T' },
    { label: 'orElse', insertText: 'orElse(${1:other})', detail: 'T' },
    { label: 'orElseGet', insertText: 'orElseGet(${1:supplier})', detail: 'T' },
    { label: 'orElseThrow', insertText: 'orElseThrow()', detail: 'T' },
    { label: 'ifPresent', insertText: 'ifPresent(${1:consumer})', detail: 'void' },
    { label: 'map', insertText: 'map(${1:mapper})', detail: 'Optional<U>' },
    { label: 'flatMap', insertText: 'flatMap(${1:mapper})', detail: 'Optional<U>' },
    { label: 'filter', insertText: 'filter(${1:predicate})', detail: 'Optional<T>' },
  ],

  // Stream
  Stream: [
    { label: 'filter', insertText: 'filter(${1:predicate})', detail: 'Stream<T>' },
    { label: 'map', insertText: 'map(${1:mapper})', detail: 'Stream<R>' },
    { label: 'flatMap', insertText: 'flatMap(${1:mapper})', detail: 'Stream<R>' },
    { label: 'forEach', insertText: 'forEach(${1:action})', detail: 'void' },
    { label: 'collect', insertText: 'collect(${1:Collectors.toList()})', detail: 'R' },
    { label: 'reduce', insertText: 'reduce(${1:identity}, ${2:(a, b) -> a + b})', detail: 'T' },
    { label: 'sorted', insertText: 'sorted()', detail: 'Stream<T>' },
    { label: 'distinct', insertText: 'distinct()', detail: 'Stream<T>' },
    { label: 'limit', insertText: 'limit(${1:maxSize})', detail: 'Stream<T>' },
    { label: 'skip', insertText: 'skip(${1:n})', detail: 'Stream<T>' },
    { label: 'count', insertText: 'count()', detail: 'long' },
    { label: 'min', insertText: 'min(${1:comparator})', detail: 'Optional<T>' },
    { label: 'max', insertText: 'max(${1:comparator})', detail: 'Optional<T>' },
    { label: 'findFirst', insertText: 'findFirst()', detail: 'Optional<T>' },
    { label: 'findAny', insertText: 'findAny()', detail: 'Optional<T>' },
    { label: 'anyMatch', insertText: 'anyMatch(${1:predicate})', detail: 'boolean' },
    { label: 'allMatch', insertText: 'allMatch(${1:predicate})', detail: 'boolean' },
    { label: 'noneMatch', insertText: 'noneMatch(${1:predicate})', detail: 'boolean' },
    { label: 'toArray', insertText: 'toArray()', detail: 'Object[]' },
    { label: 'mapToInt', insertText: 'mapToInt(${1:mapper})', detail: 'IntStream' },
  ],

  // IntStream (from mapToInt, IntStream.range, etc.)
  IntStream: [
    { label: 'sum', insertText: 'sum()', detail: 'int' },
    { label: 'min', insertText: 'min()', detail: 'OptionalInt' },
    { label: 'max', insertText: 'max()', detail: 'OptionalInt' },
    { label: 'average', insertText: 'average()', detail: 'OptionalDouble' },
    { label: 'count', insertText: 'count()', detail: 'long' },
    { label: 'toArray', insertText: 'toArray()', detail: 'int[]' },
    { label: 'boxed', insertText: 'boxed()', detail: 'Stream<Integer> — box to Integer' },
    { label: 'asLongStream', insertText: 'asLongStream()', detail: 'LongStream' },
    { label: 'asDoubleStream', insertText: 'asDoubleStream()', detail: 'DoubleStream' },
    { label: 'filter', insertText: 'filter(${1:predicate})', detail: 'IntStream' },
    { label: 'map', insertText: 'map(${1:mapper})', detail: 'IntStream' },
    { label: 'mapToObj', insertText: 'mapToObj(${1:mapper})', detail: 'Stream<U>' },
    { label: 'mapToLong', insertText: 'mapToLong(${1:mapper})', detail: 'LongStream' },
    { label: 'mapToDouble', insertText: 'mapToDouble(${1:mapper})', detail: 'DoubleStream' },
    { label: 'flatMap', insertText: 'flatMap(${1:mapper})', detail: 'IntStream' },
    { label: 'forEach', insertText: 'forEach(${1:action})', detail: 'void' },
    { label: 'reduce', insertText: 'reduce(${1:identity}, ${2:(a, b) -> a + b})', detail: 'int' },
    { label: 'sorted', insertText: 'sorted()', detail: 'IntStream' },
    { label: 'distinct', insertText: 'distinct()', detail: 'IntStream' },
    { label: 'limit', insertText: 'limit(${1:maxSize})', detail: 'IntStream' },
    { label: 'skip', insertText: 'skip(${1:n})', detail: 'IntStream' },
    { label: 'anyMatch', insertText: 'anyMatch(${1:predicate})', detail: 'boolean' },
    { label: 'allMatch', insertText: 'allMatch(${1:predicate})', detail: 'boolean' },
    { label: 'noneMatch', insertText: 'noneMatch(${1:predicate})', detail: 'boolean' },
    { label: 'findFirst', insertText: 'findFirst()', detail: 'OptionalInt' },
    { label: 'findAny', insertText: 'findAny()', detail: 'OptionalInt' },
    { label: 'summaryStatistics', insertText: 'summaryStatistics()', detail: 'IntSummaryStatistics' },
    { label: 'peek', insertText: 'peek(${1:action})', detail: 'IntStream' },
    { label: 'collect', insertText: 'collect(${1:supplier}, ${2:accumulator}, ${3:combiner})', detail: 'R' },
  ],

  // LongStream
  LongStream: [
    { label: 'sum', insertText: 'sum()', detail: 'long' },
    { label: 'min', insertText: 'min()', detail: 'OptionalLong' },
    { label: 'max', insertText: 'max()', detail: 'OptionalLong' },
    { label: 'average', insertText: 'average()', detail: 'OptionalDouble' },
    { label: 'count', insertText: 'count()', detail: 'long' },
    { label: 'toArray', insertText: 'toArray()', detail: 'long[]' },
    { label: 'boxed', insertText: 'boxed()', detail: 'Stream<Long>' },
    { label: 'filter', insertText: 'filter(${1:predicate})', detail: 'LongStream' },
    { label: 'map', insertText: 'map(${1:mapper})', detail: 'LongStream' },
    { label: 'mapToObj', insertText: 'mapToObj(${1:mapper})', detail: 'Stream<U>' },
    { label: 'mapToInt', insertText: 'mapToInt(${1:mapper})', detail: 'IntStream' },
    { label: 'forEach', insertText: 'forEach(${1:action})', detail: 'void' },
    { label: 'reduce', insertText: 'reduce(${1:identity}, ${2:(a, b) -> a + b})', detail: 'long' },
    { label: 'sorted', insertText: 'sorted()', detail: 'LongStream' },
    { label: 'distinct', insertText: 'distinct()', detail: 'LongStream' },
    { label: 'findFirst', insertText: 'findFirst()', detail: 'OptionalLong' },
    { label: 'summaryStatistics', insertText: 'summaryStatistics()', detail: 'LongSummaryStatistics' },
  ],

  // Iterator
  Iterator: [
    { label: 'hasNext', insertText: 'hasNext()', detail: 'boolean' },
    { label: 'next', insertText: 'next()', detail: 'E' },
    { label: 'remove', insertText: 'remove()', detail: 'void' },
  ],

  // Map.Entry (for entrySet iteration)
  'Map.Entry': [
    { label: 'getKey', insertText: 'getKey()', detail: 'K' },
    { label: 'getValue', insertText: 'getValue()', detail: 'V' },
    { label: 'setValue', insertText: 'setValue(${1:value})', detail: 'V' },
  ],

  // PrintStream (for System.out. / System.err.)
  PrintStream: [
    { label: 'println', insertText: 'println(${1})', detail: 'void' },
    { label: 'print', insertText: 'print(${1})', detail: 'void' },
    { label: 'printf', insertText: 'printf(${1:format}, ${2:args})', detail: 'PrintStream' },
    { label: 'format', insertText: 'format(${1:format}, ${2:args})', detail: 'PrintStream' },
    { label: 'flush', insertText: 'flush()', detail: 'void' },
    { label: 'close', insertText: 'close()', detail: 'void' },
  ],

  // TreeMap-specific (navigation methods)
  TreeMap: [
    { label: 'put', insertText: 'put(${1:key}, ${2:value})', detail: 'V' },
    { label: 'get', insertText: 'get(${1:key})', detail: 'V' },
    { label: 'getOrDefault', insertText: 'getOrDefault(${1:key}, ${2:defaultValue})', detail: 'V' },
    { label: 'containsKey', insertText: 'containsKey(${1:key})', detail: 'boolean' },
    { label: 'remove', insertText: 'remove(${1:key})', detail: 'V' },
    { label: 'size', insertText: 'size()', detail: 'int' },
    { label: 'isEmpty', insertText: 'isEmpty()', detail: 'boolean' },
    { label: 'keySet', insertText: 'keySet()', detail: 'Set<K>' },
    { label: 'values', insertText: 'values()', detail: 'Collection<V>' },
    { label: 'entrySet', insertText: 'entrySet()', detail: 'Set<Map.Entry<K,V>>' },
    { label: 'firstKey', insertText: 'firstKey()', detail: 'K — smallest key' },
    { label: 'lastKey', insertText: 'lastKey()', detail: 'K — largest key' },
    { label: 'firstEntry', insertText: 'firstEntry()', detail: 'Map.Entry<K,V>' },
    { label: 'lastEntry', insertText: 'lastEntry()', detail: 'Map.Entry<K,V>' },
    { label: 'lowerKey', insertText: 'lowerKey(${1:key})', detail: 'K — strictly less than' },
    { label: 'higherKey', insertText: 'higherKey(${1:key})', detail: 'K — strictly greater than' },
    { label: 'floorKey', insertText: 'floorKey(${1:key})', detail: 'K — less than or equal' },
    { label: 'ceilingKey', insertText: 'ceilingKey(${1:key})', detail: 'K — greater than or equal' },
    { label: 'lowerEntry', insertText: 'lowerEntry(${1:key})', detail: 'Map.Entry<K,V>' },
    { label: 'higherEntry', insertText: 'higherEntry(${1:key})', detail: 'Map.Entry<K,V>' },
    { label: 'floorEntry', insertText: 'floorEntry(${1:key})', detail: 'Map.Entry<K,V>' },
    { label: 'ceilingEntry', insertText: 'ceilingEntry(${1:key})', detail: 'Map.Entry<K,V>' },
    { label: 'pollFirstEntry', insertText: 'pollFirstEntry()', detail: 'Map.Entry<K,V> — remove smallest' },
    { label: 'pollLastEntry', insertText: 'pollLastEntry()', detail: 'Map.Entry<K,V> — remove largest' },
    { label: 'subMap', insertText: 'subMap(${1:fromKey}, ${2:toKey})', detail: 'SortedMap<K,V>' },
    { label: 'headMap', insertText: 'headMap(${1:toKey})', detail: 'SortedMap<K,V>' },
    { label: 'tailMap', insertText: 'tailMap(${1:fromKey})', detail: 'SortedMap<K,V>' },
    { label: 'descendingMap', insertText: 'descendingMap()', detail: 'NavigableMap<K,V>' },
    { label: 'descendingKeySet', insertText: 'descendingKeySet()', detail: 'NavigableSet<K>' },
    { label: 'merge', insertText: 'merge(${1:key}, ${2:value}, ${3:(a, b) -> a + b})', detail: 'V' },
    { label: 'computeIfAbsent', insertText: 'computeIfAbsent(${1:key}, ${2:k -> new ArrayList<>()})', detail: 'V' },
    { label: 'putIfAbsent', insertText: 'putIfAbsent(${1:key}, ${2:value})', detail: 'V' },
    { label: 'forEach', insertText: 'forEach((${1:k}, ${2:v}) -> ${3})', detail: 'void' },
    { label: 'clear', insertText: 'clear()', detail: 'void' },
  ],

  // TreeSet-specific (navigation methods)
  TreeSet: [
    { label: 'add', insertText: 'add(${1:element})', detail: 'boolean' },
    { label: 'remove', insertText: 'remove(${1:o})', detail: 'boolean' },
    { label: 'contains', insertText: 'contains(${1:o})', detail: 'boolean' },
    { label: 'size', insertText: 'size()', detail: 'int' },
    { label: 'isEmpty', insertText: 'isEmpty()', detail: 'boolean' },
    { label: 'clear', insertText: 'clear()', detail: 'void' },
    { label: 'first', insertText: 'first()', detail: 'E — smallest element' },
    { label: 'last', insertText: 'last()', detail: 'E — largest element' },
    { label: 'lower', insertText: 'lower(${1:e})', detail: 'E — strictly less than' },
    { label: 'higher', insertText: 'higher(${1:e})', detail: 'E — strictly greater than' },
    { label: 'floor', insertText: 'floor(${1:e})', detail: 'E — less than or equal' },
    { label: 'ceiling', insertText: 'ceiling(${1:e})', detail: 'E — greater than or equal' },
    { label: 'pollFirst', insertText: 'pollFirst()', detail: 'E — remove smallest' },
    { label: 'pollLast', insertText: 'pollLast()', detail: 'E — remove largest' },
    { label: 'subSet', insertText: 'subSet(${1:from}, ${2:to})', detail: 'SortedSet<E>' },
    { label: 'headSet', insertText: 'headSet(${1:toElement})', detail: 'SortedSet<E>' },
    { label: 'tailSet', insertText: 'tailSet(${1:fromElement})', detail: 'SortedSet<E>' },
    { label: 'descendingSet', insertText: 'descendingSet()', detail: 'NavigableSet<E>' },
    { label: 'descendingIterator', insertText: 'descendingIterator()', detail: 'Iterator<E>' },
    { label: 'iterator', insertText: 'iterator()', detail: 'Iterator<E>' },
    { label: 'stream', insertText: 'stream()', detail: 'Stream<E>' },
    { label: 'forEach', insertText: 'forEach(${1:action})', detail: 'void' },
  ],

  // LinkedList-specific (has both List and Deque methods)
  LinkedList: [
    { label: 'add', insertText: 'add(${1:element})', detail: 'boolean' },
    { label: 'add', insertText: 'add(${1:index}, ${2:element})', detail: 'void — add at index' },
    { label: 'get', insertText: 'get(${1:index})', detail: 'E' },
    { label: 'set', insertText: 'set(${1:index}, ${2:element})', detail: 'E' },
    { label: 'remove', insertText: 'remove(${1:index})', detail: 'E' },
    { label: 'size', insertText: 'size()', detail: 'int' },
    { label: 'isEmpty', insertText: 'isEmpty()', detail: 'boolean' },
    { label: 'contains', insertText: 'contains(${1:o})', detail: 'boolean' },
    { label: 'clear', insertText: 'clear()', detail: 'void' },
    { label: 'addFirst', insertText: 'addFirst(${1:element})', detail: 'void' },
    { label: 'addLast', insertText: 'addLast(${1:element})', detail: 'void' },
    { label: 'getFirst', insertText: 'getFirst()', detail: 'E' },
    { label: 'getLast', insertText: 'getLast()', detail: 'E' },
    { label: 'removeFirst', insertText: 'removeFirst()', detail: 'E' },
    { label: 'removeLast', insertText: 'removeLast()', detail: 'E' },
    { label: 'push', insertText: 'push(${1:element})', detail: 'void — stack push' },
    { label: 'pop', insertText: 'pop()', detail: 'E — stack pop' },
    { label: 'peek', insertText: 'peek()', detail: 'E' },
    { label: 'peekFirst', insertText: 'peekFirst()', detail: 'E' },
    { label: 'peekLast', insertText: 'peekLast()', detail: 'E' },
    { label: 'offer', insertText: 'offer(${1:element})', detail: 'boolean — queue add' },
    { label: 'offerFirst', insertText: 'offerFirst(${1:element})', detail: 'boolean' },
    { label: 'offerLast', insertText: 'offerLast(${1:element})', detail: 'boolean' },
    { label: 'poll', insertText: 'poll()', detail: 'E — queue remove' },
    { label: 'pollFirst', insertText: 'pollFirst()', detail: 'E' },
    { label: 'pollLast', insertText: 'pollLast()', detail: 'E' },
    { label: 'indexOf', insertText: 'indexOf(${1:o})', detail: 'int' },
    { label: 'sort', insertText: 'sort(${1:comparator})', detail: 'void' },
    { label: 'stream', insertText: 'stream()', detail: 'Stream<E>' },
    { label: 'iterator', insertText: 'iterator()', detail: 'Iterator<E>' },
    { label: 'descendingIterator', insertText: 'descendingIterator()', detail: 'Iterator<E>' },
    { label: 'subList', insertText: 'subList(${1:from}, ${2:to})', detail: 'List<E>' },
    { label: 'forEach', insertText: 'forEach(${1:action})', detail: 'void' },
  ],

  // int[] / array (limited — .length is a field, .clone() is a method)
  Array: [
    { label: 'length', insertText: 'length', detail: 'int — array size' },
    { label: 'clone', insertText: 'clone()', detail: 'T[] — shallow copy' },
  ],
}

// Aliases: concrete classes share parent interface methods
// TreeMap, TreeSet, LinkedList have their own entries with navigation methods
const TYPE_ALIASES: Record<string, string> = {
  ArrayList: 'List',
  HashMap: 'Map', LinkedHashMap: 'Map',
  HashSet: 'Set', LinkedHashSet: 'Set',
  PriorityQueue: 'Queue',
  ArrayDeque: 'Deque',
  Stack: 'Deque',
  StringBuffer: 'StringBuilder',
}

// Static methods (triggered by ClassName.)
const STATIC_METHODS: Record<string, MethodDef[]> = {
  Arrays: [
    { label: 'sort', insertText: 'sort(${1:arr})', detail: 'void' },
    { label: 'sort', insertText: 'sort(${1:arr}, ${2:comparator})', detail: 'void — with comparator' },
    { label: 'sort', insertText: 'sort(${1:arr}, ${2:fromIndex}, ${3:toIndex})', detail: 'void — range' },
    { label: 'binarySearch', insertText: 'binarySearch(${1:arr}, ${2:key})', detail: 'int' },
    { label: 'fill', insertText: 'fill(${1:arr}, ${2:val})', detail: 'void' },
    { label: 'copyOf', insertText: 'copyOf(${1:original}, ${2:newLength})', detail: 'T[]' },
    { label: 'copyOfRange', insertText: 'copyOfRange(${1:original}, ${2:from}, ${3:to})', detail: 'T[]' },
    { label: 'equals', insertText: 'equals(${1:a}, ${2:b})', detail: 'boolean' },
    { label: 'deepEquals', insertText: 'deepEquals(${1:a}, ${2:b})', detail: 'boolean' },
    { label: 'asList', insertText: 'asList(${1:elements})', detail: 'List<T>' },
    { label: 'toString', insertText: 'toString(${1:arr})', detail: 'String' },
    { label: 'stream', insertText: 'stream(${1:arr})', detail: 'Stream<T>' },
  ],
  Collections: [
    { label: 'sort', insertText: 'sort(${1:list})', detail: 'void' },
    { label: 'sort', insertText: 'sort(${1:list}, ${2:comparator})', detail: 'void — with comparator' },
    { label: 'reverse', insertText: 'reverse(${1:list})', detail: 'void' },
    { label: 'shuffle', insertText: 'shuffle(${1:list})', detail: 'void' },
    { label: 'min', insertText: 'min(${1:collection})', detail: 'T' },
    { label: 'max', insertText: 'max(${1:collection})', detail: 'T' },
    { label: 'frequency', insertText: 'frequency(${1:collection}, ${2:o})', detail: 'int' },
    { label: 'swap', insertText: 'swap(${1:list}, ${2:i}, ${3:j})', detail: 'void' },
    { label: 'binarySearch', insertText: 'binarySearch(${1:list}, ${2:key})', detail: 'int' },
    { label: 'reverseOrder', insertText: 'reverseOrder()', detail: 'Comparator<T> — descending order' },
    { label: 'unmodifiableList', insertText: 'unmodifiableList(${1:list})', detail: 'List<T>' },
    { label: 'unmodifiableMap', insertText: 'unmodifiableMap(${1:map})', detail: 'Map<K,V>' },
    { label: 'unmodifiableSet', insertText: 'unmodifiableSet(${1:set})', detail: 'Set<T>' },
    { label: 'synchronizedList', insertText: 'synchronizedList(${1:list})', detail: 'List<T>' },
    { label: 'singletonList', insertText: 'singletonList(${1:o})', detail: 'List<T>' },
    { label: 'singleton', insertText: 'singleton(${1:o})', detail: 'Set<T>' },
    { label: 'singletonMap', insertText: 'singletonMap(${1:key}, ${2:value})', detail: 'Map<K,V>' },
    { label: 'emptyList', insertText: 'emptyList()', detail: 'List<T>' },
    { label: 'emptyMap', insertText: 'emptyMap()', detail: 'Map<K,V>' },
    { label: 'emptySet', insertText: 'emptySet()', detail: 'Set<T>' },
    { label: 'nCopies', insertText: 'nCopies(${1:n}, ${2:o})', detail: 'List<T>' },
    { label: 'fill', insertText: 'fill(${1:list}, ${2:obj})', detail: 'void' },
    { label: 'rotate', insertText: 'rotate(${1:list}, ${2:distance})', detail: 'void' },
    { label: 'disjoint', insertText: 'disjoint(${1:c1}, ${2:c2})', detail: 'boolean — no elements in common' },
    { label: 'addAll', insertText: 'addAll(${1:c}, ${2:elements})', detail: 'boolean' },
  ],
  Math: [
    { label: 'abs', insertText: 'abs(${1:a})', detail: 'int/double' },
    { label: 'max', insertText: 'max(${1:a}, ${2:b})', detail: 'int/double' },
    { label: 'min', insertText: 'min(${1:a}, ${2:b})', detail: 'int/double' },
    { label: 'pow', insertText: 'pow(${1:base}, ${2:exp})', detail: 'double' },
    { label: 'sqrt', insertText: 'sqrt(${1:a})', detail: 'double' },
    { label: 'ceil', insertText: 'ceil(${1:a})', detail: 'double' },
    { label: 'floor', insertText: 'floor(${1:a})', detail: 'double' },
    { label: 'round', insertText: 'round(${1:a})', detail: 'long' },
    { label: 'log', insertText: 'log(${1:a})', detail: 'double' },
    { label: 'log10', insertText: 'log10(${1:a})', detail: 'double' },
    { label: 'random', insertText: 'random()', detail: 'double — [0.0, 1.0)' },
  ],
  Integer: [
    { label: 'parseInt', insertText: 'parseInt(${1:s})', detail: 'int' },
    { label: 'valueOf', insertText: 'valueOf(${1:s})', detail: 'Integer' },
    { label: 'toString', insertText: 'toString(${1:i})', detail: 'String' },
    { label: 'toBinaryString', insertText: 'toBinaryString(${1:i})', detail: 'String' },
    { label: 'toHexString', insertText: 'toHexString(${1:i})', detail: 'String' },
    { label: 'compare', insertText: 'compare(${1:x}, ${2:y})', detail: 'int' },
    { label: 'max', insertText: 'max(${1:a}, ${2:b})', detail: 'int' },
    { label: 'min', insertText: 'min(${1:a}, ${2:b})', detail: 'int' },
    { label: 'MAX_VALUE', insertText: 'MAX_VALUE', detail: 'int — 2^31 - 1' },
    { label: 'MIN_VALUE', insertText: 'MIN_VALUE', detail: 'int — -2^31' },
  ],
  Long: [
    { label: 'parseLong', insertText: 'parseLong(${1:s})', detail: 'long' },
    { label: 'valueOf', insertText: 'valueOf(${1:s})', detail: 'Long' },
    { label: 'MAX_VALUE', insertText: 'MAX_VALUE', detail: 'long' },
    { label: 'MIN_VALUE', insertText: 'MIN_VALUE', detail: 'long' },
  ],
  Double: [
    { label: 'parseDouble', insertText: 'parseDouble(${1:s})', detail: 'double' },
    { label: 'valueOf', insertText: 'valueOf(${1:s})', detail: 'Double' },
    { label: 'isNaN', insertText: 'isNaN(${1:v})', detail: 'boolean' },
    { label: 'isInfinite', insertText: 'isInfinite(${1:v})', detail: 'boolean' },
    { label: 'MAX_VALUE', insertText: 'MAX_VALUE', detail: 'double' },
    { label: 'MIN_VALUE', insertText: 'MIN_VALUE', detail: 'double' },
  ],
  Character: [
    { label: 'isDigit', insertText: 'isDigit(${1:ch})', detail: 'boolean' },
    { label: 'isLetter', insertText: 'isLetter(${1:ch})', detail: 'boolean' },
    { label: 'isLetterOrDigit', insertText: 'isLetterOrDigit(${1:ch})', detail: 'boolean' },
    { label: 'isUpperCase', insertText: 'isUpperCase(${1:ch})', detail: 'boolean' },
    { label: 'isLowerCase', insertText: 'isLowerCase(${1:ch})', detail: 'boolean' },
    { label: 'toLowerCase', insertText: 'toLowerCase(${1:ch})', detail: 'char' },
    { label: 'toUpperCase', insertText: 'toUpperCase(${1:ch})', detail: 'char' },
    { label: 'isWhitespace', insertText: 'isWhitespace(${1:ch})', detail: 'boolean' },
  ],
  String: [
    { label: 'valueOf', insertText: 'valueOf(${1:obj})', detail: 'String' },
    { label: 'format', insertText: 'format(${1:format}, ${2:args})', detail: 'String' },
    { label: 'join', insertText: 'join(${1:delimiter}, ${2:elements})', detail: 'String' },
  ],
  Collectors: [
    { label: 'toList', insertText: 'toList()', detail: 'Collector — to List' },
    { label: 'toSet', insertText: 'toSet()', detail: 'Collector — to Set' },
    { label: 'toMap', insertText: 'toMap(${1:keyMapper}, ${2:valueMapper})', detail: 'Collector — to Map' },
    { label: 'joining', insertText: 'joining(${1:delimiter})', detail: 'Collector — join strings' },
    { label: 'groupingBy', insertText: 'groupingBy(${1:classifier})', detail: 'Collector — group by key' },
    { label: 'counting', insertText: 'counting()', detail: 'Collector — count elements' },
    { label: 'partitioningBy', insertText: 'partitioningBy(${1:predicate})', detail: 'Collector' },
  ],
  System: [
    { label: 'out', insertText: 'out', detail: 'PrintStream' },
    { label: 'err', insertText: 'err', detail: 'PrintStream' },
    { label: 'in', insertText: 'in', detail: 'InputStream' },
    { label: 'currentTimeMillis', insertText: 'currentTimeMillis()', detail: 'long' },
    { label: 'nanoTime', insertText: 'nanoTime()', detail: 'long' },
    { label: 'arraycopy', insertText: 'arraycopy(${1:src}, ${2:srcPos}, ${3:dest}, ${4:destPos}, ${5:length})', detail: 'void' },
    { label: 'exit', insertText: 'exit(${1:status})', detail: 'void' },
    { label: 'lineSeparator', insertText: 'lineSeparator()', detail: 'String' },
    { label: 'gc', insertText: 'gc()', detail: 'void' },
  ],
  Comparator: [
    { label: 'comparingInt', insertText: 'comparingInt(${1:keyExtractor})', detail: 'Comparator<T>' },
    { label: 'comparingLong', insertText: 'comparingLong(${1:keyExtractor})', detail: 'Comparator<T>' },
    { label: 'comparingDouble', insertText: 'comparingDouble(${1:keyExtractor})', detail: 'Comparator<T>' },
    { label: 'comparing', insertText: 'comparing(${1:keyExtractor})', detail: 'Comparator<T>' },
    { label: 'naturalOrder', insertText: 'naturalOrder()', detail: 'Comparator<T> — ascending' },
    { label: 'reverseOrder', insertText: 'reverseOrder()', detail: 'Comparator<T> — descending' },
  ],
  Objects: [
    { label: 'equals', insertText: 'equals(${1:a}, ${2:b})', detail: 'boolean — null-safe' },
    { label: 'hash', insertText: 'hash(${1:values})', detail: 'int' },
    { label: 'hashCode', insertText: 'hashCode(${1:o})', detail: 'int' },
    { label: 'toString', insertText: 'toString(${1:o}, ${2:nullDefault})', detail: 'String' },
    { label: 'requireNonNull', insertText: 'requireNonNull(${1:obj})', detail: 'T' },
    { label: 'isNull', insertText: 'isNull(${1:obj})', detail: 'boolean' },
    { label: 'nonNull', insertText: 'nonNull(${1:obj})', detail: 'boolean' },
    { label: 'compare', insertText: 'compare(${1:a}, ${2:b}, ${3:comparator})', detail: 'int' },
  ],
  Boolean: [
    { label: 'parseBoolean', insertText: 'parseBoolean(${1:s})', detail: 'boolean' },
    { label: 'valueOf', insertText: 'valueOf(${1:s})', detail: 'Boolean' },
    { label: 'toString', insertText: 'toString(${1:b})', detail: 'String' },
    { label: 'compare', insertText: 'compare(${1:x}, ${2:y})', detail: 'int' },
    { label: 'TRUE', insertText: 'TRUE', detail: 'Boolean' },
    { label: 'FALSE', insertText: 'FALSE', detail: 'Boolean' },
  ],
  List: [
    { label: 'of', insertText: 'of(${1:elements})', detail: 'List<E> — immutable' },
    { label: 'copyOf', insertText: 'copyOf(${1:collection})', detail: 'List<E> — immutable copy' },
  ],
  Map: [
    { label: 'of', insertText: 'of(${1:k1}, ${2:v1})', detail: 'Map<K,V> — immutable' },
    { label: 'ofEntries', insertText: 'ofEntries(${1:entries})', detail: 'Map<K,V> — immutable' },
    { label: 'entry', insertText: 'entry(${1:key}, ${2:value})', detail: 'Map.Entry<K,V> — immutable entry' },
    { label: 'copyOf', insertText: 'copyOf(${1:map})', detail: 'Map<K,V> — immutable copy' },
  ],
  Set: [
    { label: 'of', insertText: 'of(${1:elements})', detail: 'Set<E> — immutable' },
    { label: 'copyOf', insertText: 'copyOf(${1:collection})', detail: 'Set<E> — immutable copy' },
  ],
  Stream: [
    { label: 'of', insertText: 'of(${1:values})', detail: 'Stream<T>' },
    { label: 'empty', insertText: 'empty()', detail: 'Stream<T>' },
    { label: 'concat', insertText: 'concat(${1:a}, ${2:b})', detail: 'Stream<T>' },
    { label: 'iterate', insertText: 'iterate(${1:seed}, ${2:hasNext}, ${3:next})', detail: 'Stream<T>' },
    { label: 'generate', insertText: 'generate(${1:supplier})', detail: 'Stream<T>' },
  ],
  IntStream: [
    { label: 'range', insertText: 'range(${1:startInclusive}, ${2:endExclusive})', detail: 'IntStream — [start, end)' },
    { label: 'rangeClosed', insertText: 'rangeClosed(${1:startInclusive}, ${2:endInclusive})', detail: 'IntStream — [start, end]' },
    { label: 'of', insertText: 'of(${1:values})', detail: 'IntStream' },
    { label: 'empty', insertText: 'empty()', detail: 'IntStream' },
    { label: 'concat', insertText: 'concat(${1:a}, ${2:b})', detail: 'IntStream' },
    { label: 'generate', insertText: 'generate(${1:supplier})', detail: 'IntStream' },
    { label: 'iterate', insertText: 'iterate(${1:seed}, ${2:hasNext}, ${3:next})', detail: 'IntStream' },
  ],
  LongStream: [
    { label: 'range', insertText: 'range(${1:startInclusive}, ${2:endExclusive})', detail: 'LongStream — [start, end)' },
    { label: 'rangeClosed', insertText: 'rangeClosed(${1:startInclusive}, ${2:endInclusive})', detail: 'LongStream — [start, end]' },
    { label: 'of', insertText: 'of(${1:values})', detail: 'LongStream' },
    { label: 'empty', insertText: 'empty()', detail: 'LongStream' },
  ],
  Optional: [
    { label: 'of', insertText: 'of(${1:value})', detail: 'Optional<T>' },
    { label: 'ofNullable', insertText: 'ofNullable(${1:value})', detail: 'Optional<T>' },
    { label: 'empty', insertText: 'empty()', detail: 'Optional<T>' },
  ],
}

// Try to resolve what type a variable is by scanning declarations in the file
function resolveType(model: editor.ITextModel, varName: string, lineContent: string): string | null {
  const text = model.getValue()

  // Exact type declarations — map regex pattern to resolved type
  const typePatterns: [RegExp, string][] = [
    [new RegExp(`(?:ArrayList)\\s*<[^>]*>\\s+${varName}\\b`), 'List'],
    [new RegExp(`(?:LinkedList)\\s*<[^>]*>\\s+${varName}\\b`), 'LinkedList'],
    [new RegExp(`(?:List)\\s*<[^>]*>\\s+${varName}\\b`), 'List'],
    [new RegExp(`(?:HashMap|LinkedHashMap)\\s*<[^>]*>\\s+${varName}\\b`), 'Map'],
    [new RegExp(`(?:TreeMap)\\s*<[^>]*>\\s+${varName}\\b`), 'TreeMap'],
    [new RegExp(`(?:Map)\\s*<[^>]*>\\s+${varName}\\b`), 'Map'],
    [new RegExp(`(?:HashSet|LinkedHashSet)\\s*<[^>]*>\\s+${varName}\\b`), 'Set'],
    [new RegExp(`(?:TreeSet)\\s*<[^>]*>\\s+${varName}\\b`), 'TreeSet'],
    [new RegExp(`(?:Set)\\s*<[^>]*>\\s+${varName}\\b`), 'Set'],
    [new RegExp(`(?:Queue|PriorityQueue)\\s*<[^>]*>\\s+${varName}\\b`), 'Queue'],
    [new RegExp(`(?:Deque|ArrayDeque|Stack)\\s*<[^>]*>\\s+${varName}\\b`), 'Deque'],
    [new RegExp(`(?:StringBuilder|StringBuffer)\\s+${varName}\\b`), 'StringBuilder'],
    [new RegExp(`(?:Optional)\\s*<[^>]*>\\s+${varName}\\b`), 'Optional'],
    [new RegExp(`String\\s+${varName}\\b`), 'String'],
    [new RegExp(`String\\[\\]\\s+${varName}\\b`), 'Array'],
    [new RegExp(`(?:int|long|double|float|char|boolean|byte|short)\\[\\]\\s+${varName}\\b`), 'Array'],
    [new RegExp(`\\w+\\[\\]\\s+${varName}\\b`), 'Array'],
    [new RegExp(`Iterator\\s*<[^>]*>\\s+${varName}\\b`), 'Iterator'],
    [new RegExp(`Map\\.Entry\\s*<[^>]*>\\s+${varName}\\b`), 'Map.Entry'],
    [new RegExp(`Comparator\\s*<[^>]*>\\s+${varName}\\b`), 'Comparator'],
  ]

  for (const [pattern, type] of typePatterns) {
    if (pattern.test(text)) return type
  }

  // Check chain context on the current line
  if (/\.stream\(\)\.\s*$/.test(lineContent)) return 'Stream'
  if (/\.mapToInt\([^)]*\)\.\s*$/.test(lineContent)) return 'IntStream'
  if (/\.mapToLong\([^)]*\)\.\s*$/.test(lineContent)) return 'LongStream'
  if (/\.mapToDouble\([^)]*\)\.\s*$/.test(lineContent)) return 'LongStream'
  if (/\.boxed\(\)\.\s*$/.test(lineContent)) return 'Stream'
  if (/\.iterator\(\)\.\s*$/.test(lineContent)) return 'Iterator'
  if (/\.getKey\b|\.getValue\b/.test(lineContent)) return 'Map.Entry'

  return null
}

// Instance methods for Comparator (for chaining like comparator.thenComparing())
const COMPARATOR_INSTANCE_METHODS: MethodDef[] = [
  { label: 'thenComparing', insertText: 'thenComparing(${1:keyExtractor})', detail: 'Comparator<T>' },
  { label: 'thenComparingInt', insertText: 'thenComparingInt(${1:keyExtractor})', detail: 'Comparator<T>' },
  { label: 'thenComparingLong', insertText: 'thenComparingLong(${1:keyExtractor})', detail: 'Comparator<T>' },
  { label: 'thenComparingDouble', insertText: 'thenComparingDouble(${1:keyExtractor})', detail: 'Comparator<T>' },
  { label: 'reversed', insertText: 'reversed()', detail: 'Comparator<T> — reverse this comparator' },
]

function getWordRange(model: editor.ITextModel, position: { lineNumber: number; column: number }): IRange {
  const word = model.getWordUntilPosition(position)
  return {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endColumn: word.endColumn,
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Auto-import: when a completion for a non-java.lang type is accepted,
// attach a TextEdit that prepends `import <fqcn>;` at the top of the file.
// java.lang types are implicit — no import needed.
// ─────────────────────────────────────────────────────────────────────────

const JAVA_TYPE_IMPORTS: Record<string, string> = {
  // java.util collections + utilities
  List: 'java.util.List',
  ArrayList: 'java.util.ArrayList',
  LinkedList: 'java.util.LinkedList',
  Map: 'java.util.Map',
  HashMap: 'java.util.HashMap',
  TreeMap: 'java.util.TreeMap',
  LinkedHashMap: 'java.util.LinkedHashMap',
  Set: 'java.util.Set',
  HashSet: 'java.util.HashSet',
  TreeSet: 'java.util.TreeSet',
  LinkedHashSet: 'java.util.LinkedHashSet',
  Queue: 'java.util.Queue',
  PriorityQueue: 'java.util.PriorityQueue',
  Deque: 'java.util.Deque',
  ArrayDeque: 'java.util.ArrayDeque',
  Stack: 'java.util.Stack',
  Vector: 'java.util.Vector',
  Arrays: 'java.util.Arrays',
  Collections: 'java.util.Collections',
  Optional: 'java.util.Optional',
  Comparator: 'java.util.Comparator',
  Iterator: 'java.util.Iterator',
  Objects: 'java.util.Objects',
  Random: 'java.util.Random',
  // java.util.stream
  Stream: 'java.util.stream.Stream',
  Collectors: 'java.util.stream.Collectors',
  IntStream: 'java.util.stream.IntStream',
  LongStream: 'java.util.stream.LongStream',
  DoubleStream: 'java.util.stream.DoubleStream',
}

// Compute a TextEdit that inserts `import <fqcn>;` at the right spot, unless
// the file already imports it (either directly or via a wildcard). Returns
// null when no edit is needed.
function buildImportEdit(
  model: editor.ITextModel,
  monaco: Monaco,
  fqcn: string,
): languages.TextEdit | null {
  const source = model.getValue()
  const pkg = fqcn.slice(0, fqcn.lastIndexOf('.'))
  const directRe = new RegExp(
    `^\\s*import\\s+${fqcn.replace(/\./g, '\\.')}\\s*;`,
    'm',
  )
  const wildcardRe = new RegExp(
    `^\\s*import\\s+${pkg.replace(/\./g, '\\.')}\\.\\*\\s*;`,
    'm',
  )
  if (directRe.test(source) || wildcardRe.test(source)) return null

  // Find insertion line: after the last existing import, or after a package
  // declaration, or line 1.
  const lines = source.split('\n')
  let insertLine = 1
  let hasExistingImport = false
  for (let i = 0; i < lines.length; i += 1) {
    const ln = lines[i].trim()
    if (ln.startsWith('package ')) {
      insertLine = i + 2 // after the package line (1-indexed + blank line)
    }
    if (ln.startsWith('import ')) {
      insertLine = i + 2 // after this import
      hasExistingImport = true
    }
    if (ln.startsWith('class ') || ln.startsWith('public class ')) break
  }

  const textToInsert = hasExistingImport
    ? `import ${fqcn};\n`
    : `import ${fqcn};\n\n`

  return {
    range: new monaco.Range(insertLine, 1, insertLine, 1),
    text: textToInsert,
  }
}

// Collect every non-java.lang type referenced inside a snippet's insertText
// so we can attach the right set of import edits when the snippet is picked.
function collectSnippetImports(insertText: string): string[] {
  const imports: string[] = []
  for (const [typeName, fqcn] of Object.entries(JAVA_TYPE_IMPORTS)) {
    const re = new RegExp(`\\b${typeName}\\b`)
    if (re.test(insertText)) imports.push(fqcn)
  }
  return imports
}

export function registerJavaCompletions(monaco: Monaco): void {
  // Keywords, types, and snippets
  monaco.languages.registerCompletionItemProvider('java', {
    provideCompletionItems(model, position) {
      const range = getWordRange(model, position)

      const keywordSuggestions: languages.CompletionItem[] = JAVA_KEYWORDS.map((kw) => ({
        label: kw,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: kw,
        range,
      }))

      const typeSuggestions: languages.CompletionItem[] = JAVA_TYPES.map((type) => {
        const fqcn = JAVA_TYPE_IMPORTS[type]
        const importEdit = fqcn ? buildImportEdit(model, monaco, fqcn) : null
        return {
          label: type,
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: type,
          detail: fqcn ? `Java type · ${fqcn}` : 'Java type',
          range,
          additionalTextEdits: importEdit ? [importEdit] : undefined,
        }
      })

      const snippetSuggestions: languages.CompletionItem[] = JAVA_SNIPPETS.map((s) => {
        const imports = collectSnippetImports(s.insertText)
        const edits = imports
          .map((fqcn) => buildImportEdit(model, monaco, fqcn))
          .filter((e): e is languages.TextEdit => e !== null)
        return {
          label: s.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: s.insertText,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: s.detail,
          range,
          additionalTextEdits: edits.length > 0 ? edits : undefined,
        }
      })

      return {
        suggestions: [...keywordSuggestions, ...typeSuggestions, ...snippetSuggestions],
      }
    },
  })

  // Dot-triggered method completions
  monaco.languages.registerCompletionItemProvider('java', {
    triggerCharacters: ['.'],
    provideCompletionItems(model, position) {
      const lineContent = model.getLineContent(position.lineNumber)
      const textBeforeCursor = lineContent.substring(0, position.column - 1)

      const range = getWordRange(model, position)
      let methods: MethodDef[] = []

      // Handle chained calls like "System.out." or "Map.Entry."
      const chainMatch = textBeforeCursor.match(/(\w+)\.(\w+)\.\s*$/)
      if (chainMatch) {
        const parent = chainMatch[1]
        const child = chainMatch[2]

        // System.out. → PrintStream methods
        if (parent === 'System' && (child === 'out' || child === 'err')) {
          methods = INSTANCE_METHODS['PrintStream'] ?? []
        }
        // Map.Entry. used as static context (rare but valid)
        if (parent === 'Map' && child === 'Entry') {
          methods = INSTANCE_METHODS['Map.Entry'] ?? []
        }
      }

      // Simple "something." pattern
      let staticHostForImport: string | null = null
      if (methods.length === 0) {
        const dotMatch = textBeforeCursor.match(/(\w+)\.\s*$/)
        if (!dotMatch) return { suggestions: [] }

        const prefix = dotMatch[1]

        // Check static methods first (starts with uppercase)
        if (prefix[0] === prefix[0].toUpperCase() && STATIC_METHODS[prefix]) {
          methods = STATIC_METHODS[prefix]
          // If the class is importable (e.g., Arrays, Collections, Objects),
          // attach the import edit so accepting the method also adds it.
          if (JAVA_TYPE_IMPORTS[prefix]) staticHostForImport = prefix
        }

        // Check if it's a variable — try to resolve its type
        if (methods.length === 0) {
          const resolvedType = resolveType(model, prefix, textBeforeCursor)
          if (resolvedType) {
            // Comparator instances get chaining methods
            if (resolvedType === 'Comparator') {
              methods = COMPARATOR_INSTANCE_METHODS
            } else {
              const canonical = TYPE_ALIASES[resolvedType] ?? resolvedType
              methods = INSTANCE_METHODS[canonical] ?? []
            }
          }
        }

        // Fallback: check if the prefix itself is a known instance type
        if (methods.length === 0) {
          const canonical = TYPE_ALIASES[prefix] ?? prefix
          if (INSTANCE_METHODS[canonical]) {
            methods = INSTANCE_METHODS[canonical]
          }
        }
      }

      const importEdit = staticHostForImport
        ? buildImportEdit(model, monaco, JAVA_TYPE_IMPORTS[staticHostForImport])
        : null

      // Deduplicate by label+detail (overloads have different details)
      const seen = new Set<string>()
      const suggestions: languages.CompletionItem[] = []

      for (const m of methods) {
        const key = `${m.label}__${m.detail}`
        if (seen.has(key)) continue
        seen.add(key)

        suggestions.push({
          label: { label: m.label, detail: `  ${m.detail}`, description: m.documentation },
          kind: m.insertText.includes('(')
            ? monaco.languages.CompletionItemKind.Method
            : monaco.languages.CompletionItemKind.Field,
          insertText: m.insertText,
          insertTextRules: m.insertText.includes('${')
            ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            : undefined,
          range,
          sortText: `0_${m.label}`,
          additionalTextEdits: importEdit ? [importEdit] : undefined,
        })
      }

      return { suggestions }
    },
  })
}
