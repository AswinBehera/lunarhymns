/**
 * Journal Types
 *
 * Comprehensive journaling system for Vedic study and spiritual practice.
 */

export interface JournalEntry {
  /** Unique identifier */
  id: string;

  /** Entry creation date */
  date: Date;

  /** Vedic calendar context */
  tithi: string;
  nakshatra: string;
  paksha?: string; // Shukla (waxing) or Krishna (waning)

  // Content
  /** Main journal content */
  content: string;

  // Context
  /** Hymn being studied (e.g., "rv-1-1") */
  hymnStudied?: string;
  /** Specific verses reflected on */
  verses?: number[];

  // Structured reflections
  /** Key insights from today's study */
  insights: string[];
  /** Questions that arose */
  questions: string[];
  /** Practical applications - how you're applying the teaching */
  applications: string[];

  // Emotional/spiritual tracking
  /** Mood/emotional state */
  mood?: Mood;
  /** Mental clarity (1-5) */
  clarityRating?: number;
  /** Connection to the teaching (1-5) */
  connectionRating?: number;

  // Connections
  /** IDs of related journal entries */
  relatedEntries?: string[];
  /** Tags for organization */
  tags: string[];

  // Metadata
  /** Word count */
  wordCount: number;
  /** Last edit timestamp */
  editedAt?: Date;
  /** Mark as favorite */
  favorite: boolean;
  /** Draft status */
  isDraft: boolean;
}

export type Mood =
  | 'peaceful'
  | 'joyful'
  | 'contemplative'
  | 'confused'
  | 'inspired'
  | 'restless'
  | 'grateful'
  | 'seeking';

export interface JournalStats {
  /** Total number of entries */
  totalEntries: number;
  /** Number of hymns studied with journal entries */
  hymnsStudied: number;
  /** Current streak of consecutive days with entries */
  currentStreak: number;
  /** Longest streak ever */
  longestStreak: number;
  /** Total words written */
  totalWords: number;
  /** Average clarity rating */
  averageClarity: number;
  /** Average connection rating */
  averageConnection: number;
  /** Most common tags */
  topTags: { tag: string; count: number }[];
  /** Entries by month */
  entriesByMonth: { [month: string]: number };
}

export interface JournalFilter {
  /** Filter by date range */
  dateRange?: {
    start: Date;
    end: Date;
  };
  /** Filter by hymn/mandala */
  hymn?: string;
  mandala?: number;
  /** Filter by tags */
  tags?: string[];
  /** Filter by mood */
  mood?: Mood;
  /** Filter by ratings */
  minClarity?: number;
  minConnection?: number;
  /** Text search */
  searchText?: string;
  /** Show only favorites */
  favoritesOnly?: boolean;
  /** Show drafts or published */
  showDrafts?: boolean;
}

export interface JournalDayEntry {
  /** Date of the entry */
  date: Date;
  /** Tithi for that date */
  tithi: string;
  /** Has journal entry */
  hasEntry: boolean;
  /** Has hymn study */
  hasHymnStudy: boolean;
  /** Entry ID if exists */
  entryId?: string;
  /** Entry type indicator */
  entryType: 'none' | 'journal-only' | 'hymn-only' | 'both';
}

export interface CalendarMonth {
  /** Month name */
  month: string;
  /** Year */
  year: number;
  /** Days in the month */
  days: JournalDayEntry[];
}

/**
 * Journal draft for auto-save
 */
export interface JournalDraft {
  /** Associated entry ID (if editing existing) */
  entryId?: string;
  /** Draft content */
  content: string;
  /** Draft insights */
  insights: string[];
  /** Draft questions */
  questions: string[];
  /** Draft applications */
  applications: string[];
  /** Last saved time */
  savedAt: Date;
}
