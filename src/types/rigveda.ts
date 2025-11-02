/**
 * Comprehensive Rigveda Data Model
 *
 * Multi-layered data structure for deep exploration of Rigvedic hymns,
 * supporting textual, philosophical, historical, and spiritual dimensions.
 */

/**
 * Core hymn structure with complete metadata and content
 */
export interface RigvedaHymn {
  // Basic identification
  id: string;
  mandala: number;
  sukta: number;
  rishi: string; // Seer who received the hymn
  devata: string; // Deity addressed
  chhandas: string; // Meter (Gayatri, Trishtubh, etc.)

  // Content layers
  verses: Verse[];

  // Context and interpretation
  historicalContext: string;
  philosophicalThemes: string[];
  symbolism: Symbolism[];

  // Cross-references
  relatedHymns: string[]; // IDs of related hymns
  relatedConcepts: string[]; // Philosophical concepts
  relatedDeities: string[]; // Other deities mentioned

  // Scholarly resources
  commentaries: Commentary[];
  scholarlyNotes: ScholarlyNote[];
  audioRecitation?: AudioResource;

  // Learning aids
  keyTerms: KeyTerm[];
  discussionQuestions: string[];
  practicalApplications: string[];

  // Metadata
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedStudyTime: number; // minutes
  tags: string[];
}

/**
 * Individual verse with multiple layers of meaning
 */
export interface Verse {
  number: number;
  sanskrit: string;
  transliteration: string;
  wordByWord: WordMeaning[];
  translation: Translation[];
  commentary: string;
}

/**
 * Word-level analysis for deep understanding
 */
export interface WordMeaning {
  sanskrit: string;
  transliteration: string;
  meaning: string;
  grammaticalInfo?: string;
  etymology?: string;
}

/**
 * Translation from various scholars and traditions
 */
export interface Translation {
  translator: string; // Griffith, Max Müller, etc.
  text: string;
  year?: number;
  interpretation?: 'literal' | 'poetic' | 'esoteric';
}

/**
 * Multi-level symbolic interpretation
 */
export interface Symbolism {
  symbol: string;
  levels: {
    literal: string;
    metaphorical: string;
    spiritual: string;
    psychological: string;
  };
}

/**
 * Traditional and modern commentaries
 */
export interface Commentary {
  author: string; // Sayana, modern scholars, etc.
  text: string;
  tradition: string; // Vedantic, Mimamsa, modern, etc.
  focus: string; // ritual, philosophical, linguistic
}

/**
 * Scholarly annotations and research notes
 */
export interface ScholarlyNote {
  topic: string;
  content: string;
  sources: string[];
  relevance: string;
}

/**
 * Important Vedic terms and concepts
 */
export interface KeyTerm {
  term: string;
  sanskrit: string;
  definition: string;
  firstAppearance?: string; // Where in Rigveda
  relatedTerms: string[];
}

/**
 * Audio recitation resources
 */
export interface AudioResource {
  url: string;
  reciter: string;
  duration: number;
  tradition: string; // Which Vedic chanting tradition
}

/**
 * Simplified hymn structure for backward compatibility
 * Used for daily reading and basic display
 */
export interface SimpleHymn {
  id: number;
  mandala: number;
  sukta: number;
  title: string;
  content: string;
  translation: string;
  theme: string;
  rishi?: string;
  devata?: string;
}

/**
 * Nakshatra-specific hymn selection
 */
export interface NakshatraHymnSet {
  nakshatra: number; // 1-27
  nakshatraName: string;
  primaryHymn: string; // Hymn ID
  alternateHymns: string[];
  theme: string;
  seasonalRelevance?: string;
}

/**
 * Tithi-specific hymn themes
 */
export interface TithiHymnTheme {
  tithi: number; // 1-30
  tithiName: string;
  recommendedThemes: string[];
  lunarPhaseSignificance: string;
}

/**
 * Paksha-specific practices
 */
export interface PakshaGuidance {
  paksha: 'shukla' | 'krishna';
  energyQuality: string;
  recommendedPractices: string[];
  hymnTypes: string[];
}

/**
 * Search and filter criteria
 */
export interface HymnSearchCriteria {
  mandala?: number[];
  deity?: string[];
  theme?: string[];
  difficulty?: ('beginner' | 'intermediate' | 'advanced')[];
  tags?: string[];
  fullTextSearch?: string;
}

/**
 * Study progress tracking
 */
export interface StudyProgress {
  hymnId: string;
  userId?: string;
  startedDate: Date;
  completedDate?: Date;
  timeSpent: number; // minutes
  notesCount: number;
  comprehensionLevel: 1 | 2 | 3 | 4 | 5;
  bookmarked: boolean;
  personalNotes?: string;
}

/**
 * Collection/playlist of hymns
 */
export interface HymnCollection {
  id: string;
  name: string;
  description: string;
  hymnIds: string[];
  creator: string;
  tags: string[];
  isPublic: boolean;
  purpose: string; // daily practice, study group, specific theme, etc.
}

/**
 * Deity information
 */
export interface Deity {
  name: string;
  sanskritName: string;
  category: 'natural' | 'abstract' | 'cosmic' | 'terrestrial';
  attributes: string[];
  symbolism: string;
  associatedHymns: string[];
  iconography?: string;
  mantras?: string[];
}

/**
 * Rishi (seer) information
 */
export interface Rishi {
  name: string;
  sanskritName: string;
  family?: string; // Angirasa, Bhrigu, etc.
  period?: string; // Early, Middle, Late Rigvedic
  hymnComposed: string[];
  specialization?: string; // Types of hymns or deities
  legendaryStories?: string[];
}

/**
 * Meter (Chhandas) information
 */
export interface Chhandas {
  name: string;
  sanskritName: string;
  syllablesPerLine: number;
  linesPerVerse: number;
  pattern: string;
  characteristics: string;
  usageContext: string;
  examples: string[]; // Hymn IDs
}

/**
 * Philosophical concept from Rigveda
 */
export interface VedicConcept {
  name: string;
  sanskritTerm: string;
  definition: string;
  evolution: string; // How concept evolved through Rigveda
  relatedConcepts: string[];
  keyHymns: string[];
  modernRelevance: string;
  practicalApplication: string;
}

/**
 * Daily reading recommendation
 */
export interface DailyReading {
  date: Date;
  nakshatra: number;
  tithi: number;
  paksha: 'shukla' | 'krishna';
  recommendedHymn: string;
  alternateHymns: string[];
  contextualGuidance: string;
  reflectionPrompt: string;
}
