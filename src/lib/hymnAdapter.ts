/**
 * Hymn Data Adapter
 *
 * Provides utilities to convert between simple and expanded hymn formats,
 * and helper functions for working with hymn data across the application.
 */

import type { RigvedaHymn, SimpleHymn } from '../types/rigveda';

/**
 * Convert expanded hymn to simple format for backward compatibility
 */
export function toSimpleHymn(expandedHymn: RigvedaHymn): SimpleHymn {
  // Extract numeric ID from string ID (e.g., "rv-1-1" -> 101)
  const numericId = expandedHymn.mandala * 100 + expandedHymn.sukta;

  // Combine first verse translations for simple content
  const firstVerse = expandedHymn.verses[0];
  const primaryTranslation = firstVerse?.translation[0]?.text || '';

  // Create title from deity and rishi
  const title = `${expandedHymn.devata} - ${expandedHymn.rishi}`;

  // Use first philosophical theme as main theme
  const theme = expandedHymn.philosophicalThemes[0] || expandedHymn.tags[0] || 'Vedic Wisdom';

  return {
    id: numericId,
    mandala: expandedHymn.mandala,
    sukta: expandedHymn.sukta,
    title,
    content: firstVerse?.sanskrit || '',
    translation: primaryTranslation,
    theme,
    rishi: expandedHymn.rishi,
    devata: expandedHymn.devata,
  };
}

/**
 * Get summary text from expanded hymn (for previews)
 */
export function getHymnSummary(hymn: RigvedaHymn, maxLength: number = 200): string {
  const context = hymn.historicalContext;
  if (context.length <= maxLength) return context;
  return context.substring(0, maxLength - 3) + '...';
}

/**
 * Get all translations for a specific verse
 */
export function getVerseTranslations(hymn: RigvedaHymn, verseNumber: number) {
  const verse = hymn.verses.find((v) => v.number === verseNumber);
  return verse?.translation || [];
}

/**
 * Get primary translation (first available) for a verse
 */
export function getPrimaryTranslation(hymn: RigvedaHymn, verseNumber: number): string {
  const translations = getVerseTranslations(hymn, verseNumber);
  return translations[0]?.text || '';
}

/**
 * Get all commentaries by a specific tradition
 */
export function getCommentariesByTradition(hymn: RigvedaHymn, tradition: string) {
  return hymn.commentaries.filter((c) => c.tradition.toLowerCase().includes(tradition.toLowerCase()));
}

/**
 * Get key terms mentioned in a specific verse
 */
export function getVerseKeyTerms(hymn: RigvedaHymn, verseNumber: number) {
  const verse = hymn.verses.find((v) => v.number === verseNumber);
  if (!verse) return [];

  // Find key terms that appear in the verse
  return hymn.keyTerms.filter((term) => {
    const sanskritLower = verse.sanskrit.toLowerCase();
    const termLower = term.sanskrit.toLowerCase();
    return sanskritLower.includes(termLower);
  });
}

/**
 * Calculate reading time based on verses and difficulty
 */
export function calculateReadingTime(hymn: RigvedaHymn): number {
  const baseTimePerVerse = 3; // minutes
  const difficultyMultiplier = {
    beginner: 1,
    intermediate: 1.5,
    advanced: 2,
  };

  const verseTime = hymn.verses.length * baseTimePerVerse;
  const adjustedTime = verseTime * difficultyMultiplier[hymn.difficulty];

  return Math.ceil(adjustedTime);
}

/**
 * Get formatted hymn reference (e.g., "RV 1.1")
 */
export function getHymnReference(hymn: RigvedaHymn | SimpleHymn): string {
  return `RV ${hymn.mandala}.${hymn.sukta}`;
}

/**
 * Get formatted hymn title with reference
 */
export function getFullHymnTitle(hymn: RigvedaHymn): string {
  return `${getHymnReference(hymn)} - ${hymn.devata} (${hymn.rishi})`;
}

/**
 * Extract all unique deities from a collection of hymns
 */
export function extractDeities(hymns: RigvedaHymn[]): string[] {
  const deities = new Set<string>();
  hymns.forEach((hymn) => {
    deities.add(hymn.devata);
    hymn.relatedDeities.forEach((d) => deities.add(d));
  });
  return Array.from(deities).sort();
}

/**
 * Extract all unique philosophical themes
 */
export function extractThemes(hymns: RigvedaHymn[]): string[] {
  const themes = new Set<string>();
  hymns.forEach((hymn) => {
    hymn.philosophicalThemes.forEach((t) => themes.add(t));
  });
  return Array.from(themes).sort();
}

/**
 * Extract all unique rishis (seers)
 */
export function extractRishis(hymns: RigvedaHymn[]): string[] {
  const rishis = new Set<string>();
  hymns.forEach((hymn) => rishis.add(hymn.rishi));
  return Array.from(rishis).sort();
}

/**
 * Filter hymns by difficulty level
 */
export function getHymnsByDifficulty(
  hymns: RigvedaHymn[],
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): RigvedaHymn[] {
  return hymns.filter((h) => h.difficulty === difficulty);
}

/**
 * Get hymns suitable for daily practice (beginner/intermediate, shorter)
 */
export function getDailyPracticeHymns(hymns: RigvedaHymn[]): RigvedaHymn[] {
  return hymns.filter(
    (h) => (h.difficulty === 'beginner' || h.difficulty === 'intermediate') && h.verses.length <= 10
  );
}

