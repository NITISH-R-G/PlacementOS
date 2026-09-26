import { DiagnosticQuestion } from '../types'

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'diag-dsa-1',
    dimension: 'dsa',
    prompt: 'What is the time complexity of searching for an element in a balanced Binary Search Tree (AVL or Red-Black Tree) with N nodes in the worst case?',
    options: [
      { id: 'opt-a', text: 'O(1)' },
      { id: 'opt-b', text: 'O(log N)' },
      { id: 'opt-c', text: 'O(N)' },
      { id: 'opt-d', text: 'O(N log N)' },
    ],
    correctOptionId: 'opt-b',
    explanation: 'A balanced BST guarantees height logarithmic in N (h <= 2 * log2(N+1)), keeping traversal and search bound to O(log N).',
    difficulty: 'beginner',
  },
  {
    id: 'diag-dsa-2',
    dimension: 'dsa',
    prompt: 'Given an array of size N, which data structure provides O(1) average lookup and O(1) average insertion for key-value pairs?',
    options: [
      { id: 'opt-a', text: 'Binary Search Tree' },
      { id: 'opt-b', text: 'Hash Map (Hash Table)' },
      { id: 'opt-c', text: 'Priority Queue (Heap)' },
      { id: 'opt-d', text: 'Trie' },
    ],
    correctOptionId: 'opt-b',
    explanation: 'Hash Maps use hash functions with bucket indexing to achieve amortized O(1) insertion, deletion, and lookup.',
    difficulty: 'beginner',
  },
  {
    id: 'diag-cs-1',
    dimension: 'cs_fundamentals',
    prompt: 'Which of the following conditions is NOT one of Coffman’s four necessary conditions for a deadlock to occur in an operating system?',
    options: [
      { id: 'opt-a', text: 'Mutual Exclusion' },
      { id: 'opt-b', text: 'Hold and Wait' },
      { id: 'opt-c', text: 'Preemptive Scheduling' },
      { id: 'opt-d', text: 'Circular Wait' },
    ],
    correctOptionId: 'opt-c',
    explanation: 'The four Coffman conditions are Mutual Exclusion, Hold and Wait, No Preemption (NOT preemptive scheduling), and Circular Wait.',
    difficulty: 'intermediate',
  },
  {
    id: 'diag-sql-1',
    dimension: 'sql',
    prompt: 'Which SQL clause is used to filter aggregated data resulting from a GROUP BY statement?',
    options: [
      { id: 'opt-a', text: 'WHERE' },
      { id: 'opt-b', text: 'HAVING' },
      { id: 'opt-c', text: 'LIMIT' },
      { id: 'opt-d', text: 'FILTER' },
    ],
    correctOptionId: 'opt-b',
    explanation: 'WHERE filters individual records before aggregation; HAVING evaluates filter predicates on the grouped aggregate results.',
    difficulty: 'beginner',
  },
  {
    id: 'diag-prog-1',
    dimension: 'programming',
    prompt: 'In Object-Oriented Design (SOLID), what does the "L" (Liskov Substitution Principle) state?',
    options: [
      { id: 'opt-a', text: 'Classes should be open for extension, but closed for modification.' },
      { id: 'opt-b', text: 'Subtypes must be substitutable for their base types without altering program correctness.' },
      { id: 'opt-c', text: 'Depend upon abstractions, not concrete implementations.' },
      { id: 'opt-d', text: 'Clients should not be forced to depend on interfaces they do not use.' },
    ],
    correctOptionId: 'opt-b',
    explanation: 'LSP ensures derived subclasses conform to behavioral contracts assumed by callers of the parent class.',
    difficulty: 'intermediate',
  },
]