/**
 * Get hymns for deep study (advanced, comprehensive)
 */
export function getDeepStudyHymns(hymns: RigvedaHymn[]): RigvedaHymn[] {
  return hymns.filter((h) => h.difficulty === 'advanced' || h.commentaries.length >= 2);
}

/**
 * Get related hymns by ID
 */
export function getRelatedHymns(hymn: RigvedaHymn, allHymns: RigvedaHymn[]): RigvedaHymn[] {
  return allHymns.filter((h) => hymn.relatedHymns.includes(h.id));
}

/**
 * Get hymns by deity
 */
export function getHymnsByDeity(hymns: RigvedaHymn[], deity: string): RigvedaHymn[] {
  return hymns.filter((h) => h.devata === deity || h.relatedDeities.includes(deity));
}

/**
 * Get hymns by theme
 */
export function getHymnsByTheme(hymns: RigvedaHymn[], theme: string): RigvedaHymn[] {
  return hymns.filter((h) => h.philosophicalThemes.includes(theme));
}

/**
 * Get hymns by tag
 */
export function getHymnsByTag(hymns: RigvedaHymn[], tag: string): RigvedaHymn[] {
  return hymns.filter((h) => h.tags.includes(tag));
}

/**
 * Get hymns by meter (chhandas)
 */
export function getHymnsByMeter(hymns: RigvedaHymn[], meter: string): RigvedaHymn[] {
  return hymns.filter((h) => h.chhandas === meter);
}

/**
 * Full-text search across hymn content
 */
export function searchHymns(hymns: RigvedaHymn[], searchTerm: string): RigvedaHymn[] {
  const term = searchTerm.toLowerCase();

  return hymns.filter((hymn) => {
    // Search in basic fields
    if (hymn.devata.toLowerCase().includes(term)) return true;
    if (hymn.rishi.toLowerCase().includes(term)) return true;
    if (hymn.historicalContext.toLowerCase().includes(term)) return true;

    // Search in themes and tags
    if (hymn.philosophicalThemes.some((t) => t.toLowerCase().includes(term))) return true;
    if (hymn.tags.some((t) => t.toLowerCase().includes(term))) return true;

    // Search in verses
    if (
      hymn.verses.some(
        (v) =>
          v.sanskrit.includes(term) ||
          v.transliteration.toLowerCase().includes(term) ||
          v.translation.some((t) => t.text.toLowerCase().includes(term))
      )
    )
      return true;

    // Search in key terms
    if (hymn.keyTerms.some((kt) => kt.term.toLowerCase().includes(term) || kt.sanskrit.includes(term)))
      return true;

    return false;
  });
}

/**
 * Generate a study plan for a hymn based on difficulty
 */
export function generateStudyPlan(hymn: RigvedaHymn): string[] {
  const plan: string[] = [];

  plan.push('1. Read the historical context and understand the hymn\'s place in Rigveda');
  plan.push('2. Study the meaning of key terms and concepts');

  if (hymn.difficulty === 'beginner') {
    plan.push('3. Read one translation carefully, focusing on the overall message');
    plan.push('4. Reflect on one discussion question');
  } else if (hymn.difficulty === 'intermediate') {
    plan.push('3. Compare 2-3 different translations to understand nuances');
    plan.push('4. Study the word-by-word meanings of important verses');
    plan.push('5. Explore the symbolism at different levels');
    plan.push('6. Reflect on 2-3 discussion questions');
  } else {
    plan.push('3. Compare all available translations noting differences in interpretation');
    plan.push('4. Study word-by-word analysis of each verse');
    plan.push('5. Read all commentaries and scholarly notes');
    plan.push('6. Deeply explore multi-level symbolism');
    plan.push('7. Study related hymns for broader context');
    plan.push('8. Reflect on all discussion questions');
  }

  plan.push(`${plan.length + 1}. Choose one practical application to implement in daily life`);

  if (hymn.audioRecitation) {
    plan.push(`${plan.length + 1}. Listen to and practice the audio recitation`);
  }

  return plan;
}

/**
 * Get completion status text
 */
export function getCompletionStatusText(hymn: RigvedaHymn, timeSpent: number): string {
  const estimatedTime = hymn.estimatedStudyTime;
  const percentage = Math.min(100, Math.round((timeSpent / estimatedTime) * 100));

  if (percentage < 25) return 'Just getting started';
  if (percentage < 50) return 'Making progress';
  if (percentage < 75) return 'Well underway';
  if (percentage < 100) return 'Nearly complete';
  return 'Completed';
}

/**
 * Recommend next hymn based on current hymn
 */
export function recommendNextHymn(currentHymn: RigvedaHymn, allHymns: RigvedaHymn[]): RigvedaHymn | null {
  // First, try related hymns
  const related = getRelatedHymns(currentHymn, allHymns);
  if (related.length > 0) return related[0];

  // Next, try same deity
  const sameDeity = getHymnsByDeity(allHymns, currentHymn.devata).filter((h) => h.id !== currentHymn.id);
  if (sameDeity.length > 0) return sameDeity[0];

  // Finally, try same difficulty level
  const sameDifficulty = getHymnsByDifficulty(allHymns, currentHymn.difficulty).filter(
    (h) => h.id !== currentHymn.id
  );
  if (sameDifficulty.length > 0) return sameDifficulty[0];

  return null;
}
